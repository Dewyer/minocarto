import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { User } from "../models/dbModels/user";
import { JwtPayload } from "../models/jwtPayload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.SECRET,
		});
	}

	async validate(payload: JwtPayload): Promise<User> {
		const user = await this.authService.findUserByJwt(payload);
		if (!user) {
			throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
		}
		return user;
	}
}
