import { prop } from "@typegoose/typegoose";
import { MObjectId } from "./objectId";

export class BaseEntity {
	_id: MObjectId;

	@prop({ required: false })
	createdAt?: Date;

	@prop({ required: false })
	updatedAt?: Date;
}
