/**
 * Element are the most basic type of UI element that could be created with the framework
 *
 * @namespace oo.view
 * @class Element
 * @requires oo.view.Dom
 * @requires oo.core.mixins.Scroll
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 * @author Claire Sosset <m.desloges@gmail.com> || @Claire_So
 */
(function (oo){
    var global = this,
        viewRepository = {};
    
    var Element = oo.getNS('oo.view').Element = oo.Class(oo.view.Dom, oo.core.mixins.Events, oo.core.mixins.Scroll, {
        STATIC: {
            APPEND : 'append',
            PREPEND : 'prepend',
            REFRESH_CONTENT: 'refresh_content',
            register: function register (cls, codename) {
                if (viewRepository[codename])
                    throw 'Already existing codename';

                viewRepository[codename] = cls;
            },
            get: function get (codename) {
                if (codename in viewRepository)
                    return viewRepository[codename];
                else
                    throw 'Invalid codename';
            },
            unregister: function register (codename) {
                delete viewRepository[codename];
            },

            getTemplateEngine : function getTemplateEngine() {
                if (null === Element.templateEngine)
                    Element.templateEngine = new (oo.view.templateengine.Template.get(oo.getConfig('templateEngine')))();

                return Element.templateEngine;
            },
            templateEngine : null
        },

        // references elements registered into this view
        _uiElements: null,

        _needToRender: true,
        
        _tpl : null,
        
        _container: null,

        constructor: function constructor (options) {
            if(!options || typeof options != 'object')
                throw "call Element constructor but \"options\" missing";

            // target property is deprecated - use el instead
            if(!options.hasOwnProperty('el'))
                throw "call Element constructor but \"el\" property of object options is missing";

            Element.Super.call(this, options.el);

            if( options.hasOwnProperty('template') ){
                this.setTemplate(options.template);
                delete options.template;
            }

            if (options.hasOwnProperty('onEnabled')) {
                this.onEnabled = options.onEnabled;
                delete options.onEnabled;
            }

            // more consistant API
            // if (options.hasOwnProperty('onenabled')) {
            //     this.onEnabled = options.onenabled;
            //     delete options.onEnabled;
            // }

            // to strong dependency on mixins
            if(options.hasOwnProperty('scrollable')){
                this.setScrollable(options.scrollable);
            }

            this._uiElements = {};

        },
        getEl: function getEl(id) {
            return this._uiElements[id] || null;
        },
        addEl: function addEl(el) {
            this._uiElements[el.getUUID()] = el;
            el.setContainer(this);
        },
        removeEl: function removeEl(id) {
            var el = this.getEl(id);
            if (null !== el) {
                this._uiElements.slice(this._uiElements.indexOf(el), 1);
                el.destroy();
            }
        },
        initElement: function initElement() {
            
            for( var id in this._uiElements ) {
                var el = this._uiElements[id];
                if ('needToRender' in el && el.needToRender())
                    el.renderTo(this);
            }

            return this;
        },
        /**
         * do exactly the same thing as the oo.createElement,
         * but add the created element has a child to the current one
         *
         * @see oo.createElement
         */
        createElement: function createElement (type, opt) {
            // if (opt.el)
            //     opt.el = '#' + this.getId() + ' ' + opt.el;
            var el = oo.createElement(type, opt);
            this.addEl(el);
            return el;
        },

        setContainer: function setContainer(container) {
            this._container = container;
        },
        getContainer: function getContainer() {
            return this._container;
        },
        needToRender: function needToRender() {
            return this._needToRender;
        },
        setTemplate : function setTemplate(tpl){
            this._tpl = tpl || '';
        },
        getTemplate : function getTemplate(){
          return this._tpl;
        },
        /**
         * render the element and return the generated html as string
         *
         * @param  {object} OPTIONAL data literal object representing data to fill the template
         * @param  {sting} OPTIONAL tpl   a template to override temporary the element's template
         * @return {string}               generated html as string
         */
        render: function render (data, tpl) {

            if (!tpl || '' === tpl)
                tpl = this.getTemplate();

            if(!tpl) return '';
            var tplEng = Element.getTemplateEngine();

            return tplEng.render(tpl, data || {});
        },
        /**
         * render the current element and insert the generated html into a target
         *
         * @param  {oo.view.Dom} target   the object in wich the content should be inserted
         * @param  {object} OPTIONAL data literal object representing data to fill the template
         * @param  {sting} OPTIONAL tpl   a template to override temporary the element's template
         * @param  {string} position      use a constant to append / prepend / set generated content
         * @return {void}
         */
        renderTo: function renderTo (target, data, tpl, position) {
            var content = this.render(data, tpl),
                currentTarget = target.find('#' + this.getId()) || target;

            var methodPrefix = '', methodSuffix = 'Child';
            if (typeof content === 'string')
                methodSuffix = 'Html';

            if ([Element.APPEND, Element.PREPEND].indexOf(position) !== -1)
                methodPrefix = position;
            else {
                if ('Child' === methodSuffix)
                    methodPrefix = 'append';
                else
                    methodSuffix = methodSuffix.toLowerCase();
            }

            currentTarget[methodPrefix + methodSuffix](content);

            this._onEnabled();

        },

        _onEnabled: function _onEnabled() {
            this.onEnabled();
            this.initElement();

            this.triggerBubblingEvent(oo.view.Element.REFRESH_CONTENT);
        },

        onEnabled: function onEnabled() { },
        
        triggerBubblingEvent: function triggerBubblingEvent (evtName, params) {
            if (!oo.isArray(params)) {
                params = params ? [params] : [];
            }
            var _container = this.getContainer(), evt = {
                bubble: true,
                stopPropagation: function () { this.bubble = false; }
            };
            params.splice(0,0, evt);
            this.triggerEvent(evtName, params);

            if (evt.bubble && _container && _container.triggerBubblingEvent)
                _container.triggerBubblingEvent(evtName, params);
        }
    });

    oo.view.Element.register(Element, 'node');

})(oo);