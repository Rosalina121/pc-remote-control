import type { IModuleResponse } from "./IModuleResponse";

export interface IModule {
    emoji: string,
    name: string,
    path: string,
    fn: (queryParams?: any) => IModuleResponse  // any is actually ParsedQs
}