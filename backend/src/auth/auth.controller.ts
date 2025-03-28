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
     

      
      return res.status(200).json(payload)
    }catch(error){
      return res.status(400).json({message:error.message})
    }
  }
  
  @Post('login')
  async login(@Body() user: {email:string,password:string}, @Res() res:Response) {
    try{
      const payload = await this.authService.login(user.email,user.password)
      
      return res.status(200).json(payload)
    }catch(error){
      return res.status(400).json({message: error.message})
    }
  }
  @Get('loginAnonymously')
  signinAnonymously(@Res() res:Response) {
    try{
       const payload =  this.authService.anonymousSignin()
       
      // //  res.cookie('uid',uniqueId , {
      // //   httpOnly: false,  
      // //   secure: true, 
      // //   sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      // //   maxAge: 24 * 60 * 60 * 1000, 
      // //   path: '/',  
      // //   domain:"chat-app-b9ay.onrender.com"
      // // });
      
      
      return res.status(200).json(payload)


    }catch(error){
      return res.status(400).json({message: error.message})
    }
  }



}
