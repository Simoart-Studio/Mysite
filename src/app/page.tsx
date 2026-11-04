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
import { projects }     from '@/lib/projects';
import { buildProjectsListSchema, jsonLd } from '@/lib/schema';

export default function HomePage() {
  const shots = ['barberspace', 'lingua']
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => !!p?.thumbnail)
    .map((p) => ({ ...p.thumbnail!, name: p.name }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(buildProjectsListSchema(projects)) }}
      />
      <Nav />
      <main id="main-content">
        <Hero shots={shots} />
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
