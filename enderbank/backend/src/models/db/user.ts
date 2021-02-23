import { prop } from "@typegoose/typegoose"

export class User {
	@prop({ required: true })
	_id: string;

	@prop({ required: true })
	userName: string;

	@prop({ required: true })
	passwordSalt: string;

	@prop({ required: true })
	passwordHash: string;
}