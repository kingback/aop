/*
combined files : 

gallery/aop/1.1/index

*/
/**
 * @fileoverview 
 * @author 虎牙<huya.nzb@alibaba-inc.com>
 * @module aop
 **/
KISSY.add('gallery/aop/1.1/index',function (S, Node,Base) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * 
     * @class Aop
     * @constructor
     * @extends Base
     */
    function Aop(comConfig) {
        var self = this;
        //调用父类构造函数
        Aop.superclass.constructor.call(self, comConfig);
    }
    S.extend(Aop, Base, /** @lends Aop.prototype*/{

    }, {ATTRS : /** @lends Aop*/{

    }});
    return Aop;
}, {requires:['node', 'base']});




