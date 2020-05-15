var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
jQuery.fn.pagiuery = function pagiuery(customOptions) {
    var _a;
    var _this = this;
    var defaultOptions = (_a = {
            items: 'li'
        },
        _a["desktop" /* desktop */] = {
            "default": 3,
            increment: 3,
            width: 1025
        },
        _a.tablet = {
            "default": 2,
            increment: 2,
            width: 768
        },
        _a.mobile = {
            "default": 1,
            increment: 1,
            width: 0
        },
        _a.showLess = true,
        _a.more = {
            text: 'Show more',
            "class": ''
        },
        _a.less = {
            text: 'Show less',
            "class": ''
        },
        _a.count = true,
        _a.totalRemaining = false,
        _a);
    var options = __assign(__assign({}, defaultOptions), customOptions);
    var items;
    var buttonMore;
    var buttonLess;
    var viewport;
    var addButtons = function (count, showMoreItems, showLessItems) {
        var buttonContainer = jQuery('<div class="btn-container"></div>');
        buttonMore = jQuery("<button class=\"show-more__btn " + options.more["class"] + "\">" + options.more.text + "&nbsp;(<span class=\"count\">" + count + "</span>)</button>");
        if (items.length <= options[viewport]["default"]) {
            buttonMore.hide();
        }
        buttonLess = jQuery("<button class=\"show-less__btn " + options.less["class"] + "\">" + options.less.text + "</button>").hide();
        buttonMore.click(showMoreItems);
        if (!options.count) {
            buttonMore.find('.count').hide();
        }
        buttonLess.click(showLessItems);
        buttonContainer.append(buttonMore);
        buttonContainer.append(buttonLess);
        jQuery(_this).append(buttonContainer);
    };
    var updateButtonCount = function (val) {
        buttonMore.find('.count').text(val);
    };
    var showMoreItems = function () {
        var status = jQuery.data(_this, 'status');
        var visible = status.visible + options[viewport].increment;
        if (status.visible <= status.total) {
            items.slice(status.visible, visible).show();
            jQuery.data(_this, 'status', __assign(__assign({}, status), { visible: visible }));
        }
        if (visible >= status.total) {
            buttonMore.hide();
            if (options.showLess) {
                buttonLess.show();
            }
        }
        else {
            var diff = status.total - visible;
            var newVal = diff > options[viewport].increment ? options[viewport].increment : diff;
            updateButtonCount(options.totalRemaining ? diff : newVal);
        }
    };
    var showLessItems = function () {
        var status = jQuery.data(_this, 'status');
        if (status.visible <= options[viewport]["default"]) {
            buttonLess.hide();
            buttonMore.show();
        }
        else {
            items.slice(options[viewport]["default"]).hide();
            jQuery.data(_this, 'status', __assign(__assign({}, status), { visible: options[viewport]["default"] }));
            buttonLess.hide();
            buttonMore.show();
            var diff = status.total - options[viewport]["default"];
            var newVal = diff > options[viewport].increment ? options[viewport].increment : diff;
            updateButtonCount(options.totalRemaining ? diff : newVal);
        }
    };
    var init = function () {
        var windowWidth = jQuery(window).width();
        if (windowWidth) {
            if (windowWidth > 1199) {
                viewport = "desktop" /* desktop */;
            }
            else if (windowWidth > 767) {
                viewport = "tablet" /* tablet */;
            }
            else {
                viewport = "mobile" /* mobile */;
            }
            items = jQuery(_this).find("" + options.items);
            var count = void 0;
            if (options.totalRemaining) {
                count = items.length - options[viewport]["default"];
            }
            else {
                count =
                    items.length - options[viewport]["default"] > options[viewport].increment
                        ? options[viewport].increment
                        : items.length - options[viewport]["default"];
            }
            items.slice(options[viewport]["default"]).hide();
            jQuery.data(_this, 'status', {
                total: items.length,
                visible: options[viewport]["default"]
            });
            addButtons(count, showMoreItems, showLessItems);
        }
    };
    init();
    return this;
};
