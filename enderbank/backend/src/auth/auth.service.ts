import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthorizingResponse } from "../models/http/response/authorizingResponse";
import { InjectModel } from "nestjs-typegoose";
import { User } from "../models/dbModels/user";
import { ReturnModelType } from "@typegoose/typegoose";
import { RegisterRequest } from "../models/http/request/registerRequest";
import * as crypto from "crypto";
import * as cryptoRandomString from "crypto-random-string";
import * as mongoose from "mongoose";
import * as jsonwebtoken from "jsonwebtoken";
import { JwtPayload } from "../models/jwtPayload";
import { LoginRequest } from "../models/http/request/loginRequest";

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User) private readonly _user: ReturnModelType<typeof User>,
	) {}

	private static issueToken(userId: string): string {
		return jsonwebtoken.sign({ uid: userId }, process.env.SECRET || '1234', {
			expiresIn: "100day",
		});
	}

	private static hashPassword(pwd: string, salt: string): string {
		return crypto
			.createHash("sha256")
			.update(`${salt} ${pwd} ${salt}`)
			.digest("hex");
	}

	public async findUserByJwt(payload: JwtPayload): Promise<User | null> {
		return this._user.findById(payload.uid || "");
	}

	private static isPasswordValidForUser(user: User, password: string) {
		return (
			user.passwordHash ===
			AuthService.hashPassword(password, user.passwordSalt)
		);
	}

	public async login(request: LoginRequest): Promise<AuthorizingResponse> {
		const existingUser = await this._user
			.findOne({ userName: request.userName })
			.exec();
		if (!existingUser) {
			throw new HttpException(
				"User with given username dosnt't exists!",
				HttpStatus.BAD_REQUEST,
			);
		}

		if (
			!AuthService.isPasswordValidForUser(existingUser, request.password)
		) {
			throw new HttpException(
				"Incorrect password!",
				HttpStatus.BAD_REQUEST,
			);
		}

		return {
			token: AuthService.issueToken(existingUser._id.toHexString()),
		};
	}

	public async register(
		request: RegisterRequest,
	): Promise<AuthorizingResponse> {
		const existingUser = await this._user
			.findOne({ userName: request.userName })
			.exec();
		if (existingUser) {
			throw new HttpException(
				"User with given username already exists!",
				HttpStatus.BAD_REQUEST,
			);
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
			invoices: [],
		});

		return {
			token: AuthService.issueToken(newUser._id.toHexString()),
		};
	}
}
