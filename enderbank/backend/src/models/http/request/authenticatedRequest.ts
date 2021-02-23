import { User } from "../../dbModels/user";

export interface AuthenticatedRequest {
	user: User;
}
