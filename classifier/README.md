# 311 Classifier

## How to run

First get an API key from OpenAI. Then create a `.env` file in the `classifier` directory with the following content:
```
OPENAI_API_KEY=your-api-key
```

Then run the following commands:

```bash
cd classifier
npm install
npx ts-node src/index.ts
```