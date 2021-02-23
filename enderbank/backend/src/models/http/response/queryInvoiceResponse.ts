import {InvoiceDto} from "../../dto/invoice.dto";

export interface QueryInvoiceResponse {
	owner: string | null,
	invoice: InvoiceDto | null,
}