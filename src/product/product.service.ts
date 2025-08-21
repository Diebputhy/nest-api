import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { join } from 'path';
import { unlink } from 'fs/promises';


@Injectable()
export class ProductService {
    constructor(private  prismaService : PrismaService){}

    //Create
    create(data:CreateProductDto & { image: string }):Promise<any>{
        return this.prismaService.product.create({data});
    }

    //Get all Product    
    getAll():Promise<any>{
        return this.prismaService.product.findMany();
    }


    //GetOneProduct
    
    getOne(id: number){
        return this.prismaService.product.findUnique({where : {id}})
    }


    //Update
    async update(id: number, data: UpdateProductDto & { image: string }): Promise<any> {
    const product = await this.getOne(id);

    if (!product) {
        throw new NotFoundException('Product not found');
    }

    return this.prismaService.product.update({
        where: { id },
        data: {
        ...data,
        },
      });
    }


    //Delete
    async delete(id: number): Promise<any> {
    const product = await this.getOne(id);
    if(!product){
        throw new NotFoundException('product not found')
    }
    if(product.image){
        const imagePath = join(process.cwd(), 'uploads', product.image);
        console.log
        try{
            await unlink(imagePath);
        }catch(err){
            console.error('Error deleting image file:', err.message);
        }
    }
    await this.prismaService.product.delete({ where: { id } });
    return { message: 'Deleted successfully' };
  }
}
