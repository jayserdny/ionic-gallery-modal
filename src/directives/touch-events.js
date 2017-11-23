"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var ionic_angular_1 = require("ionic-angular");
var TouchEventsDirective = (function () {
    function TouchEventsDirective(el) {
        this.el = el;
        this.direction = 'x';
        this.threshold = 10;
        this.pinch = new core_1.EventEmitter();
        this.pinchstart = new core_1.EventEmitter();
        this.pinchend = new core_1.EventEmitter();
        this.onpan = new core_1.EventEmitter();
        this.panup = new core_1.EventEmitter();
        this.pandown = new core_1.EventEmitter();
        this.panleft = new core_1.EventEmitter();
        this.panright = new core_1.EventEmitter();
        this.panend = new core_1.EventEmitter();
        this.pancancel = new core_1.EventEmitter();
        this.doubletap = new core_1.EventEmitter();
    }
    TouchEventsDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.gestureListener = new ionic_angular_1.Gesture(this.el.nativeElement, {
            domEvents: false,
            enable: true,
            direction: this.direction,
            threshold: this.threshold
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
    TouchEventsDirective.prototype.ngOnDestroy = function () {
        this.gestureListener.destroy();
    };
    __decorate([
        core_1.Input()
    ], TouchEventsDirective.prototype, "direction");
    __decorate([
        core_1.Input()
    ], TouchEventsDirective.prototype, "threshold");
    __decorate([
        core_1.Output()
    ], TouchEventsDirective.prototype, "pinch");
    __decorate([
        core_1.Output()
    ], TouchEventsDirective.prototype, "pinchstart");
    __decorate([
        core_1.Output()
    ], TouchEventsDirective.prototype, "pinchend");
    __decorate([
        core_1.Output()
    ], TouchEventsDirective.prototype, "onpan");
    __decorate([
        core_1.Output()
    ], TouchEventsDirective.prototype, "panup");
    __decorate([
        core_1.Output()
    ], TouchEventsDirective.prototype, "pandown");
    __decorate([
        core_1.Output()
    ], TouchEventsDirective.prototype, "panleft");
    __decorate([
        core_1.Output()
    ], TouchEventsDirective.prototype, "panright");
    __decorate([
        core_1.Output()
    ], TouchEventsDirective.prototype, "panend");
    __decorate([
        core_1.Output()
    ], TouchEventsDirective.prototype, "pancancel");
    __decorate([
        core_1.Output()
    ], TouchEventsDirective.prototype, "doubletap");
    TouchEventsDirective = __decorate([
        core_1.Directive({
            selector: '[touch-events]'
        })
    ], TouchEventsDirective);
    return TouchEventsDirective;
}());
exports.TouchEventsDirective = TouchEventsDirective;
