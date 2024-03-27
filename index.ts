import type { IModule } from "./interfaces/IModule";

import { promises as fs } from "fs";
import path from "path";

import express from "express";

/**
 * Loads modules from provided directory.
 *
 * @param dir - directory to the modules
 * @returns instances of classes from modules
 */
async function loadClasses(dir: string): Promise<{ module: IModule }[]> {
    const files = await fs.readdir(dir);
    const classes: { module: IModule }[] = [];
    log("Loading modules...");
    for (const file of files) {
        if (file.endsWith(".ts")) {
            const filePath = path.join(dir, file);
            const importedModule = await import(filePath);
            classes.push(importedModule);
        }
    }
    log(`Loaded\x1b[92m${classes.length}\x1b[0m modules:`);
    log(
        `\x1b[94m${classes
            .map((c) => c.module.name)
            .join(`\x1b[0m, \x1b[94m`)}\x1b[0m`
    );

    return classes;
}

function log(s: string) {
    console.log(" 🖥️ ", s);
}

function colorForStatus(status: number): string {
    switch (status) {
        case 500:
            return "\x1b[31m";
        case 400:
            return "\x1b[33m";
        default:
            return "";
    }
}

/**
 * Main function. Runs the Express server and handles requests and response formatting in the console
 */
async function main() {
    const dir = path.resolve("./modules");
    const classes = await loadClasses(dir);

    const app = express();
    const port = 3000;
    const host = "0.0.0.0";

    app.get("/wish/:path", (req, res) => {
        const path = req.params.path;
        const requestedModule = classes.filter((p) => path === p.module.path);
        if (requestedModule[0]) {
            const moduleResult = requestedModule[0].module.fn(req.query); // Query Params validation is a module responsibility

            log(`📥 /wish/${path} 📤 ${colorForStatus(moduleResult.status)}${moduleResult.response}\x1b[0m`); // TODO: color based on status code

            res.send(moduleResult.response).status(moduleResult.status);
        } else {
            log(`❌\x1b[31mModule on path: \x1b[91m/wish/${path}\x1b[31m not found.\x1b[0m`);
            res.send("Requested module not found").status(404);
        }
    });

    // TODO: add POST support and specify verb per module

    app.listen(port, host, () => {
        log(`Listening on http://localhost:${port} ...`); // TODO: Move the PC emoji to like a general function, like log() or sth
    });
}

main();
