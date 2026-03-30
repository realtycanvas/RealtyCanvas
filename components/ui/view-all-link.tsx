'use client';

import { BrandButton } from '@/components/ui/BrandButton';
import { useRouter } from 'next/navigation';

type ViewAllLinkProps = {
  href: string;
  label?: string;
  className?: string;
};

export default function ViewAllLink({ href, label = 'View All', className }: ViewAllLinkProps) {
  const router = useRouter();

  return (
    <BrandButton size="sm" className={className} onClick={() => router.push(href)}>
      {label}
    </BrandButton>
  );
}
