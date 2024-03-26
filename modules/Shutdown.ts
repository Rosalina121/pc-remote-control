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
 */
class Shutdown implements IModule {
    name = "Shutdown";
    path = "shutdown";

    fn(queryParams: any): IModuleResponse {
        const abort = queryParams?.abort === ""; // empty param
        const timeout = queryParams?.timeout ?? "60";
        if (abort) {
            try {
                Bun.spawn(["nircmd", "abortshutdown"]);
                return { response: "Shutdown aborted.", status: 200 };
            } catch (e) {
                const error = `Error performing "${this.path}": NirCMD is probably not installed.`;
                return { response: error, status: 500 };
            }
        } else {
            try {
                Bun.spawn([
                    "nircmd",
                    "initshutdown",
                    `Shutdown in ${timeout} seconds.`,
                    timeout,
                ]);
                return { response: "Shutdown initiated.", status: 200 };
            } catch (e) {
                const error = `Error performing "${this.path}": NirCMD is probably not installed.`;
                return { response: error, status: 500 };
            }
        }
    }
}

export const module = new Shutdown();
