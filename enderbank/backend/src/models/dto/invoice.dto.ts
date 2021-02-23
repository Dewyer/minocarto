import { BaseEntityDto } from "./baseEntity.dto";

export interface InvoiceDto extends BaseEntityDto {
	amount: number;

	code: string;

	paidBy?: string;

	expiresAt?: Date;
}
