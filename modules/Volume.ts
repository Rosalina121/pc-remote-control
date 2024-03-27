import type { IModule, moduleReq } from "../interfaces/IModule";
import type { IModuleResponse } from "../interfaces/IModuleResponse";

/**
 * Query params:
 *  - value - `[0, 100]` value to set the sys volume to
 *
 * Example:
 *  - /wish/volume?value=50
 */
class Volume implements IModule {
    emoji = "🔊";
    name = "Volume";
    path = "volume";

    fn(request?: moduleReq): IModuleResponse {
        switch (request?.method) {
            case "POST":
                return {
                    response: `POST not implemented yet.`,
                    status: 501,
                };
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

export const module = new Volume();

function handleGET(request: moduleReq): IModuleResponse {
    const param = request.query?.value;
    // checks done separately as Number("") == 0
    if (!param) {
        return { response: `Param "value" is missing`, status: 400 };
    }
    const vol = Number(param.toString());
    if (vol > 100 || vol < 0) {
        return {
            response: `Parameter "value" should be in [0, 100].`,
            status: 400,
        };
    }
    const calculatedVolume = Math.round(vol * 655.35);
    try {
        Bun.spawn(["nircmd", "setsysvolume", calculatedVolume.toString()]);
        return { response: `Volume changed to ${vol}.`, status: 200 };
    } catch (e) {
        const error = `Error performing "${this.path}": NirCMD is probably not installed.`;
        return { response: error, status: 500 };
    }
}
