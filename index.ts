import type { IModule } from "./interfaces/IModule";

import { promises as fs } from "fs";
import path from "path";

import express from "express";
import type { Request, Response } from "express-serve-static-core";
import type { ParsedQs } from "qs";

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
    log(`Loaded \x1b[92m${classes.length}\x1b[0m modules:`);
    log(
        `\x1b[94m${classes
            .map((c) => c.module.emoji + " " + c.module.name)
            .join(`\x1b[0m, \x1b[94m`)}\x1b[0m`
    );

    return classes;
}

function log(s: string) {
    console.log("", s); // TODO: refactor
}

function colorForStatus(status: number): string {
    switch (status) {
        case 500:
            return "\x1b[31m";
        case 400:
            return "\x1b[33m";
        default:
            return "\x1b[32m";
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
        handleRequest(req, classes, res, "get");
    });

    app.post("/wish/:path", (req, res) => {
        handleRequest(req, classes, res, "post")
    });

    app.listen(port, host, () => {
        log(`Listening on http://localhost:${port} ...`); // TODO: Move the PC emoji to like a general function, like log() or sth
    });
}

main();

function handleRequest(
    req: Request<{ path: string }, any, any, ParsedQs, Record<string, any>>,
    classes: { module: IModule }[],
    res: Response<any, Record<string, any>, number>,
    type: "get" | "post"
) {
    const path = req.params.path;
    const requestedModule = classes.filter((p) => path === p.module.path);
    const mod = requestedModule[0]?.module;
    if (mod) {
        const moduleResult = mod.fn(type === "get" ? req.query : req.body); // Validation is a module responsibility. GET gets query params, POST get the body

        log(
            `${mod.emoji} /wish/${path} 📤 ${colorForStatus(
                moduleResult.status
            )}${moduleResult.response}\x1b[0m`
        );

        res.send(moduleResult.response).status(moduleResult.status);
    } else {
        log(
            `❌\x1b[31mModule on path: \x1b[91m/wish/${path}\x1b[31m not found.\x1b[0m`
        );
        res.send("Requested module not found").status(404);
    }
}
