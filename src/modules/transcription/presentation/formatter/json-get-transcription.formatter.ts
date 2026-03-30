import { GetTranscriptionFormatter } from './get-transcription.formatter';
import type { UseCasePort } from '../../application/ports';

export class JsonGetTranscriptionFormatter extends GetTranscriptionFormatter {
  public format(output: UseCasePort.GetTranscription.Output, toStr = true): string {
    const { prompt, ...props } = output;

    // @ts-ignore
    console.log(props.transcription.transcription);

    props.transcription = toStr
      ? // @ts-expect-error     // @ts-ignore
        props.transcription?.transcription.map((item: any) => item.text).join(' ')
      : props.transcription;

    return `
    ${prompt}
    ${JSON.stringify(props)}
    `;
  }
}
