
module.exports = {
  '*.{js,ts,tsx}': ['pnpm run lint:fix', 'pnpm run format'],
  '*.{json,md}': ['pnpm run format'],
};

