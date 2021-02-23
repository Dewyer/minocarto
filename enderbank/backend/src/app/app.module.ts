import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypegooseModule } from "nestjs-typegoose";
import { AuthModule } from "../auth/auth.module";
import { InvoicesModule } from "../invoices/invoices.module";

@Module({
	imports: [
		TypegooseModule.forRoot(process.env.DB_CONN || '', {
			useNewUrlParser: true,
		}),
		AuthModule,
		InvoicesModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
