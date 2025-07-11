import type { IModule, moduleReq } from "../interfaces/IModule";
import type { IModuleResponse } from "../interfaces/IModuleResponse";

import { $ } from "bun";
/**
 * Controls music.
 *
 * GET/POST:
 *  -
 *
 * Example:
 *  - /wish/media
 *  - /wish/media?playpause
 *  - /wish/media?next
 *  - /wish/media?previous
 */
class Media implements IModule {
    emoji = "⏯️ ";
    name = "Media";
    path = "media";

    async fn(request: moduleReq): Promise<IModuleResponse> {
        switch (request.method) {
            case "GET":
                return await handleGET(request);
            case "POST":
                return await handlePOST(request);
            default:
                return {
                    response: `Unsupported REST verb.`,
                    status: 501,
                };
        }
    }
}

export const module = new Media();

async function handlePOST(request: moduleReq): Promise<IModuleResponse> {
    if (request.body.action && ["play-pause", "next", "previous"].includes(request.body.action)) {
        return handleLinux(request.body.action);
    } else {
        return {
            response: `Unsupported action.`,
            status: 400,
        };
    }
}

async function handleGET(request: moduleReq): Promise<IModuleResponse> {
    if (request.query?.action && ["play-pause", "next", "previous"].includes(request.query.action.toString())) {
        return handleLinux(request.query.action.toString());
    } else {
        return {
            response: `Unsupported action.`,
            status: 400,
        };
    }
}

// async function handleWindows() {
// Fuck do you do this on windows
//     try {
//         Bun.spawn(["nircmd", "setsysvolume"]);
//         return { response: `Play/Paused`, status: 200 };
//     } catch (e) {
//         const error = `Error. NirCMD is probably not installed.`;
//         return { response: error, status: 500 };
//     }
// }

async function handleLinux(action: string) {
    try {
        console.log(`Media action: ${action}`);
        await $`playerctl ${action}`;
        return { response: `Performed media action: ${action}`, status: 200 };
    } catch (e) {
        const error = `Error: ${e}`;
        return { response: error, status: 500 };
    }
}
