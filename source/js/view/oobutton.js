/**
 * Class let's you transform any dom node into button and manage interaction
 *
 * @namespace oo
 * @class Button
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
(function (oo) {
 
    var Touch = oo.core.Touch;
    //Events = oo.Events;
     
    var Button = oo.getNS('oo.view').Button = oo.Class(oo.view.Dom, oo.core.mixins.Events, {
        STATIC : {
            EVT_TOUCH : 'touch',
            EVT_RELEASE : 'release'
        },
        constructor : function constructor(opt) {

            if(!opt || typeof opt != 'object')
                throw "call Element constructor but \"options\" missing";

            // target property is deprecated - use el instead
            if(!opt.hasOwnProperty('el'))
                throw "call Element constructor but \"el\" property of object options is missing";

            Button.Super.call(this, opt.el);

            this._active = false;
            this._initEvents();
        },
        _initEvents : function _initEvents() {
            this.getDomObject().addEventListener(Touch.EVENT_START, oo.createDelegate(this._onTouch, this), false);
            this.getDomObject().addEventListener(Touch.EVENT_END, oo.createDelegate(this._onRelease, this), false);
        },
        _onTouch : function _onTouch(e) {
            this.setActive(true);
            this.triggerEvent(Button.EVT_TOUCH, [this, e]);
        },
        _onRelease : function _onRelease(e) {
            this.setActive(false);
            this.triggerEvent(Button.EVT_RELEASE, [this, e]);
        },
        isActive : function isActive() {
            return this._active;
        },
        /**
         * set the active state of the button
         * @param actice {bool} "true" to set as active "false" to not
         **/
        setActive : function setActive (active) {
            this._active = !!active;
            this.classList[(this._active ? 'add' : 'remove') + 'Class']('active');
        }
    });
     
    oo.view.Element.register(Button, 'button');
     
})(oo || {});