export interface UserInfo {
  id: number
  email: string,
  business_color: string,
  business_logo: string,
  business_name: string, 
  business_url: string,
  business_qr?: string,
  api_url: string
}

export interface AppConfig {
  api_url?: string
}

export interface CategoryData {
  id: number,
  user: number,
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