import {Body, Controller, Get} from '@nestjs/common';
import { AuthService } from "./auth.service";
import {RegisterResponse} from "../models/http/response/registerResponse";
import {RegisterRequest} from "../models/http/request/registerRequest";

@Controller("api/auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get("register")
	async register(@Body() data: RegisterRequest): Promise<RegisterResponse> {
		return this.authService.register();
	}
}
