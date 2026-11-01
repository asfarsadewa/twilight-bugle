import type { Production } from './core/types.ts';

// Every folder in productions/ with a production.ts is a show in the repertoire.
const modules = import.meta.glob<{ default: Production }>('../../productions/*/production.ts');

export const repertoire = Object.entries(modules).map(([path, load]) => ({
  id: path.split('/').at(-2)!,
  load: async () => (await load()).default,
}));
