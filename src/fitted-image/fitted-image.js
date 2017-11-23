"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var FittedImage = (function () {
    function FittedImage() {
        this.onImageResized = new core_1.EventEmitter();
        this.loading = true;
        this.currentDimensions = {
            width: 0,
            height: 0
        };
        this.originalDimensions = {
            width: 0,
            height: 0
        };
        this.imageStyle = {};
    }
    FittedImage.prototype.ngOnInit = function () {
        var _this = this;
        // Listen to parent resize
        if (this.resizeTriggerer)
            this.resizeSubscription = this.resizeTriggerer.subscribe(function (event) {
                _this.resize(event);
            });
    };
    FittedImage.prototype.ngOnDestroy = function () {
        this.resizeSubscription.unsubscribe();
    };
    /**
     * Called every time the window gets resized
     */
    FittedImage.prototype.resize = function (event) {
        // Save the image dimensions
        this.saveImageDimensions();
    };
    /**
     * Get the real image dimensions and other useful stuff
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
     */
    FittedImage.prototype.saveImageDimensions = function () {
        var width = this.originalDimensions.width;
        var height = this.originalDimensions.height;
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
            originalHeight: this.originalDimensions.height
        });
    };
    __decorate([
        core_1.Input()
    ], FittedImage.prototype, "photo");
    __decorate([
        core_1.Input()
    ], FittedImage.prototype, "resizeTriggerer");
    __decorate([
        core_1.Input()
    ], FittedImage.prototype, "wrapperWidth");
    __decorate([
        core_1.Input()
    ], FittedImage.prototype, "wrapperHeight");
    __decorate([
        core_1.Output()
    ], FittedImage.prototype, "onImageResized");
    FittedImage = __decorate([
        core_1.Component({
            selector: 'fitted-image',
            templateUrl: './fitted-image.html',
            styleUrls: ['./fitted-image.scss']
        })
    ], FittedImage);
    return FittedImage;
}());
exports.FittedImage = FittedImage;
