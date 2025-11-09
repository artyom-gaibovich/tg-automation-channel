import { IO } from '../IO';

export class GetTranscriptionFormatter {
  public static format(output: IO.GetTranscription.Output): string {
    const { prompt, ...props } = output;
    return `
    ${prompt}
    ${JSON.stringify(props)}
    `;
  }
}
