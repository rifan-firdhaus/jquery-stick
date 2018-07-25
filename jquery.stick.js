(function () {
    let $ = window.jQuery;

    let Stick = function (options, $element) {
        this.$element = $element;
        this.$placeholder = $('<div/>');
        this.defaults = {
            stickClass: 'stick',
            bottomFirst: true,
        };

        var _isStick = false;
        var _offset;
        var _height;
        var _width;
        var _self = this;
        var _options = $.extend({}, this.defaults, options);

        this.option = function (key, defaultValue) {
            if (typeof key !== 'undefined') {
                return typeof _options[key] !== 'undefined' ? _options[key] : defaultValue;
            }

            return _options;
        };

        this.isStick = function () {
            return _isStick;
        };

        this.stick = function () {
            this.$element.trigger('stick.stick');
            this.$element.css({
                'position': 'absolute',
                '-webkit-transform': 'translateZ(0)'
            });
            this.$element.outerWidth(_width);
            this.$element.outerHeight(_height);
            this.$element.addClass(this.option('stickClass'));

            this.$placeholder.width(_width);
            this.$placeholder.height(_height);
            this.$placeholder.show();

            _isStick = true;
        };

        this.unstick = function () {
            this.$element.trigger('unstick.stick');

            this.$element.css({
                'top': '',
                'position': '',
                '-webkit-transform': ''
            });
            this.$element.outerWidth('');
            this.$element.outerHeight('');
            this.$placeholder.hide();

            _isStick = false;
        };

        this.render = function () {
            var scrollTop = this.$context.scrollTop();
            var contextHeight = this.$context.height();

            if (scrollTop >= _offset.top) {
                this.stick();

                if (this.option('bottomFirst')) {
                    this.$element.css('top', _offset.top);

                    if (scrollTop >= _height - contextHeight) {
                        this.$element.css('top', scrollTop - (_height - contextHeight));
                    }
                }else{
                    this.$element.css('top', scrollTop);

                    if (scrollTop >= _height - contextHeight) {
                        this.$element.css('top', scrollTop - (_height - contextHeight));
                    }
                }
            }
            if (_isStick) {
                if (scrollTop <= _offset.top) {
                    this.unstick();
                }
            }
        };

        this.load = function () {
            _offset = this.$element.position();
            _height = this.$element.outerHeight(true);
            _width = this.$element.outerWidth(true);
        };

        this.$context = $(this.option('context', $(window)));

        this.load();

        this.$context.css('position', 'relative');

        this.$context.on('scroll.stick', function () {
            _self.render();
        });

        $(window).on('resize', function () {
            _self.load();
        });

        this.$placeholder.hide().insertAfter(this.$element);
    };

    $.fn.stick = function (first, second) {
        var stick = this.data('stick');

        if (stick) {
            if (typeof stick[first] === 'function') {
                return stick[first](second);
            }

            return false;
        } else {
            stick = new Stick(first, this);

            this.data('stick', stick);
        }

        return this;
    }

})();