import { GetTranscriptionFormatter } from './get-transcription.formatter';
import type { UseCasePort } from '../../application/ports';

export class JsonGetTranscriptionFormatter extends GetTranscriptionFormatter {
  public format(output: UseCasePort.GetTranscription.Output, toStr = true): string {
    const { prompt, ...props } = output;

    const transcriptionData = props.transcription as {
      transcription: Array<{ text: string }>;
    };
    props.transcription = toStr
      ? transcriptionData.transcription.map((item) => item.text).join(' ')
      : props.transcription;

    return `
    ${prompt}
    ${JSON.stringify(props)}
    `;
  }
}
