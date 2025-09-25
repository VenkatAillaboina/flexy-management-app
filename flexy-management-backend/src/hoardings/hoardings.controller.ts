import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { HoardingsService } from './hoardings.service';
import { CreateHoardingDto } from './dto/create-hoarding.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('hoardings')
@Controller('hoardings')
export class HoardingsController {
  constructor(private readonly hoardingsService: HoardingsService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Create a new hoarding record' })
  @ApiConsumes('multipart/form-data') // Specify the content type
  @ApiBody({
    description: 'Data for the new hoarding, including an image upload',
    type: CreateHoardingDto, // Link to the DTO for the body fields
  })
  @ApiResponse({ status: 201, description: 'The hoarding was created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Validation failed.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async create(
    @Body() createHoardingDto: CreateHoardingDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }), // 4MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    const data = await this.hoardingsService.create(createHoardingDto, image);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Hoarding created successfully',
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all hoarding records' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all hoardings.' })

  async findAll() {
    const data = await this.hoardingsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Hoardings retrieved successfully',
      data,
    };
  }
}
