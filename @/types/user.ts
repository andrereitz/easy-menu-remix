import { AppConfig } from "./global"

export interface UserInfo {
  id: number
  email: string,
  business_color: string,
  business_logo: string,
  business_name: string, 
  business_url: string,
  business_qr?: string,
}

export interface UserLoaderData {
  config: AppConfig,
  data: UserInfo
}