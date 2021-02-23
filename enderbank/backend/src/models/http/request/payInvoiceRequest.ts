import {IsString} from "class-validator";

export class PayInvoiceRequest {
	@IsString()
	invoiceCode: string;
}