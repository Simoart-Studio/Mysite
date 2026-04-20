import { Nav }        from '@/components/Nav/Nav';
import { Footer }     from '@/components/Footer/Footer';
import { NoiseOverlay } from '@/components/NoiseOverlay/NoiseOverlay';
import { Marquee }    from '@/components/Marquee/Marquee';
import { Hero }       from '@/components/sections/Hero/Hero';
import { Works }      from '@/components/sections/Works/Works';
import { WhatIDo }    from '@/components/sections/WhatIDo/WhatIDo';
import { About }      from '@/components/sections/About/About';
import { Currently }  from '@/components/sections/Currently/Currently';
import { Contact }    from '@/components/sections/Contact/Contact';

export default function HomePage() {
  return (
    <>
      <NoiseOverlay />
      <Nav />
      <main id="main-content">
        <Hero />
        <Marquee />
        <Works />
        <WhatIDo />
        <About />
        <Currently />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
