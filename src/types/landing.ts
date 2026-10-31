import { CampaignBannerSettings } from "./banner"

export interface LandingSettings extends CampaignBannerSettings {
  heroTitle: string
  heroGlowText: string
  liveBannerText: string
  congonhasStatus: string
  heroAutoplayInterval?: number
  heroTransitionDuration?: number
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  ogImage?: string
  googleVerification?: string
  googleAnalyticsId?: string
}
