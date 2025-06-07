export class PreSignUrlResponseDto {
    pre_sign_url: string;

    constructor(data: string) {
        this.pre_sign_url = data;
    }
}
