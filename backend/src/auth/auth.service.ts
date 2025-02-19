import { Injectable } from '@nestjs/common';
import { Cookie } from 'express-session';
@Injectable()
export class AuthService {

 signupUser(userDto:{username:string,password:string}){

    return { message: 'User created successfully',  userDto };
 }
}
