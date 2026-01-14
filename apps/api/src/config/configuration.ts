export default () => ({
  port: parseInt(process.env['PORT'] || '3000', 10),
  nodeEnv: process.env['NODE_ENV'] || 'development',
  openai: {
    apiKey: process.env['OPENAI_API_KEY'],
    model: process.env['OPENAI_MODEL'] || 'gpt-4o',
  },
  cors: {
    origin: process.env['CORS_ORIGIN'] || 'http://localhost:4200',
  },
});
