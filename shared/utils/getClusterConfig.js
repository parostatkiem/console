const windowClusterConfig = window.clusterConfig;
const configToRead = Object.keys(windowClusterConfig || {}).length
  ? windowClusterConfig
  : { domain: 'kyma.local' };

const domain = configToRead.domain;
const graphqlApiUrl = `https://console-backend.${domain}/graphql`;
const graphqlApiUrlLocal = `http://console-dev.${domain}:3000/graphql`;
const subscriptionsApiUrl = `wss://console-backend.${domain}/graphql`;
const subscriptionsApiUrlLocal = `ws://console-dev.${domain}:3000/graphql`;

export const getClusterConfig = () => ({
  domain,
  apiserverUrl: 'https://apiserver.' + domain,
  graphqlApiUrl,
  graphqlApiUrlLocal,
  subscriptionsApiUrl,
  subscriptionsApiUrlLocal,
  pamelaApiUrl: 'https://pamela.' + domain,
  ...configToRead,
});
