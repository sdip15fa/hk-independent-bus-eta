"use strict";(self.webpackChunkhk_independent_bus_eta=self.webpackChunkhk_independent_bus_eta||[]).push([[4],{4004:function(t,n,e){e.r(n);var o=e(4942),a=e(9439),c=e(7313),i=e(178),r=e(7829),l=e(9099),u=e(6701),s=e(7592),d=e(4511),f=e(3475),g=e.n(f),m=e(3155),p=e.n(m),b=e(5823),h=e(8866),x=e(421),C=e(6417);n.default=function(t){var n=t.id,e=t.route,o=t.idx,u=void 0===o?-1:o,s=t.dest,f=t.stop,m=t.setIsCopied,k=t.event,j=(0,c.useState)(!1),v=(0,a.Z)(j,2),I=v[0],P=v[1],w=(0,c.useContext)(h.Z),E=w.AppTitle,N=w.colorMode,_=(0,d.$)(),B=_.t,F=_.i18n,D=(0,c.useState)(""),J=(0,a.Z)(D,2),M=J[0],S=J[1];(0,c.useEffect)((function(){!1!==I&&Promise.all([g().toPng(document.getElementById("route-eta-header"),{bgcolor:"light"===N?"#fedb00":"#000"}),document.getElementById("route-map")&&g().toPng(document.getElementById("route-map")),g().toPng(document.getElementById("stop-".concat(u)))]).then((function(t){return p()(t.filter((function(t){return t})).map((function(t){return t.substr(22)})),{direction:!0,isPng:!0})})).then((function(t){S(t)}))}),[I]),(0,c.useEffect)((function(){P(!0)}),[k]);var A=(0,c.useCallback)((function(){(0,b.I)("https://".concat(window.location.hostname,"/").concat(F.language,"/route/").concat(n),"".concat(u+1,". ").concat((0,b.iF)(f.name[F.language])," - ").concat(e," ").concat(B("\u5f80")," ").concat((0,b.iF)(s[F.language])," - ").concat(B(E))).then((function(){navigator.clipboard&&m(!0)})).finally((function(){P(!1)}))}),[b.I,F.language,n,u,f.name,e]),T=(0,c.useCallback)((function(){(0,b.JP)(M,"https://".concat(window.location.hostname,"/").concat(F.language,"/route/").concat(n),"".concat(u+1,". ").concat((0,b.iF)(f.name[F.language])," - ").concat(e," ").concat(B("\u5f80")," ").concat((0,b.iF)(s[F.language])," - https://hkbus.app/")).then((function(){navigator.clipboard&&m(!0)})).finally((function(){P(!1)}))}),[b.JP,M,F.language,n,u,e]);return(0,C.jsx)(Z,{className:y.root,onClose:function(){return P(!1)},open:I,children:(0,C.jsxs)(i.Z,{maxWidth:"xs",className:y.container,children:[M&&(0,C.jsxs)(r.Z,{className:y.boxContainer,children:[(0,C.jsx)("img",{src:M,style:{width:"100%"},alt:""}),(0,C.jsxs)(r.Z,{className:y.buttonContainer,children:[(0,C.jsx)(l.Z,{className:y.button,onClick:A,children:B("\u4ee5\u93c8\u7d50\u5206\u4eab")}),(0,C.jsx)(l.Z,{className:y.button,onClick:T,children:B("\u4ee5\u5716\u7247\u5206\u4eab")})]})]}),!M&&(0,C.jsx)(x.D,{color:"inherit"})]})})};var k="sharingModal",y={root:"".concat(k,"-root"),container:"".concat(k,"-container"),boxContainer:"".concat(k,"-boxContainer"),buttonContainer:"".concat(k,"-buttonContainer"),button:"".concat(k,"-button")},Z=(0,s.ZP)(u.Z)((function(t){var n,e=t.theme;return n={},(0,o.Z)(n,"&.".concat(y.root),{display:"flex",alignItems:"center"}),(0,o.Z)(n,"& .".concat(y.container),{display:"flex",justifyContent:"center",outline:"none"}),(0,o.Z)(n,"& .".concat(y.boxContainer),{display:"flex",flexDirection:"column",justifyContent:"center"}),(0,o.Z)(n,"& .".concat(y.buttonContainer),{display:"flex",backgroundColor:"dark"===e.palette.mode?e.palette.background.default:"#fedb00"}),(0,o.Z)(n,"& .".concat(y.button),{flex:1,border:"1px solid rgba(255, 255, 255, 0.3)",color:"dark"===e.palette.mode?e.palette.primary.main:e.palette.text.primary}),n}))}}]);