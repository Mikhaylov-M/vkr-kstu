/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { UserInterface } from "src/user/user.types";
import { compare } from "bcrypt";

@Injectable()
export class AuthService {
	 constructor(
		private userService: UserService,
		private jwtService: JwtService
	 ) {}

	 async validateUser(email: string, password: string) {
		const user = await this.userService.findByEmail(email)
		const isMatch = await compare(password, user.password)
		if (user && isMatch) {
			const { password, ...result } = user
			return result
		}
		return null
	 }
	 
	 async createToken(user: UserInterface) {
		const payload = { email: user.email, id: user.id }
		return {
			access_token: this.jwtService.sign(payload) 
		}
	 }
}