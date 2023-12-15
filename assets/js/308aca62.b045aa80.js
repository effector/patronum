"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[687],{4852:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>f});var r=n(9231);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),u=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=u(e.components);return r.createElement(s.Provider,{value:t},e.children)},c="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),c=u(n),d=a,f=c["".concat(s,".").concat(d)]||c[d]||m[d]||o;return n?r.createElement(f,l(l({ref:t},p),{},{components:n})):r.createElement(f,l({ref:t},p))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,l=new Array(o);l[0]=d;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i[c]="string"==typeof e?e:a,l[1]=i;for(var u=2;u<o;u++)l[u]=n[u];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},8295:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>l,default:()=>m,frontMatter:()=>o,metadata:()=>i,toc:()=>u});var r=n(4011),a=(n(9231),n(4852));const o={},l="not",i={unversionedId:"not/readme",id:"not/readme",title:"not",description:"patronum 1.11.0",source:"@site/../src/not/readme.md",sourceDirName:"not",slug:"/not/",permalink:"/methods/not/",draft:!1,editUrl:"https://github.com/effector/patronum/tree/main/src/../src/not/readme.md",tags:[],version:"current",frontMatter:{},sidebar:"methodsSidebar",previous:{title:"interval",permalink:"/methods/interval/"},next:{title:"once",permalink:"/methods/once/"}},s={},u=[{value:"Motivation",id:"motivation",level:3},{value:"Formulae",id:"formulae",level:3},{value:"Arguments",id:"arguments",level:3},{value:"Returns",id:"returns",level:3},{value:"Example",id:"example",level:3},{value:"Alternative",id:"alternative",level:3}],p={toc:u},c="wrapper";function m(e){let{components:t,...n}=e;return(0,a.kt)(c,(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"not"},"not"),(0,a.kt)("admonition",{title:"since",type:"note"},(0,a.kt)("p",{parentName:"admonition"},"patronum 1.11.0")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { not } from 'patronum';\n// or\nimport { not } from 'patronum/not';\n")),(0,a.kt)("h3",{id:"motivation"},"Motivation"),(0,a.kt)("p",null,'The method allows to apply boolean NOT to a value.\nActually converts any "falsey" value into ',(0,a.kt)("inlineCode",{parentName:"p"},"true")," (null, 0, empty string).\nBut ",(0,a.kt)("inlineCode",{parentName:"p"},"undefined")," is not present, because Store cannot hold it inside."),(0,a.kt)("h3",{id:"formulae"},"Formulae"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"$result = not($value);\n")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"$result")," store contains ",(0,a.kt)("inlineCode",{parentName:"li"},"false")," if ",(0,a.kt)("inlineCode",{parentName:"li"},"$value"),' contains any "truthy" value, otherwise there will be ',(0,a.kt)("inlineCode",{parentName:"li"},"true"))),(0,a.kt)("h3",{id:"arguments"},"Arguments"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"$value: Store<T>"),' \u2014 Any value, that required to be "inverted"')),(0,a.kt)("h3",{id:"returns"},"Returns"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"$result: Store<boolean>"))),(0,a.kt)("h3",{id:"example"},"Example"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"const $isFinished = createStore(false);\nconst $stillGoingOn = not($isFinished);\n\nconsole.assert(true === $stillGoingOn.getState());\n")),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://share.effector.dev/qpTZAzXC"},"Try it")),(0,a.kt)("h3",{id:"alternative"},"Alternative"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"const $isFinished = createStore(false);\nconst $stillGoingOn = $isFinished.map((isFinished) => !isFinished);\n\nconsole.assert(true === $stillGoingOn.getState());\n")))}m.isMDXComponent=!0}}]);