// biome-ignore lint/suspicious/noExplicitAny: TODO: provide type definitions for these types
export type Module = any;
// biome-ignore lint/suspicious/noExplicitAny: TODO: provide type definitions for these types
export type IndexedModule = any;
export type ModuleMap = Record<string, Module>;
// biome-ignore lint/suspicious/noExplicitAny: TODO: provide type definitions for these types
export type Project = { modules: ModuleMap } & Record<string, any>;
export type Registry = { modules: Record<string, IndexedModule> } & Record<
  string,
  // biome-ignore lint/suspicious/noExplicitAny: TODO: provide type definitions for these types
  any
>;
export type RegistryMap = Record<string, Registry>;

export type Meta = {
  config: Project;
  modules: ModuleMap;
  registries: RegistryMap;
};
