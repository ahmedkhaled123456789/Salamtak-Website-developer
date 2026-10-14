import React from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import { PlusIcon } from 'lucide-react';

export interface AccordionItemData {
  id: string;
  title: string;
  content: React.ReactNode;
}

export function Accordion({ items, defaultOpen }: {items: AccordionItemData[];defaultOpen?: string;}) {
  return (
    <RadixAccordion.Root type="single" collapsible defaultValue={defaultOpen} className="divide-y divide-line border-y border-line">
      {items.map((item) =>
      <RadixAccordion.Item key={item.id} value={item.id}>
          <RadixAccordion.Header>
            <RadixAccordion.Trigger className="group flex w-full items-center justify-between gap-6 py-6 text-start text-[17px] font-semibold text-ink transition-colors duration-150 ease-out hover:text-brand-dark">
              <span>{item.title}</span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-brand transition-[transform,background-color] duration-200 ease-out group-data-[state=open]:rotate-45 group-data-[state=open]:bg-mint">
                <PlusIcon className="h-4 w-4" aria-hidden />
              </span>
            </RadixAccordion.Trigger>
          </RadixAccordion.Header>
          <RadixAccordion.Content className="overflow-hidden data-[state=closed]:animate-[accordion-up_200ms_cubic-bezier(0.23,1,0.32,1)] data-[state=open]:animate-[accordion-down_220ms_cubic-bezier(0.23,1,0.32,1)]">
            <div className="max-w-3xl pb-6 pe-12 text-[15px] leading-relaxed text-muted">{item.content}</div>
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      )}
    </RadixAccordion.Root>);

}