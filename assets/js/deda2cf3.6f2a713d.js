"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[493],{4852:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>k});var o=n(9231);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,o,a=function(e,t){if(null==e)return{};var n,o,a={},r=Object.keys(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var u=o.createContext({}),m=function(e){var t=o.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=m(e.components);return o.createElement(u.Provider,{value:t},e.children)},p="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},s=o.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,u=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),p=m(n),s=a,k=p["".concat(u,".").concat(s)]||p[s]||c[s]||r;return n?o.createElement(k,i(i({ref:t},d),{},{components:n})):o.createElement(k,i({ref:t},d))}));function k(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,i=new Array(r);i[0]=s;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l[p]="string"==typeof e?e:a,i[1]=l;for(var m=2;m<r;m++)i[m]=n[m];return o.createElement.apply(null,i)}return o.createElement.apply(null,n)}s.displayName="MDXCreateElement"},185:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>c,frontMatter:()=>r,metadata:()=>l,toc:()=>m});var o=n(4011),a=(n(9231),n(4852));const r={},i="debounce",l={unversionedId:"debounce/readme",id:"debounce/readme",title:"debounce",description:"debounce(source, timeout)",source:"@site/../src/debounce/readme.md",sourceDirName:"debounce",slug:"/debounce/",permalink:"/methods/debounce/",draft:!1,editUrl:"https://github.com/effector/patronum/tree/main/src/../src/debounce/readme.md",tags:[],version:"current",frontMatter:{},sidebar:"methodsSidebar",previous:{title:"condition",permalink:"/methods/condition/"},next:{title:"debug",permalink:"/methods/debug/"}},u={},m=[{value:"<code>debounce(source, timeout)</code>",id:"debouncesource-timeout",level:2},{value:"Motivation",id:"motivation",level:3},{value:"Formulae",id:"formulae",level:3},{value:"Arguments",id:"arguments",level:3},{value:"Returns",id:"returns",level:3},{value:"Example",id:"example",level:3},{value:"Example with timeout as store",id:"example-with-timeout-as-store",level:3},{value:"<code>debounce({ source, timeout, target })</code>",id:"debounce-source-timeout-target-",level:2},{value:"Motivation",id:"motivation-1",level:3},{value:"Formulae",id:"formulae-1",level:3},{value:"Arguments",id:"arguments-1",level:3},{value:"Returns",id:"returns-1",level:3},{value:"Example",id:"example-1",level:3},{value:"<code>debounce({ source, timeout })</code>",id:"debounce-source-timeout-",level:2},{value:"Motivation",id:"motivation-2",level:3},{value:"Formulae",id:"formulae-2",level:3},{value:"Arguments",id:"arguments-2",level:3},{value:"Returns",id:"returns-2",level:3},{value:"Example",id:"example-2",level:3}],d={toc:m},p="wrapper";function c(e){let{components:t,...n}=e;return(0,a.kt)(p,(0,o.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"debounce"},"debounce"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { debounce } from 'patronum';\n// or\nimport { debounce } from 'patronum/debounce';\n")),(0,a.kt)("h2",{id:"debouncesource-timeout"},(0,a.kt)("inlineCode",{parentName:"h2"},"debounce(source, timeout)")),(0,a.kt)("h3",{id:"motivation"},"Motivation"),(0,a.kt)("p",null,"Method creates a new event, that will be triggered after some time. It is useful for handling user events such as scrolling, mouse movement, or keypressing.\nIt is useful when you want to pass created event immediately to another method as argument."),(0,a.kt)("admonition",{title:"since",type:"note"},(0,a.kt)("p",{parentName:"admonition"},"patronum 2.1.0\nUse ",(0,a.kt)("inlineCode",{parentName:"p"},"debounce({ source, timeout })")," with patronum < 2.1.0")),(0,a.kt)("h3",{id:"formulae"},"Formulae"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"event = debounce(source, timeout);\n")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Wait for ",(0,a.kt)("inlineCode",{parentName:"li"},"timeout")," after the last time ",(0,a.kt)("inlineCode",{parentName:"li"},"source")," was triggered, then trigger ",(0,a.kt)("inlineCode",{parentName:"li"},"event")," with payload of the ",(0,a.kt)("inlineCode",{parentName:"li"},"source"))),(0,a.kt)("h3",{id:"arguments"},"Arguments"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("inlineCode",{parentName:"li"},"source")," ",(0,a.kt)("inlineCode",{parentName:"li"},"(Event<T>")," | ",(0,a.kt)("inlineCode",{parentName:"li"},"Store<T>")," | ",(0,a.kt)("inlineCode",{parentName:"li"},"Effect<T>)")," \u2014 Source unit, data from this unit used by the ",(0,a.kt)("inlineCode",{parentName:"li"},"event")),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("inlineCode",{parentName:"li"},"timeout")," ",(0,a.kt)("inlineCode",{parentName:"li"},"(number | Store<number>)")," \u2014 time to wait before trigger ",(0,a.kt)("inlineCode",{parentName:"li"},"event"))),(0,a.kt)("h3",{id:"returns"},"Returns"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"event")," ",(0,a.kt)("inlineCode",{parentName:"li"},"(Event<T>)")," \u2014 New event, that triggered after delay")),(0,a.kt)("h3",{id:"example"},"Example"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { createEvent } from 'effector';\nimport { debounce } from 'patronum/debounce';\n\nconst DEBOUNCE_TIMEOUT_IN_MS = 200;\n\nconst someHappened = createEvent<number>();\nconst debounced = debounce(someHappened, DEBOUNCE_TIMEOUT_IN_MS);\n\ndebounced.watch((payload) => {\n  console.info('someHappened now', payload);\n});\n\nsomeHappened(1);\nsomeHappened(2);\nsomeHappened(3);\nsomeHappened(4);\n\n// someHappened now 4\n")),(0,a.kt)("h3",{id:"example-with-timeout-as-store"},"Example with timeout as store"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { createStore } from 'effector';\nimport { debounce } from 'patronum';\n\nconst DEBOUNCE_TIMEOUT_IN_MS = 200;\n\nconst changeTimeout = createEvent<number>();\nconst $timeout = createStore(DEBOUNCE_TIMEOUT_IN_MS).on(\n  changeTimeout,\n  (_, value) => value,\n);\nconst someHappened = createEvent<number>();\nconst debounced = debounce(someHappened, $timeout);\n\ndebounced.watch((payload) => {\n  console.info('someHappened now', payload);\n});\n\nsomeHappened(1);\nchangeTimeout(400); // will be applied after next source trigger\nsomeHappened(2);\n\nsetTimeout(() => {\n  // console clear\n}, 200);\n\nsetTimeout(() => {\n  // someHappened now 2\n}, 400);\n")),(0,a.kt)("h2",{id:"debounce-source-timeout-target-"},(0,a.kt)("inlineCode",{parentName:"h2"},"debounce({ source, timeout, target })")),(0,a.kt)("h3",{id:"motivation-1"},"Motivation"),(0,a.kt)("p",null,"This overload receives target as argument, that will be triggered after timeout.\nIt is useful when you already have an unit that you need to trigger."),(0,a.kt)("h3",{id:"formulae-1"},"Formulae"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"event = debounce({ source, timeout, target });\n")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Wait for ",(0,a.kt)("inlineCode",{parentName:"li"},"timeout")," after the last time ",(0,a.kt)("inlineCode",{parentName:"li"},"source")," was triggered and call ",(0,a.kt)("inlineCode",{parentName:"li"},"target")," with data from the ",(0,a.kt)("inlineCode",{parentName:"li"},"source"))),(0,a.kt)("h3",{id:"arguments-1"},"Arguments"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("inlineCode",{parentName:"li"},"source")," ",(0,a.kt)("inlineCode",{parentName:"li"},"(Event<T>")," | ",(0,a.kt)("inlineCode",{parentName:"li"},"Store<T>")," | ",(0,a.kt)("inlineCode",{parentName:"li"},"Effect<T>)")," \u2014 Source unit, data from this unit used to trigger ",(0,a.kt)("inlineCode",{parentName:"li"},"target")," with payload of the ",(0,a.kt)("inlineCode",{parentName:"li"},"source")),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("inlineCode",{parentName:"li"},"timeout")," ",(0,a.kt)("inlineCode",{parentName:"li"},"(number | Store<number>)")," \u2014 time to wait before trigger ",(0,a.kt)("inlineCode",{parentName:"li"},"event")),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("inlineCode",{parentName:"li"},"target")," ",(0,a.kt)("inlineCode",{parentName:"li"},"(Event<T>")," | ",(0,a.kt)("inlineCode",{parentName:"li"},"Store<T>")," | ",(0,a.kt)("inlineCode",{parentName:"li"},"Effect<T>)")," \u2014 Target unit, data from the ",(0,a.kt)("inlineCode",{parentName:"li"},"source")," will be passed to this unit")),(0,a.kt)("h3",{id:"returns-1"},"Returns"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"target")," ",(0,a.kt)("inlineCode",{parentName:"li"},"(Event<T>")," | ",(0,a.kt)("inlineCode",{parentName:"li"},"Store<T>")," | ",(0,a.kt)("inlineCode",{parentName:"li"},"Effect<T>)")," \u2014 Target unit that was passed to input argument ",(0,a.kt)("inlineCode",{parentName:"li"},"target"))),(0,a.kt)("h3",{id:"example-1"},"Example"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { createEvent, createStore } from 'effector';\nimport { debounce } from 'patronum/debounce';\n\nconst DEBOUNCE_TIMEOUT_IN_MS = 200;\n\nconst someHappened = createEvent<number>();\nconst target = createStore<number>(0);\nconst debounced = debounce({\n  source: someHappened,\n  timeout: DEBOUNCE_TIMEOUT_IN_MS,\n  target,\n});\n\ndebounced.watch((payload) => {\n  console.info('someHappened now', payload);\n});\n\ntarget.watch((payload) => {\n  console.info('got data', payload);\n});\n\nsomeHappened(1);\nsomeHappened(2);\nsomeHappened(3);\nsomeHappened(4);\n\n// someHappened now 4\n// got data 4\n")),(0,a.kt)("h2",{id:"debounce-source-timeout-"},(0,a.kt)("inlineCode",{parentName:"h2"},"debounce({ source, timeout })")),(0,a.kt)("h3",{id:"motivation-2"},"Motivation"),(0,a.kt)("p",null,"This overload recieves ",(0,a.kt)("inlineCode",{parentName:"p"},"source")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"timeout")," as an object. May be useful for additional clarity, but it's longer to write"),(0,a.kt)("h3",{id:"formulae-2"},"Formulae"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"event = debounce({ source, timeout });\n")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Wait for ",(0,a.kt)("inlineCode",{parentName:"li"},"timeout")," after the last time ",(0,a.kt)("inlineCode",{parentName:"li"},"source")," was triggered, then trigger ",(0,a.kt)("inlineCode",{parentName:"li"},"event")," with payload of the ",(0,a.kt)("inlineCode",{parentName:"li"},"source"))),(0,a.kt)("h3",{id:"arguments-2"},"Arguments"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("inlineCode",{parentName:"li"},"source")," ",(0,a.kt)("inlineCode",{parentName:"li"},"(Event<T>")," | ",(0,a.kt)("inlineCode",{parentName:"li"},"Store<T>")," | ",(0,a.kt)("inlineCode",{parentName:"li"},"Effect<T>)")," \u2014 Source unit, data from this unit used by the ",(0,a.kt)("inlineCode",{parentName:"li"},"event")),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("inlineCode",{parentName:"li"},"timeout")," ",(0,a.kt)("inlineCode",{parentName:"li"},"(number | Store<number>)")," \u2014 time to wait before trigger ",(0,a.kt)("inlineCode",{parentName:"li"},"event"))),(0,a.kt)("h3",{id:"returns-2"},"Returns"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"event")," ",(0,a.kt)("inlineCode",{parentName:"li"},"(Event<T>)")," \u2014 New event, that triggered after delay")),(0,a.kt)("h3",{id:"example-2"},"Example"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { createEvent } from 'effector';\nimport { debounce } from 'patronum/debounce';\n\nconst DEBOUNCE_TIMEOUT_IN_MS = 200;\n\nconst someHappened = createEvent<number>();\nconst debounced = debounce({\n  source: someHappened,\n  timeout: DEBOUNCE_TIMEOUT_IN_MS,\n});\n\ndebounced.watch((payload) => {\n  console.info('someHappened now', payload);\n});\n\nsomeHappened(1);\nsomeHappened(2);\nsomeHappened(3);\nsomeHappened(4);\n\n// someHappened now 4\n")))}c.isMDXComponent=!0}}]);