(this.webpackJsonpmessenger=this.webpackJsonpmessenger||[]).push([[0],{116:function(e,t,n){},124:function(e,t,n){},125:function(e,t,n){},126:function(e,t,n){"use strict";n.r(t);var i=n(0),c=n.n(i),a=n(19),o=n.n(a),s=(n(96),n(84)),r=n(17),l=n(8),d=n(47),j=n(64),u=n.n(j),b=n(153),h=n(69),g=n(159),O=n(171),f=n(160),x=n(48),v=n(170),p=n(71),m=n.n(p),w=n(72),y=n.n(w),I=n(154),C=n(155),N=n(156),S=n(174),k=n(157),L=n(158),E=(n(116),n(2)),F=Object(b.a)((function(e){return{root:{display:"flex",marginTop:e.spacing(1)},photo:{display:"flex",marginRight:e.spacing(2),marginLeft:e.spacing(1)},info:{display:"flex"},inline:{display:"inline"},small:{width:e.spacing(3),height:e.spacing(3)},large:{width:e.spacing(7),height:e.spacing(7)},divider:{marginTop:e.spacing(.5),marginBottom:e.spacing(.5)}}})),U=function(e){e.isLast,e.isFirst;var t,n=Object(d.a)(e,["isLast","isFirst"]),c=F();return Object(E.jsxs)(i.Fragment,{children:[Object(E.jsxs)(I.a,{alignItems:"flex-end",className:c.root,children:[Object(E.jsxs)(C.a,{className:c.photo,children:[Object(E.jsx)(N.a,{badgeContent:n.unread,color:"primary"}),Object(E.jsx)(S.a,{alt:n.name,src:n.imageUrl,className:c.large})]}),Object(E.jsx)(k.a,{primary:n.name,secondary:(null===n||void 0===n?void 0:n.lastMsg)&&Object(E.jsx)(i.Fragment,{children:Object(E.jsx)(x.a,{component:"span",variant:"body2",className:c.inline,color:"textPrimary",children:null===(t=n.lastMsg)||void 0===t?void 0:t.text})})})]}),Object(E.jsx)(L.a,{className:c.divider,variant:"inset"})]})},B=n(161),T=n(70),M=n.n(T);function R(e){var t=e.children,n=e.value,i=e.index,c=Object(d.a)(e,["children","value","index"]);return Object(E.jsx)("div",Object(r.a)(Object(r.a)({role:"tabpanel",hidden:n!==i,id:"full-width-tabpanel-".concat(i),"aria-labelledby":"full-width-tab-".concat(i)},c),{},{children:n===i&&Object(E.jsx)(v.a,{p:3,children:Object(E.jsx)(x.a,{children:t})})}))}function G(e){return{id:"full-width-tab-".concat(e),"aria-controls":"full-width-tabpanel-".concat(e)}}var J=Object(b.a)((function(e){return{root:{backgroundColor:e.palette.background.paper},child:{overflowX:"hidden"},list:{padding:0}}})),A=function(e){var t=J(),n=Object(h.a)(),c=Object(i.useState)(1),a=Object(l.a)(c,2),o=a[0],s=a[1];return Object(E.jsxs)("div",{className:t.root,children:[!!(null===e||void 0===e?void 0:e.nav)&&Object(E.jsx)(g.a,{position:"static",color:"default",children:Object(E.jsxs)(O.a,{value:o,onChange:function(e,t){s(t)},indicatorColor:"primary",textColor:"primary",variant:"fullWidth","aria-label":"full width tabs example",children:[Object(E.jsx)(f.a,Object(r.a)({icon:Object(E.jsx)(M.a,{})},G(0))),Object(E.jsx)(f.a,Object(r.a)({icon:Object(E.jsx)(m.a,{})},G(1))),Object(E.jsx)(f.a,Object(r.a)({icon:Object(E.jsx)(y.a,{})},G(2)))]})}),Object(E.jsxs)(u.a,{axis:"rtl"===n.direction?"x-reverse":"x",index:o,onChangeIndex:function(e){s(e)},children:[Object(E.jsx)(R,{value:o,index:0,dir:n.direction,className:t.child,style:{height:(null===e||void 0===e?void 0:e.nav)?"88vh":"92vh"},children:"Item Two"}),Object(E.jsx)(B.a,{value:o,index:1,dir:n.direction,className:t.child,style:{height:(null===e||void 0===e?void 0:e.nav)?"88vh":"92vh"},children:null===e||void 0===e?void 0:e.users.map((function(t,n){var i;return Object(E.jsx)(U,{isLast:n===(null===e||void 0===e||null===(i=e.users)||void 0===i?void 0:i.length)-1,isFirst:0===n,imageUrl:"",name:t,lastMsg:{text:"",time:new Date}},n)}))}),Object(E.jsx)(R,{value:o,index:2,dir:n.direction,className:t.child,style:{height:(null===e||void 0===e?void 0:e.nav)?"88vh":"92vh"},children:"Item Three"})]})]})},D=n(163),P=n(162),_=n(76),z=n.n(_);new window.MeetJS({contextPath:"socket",url:"https://chat-demo-v1.herokuapp.com".replace("http","ws"),debug:!0,userStatusNeeded:!0});var X="285012527634-f296btei2pcgkq9fed6tr3fah200fn66.apps.googleusercontent.com",Y=n(46),q=n(73),H=n.n(q),W=function(e){return Object(E.jsx)("div",{children:Object(E.jsx)(Y.GoogleLogout,{render:function(e){return Object(E.jsx)(P.a,{color:"inherit",onClick:e.onClick,disabled:e.disabled,children:Object(E.jsx)(H.a,{})})},clientId:X,onLogoutSuccess:function(t){e.setSignedIn(!1)},onFailure:function(e){console.error(e)},cookiePolicy:"single_host_origin"})})},Z=n(75),K=n.n(Z),Q=n(74),V=n.n(Q),$=Object(b.a)((function(e){return{root:{flexGrow:1},menuButton:{marginRight:e.spacing(2)},title:{flexGrow:1},avatar:{marginRight:e.spacing(1),width:e.spacing(7),height:e.spacing(7)},appBar:{}}})),ee=function(e){var t,n=$();return Object(E.jsx)("div",{className:n.root,children:Object(E.jsx)(g.a,{position:"static",className:n.appBar,children:Object(E.jsxs)(D.a,{children:[Object(E.jsx)(P.a,{edge:"start",className:n.avatar,color:"inherit",children:Object(E.jsx)(S.a,{alt:e.name,src:e.imageUrl})}),Object(E.jsx)(x.a,{variant:"h6",className:n.title,children:e.name&&(t=e.name,t.replace(/(     ^\w|[A-Z]|\b\w|\s+)/g,(function(e,t){return 0===+e?"":0===t?e.toLowerCase():e.toUpperCase()})))}),Object(E.jsx)(P.a,{"aria-label":"show 11 new notifications",color:"inherit",onClick:null===e||void 0===e?void 0:e.setNav,children:Object(E.jsx)(N.a,{badgeContent:e.notifyCount,color:"secondary",children:(null===e||void 0===e?void 0:e.nav)?Object(E.jsx)(V.a,{}):Object(E.jsx)(K.a,{})})}),Object(E.jsx)(P.a,{"aria-label":"show 11 new notifications",color:"inherit",children:Object(E.jsx)(N.a,{badgeContent:e.notifyCount,color:"secondary",children:Object(E.jsx)(z.a,{})})}),Object(E.jsx)(W,{setSignedIn:e.setSignedIn})]})})})},te=function(e){return Object(E.jsx)("div",{style:{display:"flex",width:"100vw",height:"100vh",justifyContent:"center",alignItems:"center"},children:Object(E.jsx)(Y.GoogleLogin,{clientId:X,onSuccess:function(t){e.setUser(t.profileObj),e.setSignedIn(!0)},onFailure:function(e){console.error(e)},cookiePolicy:"single_host_origin",isSignedIn:e.signedIn})})};n(24),n(33),n(78),n(77),n(164),n(79),n(124),n(80),n(125),n(165),n(166),n(167),n(55),n(81),n(82),n(54),Object(b.a)((function(e){return{root:{display:"flex"},details:{display:"flex",flexDirection:"column"},content:{flex:"1 0 auto"},cover:{width:151},controls:{display:"flex",alignItems:"center",paddingLeft:e.spacing(1),paddingBottom:e.spacing(1)},playIcon:{height:38,width:38}}}));n(172);var ne={name:"sanjai kumar",googleId:21432142,imageUrl:"https://lh3.googleusercontent.com/a-/AOh14GiHblzps07YfmIALB7zR3R6UmkcmTvdNC-lEaXm8g=s96-c"},ie=function(){var e,t=null===(e=window)||void 0===e?void 0:e.MeetJS,n=Object(i.useState)(ne),c=Object(l.a)(n,2),a=c[0],o=c[1],d=Object(i.useState)(),j=Object(l.a)(d,2),u=(j[0],j[1],Object(i.useState)([])),b=Object(l.a)(u,2),h=b[0],g=b[1],O=Object(i.useState)(!0),f=Object(l.a)(O,2),x=f[0],v=f[1],p=Object(i.useState)(!0),m=Object(l.a)(p,2),w=m[0],y=m[1],I=Object(i.useState)(!0),C=Object(l.a)(I,2),N=(C[0],C[1],Object(i.useState)(0)),S=Object(l.a)(N,2),k=S[0];S[1];return Object(i.useEffect)((function(){t.isConnected()||(t.on("READY",(function(e){console.log("connected.....",e)})),t.on("JOINED",(function(e){g((function(t){return[].concat(Object(s.a)(t),[e])})),console.log("peer joined : ".concat(e))})),t.on("LEFT",(function(e){g((function(t){return t.filter((function(t){return t!==e}))})),console.log("peer left : ".concat(e))})),t.emit("CONNECT",null===a||void 0===a?void 0:a.name))}),[t,a]),Object(i.useEffect)((function(){return x||o(null),function(){}}),[x]),a?Object(E.jsxs)("div",{children:[Object(E.jsx)(ee,Object(r.a)(Object(r.a)({setSignedIn:v,notifyCount:k},a),{},{nav:w,setNav:function(){return y(!w)}})),Object(E.jsx)(A,{nav:w,users:h})]}):Object(E.jsx)(te,{setUser:function(e){console.log(e),o(Object(r.a)({},e))},signedIn:x,setSignedIn:v})},ce=n(83),ae=n(169),oe=n(168),se=function(e){var t=Object(oe.a)("(prefers-color-scheme: dark)"),n=c.a.useMemo((function(){return Object(ce.a)({palette:{type:t?"dark":"light"}})}),[t]);return Object(E.jsx)(ae.a,{theme:n,children:e.children})};o.a.render(Object(E.jsx)(se,{children:Object(E.jsx)(ie,{})}),document.getElementById("root"))},96:function(e,t,n){}},[[126,1,2]]]);