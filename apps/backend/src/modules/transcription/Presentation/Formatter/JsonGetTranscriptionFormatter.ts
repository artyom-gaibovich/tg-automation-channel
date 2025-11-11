import { GetTranscriptionFormatter } from './GetTranscriptionFormatter';
import { IO } from '../IO';

export class JsonGetTranscriptionFormatter extends GetTranscriptionFormatter {
  public format(output: IO.GetTranscription.Output): string {
    const { prompt, ...props } = output;
    return `
    ${prompt}
    ${JSON.stringify(props)}
    `;
  }
}
