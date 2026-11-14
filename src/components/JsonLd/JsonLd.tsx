import { jsonLd } from '@/lib/schema';

/** Dane strukturalne schema.org. `jsonLd()` escapuje `<`, więc treść nie może zamknąć tagu <script>. */
export function JsonLd({ data }: { data: unknown }) {
  // eslint-disable-next-line react/no-danger -- jedyne miejsce wstrzykiwania JSON-LD; wejście escapowane przez jsonLd()
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />;
}
