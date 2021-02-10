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
        localStorage.setItem(PARAMS_KEY, JSON.stringify({...decoded, ...responseParams}));
    }
}

export function getInitParams() {
    return JSON.parse(localStorage.getItem(PARAMS_KEY) || "null");
}
