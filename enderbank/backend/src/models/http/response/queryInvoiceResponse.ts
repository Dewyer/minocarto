import {InvoiceDto} from "../../dto/invoice.dto";

export interface QueryInvoiceResponse {
	invoice: InvoiceDto | null,
}