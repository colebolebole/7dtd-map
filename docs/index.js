(()=>{"use strict";var e={29:(e,t,n)=>{let a,s;n.r(t),n.d(t,{deleteDB:()=>f,openDB:()=>h,unwrap:()=>m,wrap:()=>u});const r=new WeakMap,o=new WeakMap,i=new WeakMap,l=new WeakMap,d=new WeakMap;let c={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return o.get(e);if("objectStoreNames"===t)return e.objectStoreNames||i.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return u(e[t])},set:(e,t,n)=>(e[t]=n,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function p(e){return"function"==typeof e?(t=e)!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(s||(s=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(t)?function(...e){return t.apply(m(this),e),u(r.get(this))}:function(...e){return u(t.apply(m(this),e))}:function(e,...n){const a=t.call(m(this),e,...n);return i.set(a,e.sort?e.sort():[e]),u(a)}:(e instanceof IDBTransaction&&function(e){if(o.has(e))return;const t=new Promise(((t,n)=>{const a=()=>{e.removeEventListener("complete",s),e.removeEventListener("error",r),e.removeEventListener("abort",r)},s=()=>{t(),a()},r=()=>{n(e.error||new DOMException("AbortError","AbortError")),a()};e.addEventListener("complete",s),e.addEventListener("error",r),e.addEventListener("abort",r)}));o.set(e,t)}(e),n=e,(a||(a=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])).some((e=>n instanceof e))?new Proxy(e,c):e);var t,n}function u(e){if(e instanceof IDBRequest)return function(e){const t=new Promise(((t,n)=>{const a=()=>{e.removeEventListener("success",s),e.removeEventListener("error",r)},s=()=>{t(u(e.result)),a()},r=()=>{n(e.error),a()};e.addEventListener("success",s),e.addEventListener("error",r)}));return t.then((t=>{t instanceof IDBCursor&&r.set(t,e)})).catch((()=>{})),d.set(t,e),t}(e);if(l.has(e))return l.get(e);const t=p(e);return t!==e&&(l.set(e,t),d.set(t,e)),t}const m=e=>d.get(e);function h(e,t,{blocked:n,upgrade:a,blocking:s,terminated:r}={}){const o=indexedDB.open(e,t),i=u(o);return a&&o.addEventListener("upgradeneeded",(e=>{a(u(o.result),e.oldVersion,e.newVersion,u(o.transaction))})),n&&o.addEventListener("blocked",(()=>n())),i.then((e=>{r&&e.addEventListener("close",(()=>r())),s&&e.addEventListener("versionchange",(()=>s()))})).catch((()=>{})),i}function f(e,{blocked:t}={}){const n=indexedDB.deleteDatabase(e);return t&&n.addEventListener("blocked",(()=>t())),u(n).then((()=>{}))}const g=["get","getKey","getAll","getAllKeys","count"],v=["put","add","delete","clear"],b=new Map;function w(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(b.get(t))return b.get(t);const n=t.replace(/FromIndex$/,""),a=t!==n,s=v.includes(n);if(!(n in(a?IDBIndex:IDBObjectStore).prototype)||!s&&!g.includes(n))return;const r=async function(e,...t){const r=this.transaction(e,s?"readwrite":"readonly");let o=r.store;return a&&(o=o.index(t.shift())),(await Promise.all([o[n](...t),s&&r.done]))[0]};return b.set(t,r),r}var y;y=c,c={...y,get:(e,t,n)=>w(e,t)||y.get(e,t,n),has:(e,t)=>!!w(e,t)||y.has(e,t)}},341:function(e,t,n){var a=this&&this.__createBinding||(Object.create?function(e,t,n,a){void 0===a&&(a=n),Object.defineProperty(e,a,{enumerable:!0,get:function(){return t[n]}})}:function(e,t,n,a){void 0===a&&(a=n),e[a]=t[n]}),s=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),r=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&a(t,e,n);return s(t,e),t};Object.defineProperty(t,"__esModule",{value:!0});const o=n(235),i=r(n(788)),l=r(n(110)),d=n(370),c=n(547),p=n(726),u=n(158),m=n(592),h=n(955),f=n(550),g=n(4),v=n(212),b=n(873),w=n(498),y=n(173),E=n(653),L=n(773);function M(){l.init(),i.init();const e=new L.LoadingHandler({indicator:p.component("loading_indicator"),disablings:{files:p.component("files",HTMLInputElement),select:p.component("map_list",HTMLSelectElement),create:p.component("create_map",HTMLButtonElement),delete:p.component("delete_map",HTMLButtonElement),mapName:p.component("map_name",HTMLInputElement)}}),t=new c.MapStorage;new d.MapSelector({select:p.component("map_list",HTMLSelectElement),create:p.component("create_map",HTMLButtonElement),delete:p.component("delete_map",HTMLButtonElement),mapName:p.component("map_name",HTMLInputElement)},t);const n=new w.MapCanvasHandler({canvas:p.component("map",HTMLCanvasElement),biomesAlpha:p.component("biomes_alpha",HTMLInputElement),splat3Alpha:p.component("splat3_alpha",HTMLInputElement),splat4Alpha:p.component("splat4_alpha",HTMLInputElement),radAlpha:p.component("rad_alpha",HTMLInputElement),signSize:p.component("sign_size",HTMLInputElement),signAlpha:p.component("sign_alpha",HTMLInputElement),brightness:p.component("brightness",HTMLInputElement),scale:p.component("scale",HTMLInputElement)},new Worker("worker/map-renderer.js"),t,e),a=new u.GenerationInfoHandler({mapName:p.component("map_name",HTMLInputElement),output:p.component("generation_info_output",HTMLTextAreaElement)},t),s=new m.DtmHandler(t,(()=>new Worker("worker/pngjs.js"))),r=new h.PrefabsHandler({status:p.component("prefabs_num",HTMLElement),prefabFilter:p.component("prefabs_filter",HTMLInputElement),blockFilter:p.component("blocks_filter",HTMLInputElement)},new Worker("worker/prefabs-filter.js"),t);r.listeners.push((async e=>{n.update({prefabs:e})}));const M=new f.DelayedRenderer(p.component("controller",HTMLElement),p.component("prefabs_list",HTMLElement),(e=>function(e){const t=document.createElement("li");if(t.innerHTML=[`<button data-input-for="prefabs_filter" data-input-text="${e.name}" title="Filter with this prefab name">▲</button>`,e.dist?`${p.humanreadableDistance(e.dist)},`:"",`<a href="prefabs/${e.name}.html" target="_blank">${e.highlightedName||e.name}</a>`,`(${e.x}, ${e.z})`].join(" "),e.matchedBlocks&&e.matchedBlocks.length>0){const n=document.createElement("ul");e.matchedBlocks.forEach((e=>{const t=document.createElement("li");t.innerHTML=[`<button data-input-for="blocks_filter" data-input-text="${e.name}" title="Filter with this block name">▲</button>`,`${e.count}x`,e.highlightedLabel,`<small>${e.highlightedName}</small>`].join(" "),n.appendChild(t)})),t.appendChild(n)}return t}(e)));r.listeners.push((async e=>{M.iterator=e}));const _=new g.CursorCoodsHandler({canvas:p.component("map",HTMLCanvasElement),output:p.component("cursor_coods",HTMLElement)},((e,t)=>s.dtm?.getElevation(e.x,e.z,t)??null));n.addMapSizeListener((e=>_.mapSize=e));const I=new v.MarkerHandler({canvas:p.component("map",HTMLCanvasElement),output:p.component("mark_coods",HTMLElement),resetMarker:p.component("reset_mark",HTMLButtonElement)},((e,t)=>s.dtm?.getElevation(e.x,e.z,t)??null));n.addMapSizeListener((e=>I.mapSize=e)),I.listeners.push((async e=>{r.marker=e,n.update({markerCoords:e})}));const A=new o.ImageBitmapLoader((()=>new Worker("worker/pngjs.js"))),S=new b.FileHandler({input:p.component("files",HTMLInputElement)},e);S.addListeners([["biomes.png",async e=>n.update({biomesImg:await createImageBitmap(e)})],[/splat3(_processed)?\.png/,async e=>n.update({splat3Img:await A.loadSplat(e)})],["splat4_processed.png",async e=>n.update({splat4Img:await A.loadSplat(e)})],["radiation.png",async e=>n.update({radImg:await A.loadRad(e)})],["prefabs.xml",async e=>await r.handle(e)],[/dtm\.(raw|png)/,async e=>await s.handle(e)],["GenerationInfo.txt",async e=>await a.handle(e)]]),new y.DndHandler(document).addDropFilesListener((e=>S.pushFiles(e))),(new E.SampleWorldLoader).addListenr((e=>S.pushFiles([e]))),p.component("download").addEventListener("click",(()=>{const e=p.component("map_name",HTMLInputElement).value??"7dtd-map";p.downloadCanvasPng(`${e}.png`,p.component("map",HTMLCanvasElement))}))}"loading"===document.readyState?document.addEventListener("DOMContentLoaded",M):M()},4:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.CursorCoodsHandler=void 0;const a=n(726);function s(e,t=null){e.doms.output.textContent=a.formatCoords(e.mapSize,e.doms.canvas,e.elevationFunction,t)}t.CursorCoodsHandler=class{constructor(e,t){this.mapSize={width:0,height:0},this.elevationFunction=t,this.doms=e,e.canvas.addEventListener("mousemove",(e=>s(this,e)),{passive:!0}),e.canvas.addEventListener("mouseout",(()=>s(this)))}}},173:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.DndHandler=void 0,t.DndHandler=class{constructor(e){this.dropFilesListeners=[],e.addEventListener("drop",(async e=>{if(!e.dataTransfer?.types.includes("Files"))return;e.preventDefault();const t=Array.from(e.dataTransfer.files);this.dropFilesListeners.forEach((e=>e(t)))})),e.addEventListener("dragenter",(t=>{t.dataTransfer?.types.includes("Files")&&(t.preventDefault(),e.body.classList.add("dragovered"))})),e.addEventListener("dragover",(t=>{t.dataTransfer?.types.includes("Files")&&(t.preventDefault(),t.dataTransfer.dropEffect="copy",e.body.classList.add("dragovered"))})),e.addEventListener("dragleave",(t=>{0===t.clientX&&0===t.clientY&&(t.preventDefault(),e.body.classList.remove("dragovered"))})),e.addEventListener("drop",(async t=>{t.dataTransfer?.types.includes("Files")&&(t.preventDefault(),e.body.classList.remove("dragovered"))}))}addDropFilesListener(e){this.dropFilesListeners.push(e)}}},592:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.DtmHandler=t.Dtm=void 0;const a=n(547),s=n(679);class r{constructor(e){this.data=e}getElevation(e,t,n){return this.data[e+t*n]}}t.Dtm=r,t.DtmHandler=class{constructor(e,t){this.dtm=null,this.storage=e,this.pngParser=new s.PngParser(t),a.MapStorage.addListener((async()=>{const t=await e.getCurrent("elevations");this.dtm=t?new r(t.data):null}))}async handle(e){if("string"==typeof e)this.dtm=await this.loadDtmByPngUrl(e);else if("image/png"===e.type.toLocaleLowerCase())this.dtm=await this.loadByPngBlob(e);else{if("image/raw"!==e.type.toLocaleLowerCase())throw Error(`Unknown data type: name=${e.name}, type=${e.type}`);this.dtm=await async function(e){const t=new Uint8Array(await e.arrayBuffer()),n=new Uint8Array(t.length/2);for(let e=0;e<n.length;e++)n[e]=t[2*e+1];return new r(n)}(e)}this.storage.put("elevations",this.dtm.data)}async loadDtmByPngUrl(e){const t=await fetch(e);return this.loadByPngBlob(await t.blob())}async loadByPngBlob(e){return function(e){const t=new Uint8Array(e.data),n=new Uint8Array(t.length/4);for(let e=0;e<n.length;e++)n[e]=t[4*e];return new r(n)}(await this.pngParser.parse(e))}}},873:function(e,t,n){var a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.FileHandler=void 0;const s=a(n(847)),r=n(726);t.FileHandler=class{constructor(e,t){this.listeners=new Map,this.doms=e,this.loadingHandler=t;const n=s.default((()=>this.processFiles()));e.input.addEventListener("input",n)}addListeners(e){e.forEach((([e,t])=>this.addListener(e,t)))}addListener(e,t){const n=this.listeners.get(e)??[];this.listeners.set(e,n.concat(t))}pushFiles(e){const t=e.filter((e=>0!==this.getListeners(e.name).length));this.updateFiles([...Array.from(this.doms.input.files??[]),...t]),this.doms.input.dispatchEvent(new Event("input"))}async processFiles(){this.loadingHandler.add(Array.from(this.doms.input.files??[]).map((e=>e.name)));let e=this.popFile();for(;e instanceof File;){const t=this.getListeners(e.name);0===t.length?console.log("No hundler: ",e):this.shouldSkip(e)?console.log("Skip: ",e):(console.time(`Processed: ${e.name}`),await Promise.all(t.map((async t=>t(e)))),console.timeEnd(`Processed: ${e.name}`)),this.loadingHandler.delete(e.name),await r.waitAnimationFrame(),e=this.popFile()}}getListeners(e){return Array.from(this.listeners.entries()).flatMap((([t,n])=>t instanceof RegExp&&t.test(e)||"string"==typeof t&&t===e?n:[]))}popFile(){if(!this.doms.input.files?.length)return null;const e=Array.from(this.doms.input.files);return this.updateFiles(e.slice(1)),e[0]}shouldSkip(e){return"splat3.png"===e.name&&Array.from(this.doms.input.files??[]).map((e=>e.name)).includes("splat3_processed.png")}updateFiles(e){this.doms.input.files=function(e){const t=new DataTransfer;for(const n of e)t.items.add(n);return t}(e).files}}},158:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.GenerationInfoHandler=void 0;const a=n(547);t.GenerationInfoHandler=class{constructor(e,t){this.doms=e,this.storage=t,a.MapStorage.addListener((async()=>{const n=await t.getCurrent("generationInfo");e.output.value=n?.data??""}))}async handle(e){let t;t="string"==typeof e?e:await e.text();const n=function(e){return/^World Name:(.*)$/m.exec(e)?.[1].trim()}(t);n&&(this.doms.mapName.value=n,this.doms.mapName.dispatchEvent(new Event("input"))),this.doms.output.value=t,this.doms.mapName.dispatchEvent(new Event("input")),this.storage.put("generationInfo",t)}}},773:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.LoadingHandler=void 0;const a=n(726),s=["｜","／","―","＼"];t.LoadingHandler=class{constructor(e){this._loadingList=[],this.doms=e}add(e){this._loadingList=this._loadingList.concat(e),this.startAnimation()}delete(e){this._loadingList=this._loadingList.filter((t=>t!==e))}disableAll(e){Object.values(this.doms.disablings).forEach((t=>t.disabled=e))}async startAnimation(){for(this.disableAll(!0);0!==this._loadingList.length;)this.doms.indicator.textContent=`${this.bar()} Loading: ${this._loadingList.join(", ")}`,await a.waitAnimationFrame();this.doms.indicator.textContent="",this.disableAll(!1)}bar(){return s[Math.floor(Date.now()/1e3)%s.length]}}},498:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.MapCanvasHandler=void 0;const a=n(547),s={biomesImg:"biomes",splat3Img:"splat3",splat4Img:"splat4",radImg:"rad"};function r(e){return e instanceof ImageBitmap||e instanceof OffscreenCanvas}t.MapCanvasHandler=class{constructor(e,t,n,s){this.mapSizeListeners=[],this.doms=e,this.worker=t,this.storage=n,this.update({canvas:e.canvas.transferControlToOffscreen(),...this.biomesAlpha(),...this.splat3Alpha(),...this.splat4Alpha(),...this.radAlpha(),...this.brightness(),...this.signSize(),...this.signAlpha(),...this.scale()}),a.MapStorage.addListener((async()=>{console.log("Change map: ",await n.currentId()),this.update({biomesImg:null,splat3Img:null,splat4Img:null,radImg:null},!1),s.add(["bioms","splat3","splat4","radiation"]),this.update({biomesImg:(await n.getCurrent("biomes"))?.data},!1),s.delete("bioms"),this.update({splat3Img:(await n.getCurrent("splat3"))?.data},!1),s.delete("splat3"),this.update({splat4Img:(await n.getCurrent("splat4"))?.data},!1),s.delete("splat4"),this.update({radImg:(await n.getCurrent("rad"))?.data},!1),s.delete("radiation")})),t.addEventListener("message",(e=>{const{mapSize:t}=e.data;this.mapSizeListeners.map((e=>e(t)))})),e.biomesAlpha.addEventListener("input",(()=>this.update(this.biomesAlpha()))),e.splat3Alpha.addEventListener("input",(()=>this.update(this.splat3Alpha()))),e.splat4Alpha.addEventListener("input",(()=>this.update(this.splat4Alpha()))),e.radAlpha.addEventListener("input",(()=>this.update(this.radAlpha()))),e.signSize.addEventListener("input",(()=>this.update(this.signSize()))),e.signAlpha.addEventListener("input",(()=>this.update(this.signAlpha()))),e.brightness.addEventListener("input",(()=>this.update(this.brightness()))),e.scale.addEventListener("input",(()=>this.update(this.scale())))}async update(e,t=!0){if(t)for(const t of Object.entries(e))t[0]in s&&await this.storage.put(s[t[0]],t[1]);const n=Object.values(e).filter(r);this.worker.postMessage(e,n)}addMapSizeListener(e){this.mapSizeListeners.push(e)}biomesAlpha(){return{biomesAlpha:this.doms.biomesAlpha.valueAsNumber}}splat3Alpha(){return{splat3Alpha:this.doms.splat3Alpha.valueAsNumber}}splat4Alpha(){return{splat4Alpha:this.doms.splat4Alpha.valueAsNumber}}radAlpha(){return{radAlpha:this.doms.radAlpha.valueAsNumber}}signSize(){return{signSize:this.doms.signSize.valueAsNumber}}signAlpha(){return{signAlpha:this.doms.signAlpha.valueAsNumber}}brightness(){return{brightness:`${this.doms.brightness.valueAsNumber}%`}}scale(){return{scale:this.doms.scale.valueAsNumber}}}},370:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.MapSelector=void 0;const a=n(547),s=n(726);function r(e){const t=document.createElement("option");return t.dataset.mapId=s.requireNonnull(e.id).toString(),t.textContent=`${e.id}. ${e.name}`,t}t.MapSelector=class{constructor(e,t){this.doms=e,this.storage=t,this.initPromise=this.init()}get selectedOption(){return s.requireNonnull(this.doms.select.selectedOptions)[0]}get selectedOptionMapId(){return parseInt(this.selectedOption.dataset.mapId)}async init(){a.MapStorage.addListener((async e=>this.buildOptions(e))),await this.changeMap(await this.storage.currentId(),!0),this.doms.mapName.addEventListener("input",(()=>{const e=this.selectedOptionMapId,t=this.doms.mapName.value;this.doms.select.selectedOptions[0].textContent=`${e}. ${t}`,this.storage.put("maps",t)})),this.doms.select.addEventListener("input",(()=>this.changeMap(this.selectedOptionMapId))),this.doms.create.addEventListener("click",(()=>this.create())),this.doms.delete.addEventListener("click",(()=>this.deleteMap()))}async buildOptions(e){const t=await this.storage.listMaps(),n=new DocumentFragment;for(const e of t)n.appendChild(r(e));s.removeAllChildren(this.doms.select),this.doms.select.appendChild(n),this.selectOptionByMapId(e)}async create(){this.doms.create.disabled=!0,console.log("Create Map");const e=await this.storage.createMap();this.doms.select.appendChild(r(e)),await this.changeMap(e.id),this.doms.create.disabled=!1}async deleteMap(){this.doms.delete.disabled=!0;const e=this.selectedOptionMapId;console.log("Delete Map",e),this.doms.select.options.length<=1?console.log("Reject delete"):(this.doms.select.removeChild(this.selectedOption),await this.storage.deleteMap(e),await this.changeMap(this.selectedOptionMapId),this.doms.delete.disabled=this.doms.select.options.length<=1)}async changeMap(e,t=!1){t||await this.initPromise,console.time("Change map"),await this.storage.changeMap(e),console.timeEnd("Change map");const n=s.requireNonnull(await this.storage.getCurrent("maps"));this.selectOptionByMapId(n.id),this.doms.mapName.value=n.name}selectOptionByMapId(e){this.doms.select.selectedIndex=Array.from(this.doms.select.options).findIndex((t=>parseInt(t.dataset.mapId)===e))}disableDoms(e){Object.values(this.doms).forEach((t=>t.disabled=e))}}},212:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.MarkerHandler=void 0;const a=n(726);function s(e,t=null){e.doms.output.textContent=a.formatCoords(e.mapSize,e.doms.canvas,e.elevationFunction,t)}t.MarkerHandler=class{constructor(e,t){this.mapSize={width:0,height:0},this.listeners=[],this.elevationFunction=t,this.doms=e,e.canvas.addEventListener("click",(t=>{s(this,t);const n={x:Math.round(t.offsetX*this.mapSize.width/e.canvas.width-this.mapSize.width/2),z:-Math.round(t.offsetY*this.mapSize.height/e.canvas.height-this.mapSize.height/2)};this.listeners.forEach((e=>e(n)))})),e.resetMarker.addEventListener("click",(()=>{s(this),this.listeners.forEach((e=>e(null)))}))}}},955:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.PrefabsHandler=void 0;const a=n(547);t.PrefabsHandler=class{constructor(e,t,n){this.listeners=[],this.doms=e,this.worker=t,this.storage=n,a.MapStorage.addListener((async()=>{const e=await n.getCurrent("prefabs");t.postMessage({all:e?.data??[]})})),t.addEventListener("message",(t=>{const{prefabs:n,status:a}=t.data;this.listeners.map((e=>e(n))),e.status.textContent=a})),["input","focus"].forEach((n=>{e.prefabFilter.addEventListener(n,(async()=>{t.postMessage({prefabsFilterString:e.prefabFilter.value}),document.body.dataset.activeFilter="prefab"})),e.blockFilter.addEventListener(n,(async()=>{t.postMessage({blocksFilterString:e.blockFilter.value}),document.body.dataset.activeFilter="block"}))}))}async handle(e){const t=function(e){const t=(new DOMParser).parseFromString(e,"text/xml");return Array.from(t.getElementsByTagName("decoration")).flatMap((e=>{const t=e.getAttribute("position")?.split(",");if(!t||3!==t.length)return[];const n=e.getAttribute("name");return n?{name:n,x:parseInt(t[0]),z:parseInt(t[2])}:[]}))}(await e.text());await this.storage.put("prefabs",t),this.worker.postMessage({all:t})}set marker(e){this.worker.postMessage({markCoords:e})}}},653:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.SampleWorldLoader=void 0;const a=n(726),s=["biomes.png","splat3_processed.png","splat4_processed.png","radiation.png","prefabs.xml","dtm.png","GenerationInfo.txt"];t.SampleWorldLoader=class{constructor(){this.listeners=[];for(const e of Array.from(document.querySelectorAll("button[data-sample-dir]")))console.log("Sample world button: ",e),e instanceof HTMLButtonElement&&e.addEventListener("click",(async()=>this.loadSampleWorld(e)))}addListenr(e){this.listeners.push(e)}async loadSampleWorld(e){e.disabled=!0;const t=a.requireNonnull(e.dataset.sampleDir);await Promise.all(s.flatMap((async e=>{const n=await async function(e){console.time(`fetchAsFile: ${e}`);const t=await fetch(e),n=await t.blob(),a=new File([n],(s=e).substring(s.lastIndexOf("/")+1),{type:n.type});var s;return console.timeEnd(`fetchAsFile: ${e}`),a}(`${t}/${e}`);return this.listeners.map((e=>e(n)))}))),e.disabled=!1}}},235:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ImageBitmapLoader=void 0;const a=n(679);function s({data:e,height:t,width:n},a){const s=new OffscreenCanvas(n,t),r=s.getContext("2d");if(!r)throw Error("Unexpected error: Canvas context not found");const o=r.getImageData(0,0,n,t);return a(new Uint8Array(e),o.data),r.putImageData(o,0,0),createImageBitmap(s)}t.ImageBitmapLoader=class{constructor(e){this.pngParser=new a.PngParser(e)}async loadSplat(e){return s(await this.pngParser.parse(e),((e,t)=>{for(let n=0;n<e.length;n+=4)t[n]=e[n],t[n+1]=e[n+1],t[n+2]=e[n+2],0===e[n]&&0===e[n+1]&&0===e[n+2]?t[n+3]=0:t[n+3]=255}))}async loadRad(e){return s(await this.pngParser.parse(e),((e,t)=>{for(let n=0;n<e.length;n+=4)t[n]=e[n],t[n+1]=0,t[n+2]=0,0!==e[n]?t[n+3]=255:t[n+3]=0}))}}},788:(e,t)=>{function n(e,t){!function(e){const t=getSelection();t?.removeAllRanges();const n=document.createRange();n.selectNodeContents(e),t?.addRange(n)}(e);const n=document.execCommand("copy");n?(console.log("Copy Success",e),t.dataset.message=t.dataset.successMessage??"Copied!"):(console.log("Copy Failure",e),t.dataset.message=t.dataset.failureMessage??"⚠Failure"),console.log(n)}Object.defineProperty(t,"__esModule",{value:!0}),t.init=void 0,t.init=function(){for(const e of Array.from(document.querySelectorAll("[data-copy-for]"))){if(!(e instanceof HTMLButtonElement))continue;const t=document.getElementById(e.dataset.copyFor);t&&e.addEventListener("click",(()=>n(t,e)))}}},550:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.DelayedRenderer=void 0;const a=n(726);async function s(e,t){for(;!t();){const t=e._iterator.next();if(r(t))break;const n=new DocumentFragment;t.value.forEach((t=>n.appendChild(e.itemRenderer(t)))),e.appendee.appendChild(n),await a.waitAnimationFrame()}}function r(e){return Boolean(e.done)}t.DelayedRenderer=class{constructor(e,t,n){if(this._iterator=[][Symbol.iterator](),this.scrollCallback=()=>{this.renderAll()},!e.contains(t))throw Error("Wrapper element should contain appendee element");t.innerHTML="",this.appendee=t,this.scrollableWrapper=e,this.itemRenderer=n}set iterator(e){this._iterator=function(e,t=10){let n=null;const s={next(...a){if(n)return n;const s=Array(t);for(let o=0;o<t;o++){const t=e.next(...a);r(t)?n=t:s[o]=t.value}return{done:!1,value:s}}};return"throw"in e&&(s.throw=t=>{const n=a.requireNonnull(e.throw)(t);return r(n)?n:{done:n.done,value:[n.value]}}),"return"in e&&(s.return=t=>{const n=a.requireNonnull(e.return)(t);return r(n)?n:{done:n.done,value:[n.value]}}),s}("next"in e?e:e[Symbol.iterator]()),this.appendee.innerHTML="",this.scrollableWrapper.removeEventListener("scroll",this.scrollCallback),requestAnimationFrame((()=>{this.scrollableWrapper.removeEventListener("scroll",this.scrollCallback),this.scrollableWrapper.addEventListener("scroll",this.scrollCallback,{once:!0}),s(this,(()=>{return(e=this.scrollableWrapper).offsetHeight+100<e.scrollHeight;var e}))}))}async renderAll(){await s(this,(()=>!1))}}},547:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.MapStorage=t.LARGE_OBJECT_TYPES=void 0;const a=n(29),s=n(726);function r(e,t,n){for(let a=t+1;a<=n;a++)1===a&&(e.createObjectStore("maps",{keyPath:"id",autoIncrement:!0}),e.createObjectStore("largeObjects",{keyPath:["mapId","type"]})),2===a&&e.createObjectStore("selectedMap",{keyPath:"id"})}t.LARGE_OBJECT_TYPES=["biomes","splat3","splat4","rad","elevations","subElevations","prefabs","generationInfo"],t.LARGE_OBJECT_TYPES;const o=[e=>console.log("MapStorage change current map",e)];async function i(e,t){return{id:await e.put("maps",{name:t}),name:t}}function l(e){return t.LARGE_OBJECT_TYPES.includes(e)}async function d(e,t){await e.put("selectedMap",{id:0,mapId:t})}async function c(e){const t=await e.get("selectedMap",0);if(t)return t.mapId;const n=await e.getAll("maps");if(n[0])return await d(e,n[0].id),c(e);const a=await i(e,"New-World");return await d(e,a.id),c(e)}t.MapStorage=class{async put(e,t){const n=await this.getDb(),a=await c(n);if(l(e))await n.put("largeObjects",{mapId:a,type:e,data:t});else{if("maps"!==e)throw Error(`Unreachable code: type=${e}`);await n.put("maps",{id:a,name:t})}}async getCurrent(e){const t=await this.getDb(),n=await c(t);if(l(e))return await t.get("largeObjects",[n,e]);if("maps"===e)return s.requireNonnull(await t.get("maps",n),(()=>`Unexpected state: ${n}`));throw Error(`Unreachable code: ${e}`)}async listMaps(){return(await this.getDb()).getAll("maps")}async createMap(e="New-World"){const t=await this.getDb();return await i(t,e)}async deleteMap(e){const n=await this.getDb(),a=e??await c(n);await Promise.all([n.delete("maps",a),...t.LARGE_OBJECT_TYPES.map((e=>n.delete("largeObjects",[a,e])))])}async changeMap(e){const t=await this.getDb();await Promise.all([d(t,e),...o.map((t=>t(e,this)))])}async currentId(){return c(await this.getDb())}static addListener(e){o.push(e)}async getDb(){return this._db||(this._db=await a.openDB("7dtd-map",2,{upgrade:r})),this._db}}},679:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.PngParser=void 0,t.PngParser=class{constructor(e){this.workerFactory=e}async parse(e){const t=this.workerFactory(),n=await e.arrayBuffer();t.postMessage(n,[n]);const a=await new Promise(((e,n)=>{t.onmessage=e,t.onerror=n,t.onmessageerror=n}));return t.terminate(),a.data}}},110:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.init=void 0;const a=n(726);t.init=function(){for(const e of Array.from(document.querySelectorAll("[data-input-for]")))e instanceof HTMLElement&&e.addEventListener("click",(()=>{const t=a.component(e.dataset.inputFor,HTMLInputElement);t.value=a.requireNonnull(e.dataset.inputText??e.textContent),t.dispatchEvent(new Event("input"))}))}},847:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0});const a=n(726);t.default=function(e){let t=!1,n=null;return async()=>{t=!0,n||(n=(async()=>{for(;t;)t=!1,await e(),await a.waitAnimationFrame();n=null})())}}},726:(e,t)=>{function n(e,t=(()=>`Unexpected state: ${e}`)){if(e)return e;throw Error(t())}function a(e,t,n=(()=>`Unexpected type: ${e}`)){if(e instanceof t)return e;throw Error(n())}Object.defineProperty(t,"__esModule",{value:!0}),t.downloadCanvasPng=t.formatCoords=t.waitAnimationFrame=t.humanreadableDistance=t.removeAllChildren=t.component=t.requireType=t.requireNonnull=void 0,t.requireNonnull=n,t.requireType=a,t.component=function(e,t){const s=n(document.getElementById(n(e,(()=>`Element ID must not null: ${e}`))),(()=>`Element not found: #${e}`));return t?a(s,t):s},t.removeAllChildren=function(e){for(;e.lastChild;)e.removeChild(e.lastChild)},t.humanreadableDistance=function(e){return e<1e3?`${e}m`:`${(e/1e3).toFixed(2)}km`},t.waitAnimationFrame=function(){return new Promise((e=>requestAnimationFrame(e)))},t.formatCoords=function(e,t,n,a){if(!a)return"E/W: -, N/S: -, Elev: -";const s=a.offsetX*e.width/t.width,r=a.offsetY*e.height/t.height;return s<0||s>=e.width||r<0||r>=e.height?"E/W: -, N/S: -, Elev: -":`E/W: ${Math.round(s-e.width/2)}, N/S: ${Math.round(e.height/2-r)}, Elev: ${n({x:Math.round(s),z:Math.round(r)},e.width)??"-"}`},t.downloadCanvasPng=function(e,t){const n=document.createElement("a");n.download=e,n.href=t.toDataURL("image/png"),n.click()}}},t={};function n(a){var s=t[a];if(void 0!==s)return s.exports;var r=t[a]={exports:{}};return e[a].call(r.exports,r,r.exports,n),r.exports}n.d=(e,t)=>{for(var a in t)n.o(t,a)&&!n.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n(341)})();
//# sourceMappingURL=index.js.map