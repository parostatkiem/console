const clusterConfig = window['clusterConfig'] || INJECTED_CLUSTER_CONFIG;
const domain = clusterConfig?.domain || 'kyma.local';
const localDomain = 'console-dev.' + domain;
const isLocalDev = window.location.href.startsWith(
  `http://${localDomain}:4200`
);

export const config = {
  domain,
  localDomain,
  serviceCatalogModuleUrl: isLocalDev ? 'http://console-dev.'+ domain + ':8000' : 'https://catalog.' + domain,
  addOnsModuleUrl: isLocalDev ? 'http://console-dev.'+ domain + ':8004' : 'https://addons.' + domain,
  logsModuleUrl: isLocalDev ? 'http://console-dev.'+ domain + ':8005' : 'https://logs.' + domain,
  coreModuleUrl: isLocalDev ? 'http://console-dev.'+ domain +':8889' : 'https://core-ui.' + domain,
  pamelaApiUrl: 'https://pamela.' + domain,
  graphqlApiUrl: 'https://console-backend.' + domain + '/graphql',
  apiserverUrl: 'https://apiserver.' + domain,
  namespaceAdminGroupName: 'runtimeNamespaceAdmin',
  runtimeAdminGroupName: 'runtimeAdmin',
  ...clusterConfig
};
