import type { IModule, moduleReq } from "../interfaces/IModule";
import type { IModuleResponse } from "../interfaces/IModuleResponse";
import clipboard from "clipboardy";

/**
 * Query params:
 *  - value - string value of clipboard text
 *
 * Example:
 *  - /wish/clipboard?value=i%20like%20trains
 */
class Clipboard implements IModule {
    emoji = "📎";
    name = "Clipboard";
    path = "clipboard";

    fn(request?: moduleReq): IModuleResponse {
        switch (request?.method) {
            case "POST":
                return {
                    response: `POST not implemented yet.`,
                    status: 501,
                };
            case "GET":
                return handleGET(request);
            default:
                return {
                    response: `Unsupported REST verb.`,
                    status: 501,
                };
        }
    }
}

function handleGET(request: moduleReq) {
    const value = request?.query?.value;
    if (value) {
        clipboard.writeSync(value.toString());
        return { response: `Clipboard written: "${value}"`, status: 200 };
    } else {
        return {
            response: `Parameter "value" may be missing.`,
            status: 400,
        };
    }
}

export const module = new Clipboard();
