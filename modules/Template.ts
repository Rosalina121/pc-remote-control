import type { IModule, moduleReq } from "../interfaces/IModule";
import type { IModuleResponse } from "../interfaces/IModuleResponse";

/**
 * This is a template module you can copy over and adapt
 * 
 * Params:
 *  - tbd
 * 
 * Example:
 *  - /wish/template
 */
class Template implements IModule {
    emoji = "🏓"
    name = "Template";
    path = "template";

    fn(request?: moduleReq): IModuleResponse {
        switch (request?.method) {
            case "POST":
                return {
                    response: `POST not implemented yet.`,
                    status: 501,
                };
            case "GET":
                return {
                    response: `GET not implemented yet.`,
                    status: 501,
                };
            default:
                return {
                    response: `Unsupported REST verb.`,
                    status: 501,
                };
        }
    }
}

export const module = new Template();
