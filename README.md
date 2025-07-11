# pc-remote-control

A [Bun](https://bun.sh) server for remote control for your PC. Loosely based on my old [SiriFlask](https://github.com/Rosalina121/SiriFlask) project.

![Example CLI](example.png)

## Quickstart
To install:
```bash
bun i
```

To run:

```bash
bun start
```

When developing:
```bash
bun watch
```

## Config
`config.json` contains configuration for general app use (like files upload folder for Multer)
Each Module may have it's own config for more specific use.

## Modules

Each functionality is split into modules in, well, `/modules`. It's just a TS class extending the `IModule`. All are loaded dynamically, so if you want to add something new, just create a new class and export the instance (or copy and adapt `Template.ts`).

A module has an `emoji`, `name`, `path` to be invoked on and `fn(request: moduleReq): IModuleResponse` performing a task. `IModuleResponse` is just a response string and a status code and `moduleReq` just an alias for the Express Request.

Some modules have an extra `.json` file named same as the module, which contains extra configs. These have to be created manually, as in most cases they include things like tokens, or personal stuff. Check comments, as they should have more specific info.

An exception is the file upload "module". That one is baked into index.ts since that was easier.

## In this repo

### Available modules

Following modules are available when you pull this repo:

-   Ping - just responds with "Pong!"
-   Shutdown - performs a shutdown in 60s or after specified time
    -   Also you can reboot and abort the shutdown
    -   On Linux the seconds are rounded to minutes (wait why? TODO: change that lol)
-   Volume - changes volume to provided value
-   Clipboard - sets clipboard to the provided string
-   Upload - saves uploaded file to dir specified in `config.json`
-   Switch Audio - switches to the audio device of provided name
-   PlayPause - plays/pauses an [mpris](https://wiki.archlinux.org/title/MPRIS) media player

### OS support
Most modules will work regardless of the platform, but some may only work on a specific OS.
Basically the underlying logic has implementation for each one.
Also some modules may require extra dependencies to work correctly on certain systems.

**TODO: Enable modules based on the OS**

*Note:* As of 2025 Windows implementations are mostly untested, or missing. This is wholly because
I switched to daily driving Linux since I started this project. Feel free to raise any issues or create PRs related to Windows though.

Extra dependencies:
- `Clipboard` requires `xclip` (X11) or `wl-clipboard` (Wayland) on a Linux system (consult your package manager), `clip` on Windows, and `pbcopy/pbpaste` on macOS. It's making use of the `node-copy-paste` package.
- `Volume`, `Switch Audio` and `Shutdown` use [NirCMD](https://www.nirsoft.net/utils/nircmd.html) to work on Windows, `pactl` on Linux (tested with Pipewire).
- `Media` uses `playerctl` on Linux.
