import type { IModule } from "../interfaces/IModule";
import type { IModuleResponse } from "../interfaces/IModuleResponse";

class Ping implements IModule {
    name = "Ping";
    path = "ping";

    fn(): IModuleResponse {
        return { response: "Pong!", status: 200 };
    }
}

export const module = new Ping();
