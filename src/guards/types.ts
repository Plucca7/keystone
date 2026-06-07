// What an automated guard reports. Guards are deterministic and run with no AI.

export interface Finding {
  /** Which guard raised it (e.g. 'secrets', 'size'). */
  guard: string;
  file: string;
  line: number;
  message: string;
}

/** A guard inspects one file's text and returns any findings. */
export type Guard = (file: string, content: string) => Finding[];
