"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[299],{4852:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>k});var n=a(9231);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=n.createContext({}),m=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},p=function(e){var t=m(e.components);return n.createElement(s.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},c=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,s=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),u=m(a),c=r,k=u["".concat(s,".").concat(c)]||u[c]||d[c]||l;return a?n.createElement(k,i(i({ref:t},p),{},{components:a})):n.createElement(k,i({ref:t},p))}));function k(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,i=new Array(l);i[0]=c;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o[u]="string"==typeof e?e:r,i[1]=o;for(var m=2;m<l;m++)i[m]=a[m];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}c.displayName="MDXCreateElement"},637:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>d,frontMatter:()=>l,metadata:()=>o,toc:()=>m});var n=a(4011),r=(a(9231),a(4852));const l={},i="some",o={unversionedId:"some/readme",id:"some/readme",title:"some",description:"some({ predicate: Function, stores })",source:"@site/../src/some/readme.md",sourceDirName:"some",slug:"/some/",permalink:"/methods/some/",draft:!1,editUrl:"https://github.com/effector/patronum/tree/main/src/../src/some/readme.md",tags:[],version:"current",frontMatter:{},sidebar:"methodsSidebar",previous:{title:"snapshot",permalink:"/methods/snapshot/"},next:{title:"splitMap",permalink:"/methods/split-map/"}},s={},m=[{value:"<code>some({ predicate: Function, stores })</code>",id:"some-predicate-function-stores-",level:2},{value:"Motivation",id:"motivation",level:3},{value:"Formulae",id:"formulae",level:3},{value:"Arguments",id:"arguments",level:3},{value:"Return",id:"return",level:3},{value:"Example",id:"example",level:3},{value:"<code>some({ predicate: value, stores })</code>",id:"some-predicate-value-stores-",level:2},{value:"Motivation",id:"motivation-1",level:3},{value:"Formulae",id:"formulae-1",level:3},{value:"Arguments",id:"arguments-1",level:3},{value:"Return",id:"return-1",level:3},{value:"Example",id:"example-1",level:3},{value:"<code>some({ predicate: Store, stores })</code>",id:"some-predicate-store-stores-",level:2},{value:"Motivation",id:"motivation-2",level:3},{value:"Formulae",id:"formulae-2",level:3},{value:"Arguments",id:"arguments-2",level:3},{value:"Return",id:"return-2",level:3},{value:"Example",id:"example-2",level:3},{value:"Shorthands",id:"shorthands",level:2},{value:"Arguments",id:"arguments-3",level:3}],p={toc:m},u="wrapper";function d(e){let{components:t,...a}=e;return(0,r.kt)(u,(0,n.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"some"},"some"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { some } from 'patronum';\n// or\nimport { some } from 'patronum/some';\n")),(0,r.kt)("h2",{id:"some-predicate-function-stores-"},(0,r.kt)("inlineCode",{parentName:"h2"},"some({ predicate: Function, stores })")),(0,r.kt)("h3",{id:"motivation"},"Motivation"),(0,r.kt)("p",null,"Method calculates boolean value if at least one state of the store satisfies the condition in ",(0,r.kt)("inlineCode",{parentName:"p"},"predicate"),".\nIt is useful to check that user filled at least a single field."),(0,r.kt)("h3",{id:"formulae"},"Formulae"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"$result = some({ predicate: (value) => true, stores });\n")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"read it as: has some predicate at at least one store"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"$result")," will be ",(0,r.kt)("inlineCode",{parentName:"li"},"true")," if each at least ",(0,r.kt)("inlineCode",{parentName:"li"},"predicate")," on each store value from ",(0,r.kt)("inlineCode",{parentName:"li"},"values")," returns ",(0,r.kt)("inlineCode",{parentName:"li"},"true"),", otherwise it will be ",(0,r.kt)("inlineCode",{parentName:"li"},"false"))),(0,r.kt)("h3",{id:"arguments"},"Arguments"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("inlineCode",{parentName:"li"},"predicate")," ",(0,r.kt)("inlineCode",{parentName:"li"},"((value: T) => boolean)")," \u2014 Function to check store value"),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("inlineCode",{parentName:"li"},"stores")," ",(0,r.kt)("inlineCode",{parentName:"li"},"(Array<Store<T>>)")," \u2014 List of stores")),(0,r.kt)("h3",{id:"return"},"Return"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"$result")," ",(0,r.kt)("inlineCode",{parentName:"li"},"(Store<boolean>)")," \u2014 ",(0,r.kt)("inlineCode",{parentName:"li"},"true")," if at least one store corresponds to ",(0,r.kt)("inlineCode",{parentName:"li"},"predicate"))),(0,r.kt)("h3",{id:"example"},"Example"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const $width = createStore(440);\nconst $height = createStore(820);\n\nconst $tooBig = some({\n  predicate: (size) => size > 800,\n  stores: [$width, $height],\n});\n\nconsole.assert(true === $tooBig.getState());\n")),(0,r.kt)("h2",{id:"some-predicate-value-stores-"},(0,r.kt)("inlineCode",{parentName:"h2"},"some({ predicate: value, stores })")),(0,r.kt)("h3",{id:"motivation-1"},"Motivation"),(0,r.kt)("p",null,"This overload compares each store to specific value in ",(0,r.kt)("inlineCode",{parentName:"p"},"predicate"),".\nIt is useful when you write ",(0,r.kt)("inlineCode",{parentName:"p"},"combine")," with ",(0,r.kt)("inlineCode",{parentName:"p"},"||")," very often, for example to create an invalid form flag."),(0,r.kt)("h3",{id:"formulae-1"},"Formulae"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"$result = some({ predicate: value, stores });\n")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"$result")," will be ",(0,r.kt)("inlineCode",{parentName:"li"},"true")," if at least one value in ",(0,r.kt)("inlineCode",{parentName:"li"},"stores")," equals ",(0,r.kt)("inlineCode",{parentName:"li"},"value"),", otherwise it will be ",(0,r.kt)("inlineCode",{parentName:"li"},"false"))),(0,r.kt)("h3",{id:"arguments-1"},"Arguments"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("inlineCode",{parentName:"li"},"predicate")," ",(0,r.kt)("inlineCode",{parentName:"li"},"(T)")," \u2014 Data to compare stores values with"),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("inlineCode",{parentName:"li"},"stores")," ",(0,r.kt)("inlineCode",{parentName:"li"},"(Array<Store<T>>)")," \u2014 List of stores to compare with ",(0,r.kt)("inlineCode",{parentName:"li"},"value")),(0,r.kt)("li",{parentName:"ol"},"type of ",(0,r.kt)("inlineCode",{parentName:"li"},"predicate")," and ",(0,r.kt)("inlineCode",{parentName:"li"},"stores")," should should be the same")),(0,r.kt)("h3",{id:"return-1"},"Return"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"$result")," ",(0,r.kt)("inlineCode",{parentName:"li"},"(Store<boolean>)")," \u2014 ",(0,r.kt)("inlineCode",{parentName:"li"},"true")," if at least one store contains ",(0,r.kt)("inlineCode",{parentName:"li"},"value"))),(0,r.kt)("h3",{id:"example-1"},"Example"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const $isPasswordCorrect = createStore(true);\nconst $isEmailCorrect = createStore(true);\n\nconst $isFormFailed = some({\n  predicate: false,\n  stores: [$isPasswordCorrect, $isEmailCorrect],\n});\n\nconsole.assert(false === $isFormFailed.getState());\n")),(0,r.kt)("h2",{id:"some-predicate-store-stores-"},(0,r.kt)("inlineCode",{parentName:"h2"},"some({ predicate: Store, stores })")),(0,r.kt)("admonition",{title:"since",type:"note"},(0,r.kt)("p",{parentName:"admonition"},"patronum 1.8.0")),(0,r.kt)("h3",{id:"motivation-2"},"Motivation"),(0,r.kt)("p",null,"This overload compares each store to specific value in store ",(0,r.kt)("inlineCode",{parentName:"p"},"predicate"),".\nIt is useful when you write ",(0,r.kt)("inlineCode",{parentName:"p"},"combine")," with ",(0,r.kt)("inlineCode",{parentName:"p"},"||")," very often, for example to create an invalid form flag."),(0,r.kt)("h3",{id:"formulae-2"},"Formulae"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"$result = some({ predicate: $value, stores });\n")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"$result")," will be ",(0,r.kt)("inlineCode",{parentName:"li"},"true")," if at least one value in ",(0,r.kt)("inlineCode",{parentName:"li"},"stores")," equals value in ",(0,r.kt)("inlineCode",{parentName:"li"},"$value"),", otherwise it will be ",(0,r.kt)("inlineCode",{parentName:"li"},"false"))),(0,r.kt)("h3",{id:"arguments-2"},"Arguments"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("inlineCode",{parentName:"li"},"predicate")," ",(0,r.kt)("inlineCode",{parentName:"li"},"(Store<T>)")," \u2014 Store contains value to compare values from ",(0,r.kt)("inlineCode",{parentName:"li"},"stores")," with"),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("inlineCode",{parentName:"li"},"stores")," ",(0,r.kt)("inlineCode",{parentName:"li"},"(Array<Store<T>>)")," \u2014 List of stores to compare with ",(0,r.kt)("inlineCode",{parentName:"li"},"value")),(0,r.kt)("li",{parentName:"ol"},"type of ",(0,r.kt)("inlineCode",{parentName:"li"},"value")," and ",(0,r.kt)("inlineCode",{parentName:"li"},"stores")," should be the same")),(0,r.kt)("h3",{id:"return-2"},"Return"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"$result")," ",(0,r.kt)("inlineCode",{parentName:"li"},"(Store<boolean>)")," \u2014 ",(0,r.kt)("inlineCode",{parentName:"li"},"true")," if at least one store contains ",(0,r.kt)("inlineCode",{parentName:"li"},"value"))),(0,r.kt)("h3",{id:"example-2"},"Example"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const $allowToCompare = createStore(true);\n\nconst $isPasswordCorrect = createStore(true);\nconst $isEmailCorrect = createStore(true);\n\nconst $isFormFailed = some({\n  predicate: $allowToCompare,\n  stores: [$isPasswordCorrect, $isEmailCorrect],\n});\n\nconsole.assert(false === $isFormFailed.getState());\n")),(0,r.kt)("h2",{id:"shorthands"},"Shorthands"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"$result = some(stores, value);\n$result = some(stores, (value) => false);\n$result = some(stores, $predicate);\n")),(0,r.kt)("p",null,"Shorthand have the same rules as the main overrides, just it uses positional arguments instead of object-form."),(0,r.kt)("h3",{id:"arguments-3"},"Arguments"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("inlineCode",{parentName:"li"},"stores")," ",(0,r.kt)("inlineCode",{parentName:"li"},"(Array<Store<T>>)")," \u2014 List of stores to compare with predicate in the second argument"),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("inlineCode",{parentName:"li"},"predicate")," ",(0,r.kt)("inlineCode",{parentName:"li"},"(Store<T> | (value: T) => boolean | T)")," \u2014 Predicate to compare with")))}d.isMDXComponent=!0}}]);