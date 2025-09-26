import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Define a type for the structured response we expect from Gemini
export interface HoardingDetails {
  name: string;
  address: string;
  widthInCm: number | 'N/A';
  heightInCm: number | 'N/A';
}

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  public async getHoardingDetailsFromImage(
    image: Express.Multer.File,
  ): Promise<HoardingDetails | null> {
    try {
      this.logger.log('Requesting comprehensive hoarding details from Gemini Vision...');
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

      const prompt = `Analyze the attached image of a billboard/hoarding. Extract the following details and provide them ONLY as a valid JSON object:
      1. "name": A suitable title or name for the hoarding. If not obvious, use "N/A".
      2. "address": The street address or a descriptive location. If not determinable, use "N/A".
      3. "heightInFeet": An estimated height of the hoarding in feet (provide only the number). If not estimable, use "N/A".
      4. "widthInFeet": An estimated width of the hoarding in feet (provide only the number). If not estimable, use "N/A".
      
      Your response must be ONLY the JSON object, with no other text or explanations. Example: {"name": "Main Street Billboard", "address": "123 Main St, Anytown", "heightInFeet": 20, "widthInFeet": "N/A"}`;

      const imagePart = {
        inlineData: {
          data: image.buffer.toString('base64'),
          mimeType: image.mimetype,
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const responseText = result.response.text();
      this.logger.log(`Received raw response from Gemini: "${responseText}"`);

      const parsedJson = JSON.parse(responseText);

      const feetToCm = (feet: number | 'N/A'): number | 'N/A' => {
        if (typeof feet === 'number') {
          return parseFloat((feet * 30.48).toFixed(2));
        }
        return 'N/A';
      };
      
      return {
        name: parsedJson.name || 'N/A',
        address: parsedJson.address || 'N/A',
        heightInCm: feetToCm(parsedJson.heightInFeet),
        widthInCm: feetToCm(parsedJson.widthInFeet),
      };

    } catch (error) {
      this.logger.error('Error fetching or parsing details from Gemini API', error.stack);
      return null;
    }
  }
}
