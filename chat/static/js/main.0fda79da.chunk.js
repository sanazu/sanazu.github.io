(this.webpackJsonpmessenger=this.webpackJsonpmessenger||[]).push([[0],{116:function(e,t,n){},124:function(e,t,n){},125:function(e,t,n){},126:function(e,t,n){"use strict";n.r(t);var i=n(0),c=n.n(i),a=n(19),o=n.n(a),s=(n(96),n(84)),r=n(17),l=n(8),d=n(47),j=n(64),u=n.n(j),b=n(153),h=n(69),O=n(159),g=n(171),x=n(160),f=n(48),v=n(170),p=n(71),m=n.n(p),w=n(72),y=n.n(w),C=n(154),I=n(155),S=n(156),N=n(174),k=n(157),L=n(158),F=(n(116),n(2)),E=Object(b.a)((function(e){return{root:{display:"flex",marginTop:e.spacing(1)},photo:{display:"flex",marginRight:e.spacing(2),marginLeft:e.spacing(1)},info:{display:"flex"},inline:{display:"inline"},small:{width:e.spacing(3),height:e.spacing(3)},large:{width:e.spacing(7),height:e.spacing(7)},divider:{marginTop:e.spacing(.5),marginBottom:e.spacing(.5)}}})),B=function(e){e.isLast,e.isFirst;var t,n=Object(d.a)(e,["isLast","isFirst"]),c=E();return Object(F.jsxs)(i.Fragment,{children:[Object(F.jsxs)(C.a,{alignItems:"flex-end",className:c.root,children:[Object(F.jsxs)(I.a,{className:c.photo,children:[Object(F.jsx)(S.a,{badgeContent:n.unread,color:"primary"}),Object(F.jsx)(N.a,{alt:n.name,src:n.imageUrl,className:c.large})]}),Object(F.jsx)(k.a,{primary:n.name,secondary:(null===n||void 0===n?void 0:n.lastMsg)&&Object(F.jsx)(i.Fragment,{children:Object(F.jsx)(f.a,{component:"span",variant:"body2",className:c.inline,color:"textPrimary",children:null===(t=n.lastMsg)||void 0===t?void 0:t.text})})})]}),Object(F.jsx)(L.a,{className:c.divider,variant:"inset"})]})},M=n(161),T=n(70),U=n.n(T);function J(e){var t=e.children,n=e.value,i=e.index,c=Object(d.a)(e,["children","value","index"]);return Object(F.jsx)("div",Object(r.a)(Object(r.a)({role:"tabpanel",hidden:n!==i,id:"full-width-tabpanel-".concat(i),"aria-labelledby":"full-width-tab-".concat(i)},c),{},{children:n===i&&Object(F.jsx)(v.a,{p:3,children:Object(F.jsx)(f.a,{children:t})})}))}function D(e){return{id:"full-width-tab-".concat(e),"aria-controls":"full-width-tabpanel-".concat(e)}}var G=Object(b.a)((function(e){return{root:{backgroundColor:e.palette.background.paper},child:{overflowX:"hidden"},list:{padding:0}}})),P=function(e){var t=G(),n=Object(h.a)(),c=Object(i.useState)(1),a=Object(l.a)(c,2),o=a[0],s=a[1];return Object(F.jsxs)("div",{className:t.root,children:[!!(null===e||void 0===e?void 0:e.nav)&&Object(F.jsx)(O.a,{position:"static",color:"default",children:Object(F.jsxs)(g.a,{value:o,onChange:function(e,t){s(t)},indicatorColor:"primary",textColor:"primary",variant:"fullWidth","aria-label":"full width tabs example",children:[Object(F.jsx)(x.a,Object(r.a)({icon:Object(F.jsx)(U.a,{})},D(0))),Object(F.jsx)(x.a,Object(r.a)({icon:Object(F.jsx)(m.a,{})},D(1))),Object(F.jsx)(x.a,Object(r.a)({icon:Object(F.jsx)(y.a,{})},D(2)))]})}),Object(F.jsxs)(u.a,{axis:"rtl"===n.direction?"x-reverse":"x",index:o,onChangeIndex:function(e){s(e)},children:[Object(F.jsx)(J,{value:o,index:0,dir:n.direction,className:t.child,style:{height:(null===e||void 0===e?void 0:e.nav)?"88vh":"92vh"},children:"Item Two"}),Object(F.jsx)(M.a,{value:o,index:1,dir:n.direction,className:t.child,style:{height:(null===e||void 0===e?void 0:e.nav)?"88vh":"92vh"},children:null===e||void 0===e?void 0:e.users.map((function(t,n){var i;return Object(F.jsx)(B,{isLast:n===(null===e||void 0===e||null===(i=e.users)||void 0===i?void 0:i.length)-1,isFirst:0===n,imageUrl:"",name:t,lastMsg:{text:"",time:new Date}},n)}))}),Object(F.jsx)(J,{value:o,index:2,dir:n.direction,className:t.child,style:{height:(null===e||void 0===e?void 0:e.nav)?"88vh":"92vh"},children:"Item Three"})]})]})},R=n(163),_=n(162),A=n(76),q=n.n(A);new window.MeetJS({contextPath:"socket",url:"https://chat-demo-v1.herokuapp.com".replace("http","ws"),debug:!0,userStatusNeeded:!0});var W="285012527634-f296btei2pcgkq9fed6tr3fah200fn66.apps.googleusercontent.com",X=n(46),Y=n(73),Z=n.n(Y),z=function(e){return Object(F.jsx)("div",{children:Object(F.jsx)(X.GoogleLogout,{render:function(e){return Object(F.jsx)(_.a,{color:"inherit",onClick:e.onClick,disabled:e.disabled,children:Object(F.jsx)(Z.a,{})})},clientId:W,onLogoutSuccess:function(t){e.setSignedIn(!1)},onFailure:function(e){console.error(e)},cookiePolicy:"single_host_origin"})})},H=n(75),K=n.n(H),Q=n(74),V=n.n(Q),$=Object(b.a)((function(e){return{root:{flexGrow:1},menuButton:{marginRight:e.spacing(2)},title:{flexGrow:1},avatar:{marginRight:e.spacing(1),width:e.spacing(7),height:e.spacing(7)},appBar:{}}})),ee=function(e){var t,n=$();return Object(F.jsx)("div",{className:n.root,children:Object(F.jsx)(O.a,{position:"static",className:n.appBar,children:Object(F.jsxs)(R.a,{children:[Object(F.jsx)(_.a,{edge:"start",className:n.avatar,color:"inherit",children:Object(F.jsx)(N.a,{alt:e.name,src:e.imageUrl})}),Object(F.jsx)(f.a,{variant:"h6",className:n.title,children:e.name&&(t=e.name,t.replace(/(     ^\w|[A-Z]|\b\w|\s+)/g,(function(e,t){return 0===+e?"":0===t?e.toLowerCase():e.toUpperCase()})))}),Object(F.jsx)(_.a,{"aria-label":"show 11 new notifications",color:"inherit",onClick:null===e||void 0===e?void 0:e.setNav,children:Object(F.jsx)(S.a,{badgeContent:e.notifyCount,color:"secondary",children:(null===e||void 0===e?void 0:e.nav)?Object(F.jsx)(V.a,{}):Object(F.jsx)(K.a,{})})}),Object(F.jsx)(_.a,{"aria-label":"show 11 new notifications",color:"inherit",children:Object(F.jsx)(S.a,{badgeContent:e.notifyCount,color:"secondary",children:Object(F.jsx)(q.a,{})})}),Object(F.jsx)(z,{setSignedIn:e.setSignedIn})]})})})},te=function(e){return Object(F.jsx)("div",{style:{display:"flex",width:"100vw",height:"100vh",justifyContent:"center",alignItems:"center"},children:Object(F.jsx)(X.GoogleLogin,{clientId:W,onSuccess:function(t){e.setUser(t.profileObj),e.setSignedIn(!0)},onFailure:function(e){console.error(e)},cookiePolicy:"single_host_origin",isSignedIn:e.signedIn})})};n(24),n(33),n(78),n(77),n(164),n(79),n(124),n(80),n(125),n(165),n(166),n(167),n(55),n(81),n(82),n(54),Object(b.a)((function(e){return{root:{display:"flex"},details:{display:"flex",flexDirection:"column"},content:{flex:"1 0 auto"},cover:{width:151},controls:{display:"flex",alignItems:"center",paddingLeft:e.spacing(1),paddingBottom:e.spacing(1)},playIcon:{height:38,width:38}}}));n(172);var ne=function(){var e,t=null===(e=window)||void 0===e?void 0:e.MeetJS,n=Object(i.useState)(null),c=Object(l.a)(n,2),a=c[0],o=c[1],d=Object(i.useState)(),j=Object(l.a)(d,2),u=(j[0],j[1],Object(i.useState)([])),b=Object(l.a)(u,2),h=b[0],O=b[1],g=Object(i.useState)(!1),x=Object(l.a)(g,2),f=x[0],v=x[1],p=Object(i.useState)(!0),m=Object(l.a)(p,2),w=m[0],y=m[1],C=Object(i.useState)(!0),I=Object(l.a)(C,2),S=(I[0],I[1],Object(i.useState)(0)),N=Object(l.a)(S,2),k=N[0];N[1];return Object(i.useEffect)((function(){t.isConnected()||(t.on("READY",(function(e){console.log("connected.....",e)})),t.on("JOINED",(function(e){O((function(t){return[].concat(Object(s.a)(t),[e])})),console.log("peer joined : ".concat(e))})),t.on("LEFT",(function(e){O((function(t){return t.filter((function(t){return t!==e}))})),console.log("peer left : ".concat(e))})),t.emit("CONNECT",null===a||void 0===a?void 0:a.name))}),[t,a]),Object(i.useEffect)((function(){return f||o(null),function(){}}),[f]),a?Object(F.jsxs)("div",{children:[Object(F.jsx)(ee,Object(r.a)(Object(r.a)({setSignedIn:v,notifyCount:k},a),{},{nav:w,setNav:function(){return y(!w)}})),Object(F.jsx)(P,{nav:w,users:h})]}):Object(F.jsx)(te,{setUser:function(e){console.log(e),o(Object(r.a)({},e))},signedIn:f,setSignedIn:v})},ie=n(83),ce=n(169),ae=n(168),oe=function(e){var t=Object(ae.a)("(prefers-color-scheme: dark)"),n=c.a.useMemo((function(){return Object(ie.a)({palette:{type:t?"dark":"light"}})}),[t]);return Object(F.jsx)(ce.a,{theme:n,children:e.children})};o.a.render(Object(F.jsx)(oe,{children:Object(F.jsx)(ne,{})}),document.getElementById("root"))},96:function(e,t,n){}},[[126,1,2]]]);