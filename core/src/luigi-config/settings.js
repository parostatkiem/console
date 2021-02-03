import { config } from './config';

const createHeader = () => {
  // const logo =
  //   config && config.headerLogoUrl
  //     ? config.headerLogoUrl
  //     : '/assets/logo.svg';
  // const title = config?.headerTitle || null;
  
  // const favicon = config ? config.faviconUrl : undefined;
  const logo = '/assets/logo.svg';
  const title = null;
  
  const favicon = 'favicon.ico';
  return {
    logo,
    title,
    favicon
  };
};

export const settings = 
{
  responsiveNavigation: 'simpleMobileOnly',
  sideNavFooterText: '',
  header: createHeader(), 
  appLoadingIndicator: {
    hideAutomatically: false
  },
  customSandboxRules: ['allow-downloads'],
};