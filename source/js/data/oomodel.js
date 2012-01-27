(function(oo){
    
    var Provider = oo.data.Provider;

    var Model = my.Class(null, oo.core.mixins.Events,{
        STATIC : {
            AFTER_SAVE : 'AFTER_SAVE',
            AFTER_FETCH : 'AFTER_FETCH'
        },
        _previouslyFetched: {},
        constructor: function constructor(options){
            if(!options || (!options.hasOwnProperty('name') || !options.hasOwnProperty('provider')) )
                throw "Either property \"name\" or \"provider\" is missing in the options given to the Model constructor";
            this._name = options.name;

            this.setProvider(options.provider);
        },
        setProvider: function setProvider (providerConf) {
            if (providerConf instanceof Provider) {
                this._provider = providerConf;
            } else if (typeof providerConf == 'object') {
                var Cls = oo.data.Provider.get(providerConf.type);
                delete providerConf.type; providerConf.name = this._name;
                this._provider = new Cls(providerConf);
            }
        },
        fetch : function fetch(callback){

            var defaultConf = {
                success: oo.emptyFn,
                params: {}
            };
    
            callback = callback || {};
            if (typeof callback == 'function') {
                callback = {success: callback};
            }

            if (typeof callback != 'object') {
                throw "Model.fetch() : params must be a function or a config object";
            }

            callback = oo.override(defaultConf, callback);


            var self = this,
                cb = function cb(datas){
                    if (datas){
                        this._previouslyFetched = datas;

                        // why do the callback have different params than the event
                        if (callback.success){
                            // here it is the raw result
                            callback.success(datas);
                        }
                        // here the result is wrapped into an array
                        self.triggerEvent(Model.AFTER_FETCH, [datas]);
                    }
                };

            this._provider.fetch({success: cb, params: callback.params});
        },
        getData: function getData () {
            return this._previouslyFetched;
        },
        save : function save(datas, callback){
            if(!datas || ( 'object' !== typeof datas )) {
                throw Error("Data parameter must exist and be an object");
            }

            this._provider.save(datas, callback);
            this.triggerEvent(Model.AFTER_SAVE);
        }
    });

    var exports = oo.getNS('oo.data');
    exports.Model = Model;
    
    return oo;

})(oo || {});