(function (oo) {
    
    var global = this, ns = oo.getNS('oo.data');
    var FakeProvider = ns.FakeProvider = my.Class(oo.data.Provider, {
        _data: [{
            'key' : 0,
            'firstname': 'claire',
            'nickname': 'Claire_So',
            'title' : 'article 1',
            'picture' : '1.jpg',
            'elementCls': 'elementA',
            'url' : 'article/1'
        }, {
            'key' : 2,
            'firstname': 'mathias',
            'nickname': 'FreakDev',
            'title' : 'article 2',
            'picture' : '2.jpg',
            'elementCls': 'elementA',
            'url' : 'article/2'
        },
        {
            'key' : 3,
            'firstname': 'ff',
            'nickname': 'FreakDev',
            'title' : 'article 3',
            'picture' : '3.jpg',
            'elementCls': 'elementA',
            'url' : 'article/3'
        },
        {
            'key' : 4,
            'firstname': 'gg',
            'nickname': 'FreakDev',
            'title' : 'article 4',
            'picture' : '4.jpg',
            'elementCls': 'elementA',
            'url' : 'article/4'
        },
        {
            'key' : 5,
            'firstname': 'gg',
            'nickname': 'FreakDev',
            'title' : 'article 5',
            'picture' : '3.jpg',
            'elementCls': 'elementA',
            'url' : 'article/5'
        },
        {
            'key' : 6,
            'firstname': 'gg',
            'nickname': 'FreakDev',
            'title' : 'article 6',
            'picture' : '1.jpg',
            'elementCls': 'elementA',
            'url' : 'article/6'
        },
        {
            'key' : 7,
            'firstname': 'gg',
            'nickname': 'FreakDev',
            'title' : 'article 7',
            'picture' : '3.jpg',
            'elementCls': 'elementA',
            'url' : 'article/7'
        },
        {
            'key' : 8,
            'firstname': 'gg',
            'nickname': 'FreakDev',
            'title' : 'article 8',
            'picture' : '4.jpg',
            'elementCls': 'elementA',
            'url' : 'article/8'
        },
        {
            'key' : 9,
            'firstname': 'gg',
            'nickname': 'FreakDev',
            'title' : 'article 9',
            'picture' : '1.jpg',
            'elementCls': 'elementA',
            'url' : 'article/9'
        },
        {
            'key' : 10,
            'firstname': 'gg',
            'nickname': 'FreakDev',
            'title' : 'article 10',
            'picture' : '2.jpg',
            'elementCls': 'elementA',
            'url' : 'article/10'
        }
        ],
        constructor: function contructor (options) {
            FakeProvider.Super.call(this, options);
        },
        save: function save (data, callback) {
            if (!(data instanceof Array))
                data = [data];

            var self = this;
            data.forEach(function (val) {
                self._data.push(val);
            });
            
            if (callback) {
                callback.call(global);
            }
        },
        fetch: function fetch (callback) {
            callback.success.call(global, this._data);
        }
    });

    oo.data.Provider.register(FakeProvider, 'fake');

})(oo || {});