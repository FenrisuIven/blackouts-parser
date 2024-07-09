(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))c(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&c(s)}).observe(document,{childList:!0,subtree:!0});function r(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function c(n){if(n.ep)return;n.ep=!0;const o=r(n);fetch(n.href,o)}})();function p(e){g(e);for(let t=1;t<7;t++){const c=e.insertRow().insertCell(),n=document.createElement("span");n.textContent=`${t} черга`,c.appendChild(n),c.classList.add("queue-cell")}}function d(){const e=document.querySelector("#blackouts-order-table");for(let t=1;t<7;t++){const r=e.rows[t];m(r,l,t)}}function m(e,t,r){t.forEach(c=>{let n=e.children[t.indexOf(c)+1];n||(n=e.insertCell());const o=c.includes(r.toString());n.style.background=o?"salmon":"lightgray"})}function g(e){const t=e.insertRow();t.insertCell();for(let r=1;r<=24;r++){const c=t.insertCell();let n=`${r-1}:00 - `.padStart(8,"0");n+=`${r}:00`.padStart(5,"0");const o=document.createElement("span");o.textContent=n,c.appendChild(o)}}let l=[],i=[];function h(e){b(e).then(t=>f(t)).then(()=>u()).then(()=>E())}function y(e){f(e),u(),d()}function b(e){return new Promise(t=>{const r=new FileReader;r.onload=function(c){t(c.target.result)},r.readAsText(e)})}function u(){l.length!==0&&(l=[]),i.forEach(e=>{l.push(e.match(/\b\d\b/g))}),console.log(l)}function f(e){i.length!==0&&(i=[]),e.split(`
`).forEach(r=>{i.push(r)})}function E(){if(document.querySelector("#create-table"))return;const e=document.createElement("button");e.textContent="Create Table",e.addEventListener("click",()=>{d()}),e.id="create-table",document.querySelector("#app").appendChild(e)}async function C(){}const a=`■ 00:00-01:00  5, 6 та 1 черги
■ 01:00-02:00  6, 1 та 2 черги
■ 02:00-03:00  2, 3 та 4 черги
■ 03:00-04:00  3, 4 та 5 черги
■ 04:00-05:00  5, 6 та 1 черги
■ 05:00-06:00  6 та 1 черги
■ 06:00-07:00  2 та 3 черги
■ 07:00-08:00  2 та 3 черги
■ 08:00-09:00  4 та 5 черги
■ 09:00-10:00  4 та 5 черги
■ 10:00-11:00  6 та 1 черги
■ 11:00-12:00  6 та 1 черги
■ 12:00-13:00  2 та 3 черги
■ 13:00-14:00  2 та 3 черги
■ 14:00-15:00  5 та 6 черги
■ 15:00-16:00  4, 5 та 6 черги
■ 16:00-17:00  1 та 2 черги
■ 17:00-18:00  1 та 2 черги
■ 18:00-19:00  4 та 5 черги
■ 19:00-20:00  4, 6 та 1 черги
■ 20:00-21:00  6, 2 та 3 черги
■ 21:00-22:00  6, 2, 3 та 4 черги
■ 22:00-23:00  1, 4 та 5 черги
■ 23:00-24:00  5, 6 та 1 черги`,L="09.07.2024 at 20:10";document.getElementById("fileInput").addEventListener("input",function(e){const t=e.target.files[0];t&&h(t)});document.getElementById("predefined-last-update").textContent="Last update: "+L;document.getElementById("load-predefined").addEventListener("click",()=>{console.log(a),y(a)});document.getElementById("load-from-tg-channel").addEventListener("click",C);p(document.getElementById("blackouts-order-table"));
