import { Injectable } from '@nestjs/common';
import { Cookie } from 'express-session';
@Injectable()
export class AuthService {
   generateRandomNumber(min:number,max:number):number{

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
 signupUser(){

    return { message: 'User created successfully' };
 }
}
