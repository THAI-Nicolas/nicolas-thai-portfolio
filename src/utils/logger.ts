/**
 * Logger utilitaire qui ne log qu'en développement
 * En production, tous les logs sont désactivés pour une console propre
 */

const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: any[]) => {
    if (isDev) console.log(...args);
  },
  warn: (...args: any[]) => {
    if (isDev) console.warn(...args);
  },
  error: (...args: any[]) => {
    // Les erreurs sont toujours affichées, même en prod
    console.error(...args);
  },
  info: (...args: any[]) => {
    if (isDev) console.info(...args);
  },
};
