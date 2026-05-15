import { Nav }          from '@/components/Nav/Nav';
import { Footer }       from '@/components/Footer/Footer';
import { NoiseOverlay } from '@/components/NoiseOverlay/NoiseOverlay';
import { FlowField }    from '@/components/FlowField/FlowField';
import { Hero }         from '@/components/sections/Hero/Hero';
import { Works }        from '@/components/sections/Works/Works';
import { About }        from '@/components/sections/About/About';
import { WhatIDo }      from '@/components/sections/WhatIDo/WhatIDo';
import { Currently }    from '@/components/sections/Currently/Currently';
import { Contact }      from '@/components/sections/Contact/Contact';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';

export default function HomePage() {
  return (
    <>
      <ErrorBoundary>
        <FlowField />
      </ErrorBoundary>
      <NoiseOverlay />
      <Nav />
      <main id="main-content">
        <Hero />
        <ErrorBoundary>
          <Works />
        </ErrorBoundary>
        <About />
        <WhatIDo />
        <Currently />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
