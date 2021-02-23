import { IsString } from "class-validator";

export class RegisterRequest {
	@IsString()
	userName: string;

	@IsString()
	password: string;
}
