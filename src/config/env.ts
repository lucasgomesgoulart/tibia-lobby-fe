// Centraliza leitura de variáveis de ambiente do frontend
// Use sempre NEXT_PUBLIC_* para estar disponível no cliente

const normalize = (url?: string) => {
  if (!url) return undefined;
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const API_URL = normalize(process.env.NEXT_PUBLIC_API_URL) || 'http://localhost:3000';
export const SOCKET_URL = normalize(process.env.NEXT_PUBLIC_SOCKET_URL) || API_URL;

export const isBrowser = typeof window !== 'undefined';

export const buildUrl = (path: string, base: string = API_URL) => {
  if (!path) return base;
  if (path.startsWith('http')) return path;
  const left = base.endsWith('/') ? base.slice(0, -1) : base;
  const right = path.startsWith('/') ? path : `/${path}`;
  return `${left}${right}`;
};

export default {
  API_URL,
  SOCKET_URL,
  isBrowser,
  buildUrl,
};
