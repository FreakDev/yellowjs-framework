/*
 * Carousel :
 * @selector : the dom selector of the container
 * @pager : Boolean
 * @items : Array of Panel object
 */

var oo = (function (oo) {

    // shorthand
    var Dom = oo.view.Dom, Touch = oo.core.Touch;
    
    
    var Carousel = my.Class(oo.view.Element, {
        _datas : null,
        _elementCls : null,
        _items : [],
        _available : true,
        _newPanel : null,
        constructor : function constructor(selector, pager, opt) {
            this._startX = 0;
            this._startTranslate = 0;

            var conf = {
                target: selector
            };


            Carousel.Super.call(this, conf);
            
            this._transitionDuration = 200;

            if (opt){
                if(!opt.hasOwnProperty('model') || !opt.hasOwnProperty('elementCls')){
                    throw new Error('Options passed but missing model or elementCls');
                }

                if('[object Object]' !== Object.prototype.toString.call(opt.elementCls)){
                    throw new Error('elementCls must be an object');
                }
                
                this._elementCls = opt.elementCls;
                
                                
               this._prepareView(opt.model);
            }
            
            this._nbPanel = this._datas.length -1 || document.querySelectorAll([selector, ' > *'].join('')).length;
            this._panelWidth = (new Dom(this.getDomObject().firstElementChild)).getWidth();
            

            this._activePanel = 0;
            this._displayPager = (pager ? true : false);

            this._pager = null;
            this._buildPager();

            this._moved = false;

            this.render();
        },
        _prepareView : function _prepareView(model){
            var that = this;
            model.fetch(function(datas){
                that._datas = datas;
                that._addPanel(0);
                that._addPanel(1);
                //that._addPanel(2);
            });
        },
        _addPanel : function _addPanel(id, before){
            var item = this._getItem(id);

            this[(before ? 'prependChild': 'appendChild')](item.getDomObject());
        },
        showPanel : function showPanel(id){
            if('undefined' === typeof id){
                throw new Error("Missing 'id' of the panel");
            }

            if(!this._available) return;

            this._available = false;

            //before transition
            /*if(id > this._activePanel+1){
                this._updateNext(id);
            }
            if(id < this._activePanel-1){
                this._updatePrev(id);
            }*/

            //setTransition
            var s = (id < this._activePanel ? +1 : -1 ), nT;


            if(id >= 0 && id <= this._nbPanel){
                nT =  this._startTranslate + s * this._panelWidth;
            } else {
                if(id < 0){
                    nT = 0;
                    id=0;
                } else {
                    nT =  this._startTranslate;
                    id = this._nbPanel;
                }
            }
            
            this.translateTo({x:nT}, this._transitionDuration);
            this._startTranslate = nT;

            //store new id for endTransition
            this._newPanel = id;
        },
        _updateNext : function _updateNext(nextId){
            //remove first dom child
            //remove last
            //this.removeChild();

            //appendChild
            //this._addPanel(nextId);
        },
        _getItem : function _getItem(id){
            var item = this._items[id];
            if(!item){
                item = this._items[id] = this._prepareItem(id);
            }
            return item;
        },
        _prepareItem : function _prepareItem(id){
            var item , elementCls = this._datas[id].elementCls;

            if( 'undefined' === this._elementCls[elementCls] || 'function' !== typeof this._elementCls[elementCls]){
                throw new Error('element Cls must exist and be a function');
            }

            //if( this._elementCls[elementCls] && 'function' === typeof this._elementCls[elementCls]){
                item = new this._elementCls[elementCls]();
                item.appendHtml(item.render(this._datas[id]));
            //}

            return item;
        },
        /*pager*/
        _buildPager : function _buildPager() {
            if (this._displayPager) {
                this._pager = Dom.createElement('div');
                this._pager.classList.addClass('carousel-pager');

                this._pager.setTemplate('{{#bullet}}<i class="dot"></i>{{/bullet}}');

                var data = [];
                for(var i=0; i<this._nbPanel; i++) {
                    data.push(i);
                }

                this._pager.render({bullet: data});
            }

            this._updatePager();
        },
        _updatePager : function _updatePager() {
            if (this._displayPager) {
                var current = this._pager.getDomObject().querySelector('.dot.active');
                if (current) {
                    current.className = current.className.replace(/ *active/, '');
                }
                this._pager.getDomObject().querySelector(['.dot:nth-child(', (this._activePanel + 1), ')'].join('')).className += ' active';
            }
        },
        hasMoved : function hasMoved() {
            return this._moved;
        },
        _initListeners : function _initListeners(){
            var listNode = this.getDomObject();
            var that = this;
            var touchMoveTempo;

            listNode.addEventListener(Touch.EVENT_START, function (e) {
                if(that._available){
                    that._startX = Touch.getPositionX(e);
                    that._startTranslate = that.getTranslateX();
                    touchMoveTempo = 0;
                }
            }, false);

            listNode.addEventListener(Touch.EVENT_MOVE, function (e) {
                if(that._available){
                    var diff = Touch.getPositionX(e) - that._startX;

                    that.translateTo({x:(that._startTranslate + diff)}, 0);
                    that._moved = true;
                }
            }, false);

            listNode.addEventListener(Touch.EVENT_END, function () {
                if(that._available){
                    that._moved = false;

                    var cVal = that.getTranslateX();
                    var tVal;
                    
                    if (cVal < 0) {

                        cVal = Math.abs(cVal);

                        var min = (that._panelWidth / 2),
                            max = (that._panelWidth * (that._nbPanel -1) - min);

                        for(var i = min; i <= max; i = i + that._panelWidth) {
                            if (cVal < i) {
                                break;
                            }
                        }

                        
                        if (cVal > max) {
                            tVal = max + min;
                        } else {
                            tVal = i - min;
                        }

                        tVal *= -1;

                    } else {
                        tVal = 0;
                    }

                    //that._activePanel = Math.abs(tVal / that._panelWidth);

                    that._updatePager();

                    //that.translateTo({x:tVal}, that._transitionDuration);
                    //that._startTranslate = tVal;
                }
            }, false);

            //swipe
            listNode.addEventListener('swipeRight',function(e){
                that.onSwipeRight.call(that);
            },false);

            listNode.addEventListener('swipeLeft',function(e){
                that.onSwipeLeft.call(that);
            },false);

            listNode.addEventListener('webkitTransitionEnd',function(e){
                that.onEndTransition.apply(that);
                
            },false);
        },
        onSwipeRight : function onSwipeRight(){
            this.showPanel(this._activePanel + 1);
        },
        onSwipeLeft : function onSwipeLeft(){
            this.showPanel(this._activePanel - 1);
        },
        onEndTransition : function onEndTransition(){
            //console.log('this._newPanel : ' + typeof this._newPanel)
            if(this._newPanel > this._activePanel && this._newPanel < this._nbPanel){
                if(this._newPanel > 1){
                    this.removeChild(this.getDomObject().firstChild);
                    this.translateTo({x:this._startTranslate + this._panelWidth});
                    this._startTranslate = this._startTranslate + this._panelWidth;
                }
                
                this._addPanel(this._newPanel+1);
            }

            if(this._newPanel < this._activePanel && this._newPanel > 0 && this._newPanel < (this._nbPanel-1)){
                
                    this.removeChild(this.getDomObject().lastChild);
                    this._addPanel(this._newPanel-1, true);

                    this.translateTo({x:this._startTranslate - this._panelWidth});
                    this._startTranslate = this._startTranslate - this._panelWidth;
                

                

                //this._updateNext(this._newPanel-1);
                
            }


            this._activePanel = this._newPanel;
            this._newPanel = null;
            this._available = true;
        },
        render : function render(){
            // update css if needed
            if (this._pager) {
                (new Dom(this.getDomObject().parentNode)).appendChild(this._pager);
            }

            this._initListeners();
        }
    });
    
    var exports = oo.getNS('oo.view');
    exports.Carousel = Carousel;
    
    return oo;
    
})(oo || {});
