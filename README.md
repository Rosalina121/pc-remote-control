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
Each functionality is split into modules in, well, `/modules`. It's just a TS class extending the `IModule`. All are loaded dynamically, so if you want to add something new, just create a new class and export the instance.
### OS specific stuff
While Bun and TS are all fun and portable, the OS-specific actions are not. Default modules in this repo are created with Windows in mind, as that's what I'm driving personally. They prolly won't work out of the box on Linux or Mac.
