import { getApiUrl } from './auth/auth-params'

var clusterConfig = window['clusterConfig'] || INJECTED_CLUSTER_CONFIG;
const k8sDomain = getApiUrl() || 'kyma.local';

console.log(clusterConfig)
export const config = {
  domain: k8sDomain,
  localDomain: 'console-dev.' + k8sDomain,
  serviceCatalogModuleUrl: '8000',
  addOnsModuleUrl: '8004',
  logsModuleUrl: '8005',
  coreModuleUrl: '8889',
  graphqlApiUrl: 'https://console-backend.' + k8sDomain + '/graphql',
  apiserverUrl: 'https://apiserver.' + k8sDomain,
  disabledNavigationNodes: '',
  namespaceAdminGroupName: 'runtimeNamespaceAdmin',
  runtimeAdminGroupName: 'runtimeAdmin',
  systemNamespaces:
    'compass-system istio-system knative-eventing knative-serving kube-public kube-system kyma-backup kyma-installer kyma-integration kyma-system natss kube-node-lease kubernetes-dashboard serverless-system',
    ...clusterConfig
};
