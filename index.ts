import type { IModule, moduleReq } from "./interfaces/IModule";

import { promises as fs } from "fs";
import path from "path";

import express from "express";
import type { Response } from "express-serve-static-core";
import multer from "multer";

import { red, yellow, green, lightRed, white, blue, cyan } from "kolorist";

import config from "./config.json";

/**
 * Loads modules from provided directory.
 *
 * @param dir - directory to the modules
 * @returns instances of classes from modules
 */
async function loadClasses(dir: string): Promise<{ module: IModule }[]> {
    const files = await fs.readdir(dir);
    const classes: { module: IModule }[] = [];
    console.log("Loading modules...");

    for (const file of files) {
        if (file.endsWith(".ts")) {
            const filePath = path.join(dir, file);
            const importedModule = await import(filePath);
            classes.push(importedModule);
        }
    }
    console.log("Loaded", green(`${classes.length}`), "modules:");
    console.log(
        blue(
            `${classes
                .map((c) => c.module.emoji + " " + c.module.name)
                .join(white(","))}`
        )
    );
    // TODO: validate duplicate paths
    return classes;
}

function colorForStatus(status: number, text: string): string {
    if (status >= 500) {
        return red(text);
    } else if (status >= 400) {
        return yellow(text);
    } else {
        return green(text);
    }
}

/**
 * Main function. Runs the Express server and handles requests and response formatting in the console
 */
async function main() {
    console.log(`💻 PC Remote Control v0.1`);

    // modules stuff
    const dir = path.resolve("./modules");
    const classes = await loadClasses(dir);

    // multer stuff
    const storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, config.uploadsPath); // Upload folder. Change to yours
        },
        filename: function (req, file, callback) {
            callback(null, file.originalname);
        },
    });
    const upload = multer({ storage: storage });

    // express stuff
    const app = express();
    const port = 3000;
    const host = "0.0.0.0";

    app.use(express.json());

    app.all("/wish/:path", upload.single("file"), (req, res) =>
        handleRequest(req, classes, res)
    );

    app.listen(port, host, () => {
        console.log("Listening on 🌍", cyan(`http://localhost:${port}`));
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
        Promise.resolve(moduleResult).then((mr) => {
            console.log(
                `${requestedModule.emoji} /wish/${path} • ${colorForStatus(
                    mr.status,
                    mr.response
                )}`
            );

            res.send(mr.response).status(mr.status);
        });
    } else {
        console.log(
            `❌ ${red("Module on path:")} ${lightRed("/wish/${path}")} ${red(
                "not found."
            )}`
        );
        res.send("Requested module not found").status(404);
    }
}
