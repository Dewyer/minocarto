import {IsString} from "class-validator";

export class QueryInvoiceRequest {
	@IsString()
	invoiceCode: string;
}