## AOP

- BY 虎牙

## 简介

> 提供before/after等AOP（面向切面编程）切面方法，更好地在不修改代码的情况下管理/解耦/侵入代码

## 什么是AOP

<p><a href="http://baike.baidu.com/view/73626.htm" target="_blank">百度百科</a> <a href="http://zh.wikipedia.org/wiki/AOP" target="_blank">维基百科</a></p>

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
    
