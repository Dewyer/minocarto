import { prop, Ref } from "@typegoose/typegoose";
import { BaseEntity } from "./baseEntity";
import { User } from "./user";
import { InvoiceDto } from "../dto/invoice.dto";
import { refToId } from "../../helpers/refToId";

export class Invoice extends BaseEntity {
	@prop({ required: false })
	canceled?: boolean;

	@prop({ required: true })
	amount: number;

	@prop({ required: true })
	code: string;

	@prop({ required: false })
	paidBy?: Ref<User>;

	@prop({ required: false })
	expiresAt?: Date;

	public static toDto(inv: Invoice): InvoiceDto {
		return {
			_id: inv._id.toHexString(),
			amount: inv.amount,
			code: inv.code,
			paidBy: refToId(inv.paidBy),
			expiresAt: inv.expiresAt,
		};
	}
}
