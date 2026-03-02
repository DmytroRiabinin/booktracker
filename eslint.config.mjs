import apiConfig from './apps/api/eslint.config.mjs';
import webConfig from './apps/web/eslint.config.mjs';

export default [
  ...apiConfig.map((c) => ({ ...c, files: c.files ?? ['apps/api/**/*.ts'] })),
  ...webConfig.map((c) => ({ ...c, files: c.files ?? ['apps/web/**/*.{ts,tsx}'] })),
];
