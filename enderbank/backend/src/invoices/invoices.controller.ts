import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { InvoicesService } from "./invoices.service";
import { AuthenticatedRequest } from "../models/http/request/authenticatedRequest";
import { InvoiceDto } from "../models/dto/invoice.dto";
import { CreateInvoiceResponse } from "../models/http/response/createInvoiceResponse";
import { CreateInvoiceRequest } from "../models/http/request/createInvoiceRequest";
import { JwtAuthGuard } from "src/auth/guard";
import {QueryInvoiceRequest} from "../models/http/request/queryInvoiceRequest";
import {QueryInvoiceResponse} from "../models/http/response/queryInvoiceResponse";
import {PayInvoiceRequest} from "../models/http/request/payInvoiceRequest";
import {ActionResponse} from "../models/http/response/actionResponse";

@Controller("api/invoices")
export class InvoicesController {
	constructor(private readonly invoicesService: InvoicesService) {}

	@Get()
	@UseGuards(JwtAuthGuard)
	async getInvoicesForUser(
		@Req() req: AuthenticatedRequest,
	): Promise<InvoiceDto[]> {
		return this.invoicesService.getInvoicesForUser(req.user);
	}

	@Post("create")
	@UseGuards(JwtAuthGuard)
	async createInvoice(
		@Body() request: CreateInvoiceRequest,
		@Req() userReq: AuthenticatedRequest,
	): Promise<CreateInvoiceResponse> {
		return this.invoicesService.createInvoice(request, userReq.user);
	}

	@Post("query")
	@UseGuards(JwtAuthGuard)
	async queryInvoice(
		@Body() request: QueryInvoiceRequest,
	): Promise<QueryInvoiceResponse> {
		return this.invoicesService.queryInvoice(request);
	}

	@Post("pay")
	@UseGuards(JwtAuthGuard)
	async payInvoice(
		@Body() request: PayInvoiceRequest,
		@Req() userReq: AuthenticatedRequest,
	): Promise<ActionResponse> {
		return this.invoicesService.payInvoice(request, userReq.user);
	}
}
