(function (oo) {

    var global = this;

    var ModelElement = oo.getNS('oo.view').ModelElement = oo.Class(oo.view.Element, {
        _model : null,
        _tplError: null,
        setTemplateError : function setTemplateError(tpl){
            this._tplError = tpl || '';
        },
        getTemplateError : function getTemplateError(){
          return this._tplError;
        },
        constructor: function constructor (options) {
            if( options.hasOwnProperty('model') ){
                this.setModel(options.model);
                delete options.model;
            }

            if( options.hasOwnProperty('templateError') ){
                this.setTemplateError(options.templateError);
                delete options.templateError;
            }

            ModelElement.Super.call(this, options);

        },
        afterFetch : function afterFetch(data){
            var output = this.render(data, this._tpl);
            this.appendHtml(output);
        },
        setModel : function setModel(model){
            if (model instanceof oo.data.Model)
                this._model = model;
            else
                this._model = oo.createModel(model);

            this._model.addListener(oo.data.Model.AFTER_FETCH, oo.createDelegate(function (model) {
                this.renderTo(this, model.getData);
                if(this.isScrollable){
                    this.scroll.refresh();
                }
            }, this));
        },
        markAsError: function markAsError() {
            this.renderTo(this._getContainer());
        },
        prepareData: function prepareData(data) {
            return data;
        },
        render: function render (data, tpl) {
            if(!data){
              tpl = this.getTemplateError();
            }

            return ModelElement.Super.prototype.render.call(this, this.prepareData(data || {}), tpl || null);
        },
        getModel : function getModel(){
            return this._model;
        }
    });

    oo.view.Element.register(ModelElement, 'modelNode');

})(oo);