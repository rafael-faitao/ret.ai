import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RetailLayoutService, RetailLayout } from './retail-layout.service';
import { GenerateFromTextDto } from './dto/generate-from-text.dto';

@Controller('retail-layout')
export class RetailLayoutController {
  private readonly logger = new Logger(RetailLayoutController.name);

  constructor(private readonly retailLayoutService: RetailLayoutService) {}

  @Post('generate-from-text')
  async generateFromText(
    @Body() dto: GenerateFromTextDto,
  ): Promise<RetailLayout> {
    this.logger.log(`Generating layout from text: ${dto.description.substring(0, 50)}...`);
    
    try {
      return await this.retailLayoutService.generateFromText(dto.description);
    } catch (error) {
      this.logger.warn('OpenAI generation failed, returning mock layout');
      return this.retailLayoutService.generateMockLayout(dto.description);
    }
  }

  @Post('generate-from-image')
  @UseInterceptors(FileInterceptor('image'))
  async generateFromImage(
    @UploadedFile() file: any,
  ): Promise<RetailLayout> {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    this.logger.log(`Generating layout from image: ${file.originalname}`);

    // Convert buffer to base64
    const base64Image = file.buffer.toString('base64');

    try {
      return await this.retailLayoutService.generateFromImage(base64Image);
    } catch (error) {
      this.logger.warn('OpenAI generation failed, returning mock layout');
      return this.retailLayoutService.generateMockLayout('Image-based layout');
    }
  }
}
