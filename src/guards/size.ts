// Flags files that grew too large to stay easy to understand.
// See docs/qualidade-codigo.md item 3.

import type { Finding, Guard } from './types.ts';

const MAX_LINES = 400;

export const scanSize: Guard = (file, content) => {
  const lines = content.split('\n').length;
  if (lines > MAX_LINES) {
    return [
      {
        guard: 'size',
        file,
        line: lines,
        message: `File has ${lines} lines (max ${MAX_LINES}) — consider splitting it`,
      },
    ];
  }
  return [];
};
