KEY_DOWN = 40;
KEY_UP = 38;
KEY_LEFT = 37;
KEY_RIGHT = 39;
KEY_END = 35;
KEY_BEGIN = 36;
KEY_BACK_TAB = 8;
KEY_TAB = 9;
KEY_SH_TAB = 16;
KEY_ENTER = 13;
KEY_ESC = 27;
KEY_SPACE = 32;
KEY_DEL = 46;
KEY_A = 65;
KEY_B = 66;
KEY_C = 67;
KEY_D = 68;
KEY_E = 69;
KEY_F = 70;
KEY_G = 71;
KEY_H = 72;
KEY_I = 73;
KEY_J = 74;
KEY_K = 75;
KEY_L = 76;
KEY_M = 77;
KEY_N = 78;
KEY_O = 79;
KEY_P = 80;
KEY_Q = 81;
KEY_R = 82;
KEY_S = 83;
KEY_T = 84;
KEY_U = 85;
KEY_V = 86;
KEY_W = 87;
KEY_X = 88;
KEY_Y = 89;
KEY_Z = 90;
KEY_PLUS = 107;
KEY_MINUS = 109;
KEY_PF1 = 112;
KEY_PF2 = 113;
KEY_PF3 = 114;
KEY_PF4 = 115;
KEY_PF5 = 116;
KEY_PF6 = 117;
KEY_PF7 = 118;
KEY_PF8 = 119;
KEY_ALT = 17;
KEY_ALT_GR = 18;
KEY_SBL = 221;
KEY_SBR = 220;

(function($) {
    var defaults;
    $.event.fix = (function(originalFix) {
        return function(event) {
            event = originalFix.apply(this, arguments);
            if (event.type.indexOf('copy') === 0 || event.type.indexOf('paste') === 0) {
                event.clipboardData = event.originalEvent.clipboardData;
            }
            return event;
        };
    })($.event.fix);
    defaults = {
        callback: $.noop,
        matchType: /image.*/
    };
    return $.fn.pasteImageReader = function(options) {
        if (typeof options === "function") {
            options = {
                callback: options
            };
        }
        options = $.extend({}, defaults, options);
        return this.each(function() {
            var $this, element;
            element = this;
            $this = $(this);
            return $this.bind('paste', function(event) {
                var clipboardData, found;
                found = false;
                clipboardData = event.clipboardData;
                return Array.prototype.forEach.call(clipboardData.types, function(type, i) {
                    var file, reader;
                    if (found) {
                        return;
                    }
                    if (type.match(options.matchType) || clipboardData.items[i].type.match(options.matchType)) {
                        file = clipboardData.items[i].getAsFile();
                        reader = new FileReader();
                        reader.onload = function(evt) {
                            return options.callback.call(element, {
                                dataURL: evt.target.result,
                                event: evt,
                                file: file,
                                name: file.name
                            });
                        };
                        reader.readAsDataURL(file);
                        return found = true;
                    }
                });
            });
        });
    };
})(jQuery);