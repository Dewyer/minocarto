import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypegooseModule } from "nestjs-typegoose";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    TypegooseModule.forRoot("mongodb://localhost:27019/enderbank", {
      useNewUrlParser: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
