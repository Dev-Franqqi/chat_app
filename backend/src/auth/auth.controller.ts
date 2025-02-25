import { Controller, Get, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

// Assuming you are sending a user object in the body with required details
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  // The POST route for signup
  @Get('signup')
  signupUser(@Res() res:Response) {
    try{
       const success = this.authService.signupUser()
       const uniqueId = this.authService.generateUniqueUserId()
       
       res.cookie('uid',uniqueId , {
        httpOnly: true,  // Prevent access from JavaScript (more secure)
        secure: false,  // Set to false for local development (non-HTTPS)
        sameSite: 'none',  // 'lax' is often sufficient for local development
        maxAge: 24 * 60 * 60 * 1000,  // Optional: Set cookie expiration time (e.g., 1 day)
        path: '/',  // Cookie is available to the entire domain
      });
      
      
      return res.status(200).json({message: success.message,uid:uniqueId})


    }catch(error){
      return res.status(400).json({message: error.message})
    }
  }
}
