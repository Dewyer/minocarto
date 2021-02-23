import { prop, Ref } from "@typegoose/typegoose";
import { BaseEntity } from "./baseEntity";
import { User } from "./user";
import { InvoiceDto } from "../dto/invoice.dto";
import { refToId } from "../../helpers/refToId";

export class Invoice extends BaseEntity {
	@prop({ required: true })
	amount: number;

	@prop({ required: true })
	code: string;

	@prop({ required: false })
	paidBy?: Ref<User>;

	@prop({ required: false })
	expiresAt?: Date;

	public toDto(): InvoiceDto {
		return {
			_id: this._id.toHexString(),
			amount: this.amount,
			code: this.code,
			paidBy: refToId(this.paidBy),
			expiresAt: this.expiresAt,
		};
	}
}
