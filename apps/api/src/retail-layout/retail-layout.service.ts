import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export interface ProductShelf {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  orientation: number;
  color: string;
  averageTicket: number;
}

export interface StructureObject {
  id: string;
  name: string;
  type: 'entrance' | 'exit' | 'entrance_exit' | 'cash_counter' | 'blocker';
  x: number;
  y: number;
  width: number;
  height: number;
  orientation: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface RetailLayout {
  name: string;
  shelves: ProductShelf[];
  structureObjects: StructureObject[];
  outline: Point[];
  backgroundColor: string;
  overallScore: number;
}

@Injectable()
export class RetailLayoutService {
  private readonly logger = new Logger(RetailLayoutService.name);
  private readonly openai: OpenAI | undefined;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('openai.apiKey');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    } else {
      this.logger.warn('OpenAI API key not configured. AI features will be disabled.');
    }
  }

  /**
   * Generate a retail layout from text description using OpenAI
   */
  async generateFromText(description: string): Promise<RetailLayout> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are an expert retail space planner. Generate a realistic retail store layout based on the user's description.
    
Return a valid JSON object with this EXACT structure:
{
  "name": "Store Name",
  "shelves": [
    {
      "id": "uuid-format-string",
      "name": "Shelf name",
      "orientation": number (0, 90, 180, or 270 - see orientation rules below),
      "color": "#RRGGBB hex color",
      "width": number (40-200),
      "height": number (40-200),
      "x": number (0-800),
      "y": number (0-800),
      "averageTicket": number (typical average purchase amount in dollars)
    }
  ],
  "structureObjects": [
    {
      "id": "uuid-format-string",
      "name": "Object name",
      "type": "entrance" | "exit" | "entrance_exit" | "cash_counter" | "blocker",
      "x": number (0-800),
      "y": number (0-800),
      "orientation": number (0, 90, 180, or 270),
      "width": number (40-120),
      "height": number (40-120)
    }
  ],
  "outline": [
    {"x": number, "y": number},
    ... (array of points defining the store perimeter, clockwise)
  ],
  "backgroundColor": "#FFFFFF",
  "overallScore": number (0-100, layout quality score)
}

ORIENTATION RULES (critical):
Orientation indicates the direction from which customers ACCESS the shelf (where they stand to browse products):

Guidelines:

    try {
      const completion = await this.openai.chat.completions.create({
        model: this.configService.get<string>('openai.model') || 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: description },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('No content in OpenAI response');
      }

      const layout = JSON.parse(content) as RetailLayout;
      
      // Validate structure
      if (!layout.name || !layout.shelves || !layout.structureObjects) {
        throw new Error('Invalid layout structure returned from OpenAI');
      }

      this.logger.log(`Generated layout: ${layout.name} with ${layout.shelves.length} shelves`);
      this.scaleLayout(layout, 3);
      return layout;
    } catch (error) {
      this.logger.error('Error genaerating layout from text:', error);
      throw error;
    }
  }

  /**
   * Generate a retail layout from an image using OpenAI Vision
   */
  async generateFromImage(imageBase64: string): Promise<RetailLayout> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are an expert retail space planner. Analyze the provided store layout image and generate a digital representation. Always presume a 50m² store area. Width and height in meters should be multiplied by 10.

Return a valid JSON object with this EXACT structure:
{
  "name": "Store Name",
  "shelves": [
    {
      "id": "uuid-format-string",
      "name": "Shelf name",
      "orientation": number (0, 90, 180, or 270 - see orientation rules below),
      "color": "#RRGGBB",
      "width": number,
      "height": number,
      "x": number,
      "y": number,
      "averageTicket": number (estimated average purchase)
    }
  ],
  "structureObjects": [
    {
      "id": "uuid-format-string",
      "name": "Object name",
      "type": "entrance" | "exit" | "entrance_exit" | "cash_counter" | "blocker",
      "x": number,
      "y": number,
      "orientation": number (0, 90, 180, or 270),
      "width": number,
      "height": number
    }
  ],
  "outline": [{"x": number, "y": number}, ...],
  "backgroundColor": "#FFFFFF",
  "overallScore": number (0-100)
}

ORIENTATION RULES (critical):
Orientation indicates the direction from which customers ACCESS the shelf (where they stand to browse products):

DETERMINING ORIENTATION FROM IMAGE:
1. FIRST, look for arrows near/on shelves - the arrow direction indicates the customer access side
2. If NO arrows are present, use the shelf's text/label orientation:
   - The BOTTOM edge of readable text indicates where customers access the shelf
   - If text reads normally (not rotated), customers access from below (orientation = 0°)
   - If text is rotated 90° clockwise, customers access from the right (orientation = 90°)
   - If text is upside down, customers access from above (orientation = 180°)
   - If text is rotated 90° counter-clockwise, customers access from the left (orientation = 270°)

Analyze the image and identify:

Generate unique UUID-format ids for all objects. Use realistic colors based on product categories.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this retail store layout and generate a digital representation.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('No content in OpenAI response');
      }

      const layout = JSON.parse(content) as RetailLayout;
      
      // Validate structure
      if (!layout.name || !layout.shelves || !layout.structureObjects) {
        throw new Error('Invalid layout structure returned from OpenAI');
      }

      this.logger.log(`Generated layout from image: ${layout.name} with ${layout.shelves.length} shelves`);
      this.scaleLayout(layout, 3);
      return layout;
    } catch (error) {
      this.logger.error('Error generating layout from image:', error);
      throw error;
    }
  }

  /**
   * Generate a mock layout for testing (when OpenAI is not configured)
   */
  generateMockLayout(description?: string): RetailLayout {
    const layout: RetailLayout = {
      name: description ? `${description.substring(0, 30)}` : 'Mock Store',
      shelves: [
        {
          id: 'mock-shelf-1',
          name: 'Electronics',
          orientation: 0, // customers access from bottom
          color: '#597DA9',
          width: 100,
          height: 50,
          x: 100,
          y: 100,
          averageTicket: 350,
        },
        {
          id: 'mock-shelf-2',
          name: 'Clothing',
          orientation: 90, // customers access from right
          color: '#E85D75',
          width: 100,
          height: 50,
          x: 250,
          y: 100,
          averageTicket: 120,
        },
        {
          id: 'mock-shelf-3',
          name: 'Home & Garden',
          orientation: 180, // customers access from top
          color: '#59A96D',
          width: 100,
          height: 50,
          x: 400,
          y: 100,
          averageTicket: 85,
        },
      ],
      structureObjects: [
        {
          id: 'mock-entrance-1',
          name: 'Main Entrance',
          type: 'entrance_exit',
          x: 350,
          y: 550,
          width: 80,
          height: 40,
          orientation: 0,
        },
        {
          id: 'mock-counter-1',
          name: 'Cash Counter 1',
          type: 'cash_counter',
          x: 300,
          y: 480,
          width: 120,
          height: 40,
          orientation: 0,
        },
      ],
      outline: [
        { x: 0, y: 0 },
        { x: 800, y: 0 },
        { x: 800, y: 600 },
        { x: 0, y: 600 },
      ],
      backgroundColor: '#ffffff',
      overallScore: 75,
    };
    this.scaleLayout(layout, 3);
    return layout;
  }

  /**
   * Scales all coordinates and sizes in a RetailLayout by the given factor
   */
  private scaleLayout(layout: RetailLayout, factor: number): void {
    layout.shelves.forEach(shelf => {
      shelf.x *= factor;
      shelf.y *= factor;
      shelf.width *= factor;
      shelf.height *= factor;
    });
    layout.structureObjects.forEach(obj => {
      obj.x *= factor;
      obj.y *= factor;
      obj.width *= factor;
      obj.height *= factor;
    });
    if (layout.outline) {
      layout.outline.forEach(point => {
        point.x *= factor;
        point.y *= factor;
      });
    }
  }
}
