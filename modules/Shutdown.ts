import type { IModule, moduleReq } from "../interfaces/IModule";
import type { IModuleResponse } from "../interfaces/IModuleResponse";

/**
 * Query params:
 *  - abort - if to abort the shutdown
 *  - timeout - `0...inf` delay the shutdown in seconds (default 60)
 *
 * Example:
 *  - /wish/shutdown
 *  - /wish/shutdown?abort
 *  - /wish/shutdown?timeout=20
 *  - /wish/shutdown?timeout=0&reboot
 */
class Shutdown implements IModule {
    emoji = "📴";
    name = "Shutdown";
    path = "shutdown";

    fn(request?: moduleReq): IModuleResponse {
        switch (request?.method) {
            case "POST":
                return {
                    response: `POST not implemented yet.`,
                    status: 501,
                };
            case "GET":
                return handleGET(request)
            default:
                return {
                    response: `Unsupported REST verb.`,
                    status: 501,
                };
        }
    }
}

export const module = new Shutdown();

function handleGET(request: moduleReq) {
    const abort = request?.query?.abort === ""; // empty param
    const reboot = request?.query?.reboot === ""; // empty param
    const timeout = request?.query?.timeout?.toString() ?? "60";

    try {
        if (abort) {
            Bun.spawn(["nircmd", "abortshutdown"]);
            return { response: "Shutdown aborted.", status: 200 };
        } else {
            Bun.spawn([
                "nircmd",
                "initshutdown",
                `${reboot ? "Reboot" : "Shutdown"} in ${timeout} seconds.`,
                timeout,
                reboot ? "reboot" : "",
            ]);
            return {
                response: `${reboot ? "Reboot" : "Shutdown"} initiated.`,
                status: 200,
            };
        }
    } catch (e) {
        const error = `Error. NirCMD is probably not installed.`;
        return { response: error, status: 500 };
    }
}
