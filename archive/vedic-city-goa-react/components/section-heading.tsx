// Shared centred heading with the accent rule used across the landing sections.
export default function SectionHeading({ title, lead }: { title: string; lead?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <h2 className="text-2xl font-bold text-brand-secondary sm:text-3xl lg:text-4xl">{title}</h2>
      <div className="mt-4 flex items-center justify-center gap-2" aria-hidden="true">
        <span className="h-px w-12 bg-linear-to-r from-transparent to-brand-primary" />
        <span className="h-1.5 w-1.5 rotate-45 bg-brand-primary" />
        <span className="h-px w-12 bg-linear-to-l from-transparent to-brand-primary" />
      </div>
      {lead && <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">{lead}</p>}
    </div>
  );
}
