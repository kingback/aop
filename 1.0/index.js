/**
 * S.AOP
 * @fileoverview KISSY AOP功能
 * @author 虎牙<ningzbruc@gmail.com>
 * @date 2013-05-28
 * @module aop
 **/

KISSY.add(function(S) {

/**
 * AOP功能
 * @module aop
 * @see http://yuilibrary.com/yui/docs/api/classes/Do.html
 */
	
	'use strict';
	
	var BEFORE     = 'before',
		AFTER      = 'after',
		KSAOP      = '__~ks_aop',
		DELIMITER  = '|',
	
	/**
	 * 允许对某个对象的方法注入before/after回调
	 * @class Do
	 * @static
	 */
	
	Do = {
	
	    /**
	     * 注入before回调
	     * @method before
	     * @param {Function} fn 回调函数
	     * @param {Object} obj 被注入方法的父对象
	     * @param {String} sFn 被注入方法的名称
	     * @param {Object} c 回调执行上下文
	     * @param {Mixed} arg* 事件触发时0个或多个预传参
	     * @return {Do.EventHandle} handle 事件处理器，用于detach
	     * @static
	     */
	    before: function(fn, obj, sFn, c) {
	        return this.inject.apply(this, [BEFORE].concat(S.makeArray(arguments)));
	    },
	
	    /**
         * 注入after回调
         * @method after
         * @param {Function} fn 回调函数
         * @param {Object} obj 被注入方法的父对象
         * @param {String} sFn 被注入方法的名称
         * @param {Object} c 回调执行上下文
         * @param {Mixed} arg* 事件触发时0个或多个预传参
         * @return {Do.EventHandle} handle 事件处理器，用于detach
         * @static
         */
	    after: function(fn, obj, sFn, c) {
	        return this.inject.apply(this, [AFTER].concat(S.makeArray(arguments)));
	    },
	
	    /**
         * 注入before/after回调
         * @method inject
         * @param {String} when 注入时机，before或after
         * @param {Function} fn 回调函数
         * @param {Object} obj 被注入方法的父对象
         * @param {String} sFn 被注入方法的名称
         * @param {Object} c 回调执行上下文
         * @param {Mixed} arg* 事件触发时0个或多个预传参
         * @return {Do.EventHandle} handle 事件处理器，用于detach
         * @static
         */
	    inject: function(when, fn, obj, sFn, c) {
	        var id = S.stamp(obj),
	        	f = fn,
	        	a, o, sid;
	        
	        if (c) {
	            a = [f, c].concat(S.makeArray(arguments).slice(5));
	            fn = S.rbind.apply(S, a);
	        }
	
	        o = obj[KSAOP] || (obj[KSAOP] = {});
	
	        if (!o[sFn]) {
	            
	            // 创建方法包装器
	            o[sFn] = new Do.Method(obj, sFn);
	
	            // 包装后的方法覆盖对象的原始方法
	            obj[sFn] = function() {
	                return o[sFn].exec.apply(o[sFn], arguments);
	            };
	        }
	
	        // 回调ID
	        sid = [id, S.stamp(fn), sFn, when].join(DELIMITER);
	
	        // 注册回调
	        o[sFn].register(sid, fn, when);
			
	        return new Do.EventHandle(o[sFn], sid, when);
	    },
	
	    /**
	     * 解除注入回调
	     * @method detach
	     * @param {Object|Do.EventHandle} obj 被注入方法的父对象或者事件处理器
	     * @param {String} sFn 被注入方法的名称
	     * @param {String} when 注入时机，before或after
	     * @static
	     */
	    detach: function(obj, sFn, when) {
	    	var method, o, sid;
	    	
			if (obj && obj.constructor == Do.EventHandle) {
				return obj.detach();
			}
			
			if ((o = obj && obj.__ksaop) && (method = o[sFn])) {
				if (when === AFTER) {
					method.after = {};
				} else if (when === BEFORE) {
					method.before = {};
				} else {
					method.after = {};
					method.before = {};
				}
			}
	    },
	    
	    /**
         * 解除before回调
         * @method detachBefore
         * @param {Object|Do.EventHandle} obj 被注入方法的父对象或者事件处理器
         * @param {String} sFn 被注入的方法名称
         * @static
         */
	    detachBefore: function(obj, sFn) {
	       this.detach.call(this, obj, sFn, BEFORE);
	    },
	    
	    /**
         * 解除after回调
         * @method detachAfter
         * @param {Object|Do.EventHandle} obj 被注入方法的父对象或者事件处理器
         * @param {String} sFn 被注入的方法名称
         * @static
         */
	    detachAfter: function(obj, sFn) {
            this.detach.call(this, obj, sFn, AFTER);
        }
	};
	
	//////////////////////////////////////////////////////////////////////////
	
	/**
	 * 执行原始方法返回值
	 * @property originalRetVal
	 * @static
	 */
	
	/**
	 * 执行after回调后的返回值
	 * @property currentRetVal
	 * @static
	 */
	
	//////////////////////////////////////////////////////////////////////////
	
	/**
	 * 对原始方法的包装器
	 * @class Do.Method
	 * @constructor
	 * @param {Object} obj 方法的父对象
	 * @param {String} sFn 方法名
	 */
	Do.Method = function(obj, sFn) {
	    this.obj = obj;
	    this.methodName = sFn;
	    this.method = obj[sFn];
	    this.before = {};
	    this.after = {};
	};
	
	/**
	 * 注册回调
	 * @method register
	 * @param {String} sid 回调ID
	 * @param {Function} fn 回调
	 * @param {String} when 注册时机，before或after
	 */
	Do.Method.prototype.register = function (sid, fn, when) {
		this[when][sid] = fn;
	};
	
	/**
	 * 执行包装后的方法
	 * @method exec
	 * @param {Any} arg* 方法传参
	 * @return {Any} ret 返回值
	 */
	Do.Method.prototype.exec = function () {
	
	    var args = S.makeArray(arguments),
	        bf = this.before,
	        af = this.after,
	        bfArr = S.keys(bf).sort(),
	        afArr = S.keys(af).sort(),
	        prevented = false,
	        i, l, ret, newRet;
		
	    // 执行before回调
	    for (i = 0, l = bfArr.length; i < l; i++) {
            ret = bf[bfArr[i]].apply(this.obj, args);
            if (ret) {
                switch (ret.constructor) {
                    case Do.Halt:
                        return ret.retVal;
                    case Do.AlterArgs:
                        args = ret.newArgs;
                        break;
                    case Do.Prevent:
                        prevented = true;
                        break;
                    default:
                }
            }
	    }
	
	    // 执行原始方法
	    if (!prevented) {
	        ret = this.method.apply(this.obj, args);
	    }
        
        // 保留原始返回值和修改后的返回值
	    Do.originalRetVal = ret;
	    Do.currentRetVal = ret;
	
	    // 执行after回调
	    for (i = 0, l = afArr.length; i < l; i++) {
            newRet = af[afArr[i]].apply(this.obj, args);
            
            if (newRet && newRet.constructor === Do.Halt) {
                
                // 如果被阻止，则停止执行后续的after回调
                return newRet.retVal;
            } else if (newRet && newRet.constructor === Do.AlterReturn) {
                
                // 检查是否有新的返回值
                ret = newRet.newRetVal;
                
                // 更新静态的返回值
                Do.currentRetVal = ret;
            }
	    }
	
	    return ret;
	};
	
	//////////////////////////////////////////////////////////////////////////
	
	/**
	 * 返回修改过的传参，用于before回调
        
        Do.before(function() {
            return new Do.AlterArgs('修改传参', [1, 2, 3]);
        }, obj, sFn, context)
        
	 * @class Do.AlterArgs
	 * @constructor
	 * @param {String} msg 返回的消息
	 * @param {Array} newArgs 修改过的传参
	 */
	Do.AlterArgs = function(msg, newArgs) {
	    this.msg = msg;
	    this.newArgs = newArgs;
	};
	
	/**
     * 返回修改过的返回值，用于after回调
        
        Do.after(function() {
            return new Do.AlterReturn('修改返回值', 1);
        }, obj, sFn, context)
        
     * @class Do.AlterArgs
     * @constructor
     * @param {String} msg 返回的消息
     * @param {Any} newRetVal 修改过的返回值
     */
	Do.AlterReturn = function(msg, newRetVal) {
	    this.msg = msg;
	    this.newRetVal = newRetVal;
	};
	
	/**
     * 终止执行后续回调并返回修改过的返回值
        
        Do.after(function() {
            return new Do.Halt('终止执行', 1);
        }, obj, sFn, context)
        
     * @class Do.AlterArgs
     * @constructor
     * @param {String} msg 返回的消息
     * @param {Any} retVal 修改过的返回值
     */
	Do.Halt = function(msg, retVal) {
	    this.msg = msg;
	    this.retVal = retVal;
	};
	
	/**
     * 阻止原始方法和after回调执行，用于before回调
        
        Do.after(function() {
            return new Do.Halt(1, '终止执行');
        }, obj, sFn, context)
        
     * @class Do.AlterArgs
     * @constructor
     * @param {String} msg 返回的消息
     */
	Do.Prevent = function(msg) {
	    this.msg = msg;
	};
	
	/**
	 * 绑定后返回的事件处理器，用于detach
        
        var handle = Do.before(fn, obj, sFn, context);
        handle.detach();
        //or
        Do.detach(handle);
        
	 * @class Do.EventHandle
	 * @constructor
	 * @param {Do.Method} method Do.Method实例
	 * @param {String} sid 回调ID
	 * @param {String} when 注入时机，before或after
	 */
	Do.EventHandle = function(method, sid, when) {
		this.method = method;
		this.sid = sid;
		this.when = when;
	};
	
	/**
	 * 解除事件绑定
	 * @method detach 
	 */
	Do.EventHandle.prototype.detach = function() {
		if (this.method) {
			delete this.method[this.when][this.sid];
			delete this.method;
			delete this.sid;
			delete this.when;
		}
	};
	
	S.Do = Do;
	
	return Do;

});



