import type { IModule } from "../interfaces/IModule";
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
    emoji = "📴"
    name = "Shutdown";
    path = "shutdown";

    fn(params: any): IModuleResponse {
        const abort = params?.abort === ""; // empty param
        const reboot = params?.reboot === ""; // empty param
        const timeout = params?.timeout ?? "60";

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
                    reboot ?? "",
                ]);
                return {
                    response: `${reboot ? "Reboot" : "Shutdown"} initiated.`,
                    status: 200,
                };
            }
        } catch (e) {
            const error = `Error performing "${this.path}": NirCMD is probably not installed.`;
            return { response: error, status: 500 };
        }
    }
}

export const module = new Shutdown();
