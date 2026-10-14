import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Support large image payloads (up to 30MB base64)
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Helper to count words (supports Arabic and Latin scripts)
function countWords(str: string): number {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

// Trim to max words if needed while preserving sentence completion
function trimToMaxWords(text: string, maxWords: number = 60): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text;
  
  // Cut to maxWords and attempt to end at last full sentence/punctuation
  const truncated = words.slice(0, maxWords).join(' ');
  const lastPeriod = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('。'),
    truncated.lastIndexOf('!')
  );
  if (lastPeriod > truncated.length * 0.7) {
    return truncated.substring(0, lastPeriod + 1);
  }
  return truncated + '...';
}

// Endpoint: Analyze Photographic Symbolism
app.post('/api/analyze-symbolism', async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided. Please upload a photograph.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please verify your environment secrets.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Clean base64 data if data URI header is present
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const detectedMimeType = mimeType || 'image/jpeg';

    const promptText = `
You are a distinguished fine-art photography curator and visual semiotics scholar analyzing this photograph for an exhibition catalog by Dr. Hisham AlKhatib (Consultant Radiologist & Amateur Photographer).

YOUR TASK:
Analyze the photograph from an artistic, symbolic, conceptual, and visual perspective rather than simply describing what is literally visible.

CORE ANALYSIS CRITERIA TO EVALUATE:
1. Main visual subject.
2. Composition.
3. Lines and geometric forms (circular forms, diagonals, spirals, framing).
4. Repetition and visual rhythm (patterns, cadence, tempo).
5. Light and shadow (chiaroscuro, luminance contrast, tonal gradation).
6. Contrast (textural, tonal, scale, or conceptual tension).
7. Relationships between visual elements (foreground, middle ground, background dialogue).
8. Negative space (weight, breathing room, isolation).
9. Depth and perspective (leading lines, vanishing points, foreshortening).
10. Reflections, if present (surfaces, mirrors, dualities, illusions).
11. Movement or visual dynamism (kinetic flow, stillness, suspension).
12. Relationship between people and place, if present (scale, alienation, harmony, presence/absence).
13. Possible emotional or cultural associations (solitude, aspiration, memory, transition).
14. Possible visual symbols (thresholds, spirals, cages, ascents, labyrinths).
15. Possible conceptual meaning (order vs. chaos, time, modernity, human condition, cycle of existence).

CRITICAL CONSTRAINTS:
- Do NOT invent elements that are not visible in the image.
- Do NOT claim to know the photographer's internal intention.
- Use cautious, evocative, respectful artistic language:
  In English: "may symbolize...", "can be interpreted as...", "visually suggests...", "may evoke...", "invites contemplation on..."
  In Arabic: "قد يرمز إلى...", "يمكن تأويله كـ...", "يوحي بصرياً بـ...", "قد يستحضر...", "يفتح أفقاً للتأمل في..."
- For urban, interior, architectural or shopping environments: do not treat them as mere commercial buildings. Reflect upon possible deeper themes: repetition, circular forms, diagonal dynamics, reflections, modern labyrinth, order versus chaos, human solitude or movement within structured architecture. But do not force themes not visually supported.

OUTPUT REQUIREMENTS:
1. "titleArabic": ONE single strong artistic, conceptual exhibition title in Arabic (short, profound, not literal).
2. "titleEnglish": ONE single strong artistic, conceptual exhibition title in English (short, poetic, not literal).
3. "symbolismArabic": An Arabic symbolic interpretation ("رمزية الصورة") of MAXIMUM 60 Arabic words explaining what the photograph may symbolize, how the visual geometry/light supports it, and its conceptual resonance. (CRITICAL: MUST NOT EXCEED 60 ARABIC WORDS).
4. "symbolismEnglish": An English symbolic interpretation ("Photographic Symbolism") of MAXIMUM 60 English words suitable for an exhibition catalog explaining its symbolic reading. (CRITICAL: MUST NOT EXCEED 60 ENGLISH WORDS).
5. "dimensions": Detailed analytical breakdown of the 15 dimensions (1-2 sentences each) in both English and Arabic.
`;

    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let lastError: any = null;
    let response: any = null;

    for (const modelName of candidateModels) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: {
              parts: [
                {
                  inlineData: {
                    data: cleanBase64,
                    mimeType: detectedMimeType,
                  },
                },
                {
                  text: promptText,
                },
              ],
            },
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  titleArabic: {
                    type: Type.STRING,
                    description: 'ONE primary suggested artistic title in Arabic. Short, conceptual, suitable for fine art exhibition.',
                  },
                  titleEnglish: {
                    type: Type.STRING,
                    description: 'ONE primary suggested artistic title in English. Short, conceptual, suitable for fine art exhibition.',
                  },
                  symbolismArabic: {
                    type: Type.STRING,
                    description: 'Artistic symbolic interpretation in Arabic (رمزية الصورة). Strictly MAXIMUM 60 Arabic words.',
                  },
                  symbolismEnglish: {
                    type: Type.STRING,
                    description: 'Artistic symbolic interpretation in English (Photographic Symbolism). Strictly MAXIMUM 60 English words.',
                  },
                  dimensions: {
                    type: Type.OBJECT,
                    properties: {
                      mainSubject: { type: Type.STRING },
                      composition: { type: Type.STRING },
                      linesAndGeometry: { type: Type.STRING },
                      repetitionAndRhythm: { type: Type.STRING },
                      lightAndShadow: { type: Type.STRING },
                      contrast: { type: Type.STRING },
                      elementRelationships: { type: Type.STRING },
                      negativeSpace: { type: Type.STRING },
                      depthAndPerspective: { type: Type.STRING },
                      reflections: { type: Type.STRING },
                      movementAndDynamism: { type: Type.STRING },
                      peopleAndPlace: { type: Type.STRING },
                      emotionalAndCultural: { type: Type.STRING },
                      visualSymbols: { type: Type.STRING },
                      conceptualMeaning: { type: Type.STRING },
                    },
                    required: [
                      'mainSubject',
                      'composition',
                      'linesAndGeometry',
                      'repetitionAndRhythm',
                      'lightAndShadow',
                      'conceptualMeaning',
                    ],
                  },
                },
                required: ['titleArabic', 'titleEnglish', 'symbolismArabic', 'symbolismEnglish'],
              },
            },
          });

          if (response?.text) {
            break;
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`[${modelName}] attempt ${attempt} error:`, err?.message || err);
          // Wait briefly before retrying
          await new Promise((res) => setTimeout(res, attempt * 1200));
        }
      }

      if (response?.text) {
        break;
      }
    }

    if (!response || !response.text) {
      const errMsg = lastError?.message || '';
      if (errMsg.includes('503') || errMsg.includes('high demand') || errMsg.includes('UNAVAILABLE')) {
        throw new Error(
          'Gemini Vision is currently experiencing a temporary high demand spike. Please wait a few seconds and click Re-analyze.'
        );
      }
      if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED')) {
        throw new Error('API rate limit reached. Please wait 15 seconds and try again.');
      }
      throw lastError || new Error('Failed to obtain a valid response from the Gemini Vision model.');
    }

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Empty response received from Gemini Vision model.');
    }

    const parsed = JSON.parse(textOutput);

    // Enforce strict word count limits (<= 60 words) as required
    parsed.symbolismArabic = trimToMaxWords(parsed.symbolismArabic, 60);
    parsed.symbolismEnglish = trimToMaxWords(parsed.symbolismEnglish, 60);
    parsed.arabicWordCount = countWords(parsed.symbolismArabic);
    parsed.englishWordCount = countWords(parsed.symbolismEnglish);

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error during image symbolism analysis:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to analyze the photographic symbolism. Please try again.',
    });
  }
});

// Setup Vite middlewares in development or static serving in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Photographic Symbolism server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
