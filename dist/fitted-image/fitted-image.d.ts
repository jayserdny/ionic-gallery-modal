import { OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
export declare class FittedImage implements OnInit, OnDestroy {
    photo: any;
    resizeTriggerer: Subject<any>;
    wrapperWidth: number;
    wrapperHeight: number;
    onImageResized: EventEmitter<{}>;
    private loading;
    private currentDimensions;
    private originalDimensions;
    private imageStyle;
    private resizeSubscription;
    constructor();
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * Called every time the window gets resized
     */
    resize(event: any): void;
    /**
     * Get the real image dimensions and other useful stuff
     */
    private imageLoad(event);
    /**
     * Save the image dimensions (when it has the image)
     */
    private saveImageDimensions();
}
