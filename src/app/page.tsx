import { Nav }          from '@/components/Nav/Nav';
import { Footer }       from '@/components/Footer/Footer';
import { Hero }         from '@/components/sections/Hero/Hero';
import { Works }        from '@/components/sections/Works/Works';
import { BuildPicker }  from '@/components/sections/BuildPicker/BuildPicker';
import { Process }      from '@/components/sections/Process/Process';
import { About }        from '@/components/sections/About/About';
import { WhatIDo }      from '@/components/sections/WhatIDo/WhatIDo';
import { Testimonials } from '@/components/sections/Testimonials/Testimonials';
import { Contact }      from '@/components/sections/Contact/Contact';
import { Wave }         from '@/components/Wave/Wave';
import { projects }     from '@/lib/projects';
import { buildProjectsListSchema, jsonLd } from '@/lib/schema';

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(buildProjectsListSchema(projects)) }}
      />
      <Nav />
      <main id="main-content">
        <Hero />
        <Wave from="var(--cream)" to="var(--white)" shape={0} />
        <Works />
        <Wave from="var(--white)" to="var(--cream)" shape={1} />
        <BuildPicker />
        <Wave from="var(--cream)" to="var(--white)" shape={2} />
        <WhatIDo />
        <Wave from="var(--white)" to="var(--cream)" shape={0} />
        <Process />
        <Wave from="var(--cream)" to="var(--white)" shape={1} />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
