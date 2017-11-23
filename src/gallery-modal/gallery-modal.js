"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var GalleryModal = (function () {
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
        this.resizeTriggerer = new Subject_1.Subject();
        this.slidesDragging = false;
        this.panUpDownRatio = 0;
        this.panUpDownDeltaY = 0;
        this.dismissed = false;
        this.width = 0;
        this.height = 0;
        this.slidesStyle = {
            visibility: 'hidden'
        };
        this.modalStyle = {
            backgroundColor: 'rgba(0, 0, 0, 1)'
        };
        this.transitionDuration = '200ms';
        this.transitionTimingFunction = 'cubic-bezier(0.33, 0.66, 0.66, 1)';
        this.photos = params.get('photos') || [];
        this.options = params.get('options') || { hasPagination: false, paginationType: null };
        this.closeIcon = params.get('closeIcon') || 'arrow-back';
        this.initialSlide = params.get('initialSlide') || 0;
        this.initialImage = this.photos[this.initialSlide] || {};
    }
    GalleryModal.prototype.ngOnInit = function () {
        // call resize on init
        this.resize({});
    };
    /**
     * Closes the modal (when user click on CLOSE)
     */
    GalleryModal.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    GalleryModal.prototype.resize = function (event) {
        if (this.slider)
            this.slider.update();
        this.width = this.element.nativeElement.offsetWidth;
        this.height = this.element.nativeElement.offsetHeight;
        this.resizeTriggerer.next({
            width: this.width,
            height: this.height
        });
    };
    GalleryModal.prototype.orientationChange = function (event) {
        var _this = this;
        // TODO: See if you can remove timeout
        window.setTimeout(function () {
            _this.resize(event);
        }, 150);
    };
    /**
     * When the modal has entered into view
     */
    GalleryModal.prototype.ionViewDidEnter = function () {
        this.resize(false);
        this.sliderLoaded = true;
        this.slidesStyle.visibility = 'visible';
    };
    /**
     * Disables the scroll through the slider
     *
     * @param  {Event} event
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
     * @param  {Event} event
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
     * @param  {Event} event
     */
    GalleryModal.prototype.slidesDrag = function (event) {
        this.slidesDragging = true;
    };
    /**
     * Called when the user pans up/down
     *
     * @param  {Hammer.Event} event
     */
    GalleryModal.prototype.panUpDownEvent = function (event) {
        event.preventDefault();
        if (this.slidesDragging || this.sliderDisabled) {
            return;
        }
        var ratio = (event.distance / (this.height / 2));
        if (ratio > 1) {
            ratio = 1;
        }
        else if (ratio < 0) {
            ratio = 0;
        }
        var scale = (event.deltaY < 0 ? 1 : 1 - (ratio * 0.2));
        var opacity = (event.deltaY < 0 ? 1 - (ratio * 0.5) : 1 - (ratio * 0.2));
        var backgroundOpacity = (event.deltaY < 0 ? 1 : 1 - (ratio * 0.8));
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
     * @param  {Hammer.Event} event
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
    __decorate([
        core_1.ViewChild('slider')
    ], GalleryModal.prototype, "slider");
    GalleryModal = __decorate([
        core_1.Component({
            selector: 'gallery-modal',
            templateUrl: './gallery-modal.html',
            styleUrls: ['./gallery-modal.scss']
        })
    ], GalleryModal);
    return GalleryModal;
}());
exports.GalleryModal = GalleryModal;
