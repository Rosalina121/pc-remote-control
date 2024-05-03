import type { IModule, moduleReq } from "../interfaces/IModule";
import type { IModuleResponse } from "../interfaces/IModuleResponse";

import { $ } from "bun";
/**
 *
 * GET/POST:
 *  - timeout - optional `number` to delay the shutdown in seconds (default 60). Rounded to minutes if run on Linux.
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

    async fn(request: moduleReq): Promise<IModuleResponse> {
        switch (request.method) {
            case "POST":
                return await handlePOST(request);
            case "GET":
                return await handleGET(request);
            default:
                return {
                    response: `Unsupported REST verb.`,
                    status: 501,
                };
        }
    }
}

export const module = new Shutdown();

async function handleGET(request: moduleReq) {
    return performShutdown(
        request.query?.abort === "",
        request.query?.reboot === "",
        request.query?.timeout?.toString() ?? "60"
    );
}

async function handlePOST(request: moduleReq) {
    return performShutdown(
        request.body.abort,
        request.body.reboot,
        request.body.timeout?.toString() ?? "60"
    );
}

async function performShutdown(
    abort: boolean,
    reboot: boolean,
    timeout: string
) {
    switch (process.platform) {
        case "win32":
            return handleWindows(abort, reboot, timeout);
        case "linux":
            return handleLinux(abort, reboot, timeout);

        default:
            return {
                response: `Unsupported platform: ${process.platform}. Please create an issue and/or pull request on the git repo.`,
                status: 501,
            };
    }
}
async function handleWindows(abort: boolean, reboot: boolean, timeout: string) {
    try {
        if (abort) {
            Bun.spawn(["nircmd", "abortshutdown"]); // TODO check why $`` exits with 92
            return { response: "Shutdown aborted.", status: 200 };
        } else {
            // nircmd initshutdown "Message" timeout(in seconds) reboot(or nothing)
            await $`nircmd initshutdown "${
                reboot ? "Reboot" : "Shutdown"
            } in ${timeout} seconds." ${timeout} ${reboot ? "reboot" : ""}`;
            return {
                response: `${reboot ? "Reboot" : "Shutdown"} initated.`,
                status: 200,
            };
        }
    } catch (e) {
        const error = `Error. NirCMD is probably not installed. Error: ${e}`;
        return { response: error, status: 500 };
    }
}

async function handleLinux(abort: boolean, reboot: boolean, timeout: string) {
    const timeoutInMinutes = Math.round(parseInt(timeout) / 60);
    try {
        if (abort) {
            await $`shutdown -c`;
            return { response: "Shutdown aborted.", status: 200 };
        } else {
            await $`shutdown -h ${reboot ? "-r" : ""} ${
                timeoutInMinutes ? "+${timeoutInMinutes}" : ""
            }`;
            return {
                response: `${reboot ? "Reboot" : "Shutdown"} initated.`,
                status: 200,
            };
        }
    } catch (e) {
        const error = `Error: ${e}`;
        return { response: error, status: 500 };
    }
}
