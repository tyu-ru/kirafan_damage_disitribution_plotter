(function(e){function n(n){for(var a,o,c=n[0],u=n[1],l=n[2],m=0,p=[];m<c.length;m++)o=c[m],Object.prototype.hasOwnProperty.call(i,o)&&i[o]&&p.push(i[o][0]),i[o]=0;for(a in u)Object.prototype.hasOwnProperty.call(u,a)&&(e[a]=u[a]);s&&s(n);while(p.length)p.shift()();return r.push.apply(r,l||[]),t()}function t(){for(var e,n=0;n<r.length;n++){for(var t=r[n],a=!0,c=1;c<t.length;c++){var u=t[c];0!==i[u]&&(a=!1)}a&&(r.splice(n--,1),e=o(o.s=t[0]))}return e}var a={},i={app:0},r=[];function o(n){if(a[n])return a[n].exports;var t=a[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,o),t.l=!0,t.exports}o.m=e,o.c=a,o.d=function(e,n,t){o.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,n){if(1&n&&(e=o(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(o.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var a in e)o.d(t,a,function(n){return e[n]}.bind(null,a));return t},o.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(n,"a",n),n},o.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},o.p="/kirafan_damage_distribution_plotter/";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],u=c.push.bind(c);c.push=n,c=c.slice();for(var l=0;l<c.length;l++)n(c[l]);var s=u;r.push([0,"chunk-vendors"]),t()})({0:function(e,n,t){e.exports=t("56d7")},"034f":function(e,n,t){"use strict";t("85ec")},"56d7":function(e,n,t){"use strict";t.r(n);t("e260"),t("e6cf"),t("cca6"),t("a79d");var a=t("2b0e"),i=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{attrs:{id:"app"}},[t("h1",[e._v("Kirafan Damage Distribution Plotter")]),t("p",[e._v("PCかタブレット端末推奨です")]),t("p",[e._v("説明はページ下部にあります")]),t("table",[e._m(0),e._l(e.inputdata,(function(n,a){return t("DamageInput",{key:a,model:{value:n.v,callback:function(t){e.$set(n,"v",t)},expression:"input.v"}})}))],2),t("button",{on:{click:e.add_pack}},[e._v("add")]),t("button",{on:{click:e.rem_pack}},[e._v("rem")]),t("div",[e._v(" Damage Sample "),t("input",{directives:[{name:"model",rawName:"v-model.number",value:e.sample_range_min,expression:"sample_range_min",modifiers:{number:!0}}],attrs:{type:"number"},domProps:{value:e.sample_range_min},on:{input:function(n){n.target.composing||(e.sample_range_min=e._n(n.target.value))},blur:function(n){return e.$forceUpdate()}}}),t("button",{on:{click:function(n){e.pick_target="min"}}},[e._v("pick")]),e._v(" ~ "),t("input",{directives:[{name:"model",rawName:"v-model.number",value:e.sample_range_max,expression:"sample_range_max",modifiers:{number:!0}}],attrs:{type:"number"},domProps:{value:e.sample_range_max},on:{input:function(n){n.target.composing||(e.sample_range_max=e._n(n.target.value))},blur:function(n){return e.$forceUpdate()}}}),t("button",{on:{click:function(n){e.pick_target="max"}}},[e._v("pick")])]),t("div",{staticStyle:{"font-weight":"bold"}},[e._v(" Probability = "+e._s(e.integral_probability)+"% ")]),t("Plot",{attrs:{plot_data:e.plot_data,sample_range_min:e.sample_range_min,sample_range_max:e.sample_range_max},on:{set_sample_range_val:e.set_sample_val}}),t("Description")],1)},r=[function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("tr",[t("th",[e._v("Attack Division")]),t("th",[e._v("Damage")]),t("th",[e._v("Damage Type")]),t("th",[e._v("Critical Probability")]),t("th",[e._v("Critical Damage Change")])])}],o=(t("d81d"),t("cb29"),t("13d5"),function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("tr",{attrs:{id:"DamageInput"}},[t("td",[t("DamageDivisionInput",{model:{value:e.division,callback:function(n){e.division=n},expression:"division"}})],1),t("td",[t("input",{directives:[{name:"model",rawName:"v-model.number",value:e.damage,expression:"damage",modifiers:{number:!0}}],attrs:{type:"number",min:"0",step:"1"},domProps:{value:e.damage},on:{input:function(n){n.target.composing||(e.damage=e._n(n.target.value))},blur:function(n){return e.$forceUpdate()}}})]),t("td",[t("select",{directives:[{name:"model",rawName:"v-model",value:e.damagetype,expression:"damagetype"}],on:{change:function(n){var t=Array.prototype.filter.call(n.target.options,(function(e){return e.selected})).map((function(e){var n="_value"in e?e._value:e.value;return n}));e.damagetype=n.target.multiple?t:t[0]}}},[t("option",{domProps:{value:0}},[e._v("Expected(critical)")]),t("option",{domProps:{value:1}},[e._v("Maximum(critical)")]),t("option",{domProps:{value:2}},[e._v("Expected(not-critical)")]),t("option",{domProps:{value:3}},[e._v("Maximum(not-critical)")])])]),t("td",[t("input",{directives:[{name:"model",rawName:"v-model.number",value:e.prob,expression:"prob",modifiers:{number:!0}}],attrs:{type:"number",min:"0",max:"100",step:"1"},domProps:{value:e.prob},on:{input:function(n){n.target.composing||(e.prob=e._n(n.target.value))},blur:function(n){return e.$forceUpdate()}}})]),t("td",[t("input",{directives:[{name:"model",rawName:"v-model.number",value:e.damagechange,expression:"damagechange",modifiers:{number:!0}}],attrs:{type:"number",min:"-33",max:"100",step:"1"},domProps:{value:e.damagechange},on:{input:function(n){n.target.composing||(e.damagechange=e._n(n.target.value))},blur:function(n){return e.$forceUpdate()}}})])])}),c=[],u=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("input",{directives:[{name:"model",rawName:"v-model.trim",value:e.division,expression:"division",modifiers:{trim:!0}}],attrs:{placeholder:"1 1 1 1 1",pattern:"\\s*(\\d*\\s*[:,]?\\s*)*"},domProps:{value:e.division},on:{input:function(n){n.target.composing||(e.division=n.target.value.trim())},blur:function(n){return e.$forceUpdate()}}})},l=[],s=(t("a15b"),t("4de4"),t("1276"),t("ac1f"),{name:"DamageDivisionInput",props:{value:Array},data:function(){return{division:""}},mounted:function(){this.division=this.value.join(" ")},watch:{division:function(e){var n=e.split(/\D+/).map((function(e){return parseInt(e)})).filter((function(e){return!isNaN(e)})),t=n.reduce((function(e,n){return e+n}),0);this.$emit("input",n.map((function(e){return e/t})))}}}),m=s,p=t("2877"),d=Object(p["a"])(m,u,l,!1,null,"0e3e0896",null),_=d.exports,f={components:{DamageDivisionInput:_},name:"DamageInput",data:function(){return{division:[1,1,1,1,1],damage:1e3,damagetype:0,prob:20,damagechange:0}},watch:{division:function(){this.emit()},damage:function(){this.emit()},damagetype:function(){this.emit()},prob:function(){this.emit()},damagechange:function(){this.emit()}},methods:{emit:function(){var e=function(e,n,t){return Math.min(Math.max(e,n),t)},n=1.5*(1+e(this.damagechange,-33,100)/100),t=Math.max(this.damage,0);switch(this.damagetype){case 0:t/=.925*n;break;case 1:t/=1*n;break;case 2:t/=.925;break;case 3:t/=1;break;default:alert("internal error : DamageType Unexpect");break}this.$emit("input",{division:this.division,mxdamage:t,prob:e(this.prob,0,100)/100,critical_coefficient:n})}}},v=f,g=Object(p["a"])(v,o,c,!1,null,"21d9fa26",null),h=g.exports,x=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{attrs:{id:"Plot"}},[t("div",[t("label",[t("input",{directives:[{name:"model",rawName:"v-model",value:e.auto_scale_x_min,expression:"auto_scale_x_min"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(e.auto_scale_x_min)?e._i(e.auto_scale_x_min,null)>-1:e.auto_scale_x_min},on:{change:function(n){var t=e.auto_scale_x_min,a=n.target,i=!!a.checked;if(Array.isArray(t)){var r=null,o=e._i(t,r);a.checked?o<0&&(e.auto_scale_x_min=t.concat([r])):o>-1&&(e.auto_scale_x_min=t.slice(0,o).concat(t.slice(o+1)))}else e.auto_scale_x_min=i}}}),e._v(" auto scale x min ")]),t("label",[t("input",{directives:[{name:"model",rawName:"v-model",value:e.fixed_range,expression:"fixed_range"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(e.fixed_range)?e._i(e.fixed_range,null)>-1:e.fixed_range},on:{change:function(n){var t=e.fixed_range,a=n.target,i=!!a.checked;if(Array.isArray(t)){var r=null,o=e._i(t,r);a.checked?o<0&&(e.fixed_range=t.concat([r])):o>-1&&(e.fixed_range=t.slice(0,o).concat(t.slice(o+1)))}else e.fixed_range=i}}}),e._v(" fixed range ")])]),t("div",{attrs:{id:"canvas"}})])},b=[],y=(t("a9e3"),t("61cc")),k=t.n(y),w={name:"Plot",props:{plot_data:Object,sample_range_min:Number,sample_range_max:Number},data:function(){return{auto_scale_x_min:!1,fixed_range:!0}},mounted:function(){this.render()},watch:{plot_data:function(){this.render()},sample_range_min:function(){this.render()},sample_range_max:function(){this.render()},auto_scale_x_min:function(){this.render()},fixed_range:function(){this.render()}},methods:{render:function(){var e=this,n=this.plot_data,t=n.plot_data,a=n.x_range,i=[{x:t.x,y:t.y,type:"line",fill:"tozeroy"}],r=[{type:"rect",xref:"x",yref:"paper",x0:this.sample_range_min,x1:this.sample_range_max,y0:0,y1:1,fillcolor:"#d3d3d3",opacity:.2,line:{width:0}}],o=function(e){r.push({type:"line",xref:"x",yref:"paper",x0:e,x1:e,y0:0,y1:1,line:{color:"#ff0000",width:1}})};o(this.sample_range_min),o(this.sample_range_max);var c={title:"Damage Dsitribution",xaxis:{title:"Damege",fixedrange:this.fixed_range,dtick:a.dtick,range:[this.auto_scale_x_min?a.mn:0,a.mx]},yaxis:{ticklabelposition:"inside",title:"Probability Density [/ damage]",fixedrange:!0},margin:{l:30,r:10,pad:0},shapes:r};k.a.newPlot("canvas",i,c,{responsive:!0}),document.getElementById("canvas").on("plotly_click",(function(n){e.$emit("set_sample_range_val",n.points[0].x)}))}}},P=w,D=Object(p["a"])(P,x,b,!1,null,"6bc9c320",null),A=D.exports,M=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{attrs:{id:"description"}})},j=[],O=t("0e54"),$=t.n(O),N="# Description\n\n攻撃時のダメージの分布を調べるためのツールです。\n\nほぼ自分用なところがあるので、細かい調整はしてません。\n\n[解析wiki](https://wiki.kirafan.moe/)と[きらファン計算機](https://calc.kirafan.moe/#/home)との併用前提なところがあります\n\n出力されるグラフは確率密度分布です。縦軸の具体的な値は気にしないでください。(一応`/damage`単位の数値になってる...はず)\n\n計算方法の都合上ある程度誤差があります。\n\n~~htmlもjsも初めてだから低クオリティは許して~~\n\n## Attack Division\n\n攻撃の段数と威力分布を示す整数列です。\n解析wikiに記載されてます。\n\n例として\n\n- 星5青葉(風魔) とっておき\n  - `1 1 1 1 1`\n- 星5千矢(火盾) クラススキル1\n  - `3 3 3 3 8`\n- 星5千矢(風魔) とっておき\n  - `1 1`\n\nなどです。区切り文字は空白でも`:`でもなんでもおｋです。\n\n## Damage\n\nダメージの期待値もしくは最大値を入力してください\n\n入力した値に応じて隣のboxの中身を選んでください\n\n- expect(critical)\n  - 入力値がクリティカル時の期待値(きらファン計算機ででかでかと表示される値です)\n- maximum(critical)\n  - 入力値がクリティカル時の最大値\n- expect(not critical)\n  - 入力値が非クリティカル時の期待値\n- maximum(not critical)\n  - 入力値が非クリティカル時の最大値\n\n## Critical Probability\n\nクリティカル確率です。\n\n## Critical Damage Change\n\nクリティカルダメージ量の変化です。\n\n最大100%最小-33%です。\n\n参考までに、\n\n- ゆの専用武器 +33%\n- かおす先生専用武器 +17%\n- サンリオアリス/冠 +16.3%\n- ごちうさ/きらファンオーブ +17%\n\n## Damage Sample\n\nグラフの積分用の設定値です。\n\nグラフ上にある赤い枠の両端を設定します。この範囲の確率を計算できます。\n\n`pick`ボタンを推してからグラフ上をクリックするとその地点のx座標が選択されます。\n\n選択範囲の積分値が`Probability = xx %`として入力欄の下に表示されます。\n\n## その他設定\n\n- auto scale x min\n  - チェックが入っているとグラフのx軸範囲の下限を自動調整します。\n  - オフでグラフ原点を表示範囲に含むようになります(デフォルト)\n- fixed-range\n  - チェックが入っているとグラフの表示範囲が固定されます(デフォルト)\n  - オフの時は拡大とか移動とかできます。\n  - グラフのy軸方向の拡大、移動はできないようにしてます\n\n## Author\n\nちゅーる [@tyuru_kirafan](https://twitter.com/tyuru_kirafan)\n",I={name:"Description",mounted:function(){this.$el.innerHTML=$()(N)}},E=I,S=Object(p["a"])(E,M,j,!1,null,"50bee34e",null),C=S.exports,U=t("b85c");t("fb6a");function T(e,n,t,a,i){for(var r=Array(n).fill(0),o=0;o<n;++o){var c=o/e;.85*t<=c&&c<t&&(r[o]+=1/(.15*t)*(1-a)/e),.85*t*i<=c&&c<t*i&&(r[o]+=1/(.15*t*i)*a/e)}var u=r.reduce((function(e,n){return e+n}));return r.map((function(e){return e/u}))}function J(e){return e-=1,e|=e>>1,e|=e>>2,e|=e>>4,e|=e>>8,e|=e>>16,e+=1,e}function q(e,n,t){var a,i=J(n),r=Array(i).fill(1),o=Array(i).fill(0),c=t.reduce((function(e,n){return e+n.mxdamage}),0),u=Object(U["a"])(t);try{for(u.s();!(a=u.n()).done;){var l,s=a.value,m=Object(U["a"])(s.division);try{for(m.s();!(l=m.n()).done;){var p=l.value,d=T(e,i,p*s.mxdamage/c,s.critical_probability,s.critical_coefficient),_=Array(i).fill(0);z(d,_,i,!1);for(var f=0;f<i;++f){var v=r[f],g=o[f];r[f]=v*d[f]-g*_[f],o[f]=v*_[f]+g*d[f]}}}catch(b){m.e(b)}finally{m.f()}}}catch(b){u.e(b)}finally{u.f()}z(r,o,i,!0);for(var h=Array(i).fill(0),x=0;x<i;++x)h[x]=Math.sqrt(r[x]*r[x]+o[x]*o[x]);return h.slice(0,n)}function z(e,n,t,a){for(var i=a?1:-1,r=new Array(t),o=0;o<r.length;o++)r[o]=0;var c=t/2,u=t/2,l=2*Math.PI/t;while(u>=1){for(var s=0;s<t;s+=2*u)for(var m=r[s]/2,p=m+c,d=Math.cos(l*m),_=Math.sin(l*m*i),f=s;f<s+u;f++){var v=f+u,g=e[v]*d-n[v]*_,h=e[v]*_+n[v]*d;e[v]=e[f]-g,n[v]=n[f]-h,e[f]=e[f]+g,n[f]=n[f]+h,r[f]=m,r[v]=p}u/=2}for(var x=0;x<t;x++){var b=r[x];if(b>x){var y=e[x];e[x]=e[b],e[b]=y;var k=n[x];n[x]=n[b],n[b]=k}}if(a)for(var w=0;w<t;w++)e[w]=e[w]/t,n[w]=n[w]/t}var B=1e3,H={name:"App",components:{DamageInput:h,Plot:A,Description:C},data:function(){return{plot_data:{plot_data:{x:[0],y:[0]},x_range:{mn:0,mx:1,dtick:1}},cumsum:[0,0],sample_range_min:700,sample_range_max:800,inputdata:[],pick_target:null}},created:function(){this.add_pack()},computed:{integral_probability:function(){var e=Math.min(Math.round(this.sample_range_min/this.damage_par_index()),this.cumsum.length-1),n=Math.min(Math.round(this.sample_range_max/this.damage_par_index()),this.cumsum.length-1),t=this.cumsum[n]-this.cumsum[e];return Math.round(1e3*t)/10}},watch:{inputdata:{deep:!0,handler:function(){var e=this;if(this.inputdata.length){var n=3,t=B*n,a=Array(t).fill().map((function(n,t){return t*e.damage_par_index()})),i=q(B,t,this.inputdata.map((function(e){return{division:e.v.division,mxdamage:e.v.mxdamage,critical_probability:e.v.prob,critical_coefficient:e.v.critical_coefficient}})));this.plot_data={plot_data:{x:a,y:i.map((function(n){return n/e.damage_par_index()}))},x_range:{mn:this.damage_par_index()*B*.8,mx:this.inputdata.reduce((function(e,n){return e+n.v.mxdamage*(n.v.critical_coefficient+.05)}),0),dtick:.1*this.damage_par_index()*B}};var r=Array(t+1);r[0]=0;for(var o=0;o<t;++o)r[o+1]=r[o]+i[o];this.cumsum=r}}}},methods:{add_pack:function(){this.inputdata.push({v:{division:[1,1,1,1,1],mxdamage:1e3,critical_probability:.2,critical_coefficient:1.5}})},rem_pack:function(){this.inputdata.length>1&&this.inputdata.pop()},damage_par_index:function(){return this.inputdata.reduce((function(e,n){return e+n.v.mxdamage}),0)/B},set_sample_val:function(e){e=Math.floor(e),"min"===this.pick_target?this.sample_range_min=e:"max"===this.pick_target&&(this.sample_range_max=e),this.pick_target=null}}},K=H,L=(t("034f"),Object(p["a"])(K,i,r,!1,null,null,null)),F=L.exports;a["a"].config.productionTip=!1,new a["a"]({render:function(e){return e(F)}}).$mount("#app")},"85ec":function(e,n,t){}});
//# sourceMappingURL=app.7a8834c0.js.map