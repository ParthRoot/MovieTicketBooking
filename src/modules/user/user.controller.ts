import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import {
  LoginRequestDto,
  SignUpRequestDto,
  VerifyEmailRequestDto,
} from "./dto/request";
import { BaseResponseDto } from "@core/dto";
import { messages } from "@core/utils";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async signUp(@Body() signUpRequestDto: SignUpRequestDto) {
    const result = await this.userService.signUp(signUpRequestDto);
    return new BaseResponseDto(messages.userSignUp, result);
  }

  @Post("/verify-email")
  async verifyEmail(@Body() verifyEmailRequestDto: VerifyEmailRequestDto) {
    const result = await this.userService.verifyEmail(verifyEmailRequestDto);
    return new BaseResponseDto("", result);
  }

  @Post("/login")
  async login(@Body() loginRequestDto: LoginRequestDto) {
    const result = await this.userService.login(loginRequestDto);
    return new BaseResponseDto(messages.loginSuccessfully, result);
  }
}
