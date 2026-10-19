'use client';

import type React from 'react';

import { useI18n } from '@/app/hooks/use-i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, MessageSquare, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import { BackgroundPattern } from '../components/ui/background-pattern';

export default function ContactPage() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 模拟表单提交
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: t('pages.消息已发送'),
      description: t('pages.感谢您的留言，我们会尽快回复您。'),
    });

    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
    setIsSubmitting(false);
  };

  return (
    <>
      <section className="relative py-20 bg-background">
        <BackgroundPattern variant="gradient" />
        <div className="mx-auto w-full max-w-page px-4 relative z-10">
          <div className="motion-page-enter text-center max-w-content mx-auto">
            <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-destructive/80">
              {t('pages.联系我们')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t(
                'pages.我们期待听到您的声音。无论是产品咨询、技术支持还是合作机会，请随时与我们联系。'
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="mx-auto w-full max-w-page px-4">
          <div className="motion-stagger grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('pages.发送消息')}</CardTitle>
                  <CardDescription>{t('pages.填写下面的表单，我们会尽快回复您')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('pages.姓名')}</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder={t('pages.您的姓名')}
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('pages.电子邮箱')}</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">{t('pages.主题')}</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder={t('pages.消息主题')}
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">{t('pages.消息内容')}</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder={t('pages.请输入您的消息内容...')}
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {t('pages.发送中...')}
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          {t('pages.发送消息')}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{t('pages.联系方式')}</CardTitle>
                  <CardDescription>{t('pages.您可以通过以下方式直接联系我们')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="flex items-start">
                    <div className="bg-brand-100 p-3 rounded-full mr-4">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{t('pages.电子邮件')}</h3>
                      <p className="text-muted-foreground">china@0379.email</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('pages.全天候监控，24小时内回复')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{t('pages.电话')}</h3>
                      <p className="text-muted-foreground">+86 10 8888 8888</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('pages.工作日 9:00-18:00')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-accent/15 p-3 rounded-full mr-4">
                      <MessageSquare className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{t('pages.在线客服')}</h3>
                      <p className="text-muted-foreground">{t('pages.通过网站右下角的聊天窗口')}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('pages.工作日 9:00-22:00')}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="font-medium mb-3">{t('pages.公司地址')}</h3>
                    <p className="text-muted-foreground">{t('pages.中国北京市海淀区')}</p>
                    <p className="text-muted-foreground">{t('pages.中关村科技园区')}</p>
                    <p className="text-muted-foreground">{t('pages.创新大厦B座 15层')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="mx-auto w-full max-w-page px-4">
          <div className="text-center max-w-content mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent/75">
              {t('pages.常见问题')}
            </h2>
            <p className="text-muted-foreground">
              {t('pages.以下是我们收到的一些常见问题。如果您有其他问题，请随时联系我们。')}
            </p>
          </div>

          <div className="motion-stagger grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t('pages.如何开始使用YanYuCloudCube集成中心？')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t(
                      'pages.注册账户后，您可以浏览我们的集成目录，选择您需要的集成应用，按照向导完成配置即可开始使用。我们提供详细的文档和视频教程，帮助您快速上手。'
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('pages.YanYuCloudCube支持哪些集成应用？')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t(
                      'pages.我们支持数百种流行的SaaS应用和服务，包括CRM、营销自动化、电子商务、项目管理、通信协作等多个领域。您可以在集成目录中浏览所有支持的应用。'
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('pages.如何获取技术支持？')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t(
                      'pages.我们提供多种支持渠道，包括在线文档、视频教程、社区论坛和客服支持。企业用户还可以获得专属的技术支持服务。您可以通过电子邮件、电话或在线聊天联系我们的支持团队。'
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t('pages.YanYuCloudCube的数据安全如何保障？')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t(
                      'pages.我们采用企业级安全措施保护您的数据，包括端到端加密、安全的数据传输和存储、严格的访问控制和定期安全审计。我们遵循国际安全标准和最佳实践，确保您的数据安全可靠。'
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
