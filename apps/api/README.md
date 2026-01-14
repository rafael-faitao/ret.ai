# Retail Layout API

Backend API for the Retail Layout application. Provides AI-powered endpoints for generating retail store layouts from text descriptions and images.

## Features

- 🤖 **OpenAI Integration**: Generate layouts using GPT-4o
- 📝 **Text-to-Layout**: Convert text descriptions into store layouts
- 🖼️ **Image-to-Layout**: Analyze store images and create digital layouts
- 🔄 **Mock Fallback**: Automatic fallback to mock data when OpenAI is unavailable
- ✅ **Validation**: Request validation using class-validator
- 🔒 **CORS Enabled**: Configured for Angular frontend

## Setup

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Configuration

1. Copy the example environment file:
```bash
cp apps/api/.env.example apps/api/.env
```

2. Edit `apps/api/.env` and add your OpenAI API key:
```env
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4o
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
```

Get your OpenAI API key from: https://platform.openai.com/api-keys

## Running the API

### Development

```bash
# Start the API server
npm run start:api

# Or with watch mode
npx nx serve api
```

The API will be available at: `http://localhost:3000/api`

### Build

```bash
# Build the API
npm run build:api
```

## API Endpoints

### Generate Layout from Text

**POST** `/api/retail-layout/generate-from-text`

Generate a retail layout from a text description.

**Request Body:**
```json
{
  "description": "A medium-sized grocery store with fresh produce, dairy, bakery sections, 2 entrances, and 4 checkout counters"
}
```

**Response:**
```json
{
  "id": "layout-1234567890",
  "name": "Grocery Store",
  "description": "A medium-sized grocery store...",
  "gridSize": 20,
  "canvasSize": 800,
  "shelves": [
    {
      "name": "Fresh Produce",
      "x": 200,
      "y": 150,
      "width": 120,
      "height": 80,
      "orientation": 0,
      "color": "#4CAF50",
      "categories": ["fruits", "vegetables"]
    }
  ],
  "structureObjects": [
    {
      "name": "Main Entrance",
      "type": "entrance_exit",
      "x": 100,
      "y": 700,
      "width": 60,
      "height": 60,
      "orientation": 0
    }
  ]
}
```

### Generate Layout from Image

**POST** `/api/retail-layout/generate-from-image`

Generate a retail layout from an uploaded image.

**Request:**
- Content-Type: `multipart/form-data`
- Field: `image` (file upload)

**Response:** Same as text-to-layout

## Architecture

```
apps/api/
├── src/
│   ├── app/                    # Main application module
│   ├── config/                 # Configuration files
│   │   └── configuration.ts    # Environment config
│   ├── retail-layout/          # Retail layout module
│   │   ├── dto/                # Data transfer objects
│   │   ├── retail-layout.controller.ts
│   │   ├── retail-layout.service.ts
│   │   └── retail-layout.module.ts
│   └── main.ts                 # Application entry point
├── .env                        # Environment variables (not in git)
└── .env.example                # Environment template
```

## Tech Stack

- **Framework**: NestJS 11
- **AI**: OpenAI GPT-4o
- **Validation**: class-validator, class-transformer
- **File Upload**: multer
- **Configuration**: @nestjs/config

## Development

### Testing

```bash
# Run tests
npx nx test api

# Run tests in watch mode
npx nx test api --watch
```

### Linting

```bash
npx nx lint api
```

## Troubleshooting

### OpenAI API Key Issues

If you see warnings about "OpenAI API key not configured", make sure:
1. You've created the `.env` file in `apps/api/`
2. The `OPENAI_API_KEY` is set correctly
3. Restart the API server after updating the `.env` file

### CORS Issues

If the Angular app can't connect to the API:
1. Check that `CORS_ORIGIN` matches your Angular dev server URL
2. Default is `http://localhost:4200`

## Notes

- The API automatically falls back to mock data if OpenAI is unavailable
- Image uploads are limited by the Express default (1MB)
- All endpoints use the `/api` prefix
