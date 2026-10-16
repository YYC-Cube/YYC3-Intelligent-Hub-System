import { LoadingScreen } from "@/app/components/ui/loading-screen"
import { t } from "@/lib/yyc3/i18n"

export default function Loading() {
  return <LoadingScreen message={t("ui.页面加载中...")} />
}
