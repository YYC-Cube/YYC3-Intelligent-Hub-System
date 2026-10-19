'use client';

import { useI18n } from '@/app/hooks/use-i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Globe, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import { BackgroundPattern } from '../components/ui/background-pattern';

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <>
      <section className="relative py-20 bg-background">
        <BackgroundPattern variant="gradient" />
        <div className="mx-auto w-full max-w-page px-4 relative z-10">
          <div className="motion-page-enter text-center max-w-content mx-auto">
            <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-destructive/80">
              {t('pages.关于YanYuCloudCube')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t(
                'pages.我们致力于打造最先进、最易用的集成中心系统，帮助企业连接和管理各类应用，提升业务效率。'
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="mx-auto w-full max-w-page px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent/75">
                {t('pages.我们的使命')}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t(
                  'pages.YanYuCloudCube的使命是通过先进的集成技术，消除系统孤岛，实现数据和流程的无缝连接，帮助企业释放数字化转型的全部潜力。'
                )}
              </p>
              <p className="text-muted-foreground mb-4">
                {t(
                  'pages.我们相信，技术应该为人所用，而不是人为技术所困。通过简化复杂的集成过程，我们让每个企业都能轻松享受集成带来的价值。'
                )}
              </p>
              <p className="text-muted-foreground">
                {t(
                  'pages.无论是初创企业还是大型企业，我们都提供适合其规模和需求的集成解决方案，助力企业在数字化时代保持竞争力。'
                )}
              </p>
            </div>

            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/about/office.png"
                  alt={t('pages.YanYuCloudCube团队')}
                  width={600}
                  height={400}
                  priority
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-lg -z-10"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-destructive/80 to-warning rounded-lg -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="mx-auto w-full max-w-page px-4">
          <div className="text-center max-w-content mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              {t('pages.开发团队')}
            </h2>
            <p className="text-muted-foreground">
              {t(
                'pages.YanYuCloudCube由一支充满激情和创造力的团队开发，团队成员来自不同背景，但都有着共同的目标：创造最好的集成体验。'
              )}
            </p>
          </div>

          <div className="motion-stagger grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Card>
                <CardHeader className="text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                    <Image
                      src="/images/about/team-tech-lead.png"
                      alt={t('pages.技术负责人')}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardTitle>{t('pages.技术负责人')}</CardTitle>
                  <CardDescription>{t('pages.架构设计 & 技术领导')}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4">
                    {t('pages.负责系统架构设计和技术选型，拥有10年以上云服务和集成平台开发经验。')}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader className="text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                    <Image
                      src="/images/about/team-product-lead.png"
                      alt={t('pages.产品负责人')}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardTitle>{t('pages.产品负责人')}</CardTitle>
                  <CardDescription>{t('pages.产品设计 & 用户体验')}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4">
                    {t(
                      'pages.专注于产品设计和用户体验优化，致力于打造简单易用且功能强大的集成平台。'
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader className="text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                    <Image
                      src="/images/about/team-integration-expert.png"
                      alt={t('pages.集成专家')}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardTitle>{t('pages.集成专家')}</CardTitle>
                  <CardDescription>{t('pages.API集成 & 数据转换')}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4">
                    {t('pages.精通各类API和数据格式，负责开发和维护集成连接器，确保数据流畅无阻。')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="mx-auto w-full max-w-page px-4">
          <div className="text-center max-w-content mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent/75">
              {t('pages.联系我们')}
            </h2>
            <p className="text-muted-foreground">
              {t(
                'pages.我们期待听取您的反馈和建议，或者了解您的集成需求。请通过以下方式联系我们。'
              )}
            </p>
          </div>

          <div className="motion-stagger grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{t('pages.联系信息')}</CardTitle>
                  <CardDescription>{t('pages.您可以通过以下方式联系我们')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-accent mr-3" />
                    <span>china@0379.email</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-accent mr-3" />
                    <span>www.yanyucloud.com</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-accent mr-3" />
                    <span>{t('pages.中国，北京市海淀区')}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-accent mr-3" />
                    <span>+86 10 8888 8888</span>
                  </div>
                  <div className="flex items-center">
                    <Github className="h-5 w-5 text-accent mr-3" />
                    <span>github.com/yanyucloud</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{t('pages.公司信息')}</CardTitle>
                  <CardDescription>{t('pages.YanYuCloudCube 技术有限公司')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    {t(
                      'pages.YanYuCloudCube 成立于2020年，是一家专注于云集成和数据互联的技术公司。我们的团队由来自顶尖科技公司的专业人士组成，拥有丰富的云服务、API集成和数据处理经验。'
                    )}
                  </p>
                  <p className="text-muted-foreground">
                    {t(
                      'pages.我们的产品服务于各行各业的企业客户，从初创公司到大型企业，帮助他们实现系统互联、数据流通和业务流程自动化。'
                    )}
                  </p>
                  <p className="text-muted-foreground">
                    {t('pages.© YanYuCloudCube {year}. 保留所有权利。', {
                      year: String(new Date().getFullYear()),
                    })}
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
