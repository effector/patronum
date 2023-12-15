"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[169],{4852:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>f});var n=r(9231);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var i=n.createContext({}),m=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},c=function(e){var t=m(e.components);return n.createElement(i.Provider,{value:t},e.children)},p="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),p=m(r),d=a,f=p["".concat(i,".").concat(d)]||p[d]||u[d]||o;return r?n.createElement(f,s(s({ref:t},c),{},{components:r})):n.createElement(f,s({ref:t},c))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,s=new Array(o);s[0]=d;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l[p]="string"==typeof e?e:a,s[1]=l;for(var m=2;m<o;m++)s[m]=r[m];return n.createElement.apply(null,s)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},2921:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>i,contentTitle:()=>s,default:()=>u,frontMatter:()=>o,metadata:()=>l,toc:()=>m});var n=r(4011),a=(r(9231),r(4852));const o={},s="reset",l={unversionedId:"reset/readme",id:"reset/readme",title:"reset",description:"patronum 1.7.0",source:"@site/../src/reset/readme.md",sourceDirName:"reset",slug:"/reset/",permalink:"/methods/reset/",draft:!1,editUrl:"https://github.com/effector/patronum/tree/main/src/../src/reset/readme.md",tags:[],version:"current",frontMatter:{},sidebar:"methodsSidebar",previous:{title:"previous",permalink:"/methods/previous/"},next:{title:"reshape",permalink:"/methods/reshape/"}},i={},m=[{value:"<code>reset({ clock, target })</code>",id:"reset-clock-target-",level:2},{value:"Motivation",id:"motivation",level:3},{value:"Formulae",id:"formulae",level:3},{value:"Arguments",id:"arguments",level:3},{value:"Example",id:"example",level:3},{value:"Alternative",id:"alternative",level:3},{value:"<code>reset({ target })</code>",id:"reset-target-",level:2},{value:"Motivation",id:"motivation-1",level:3},{value:"Formulae",id:"formulae-1",level:3},{value:"Arguments",id:"arguments-1",level:3},{value:"Returns",id:"returns",level:3},{value:"Example",id:"example-1",level:3},{value:"Alternative",id:"alternative-1",level:3}],c={toc:m},p="wrapper";function u(e){let{components:t,...r}=e;return(0,a.kt)(p,(0,n.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"reset"},"reset"),(0,a.kt)("admonition",{title:"since",type:"note"},(0,a.kt)("p",{parentName:"admonition"},"patronum 1.7.0")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { reset } from 'patronum';\n// or\nimport { reset } from 'patronum/reset';\n")),(0,a.kt)("h2",{id:"reset-clock-target-"},(0,a.kt)("inlineCode",{parentName:"h2"},"reset({ clock, target })")),(0,a.kt)("h3",{id:"motivation"},"Motivation"),(0,a.kt)("p",null,"The method allow to reset many stores by a single line"),(0,a.kt)("h3",{id:"formulae"},"Formulae"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"reset({ clock, target });\n")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"When ",(0,a.kt)("inlineCode",{parentName:"li"},"clock")," is triggered, reset store/stores in ",(0,a.kt)("inlineCode",{parentName:"li"},"target")," to the initial value.")),(0,a.kt)("h3",{id:"arguments"},"Arguments"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("inlineCode",{parentName:"li"},"clock: Unit<any> | Array<Unit<any>>")," \u2014 Any kind of units is accepted (Store, Event, Effect)."),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("inlineCode",{parentName:"li"},"target: Store<any> | Array<Store<any>>")," \u2014 Each of these stores will be reset to the initial values when ",(0,a.kt)("inlineCode",{parentName:"li"},"clock")," is happened.")),(0,a.kt)("h3",{id:"example"},"Example"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { createEvent, createStore } from 'effector';\nimport { reset } from 'patronum/reset';\n\nconst pageUnmounted = createEvent();\nconst userSessionFinished = createEvent();\n\nconst $post = createStore(null);\nconst $comments = createStore([]);\nconst $draftComment = createStore('');\n\nreset({\n  clock: [pageUnmounted, userSessionFinished],\n  target: [$post, $comments, $draftComment],\n});\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { createStore } from 'effector';\nimport { reset } from 'patronum/reset';\n\nconst $post = createStore(null);\nconst $comments = createStore([]);\nconst $draftComment = createStore('');\n\nconst resetEvent = reset({ target: [$post, $comments, $draftComment] });\n")),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://share.effector.dev/06hpVftG"},"Try it")),(0,a.kt)("h3",{id:"alternative"},"Alternative"),(0,a.kt)("p",null,"First variant is writing each reset by yourself:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"$post.reset([pageUnmounted, userSessionFinished]);\n$comments.reset([pageUnmounted, userSessionFinished]);\n$draftComment.reset([pageUnmounted, userSessionFinished]);\n")),(0,a.kt)("p",null,"There has another way \u2014 use domain:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { createDomain, createStore } from 'effector';\nconst resetOnSomeCases = createDomain();\n\nconst $post = resetOnSomeCases.createStore(null);\nconst $comments = resetOnSomeCases.createStore([]);\nconst $draftComment = resetOnSomeCases.createStore('');\n\nresetOnSomeCases.onCreateStore((store) => {\n  store.reset([pageUnmounted, userSessionFinished]);\n});\n")),(0,a.kt)("h2",{id:"reset-target-"},(0,a.kt)("inlineCode",{parentName:"h2"},"reset({ target })")),(0,a.kt)("h3",{id:"motivation-1"},"Motivation"),(0,a.kt)("p",null,"The method allow to reset many stores by a single line with no ",(0,a.kt)("inlineCode",{parentName:"p"},"clock")," passing"),(0,a.kt)("admonition",{title:"since",type:"note"},(0,a.kt)("p",{parentName:"admonition"},"The ",(0,a.kt)("inlineCode",{parentName:"p"},"clock")," argument became optional since patronum 1.15.0")),(0,a.kt)("h3",{id:"formulae-1"},"Formulae"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"const resetEvent = reset({ target });\n")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"When ",(0,a.kt)("inlineCode",{parentName:"li"},"resetEvent")," is triggered, reset store/stores in ",(0,a.kt)("inlineCode",{parentName:"li"},"target")," to the initial value.")),(0,a.kt)("h3",{id:"arguments-1"},"Arguments"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("inlineCode",{parentName:"li"},"target: Store<any> | Array<Store<any>>")," \u2014 Each of these stores will be reset to the initial values when ",(0,a.kt)("inlineCode",{parentName:"li"},"resetEvent")," is triggered.")),(0,a.kt)("h3",{id:"returns"},"Returns"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"resetEvent")," ",(0,a.kt)("inlineCode",{parentName:"li"},"(Event<void>)")," \u2014 New event that reset store/stores in ",(0,a.kt)("inlineCode",{parentName:"li"},"target"),".")),(0,a.kt)("h3",{id:"example-1"},"Example"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { createEvent, createStore } from 'effector';\nimport { reset } from 'patronum/reset';\n\nconst $post = createStore(null);\nconst $comments = createStore([]);\nconst $draftComment = createStore('');\n\nconst resetEvent = reset({ target: [$post, $comments, $draftComment] });\n")),(0,a.kt)("h3",{id:"alternative-1"},"Alternative"),(0,a.kt)("p",null,"Write reset event by yourself:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { createEvent, createStore } from 'effector';\nimport { reset } from 'patronum/reset';\n\nconst $post = createStore(null);\nconst $comments = createStore([]);\nconst $draftComment = createStore('');\n\nconst resetEvent = createEvent();\n\nreset({\n  clock: resetEvent,\n  target: [$post, $comments, $draftComment],\n});\n")))}u.isMDXComponent=!0}}]);