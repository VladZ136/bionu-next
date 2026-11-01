/** Единственный публичный адрес текущей версии сайта. */
export const SITE_URL = 'https://bionu-next.vercel.app';

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString();
}
