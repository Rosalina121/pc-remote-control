import type { IModule, moduleReq } from "../interfaces/IModule";
import { keyboard, Key } from "@nut-tree/nut-js";
import type { IModuleResponse } from "../interfaces/IModuleResponse";

class Mute implements IModule {
    emoji = "🔇"
    name = "Mute";
    path = "mute";


    fn(request: moduleReq): IModuleResponse {
        switch (request.method) {
            case "POST":
                return muteMic();
            case "GET":
                return muteMic();
            default:
                return muteMic();
        }
    }
}

export const module = new Mute();
function muteMic() {
    keyboard.type(Key.LeftControl, Key.Backslash);
    return { response: "Mute toggled.", status: 200 };
}

