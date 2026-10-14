import React from 'react';
import { Breadcrumbs, type Crumb } from '../ui/Breadcrumbs';
import { Container } from '../ui/Container';
import { SmartImage } from '../ui/SmartImage';

interface PageHeroProps {
  title: string;
  body?: string;
  crumbs: Crumb[];
  image?: string;
  imageAlt?: string;
  children?: React.ReactNode;
}

/** Shared inner-page hero. With an image it becomes an editorial split. */
export function PageHero({ title, body, crumbs, image, imageAlt = '', children }: PageHeroProps) {
  return (
    <section className="border-b border-line bg-ivory">
      <Container className={image ? 'grid items-center gap-10 py-12 lg:grid-cols-[1.1fr_1fr] lg:py-16' : 'py-12 lg:py-16'}>
        <div>
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-6 max-w-3xl font-display text-[42px] font-medium leading-[1.04] tracking-[-0.02em] text-ink sm:text-[56px]">{title}</h1>
          {body && <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{body}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
        {image && <SmartImage src={image} alt={imageAlt} priority className="aspect-[4/3] rounded-3xl lg:aspect-[5/4]" />}
      </Container>
    </section>);

}