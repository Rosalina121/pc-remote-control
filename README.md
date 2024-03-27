# pc-remote-control

A [Bun](https://bun.sh) server for remote control for your PC.
To install dependencies:

## Quickstart

```bash
bun install
```

To run:

```bash
bun run start
```

## Modules

Each functionality is split into modules in, well, `/modules`. It's just a TS class extending the `IModule`. All are loaded dynamically, so if you want to add something new, just create a new class and export the instance (or copy and adapt `Template.ts`).

A module has an `emoji`, `name`, `path` to be invoked on and `fn(request: moduleReq): IModuleResponse` performing a task. `IModuleResponse` is just a response string and a status code and `moduleReq` just an alias for Express Request.

## In this repo

### Available modules

Following modules are available when you pull this repo:

-   Ping - just responds with "Pong!"
-   Mute - for now just runs a key combination
    -   TODO: mute the default recording device instead
-   Shutdown - performs a shutdown in 60s or after specified time
    -   Also you can reboot and abort the shutdown
-   Volume - changes volume to provided value
-   Clipboard - sets clipboard to provided string or uploads a file to specified folder

### Dependencies

Some are cross-OS, some Win only. Here's the breakdown of which modules depend on what, so you know what you expect to work out of the box.

-   [NirCMD](https://www.nirsoft.net/utils/nircmd.html) - Windows only
    -   `Shutdown`, `Volume`
-   [clipboardy](https://github.com/sindresorhus/clipboardy) - cross-OS
    -   `Clipboard`
-   [nut-js](https://github.com/nut-tree/nut.js) - cross-OS
    -   `Mute`
