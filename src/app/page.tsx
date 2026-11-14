import { Works } from '@/components/sections/Works/Works';
import { BuildPicker } from '@/components/sections/BuildPicker/BuildPicker';
import { WhatIDo } from '@/components/sections/WhatIDo/WhatIDo';
import { Process } from '@/components/sections/Process/Process';
import { Testimonials } from '@/components/sections/Testimonials/Testimonials';
import { Contact } from '@/components/sections/Contact/Contact';
import { Workshop } from '@/components/concept/Workshop';
import { HeroStudio } from '@/components/hybrid/HeroStudio';
import { FillWord } from '@/components/hybrid/FillWord';
import { GlassAbout } from '@/components/hybrid/GlassAbout';
import { Approach } from '@/components/hybrid/Approach';
import { SiteShell } from '@/components/hybrid/SiteShell';
import { JsonLd } from '@/components/JsonLd/JsonLd';
import { projects } from '@/lib/projects';
import { buildProjectsListSchema } from '@/lib/schema';

export default function HomePage() {
  return (
    <SiteShell>
      <JsonLd data={buildProjectsListSchema(projects)} />
      <main id="main-content">
        <HeroStudio />
        <Works devices />
        <Approach target="uslugi"><BuildPicker /></Approach>
        <Workshop />
        <WhatIDo />
        <Process />
        <GlassAbout />
        <Testimonials />
        <Contact title={<FillWord text="Zaczynamy?" />} />
      </main>
    </SiteShell>
  );
}
