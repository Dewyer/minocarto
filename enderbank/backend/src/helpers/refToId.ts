import {BaseEntity} from "../models/dbModels/baseEntity";
import {Ref} from "@typegoose/typegoose";

export function refToId<T extends BaseEntity>(ref?: Ref<T>): string | undefined {
	if (!ref) {
		return undefined;
	}
	return "_id" in ref ? ref._id.toHexString() : ref.toHexString();
}
