var Structure,slice=[].slice,indexOf=[].indexOf||function(t){for(var n=0,e=this.length;n<e;n++)if(n in this&&this[n]===t)return n;return-1},hasProp={}.hasOwnProperty;Structure=function(){function t(){var t,n,e,i;for(n=1<=arguments.length?slice.call(arguments,0):[],this.computedAttributes={},this.externalAttributes={},this.parentNode=null,this.childList=[],e=0,i=n.length;e<i;e++)t=n[e],this.insertChild(t,this.childList.length)}var n,e,i,r,s;return t.prototype.subclasses={},t.addSubclass=function(n,e){return t.prototype.subclasses[n]=e,n},t.prototype.className=t.addSubclass("Structure",t),t.prototype.toJSON=function(t){var n,e;return null==t&&(t=!0),t||null==this.id()?e=this.externalAttributes:delete(e=JSON.parse(JSON.stringify(this.externalAttributes))).id,{className:this.className,computedAttributes:this.computedAttributes,externalAttributes:e,children:function(){var e,i,r,s;for(s=[],e=0,i=(r=this.childList).length;e<i;e++)n=r[e],s.push(n.toJSON(t));return s}.call(this)}},t.fromJSON=function(n){var e,i,r,s;return r=t.prototype.subclasses[n.className],i=function(){var i,r,s,l;for(l=[],i=0,r=(s=n.children).length;i<r;i++)e=s[i],l.push(t.fromJSON(e));return l}(),s=function(t,n,e){e.prototype=t.prototype;var i=new e,r=t.apply(i,n);return Object(r)===r?r:i}(r,i,function(){}),s.computedAttributes=JSON.parse(JSON.stringify(n.computedAttributes)),s.externalAttributes=JSON.parse(JSON.stringify(n.externalAttributes)),s},t.prototype.parent=function(){return this.parentNode},t.prototype.children=function(){return this.childList.slice(0)},t.prototype.indexInParent=function(){var t,n;return null!=(t=this.parentNode)&&null!=(n=t.childList)?n.indexOf(this):void 0},t.prototype.previousSibling=function(){var t;if(null!=(t=this.indexInParent()))return this.parentNode.childList[t-1]},t.prototype.nextSibling=function(){var t;if(null!=(t=this.indexInParent()))return this.parentNode.childList[t+1]},t.prototype.copy=function(){var n,e,i,r,s;for((e=new t).computedAttributes=JSON.parse(JSON.stringify(this.computedAttributes)),e.externalAttributes=JSON.parse(JSON.stringify(this.externalAttributes)),e.childList=function(){var t,e,i,r;for(r=[],t=0,e=(i=this.childList).length;t<e;t++)n=i[t],r.push(n.copy());return r}.call(this),i=0,r=(s=e.childList).length;i<r;i++)s[i].parentNode=e;return e},t.prototype.isEarlierThan=function(n){var e,i,r,s,l,o,u,c;if(n instanceof t){if(n===this)return!1;for(e=[n];null!=(s=e[0].parent());)e.unshift(s);for(c=this,u=null;null!=c&&indexOf.call(e,c)<0;)u=c,c=c.parent();if(null!=c)return c===this||c!==n&&(i=e.indexOf(c),o=e[i+1],r=u.indexInParent(),l=o.indexInParent(),r<l)}},t.prototype.removeFromParent=function(){var t,n;if(null!=(n=this.parentNode))return"function"==typeof this.willBeRemoved&&this.willBeRemoved(),t=this.indexInParent(),this.parentNode.childList.splice(t,1),this.parentNode=null,"function"==typeof this.wasRemoved?this.wasRemoved(n,t):void 0},t.prototype.removeChild=function(t){var n;return null!=(n=this.childList[t])?n.removeFromParent():void 0},t.prototype.insertChild=function(n,e){var i;if(null==e&&(e=0),n instanceof t&&n!==this&&0<=e&&e<=this.childList.length){for(i=this;null!=(i=i.parent());)if(i===n){this.removeFromParent();break}return n.removeFromParent(),"function"==typeof n.willBeInserted&&n.willBeInserted(this,e),this.childList.splice(e,0,n),n.parentNode=this,"function"==typeof n.wasInserted?n.wasInserted():void 0}},t.prototype.replaceWith=function(t){var n,e;if(null!=(e=this.parentNode))return n=this.indexInParent(),this.removeFromParent(),e.insertChild(t,n)},t.prototype.getComputedAttribute=function(t){return this.computedAttributes[t]},t.prototype.setComputedAttribute=function(t,n){if(this.computedAttributes[t]!==n)return this.computedAttributes[t]=n},t.prototype.clearComputedAttributes=function(){var t,n,e,i,r;for(0===(e=1<=arguments.length?slice.call(arguments,0):[]).length&&(e=Object.keys(this.computedAttributes)),r=[],t=0,i=e.length;t<i;t++)(n=e[t])in this.computedAttributes?r.push(delete this.computedAttributes[n]):r.push(void 0);return r},t.prototype.compute=function(){var t,n,e,i,r,s,l;for(l=[],i=0,r=(n=1<=arguments.length?slice.call(arguments,0):[]).length;i<r;i++)(t=n[i])instanceof Array||(t=[t]),e=t[0],s=2<=t.length?slice.call(t,1):[],l.push(this.setComputedAttribute(e,this[e].apply(this,s)));return l},t.prototype.getExternalAttribute=function(t){return this.externalAttributes[t]},t.prototype.setExternalAttribute=function(t,n){if(this.externalAttributes[t]!==n)return"function"==typeof this.willBeChanged&&this.willBeChanged(t),this.externalAttributes[t]=n,"function"==typeof this.wasChanged?this.wasChanged(t):void 0},t.prototype.clearExternalAttributes=function(){var t,n,e,i,r;for(0===(e=1<=arguments.length?slice.call(arguments,0):[]).length&&(e=Object.keys(this.externalAttributes)),r=[],t=0,i=e.length;t<i;t++)(n=e[t])in this.externalAttributes?("function"==typeof this.willBeChanged&&this.willBeChanged(n),delete this.externalAttributes[n],r.push("function"==typeof this.wasChanged?this.wasChanged(n):void 0)):r.push(void 0);return r},t.prototype.attr=function(t){var n,e;for(n in t)hasProp.call(t,n)&&(e=t[n],this.setExternalAttribute(n,e));return this},t.prototype.setup=function(){var t,n,e;return e={},(n=function(t){var i,r,s,l,o,u;for(null!=(r=t.getExternalAttribute("id"))&&(e[r]=t),u=[],s=0,l=(o=t.children()).length;s<l;s++)i=o[s],u.push(n(i));return u})(this),(t=function(n){var i,r,s,l,o,u,c,h,a,p,f;for(s=0,o=(c=["label","premise","reason"]).length;s<o;s++)i=c[s],null!=(f=n.getExternalAttribute(i+" for"))&&(null!=(p="previous"===f?n.previousSibling():"next"===f?n.nextSibling():e.hasOwnProperty(f)?e[f]:null)&&n.connectTo(p,i),n.clearExternalAttributes(i+" for"));for(a=[],l=0,u=(h=n.children()).length;l<u;l++)r=h[l],a.push(t(r));return a})(this),this.fillOutConnections(),this},t.prototype.IDs={},t.instanceWithID=function(n){return t.prototype.IDs[n]},t.prototype.trackIDs=function(n){var e,i,r,s,l;if(null==n&&(n=!0),null!=this.id()&&(t.prototype.IDs[this.id()]=this),n){for(l=[],i=0,r=(s=this.children()).length;i<r;i++)e=s[i],l.push(e.trackIDs());return l}},t.prototype.untrackIDs=function(n){var e,i,r,s,l;if(null==n&&(n=!0),null!=this.id()&&delete t.prototype.IDs[this.id()],n){for(l=[],i=0,r=(s=this.children()).length;i<r;i++)e=s[i],l.push(e.untrackIDs());return l}},t.prototype.clearIDs=function(t){var n,e,i,r,s;if(null==t&&(t=!0),this.clearExternalAttributes("id"),t){for(s=[],e=0,i=(r=this.children()).length;e<i;e++)n=r[e],s.push(n.clearIDs());return s}},t.prototype.fillOutConnections=function(){var n,e,i,r,s,l,o,u,c,h,a,p,f,d,b,g,y,A,x,v,m,O,I,S,E;for(l=0,o=(f=this.childList).length;l<o;l++)f[l].fillOutConnections();if(null!=this.id()){a=function(t){var n,e,i,r,s,l;r=[];for(s in t)if(hasProp.call(t,s)){e=t[s];for(l in e)if(hasProp.call(e,l))for(n=1,i=e[l];1<=i?n<=i:n>=i;1<=i?++n:--n)r.push([s,l])}return r},p=(i=function(t){var n,e,i,r,s,l,o;for(s={},i=0,r=t.length;i<r;i++)l=(e=t[i])[0],o=e[1],null==s[l]&&(s[l]={}),null==(n=s[l])[o]&&(n[o]=0),s[l][o]++;return s})(null!=(d=this.getExternalAttribute("connectionsOut"))?d:[]);for(I in p)if(hasProp.call(p,I)&&(u=p[I],null!=(e=t.instanceWithID(I)))){null==(S=i(null!=(b=e.getExternalAttribute("connectionsIn"))?b:[]))[c=this.id()]&&(S[c]={});for(E in u)hasProp.call(u,E)&&(r=u[E],u[E]=S[this.id()][E]=Math.max(r,null!=(g=S[this.id()][E])?g:0));e.setExternalAttribute("connectionsIn",a(S))}s=i(null!=(y=this.getExternalAttribute("connectionsIn"))?y:[]),v=[];for(m in s)if(hasProp.call(s,m)&&(u=s[m],null!=(n=t.instanceWithID(m)))){null==(O=i(null!=(A=n.getExternalAttribute("connectionsOut"))?A:[]))[h=this.id()]&&(O[h]={});for(E in u)hasProp.call(u,E)&&(r=u[E],u[E]=O[this.id()][E]=Math.max(r,null!=(x=O[this.id()][E])?x:0));v.push(n.setExternalAttribute("connectionsOut",a(O)))}return v}},t.prototype.connectTo=function(n,e){var i,r,s,l;return null==e&&(e=""),null!=this.id()&&n instanceof t&&null!=n.id()&&(r=null!=(s=this.getExternalAttribute("connectionsOut"))?s:[],i=null!=(l=n.getExternalAttribute("connectionsIn"))?l:[],r.push([n.id(),e]),i.push([this.id(),e]),this.setExternalAttribute("connectionsOut",r),n.setExternalAttribute("connectionsIn",i),!0)},t.prototype.disconnectFrom=function(n,e){var i,r,s,l,o,u;if(null==e&&(e=""),!(null!=this.id()&&n instanceof t&&null!=n.id()))return!1;for(l=null!=(o=this.getExternalAttribute("connectionsOut"))?o:[],r=null!=(u=n.getExternalAttribute("connectionsIn"))?u:[],s=i=0;s<l.length&&(l[s][0]!==n.id()||l[s][1]!==e);)s++;if(s===l.length)return!1;for(;i<r.length&&(r[i][0]!==this.id()||r[i][1]!==e);)i++;return i!==r.length&&(l.splice(s,1),r.splice(i,1),this.setExternalAttribute("connectionsOut",l),n.setExternalAttribute("connectionsIn",r),!0)},t.prototype.allConnectionsOut=function(t){var n,e,i,r,s,l;if(r=null!=(s=this.getExternalAttribute("connectionsOut"))?s:[],null==t)return r;for(l=[],e=0,i=r.length;e<i;e++)(n=r[e])[1]===t&&l.push(n[0]);return l},t.prototype.allConnectionsIn=function(t){var n,e,i,r,s,l;if(e=null!=(s=this.getExternalAttribute("connectionsIn"))?s:[],null==t)return e;for(l=[],i=0,r=e.length;i<r;i++)(n=e[i])[1]===t&&l.push(n[0]);return l},t.prototype.allConnectionsTo=function(n){var e,i,r,s,l,o;if(!(n instanceof t&&null!=n.id()))return null;for(o=[],i=0,r=(s=null!=(l=this.getExternalAttribute("connectionsOut"))?l:[]).length;i<r;i++)(e=s[i])[0]===n.id()&&o.push(e[1]);return o},t.prototype.isAccessibleTo=function(n){return n instanceof t&&(null!=n.parent()&&(this.parent()===n.parent()?this.indexInParent()<n.indexInParent():this.isAccessibleTo(n.parent())))},t.prototype.isInTheScopeOf=function(t){return t.isAccessibleTo(this)},t.prototype.iteratorOverAccessibles=function(){return{ancestor:this,sibling:this,next:function(){return null==this.ancestor?null:null!=(this.sibling=this.sibling.previousSibling())?this.sibling:(this.sibling=this.ancestor=this.ancestor.parent(),this.next())}}},t.prototype.iteratorOverScope=function(){return{chain:[this],next:function(){var t,n;if(0===this.chain.length)return null;if(t=this.chain.pop(),null!=(n=t.nextSibling())){for(this.chain.push(n);null!=(n=n.children()[0]);)this.chain.push(n);return this.chain[this.chain.length-1]}return this.chain.length>0?this.chain[this.chain.length-1]:null}}},i=function(t,n){var e;for(null==n&&(n=function(){return!0});null!=(e=t.next());)if(n(e))return e},n=function(t,n){var e,i;for(null==n&&(n=function(){return!0}),i=[];null!=(e=t.next());)n(e)&&i.push(e);return i},t.prototype.firstAccessible=function(t){return null==t&&(t=function(){return!0}),i(this.iteratorOverAccessibles(),t)},t.prototype.allAccessibles=function(t){return null==t&&(t=function(){return!0}),n(this.iteratorOverAccessibles(),t)},t.prototype.firstInScope=function(t){return null==t&&(t=function(){return!0}),i(this.iteratorOverScope(),t)},t.prototype.allInScope=function(t){return null==t&&(t=function(){return!0}),n(this.iteratorOverScope(),t)},t.prototype.id=function(){return this.getExternalAttribute("id")},t.prototype.text=function(){return this.getExternalAttribute("text")},t.prototype.isA=function(t){return!!this.getExternalAttribute(t)},r=function(t,n){var e,i,r,s,l,o,u;for(i=t.getExternalAttribute(n),e=t.getComputedAttribute(n),i instanceof Array||(i=[]),e instanceof Array||(e=[]),u=[],s=0,l=(o=slice.call(i).concat(slice.call(e))).length;s<l;s++)"string"==typeof(r=o[s])&&u.push(r);return u},e=function(n,e){var i,r,s,l,o,u,c;for(null==e&&(e=null),c=[],r=0,s=(o=n.allConnectionsIn()).length;r<s;r++)i=(u=o[r])[0],u[1],null==(l=t.instanceWithID(i))||e&&!l.isA(e)||c.push(l);return c},s=function(t){var n,e,i,r;for(r=[],e=0,i=t.length;e<i;e++)n=t[e],indexOf.call(r,n)<0&&r.push(n);return r},t.prototype.labels=function(){var t,n,i,l,o,u;for(o=slice.call(r(this,"labels")).concat(slice.call(function(){var t,i,r,s;for(s=[],t=0,i=(r=e(this,"label")).length;t<i;t++)(n=r[t]).text()&&s.push(n.text());return s}.call(this))),u=[],t=0,i=(l=s(o)).length;t<i;t++)""!==(n=l[t])&&u.push(n);return u},t.prototype.hasLabel=function(t){return indexOf.call(this.labels(),t)>=0},t.prototype.reasons=function(){return slice.call(r(this,"reasons")).concat(slice.call(e(this,"reason")))},t.prototype.premises=function(){var n,i,s,l,o,u,c,h,a;for(h=slice.call(r(this,"premises")).concat(slice.call(function(){var t,n,i,r;for(r=[],t=0,n=(i=e(this)).length;t<n;t++)(a=i[t]).isA("reason")||a.isA("label")||r.push(a);return r}.call(this))),n=0,s=(u=this.reasons()).length;n<s;n++)if((o=u[n])instanceof t)for(i=0,l=(c=e(o)).length;i<l;i++)(a=c[i]).isA("reason")||a.isA("label")||h.push(a);return h},t.prototype.lookup=function(t){return this.firstAccessible(function(n){return n.hasLabel(t)})},t.prototype.cites=function(t){var n,e,i,r,s,l,o,u;for(u=[],i=0,l=(n=slice.call(this.reasons()).concat(slice.call(this.premises()))).length;i<l;i++){if((e=n[i])===t)return!0;"string"==typeof e&&u.push(e),("function"==typeof e.isA?e.isA("reference"):void 0)&&u.push(e.text())}for(r=0,o=u.length;r<o;r++)if(s=u[r],t===this.lookup(s))return!0;return!1},t.prototype.whatCitesMe=function(){return this.allInScope(function(t){return function(n){return n.cites(t)}}(this))},t}(),"undefined"!=typeof exports&&null!==exports&&(exports.Structure=Structure);
//# sourceMappingURL=structure.js.map
