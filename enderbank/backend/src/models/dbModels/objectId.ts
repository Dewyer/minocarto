import * as mongoose from "mongoose";

export class MObjectId extends mongoose.Types.ObjectId {
	constructor(props: string | number) {
		super(props);
	}
}
