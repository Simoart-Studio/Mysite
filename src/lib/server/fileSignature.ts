
/**
 * Rozpoznaje typ pliku po zawartości (magic bytes), a nie po nagłówku
 * Content-Type z przeglądarki. Zwraca MIME z allow-listy albo null.
 */
export type AllowedMime =
  | 'application/pdf'
  | 'image/png'
  | 'image/jpeg'
  | 'image/webp'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

const EXT: Record<AllowedMime, readonly string[]> = {
  'application/pdf': ['pdf'],
  'image/png': ['png'],
  'image/jpeg': ['jpg', 'jpeg'],
  'image/webp': ['webp'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
};

const startsWith = (b: Uint8Array, sig: number[], offset = 0) =>
  b.length >= offset + sig.length && sig.every((v, i) => b[offset + i] === v);

const ascii = (s: string) => [...s].map((c) => c.charCodeAt(0));

function includesAscii(b: Uint8Array, needle: string): boolean {
  return Buffer.from(b.buffer, b.byteOffset, b.byteLength).includes(needle, 0, 'latin1');
}

export function sniffMime(bytes: Uint8Array): AllowedMime | null {
  if (startsWith(bytes, ascii('%PDF-'))) return 'application/pdf';
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'image/png';
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return 'image/jpeg';
  if (startsWith(bytes, ascii('RIFF')) && startsWith(bytes, ascii('WEBP'), 8)) return 'image/webp';
  // DOCX = archiwum ZIP z dokumentem Worda w środku.
  if (startsWith(bytes, [0x50, 0x4b, 0x03, 0x04]) && includesAscii(bytes, 'word/document.xml')) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  return null;
}

/** Plik jest akceptowany tylko, gdy zawartość i rozszerzenie wskazują ten sam dozwolony typ. */
export function verifyFile(bytes: Uint8Array, filename: string): AllowedMime | null {
  const mime = sniffMime(bytes);
  if (!mime) return null;
  const ext = filename.toLowerCase().split('.').pop() ?? '';
  return EXT[mime].includes(ext) ? mime : null;
}
