import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Rocket
} from 'lucide-react'
import { v4 as uuid } from 'uuid'

export type FieldProps = {
  label: string
  id: string
}

type SideBarProps = {
  icon: React.ReactNode
} & FieldProps

export const SIDEBAR_MENU: SideBarProps[] = [
  {
    id: uuid(),
    label: 'dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    id: uuid(),
    label: 'automations',
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    id: uuid(),
    label: 'integrations',
    icon: <Rocket className="w-5 h-5" />,
  },
  {
    id: uuid(),
    label: 'settings',
    icon: <Settings className="w-5 h-5" />,
  },
]
