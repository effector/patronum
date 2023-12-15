"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[916],{4852:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>v});var r=n(9231);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),m=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=m(e.components);return r.createElement(s.Provider,{value:t},e.children)},d="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=m(n),u=a,v=d["".concat(s,".").concat(u)]||d[u]||p[u]||i;return n?r.createElement(v,o(o({ref:t},c),{},{components:n})):r.createElement(v,o({ref:t},c))}));function v(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=u;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[d]="string"==typeof e?e:a,o[1]=l;for(var m=2;m<i;m++)o[m]=n[m];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},5500:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>p,frontMatter:()=>i,metadata:()=>l,toc:()=>m});var r=n(4011),a=(n(9231),n(4852));const i={},o="combineEvents",l={unversionedId:"combine-events/readme",id:"combine-events/readme",title:"combineEvents",description:"combineEvents(events)",source:"@site/../src/combine-events/readme.md",sourceDirName:"combine-events",slug:"/combine-events/",permalink:"/methods/combine-events/",draft:!1,editUrl:"https://github.com/effector/patronum/tree/main/src/../src/combine-events/readme.md",tags:[],version:"current",frontMatter:{},sidebar:"methodsSidebar",previous:{title:"and",permalink:"/methods/and/"},next:{title:"condition",permalink:"/methods/condition/"}},s={},m=[{value:"<code>combineEvents(events)</code>",id:"combineeventsevents",level:2},{value:"Motivation",id:"motivation",level:3},{value:"Formulae",id:"formulae",level:3},{value:"Arguments",id:"arguments",level:3},{value:"Returns",id:"returns",level:3},{value:"<code>combineEvents({ events, reset, target })</code>",id:"combineevents-events-reset-target-",level:2},{value:"Motivation",id:"motivation-1",level:3},{value:"Formulae",id:"formulae-1",level:3},{value:"Arguments",id:"arguments-1",level:3},{value:"Returns",id:"returns-1",level:3},{value:"Example",id:"example",level:3}],c={toc:m},d="wrapper";function p(e){let{components:t,...n}=e;return(0,a.kt)(d,(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"combineevents"},"combineEvents"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { combineEvents } from 'patronum';\n// or\nimport { combineEvents } from 'patronum/combine-events';\n")),(0,a.kt)("h2",{id:"combineeventsevents"},(0,a.kt)("inlineCode",{parentName:"h2"},"combineEvents(events)")),(0,a.kt)("admonition",{title:"since",type:"note"},(0,a.kt)("p",{parentName:"admonition"},"patronum 2.1.0\nUse ",(0,a.kt)("inlineCode",{parentName:"p"},"combineEvents({ events })")," with patronum < 2.1.0")),(0,a.kt)("h3",{id:"motivation"},"Motivation"),(0,a.kt)("p",null,"Method allows to trigger event when all of given events are triggered, with payloads ov given events"),(0,a.kt)("admonition",{type:"note"},(0,a.kt)("p",{parentName:"admonition"},"Consider using stores with combine in case of lazy-loaded modules, as they could miss some updates happened before module loaded")),(0,a.kt)("h3",{id:"formulae"},"Formulae"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"const target = combineEvents({ key1: event1, key2: event2 });\n")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"When all events are triggered, trigger ",(0,a.kt)("inlineCode",{parentName:"li"},"target")," with ",(0,a.kt)("inlineCode",{parentName:"li"},"{key1: firstPayload, key2: secondPayload}"))),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"const target = combineEvents([event1, event2]);\n")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"When all events are triggered, trigger ",(0,a.kt)("inlineCode",{parentName:"li"},"target")," with ",(0,a.kt)("inlineCode",{parentName:"li"},"[firstPayload, secondPayload]"))),(0,a.kt)("h3",{id:"arguments"},"Arguments"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("inlineCode",{parentName:"li"},"events")," \u2014 Object or array with events")),(0,a.kt)("h3",{id:"returns"},"Returns"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"target")," \u2014 Event with the same shape as ",(0,a.kt)("inlineCode",{parentName:"li"},"events"),", that triggered after all ",(0,a.kt)("inlineCode",{parentName:"li"},"events")," triggered")),(0,a.kt)("h2",{id:"combineevents-events-reset-target-"},(0,a.kt)("inlineCode",{parentName:"h2"},"combineEvents({ events, reset, target })")),(0,a.kt)("h3",{id:"motivation-1"},"Motivation"),(0,a.kt)("p",null,"Object form which allow to pass ",(0,a.kt)("inlineCode",{parentName:"p"},"reset")," unit or ",(0,a.kt)("inlineCode",{parentName:"p"},"target")),(0,a.kt)("h3",{id:"formulae-1"},"Formulae"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"const target = combineEvents({\n  events: {\n    key1: event1,\n    key2: event2,\n  },\n  reset: resetUnit,\n  target: targetUnit,\n});\n")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"When all events are triggered, trigger ",(0,a.kt)("inlineCode",{parentName:"li"},"target")," with ",(0,a.kt)("inlineCode",{parentName:"li"},"{key1: firstPayload, key2: secondPayload}"))),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"const target = combineEvents({\n  events: [event1, event2],\n  reset: resetUnit,\n  target: targetUnit,\n});\n")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"When all events are triggered, trigger ",(0,a.kt)("inlineCode",{parentName:"li"},"target")," with ",(0,a.kt)("inlineCode",{parentName:"li"},"[firstPayload, secondPayload]"))),(0,a.kt)("h3",{id:"arguments-1"},"Arguments"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("inlineCode",{parentName:"li"},"events")," \u2014 Object or array with events"),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("inlineCode",{parentName:"li"},"reset")," ",(0,a.kt)("inlineCode",{parentName:"li"},"(Unit<any>)")," - Optional. Any unit which will reset state of ",(0,a.kt)("inlineCode",{parentName:"li"},"combineEvents")," and collecting of payloads will start from scratch"),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("inlineCode",{parentName:"li"},"target")," ",(0,a.kt)("inlineCode",{parentName:"li"},"(Unit<Shape>)")," - Optional. Any unit with type matching ",(0,a.kt)("inlineCode",{parentName:"li"},"events")," shape")),(0,a.kt)("h3",{id:"returns-1"},"Returns"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"target")," \u2014 When ",(0,a.kt)("inlineCode",{parentName:"li"},"target")," option is not defined, will return new event with the same shape as ",(0,a.kt)("inlineCode",{parentName:"li"},"events"),", otherwise ",(0,a.kt)("inlineCode",{parentName:"li"},"target")," unit will returns")),(0,a.kt)("h3",{id:"example"},"Example"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"const first = createEvent<number>();\nconst second = createEvent<string>();\nconst third = createEvent<boolean>();\nconst target = createEvent<{ a: number; b: string; c: boolean }>();\nconst reset = createEvent();\n\ncombineEvents({\n  events: {\n    a: first,\n    b: second,\n    c: third,\n  },\n  reset,\n  target,\n});\n\ntarget.watch((object) => {\n  console.log('first event data', object.a);\n  console.log('second event data', object.b);\n  console.log('third event data', object.c);\n});\n\nfirst(15); // nothing\nsecond('wow'); // nothing\nthird(false); // target triggered with {a: 15, b: 'wow', c: false}\n\nfirst(10);\nsecond('-');\n\nreset(); // combineEvents state is erased\n\nthird(true); // nothing, as it's a first saved payload\nfirst(0);\nsecond('ok'); // target triggered with {a: 0, b: 'ok', c: true}\n")))}p.isMDXComponent=!0}}]);