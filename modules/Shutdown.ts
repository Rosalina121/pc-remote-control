import type { IModule, moduleReq } from "../interfaces/IModule";
import type { IModuleResponse } from "../interfaces/IModuleResponse";

/**
 * GET/POST:
 *  - timeout - optional `number` to delay the shutdown in seconds (default 60)
 *
 * GET:
 *  - abort - if present aborts the shutdown
 *  - reboot - if present will reboot
 * 
 * POST:
 *  - abort - optional `boolean` if to abort the shutdown
 *  - reboot - optional `boolean` if to reboot
 * 
 * Example:
 *  - /wish/shutdown
 *  - /wish/shutdown?abort
 *  - /wish/shutdown?timeout=20
 *  - /wish/shutdown?timeout=0&reboot
 *  - /wish/shutdown {"reboot": true, "timeout": 120}
 */
class Shutdown implements IModule {
    emoji = "📴";
    name = "Shutdown";
    path = "shutdown";

    fn(request: moduleReq): IModuleResponse {
        switch (request.method) {
            case "POST":
                return handlePOST(request)
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
    const abort = request.query?.abort === ""; // empty param
    const reboot = request.query?.reboot === ""; // empty param
    const timeout = request.query?.timeout?.toString() ?? "60";

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
            ]);     // TODO: check if Bun 1.1 $ Bun Shell could work here. I *know* it works, but async/await shenanigans.
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

function handlePOST(request: moduleReq) {
    const abort = request.body.abort;
    const reboot = request.body.reboot;
    const timeout = request.body.timeout?.toString() ?? "60";

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
    return { response: "esh", status: 500 };

}