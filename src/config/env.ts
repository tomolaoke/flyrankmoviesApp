/**
 * Single place to read Vite env vars at runtime. Keeps `import.meta.env`
 * out of service/viewmodel code so those modules stay loadable under Jest
 * (which transforms to CommonJS, where `import.meta` is a syntax error) —
 * tests simply mock this module instead.
 */
export function getEnv(name: string): string | undefined {
  return import.meta.env[name]
}