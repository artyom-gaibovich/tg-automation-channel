import path from 'path';
import { nodewhisper } from 'nodejs-whisper';

function stripTimestamps(str: string): string {
  return str.replace(
    /\[\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}\]\s*/g,
    ''
  );
}

export async function extractVideo(filePath: string): Promise<string> {
  const p = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);

  return stripTimestamps(
    await nodewhisper(p, {
      modelName: 'large-v3-turbo', //Downloaded models name
      autoDownloadModelName: 'large-v3-turbo', // (optional) auto download a model if model is not present
      removeWavFileAfterTranscription: true, // (optional) remove wav file once transcribed
      withCuda: false, // (optional) use cuda for faster processing
      logger: console, // (optional) Logging instance, defaults to console
      whisperOptions: {
        outputInCsv: false, // get output result in csv file
        outputInJson: false, // get output result in json file
        outputInJsonFull: false, // get output result in json file including more information
        outputInLrc: false, // get output result in lrc file
        outputInSrt: false, // get output result in srt file
        outputInText: false, // get output result in txt file
        outputInVtt: false, // get output result in vtt file
        outputInWords: false, // get output result in wts file for karaoke
        translateToEnglish: false, // translate from source language to english
        wordTimestamps: false, // word-level timestamps
        //timestamps_length: 200, // amount of dialogue per timestamp pair
        splitOnWord: true, // split on word rather than on token
      },
    })
  );
}

/*const MODELS_LIST = [
  'tiny',
  'tiny.en',
  'base',
  'base.en',
  'small',
  'small.en',
  'medium',
  'medium.en',
  'large-v1',
  'large',
  'large-v3-turbo',
];*/
