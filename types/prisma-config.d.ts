// types/prisma-config.d.ts
// Minimal ambient declaration so TypeScript recognizes "prisma/config"
// This only affects type-checking in the editor; runtime is unchanged.

declare module "prisma/config" {
  // flexible return type for defineConfig
  export function defineConfig<T = any>(config: T): T;

  // helper to read env variables at runtime
  export function env(name: string): string;

  // default export shape (not required but helpful)
  const _default: {
    defineConfig: typeof defineConfig;
    env: typeof env;
  };
  export default _default;
}
