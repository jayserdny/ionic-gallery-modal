"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var platform_browser_1 = require("@angular/platform-browser");
var GalleryModalHammerConfig = (function (_super) {
    __extends(GalleryModalHammerConfig, _super);
    function GalleryModalHammerConfig() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.overrides = {
            pan: {
                direction: 30
            },
            press: {
                time: 300
            }
        };
        return _this;
    }
    return GalleryModalHammerConfig;
}(platform_browser_1.HammerGestureConfig));
exports.GalleryModalHammerConfig = GalleryModalHammerConfig;
