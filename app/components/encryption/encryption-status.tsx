'use client';

import { useEncryption } from '@/app/context/encryption-context';
import { useI18n } from '@/app/hooks/use-i18n';
import { Badge } from '@/components/ui/badge';
import { Lock, Unlock } from 'lucide-react';

export function EncryptionStatus() {
  const { encryptionStatus, encryptionSettings } = useEncryption();
  const { t } = useI18n();

  if ((encryptionStatus as string) === 'loading') {
    return (
      <Badge variant="outline" className="bg-muted text-muted-foreground">
        <span>{t('encryption.加载中...')}</span>
      </Badge>
    );
  }

  if (encryptionStatus === 'enabled' && encryptionSettings.enabled) {
    return (
      <Badge variant="success">
        <Lock className="h-3 w-3 mr-1" />
        {t('encryption.已加密')}
      </Badge>
    );
  }

  return (
    <Badge variant="warning">
      <Unlock className="h-3 w-3 mr-1" />
      {t('encryption.未加密')}
    </Badge>
  );
}
