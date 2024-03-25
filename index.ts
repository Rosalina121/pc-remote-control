import type { IModule } from "./interfaces/IModule";
import { promises as fs } from "fs";
import path from "path";

/**
 * Loads modules from provided directory.
 *
 * @param dir - directory to the modules
 * @returns instances of classes from modules
 */
async function loadClasses(dir: string): Promise<{ module: IModule }[]> {
    const files = await fs.readdir(dir);
    const classes: { module: IModule }[] = [];
    console.log(" 🖥️  Loading modules...");
    for (const file of files) {
        if (file.endsWith(".ts")) {
            const filePath = path.join(dir, file);
            const importedModule = await import(filePath);
            classes.push(importedModule);
        }
    }
    console.log(` 🖥️  Loaded\x1b[92m${classes.length}\x1b[0m modules:`);
    console.log(
        ` 🖥️ \x1b[94m${classes
            .map((c) => c.module.name)
            .join(`\x1b[0m, \x1b[94m`)}\x1b[0m`
    );

    return classes;
}

/**
 * Checks which path was invoked and runs a method from the corresponding
 * instance of a loaded class.
 *
 * @param url - url of the request
 * @param classes - loaded instances of modules
 * @returns response from the invoked module
 */
function routePathname(url: any, classes: { module: IModule }[]) {
    const result = classes.filter((p) => url.pathname === p.module.path);
    if (result[0]) {
        return new Response(result[0].module.fn());
    } else {
        return new Response("404");     // TODO: make it an actual 404
    }
}

async function main() {
    const dir = path.resolve("./modules");
    const classes = await loadClasses(dir);

    const server = Bun.serve({
        hostname: "0.0.0.0",
        port: 3000,
        fetch(req) {
            const url = new URL(req.url);
            const res = routePathname(url, classes);
            console.log(` 🖥️  ${new Date().toISOString()} Invoked: ${url.pathname}`)
            return res;
        },
    });

    console.log(` 🖥️  Listening on http://localhost:${server.port}`);
}

main();
