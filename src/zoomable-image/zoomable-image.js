"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var ZoomableImage = (function () {
    function ZoomableImage() {
        this.disableScroll = new core_1.EventEmitter();
        this.enableScroll = new core_1.EventEmitter();
        this.zoomChange = new core_1.EventEmitter();
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
            height: 0
        };
        this.position = {
            x: 0,
            y: 0
        };
        this.scroll = {
            x: 0,
            y: 0
        };
        this.centerRatio = {
            x: 0,
            y: 0
        };
        this.centerStart = {
            x: 0,
            y: 0
        };
        this.panCenterStart = {
            x: 0, y: 0
        };
        this.containerStyle = {};
        this.imageStyle = {};
    }
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
    ZoomableImage.prototype.ngOnDestroy = function () {
        this.scrollableElement.removeEventListener('scroll', this.scrollListener);
        this.resizeSubscription.unsubscribe();
    };
    /**
     * Attach the events to the items
     */
    ZoomableImage.prototype.attachEvents = function () {
        // Scroll event
        this.scrollListener = this.scrollEvent.bind(this);
        this.scrollableElement.addEventListener('scroll', this.scrollListener);
    };
    /**
     * Called every time the window gets resized
     */
    ZoomableImage.prototype.resize = function (event) {
        // Get the image dimensions
        this.saveImageDimensions();
    };
    /**
     * Called when the image has dimensions
     *
     * @param  {Object} dimensions
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
     */
    ZoomableImage.prototype.saveImageDimensions = function () {
        var width = this.originalSize.width;
        var height = this.originalSize.height;
        this.maxScale = Math.max(width / this.imageWidth - this.maxScaleBounce, 1);
        this.displayScale();
    };
    /**
     * While the user is pinching
     *
     * @param  {Hammer.Event} event
     */
    ZoomableImage.prototype.pinchEvent = function (event) {
        var scale = this.scaleStart * event.scale;
        if (scale > this.maxScale) {
            scale = this.maxScale + (1 - this.maxScale / scale) * this.maxScaleBounce;
        }
        else if (scale < this.minScale) {
            scale = this.minScale - (1 - scale / this.minScale) * this.minScaleBounce;
        }
        this.scale = scale;
        this.displayScale();
        this.zoomChange.emit({
            scale: this.scale
        });
        event.preventDefault();
    };
    /**
     * When the user starts pinching
     *
     * @param  {Hammer.Event} event
     */
    ZoomableImage.prototype.pinchStartEvent = function (event) {
        this.scaleStart = this.scale;
        this.setCenter(event);
    };
    /**
     * When the user stops pinching
     *
     * @param  {Hammer.Event} event
     */
    ZoomableImage.prototype.pinchEndEvent = function (event) {
        this.checkScroll();
        if (this.scale > this.maxScale) {
            this.animateScale(this.maxScale);
            this.zoomChange.emit({
                scale: this.maxScale
            });
        }
        else if (this.scale < this.minScale) {
            this.animateScale(this.minScale);
            this.zoomChange.emit({
                scale: this.minScale
            });
        }
        else {
            this.zoomChange.emit({
                scale: this.scale
            });
        }
    };
    /**
     * When the user double taps on the photo
     *
     * @param  {Hammer.Event} event
     */
    ZoomableImage.prototype.doubleTapEvent = function (event) {
        this.setCenter(event);
        var scale = this.scale > 1 ? 1 : 2.5;
        if (scale > this.maxScale) {
            scale = this.maxScale;
        }
        this.zoomChange.emit({
            scale: scale
        });
        this.animateScale(scale);
    };
    /**
     * Called when the user is panning
     *
     * @param  {Hammer.Event} event
     */
    ZoomableImage.prototype.panEvent = function (event) {
        // calculate center x,y since pan started
        var x = Math.max(Math.floor(this.panCenterStart.x + event.deltaX), 0);
        var y = Math.max(Math.floor(this.panCenterStart.y + event.deltaY), 0);
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
     * @param  {Event} event
     */
    ZoomableImage.prototype.scrollEvent = function (event) {
        this.scroll.x = event.target.scrollLeft;
        this.scroll.y = event.target.scrollTop;
    };
    /**
     * Set the startup center calculated on the image (along with the ratio)
     *
     * @param  {Hammer.Event} event
     */
    ZoomableImage.prototype.setCenter = function (event) {
        var realImageWidth = this.imageWidth * this.scale;
        var realImageHeight = this.imageHeight * this.scale;
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
     */
    ZoomableImage.prototype.displayScale = function () {
        var realImageWidth = this.imageWidth * this.scale;
        var realImageHeight = this.imageHeight * this.scale;
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
     * @param  {number} scale
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
    __decorate([
        core_1.ViewChild('ionScrollContainer', { read: core_1.ElementRef })
    ], ZoomableImage.prototype, "ionScrollContainer");
    __decorate([
        core_1.Input()
    ], ZoomableImage.prototype, "photo");
    __decorate([
        core_1.Input()
    ], ZoomableImage.prototype, "resizeTriggerer");
    __decorate([
        core_1.Input()
    ], ZoomableImage.prototype, "wrapperWidth");
    __decorate([
        core_1.Input()
    ], ZoomableImage.prototype, "wrapperHeight");
    __decorate([
        core_1.Output()
    ], ZoomableImage.prototype, "disableScroll");
    __decorate([
        core_1.Output()
    ], ZoomableImage.prototype, "enableScroll");
    __decorate([
        core_1.Output()
    ], ZoomableImage.prototype, "zoomChange");
    ZoomableImage = __decorate([
        core_1.Component({
            selector: 'zoomable-image',
            templateUrl: './zoomable-image.html',
            styleUrls: ['./zoomable-image.scss']
        })
    ], ZoomableImage);
    return ZoomableImage;
}());
exports.ZoomableImage = ZoomableImage;
