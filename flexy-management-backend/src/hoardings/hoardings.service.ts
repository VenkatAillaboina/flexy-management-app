import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { CreateHoardingDto } from './dto/create-hoarding.dto';
import { UpdateHoardingDto } from './dto/update-hoarding.dto';
import { Hoarding } from './schemas/hoarding.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { GeminiService } from 'src/gemini/gemini.service';

@Injectable()
export class HoardingsService {
  private readonly logger = new Logger(HoardingsService.name);

  constructor(
    @InjectModel(Hoarding.name) private readonly hoardingModel: Model<Hoarding>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly geminiService: GeminiService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async create(
    createHoardingDto: CreateHoardingDto,
    image: Express.Multer.File,
  ): Promise<Hoarding> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const finalDto = { ...createHoardingDto };
      
      this.logger.log('Analyzing image with Gemini to autofill missing data...');
      const geminiDetails = await this.geminiService.getHoardingDetailsFromImage(image);

      if (geminiDetails) {
        if (!finalDto.name && geminiDetails.name !== 'N/A') {
          finalDto.name = geminiDetails.name;
        }
        if (!finalDto.address && geminiDetails.address !== 'N/A') {
          finalDto.address = geminiDetails.address;
        }
        // TYPE-SAFE CHECK: Only assign if width is missing AND Gemini returned a valid number.
        if (!finalDto.width && typeof geminiDetails.widthInCm === 'number') {
          finalDto.width = geminiDetails.widthInCm;
        }
        // TYPE-SAFE CHECK: Only assign if height is missing AND Gemini returned a valid number.
        if (!finalDto.height && typeof geminiDetails.heightInCm === 'number') {
          finalDto.height = geminiDetails.heightInCm;
        }
      }

      const uploadResult = await this.cloudinaryService.uploadImage(image);
      if (!uploadResult.secure_url) {
        throw new InternalServerErrorException('Image upload failed.');
      }

      const newHoarding = new this.hoardingModel({
        ...finalDto,
        imageUrl: uploadResult.secure_url,
        location: {
          type: 'Point',
          coordinates: finalDto.coordinates,
        },
      });

      const savedHoarding = await newHoarding.save({ session });
      await session.commitTransaction();
      this.logger.log(`Successfully created hoarding with ID: ${savedHoarding._id}`);
      return savedHoarding;
    } catch (error) {
      await session.abortTransaction();
      this.logger.error(`Transaction failed for hoarding creation.`, error.stack);
      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('Could not create hoarding.');
    } finally {
      session.endSession();
    }
  }

  async findAll(): Promise<Partial<Hoarding>[]> {
    return this.hoardingModel.find().select('name imageUrl address status').exec();
  }

  async findOne(id: string): Promise<Hoarding> {
    const hoarding = await this.hoardingModel.findById(id).exec();
    if (!hoarding) {
      throw new NotFoundException(`Hoarding with ID "${id}" not found`);
    }
    return hoarding;
  }

  async update(
    id: string,
    updateHoardingDto: UpdateHoardingDto,
    image?: Express.Multer.File,
  ): Promise<Hoarding> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const hoarding = await this.hoardingModel.findById(id).session(session);
      if (!hoarding) throw new NotFoundException(`Hoarding with ID "${id}" not found`);

      const updatePayload: Partial<Hoarding> = { ...updateHoardingDto };

      if (image) {
        if (hoarding.imageUrl) {
          const urlParts = hoarding.imageUrl.split('/');
          const lastPart = urlParts.pop();
          if (lastPart) {
            const publicId = lastPart.split('.')[0];
            await this.cloudinaryService.deleteImage(`hoardings/${publicId}`);
          }
        }
        const uploadResult = await this.cloudinaryService.uploadImage(image);
        if (!uploadResult.secure_url) throw new InternalServerErrorException('Image upload failed.');
        
        updatePayload.imageUrl = uploadResult.secure_url;
      }

      const updatedHoarding = await this.hoardingModel.findByIdAndUpdate(
        id,
        updatePayload,
        { new: true, session },
      );
      if (!updatedHoarding) throw new NotFoundException(`Hoarding with ID "${id}" not found during update`);

      await session.commitTransaction();
      return updatedHoarding;
    } catch (error) {
      await session.abortTransaction();
      this.logger.error(`Transaction failed for hoarding update.`, error.stack);
      throw new InternalServerErrorException('Could not update hoarding.');
    } finally {
      session.endSession();
    }
  }

  async remove(id: string): Promise<Hoarding> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const hoarding = await this.hoardingModel.findById(id).session(session);
      if (!hoarding) throw new NotFoundException(`Hoarding with ID "${id}" not found`);

      if (hoarding.imageUrl) {
        const urlParts = hoarding.imageUrl.split('/');
        const lastPart = urlParts.pop();
        if (lastPart) {
          const publicId = lastPart.split('.')[0];
          await this.cloudinaryService.deleteImage(`hoardings/${publicId}`);
        }
      }

      const deletedHoarding = await this.hoardingModel.findByIdAndDelete(id, { session });
      if (!deletedHoarding) throw new NotFoundException(`Hoarding with ID "${id}" not found during deletion`);

      await session.commitTransaction();
      return deletedHoarding;
    } catch (error) {
      await session.abortTransaction();
      this.logger.error(`Transaction failed for hoarding removal.`, error.stack);
      throw new InternalServerErrorException('Could not remove hoarding.');
    } finally {
      session.endSession();
    }
  }
}

