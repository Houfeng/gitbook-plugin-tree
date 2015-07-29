require(["gitbook"], function(gitbook) {

    var config = null;

    var stateBuffer = null;
    var saveState = function($, config, isFirst) {
        var box = $('.summary');
        stateBuffer = box.html();
    };

    var recoveryState = function($, config, isFirst) {
        if (!stateBuffer) return;
        var box = $('.summary');
        box.html(stateBuffer);
    };

    var bindEvent = function($, config, isFirst) {
        var items = $('.summary li');
        items.each(function(i, item) {
            var $item = $(item);
            item.childList = $item.children('ul');
            item.hasChildList = item.childList.length > 0;
            if (isFirst) {
                $item.addClass(item.hasChildList ? "close" : "no-child");
                item.sn = $item.children('span,a');
                item.sn.html('<span class="tree-btn"><span class="t1">+</span><span class="t2">-</span></span>' + item.sn.html());
            }
            if (!item.hasChildList) return;
            item.btn = $item.find('.tree-btn');
            item.btn.off('click').on('click', function(event) {
                var item = this.parentNode.parentNode,
                    $item = $(item);
                if ($item.hasClass('close')) {
                    $item.removeClass("close").addClass('open');
                } else {
                    $item.addClass("close").removeClass('open');
                }
                saveState($, config);
                return false;
            });
        });
    };

    gitbook.events.bind("start", function(e, _config) {
        config = _config;
        bindEvent(jQuery, config, true);
        saveState(jQuery, config, true);
    });

    gitbook.events.bind("page.change", function() {
        recoveryState(jQuery, config, false);
        bindEvent(jQuery, config, false);
    });
});