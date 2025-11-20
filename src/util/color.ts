export function decToHex(dec: number): string {
  const hex = dec.toString(16);
  return "#" + hex.padStart(6, "0");
}
