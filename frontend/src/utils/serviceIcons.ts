import {
  Code2,
  Globe,
  Smartphone,
  Boxes,
  Workflow,
  BarChart3,
  type LucideIcon,
} from 'lucide-react'

export const serviceIconMap: Record<string, LucideIcon> = {
  code: Code2,
  globe: Globe,
  smartphone: Smartphone,
  boxes: Boxes,
  workflow: Workflow,
  chart: BarChart3,
}

export function getServiceIcon(icon: string): LucideIcon {
  return serviceIconMap[icon] ?? Code2
}
