import{a as C,r as l,j as t,S as o,k as M,B as c,F as H,i as x,h as R,X as L}from"./index-5cIiE1CS.js";const D=({isOpen:s,onClose:n,title:y,subtitle:a,children:p,size:u="md",variant:f="default",showCloseButton:m=!0,closeOnOverlay:d=!0,footer:i,className:g="",style:h})=>{const{colors:e}=C();if(l.useEffect(()=>{const r=B=>{B.key==="Escape"&&s&&n()};return document.addEventListener("keydown",r),()=>document.removeEventListener("keydown",r)},[s,n]),l.useEffect(()=>(s&&(document.body.style.overflow="hidden"),()=>{document.body.style.overflow="unset"}),[s]),!s)return null;const b={sm:{maxWidth:400},md:{maxWidth:560},lg:{maxWidth:720},xl:{maxWidth:900},full:{maxWidth:"calc(100vw - 48px)",width:"100%"}},S=()=>{switch(f){case"danger":return{borderTop:`3px solid ${e.danger}`};case"success":return{borderTop:`3px solid ${e.success}`};default:return{borderTop:`3px solid ${e.primary}`}}},k={position:"fixed",inset:0,zIndex:1e3,display:"flex",alignItems:"center",justifyContent:"center",padding:o.xxl,animation:"modalFadeIn 0.2s ease forwards"},v={position:"absolute",inset:0,background:"rgba(0, 0, 0, 0.6)",backdropFilter:"blur(4px)",cursor:d?"pointer":"default",animation:"backdropFadeIn 0.2s ease forwards"},j={position:"relative",width:"100%",...b[u],maxHeight:"calc(100vh - 48px)",background:e.card,borderRadius:c.xxl,border:`1px solid ${e.border}`,boxShadow:M.cardElevated,overflow:"hidden",display:"flex",flexDirection:"column",animation:"modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",...S(),...h},w={display:"flex",alignItems:"flex-start",justifyContent:"space-between",padding:`${o.xxl}px ${o.xxl}px ${o.lg}px`,borderBottom:`1px solid ${e.border}`,gap:o.md},$={flex:1,minWidth:0},I={fontSize:x.xxl,fontWeight:H.semibold,color:e.text,fontFamily:"'DM Sans', sans-serif",margin:0,lineHeight:1.3},T={fontSize:x.sm,color:e.textSecondary,marginTop:o.xs,lineHeight:1.4},E={width:32,height:32,borderRadius:c.lg,border:"none",background:e.bgSecondary,color:e.textSecondary,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:R.fast},F={padding:`${o.lg}px ${o.xxl}px`,overflowY:"auto",flex:1,minHeight:0},W={display:"flex",alignItems:"center",justifyContent:"flex-end",gap:o.sm,padding:`${o.lg}px ${o.xxl}px`,borderTop:`1px solid ${e.border}`,background:e.bgSecondary,flexShrink:0},z=()=>{d&&n()};return t.jsxs("div",{style:k,className:g,children:[t.jsx("div",{style:v,onClick:z}),t.jsxs("div",{style:j,children:[t.jsxs("div",{style:w,children:[t.jsxs("div",{style:$,children:[t.jsx("h2",{style:I,children:y}),a&&t.jsx("div",{style:T,children:a})]}),m&&t.jsx("button",{onClick:n,style:E,onMouseEnter:r=>{r.currentTarget.style.background=e.border,r.currentTarget.style.color=e.text},onMouseLeave:r=>{r.currentTarget.style.background=e.bgSecondary,r.currentTarget.style.color=e.textSecondary},children:t.jsx(L,{size:18})})]}),t.jsx("div",{style:F,children:p}),i&&t.jsx("div",{style:W,children:i})]}),t.jsx("style",{children:`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes backdropFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `})]})};export{D as M};
