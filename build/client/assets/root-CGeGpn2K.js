import{r as i,j as t}from"./jsx-runtime-56DGgGmo.js";import{u as m,w as p,x,y as f,_ as w,O as S,M as j,L as g,S as M}from"./components-BorkvSAm.js";/**
 * @remix-run/react v2.9.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */let a="positions";function k({getKey:e,...l}){let{isSpaMode:c}=m(),o=p(),u=x();f({getKey:e,storageKey:a});let d=i.useMemo(()=>{if(!e)return null;let s=e(o,u);return s!==o.key?s:null},[]);if(c)return null;let y=((s,h)=>{if(!window.history.state||!window.history.state.key){let r=Math.random().toString(32).slice(2);window.history.replaceState({key:r},"")}try{let n=JSON.parse(sessionStorage.getItem(s)||"{}")[h||window.history.state.key];typeof n=="number"&&window.scrollTo(0,n)}catch(r){console.error(r),sessionStorage.removeItem(s)}}).toString();return i.createElement("script",w({},l,{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:`(${y})(${JSON.stringify(a)}, ${JSON.stringify(d)})`}}))}const L="/assets/tailwind-fNCE5DMw.css";function N({children:e}){return t.jsxs("html",{lang:"en",children:[t.jsxs("head",{children:[t.jsx("meta",{charSet:"utf-8"}),t.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),t.jsx(j,{}),t.jsx(g,{})]}),t.jsxs("body",{children:[e,t.jsx(k,{}),t.jsx(M,{})]})]})}function R(){return t.jsx(S,{})}const _=()=>[{rel:"stylesheet",href:L}];export{N as Layout,R as default,_ as links};
