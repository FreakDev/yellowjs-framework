(function (oo) {

    // shorthand
    var Dom = oo.view.Dom,
        Touch = oo.core.Touch,
        ns = oo.getNS('oo.view');
    
    var List = ns.List = oo.Class(oo.view.ModelElement, {
        STATIC: {
            EVT_RENDER: 'render',
            EVT_ITEM_PRESSED: 'item-pressed',
            EVT_ITEM_RELEASED: 'item-released'
        },
        _structTpl: '<ul>{{#data}}<li data-id="{{key}}" class="oo-list-item">{{tpl}}</li>{{/data}}</ul>',
        _touchedItem: null,
        constructor: function constructor(conf) {
            if (conf.structure) {
                this._overrideStructure(conf.structure);
            }

            List.Super.call(this, conf);

            this._initEvents();
        },
        setTemplate : function setTemplate(tpl){
            this._tpl = this._structTpl.replace('{{tpl}}', tpl || '');
        },
        _initEvents: function () {
             
            function checkTarget (target) {
                var t = new Dom(target);
                var itemId;
                if (t.classList.hasClass('oo-list-item')) {
                    itemId = t.getDomObject().getAttribute('data-id') || t.getId();
                } else {
                    var altTarget = t.findParentByCls('oo-list-item');
                    if (altTarget) {
                        t = altTarget;
                        itemId = altTarget._dom.getAttribute('data-id') || t.getId();
                    }
                }
                 
                if (itemId) {
                    return {id: itemId, dom: t};
                }
                 
                return false;
            }
             
            var that = this;
            var check;
            this.getDomObject().addEventListener(Touch.EVENT_START, function (e) {

                this._touchedItem = e.target;
                check = checkTarget(e.target);
                if (false !== check) {
                    check.dom.classList.addClass('active');
                     
                    that.triggerEvent(List.EVT_ITEM_PRESSED, [check.dom, check.id]);
                }
            }, false);
            this.getDomObject().addEventListener(Touch.EVENT_MOVE, function (e) {
                if (this._touchedItem) {
                    this._touchedItem = null;
                    var active = that.find('.active');
                    if (null !== active)
                        active.classList.removeClass('active');
                }
            }, false);
            this.getDomObject().addEventListener(Touch.EVENT_END, function (e) {
                check = checkTarget(e.target);
                if (false !== check && this._touchedItem == e.target) {
                    check.dom.classList.removeClass('active');
                    that.triggerEvent(List.EVT_ITEM_RELEASED, [check.dom, check.id]);
                }
            }, false);
        },
        prepareData: function prepareData(data) {
            return {'data': data};
        },
        _overrideStructure : function _overrideStructure(tpl){
            
            if(!tpl) {
                throw Error("Template must be declared");
            }

            this._structTpl = tpl;
        },
        render : function render(data,tpl){
            this.appendHtml(List.Super.prototype.render.call(this, data,tpl));
        }
    });
    
    oo.view.Element.register(List, 'list');
    
})(oo || {});