## AOP

- BY 虎牙

## 简介

> 提供before/after等AOP（面向切面编程）切面方法，更好地在不修改代码的情况下管理/解耦/侵入代码，仿照YUI3的AOP

## 什么是AOP

<p>
    <a href="http://baike.baidu.com/view/73626.htm" target="_blank">百度百科</a>
    <a href="http://zh.wikipedia.org/wiki/AOP" target="_blank">维基百科</a>
    <a href="http://yuilibrary.com/yui/docs/api/classes/Do.html" target="_blank">YUI3 AOP<a>
</p>

## 简单例子

    KISSY.use('overlay,gallery/aop/1.0/', function(S, Overlay, Do) {
        
        var popup = {
            show: function() {
                console.log('show');
            },
            hide: function() {
                console.log('hide');
            }
        };
        
        // 在pop执行show方法前执行回调
        Do.before(function() {
            console.log('before show');
        }, popup, 'show');
        
        // 在pop执行hide方法后执行回调
        Do.after(function() {
            console.log('after hide');
        }, popup, 'hide');
        
        popup.show(); // before show -> show
        popup.hide(); // hide -> after hide
        
    });

## 回调处理

> 我们都知道在DOM或自定义事件里都有preventDefault,halt等事件处理方法，AOP也不例外，不仅如此，AOP还提供了修改传参和返回值等功能</p>

<p>看一个简单的例子</p>    
    var math = {
        add: function(a, b) {
            console.log(a + b);
        }
    };
<p>阻止默认方法的执行 <code>Do.Prevent</code></p>
    Do.before(function() {
        console.log('prevented');
        return new Do.Prevent();
    }, math, 'add');
    
    math.add(1, 2); // prevented
<p>阻止后续回调及默认方法的执行 <code>Do.Halt</code></p>
    Do.before(function() {
        console.log('halt');
        return new Do.Halt();
    }, math, 'add');
    Do.before(function() {
        console.log('before');
    }, math, 'add');
    Do.after(function() {
        console.log('after');
    }, math, 'add');
    
    math.add(1, 2); // halt
<p>修改传参 <code>Do.AlterArgs</code></p>
    Do.before(function() {
        return new Do.AlterArgs('msg', [a + 1, b + 1]);
    }, math, 'add');
    
    math.add(1, 2); // 5
<p>修改返回值 <code>Do.AlterReturn</code></p>
    Do.after(function() {
        return new Do.AlterReturn('msg', Do.originalRetVal + 10);
    }, math, 'add');
    
    math.add(1, 2); // 13
<p>解除绑定</p>
    var handle = Do.before(fn, math, 'add');
    handle.detach(); // 解除当前回调绑定
    // or
    Do.detach(handle); // 解除当前回调绑定
    
    Do.detach(math, 'add'); // 解除所有绑定
    
    Do.detach(math, 'add', 'before'); // 解除所有before绑定
    Do.detach(math, 'add', 'after'); // 解除所有after绑定
    // or
    Do.detachBefore(math, 'add'); // 解除所有before绑定
    Do.detachAfter(math, 'add'); // 解除所有after绑定

## 高级用法（扩展，插件）

> 我们在做开发的时候，常常需要把一个大功能块解耦成几个独立的更小的功能块，KISSY提供了RichBase的基类，允许将功能通过扩展和插件的形式合并到一块，这个时候扩展或插件与主功能之间的联系，除了事件之外，还可以通过AOP的方法来进行切入

<p>来看一下具体例子，怎么实现一个弹窗组件功能与扩展解耦：</p>
    
    // 基础功能
    var PopupBase = RichBase.extend({
        // 初始化函数，在初始化时会被执行 
        initializer: function() {
            // 缓存节点
            this._node = this.get('node');
        },
        show: function() {
            // 显示节点
            this._node.css('display', 'block');
        },
        hide: function() {
            // 隐藏节点
            this._node.css('display', 'none');
        },
        close: function() {}
        // 更多其他方法
    }, {
        ATTRS: {
            node: function() {
                setter: function(v) {
                    return S.one(v);
                }
            }
        }
    });
    
    // 动画扩展
    var PopupAnim = function() {
        //跟在初始化函数后初始化相关动画逻辑
        Do.after(this._initAnim, this, 'initializer', this);
    };
    PopupAnim.prototype = {
        _initAnim: function() {
            // 在show/hide之前执行动画
            Do.before(this._showAnim, this, 'show', this);
            Do.before(this._hideAnim, this, 'hide', this);
        },
        _showAnim: function(anim) {
            if (anim) {
                this._node.css({
                    display: 'block',
                    opacity: '0'
                });
                this._node.animate({
                    opacity: '1'
                }, 1, 'easeNone');
                
                // 阻止默认的show方法
                return new Do.Prevent();
            }
        },
        _hideAnim: function(anim) {
            var _this = this;
            if (anim) {
                this._node.animate({
                    opacity: '0'
                }, 1, 'easeNone', function() {
                    _this._node.css({
                        display: 'none',
                        opacity: '1'
                    });
                });
                
                // 阻止默认的hide方法
                return new Do.Prevent();
            }
        }
    };
    
    // 合并功能
    var Popup = PopupBase.extend([PopupAnim]);
    
    var popup = new Popup({ node: '.box' });
    popup.show(); // 直接显示
    popup.hide(true); // 动画隐藏

## 常用方法
<div class="method-list">
    <div class="method-item">
        <h3>before <code>(fn, obj, sFn, context)</code></h3>
        <p>注入before回调</p>
        <h4>参数</h4>
        <ul>
            <li>
                <code>fn</code>
                <i>(Function)</i>
                <p>绑定的回调</p>
            </li>
            <li>
                <code>obj</code>
                <i>(Object)</i>
                <p>方法的父对象</p>
            </li>
            <li>
                <code>sFn</code>
                <i>(String)</i>
                <p>被注入的方法名称</p>
            </li>
            <li>
                <code>context</code>
                <i>(Object)</i>
                <p>回调函数<code>fn</code>执行上下文</p>
            </li>
        </ul>
        <h4>返回值</h4>
        <ul>
            <li>
                <code>handle</code>
                <i>(Do.EventHandle)</i>
                <p>可以通过handle.detach()解除当前回调的绑定</p>
            </li>
        </ul>
    </div>
    <div class="method-item">
        <h3>after <code>(fn, obj, sFn, context)</code></h3>
        <p>同before</p>
    </div>
    <div class="method-item">
        <h3>detach <code>(obj, sFn, when)</code></h3>
        <p>解除绑定</p>
        <h4>参数</h4>
        <ul>
            <li>
                <code>obj</code>
                <i>(Object|Do.EventHandle)</i>
                <p>方法父对象，如果传进来的是handle的话，直接调用handle.detach方法</p>
            </li>
            <li>
                <code>sFn</code>
                <i>(String)</i>
                <p>被注入的方法名称</p>
            </li>
            <li>
                <code>when</code>
                <i>(String)</i>
                <p>before还是after，为空的话解除所有绑定</p>
            </li>
        </ul>
    </div>
    <div class="method-item">
        <h3>detachBefore <code>(obj, sFn)</code></h3>
        <p>解除所有before绑定，参考detach</p>
        <h4>参数</h4>
        <ul>
            <li>
                <code>obj</code>
                <i>(Object|Do.EventHandle)</i>
                <p>同detach</p>
            </li>
            <li>
                <code>sFn</code>
                <i>(String)</i>
                <p>同detach</p>
            </li>
        </ul>
    </div>
    <div class="method-item">
        <h3>detachBefore <code>(obj, sFn)</code></h3>
        <p>解除所有after绑定，参考detach，参数同detachBefore</p>
    </div>
</div>
    
