import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
	getTest(): string {
		return 'Hello World!';
	}
}
