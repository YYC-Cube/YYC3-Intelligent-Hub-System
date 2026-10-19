'use client';

import { useI18n } from '@/app/hooks/use-i18n';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { dataIntegrationName } from '@/lib/yyc3/i18n/data';
import { CheckCircle2, Copy, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';
import { useWizard } from './wizard-context';
import { WizardNavigation } from './wizard-navigation';

export function StepCompletion() {
  const { formData } = useWizard();
  const { toast } = useToast();
  const { t } = useI18n();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  // 使用 React 提供的稳定标识符替代渲染期 Math.random()，
  // 既保证 SSR/CSR 水合一致，也满足 react-hooks/purity 的纯函数约束。
  const reactId = useId();
  const integrationId = `int_${reactId.replace(/[^a-zA-Z0-9]/g, '')}`;

  const handleCopyId = () => {
    navigator.clipboard.writeText(integrationId);
    setCopied(true);
    toast({
      title: t('install.已复制'),
      description: t('install.集成ID已复制到剪贴板'),
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComplete = () => {
    router.push('/integrations');
  };

  return (
    <div className="space-y-6">
      <div className="motion-page-enter flex flex-col items-center justify-center py-6">
        <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">{t('install.安装成功！')}</h2>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          {t('install.您已成功安装并配置了 {name} 集成应用。现在您可以开始使用它了。', {
            name: dataIntegrationName(formData.name),
          })}
        </p>

        <div className="bg-muted p-4 rounded-lg border w-full max-w-md mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">{t('install.集成ID')}</span>
            <Button variant="ghost" size="sm" onClick={handleCopyId} className="gap-1 h-7">
              {copied ? t('install.已复制') : t('install.复制')}
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          <div className="bg-muted p-2 rounded text-sm font-mono">{integrationId}</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
          <Button className="flex-1 gap-2" onClick={handleComplete}>
            {t('install.完成')}
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            {t('install.查看文档')}
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <WizardNavigation />
    </div>
  );
}
