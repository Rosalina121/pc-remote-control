import type { IModule, moduleReq } from "../interfaces/IModule";
import type { IModuleResponse } from "../interfaces/IModuleResponse";

import { $ } from "bun";
/**
 * Sets the volume. Windows uses NirCMD and Linux PulseAudio.
 * 
 * GET/POST:
 *  - value - `[0, 100]` value to set the sys volume to. Mutes if empty
 *
 * Example:
 *  - /wish/volume
 *  - /wish/volume?value=50
 *  - /wish/volume {"value": 50}
 */
class Volume implements IModule {
    emoji = "🔊";
    name = "Volume";
    path = "volume";

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

export const module = new Volume();

async function handleGET(request: moduleReq): Promise<IModuleResponse> {
    const vol = Number((request.query?.value ?? 0).toString());
    return setVolume(vol);
}
async function handlePOST(request: moduleReq): Promise<IModuleResponse> {
    const vol = Number((request.body.value ?? 0).toString());
    return setVolume(vol);
}

async function handleWindows(volume: number) {
    const calculatedVolume = Math.round(volume * 655.35);

    try {
        Bun.spawn(["nircmd", "setsysvolume", calculatedVolume.toString()]);
        return { response: `Volume changed to ${volume}.`, status: 200 };
    } catch (e) {
        const error = `Error. NirCMD is probably not installed.`;
        return { response: error, status: 500 };
    }
}

async function handleLinux(volume: number) {
    try {
        console.log(`Setting volume to ${volume}%`);
        await $`pactl set-sink-volume @DEFAULT_SINK@ ${volume}%`;
        return { response: `Volume changed to ${volume}.`, status: 200 };
    } catch (e) {
        const error = `Error: ${e}`;
        return { response: error, status: 500 };
    }
}

async function setVolume(volume: number) {
    if (volume > 100 || volume < 0) {
        return {
            response: `Parameter "value" should be in [0, 100].`,
            status: 400,
        };
    }

    switch (process.platform) {
        case "win32":
            return handleWindows(volume);
        case "linux":
            return handleLinux(volume);
        default:
            return {
                response: `Unsupported platform: ${process.platform}. Please create an issue and/or pull request on the git repo.`,
                status: 501,
            };
    }
}
