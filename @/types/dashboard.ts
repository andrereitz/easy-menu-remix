import { AppConfig } from "./global"
import { UserInfo } from "./user"

export interface CategoryData {
  id: number,
  user: number,
  title: string
}

export interface CategoryDataEdit {
  id: number,
  title: string
}

export interface DashboardData {
  user: UserInfo,
  config: AppConfig,
  categories: CategoryData[]
}

export interface MenuItem {
  category?: number,
  description?: string,
  id: number,
  price: number,
  title: string,
  user: number,
  mediaid?: number
}

export interface ActionPayload {
  status: string,
  message?: string
}