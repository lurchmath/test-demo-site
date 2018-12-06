var InputStructure,OM,OutputExpression,OutputStructure,Structure,extend=function(t,e){function r(){this.constructor=t}for(var n in e)hasProp.call(e,n)&&(t[n]=e[n]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t},hasProp={}.hasOwnProperty,slice=[].slice,indexOf=[].indexOf||function(t){for(var e=0,r=this.length;e<r;e++)if(e in this&&this[e]===t)return e;return-1};"undefined"!=typeof require&&null!==require?(Structure=require("./structure").Structure,InputStructure=require("./input-structure").InputStructure,OM=require("openmath-js").OM):"undefined"!=typeof WorkerGlobalScope&&null!==WorkerGlobalScope?(null==WorkerGlobalScope.Structure&&(importScripts("structure.js"),importScripts("input-structure.js")),null==WorkerGlobalScope.OM&&importScripts("openmath.js")):null!=("undefined"!=typeof self&&null!==self?self.importScripts:void 0)&&(null==self.Structure&&(importScripts("release/structure.js"),importScripts("release/input-structure.js")),null==self.OM&&importScripts("node_modules/openmath-js/openmath.js")),OutputStructure=function(t){function e(){var t,r,n;e.__super__.constructor.apply(this,arguments),this.markDirty(),(r=null!=(n=(t=Structure.prototype.subclasses.InputStructure).prototype.instancesBeingInterpreted)?n.length:void 0)&&(this.origin=t.prototype.instancesBeingInterpreted[r-1])}return extend(e,Structure),e.prototype.className=Structure.addSubclass("OutputStructure",e),e.prototype.markDirty=function(t){return null==t&&(t=!0),this.dirty=t},e.prototype.addConnectionOrigin=function(t,r,n){var o,u,s;if(o=Structure.prototype.subclasses.InputStructure,r instanceof e&&(u=null!=(s=o.prototype.instancesBeingInterpreted)?s.length:void 0))return n._origin=o.prototype.instancesBeingInterpreted[u-1].id()},e.prototype.feedback=function(t){var e;return null!=(e=this.origin)?e.feedback(t):void 0},e.prototype.hasLabel=function(t){return!1},e.lookUpIn=function(t,e){var r,n,o,u;for(n=0,o=(u=e.slice(0).reverse()).length;n<o;n++)if((r=u[n]).hasLabel(t))return r},e.prototype.lookUp=function(t){return this.firstAccessible(function(e){return e.hasLabel(t)})},e.prototype.lookUpAll=function(t){return this.allAccessibles(function(e){return e.hasLabel(t)})},e.prototype.lookUpAllCitations=function(){var t,e,r,n,o,u,s,i,p,c,a,l,h,f,y,d,O,b,v;for(O={premises:{connections:[],labels:[]},reasons:{connections:[],labels:[]}},n=0,p=(f=this.getConnectionsOut()).length;n<p;n++)for(e=f[n],r=this.getConnectionData(e),o=0,c=(y=["premise","reason"]).length;o<c;o++)v=y[o],(null!=r?r.type:void 0)===v+" citation"&&null!=(b=this.getConnectionTarget(e))&&O[v+"s"].connections.push({cited:b.id(),id:e});for(u=0,a=(d=["premise","reason"]).length;u<a;u++)if(v=d[u],(i=this.getAttribute(v+" citations"))&&i instanceof Array)for(h=0,l=i.length;h<l;h++)s=i[h],null!=(t=this.lookUp(s))&&O[v+"s"].labels.push({cited:t.id(),label:s});return O},e.prototype.justChanged=function(){var t;return"function"==typeof(t=e.prototype).instanceJustChanged?t.instanceJustChanged(this):void 0},e}(),OutputExpression=function(t){function e(){var t,r;switch(r=arguments[0],t=2<=arguments.length?slice.call(arguments,1):[],r){case"int":case"flo":case"str":case"byt":case"var":e.__super__.constructor.call(this),this.setAttribute("OM type",r),this.setAttribute("OM atomic value",t[0]);break;case"sym":e.__super__.constructor.call(this),this.setAttribute("OM type",r),this.setAttribute("OM atomic value",t);break;case"bin":e.__super__.constructor.apply(this,t.slice(1)),this.setAttribute("OM type",r),this.setAttribute("OM bound indices",t[0]);break;case"app":case"err":e.__super__.constructor.apply(this,t),this.setAttribute("OM type",r);break;default:e.__super__.constructor.call(this),this.setAttribute("OM type","err")}}return extend(e,OutputStructure),e.prototype.className=Structure.addSubclass("OutputExpression",e),e.prototype.toOpenMath=function(){var t,e,r,n,o,u,s,i,p;switch(i=this.getAttribute("OM type")){case"int":case"flo":case"str":case"byt":case"var":return new OM[i](this.getAttribute("OM atomic value"));case"sym":return function(t,e,r){r.prototype=t.prototype;var n=new r,o=t.apply(n,e);return Object(o)===o?o:n}(OM[i],this.getAttribute("OM atomic value"),function(){});case"app":case"err":return r=function(){var t,r,n,o;for(o=[],t=0,r=(n=this.children()).length;t<r;t++)e=n[t],o.push(e.toOpenMath());return o}.call(this),function(t,e,r){r.prototype=t.prototype;var n=new r,o=t.apply(n,e);return Object(o)===o?o:n}(OM[i],r,function(){});case"bin":return u=this.getAttribute("OM bound indices"),p=function(){var t,e,r;for(r=[],t=0,e=u.length;t<e;t++)o=u[t],r.push(OM.var(this.children()[o].getAttribute("OM atomic value")));return r}.call(this),s=function(){var t,e,r;for(r=[],o=t=0,e=this.children().length;0<=e?t<e:t>e;o=0<=e?++t:--t)indexOf.call(u,o)<0&&r.push(o);return r}.call(this),n=this.children()[s[0]].toOpenMath(),t=this.children()[s[1]].toOpenMath(),function(t,e,r){r.prototype=t.prototype;var n=new r,o=t.apply(n,e);return Object(o)===o?o:n}(OM.bin,[n].concat(slice.call(p),[t]),function(){});default:throw"Not a valid OpenMath type: "+i}},e.fromOpenMath=function(t){var r,n,o,u,s,i,p;switch(o=function(){var r,o,u,s;for(s=[],r=0,o=(u=t.children).length;r<o;r++)n=u[r],s.push(e.fromOpenMath(n));return s}(),t.type){case"i":return new e("int",t.value);case"f":return new e("flo",t.value);case"st":return new e("str",t.value);case"ba":return new e("byt",t.value);case"sy":return new e("sym",t.name,t.cd,t.uri);case"v":return new e("var",t.name);case"a":return function(t,e,r){r.prototype=t.prototype;var n=new r,o=t.apply(n,e);return Object(o)===o?o:n}(e,["app"].concat(slice.call(o)),function(){});case"bi":return p=function(){var r,n,o,u;for(u=[],r=0,n=(o=t.variables).length;r<n;r++)i=o[r],u.push(new e("var",i.name));return u}(),u=e.fromOpenMath(t.symbol),r=e.fromOpenMath(t.body),function(t,e,r){r.prototype=t.prototype;var n=new r,o=t.apply(n,e);return Object(o)===o?o:n}(e,["bin",function(){s=[];for(var t=1,e=o.length;1<=e?t<e:t>e;1<=e?t++:t--)s.push(t);return s}.apply(this),u].concat(slice.call(p),[r]),function(){});case"e":return function(t,e,r){r.prototype=t.prototype;var n=new r,o=t.apply(n,e);return Object(o)===o?o:n}(e,["err",e.fromOpenMath(t.symbol)].concat(slice.call(o)),function(){});default:throw"This should never happen - how did an OMNode instance get type "+t.type+"?"}},e}(),OM.prototype.toOutputExpression=function(){return OutputExpression.fromOpenMath(this)},"undefined"!=typeof exports&&null!==exports&&(exports.OutputStructure=OutputStructure,exports.OutputExpression=OutputExpression,exports.OM=exports.OMNode=OM);
//# sourceMappingURL=output-structure.js.map
