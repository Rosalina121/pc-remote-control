import type { IModule } from "../interfaces/IModule";
import type { IModuleResponse } from "../interfaces/IModuleResponse";

class Shutdown implements IModule {
    name = "Shutdown";
    path = "shutdown";

    fn(): IModuleResponse {
        try {
            Bun.spawn([
                "nircmd",
                "initshutdown",
                "Shutdown initiated!",
                "60",
                "reboot",
            ]);
            return { response: "Shutdown initiated.", status: 200 };
        } catch (e) {
            const error = `Error performing "${this.path}": NirCMD is probably not installed.`;
            return { response: error, status: 500 };
        }
    }
}

export const module = new Shutdown();
