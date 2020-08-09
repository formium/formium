import ansiEscapes from 'ansi-escapes';

export function eraseLines(numberOfLines: number) {
  return ansiEscapes.eraseLines(numberOfLines);
}
