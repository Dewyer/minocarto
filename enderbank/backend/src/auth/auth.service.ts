import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {RegisterResponse} from "../models/http/response/registerResponse";
import {InjectModel} from "nestjs-typegoose";
import {User} from "../models/db/user";
import {ReturnModelType} from "@typegoose/typegoose";
import {RegisterRequest} from "../models/http/request/registerRequest";

@Injectable()
export class AuthService {

	constructor(@InjectModel(User) private readonly _user: ReturnModelType<typeof User>) {
	}

	private static hashPassword(pwd: string, salt: string): string {
		return 'asd';
	}

	public async register(request: RegisterRequest) : Promise<RegisterResponse> {
		const existingUser = await this._user.find({userName: request.userName});
		if (existingUser) {
			throw new HttpException("User with given username already exists!", HttpStatus.BAD_REQUEST);
		}

		const newUser = await this._user.create({
			userName: request.userName,
			passwordHash: AuthService.hashPassword(request.password, '1234'),
			passwordSalt: '1234',
		});

		return {
			token: newUser._id,
		}
	}
}
