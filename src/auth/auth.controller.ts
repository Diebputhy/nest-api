import { Body, Controller, Get, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { jwtConstants } from './constant';

@Controller('auth')
export class AuthController {
    constructor(private authService : AuthService){}
    //register
    @Post('register')
    async register(@Body() body: {email : string, password : string}){
        const existUser = await this.authService.findByEmail(body.email);
        if(existUser){
            throw new UnauthorizedException('user aready exist');
        }
        const user = await this.authService.createUser(body.email, body.password);
        const {password, ...result} = user
        return result;
    }


    //login
    @Post('login')
    async login(@Body() body: {email : string , password : string}){
        const user = await  this.authService.validateUser(body.email, body.password);
        if(!user){
            throw new UnauthorizedException('Invalid credentials')
        }
        return this.authService.login(user);
    }
    


}
