import { BadRequestException, Injectable } from '@nestjs/common';
import { Cookie } from 'express-session';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcrypt"
@Injectable()
export class AuthService {
  constructor(private readonly prisma:PrismaService,
    private readonly jwt: JwtService
  ){}
  

  private async hashpassword(password:string){
    const saltRounds = 10
    const hashedpassword = await bcrypt.hash(password,saltRounds)
    return hashedpassword

  }

  private async comparePassword(password:string,hashedPassword:string){
    return await bcrypt.compare(password,hashedPassword)
  }


  private generateRandomNumber(min:number,max:number):number{

      const num = Math.floor(Math.random() * (max-min)) +min
      return num;
    }
  
    generateUniqueUserId():string{
      const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
      const numbers = "0123456789"
      //each unique Id should contain a letter in its first index and a number in its second index and max length should be 8 
     let uid = ""
     uid+= alphabets.charAt(this.generateRandomNumber(0,alphabets.length))
     uid+= numbers.charAt(this.generateRandomNumber(0,numbers.length))
  
     for(let i = 2; i<=8;i++){
      const fullCharacters = alphabets+numbers
      uid+=fullCharacters.charAt(this.generateRandomNumber(0,fullCharacters.length))
  
     }
     return uid
  
      
  
    } 

  anonymousSignin(){
    const uid= this.generateUniqueUserId()
    const token  = this.jwt.sign({uid},{secret:process.env.JWT_SECRET,expiresIn:'3h'})

    return {message:"Sign in successful",token}

    ;
 }



 async signup(email:string,password:string){
  if(!email || !password){
    throw new BadRequestException("Email or Password missing")
  }
  const existingUser = await this.prisma.user.findUnique({
  where:{email},
  })

  if(existingUser){
  throw new BadRequestException("User with email already exists")
  }

  const hashedPassword:string = await this.hashpassword(password)

  const user = await this.prisma.user.create({
    data:{
      email,password:hashedPassword
    }
  })

  const token = this.jwt.sign({
    uid: email
  },{secret:process.env.JWT_SECRET,expiresIn:"3h"})
  
  return {user,token}
  

 
   
}

async login(email:string,password:string){
  if(!email || !password){
    throw new BadRequestException("Email or Password missing")
  }
  const user = await this.prisma.user.findUnique({
    where:{email}
  })
  if(!user){
    throw new BadRequestException("User does not exist")
  }
  const matchpassword = await this.comparePassword(password,user.password)
  if(!matchpassword){
    throw new BadRequestException("Incorrect Password")
  }

  const token = this.jwt.sign({uid:email},{secret:process.env.JWT_SECRET,expiresIn:'3h'})
  return {user,token}

}



}
