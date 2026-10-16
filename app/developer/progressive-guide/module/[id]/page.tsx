import ClientLoader from "./client-loader"

const MODULE_IDS = [
  "component-basics", "state-management", "routing", "api-integration",
  "data-fetching", "styling", "testing", "deployment", "performance", "security",
]

export function generateStaticParams() {
  return MODULE_IDS.map((id) => ({ id }))
}

export default function ModuleDetailPage() {
  return <ClientLoader />
}
