import type { IModule } from "../interfaces/IModule";

class Ping implements IModule {
    path = "/";

    fn(): string {
        return "Pong!";
    }
}

export const module = new Ping()