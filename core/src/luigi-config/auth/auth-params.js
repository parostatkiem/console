const PARAMS_KEY = 'console.auth-params';
const API_KEY = 'console.api-url';

function getResponseParams(usePKCE = true) {
    if (usePKCE) {
        return {
            responseType: 'code',
            responseMode: 'query',
        };
    } else {
        return { responseType: 'token id_token' };
    }
}

export function saveAuthParamsIfPresent(location) {
    const apiUrl = new URL(location).searchParams.get('api');
    const params = new URL(location).searchParams.get('auth');
    if (params) {
        const parsed = JSON.parse(params);
        const responseParams = getResponseParams(parsed.usePKCE);
        localStorage.setItem(PARAMS_KEY, JSON.stringify({...parsed, ...responseParams}));
    }
    if (apiUrl && apiUrl !== sessionStorage.getItem(API_KEY)) {
        console.log(apiUrl)
        sessionStorage.removeItem(API_KEY);
        sessionStorage.setItem(API_KEY, apiUrl);
    }
}

export function getAuthParams() {
    return JSON.parse(localStorage.getItem(PARAMS_KEY) || "null");
}

export function getApiUrl() {
    return sessionStorage.getItem(API_KEY);
}
