import type { IModule } from "./interfaces/IModule";
import { promises as fs } from "fs";
import path from "path";

/**
 * Loads modules from /modules
 * 
 * @param dir - directory to the modules
 * @returns instances of classes from modules
 */
async function loadClasses(dir: string): Promise<{ module: IModule }[]> {
    const files = await fs.readdir(dir);
    const classes: { module: IModule }[] = [];

    for (const file of files) {
        if (file.endsWith(".ts")) {
            const filePath = path.join(dir, file);
            const importedModule = await import(filePath);
            classes.push(importedModule);
        }
    }
    return classes;
}

/**
 * Checks which path was invoked and runs a method from the corresponding
 * instance of a loaded class
 * 
 * @param url - url of the request
 * @param classes - loaded instances of modules
 * @returns response from the invoked module
 */
function routePathname(url: any, classes: { module: IModule }[]) {
    const result = classes.filter((p) => url.pathname === p.module.path);
    if (result) {
        return new Response(result[0]?.module.fn());
    } else {
        return new Response("404");
    }
}

async function main() {
    const dir = path.resolve("./modules");
    const classes = await loadClasses(dir);

    const server = Bun.serve({
        port: 3000,
        fetch(req) {
            const url = new URL(req.url);
            return routePathname(url, classes);
        },
    });

    console.log(`Listening on http://localhost:${server.port} ...`);
}

main();
