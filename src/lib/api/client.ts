import { API_URL, buildUrl } from '@/config/env';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  auth?: boolean; // anexa Authorization se houver token
  signal?: AbortSignal;
}

export interface ApiErrorShape {
  status: number;
  message: string;
  details?: unknown;
}

export class ApiError extends Error implements ApiErrorShape {
  status: number;
  details?: unknown;
  constructor(init: ApiErrorShape) {
    super(init.message);
    this.name = 'ApiError';
    this.status = init.status;
    this.details = init.details;
  }
}

const jsonOrNull = async (res: Response) => {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text as unknown;
  }
};

export async function apiFetch<T = unknown>(path: string, opts: ApiOptions = {}): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body,
    auth = true,
    signal,
  } = opts;

  const url = buildUrl(path, API_URL);

  const finalHeaders: Record<string, string> = {
    'Accept': 'application/json',
    ...headers,
  };

  let payload: BodyInit | undefined = undefined;
  if (body !== undefined) {
    finalHeaders['Content-Type'] = finalHeaders['Content-Type'] || 'application/json';
    payload = finalHeaders['Content-Type'].includes('application/json')
      ? JSON.stringify(body)
      : (body as BodyInit);
  }

  if (auth && typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: payload,
    signal,
  });

  const data = await jsonOrNull(res);

  if (!res.ok) {
    const message = (data && (data.message || data.error || data.msg)) || res.statusText || 'Request failed';
    throw new ApiError({ status: res.status, message, details: data });
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, options?: ApiOptions) => apiFetch<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: ApiOptions) => apiFetch<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: ApiOptions) => apiFetch<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: ApiOptions) => apiFetch<T>(path, { ...options, method: 'PATCH', body }),
  del: <T>(path: string, options?: ApiOptions) => apiFetch<T>(path, { ...options, method: 'DELETE' }),
};

export default api;
