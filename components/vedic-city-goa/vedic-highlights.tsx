import { Home, Landmark, Signpost, Trees, MapPin, Building2, ShieldCheck, Zap } from 'lucide-react';
import SectionHeading from './section-heading';
import { HIGHLIGHTS } from './data';

const ICONS = {
  home: Home,
  township: Landmark,
  signs: Signpost,
  tree: Trees,
  marker: MapPin,
  building: Building2,
  shield: ShieldCheck,
  bolt: Zap,
} as const;

export default function VedicHighlights() {
  return (
    <section id="highlights" className="scroll-mt-20 bg-gray-50 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Highlights" />

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {HIGHLIGHTS.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <article
                key={item.title}
                className="rounded-xl border border-gray-200 bg-white p-5 text-center transition-shadow hover:shadow-lg sm:p-6"
              >
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/15">
                  <Icon className="h-5 w-5 text-brand-secondary" aria-hidden="true" />
                </span>
                <h3 className="text-sm font-semibold text-brand-secondary sm:text-base">{item.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{item.desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
