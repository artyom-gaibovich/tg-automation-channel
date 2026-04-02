import path from 'path';
import { nodewhisper } from 'nodejs-whisper';

export async function extractVideo(filePath: string): Promise<string> {
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);

  console.log('Whisper processing file:', absolutePath);

  return nodewhisper(absolutePath, {
    modelName: 'large-v3-turbo',
    autoDownloadModelName: 'large-v3-turbo',
    removeWavFileAfterTranscription: true,
    withCuda: false,
    logger: console,
    whisperOptions: {
      outputInCsv: false,
      outputInJson: false,
      outputInJsonFull: false,
      outputInLrc: false,
      outputInSrt: false,
      outputInText: false,
      outputInVtt: false,
      outputInWords: false,
      translateToEnglish: false,
      wordTimestamps: false,
      splitOnWord: true,
    },
  });
}
