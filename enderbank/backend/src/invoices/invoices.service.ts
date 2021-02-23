import { Injectable } from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {User} from "../models/db/user";
import {ReturnModelType} from "@typegoose/typegoose";
import {InvoiceDto} from "../models/dto/invoice.dto";
import {CreateInvoiceRequest} from "../models/http/request/createInvoiceRequest";
import {CreateInvoiceResponse} from "../models/http/response/createInvoiceResponse";
import {Invoice} from "../models/db/invoice";
import cryptoRandomString from "crypto-random-string";

@Injectable()
export class InvoicesService {

	constructor(@InjectModel(User) private readonly _user: ReturnModelType<typeof User>) {
	}

	public async getInvoicesForUser(user: User): Promise<InvoiceDto[]> {
		const now = new Date();
		return user.invoices.filter((inv) => inv.expiresAt < now).map((inv) => inv.toDto());
	}

	private static newInvoiceFromRequest(request: CreateInvoiceRequest): Invoice {
		const inv = new Invoice();
		inv.amount = request.amount;
		inv.code = cryptoRandomString({length:4, type: "hex"});
		inv.expiresAt = new Date(8640000000000000);
		inv.createdAt = new Date();
		return inv;
	}

	public async createInvoice(request: CreateInvoiceRequest, creator: User): Promise<CreateInvoiceResponse> {
		const user = await this._user.findById(creator._id);
		const newInvoice = InvoicesService.newInvoiceFromRequest(request);
		user.invoices.push(newInvoice);

		return {
			invoice: newInvoice.toDto(),
		}
	}
}
