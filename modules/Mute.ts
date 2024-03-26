import type { IModule } from "../interfaces/IModule";
import { keyboard, Key } from "@nut-tree/nut-js";
import type { IModuleResponse } from "../interfaces/IModuleResponse";

class Mute implements IModule {
    name = "Mute";
    path = "mute";

    fn(): IModuleResponse {
        // My Discord mute bind
        // TODO: just mute the device, NirCMD?
        // If Discord specific, perhaps some kind of local API to get the current mic status
        keyboard.type(Key.LeftControl, Key.Backslash);
        return { response: "Mute toggled.", status: 200 };
    }
}

export const module = new Mute();
