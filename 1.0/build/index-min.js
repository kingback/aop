/*! aop - v1.0 - 2013-06-07 3:24:28 PM
* Copyright (c) 2013 虎牙; Licensed  */
KISSY.add("gallery/aop/1.0/index",function(a){"use strict";var b="before",c="after",d="__~ks_aop",e="|",f={before:function(){return this.inject.apply(this,[b].concat(a.makeArray(arguments)))},after:function(){return this.inject.apply(this,[c].concat(a.makeArray(arguments)))},inject:function(b,c,g,h,i){var j,k,l,m=a.stamp(g),n=c;return i&&(j=[n,i].concat(a.makeArray(arguments).slice(5)),c=a.rbind.apply(a,j)),k=g[d]||(g[d]={}),k[h]||(k[h]=new f.Method(g,h),g[h]=function(){return k[h].exec.apply(k[h],arguments)}),l=[m,a.stamp(c),h,b].join(e),k[h].register(l,c,b),new f.EventHandle(k[h],l,b)},detach:function(a,d,e){var g,h;return a&&a.constructor==f.EventHandle?a.detach():((h=a&&a.__ksaop)&&(g=h[d])&&(e===c?g.after={}:e===b?g.before={}:(g.after={},g.before={})),void 0)},detachBefore:function(a,c){this.detach.call(this,a,c,b)},detachAfter:function(a,b){this.detach.call(this,a,b,c)}};return f.Method=function(a,b){this.obj=a,this.methodName=b,this.method=a[b],this.before={},this.after={}},f.Method.prototype.register=function(a,b,c){this[c][a]=b},f.Method.prototype.exec=function(){var b,c,d,e,g=a.makeArray(arguments),h=this.before,i=this.after,j=a.keys(h).sort(),k=a.keys(i).sort(),l=!1;for(b=0,c=j.length;c>b;b++)if(d=h[j[b]].apply(this.obj,g))switch(d.constructor){case f.Halt:return d.retVal;case f.AlterArgs:g=d.newArgs;break;case f.Prevent:l=!0}for(l||(d=this.method.apply(this.obj,g)),f.originalRetVal=d,f.currentRetVal=d,b=0,c=k.length;c>b;b++){if(e=i[k[b]].apply(this.obj,g),e&&e.constructor===f.Halt)return e.retVal;e&&e.constructor===f.AlterReturn&&(d=e.newRetVal,f.currentRetVal=d)}return d},f.AlterArgs=function(a,b){this.msg=a,this.newArgs=b},f.AlterReturn=function(a,b){this.msg=a,this.newRetVal=b},f.Halt=function(a,b){this.msg=a,this.retVal=b},f.Prevent=function(a){this.msg=a},f.EventHandle=function(a,b,c){this.method=a,this.sid=b,this.when=c},f.EventHandle.prototype.detach=function(){this.method&&(delete this.method[this.when][this.sid],delete this.method,delete this.sid,delete this.when)},a.Do=f,f});