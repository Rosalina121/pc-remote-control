import type { IModuleResponse } from "./IModuleResponse";
import type { Request, ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
export type moduleReq = Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>
export interface IModule {
    emoji: string,
    name: string,
    path: string,
    fn: (request: moduleReq) => IModuleResponse | Promise<IModuleResponse>  // Promise in case of async fn()
}