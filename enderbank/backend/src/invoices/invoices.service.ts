import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { User } from "../models/dbModels/user";
import { ReturnModelType, DocumentType } from "@typegoose/typegoose";
import { InvoiceDto } from "../models/dto/invoice.dto";
import { CreateInvoiceRequest } from "../models/http/request/createInvoiceRequest";
import { CreateInvoiceResponse } from "../models/http/response/createInvoiceResponse";
import { Invoice } from "../models/dbModels/invoice";
import * as cryptoRandomString from "crypto-random-string";
import {MObjectId} from "../models/dbModels/objectId";
import {QueryInvoiceRequest} from "../models/http/request/queryInvoiceRequest";
import {QueryInvoiceResponse} from "../models/http/response/queryInvoiceResponse";
import {PayInvoiceRequest} from "../models/http/request/payInvoiceRequest";
import {ActionResponse} from "../models/http/response/actionResponse";

@Injectable()
export class InvoicesService {
	constructor(
		@InjectModel(User) private readonly _user: ReturnModelType<typeof User>,
	) {}

	public async getInvoicesForUser(user: User): Promise<InvoiceDto[]> {
		const now = new Date();
		return user.invoices
			.filter((inv) => !inv.expiresAt || inv.expiresAt > now)
			.map((inv) => Invoice.toDto(inv));
	}

	private static newInvoiceFromRequest(
		request: CreateInvoiceRequest,
	): Invoice {
		const inv = new Invoice();
		inv._id = new MObjectId();
		inv.amount = request.amount;
		inv.code = cryptoRandomString({ length: 4, type: "hex" });
		inv.createdAt = new Date();
		return inv;
	}

	public async createInvoice(
		request: CreateInvoiceRequest,
		creator: User,
	): Promise<CreateInvoiceResponse> {
		const user = await this._user.findById(creator._id);
		if (!user) {
			throw new HttpException("Couldn't refetch user", HttpStatus.INTERNAL_SERVER_ERROR);
		}

		const newInvoice = InvoicesService.newInvoiceFromRequest(request);
		user.invoices.push(newInvoice);

		await user.save();

		return {
			invoice: Invoice.toDto(newInvoice),
		};
	}

	public async getUserWithActiveInvoiceCode(code: string): Promise<DocumentType<User> | null> {
		return this._user.findOne({
			invoices: {
				$elemMatch: {
					code: code,
					paidBy: null,
					canceled: { $not: { $eq: true } }
				}
			}
		});
	}

	public static getActiveInvoiceByCodeFromUser(user: User | null, code: string): Invoice | null {
		return user?.invoices.find((ii) => !ii.canceled && !ii.paidBy && ii.code === code) ?? null;
	}

	public async queryInvoice(
		request: QueryInvoiceRequest,
	): Promise<QueryInvoiceResponse> {
		const userWithInvoice = await this.getUserWithActiveInvoiceCode(request.invoiceCode);
		const selectedInvoice = InvoicesService.getActiveInvoiceByCodeFromUser(userWithInvoice, request.invoiceCode);

		if (!userWithInvoice || !selectedInvoice) {
			return {
				owner: null,
				invoice: null,
			};
		}

		return {
			owner: userWithInvoice.userName,
			invoice: Invoice.toDto(selectedInvoice),
		};
	}

	public async payInvoice(request: PayInvoiceRequest, currentUser: User): Promise<ActionResponse> {
		const currentUserModel = await this._user.findById(currentUser);
		if (!currentUserModel) {
			throw new HttpException('Imp', HttpStatus.INTERNAL_SERVER_ERROR);
		}

		const userWithInvoice = await this.getUserWithActiveInvoiceCode(request.invoiceCode);
		const selectedInvoice = InvoicesService.getActiveInvoiceByCodeFromUser(userWithInvoice, request.invoiceCode);

		if (!userWithInvoice || !selectedInvoice) {
			throw new HttpException("Invocie with code dosn't exists", HttpStatus.NOT_FOUND);
		}

		if (currentUserModel._id.toHexString() === userWithInvoice._id.toHexString()) {
			throw new HttpException("User cannot pay itself", HttpStatus.BAD_REQUEST);
		}

		if (currentUserModel.balance < selectedInvoice.amount) {
			throw new HttpException("Current user dosn't have ennough money to pay this invoice", HttpStatus.BAD_REQUEST);
		}

		currentUserModel.balance -= selectedInvoice.amount;
		userWithInvoice.balance += selectedInvoice.amount;
		selectedInvoice.paidBy = currentUserModel;

		await currentUserModel.save();
		await userWithInvoice.save();

		return {
			success: true,
		}
	}

}
