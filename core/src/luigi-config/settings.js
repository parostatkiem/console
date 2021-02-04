import { config } from './config';

export const settings = 
{
  responsiveNavigation: 'simpleMobileOnly',
  sideNavFooterText: '',
  header: {
    logo: config.headerLogoUrl,
    title: config.headerTitle,
    favicon: config.faviconUrl,
  }, 
  appLoadingIndicator: {
    hideAutomatically: false
  },
  customSandboxRules: ['allow-downloads'],
};