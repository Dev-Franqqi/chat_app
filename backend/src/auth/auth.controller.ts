import { Controller, Get, Body, Res,Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

// Assuming you are sending a user object in the body with required details
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  async signup(@Body() user:{email:string,password:string},@Res() res:Response){
    try{
      const payload = await this.authService.signup(user.email,user.password)
      res.cookie('uid',user.email , {
        httpOnly: false,  // Prevent access from JavaScript (more secure)
        secure: true,  // Set to false for local development (non-HTTPS)
        sameSite: 'none',  // 'lax' is often sufficient for local development
        maxAge: 24 * 60 * 60 * 1000,  // Optional: Set cookie expiration time (e.g., 1 day)
        path: '/',  // Cookie is available to the entire domain
      });

      res.cookie('token',payload.token, {
        httpOnly: false,  // Prevent access from JavaScript (more secure)
        secure: true,  // Set to false for local development (non-HTTPS)
        sameSite: 'none',  // 'lax' is often sufficient for local development
        maxAge: 24 * 60 * 60 * 1000,  // Optional: Set cookie expiration time (e.g., 1 day)
        path: '/',  // Cookie is available to the entire domain
      })
      return res.status(200).json({payload})
    }catch(error){
      return res.status(400).json({message:error.message})
    }
  }
  
  @Post('login')
  async login(@Body() user: {email:string,password:string}, @Res() res:Response) {
    try{
      const payload = await this.authService.login(user.email,user.password)
      res.cookie('uid',user.email , {
        httpOnly: false,  // Prevent access from JavaScript (more secure)
        secure: true,  // Set to false for local development (non-HTTPS)
        sameSite: 'none',  // 'lax' is often sufficient for local development
        maxAge: 24 * 60 * 60 * 1000,  // Optional: Set cookie expiration time (e.g., 1 day)
        path: '/',  // Cookie is available to the entire domain
      });
      return res.status(200).json({payload})
    }catch(error){
      return res.status(400).json({message: error.message})
    }
  }
  @Get('loginAnonymously')
  signinAnonymously(@Res() res:Response) {
    try{
       const success =  this.authService.anonymousSignin()
       const uniqueId = this.authService.generateUniqueUserId()
       
       res.cookie('uid',uniqueId , {
        httpOnly: false,  // Prevent access from JavaScript (more secure)
        secure: true,  // Set to false for local development (non-HTTPS)
        sameSite: 'none',  // 'lax' is often sufficient for local development
        maxAge: 24 * 60 * 60 * 1000,  // Optional: Set cookie expiration time (e.g., 1 day)
        path: '/',  // Cookie is available to the entire domain
        domain:"chat-app-b9ay.onrender.com"
      });
      
      
      return res.status(200).json({message: success.message,uid:uniqueId})


    }catch(error){
      return res.status(400).json({message: error.message})
    }
  }



}
