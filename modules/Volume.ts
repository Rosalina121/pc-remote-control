import type { IModule } from "../interfaces/IModule";
import type { IModuleResponse } from "../interfaces/IModuleResponse";

/**
 * Query params: 
 *  - value - `[0, 100]` value to set the sys volume to
 * 
 * Example:
 *  - /wish/volume?value=50
 */
class Volume implements IModule {
    emoji = "🔊"
    name = "Volume";
    path = "volume";

    fn(params: any): IModuleResponse {
        const vol = params?.value;
        if (!vol) {
            // IDEA: maybe return the current system volume in case of missing param?
            // you know, like getter/setter
            return { response: `Parameter "value" is missing.`, status: 400 };
        }
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
}

export const module = new Volume();
