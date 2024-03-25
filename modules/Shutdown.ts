import type { IModule } from "../interfaces/IModule";

class Shutdown implements IModule {
    name = "Shutdown"
    path = "/shutdown";

    fn(): string {
        try {
            Bun.spawn(['echo', 'initshutdown', 'Shutdown initiated!', '60', 'reboot'])
            return "Shutdown initiated.";
        } catch (e) {
            const error = `Error performing "${this.path}": NirCMD is probably not installed.`
            console.log(` 🖥️ \x1b[31m${error}\x1b[0m`)
            return error;
        }
    }
}

export const module = new Shutdown()