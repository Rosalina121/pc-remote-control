import type { IModule } from "../interfaces/IModule";
import {keyboard, Key} from '@nut-tree/nut-js';

class Mute implements IModule {
    path = "/mute";

    fn(): string {
        // My Discord mute bind
        // TODO: just mute the device, NirCMD?
        keyboard.type(Key.LeftControl, Key.Backslash);
        return "Mute!";
    }
}

export const module = new Mute()