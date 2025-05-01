import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import {  JwtService } from '@nestjs/jwt';
import { Request } from 'express';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor (private readonly jwt: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request:Request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    try{
     const user = this.jwt.verify(token,{secret:process.env.JWT_SECRET})
     request['user'] = user
     return true
    }catch(error){
      throw new UnauthorizedException('Invalid token')
    }
}

private extractTokenFromHeader(request:Request):string{
  const authHeader = request.headers['authorization']
  if(!authHeader){
    throw new UnauthorizedException('No token provided')
  }
  const token = authHeader.split(' ')[1]
  if(!token){
    throw new UnauthorizedException('No token provided')
  }
  return token


  

}}
