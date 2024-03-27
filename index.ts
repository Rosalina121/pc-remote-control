import type { IModule, moduleReq } from "./interfaces/IModule";

import { promises as fs } from "fs";
import path from "path";

import express from "express";
import type { Response } from "express-serve-static-core";
import multer from "multer"


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
    if (status >= 500) {
        return "\x1b[31m";
    } else if (status >= 400) {
        return "\x1b[33m";
    } else {
        return "\x1b[32m";
    }
}

/**
 * Main function. Runs the Express server and handles requests and response formatting in the console
 */
async function main() {
    // modules stuff
    const dir = path.resolve("./modules");
    const classes = await loadClasses(dir);

    // multer stuff
    const storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, 'uploads/');     // Upload folder. Change to yours
        },
        filename: function (req, file, callback) {
            callback(null, file.originalname);
        }
    });
    const upload = multer({ storage: storage });

    // express stuff
    const app = express();
    const port = 3000;
    const host = "0.0.0.0";

    app.all("/wish/:path", upload.single('file'), (req, res) => handleRequest(req, classes, res));

    app.listen(port, host, () => {
        log(`Listening on http://localhost:${port} ...`); // TODO: Move the PC emoji to like a general function, like log() or sth
    });
}

main();

function handleRequest(
    req: moduleReq,
    classes: { module: IModule }[],
    res: Response<any, Record<string, any>, number>
) {
    const path = req.params.path;
    const matchingClass = classes.filter((p) => path === p.module.path);
    const requestedModule = matchingClass[0]?.module;
    if (requestedModule) {
        const moduleResult = requestedModule.fn(req); // req validation is a module responsibility.

        log(
            `${requestedModule.emoji} /wish/${path} 📤 ${colorForStatus(
                moduleResult.status
            )}${moduleResult.response}\x1b[0m`
        );

        res.send(moduleResult.response).status(moduleResult.status);
    } else {
        log(
            `❌ \x1b[31mModule on path: \x1b[91m/wish/${path}\x1b[31m not found.\x1b[0m`
        );
        res.send("Requested module not found").status(404);
    }
}
