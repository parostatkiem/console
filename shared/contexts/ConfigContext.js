import React, { createContext, useContext } from 'react';
import { getClusterConfig } from '../utils/getClusterConfig';

export const ConfigContext = createContext({});

const DEFAULT_PREFIX = 'REACT_APP_';

export const configFromEnvVariables = (
  env,
  fallback = {},
  prefix = DEFAULT_PREFIX,
) =>
  Object.keys(env).reduce(
    (acc, prop) =>
      prop.startsWith(prefix)
        ? { ...acc, [prop.replace(prefix, '')]: env[prop] }
        : acc,
    fallback,
  );

export const fromConfig = clusterConfig => endpoint => clusterConfig[endpoint];

export const ConfigProvider = ({
  env = process.env,
  children,
  prefix = DEFAULT_PREFIX,
}) => {
  const clusterConfig = getClusterConfig();
  const config = configFromEnvVariables(env, clusterConfig, prefix);
  return (
    <ConfigContext.Provider value={{ fromConfig: fromConfig(config) }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
