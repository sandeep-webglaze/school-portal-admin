import { API_HOST } from 'constants/server';
import { USER_TOKEN_STORAGE_KEY } from '../constants';

export async function waitForSeconds(seconds: number) {
  return new Promise((res) => {
    setTimeout(res, 1000 * seconds);
  });
}

export function isNotEmpty<T>(obj: T | null | undefined): obj is T {
  return !isEmpty(obj);
}

export function isEmpty(obj: unknown): obj is null | undefined {
  return obj == null || obj == undefined;
}

export function isEmptyObj(obj: any): boolean {
  return Object.keys(obj).length === 0;
}

export function getUserToken() {
  if (typeof window !== 'undefined') return localStorage.getItem(USER_TOKEN_STORAGE_KEY) ?? undefined;
}

export function saveUserToken(token: string) {
  return window.localStorage.setItem(USER_TOKEN_STORAGE_KEY, token);
}

export function removeUserToken() {
  return window.localStorage.removeItem(USER_TOKEN_STORAGE_KEY);
}

export function generateAuthHeaders() {
  return {
    Authorization: `Bearer ${getUserToken()}`
  };
}

export function removeEmpty(obj: any): any {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v != null && v != '')
      .map(([k, v]) => [k, v === Object(v) ? removeEmpty(v) : v])
  );
}

export function generateURI<T>(path: string, query?: Record<string, string | number | boolean> | T): string {
  const serializedQuery = querySerialize<T>(query);
  const queryString = serializedQuery !== '' ? `?${serializedQuery}` : '';
  return `${API_HOST}${path}${queryString}`;
}

export function querySerialize<T>(queryObj?: Record<string, string | number | boolean> | T): string {
  if (!queryObj) {
    return '';
  }
  const queryString = Object.entries(queryObj)
    .filter(([_, value]) => (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  return queryString;
}

export function addCurrencyStyle(price: number, isDecimal = false) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: isDecimal ? 2 : 0
  }).format(price);
}

export function getInitialMetaData(metaData?: any) {
  return {
    title: metaData?.title ?? '',
    description: metaData?.description ?? '',
    keywords: metaData?.keywords ?? '',
    robots: metaData?.robots ?? {
      index: false,
      follow: false,
      noarchive: false,
      nocache: false,
      notranslate: false,
      nosnippet: false,
      noimageindex: false,
      'max-video-preview': '',
      'max-image-preview': '',
      'max-snippet': 0
    },
    openGraph: {
      locale: 'en_us',
      type: 'website',
      siteName: 'Education Portal',
      title: metaData?.openGraph?.title ?? '',
      description: metaData?.openGraph?.description ?? '',
      url: '',
      images: ''
    },
    twitter: {
      card: metaData?.twitter?.card ?? 'summary_large_image',
      title: metaData?.twitter?.title ?? '',
      description: metaData?.twitter?.description ?? '',
      site: '@educationportal',
      creator: '@educationportal',
      images: ''
    }
  };
}

export function slugify(text?: string) {
  // Check for undefined or empty string
  if (text == null || text.trim() === '') return text;

  // Remove non alpha numeric characters and replace spaces with dashes and convert to lowercase
  return text
    .trim() // remove unnecessary spaces
    .toLowerCase() // convert to lower case
    .replace(/[^A-Za-z0-9\s]/g, ' ') // replace all non-alpha numeric characters with white-space
    .trim() // trim string if any prefix or suffix spaces exist
    .replace(/\s+/g, '-'); // replace in between spaces with '-'
}
