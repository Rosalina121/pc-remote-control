import type { IModule, moduleReq } from "../interfaces/IModule";
import type { IModuleResponse } from "../interfaces/IModuleResponse";

/**
 * This is a template module you can copy over and adapt
 * 
 * GET/POST:
 *  - tbd - you can do it
 * 
 * POST:
 *  - wip - now I know it
 * 
 * Example:
 *  - /wish/template
 *  - /wish/template?tbd=another
 *  - /wish/template {"tbd":"happy day", "wip": "in hell"}
 */
class Template implements IModule {
    emoji = "📄"
    name = "Template";
    path = "template";

    fn(request: moduleReq): IModuleResponse {
        switch (request.method) {
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
