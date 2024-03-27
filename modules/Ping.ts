import type { IModule, moduleReq } from "../interfaces/IModule";
import type { IModuleResponse } from "../interfaces/IModuleResponse";

class Ping implements IModule {
    emoji = "🏓";
    name = "Ping";
    path = "ping";

    fn(request?: moduleReq): IModuleResponse {
        switch (request?.method) {
            case "POST":
                return { response: "Pong!", status: 200 };

            case "GET":
                return { response: "Pong!", status: 200 };

            default:
                return { response: "Pong!", status: 200 };
        }
    }
}

export const module = new Ping();
