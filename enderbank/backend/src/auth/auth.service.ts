import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {RegisterResponse} from "../models/http/response/registerResponse";
import {InjectModel} from "nestjs-typegoose";
import {User} from "../models/db/user";
import {ReturnModelType} from "@typegoose/typegoose";
import {RegisterRequest} from "../models/http/request/registerRequest";
import * as crypto from "crypto";
import * as cryptoRandomString from "crypto-random-string";
import * as mongoose from "mongoose";

@Injectable()
export class AuthService {

	constructor(@InjectModel(User) private readonly _user: ReturnModelType<typeof User>) {
	}

	private static hashPassword(pwd: string, salt: string): string {
		return crypto.createHash("sha256").update(`${salt} ${pwd} ${salt}`).digest("hex");
	}

	public async register(request: RegisterRequest): Promise<RegisterResponse> {
		const existingUser = await this._user.findOne({userName: request.userName}).exec();
		if (existingUser) {
			throw new HttpException("User with given username already exists!", HttpStatus.BAD_REQUEST);
		}

		const salt = cryptoRandomString({
			length: 20,
			type: "hex",
		});

		const newUser = await this._user.create({
			_id: new mongoose.Types.ObjectId(),
			userName: request.userName,
			passwordHash: AuthService.hashPassword(request.password, salt),
			passwordSalt: salt,
			balance: 0,
		});

		return {
			token: newUser._id.toHexString(),
		}
	}
}
