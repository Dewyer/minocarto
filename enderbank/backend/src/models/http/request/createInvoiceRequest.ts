import { IsNumber } from "class-validator";

export class CreateInvoiceRequest {
	@IsNumber()
	amount: number;
}
