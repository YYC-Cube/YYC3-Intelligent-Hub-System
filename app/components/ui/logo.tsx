'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useI18n } from '@/app/hooks/use-i18n';
import { BRAND, brandAssets } from '@/lib/yyc3/brand';

export function Logo() {
  const { t } = useI18n();

  return (
    <Link href="/" className="flex items-center space-x-3 group">
      <div className="relative w-12 h-12 overflow-hidden transition-transform duration-fast ease-standard group-hover:scale-110 motion-reduce:transition-none">
        <Image
          src={brandAssets.logoPng}
          alt={BRAND.name}
          width={48}
          height={48}
          className="object-contain drop-shadow-lg"
        />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-bold text-base sm:text-lg leading-tight brand-text whitespace-nowrap">
          {t('brand.YanYuCloudCube')}
        </span>
        <span className="text-[11px] sm:text-xs text-muted-foreground leading-tight font-medium">
          {BRAND.abbr}
        </span>
      </div>
    </Link>
  );
}
