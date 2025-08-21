import { Controller, Post,Get, UseInterceptors, UploadedFile, Body, Param, ParseIntPipe, Put, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
    constructor(private readonly productService : ProductService){}

     @Post()
      @UseInterceptors(
        FileInterceptor('image', {
          storage: diskStorage({
            // destination: join(__dirname, '..', '..', 'uploads'),
            destination: './uploads',
            filename: (req, file, cb) => {
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
              const ext = extname(file.originalname);
              cb(null, `${uniqueSuffix}${ext}`);
            },
          }),
        }),
      )
    create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateProductDto & { image: string },
    ) {
      const data = {
        name: body.name,
        price: Number(body.price),
        qty: Number(body.qty),
        image: file.filename,
      };
      return this.productService.create(data);
    }
    @Get()
    getAll(){
      return this.productService.getAll();
    }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id:number) {
      return this.productService.getOne(id)
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('image'))
    update(
      @Param('id', ParseIntPipe) id: number,
      @UploadedFile() file: Express.Multer.File,
      @Body() body: any
    ) {
      return this.productService.update(id, {
        name: body.name,
        price: Number(body.price),
        qty: Number(body.qty),
        image: file ? file.filename : body.image, // fallback to old image
      });
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
      return this.productService.delete(id);
    }
}
