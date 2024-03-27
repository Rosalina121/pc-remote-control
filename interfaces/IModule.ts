import type { IModuleResponse } from "./IModuleResponse";
import type { Request } from "express-serve-static-core";
import type { ParsedQs } from "qs";
export type moduleReq = Request<{ path: string }, any, any, ParsedQs, Record<string, any>>
export interface IModule {
    emoji: string,
    name: string,
    path: string,
    fn: (request?: moduleReq) => IModuleResponse  // any is actually ParsedQs
}