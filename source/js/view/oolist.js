var oo = (function (oo) {

    // shorthand
    var Dom = oo.view.Dom,
        ns = oo.getNS('oo.view');
    
    var List = ns.List = my.Class(oo.view.Element, {
        _tpl : null,
        _model : null,
        _wrapper : null,
        constructor: function constructor(conf) {
            if(conf){
                
                if( conf.hasOwnProperty('model') ){
                    this.setModel(conf.model);
                }

                if( conf.hasOwnProperty('template') ){
                    this.setTemplate(conf.template);
                }

                if( conf.hasOwnProperty('wrapper') ){
                    this.setWrapper(conf.wrapper);
                }
            }
        },
        _transformToOoDom : function _transformToOoDom(elem){
            return new Dom(elem);
        },
        setTemplate : function setTemplate(tpl){
            this._tpl = tpl || null;
        },
        setModel : function setModel(model){
            this._model = model || null;
        },
        setWrapper : function setWrapper(elem){
            if(!elem) return;

            this._wrapper = this._transformToOoDom(elem) || null;
        }
    });
    
    oo.view.Element.register(List, 'list');

    return oo;
    
})(oo || {});