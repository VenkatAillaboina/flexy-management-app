import { Injectable, InternalServerErrorException, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { CreateHoardingDto } from './dto/create-hoarding.dto';
import { Hoarding } from './schemas/hoarding.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateHoardingDto } from './dto/update-hoarding.dto';

@Injectable()
export class HoardingsService {
 private readonly logger = new Logger(HoardingsService.name);

  constructor(
    @InjectModel(Hoarding.name) private readonly hoardingModel: Model<Hoarding>,

    private readonly cloudinaryService: CloudinaryService,

    @InjectConnection() private readonly connection: Connection,
  ) { }

  async create(
    createHoardingDto: CreateHoardingDto,
    image: Express.Multer.File
  ): Promise<Hoarding> 
  {  
    this.logger.log('Starting creation process for new hoarding...');
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      this.logger.log('Uploading image to Cloudinary...');
      const uploadResult = await this.cloudinaryService.uploadImage(image);
      if (!uploadResult.secure_url) {
        throw new InternalServerErrorException('Image upload failed.');
      }

      const newHoarding = new this.hoardingModel({
        ...createHoardingDto,
        imageUrl: uploadResult.secure_url,
        location: {
          type: 'Point',
          coordinates: createHoardingDto.coordinates,
        },
      });

      const savedHoarding = await newHoarding.save({ session });

      await session.commitTransaction();

      this.logger.log(`Successfully created hoarding with ID: ${savedHoarding._id}`);
      return savedHoarding;

    } catch (error) {
      await session.abortTransaction();
      console.error('Transaction failed:', error);
      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }
      this.logger.error(`Transaction failed for hoarding creation. Aborting.`, error.stack);
      throw new InternalServerErrorException('Could not create hoarding. Transaction aborted.');
    } finally {
      session.endSession();
    }
  }

  async findAll(): Promise<Partial<Hoarding>[]> {
    return this.hoardingModel
      .find()
      .select('name imageUrl address status') // only these fields
      .exec();
  }

  async findOne(id: string): Promise<Hoarding> {
    const hoarding = await this.hoardingModel.findById(id).exec();
    if (!hoarding) {
      throw new NotFoundException(`Hoarding with ID "${id}" not found`);
    }
    return hoarding;
  }

  async update(id: string, updateHoardingDto: UpdateHoardingDto): Promise<Hoarding> {
    const existingHoarding = await this.hoardingModel.findByIdAndUpdate(id, updateHoardingDto, { new: true });

    if (!existingHoarding) {
      throw new NotFoundException(`Hoarding with ID "${id}" not found`);
    }
    return existingHoarding;
  }
  
  async remove(id: string): Promise<Hoarding> {
    const deletedHoarding = await this.hoardingModel.findByIdAndDelete(id);

    if (!deletedHoarding) {
      throw new NotFoundException(`Hoarding with ID "${id}" not found`);
    }
    return deletedHoarding;
  }

}
