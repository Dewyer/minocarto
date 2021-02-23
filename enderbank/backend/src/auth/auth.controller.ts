import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthorizingResponse} from "../models/http/response/authorizingResponse";
import {RegisterRequest} from "../models/http/request/registerRequest";
import {LoginRequest} from "../models/http/request/loginRequest";
import {AuthenticatedRequest} from "../models/http/request/authenticatedRequest";
import {JwtAuthGuard} from "./guard";

@Controller("api/auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {
	}

	@Post("register")
	async register(@Body() data: RegisterRequest): Promise<AuthorizingResponse> {
		return this.authService.register(data);
	}

	@Post("login")
	async login(@Body() data: LoginRequest): Promise<AuthorizingResponse> {
		return this.authService.login(data);
	}

	@Get("secure")
	@UseGuards(JwtAuthGuard)
	async secure(@Req() req: AuthenticatedRequest): Promise<unknown> {
		return {
			who: req.user.userName,
		}
	}
}
