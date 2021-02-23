import { modelOptions, prop } from "@typegoose/typegoose";
import { BaseEntity } from "./baseEntity";
import { Invoice } from "./invoice";

@modelOptions({
	schemaOptions: {
		collection: "users",
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true,
	},
})
export class User extends BaseEntity {
	@prop({ required: true })
	userName: string;

	@prop({ required: true })
	passwordSalt: string;

	@prop({ required: true })
	passwordHash: string;

	@prop({ required: true })
	balance: number;

	@prop({ required: true, _id: true })
	invoices: Invoice[];
}
