var oo = (function (oo) {

    // shorthand
    var Dom = oo.Dom, Touch = oo.Touch, utils = oo.utils;
    
    // constructor
    var Carousel = function Carousel (selector, pager) {
        this._startX = 0;
        this._startTranslate = 0;
        
        this._panelContainer = new Dom(selector);
        this._transitionDuration = 200;
        
        var domObj = this._panelContainer.getDomObject();
        
        this._panelWidth = (new Dom(domObj.firstElementChild)).getWidth();
        this._nbPanel = document.querySelectorAll([selector, ' > *'].join('')).length;
                
        this._activePanel = 0;
        this._displayPager = (pager ? true : false);
        
        this._pager;
        this._buildPager();
        
        this._moved = false;
        
        this.render();
    };
    
    var p = Carousel.prototype;
    
    p._buildPager = function _buildPager () {
        if (this._displayPager) {
            this._pager = Dom.createElement('div');
            this._pager.classList.addClass('carousel-pager');
            
            this._pager.setTemplate('{{#bullet}}<i class="dot"></i>{{/bullet}}');
            
            var data = []
            for(var i=0; i<this._nbPanel; i++) {
                data.push(i);
            }
            
            this._pager.render({bullet: data});
        }
        
        this._updatePager();
    };
    
    p._updatePager = function _updatePager () {
        var current = this._pager.getDomObject().querySelector('.dot.active');
        if (current) {
            current.className = current.className.replace(/ *active/, '');
        }
        this._pager.getDomObject().querySelector(['.dot:nth-child(', (this._activePanel + 1), ')'].join('')).className += ' active';
    };
    
    p.hasMoved = function hasMoved () {
        return this._moved;
    };
    
    p._initListeners = function _initListeners () {
        var listNode = this._panelContainer.getDomObject();
        var that = this;
        var touchMoveTempo;
                
        listNode.addEventListener(Touch.EVENT_START, function (e) {
            that._startX = Touch.getPositionX(e);
            that._startTranslate = that._panelContainer.getTranslateX();
            touchMoveTempo = 0;
        }, false);

        listNode.addEventListener(Touch.EVENT_MOVE, function (e) {
            var diff = Touch.getPositionX(e) - that._startX;
            that._panelContainer.translateTo({x:(that._startTranslate + diff)}, 0);  
            that._moved = true;
        }, false);

        listNode.addEventListener(Touch.EVENT_END, function () {
            that._moved = false;
            
            var cVal = that._panelContainer.getTranslateX();
                        
            if (cVal < 0) {

                cVal = Math.abs(cVal);

                var min = (that._panelWidth / 2), 
                    max = (that._panelWidth * (that._nbPanel -1) - min);

                for(var i = min; i <= max; i = i + that._panelWidth) {
                    if (cVal < i) {
                        break;
                    }
                }
                
                var tVal;
                if (cVal > max) {
                    tVal = max + min;
                } else {
                    tVal = i - min;
                }
                                
                tVal *= -1;

            } else {
                tVal = 0;
            }
                        
            that._activePanel = Math.abs(tVal / that._panelWidth);
                        
            that._panelContainer.translateTo({x:tVal}, that._transitionDuration);
            
            that._updatePager();

            that._startTranslate = tVal;
        }, false);        
    };
    
    p.render = function render () {
        
        // update css if needed
        
        if (this._pager) {
            (new Dom(this._panelContainer.getDomObject().parentNode)).appendChild(this._pager);
        }
        
        this._initListeners();
    }
    
    oo.Carousel = Carousel;
    return oo;
    
})(oo || {});
