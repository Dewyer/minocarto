import {User} from "../../db/user";

export interface AuthenticatedRequest {
	user: User,
}