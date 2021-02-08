import { getClusterConfig } from './getClusterConfig';

interface StringMap {
  [s: string]: string;
}

const defaultPrefix = 'REACT_APP_';

export function processConfigEnvVariables(
  sourceObject: StringMap,
  prefix?: string,
): StringMap | undefined {
  const result: StringMap = {};
  for (const prop in sourceObject) {
    if (prop.startsWith(prefix || defaultPrefix)) {
      result[prop.replace(prefix || defaultPrefix, '')] = sourceObject[prop];
    }
  }

  return Object.keys(result).length ? result : undefined;
}

export function getApiUrl(endpoint: string): string {
  const clusterConfig = processConfigEnvVariables(
    process.env as StringMap,
    defaultPrefix,
  );
  const windowClusterConfig = getClusterConfig();

  return clusterConfig && clusterConfig[endpoint]
    ? clusterConfig[endpoint]
    : windowClusterConfig[endpoint];
}
