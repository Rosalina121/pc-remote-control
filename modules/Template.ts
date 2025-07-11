import type { IModule, moduleReq } from "../interfaces/IModule";
import type { IModuleResponse } from "../interfaces/IModuleResponse";

/**
 * This is a template module you can copy over and adapt
 * 
 * Config:
 *  - config - from the
 *  - json - file named as the module (i.e. Template.json)
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
    emoji = "📄"            // if unsure consult https://gist.github.com/gurki/f5dae63795c17da2f33c3e6c5877ce30 
    name = "Template";      // also for icon sometimes I add an extra space if it looks cramped in the terminal
    path = "template";      // kebab-case of the above

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
