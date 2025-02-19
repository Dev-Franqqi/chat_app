import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

// Assuming you are sending a user object in the body with required details
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // The POST route for signup
  @Post('signup')
  signupUser(@Body() userDto: { username: string; password: string }) {
    return this.authService.signupUser(userDto);
  }
}
