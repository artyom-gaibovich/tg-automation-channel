import { IO } from '../IO';

export abstract class GetTranscriptionFormatter {
  public abstract format(output: IO.GetTranscription.Output): string;
}
