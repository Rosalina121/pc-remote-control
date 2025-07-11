import type { IModule, moduleReq } from "../interfaces/IModule";
import type { IModuleResponse } from "../interfaces/IModuleResponse";

import { $ } from "bun";

/**
 * This module mutes the audio device provided in params (by name)
 * Based on Switch Audio module, so same device names apply here
 *
 * GET/POST:
 *  - device - `string` name of the audio device
 *
 * Example:
 *  - /wish/mute-microphone?name=microphone
 *  - /wish/mute-microphone?name=Desk%20Microphone
 *  - /wish/mute-microphone {"device":"BT Sound Bar"}
 */
class MuteMicrophone implements IModule {
    emoji = "🎙️ "
    name = "Mute Microphone";
    path = "mute-microphone";

    async fn(request: moduleReq): Promise<IModuleResponse> {
        switch (request.method) {
            case "POST":
                return handlePOST(request)
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

async function handleGET(request: moduleReq) {
    if (request.query?.device) {
        return performMute(request.query.device.toString());
    } else {
        return { response: `Param "device" is missing`, status: 400 };
    }
}

async function handlePOST(request: moduleReq) {
    if (request.body.device) {
        return performMute(request.body.device);
    } else {
        return { response: `Param "device" is missing`, status: 400 };
    }
}

async function performMute(device: string) {
    switch (process.platform) {
        case "linux":
            return handleLinux(device);
        default:
            return {
                response: `Unsupported platform: ${process.platform}. Please create an issue and/or pull request on the git repo.`,
                status: 501,
            };
    }
}

async function handleLinux(device: string) {
    try {
        // find out source name via `pactl list sources`
        await $`pactl set-source-mute ${device} toggle`;
        return {
            response: `Toggled mute on ${device}.`,
            status: 200,
        };
    } catch (e) {
        const error = `Error: ${e}`;
        return { response: error, status: 500 };
    }

}

export const module = new MuteMicrophone();
