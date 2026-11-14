import { EMAIL } from '@/data/config';
import { SITE_URL } from '@/lib/metadata';

/** security.txt (RFC 9116) generowany przy buildzie — adresy z SITE_URL, więc pasują do domeny wdrożenia. */
export const dynamic = 'force-static';

export function GET() {
  // RFC 9116: pole Expires obowiązkowe, maks. ~rok naprzód — liczone od daty buildu
  const expires = new Date(Date.now() + 360 * 24 * 60 * 60 * 1000).toISOString();
  const body = [
    `Contact: mailto:${EMAIL}`,
    `Expires: ${expires}`,
    'Preferred-Languages: pl, en',
    `Canonical: ${SITE_URL}/.well-known/security.txt`,
    `Policy: ${SITE_URL}/polityka-prywatnosci`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
