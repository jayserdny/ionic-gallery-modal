import { HammerGestureConfig } from '@angular/platform-browser';
export declare class GalleryModalHammerConfig extends HammerGestureConfig {
    overrides: {
        pan: {
            direction: number;
        };
        press: {
            time: number;
        };
    };
}
