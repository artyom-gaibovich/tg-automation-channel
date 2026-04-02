import type { UseCasePort } from '../../application/ports';

export abstract class GetTranscriptionFormatter {
  public abstract format(output: UseCasePort.GetTranscription.Output, toStr?: boolean): string;
}
