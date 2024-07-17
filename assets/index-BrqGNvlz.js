(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))c(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&c(s)}).observe(document,{childList:!0,subtree:!0});function o(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function c(n){if(n.ep)return;n.ep=!0;const r=o(n);fetch(n.href,r)}})();let l=[],i=[];function m(e){g(e).then(t=>u(t)).then(()=>a()).then(()=>y())}function d(e){u(e),a(),f()}function g(e){return new Promise(t=>{const o=new FileReader;o.onload=function(c){t(c.target.result)},o.readAsText(e)})}function a(){l.length!==0&&(l=[]),i.forEach(e=>{const t=e.match(/\b[0-6]\b/g),o=[...new Set(t)];l.push(o)}),l.length>24&&(l=l.slice(0,24))}function u(e){i.length!==0&&(i=[]),e.split(`
`).forEach(o=>{i.push(o)})}function y(){if(document.querySelector("#create-table"))return;const e=document.createElement("button");e.textContent="Create Table",e.addEventListener("click",()=>{f()}),e.id="create-table",document.querySelector("#app").appendChild(e)}function h(e){b(e);const t=e.rows[0];t.insertCell();for(let o=1;o<7;o++){const c=t.insertCell(),n=document.createElement("span");n.textContent=`${o} черга`,c.appendChild(n),c.classList.add("queue-cell")}}function f(){const e=document.querySelector("#blackouts-order-table");console.log(l);for(let t=1;t<=24;t++)e.rows[t],E(e,l,t)}function E(e,t,o){let c=0;for(let n=0;n<6;n++){let r=e.rows[o][n];r||(r=e.rows[o].insertCell());const s=t[o-1][c]===(n+1).toString();r.style.background=s?"sandybrown":"",r.style.border="1px solid dimgray",s&&c++}}function b(e){e.insertRow();for(let t=1;t<=24;t++){const c=e.insertRow().insertCell();let n=`${t-1}:00 - `.padStart(8,"0");n+=`${t}:00`.padStart(5,"0");const r=document.createElement("span");r.textContent=n,r.style.width="max-content",c.appendChild(r),c.style.textAlign="center",c.classList.add("hour-cell")}}async function x(){}const p=[`■ 00:00-01:00  1, 4 та 5 черги
■ 01:00-02:00  1, 4 та 5 черги
■ 02:00-03:00  2, 3 та 6 черги
■ 03:00-04:00  2, 3 та 6 черги
■ 04:00-05:00  1, 4 та 5 черги
■ 05:00-06:00  1, 4 та 5 черги
■ 06:00-07:00  2, 3 та 6 черги
■ 07:00-08:00  2 та 3 черги
■ 08:00-09:00  4 та 5 черги
■ 09:00-10:00  4 та 5 черги
■ 10:00-11:00  6 та 1 черги
■ 11:00-12:00  6 та 1 черги
■ 12:00-13:00  2 та 3 черги
■ 13:00-14:00  2 та 3 черги
■ 14:00-15:00  4 та 5 черги
■ 15:00-16:00  4, 5 та 6 черги
■ 16:00-17:00  6, 1 та 2 черги
■ 17:00-18:00  1, 2 та 3 черги
■ 18:00-19:00  3, 4 та 5 черги
■ 19:00-20:00  4, 5 та 6 черги
■ 20:00-21:00  6, 1 та 2 черги
■ 21:00-22:00  1, 2 та 3 черги
■ 22:00-23:00  3, 4 та 5 черги
■ 23:00-24:00  4, 5 та 6 черги`,"13.07.2024 at 18:50"],w=p[0],C=p[1];document.getElementById("fileInput").addEventListener("input",function(e){const t=e.target.files[0];t&&m(t)});document.getElementById("submit-text-schedule").addEventListener("click",()=>{const e=document.getElementById("input-text-schedule");d(e.value)});document.getElementById("predefined-last-update").textContent="Last update: "+C;document.getElementById("load-predefined").addEventListener("click",()=>{d(w)});document.getElementById("load-from-tg-channel").addEventListener("click",x);h(document.getElementById("blackouts-order-table"));document.getElementById("load-predefined").click();
