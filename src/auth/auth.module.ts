import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule} from '@nestjs/jwt';
import { jwtConstants } from './constant';

@Module({
    imports:[
        PassportModule,
        JwtModule.register({
            global: true,
            secret : jwtConstants.secret,
            signOptions : {expiresIn: '1h'},
        })
    ],
    providers: [AuthService, PrismaService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
