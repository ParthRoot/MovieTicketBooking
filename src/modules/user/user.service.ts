import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { RoleRepository, UserRepository } from "src/core/database/repository";
import {
  LoginRequestDto,
  SignUpRequestDto,
  VerifyEmailRequestDto,
} from "./dto/request";
import {
  comparePassword,
  generateSaltAndHash,
  IVerifyEmailAndForgotPasswordTokenPayload,
  jwtRefreshSign,
  jwtSign,
  jwtSignForEmailVerificationAndForgotPassword,
  messages,
  tokeVerifyForEmailVerificationAndForgotPassword,
} from "@core/utils";
import { Role, User } from "@core/database";
import {
  ForgotPasswordResponseDto,
  LoginResponseDto,
  SignUpResponseDto,
} from "./dto/response";
const { DateTime } = require("luxon");

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly roleRepo: RoleRepository
  ) {}

  /**
   * it will get the role details from the role entity
   * @param roleId: string
   * @returns Promise<Role>
   */
  async findRoleByRoleId(roleId: string): Promise<Role> {
    const role = await this.roleRepo.findRoleByRoleId(roleId);

    if (!role) {
      throw new NotFoundException(messages?.roleNotFound);
    }

    return role;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException(messages.userNotFound);
    } else if (!user.is_active) {
      throw new NotFoundException(messages.userNotActive);
    } else if (!user.is_verified) {
      throw new NotFoundException(messages.notVerifyUser);
    }

    return user;
  }

  /**
   * it will register new user
   * @param signUpRequestDto: SignUpRequestDto
   * @returns Promise<SignUpResponseDto>
   */
  async signUp(signUpRequestDto: SignUpRequestDto): Promise<SignUpResponseDto> {
    const {
      email,
      password,
      first_name,
      last_name,
      role_id,
      mobile_no,
      avatar,
    } = signUpRequestDto;

    const emailAvail = await this.userRepo.findUserByEmail(email);

    if (emailAvail) {
      throw new ConflictException(messages?.emailAlreadyExists);
    }

    const role = await this.findRoleByRoleId(role_id);

    const passHash = await generateSaltAndHash(password);

    const user = this.userRepo.create();

    user.email = email;
    user.password_hash = passHash?.passwordHash;
    user.salt = passHash?.salt;
    user.first_name = first_name;
    user.last_name = last_name;
    user.phone = mobile_no;
    user.avatar = avatar;
    user.role = role;

    const saveUser = await this.userRepo.saveUser(user);

    await this.generateNewToken(user);

    return new SignUpResponseDto(saveUser);
  }

  /**
   * it will generate new token and return it
   * @param user: User
   * @returns Promise<string>
   */
  async generateNewToken(user: User): Promise<string> {
    const newJWTToken = jwtSignForEmailVerificationAndForgotPassword({
      email: user?.email,
      userId: user?.user_id,
    });

    const expiry = DateTime.now().plus({ seconds: 86400 }).toJSDate();

    await this.userRepo.updateJwtToken(user, newJWTToken, expiry);

    return newJWTToken;
  }

  /**
   * it will check the user status it's verify active etc..
   * @param userId: string
   * @returns Promise<User>
   */
  async checkUserStatus(userId: string): Promise<User> {
    const user = await this.userRepo.findUserByUserId(userId);

    if (!user) {
      throw new ForbiddenException(messages.userNotFound);
    } else if (!user?.is_active) {
      throw new ForbiddenException(messages?.userNotActive);
    } else if (user?.is_verified) {
      throw new ForbiddenException(messages?.userVerified);
    }

    return user;
  }

  /**
   * it will find user by token
   * @param token: string
   * @returns Promise<User>
   */
  async findUserByToken(token: string): Promise<User> {
    const result = await this.userRepo.findUserByToken(token);

    if (!result) {
      throw new UnauthorizedException(messages.invalidToken);
    }

    return result;
  }

  /**
   * it will use for verify email
   * @param verifyEmailRequestDto: VerifyEmailRequestDto
   * @returns Promise<ForgotPasswordResponseDto>
   */
  async verifyEmail(
    verifyEmailRequestDto: VerifyEmailRequestDto
  ): Promise<ForgotPasswordResponseDto> {
    await this.checkUserStatus(verifyEmailRequestDto?.user_id);
    await this.findUserByToken(verifyEmailRequestDto?.token);

    const verifyToken = tokeVerifyForEmailVerificationAndForgotPassword(
      verifyEmailRequestDto?.token
    ) as IVerifyEmailAndForgotPasswordTokenPayload;

    const userExist = await this.userRepo.findUserByUserId(verifyToken?.userId);

    if (!userExist) {
      throw new NotFoundException(messages.userNotFound);
    }

    if (
      userExist.reset_password_expires_at != null &&
      DateTime.fromJSDate(userExist.reset_password_expires_at) < DateTime.now()
    ) {
      throw new BadRequestException(messages.tokenExpires);
    }

    await this.userRepo.updateUserVerificationStatus(userExist);

    return new ForgotPasswordResponseDto({
      user_id: userExist?.user_id,
      email: userExist?.email,
    });
  }

  async login(loginRequestDto: LoginRequestDto) {
    const getUser = await this.findUserByEmail(loginRequestDto?.email);

    const checkPassword = await comparePassword(
      loginRequestDto.password,
      getUser?.password_hash
    );

    if (!checkPassword) {
      throw new UnauthorizedException(messages.invalidCredentials);
    }

    // need to short the
    const token = jwtSign({
      userId: getUser?.user_id,
      email: getUser?.email,
      role: getUser?.role?.role_name,
    });

    // generate jwt refresh token
    const refreshToken = jwtRefreshSign({
      userId: getUser?.user_id,
      email: getUser?.email,
      role: getUser?.role?.role_name,
    });

    return new LoginResponseDto(getUser, token, refreshToken);
  }
}
