import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypegooseModule } from "nestjs-typegoose";
import { User } from "../models/dbModels/user";
import { JwtStrategy } from "./jwt.strategy";
import { PassportModule } from "@nestjs/passport";

@Module({
	imports: [
		TypegooseModule.forFeature([User]),
		PassportModule.register({
			defaultStrategy: "jwt",
			property: "user",
			session: false,
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
