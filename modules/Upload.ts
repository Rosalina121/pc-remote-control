import type { IModule, moduleReq } from "../interfaces/IModule";
import type { IModuleResponse } from "../interfaces/IModuleResponse";

/**
 * POST:
 *  - file - actual file to be saved (via Form)
 *
 * Example:
 *  - /wish/upload Form: file: actual_file_here
 */
class Upload implements IModule {
    emoji = "📥";
    name = "Upload";
    path = "upload";

    fn(request: moduleReq): IModuleResponse {
        switch (request.method) {
            case "POST":
                return handlePOST(request);
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

function handlePOST(request: moduleReq) {
    if (request.file) {
        return {
            response: `Got file "${request.file.originalname}"`,
            status: 200,
        };
    }
    return {
        response: `POST requires a file.`,
        status: 400,
    };
}

export const module = new Upload();
