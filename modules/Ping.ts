import type { IModule } from "../interfaces/IModule";

class Ping implements IModule {
    name = "Ping"
    path = "/";

    fn(): string {
        return "Pong!";
    }
}

export const module = new Ping()