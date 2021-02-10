import OpenIdConnect from '@luigi-project/plugin-auth-oidc';
import { getInitParams } from './init-params';
import createEncoder from 'json-url';

export let groups;

async function fetchOidcProviderMetadata(issuerUrl) {
  try {
    const response = await fetch(`${issuerUrl}.well-known/openid-configuration`);
    return await response.json();
  }
  catch (e) {
    alert('Cannot fetch oidc provider metadata, see log console for more details');
    console.error('cannot fetch OIDC metadata', e);
  }
}

export const createAuth = async () => {
  const params = getInitParams();
  if (!params) {
    alert("No auth params provided! In future you'll get to login with your service account.");
    
    const encoder = createEncoder('lzstring');
    const data = {
      issuerUrl:"https://kyma.eu.auth0.com/",
      clientId:"5W89vBHwn2mu7nT0uzvoN4xCof0h4jtN",
      kubernetesApiUrl: "api.biggie.hasselhoff.shoot.canary.k8s-hana.ondemand.com",
    }
    const encoded = await encoder.compress(data);
    console.log(`for now just use query param: ?auth=${encoded}`)
    return {};
  }

  const { issuerUrl, clientId, responseType, responseMode } = params;

  const providerMetadata = await fetchOidcProviderMetadata(issuerUrl);
  return {
    use: 'openIdConnect',
    openIdConnect: {
        idpProvider: OpenIdConnect,
        authority: issuerUrl,
        client_id: clientId,
        scope:
        'audience:server:client_id:kyma-client audience:server:client_id:console openid email profile groups',
        response_type: responseType,
        response_mode: responseMode,
        automaticSilentRenew: true,
        loadUserInfo: false,
        logoutUrl: 'logout.html',
        metadata: {
          ...providerMetadata,
          end_session_endpoint: 'logout.html',
        },
        userInfoFn: (_, authData) => {
          groups = authData.profile['http://k8s/groups'];
          return Promise.resolve({
            name: authData.profile.name,
            email: authData.profile.email
          });
        },
    },

    events: {
        onLogout: () => {
        console.log('onLogout');
        },
        onAuthExpired: () => {
        console.log('onAuthExpired');
        },
        // TODO: define luigi-client api for getting errors
        onAuthError: err => {
        console.log('authErrorHandler 1', err);
        }
    },
    storage: 'none',
  };
}
