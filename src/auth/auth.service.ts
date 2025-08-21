import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constant';



@Injectable()
export class AuthService {

    constructor (
        private prismaService :PrismaService,
        private jwtService : JwtService
    ){}


    async createUser(email: string, password:string){
        const hashedPass = await bcrypt.hash(password,10)
        return this.prismaService.user.create({
            data: {email, password:hashedPass}
        });
    }
    async findByEmail(email: string){
        return this.prismaService.user.findUnique({where:{email}})
    }

    async validateUser(email : string, pass : string){
        const user = await this.findByEmail(email);
        if(user && (await bcrypt.compare(pass,user.password))){
            const {password, ...result} = user;
            return result
        }
        return null
    }
    
    async login(user : any){
        const payload = {email : user.email, sub : user.id};
        return {
            access_token : await this.jwtService.signAsync(payload)
        };
    }
   
}
