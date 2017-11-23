(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('ionic-angular'), require('@angular/platform-browser'), require('rxjs/Subject')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', 'ionic-angular', '@angular/platform-browser', 'rxjs/Subject'], factory) :
	(factory((global['ionic-gallery-modal'] = {}),global.core,global.common,global.ionicAngular,global.platformBrowser,global.Subject));
}(this, (function (exports,core,common,ionicAngular,platformBrowser,Subject) { 'use strict';

var FittedImage = (function () {
    function FittedImage() {
        this.onImageResized = new core.EventEmitter();
        this.loading = true;
        this.currentDimensions = {
            width: 0,
            height: 0,
        };
        this.originalDimensions = {
            width: 0,
            height: 0,
        };
        this.imageStyle = {};
    }
    /**
     * @return {?}
     */
    FittedImage.prototype.ngOnInit = function () {
        var _this = this;
        // Listen to parent resize
        if (this.resizeTriggerer)
            this.resizeSubscription = this.resizeTriggerer.subscribe(function (event) {
                _this.resize(event);
            });
    };
    /**
     * @return {?}
     */
    FittedImage.prototype.ngOnDestroy = function () {
        this.resizeSubscription.unsubscribe();
    };
    /**
     * Called every time the window gets resized
     * @param {?} event
     * @return {?}
     */
    FittedImage.prototype.resize = function (event) {
        // Save the image dimensions
        this.saveImageDimensions();
    };
    /**
     * Get the real image dimensions and other useful stuff
     * @param {?} event
     * @return {?}
     */
    FittedImage.prototype.imageLoad = function (event) {
        // Save the original dimensions
        this.originalDimensions.width = event.target.width;
        this.originalDimensions.height = event.target.height;
        this.saveImageDimensions();
        // Mark as not loading anymore
        this.loading = false;
    };
    /**
     * Save the image dimensions (when it has the image)
     * @return {?}
     */
    FittedImage.prototype.saveImageDimensions = function () {
        var /** @type {?} */ width = this.originalDimensions.width;
        var /** @type {?} */ height = this.originalDimensions.height;
        if (width / height > this.wrapperWidth / this.wrapperHeight) {
            this.currentDimensions.width = this.wrapperWidth;
            this.currentDimensions.height = height / width * this.wrapperWidth;
        }
        else {
            this.currentDimensions.height = this.wrapperHeight;
            this.currentDimensions.width = width / height * this.wrapperHeight;
        }
        this.imageStyle.width = this.currentDimensions.width + "px";
        this.imageStyle.height = this.currentDimensions.height + "px";
        this.onImageResized.emit({
            width: this.currentDimensions.width,
            height: this.currentDimensions.height,
            originalWidth: this.originalDimensions.width,
            originalHeight: this.originalDimensions.height,
        });
    };
    FittedImage.decorators = [
        { type: core.Component, args: [{
                    selector: 'fitted-image',
                    template: "<div class=\"fitted-image\"> <ion-spinner [hidden]=\"!loading\"></ion-spinner> <img [src]=\"photo.url\" [ngStyle]=\"imageStyle\" (load)=\"imageLoad($event)\" [hidden]=\"loading\" alt=\"\" /> </div> ",
                    styles: [":host { display: inline-block; } :host .fitted-image { display: inline-block; position: relative; transform-origin: left top; background-repeat: no-repeat; background-position: center center; background-size: contain; text-align: left; vertical-align: top; } :host .fitted-image ion-spinner { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); } :host .fitted-image img { display: inline-block; min-width: 0; max-width: none; transform-origin: left top; vertical-align: top; pointer-events: none; } "],
                },] },
    ];
    /**
     * @nocollapse
     */
    FittedImage.ctorParameters = function () { return []; };
    FittedImage.propDecorators = {
        'photo': [{ type: core.Input },],
        'resizeTriggerer': [{ type: core.Input },],
        'wrapperWidth': [{ type: core.Input },],
        'wrapperHeight': [{ type: core.Input },],
        'onImageResized': [{ type: core.Output },],
    };
    return FittedImage;
}());

var ZoomableImage = (function () {
    function ZoomableImage() {
        this.disableScroll = new core.EventEmitter();
        this.enableScroll = new core.EventEmitter();
        this.zoomChange = new core.EventEmitter();
        this.scale = 1;
        this.scaleStart = 1;
        this.maxScale = 3;
        this.minScale = 1;
        this.minScaleBounce = 0.2;
        this.maxScaleBounce = 0.35;
        this.imageWidth = 0;
        this.imageHeight = 0;
        this.originalSize = {
            width: 0,
            height: 0,
        };
        this.position = {
            x: 0,
            y: 0,
        };
        this.scroll = {
            x: 0,
            y: 0,
        };
        this.centerRatio = {
            x: 0,
            y: 0,
        };
        this.centerStart = {
            x: 0,
            y: 0,
        };
        this.panCenterStart = {
            x: 0, y: 0,
        };
        this.containerStyle = {};
        this.imageStyle = {};
    }
    /**
     * @return {?}
     */
    ZoomableImage.prototype.ngOnInit = function () {
        var _this = this;
        // Get the scrollable element
        this.scrollableElement = this.ionScrollContainer.nativeElement.querySelector('.scroll-content');
        // Attach events
        this.attachEvents();
        // Listen to parent resize
        this.resizeSubscription = this.resizeTriggerer.subscribe(function (event) {
            _this.resize(event);
        });
    };
    /**
     * @return {?}
     */
    ZoomableImage.prototype.ngOnDestroy = function () {
        this.scrollableElement.removeEventListener('scroll', this.scrollListener);
        this.resizeSubscription.unsubscribe();
    };
    /**
     * Attach the events to the items
     * @return {?}
     */
    ZoomableImage.prototype.attachEvents = function () {
        // Scroll event
        this.scrollListener = this.scrollEvent.bind(this);
        this.scrollableElement.addEventListener('scroll', this.scrollListener);
    };
    /**
     * Called every time the window gets resized
     * @param {?} event
     * @return {?}
     */
    ZoomableImage.prototype.resize = function (event) {
        // Get the image dimensions
        this.saveImageDimensions();
    };
    /**
     * Called when the image has dimensions
     *
     * @param {?} dimensions
     * @return {?}
     */
    ZoomableImage.prototype.handleImageResized = function (dimensions) {
        this.imageWidth = dimensions.width;
        this.imageHeight = dimensions.height;
        this.originalSize.width = dimensions.originalWidth;
        this.originalSize.height = dimensions.originalHeight;
        this.saveImageDimensions();
    };
    /**
     * Save the image dimensions (when it has the image)
     * @return {?}
     */
    ZoomableImage.prototype.saveImageDimensions = function () {
        var /** @type {?} */ width = this.originalSize.width;
        this.maxScale = Math.max(width / this.imageWidth - this.maxScaleBounce, 1);
        this.displayScale();
    };
    /**
     * While the user is pinching
     *
     * @param {?} event
     * @return {?}
     */
    ZoomableImage.prototype.pinchEvent = function (event) {
        var /** @type {?} */ scale = this.scaleStart * event.scale;
        if (scale > this.maxScale) {
            scale = this.maxScale + (1 - this.maxScale / scale) * this.maxScaleBounce;
        }
        else if (scale < this.minScale) {
            scale = this.minScale - (1 - scale / this.minScale) * this.minScaleBounce;
        }
        this.scale = scale;
        this.displayScale();
        this.zoomChange.emit({
            scale: this.scale,
        });
        event.preventDefault();
    };
    /**
     * When the user starts pinching
     *
     * @param {?} event
     * @return {?}
     */
    ZoomableImage.prototype.pinchStartEvent = function (event) {
        this.scaleStart = this.scale;
        this.setCenter(event);
    };
    /**
     * When the user stops pinching
     *
     * @param {?} event
     * @return {?}
     */
    ZoomableImage.prototype.pinchEndEvent = function (event) {
        this.checkScroll();
        if (this.scale > this.maxScale) {
            this.animateScale(this.maxScale);
            this.zoomChange.emit({
                scale: this.maxScale,
            });
        }
        else if (this.scale < this.minScale) {
            this.animateScale(this.minScale);
            this.zoomChange.emit({
                scale: this.minScale,
            });
        }
        else {
            this.zoomChange.emit({
                scale: this.scale,
            });
        }
    };
    /**
     * When the user double taps on the photo
     *
     * @param {?} event
     * @return {?}
     */
    ZoomableImage.prototype.doubleTapEvent = function (event) {
        this.setCenter(event);
        var /** @type {?} */ scale = this.scale > 1 ? 1 : 2.5;
        if (scale > this.maxScale) {
            scale = this.maxScale;
        }
        this.zoomChange.emit({
            scale: scale,
        });
        this.animateScale(scale);
    };
    /**
     * Called when the user is panning
     *
     * @param {?} event
     * @return {?}
     */
    ZoomableImage.prototype.panEvent = function (event) {
        // calculate center x,y since pan started
        var /** @type {?} */ x = Math.max(Math.floor(this.panCenterStart.x + event.deltaX), 0);
        var /** @type {?} */ y = Math.max(Math.floor(this.panCenterStart.y + event.deltaY), 0);
        this.centerStart.x = x;
        this.centerStart.y = y;
        if (event.isFinal) {
            this.panCenterStart.x = x;
            this.panCenterStart.y = y;
        }
        this.displayScale();
    };
    /**
     * When the user is scrolling
     *
     * @param {?} event
     * @return {?}
     */
    ZoomableImage.prototype.scrollEvent = function (event) {
        this.scroll.x = event.target.scrollLeft;
        this.scroll.y = event.target.scrollTop;
    };
    /**
     * Set the startup center calculated on the image (along with the ratio)
     *
     * @param {?} event
     * @return {?}
     */
    ZoomableImage.prototype.setCenter = function (event) {
        var /** @type {?} */ realImageWidth = this.imageWidth * this.scale;
        var /** @type {?} */ realImageHeight = this.imageHeight * this.scale;
        this.centerStart.x = Math.max(event.center.x - this.position.x * this.scale, 0);
        this.centerStart.y = Math.max(event.center.y - this.position.y * this.scale, 0);
        this.panCenterStart.x = Math.max(event.center.x - this.position.x * this.scale, 0);
        this.panCenterStart.y = Math.max(event.center.y - this.position.y * this.scale, 0);
        this.centerRatio.x = Math.min((this.centerStart.x + this.scroll.x) / realImageWidth, 1);
        this.centerRatio.y = Math.min((this.centerStart.y + this.scroll.y) / realImageHeight, 1);
    };
    /**
     * Calculate the position and set the proper scale to the element and the
     * container
     * @return {?}
     */
    ZoomableImage.prototype.displayScale = function () {
        var /** @type {?} */ realImageWidth = this.imageWidth * this.scale;
        var /** @type {?} */ realImageHeight = this.imageHeight * this.scale;
        this.position.x = Math.max((this.wrapperWidth - realImageWidth) / (2 * this.scale), 0);
        this.position.y = Math.max((this.wrapperHeight - realImageHeight) / (2 * this.scale), 0);
        this.imageStyle.transform = "scale(" + this.scale + ") translate(" + this.position.x + "px, " + this.position.y + "px)";
        this.containerStyle.width = realImageWidth + "px";
        this.containerStyle.height = realImageHeight + "px";
        this.scroll.x = this.centerRatio.x * realImageWidth - this.centerStart.x;
        this.scroll.y = this.centerRatio.y * realImageWidth - this.centerStart.y;
        // Set scroll of the ion scroll
        this.scrollableElement.scrollLeft = this.scroll.x;
        this.scrollableElement.scrollTop = this.scroll.y;
    };
    /**
     * Check wether to disable or enable scroll and then call the events
     * @return {?}
     */
    ZoomableImage.prototype.checkScroll = function () {
        if (this.scale > 1) {
            this.disableScroll.emit({});
        }
        else {
            this.enableScroll.emit({});
        }
    };
    /**
     * Animates to a certain scale (with ease)
     *
     * @param {?} scale
     * @return {?}
     */
    ZoomableImage.prototype.animateScale = function (scale) {
        this.scale += (scale - this.scale) / 5;
        if (Math.abs(this.scale - scale) <= 0.1) {
            this.scale = scale;
        }
        this.displayScale();
        if (Math.abs(this.scale - scale) > 0.1) {
            window.requestAnimationFrame(this.animateScale.bind(this, scale));
        }
        else {
            this.checkScroll();
        }
    };
    ZoomableImage.decorators = [
        { type: core.Component, args: [{
                    selector: 'zoomable-image',
                    template: "<ion-scroll #ionScrollContainer scrollX=\"true\" scrollY=\"true\" zoom=\"false\"> <div class=\"image\" touch-events direction=\"y\" (pinch)=\"pinchEvent($event)\" (pinchstart)=\"pinchStartEvent($event)\" (pinchend)=\"pinchEndEvent($event)\" (doubletap)=\"doubleTapEvent($event)\" (onpan)=\"panEvent($event)\" [ngStyle]=\"containerStyle\" > <fitted-image [photo]=\"photo\" [ngStyle]=\"imageStyle\" [resizeTriggerer]=\"resizeTriggerer\" [wrapperWidth]=\"wrapperWidth\" [wrapperHeight]=\"wrapperHeight\" (onImageResized)=\"handleImageResized($event)\" ></fitted-image> </div> </ion-scroll> <div class=\"fitted-image-title\" *ngIf=\"photo.title\" >{{ photo.title }}</div> ",
                    styles: [":host { display: block; position: relative; width: 100%; height: 100%; } :host ion-scroll { width: 100%; height: 100%; text-align: left; white-space: nowrap; } :host ion-scroll /deep/ .scroll-zoom-wrapper { width: 100%; height: 100%; } :host ion-scroll .image { display: inline-block; position: relative; min-width: 100%; min-height: 100%; transform-origin: left top; background-repeat: no-repeat; background-position: center center; background-size: contain; text-align: left; vertical-align: top; } :host ion-scroll .image fitted-image { transform-origin: left top; pointer-events: none; } :host .fitted-image-title { position: absolute; bottom: 0; left: 0; width: 100%; padding: 15px; background-color: rgba(0, 0, 0, 0.3); color: white; font-size: 14px; line-height: 18px; text-align: center; z-index: 1; } "],
                },] },
    ];
    /**
     * @nocollapse
     */
    ZoomableImage.ctorParameters = function () { return []; };
    ZoomableImage.propDecorators = {
        'ionScrollContainer': [{ type: core.ViewChild, args: ['ionScrollContainer', { read: core.ElementRef },] },],
        'photo': [{ type: core.Input },],
        'resizeTriggerer': [{ type: core.Input },],
        'wrapperWidth': [{ type: core.Input },],
        'wrapperHeight': [{ type: core.Input },],
        'disableScroll': [{ type: core.Output },],
        'enableScroll': [{ type: core.Output },],
        'zoomChange': [{ type: core.Output },],
    };
    return ZoomableImage;
}());

var GalleryModal = (function () {
    /**
     * @param {?} viewCtrl
     * @param {?} params
     * @param {?} element
     * @param {?} platform
     * @param {?} domSanitizer
     */
    function GalleryModal(viewCtrl, params, element, platform, domSanitizer) {
        this.viewCtrl = viewCtrl;
        this.element = element;
        this.platform = platform;
        this.domSanitizer = domSanitizer;
        this.sliderDisabled = false;
        this.initialSlide = 0;
        this.currentSlide = 0;
        this.sliderLoaded = false;
        this.closeIcon = 'arrow-back';
        this.resizeTriggerer = new Subject.Subject();
        this.slidesDragging = false;
        this.panUpDownRatio = 0;
        this.panUpDownDeltaY = 0;
        this.dismissed = false;
        this.width = 0;
        this.height = 0;
        this.slidesStyle = {
            visibility: 'hidden',
        };
        this.modalStyle = {
            backgroundColor: 'rgba(0, 0, 0, 1)',
        };
        this.transitionDuration = '200ms';
        this.transitionTimingFunction = 'cubic-bezier(0.33, 0.66, 0.66, 1)';
        this.photos = params.get('photos') || [];
        this.options = params.get('options') || { hasPagination: false, paginationType: null };
        this.closeIcon = params.get('closeIcon') || 'arrow-back';
        this.initialSlide = params.get('initialSlide') || 0;
        this.initialImage = this.photos[this.initialSlide] || {};
    }
    /**
     * @return {?}
     */
    GalleryModal.prototype.ngOnInit = function () {
        // call resize on init
        this.resize({});
    };
    /**
     * Closes the modal (when user click on CLOSE)
     * @return {?}
     */
    GalleryModal.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    GalleryModal.prototype.resize = function (event) {
        if (this.slider)
            this.slider.update();
        this.width = this.element.nativeElement.offsetWidth;
        this.height = this.element.nativeElement.offsetHeight;
        this.resizeTriggerer.next({
            width: this.width,
            height: this.height,
        });
    };
    /**
     * @param {?} event
     * @return {?}
     */
    GalleryModal.prototype.orientationChange = function (event) {
        var _this = this;
        // TODO: See if you can remove timeout
        window.setTimeout(function () {
            _this.resize(event);
        }, 150);
    };
    /**
     * When the modal has entered into view
     * @return {?}
     */
    GalleryModal.prototype.ionViewDidEnter = function () {
        this.resize(false);
        this.sliderLoaded = true;
        this.slidesStyle.visibility = 'visible';
    };
    /**
     * Disables the scroll through the slider
     *
     * @param {?} event
     * @return {?}
     */
    GalleryModal.prototype.disableScroll = function (event) {
        if (!this.sliderDisabled) {
            this.currentSlide = this.slider.getActiveIndex();
            this.sliderDisabled = true;
        }
    };
    /**
     * Enables the scroll through the slider
     *
     * @param {?} event
     * @return {?}
     */
    GalleryModal.prototype.enableScroll = function (event) {
        if (this.sliderDisabled) {
            this.slider.slideTo(this.currentSlide, 0, false);
            this.sliderDisabled = false;
        }
    };
    /**
     * Called while dragging to close modal
     *
     * @param {?} event
     * @return {?}
     */
    GalleryModal.prototype.slidesDrag = function (event) {
        this.slidesDragging = true;
    };
    /**
     * Called when the user pans up/down
     *
     * @param {?} event
     * @return {?}
     */
    GalleryModal.prototype.panUpDownEvent = function (event) {
        event.preventDefault();
        if (this.slidesDragging || this.sliderDisabled) {
            return;
        }
        var /** @type {?} */ ratio = (event.distance / (this.height / 2));
        if (ratio > 1) {
            ratio = 1;
        }
        else if (ratio < 0) {
            ratio = 0;
        }
        var /** @type {?} */ scale = (event.deltaY < 0 ? 1 : 1 - (ratio * 0.2));
        var /** @type {?} */ opacity = (event.deltaY < 0 ? 1 - (ratio * 0.5) : 1 - (ratio * 0.2));
        var /** @type {?} */ backgroundOpacity = (event.deltaY < 0 ? 1 : 1 - (ratio * 0.8));
        this.panUpDownRatio = ratio;
        this.panUpDownDeltaY = event.deltaY;
        this.slidesStyle.transform = "translate(0, " + event.deltaY + "px) scale(" + scale + ")";
        this.slidesStyle.opacity = opacity;
        this.modalStyle.backgroundColor = "rgba(0, 0, 0, " + backgroundOpacity + ")";
        delete this.slidesStyle.transitionProperty;
        delete this.slidesStyle.transitionDuration;
        delete this.slidesStyle.transitionTimingFunction;
        delete this.modalStyle.transitionProperty;
        delete this.modalStyle.transitionDuration;
        delete this.modalStyle.transitionTimingFunction;
    };
    /**
     * Called when the user stopped panning up/down
     *
     * @param {?} event
     * @return {?}
     */
    GalleryModal.prototype.panEndEvent = function (event) {
        this.slidesDragging = false;
        this.panUpDownRatio += event.velocityY * 30;
        if (this.panUpDownRatio >= 0.65 && this.panUpDownDeltaY > 0) {
            if (!this.dismissed) {
                this.dismiss();
            }
            this.dismissed = true;
        }
        else {
            this.slidesStyle.transitionProperty = 'transform';
            this.slidesStyle.transitionTimingFunction = this.transitionTimingFunction;
            this.slidesStyle.transitionDuration = this.transitionDuration;
            this.modalStyle.transitionProperty = 'background-color';
            this.modalStyle.transitionTimingFunction = this.transitionTimingFunction;
            this.modalStyle.transitionDuration = this.transitionDuration;
            this.slidesStyle.transform = 'none';
            this.slidesStyle.opacity = 1;
            this.modalStyle.backgroundColor = 'rgba(0, 0, 0, 1)';
        }
    };
    GalleryModal.decorators = [
        { type: core.Component, args: [{
                    selector: 'gallery-modal',
                    template: "<ion-content class=\"gallery-modal\" no-bounce [ngStyle]=\"modalStyle\" (window:resize)=\"resize($event)\" (window:orientationchange)=\"orientationChange($event)\" > <button class=\"close-button\" ion-button icon-only (click)=\"dismiss()\"> <ion-icon name=\"{{ closeIcon }}\"></ion-icon> </button> <!-- Initial image while modal is animating --> <div class=\"image-on-top\" [hidden]=\"sliderLoaded\"> <zoomable-image [photo]=\"initialImage\" [resizeTriggerer]=\"resizeTriggerer\" [wrapperWidth]=\"width\" [wrapperHeight]=\"height\" ></zoomable-image> </div> <!-- Slider with images --> <ion-slides class=\"slider\" #slider *ngIf=\"photos.length\" [initialSlide]=\"initialSlide\" [ngStyle]=\"slidesStyle\" [pager]=\"options.hasPagination\"  [paginationType]=\"options.paginationType\" touch-events (ionSlideDrag)=\"slidesDrag($event)\" (panup)=\"panUpDownEvent($event)\" (pandown)=\"panUpDownEvent($event)\" (panend)=\"panEndEvent($event)\" (pancancel)=\"panEndEvent($event)\" > <ion-slide *ngFor=\"let photo of photos;\" > <zoomable-image [photo]=\"photo\" [resizeTriggerer]=\"resizeTriggerer\" [wrapperWidth]=\"width\" [wrapperHeight]=\"height\" [ngClass]=\"{ 'swiper-no-swiping': sliderDisabled }\" (disableScroll)=\"disableScroll($event)\" (enableScroll)=\"enableScroll($event)\" ></zoomable-image> some test </ion-slide> </ion-slides> </ion-content> ",
                    styles: [":host .gallery-modal { position: relative; overflow: hidden; } :host .gallery-modal .close-button { position: absolute; top: 10px; left: 5px; background: none; box-shadow: none; z-index: 10; } :host .gallery-modal .close-button.button-ios { top: 20px; } :host .gallery-modal .slider /deep/ .slide-zoom { position: relative; height: 100%; } :host .gallery-modal .image-on-top { display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 10; } :host .gallery-modal .image-on-top fitted-image { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); } :host .gallery-modal .swiper-pagination { color: white !important; } "],
                },] },
    ];
    /**
     * @nocollapse
     */
    GalleryModal.ctorParameters = function () { return [
        { type: ionicAngular.ViewController, },
        { type: ionicAngular.NavParams, },
        { type: core.ElementRef, },
        { type: ionicAngular.Platform, },
        { type: platformBrowser.DomSanitizer, },
    ]; };
    GalleryModal.propDecorators = {
        'slider': [{ type: core.ViewChild, args: ['slider',] },],
    };
    return GalleryModal;
}());

var TouchEventsDirective = (function () {
    /**
     * @param {?} el
     */
    function TouchEventsDirective(el) {
        this.el = el;
        this.direction = 'x';
        this.threshold = 10;
        this.pinch = new core.EventEmitter();
        this.pinchstart = new core.EventEmitter();
        this.pinchend = new core.EventEmitter();
        this.onpan = new core.EventEmitter();
        this.panup = new core.EventEmitter();
        this.pandown = new core.EventEmitter();
        this.panleft = new core.EventEmitter();
        this.panright = new core.EventEmitter();
        this.panend = new core.EventEmitter();
        this.pancancel = new core.EventEmitter();
        this.doubletap = new core.EventEmitter();
    }
    /**
     * @return {?}
     */
    TouchEventsDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.gestureListener = new ionicAngular.Gesture(this.el.nativeElement, {
            domEvents: false,
            enable: true,
            direction: this.direction,
            threshold: this.threshold,
        });
        this.gestureListener.listen();
        this.gestureListener.on('pinch', function (event) {
            _this.pinch.emit(event);
        });
        this.gestureListener.on('pinchstart', function (event) {
            _this.pinchstart.emit(event);
        });
        this.gestureListener.on('pinchend', function (event) {
            _this.pinchend.emit(event);
        });
        this.gestureListener.on('pan', function (event) {
            _this.onpan.emit(event);
        });
        this.gestureListener.on('panup', function (event) {
            _this.panup.emit(event);
        });
        this.gestureListener.on('pandown', function (event) {
            _this.pandown.emit(event);
        });
        this.gestureListener.on('panleft', function (event) {
            _this.panleft.emit(event);
        });
        this.gestureListener.on('panright', function (event) {
            _this.panright.emit(event);
        });
        this.gestureListener.on('panend', function (event) {
            _this.panend.emit(event);
        });
        this.gestureListener.on('pancancel', function (event) {
            _this.pancancel.emit(event);
        });
        this.gestureListener.on('doubletap', function (event) {
            _this.doubletap.emit(event);
        });
    };
    /**
     * @return {?}
     */
    TouchEventsDirective.prototype.ngOnDestroy = function () {
        this.gestureListener.destroy();
    };
    TouchEventsDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[touch-events]'
                },] },
    ];
    /**
     * @nocollapse
     */
    TouchEventsDirective.ctorParameters = function () { return [
        { type: core.ElementRef, },
    ]; };
    TouchEventsDirective.propDecorators = {
        'direction': [{ type: core.Input },],
        'threshold': [{ type: core.Input },],
        'pinch': [{ type: core.Output },],
        'pinchstart': [{ type: core.Output },],
        'pinchend': [{ type: core.Output },],
        'onpan': [{ type: core.Output },],
        'panup': [{ type: core.Output },],
        'pandown': [{ type: core.Output },],
        'panleft': [{ type: core.Output },],
        'panright': [{ type: core.Output },],
        'panend': [{ type: core.Output },],
        'pancancel': [{ type: core.Output },],
        'doubletap': [{ type: core.Output },],
    };
    return TouchEventsDirective;
}());

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GalleryModalHammerConfig = (function (_super) {
    __extends(GalleryModalHammerConfig, _super);
    function GalleryModalHammerConfig() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.overrides = {
            pan: {
                direction: 30,
            },
            press: {
                time: 300,
            },
        };
        return _this;
    }
    return GalleryModalHammerConfig;
}(platformBrowser.HammerGestureConfig));

var GalleryModalModule = (function () {
    function GalleryModalModule() {
    }
    GalleryModalModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [
                        common.CommonModule,
                        ionicAngular.IonicPageModule.forChild(TouchEventsDirective),
                        ionicAngular.IonicPageModule.forChild(FittedImage),
                        ionicAngular.IonicPageModule.forChild(ZoomableImage),
                        ionicAngular.IonicPageModule.forChild(GalleryModal),
                    ],
                    declarations: [
                        FittedImage,
                        ZoomableImage,
                        GalleryModal,
                        TouchEventsDirective,
                    ],
                    exports: [
                        FittedImage,
                        ZoomableImage,
                        GalleryModal,
                        TouchEventsDirective,
                    ],
                    entryComponents: [
                        GalleryModal,
                    ],
                },] },
    ];
    /**
     * @nocollapse
     */
    GalleryModalModule.ctorParameters = function () { return []; };
    return GalleryModalModule;
}());

exports.GalleryModalModule = GalleryModalModule;
exports.FittedImage = FittedImage;
exports.ZoomableImage = ZoomableImage;
exports.GalleryModal = GalleryModal;
exports.GalleryModalHammerConfig = GalleryModalHammerConfig;
exports.TouchEventsDirective = TouchEventsDirective;

Object.defineProperty(exports, '__esModule', { value: true });

})));
