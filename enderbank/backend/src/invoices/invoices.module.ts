import {Module} from '@nestjs/common';
import {InvoicesController} from './invoices.controller';
import {InvoicesService} from './invoices.service';
import {TypegooseModule} from "nestjs-typegoose";
import {User} from "../models/db/user";

@Module({
	imports: [
		TypegooseModule.forFeature([User])
	],
	controllers: [InvoicesController],
	providers: [InvoicesService]
})
export class InvoicesModule {
}
