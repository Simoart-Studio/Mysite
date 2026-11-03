import { Nav }          from '@/components/Nav/Nav';
import { Footer }       from '@/components/Footer/Footer';
import { NoiseOverlay } from '@/components/NoiseOverlay/NoiseOverlay';
import { FlowField }    from '@/components/FlowField/FlowField';
import { Hero }         from '@/components/sections/Hero/Hero';
import { Works }        from '@/components/sections/Works/Works';
import { BuildPicker }  from '@/components/sections/BuildPicker/BuildPicker';
import { Process }      from '@/components/sections/Process/Process';
import { About }        from '@/components/sections/About/About';
import { WhatIDo }      from '@/components/sections/WhatIDo/WhatIDo';
import { Testimonials } from '@/components/sections/Testimonials/Testimonials';
import { Contact }      from '@/components/sections/Contact/Contact';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import { projects }     from '@/lib/projects';
import { buildProjectsListSchema, jsonLd } from '@/lib/schema';

export default function HomePage() {
  // Do mini-talii w hero: dwa projekty ze zrzutami + rewers w środku
  const withThumbs = projects.filter((p) => p.thumbnail);
  const heroDeck = [withThumbs[0], projects[0], withThumbs[1]]
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map(({ slug, name, thumbnail }) => ({ slug, name, thumbnail }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(buildProjectsListSchema(projects)) }}
      />
      <ErrorBoundary>
        <FlowField />
      </ErrorBoundary>
      <NoiseOverlay />
      <Nav />
      <main id="main-content">
        <Hero deck={heroDeck} total={projects.length} />
        <Works />
        <BuildPicker />
        <WhatIDo />
        <Process />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
