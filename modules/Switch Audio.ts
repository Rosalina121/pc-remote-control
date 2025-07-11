import type { IModule, moduleReq } from "../interfaces/IModule";
import type { IModuleResponse } from "../interfaces/IModuleResponse";

import { $ } from "bun";

/**
 * This module switches audio to the audio device provided in params (by name)
 * Note for Windows: Both default sound & communication. To change this behavior just comment
 *       out either shell line with "1" or "2".
 * Note for Linux: Works with PulseAudio. Find out source name via `pactl list sources`.
 *
 * GET/POST:
 *  - device - `string` name of the audio device as seen in the Sound in Control Panel
 *
 * Example:
 *  - /wish/switch-audio?name=microphone
 *  - /wish/switch-audio?name=Desk%20Microphone
 *  - /wish/switch-audio {"device":"BT Sound Bar"}
 */
class SwitchAudio implements IModule {
    emoji = "🎵";
    name = "Switch Audio";
    path = "switch-audio";

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

export const module = new SwitchAudio();

async function handleGET(request: moduleReq) {
    if (request.query?.device) {
        return performToggle(request.query.device.toString());
    } else {
        return { response: `Param "device" is missing`, status: 400 };
    }
}

async function handlePOST(request: moduleReq) {
    if (request.body.device) {
        return performToggle(request.body.device);
    } else {
        return { response: `Param "device" is missing`, status: 400 };
    }
}

async function performToggle(device: string) {
    switch (process.platform) {
        case "win32":
            return handleWindows(device);

        case "linux":
            return handleLinux(device);

        default:
            return {
                response: `Unsupported platform: ${process.platform}. Please create an issue and/or pull request on the git repo.`,
                status: 501,
            };
    }
}

async function handleWindows(device:string) {
    try {
        await $`nircmd setdefaultsounddevice ${device} 1`;
        await $`nircmd setdefaultsounddevice ${device} 2`;
        return {
            response: `Device set to: ${device}.`,
            status: 200,
        };
    } catch (e) {
        const error = `Error. NirCMD is probably not installed. Error: ${e}`;
        return { response: error, status: 500 };
    }
}

async function handleLinux(device:string) {
    try {
        // find out source name via `pactl list sources`
        await $`pactl set-default-source ${device}`;
        return {
            response: `Device set to: ${device}.`,
            status: 200,
        };
    } catch (e) {
        const error = `Error: ${e}`;
        return { response: error, status: 500 };
    }
    
}