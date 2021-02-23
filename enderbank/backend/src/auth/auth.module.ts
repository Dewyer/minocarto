import { Module } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import {TypegooseModule} from "nestjs-typegoose";
import {User} from "../models/db/user";

@Module({
	imports: [TypegooseModule.forFeature([User])],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
