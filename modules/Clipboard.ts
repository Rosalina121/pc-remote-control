import type { IModule } from "../interfaces/IModule";
import type { IModuleResponse } from "../interfaces/IModuleResponse";
import clipboard from "clipboardy";

/**
 * Query params:
 *  - value - string value of clipboard text
 * 
 * Example:
 *  - /wish/clipboard?value=i%20like%20trains
 */
class Clipboard implements IModule {
    name = "Clipboard";
    path = "clipboard";

    // TODO: make it POST with JSON like type (string, file) and data
    fn(queryParams: any): IModuleResponse {
        const value = queryParams?.value;
        if (value) {
            clipboard.writeSync(value);
            return { response: `Clipboard written: "${value}"`, status: 200 };
        } else {
            return {
                response: `Parameter "value" may be missing.`,
                status: 400,
            };
        }
    }
}

export const module = new Clipboard();
