import createEncoder from 'json-url';

const PARAMS_KEY = 'console.init-params';
const encoder = createEncoder('lzstring');

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

export async function saveInitParamsIfPresent(location) {
    const params = new URL(location).searchParams.get('auth');
    if (params) {
        const decoded = await encoder.decompress(params);
        const responseParams = getResponseParams(decoded.usePKCE);
        saveInitParams({...decoded, ...responseParams});
    }
}

export function saveInitParams(params) {
    localStorage.setItem(PARAMS_KEY, JSON.stringify(params));
}

export function getInitParams() {
    return JSON.parse(localStorage.getItem(PARAMS_KEY) || "null");
}
