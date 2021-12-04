(()=>{"use strict";var t={17:(t,e,n)=>{Object.defineProperty(e,"__esModule",{value:!0});const s=n(847);function r(t,e){return t.name>e.name?1:t.name<e.name?-1:0}function a(t,e){return t.dist&&e.dist?t.dist>e.dist?1:t.dist<e.dist?-1:r(t,e):r(t,e)}function i(t,e){let n=!1;const s=t.replace(e,(t=>(n=t.length>0,`<mark>${t}</mark>`)));return n?s:null}e.default=class{constructor(){this.all=[],this.blockLabels={},this.blockPrefabIndex={},this.filter=null,this.filtered=[],this.markCoords=null,this.status="",this.throttledUpdater=(0,s.throttledInvoker)((async()=>this.updateImmediately())),this.updateListeners=[]}update(){this.throttledUpdater()}updateImmediately(){this.applyFilter(),this.updateDist(),this.sort();const t={status:this.status,prefabs:this.filtered};this.updateListeners.forEach((e=>e(t)))}set prefabsFilterString(t){const e=t.trim();0===e.length?this.filter=null:this.filter=new o(new RegExp(e,"i"))}set blocksFilterString(t){const e=t.trim();0===e.length?this.filter=null:this.filter=new l(new RegExp(e,"i"),this.blockPrefabIndex,this.blockLabels)}addUpdateListener(t){this.updateListeners.push(t)}applyFilter(){if(this.filter){const t=this.filter.match(this.all);this.status=t.status,this.filtered=t.matched}else 0===this.all.length?(this.status="No prefabs",this.filtered=[]):(this.status="All prefabs",this.filtered=this.all)}updateDist(){if(this.markCoords){const{markCoords:t}=this;this.filtered.forEach((e=>{return e.dist=(n=e,s=t,Math.round(Math.sqrt((n.x-s.x)**2+(n.z-s.z)**2)));var n,s}))}else this.filtered.forEach((t=>t.dist=null))}sort(){this.markCoords?(this.status=`${this.status}, order by distances from the flag`,this.filtered.sort(a)):this.filtered.sort(r)}};class o{constructor(t){this.regexp=t}match(t){const e=t.flatMap((t=>{const e=i(t.name,this.regexp);return e?{...t,highlightedName:e}:[]}));return{status:`${e.length} matched prefabs`,matched:e}}}class l{constructor(t,e,n){this.regexp=t,this.blockPrefabIndex=e,this.blockLabels=n}match(t){const e=this.matchBlocks();if(0===e.length)return{status:"No matched blocks",matched:[]};const n=this.matchPrefabTypes(e);if(0===Object.keys(n).length)return{status:`No prefabs, ${e.length} matched blocks`,matched:[]};const s=t.flatMap((t=>{const e=n[t.name];return e?{...t,matchedBlocks:e}:[]}));return{status:`${s.length} prefabs, ${e.length} matched blocks`,matched:s}}matchBlocks(){return Object.entries(this.blockPrefabIndex).reduce(((t,[e,n])=>{const s=i(e,this.regexp),r=this.blockLabels[e],a=r&&i(r,this.regexp);return s||a?t.concat({name:e,highlightedName:s||e,highlightedLabel:a||r,prefabs:n}):t}),[])}matchPrefabTypes(t){return t.reduce(((t,e)=>{const{name:n,highlightedName:s,highlightedLabel:r}=e;return e.prefabs?.forEach((e=>{const a={name:n,highlightedName:s,highlightedLabel:r,count:e.count};t[e.name]=(t[e.name]||[]).concat(a)})),t}),{})}}},847:(t,e,n)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.throttledInvoker=void 0;const s=n(726);e.throttledInvoker=function(t){const e=[];return()=>{switch(e.length){case 0:return e.push((async()=>{await t(),e.shift()})()),e[0];case 1:{const n=e[0];return e.push((async()=>{await n,await(0,s.waitAnimationFrame)(),await t(),e.shift()})()),e[1]}case 2:return e[1];default:throw Error(`Unexpected state: promiceses=${e.length}`)}}}},726:(t,e)=>{function n(t,e=(()=>`Unexpected state: ${t}`)){if(null!=t)return t;throw Error(e())}function s(t,e,n=(()=>`Unexpected type: ${t}`)){if(t instanceof e)return t;throw Error(n())}function r(t){return{type:"game",...t}}function a(t,e,n){const s=t.offsetX*e.width/n.width,a=t.offsetY*e.height/n.height;if(s<0||s>=e.width||a<0||a>=e.height)return null;const i=s-Math.floor(e.width/2),o=Math.floor(e.height/2)-a;return r({x:Math.round(i),z:Math.round(o)})}Object.defineProperty(e,"__esModule",{value:!0}),e.threePlaneSize=e.canvasEventToGameCoords=e.gameCoords=e.gameMapSize=e.sleep=e.imageBitmapToPngBlob=e.downloadCanvasPng=e.formatCoords=e.waitAnimationFrame=e.humanreadableDistance=e.removeAllChildren=e.component=e.requireType=e.requireNonnull=void 0,e.requireNonnull=n,e.requireType=s,e.component=function(t,e){const r=n(document.getElementById(n(t,(()=>`Element ID must not null: ${t}`))),(()=>`Element not found: #${t}`));return e?s(r,e):r},e.removeAllChildren=function(t){for(;t.lastChild;)t.removeChild(t.lastChild)},e.humanreadableDistance=function(t){return t<1e3?`${t}m`:`${(t/1e3).toFixed(2)}km`},e.waitAnimationFrame=function(){return new Promise((t=>requestAnimationFrame(t)))},e.formatCoords=function(t,e,n,s){if(!s)return"E/W: -, N/S: -, Elev: -";const r=a(s,t,e);if(null===r)return"E/W: -, N/S: -, Elev: -";const i=n(r,t)??"-";return`E/W: ${r.x}, N/S: ${r.z}, Elev: ${i}`},e.downloadCanvasPng=function(t,e){const n=document.createElement("a");n.download=t,n.href=e.toDataURL("image/png"),n.click()},e.imageBitmapToPngBlob=async function(t){const e=new OffscreenCanvas(t.height,t.width);return n(e.getContext("2d")).drawImage(t,0,0),await e.convertToBlob({type:"image/png"})},e.sleep=async function(t){return new Promise((e=>setTimeout(e,t)))},e.gameMapSize=function(t){return{type:"game",...t}},e.gameCoords=r,e.canvasEventToGameCoords=a,e.threePlaneSize=function(t,e){return{type:"threePlane",width:t,height:e}}},770:function(t,e,n){var s=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});const r=new(s(n(17)).default);fetch("../block-prefab-index.json").then((async t=>r.blockPrefabIndex=await t.json())),fetch("../block-labels.json").then((async t=>r.blockLabels=await t.json())),onmessage=({data:t})=>{Object.assign(r,t).update()},r.addUpdateListener((t=>postMessage(t)))}},e={};!function n(s){var r=e[s];if(void 0!==r)return r.exports;var a=e[s]={exports:{}};return t[s].call(a.exports,a,a.exports,n),a.exports}(770)})();
//# sourceMappingURL=prefabs-filter.js.map