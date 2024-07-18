(()=>{"use strict";var e={136:()=>{try{self["workbox:core:6.6.0"]&&_()}catch(e){}},447:()=>{try{self["workbox:precaching:6.6.0"]&&_()}catch(e){}},227:()=>{try{self["workbox:routing:6.6.0"]&&_()}catch(e){}},390:()=>{try{self["workbox:strategies:6.6.0"]&&_()}catch(e){}}},t={};function s(a){var n=t[a];if(void 0!==n)return n.exports;var r=t[a]={exports:{}};return e[a](r,r.exports,s),r.exports}s(136);class a extends Error{constructor(e,t){super(((e,...t)=>{let s=e;return t.length>0&&(s+=` :: ${JSON.stringify(t)}`),s})(e,t)),this.name=e,this.details=t}}const n={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},r=e=>[n.prefix,e,n.suffix].filter((e=>e&&e.length>0)).join("-"),i=e=>e||r(n.precache);function c(e,t){const s=t();return e.waitUntil(s),s}function o(e){if(!e)throw new a("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:t,url:s}=e;if(!s)throw new a("add-to-cache-list-unexpected-type",{entry:e});if(!t){const e=new URL(s,location.href);return{cacheKey:e.href,url:e.href}}const n=new URL(s,location.href),r=new URL(s,location.href);return n.searchParams.set("__WB_REVISION__",t),{cacheKey:n.href,url:r.href}}s(447);class h{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if("install"===e.type&&t&&t.originalRequest&&t.originalRequest instanceof Request){const e=t.originalRequest.url;s?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return s}}}class l{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{const s=(null==t?void 0:t.cacheKey)||this._precacheController.getCacheKeyForURL(e.url);return s?new Request(s,{headers:e.headers}):e},this._precacheController=e}}let u;function d(e,t){const s=new URL(e);for(const e of t)s.searchParams.delete(e);return s.href}class f{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}const p=new Set;function g(e){return"string"==typeof e?new Request(e):e}s(390);class y{constructor(e,t){this._cacheKeys={},Object.assign(this,t),this.event=t.event,this._strategy=e,this._handlerDeferred=new f,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map;for(const e of this._plugins)this._pluginStateMap.set(e,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(e){const{event:t}=this;let s=g(e);if("navigate"===s.mode&&t instanceof FetchEvent&&t.preloadResponse){const e=await t.preloadResponse;if(e)return e}const n=this.hasCallback("fetchDidFail")?s.clone():null;try{for(const e of this.iterateCallbacks("requestWillFetch"))s=await e({request:s.clone(),event:t})}catch(e){if(e instanceof Error)throw new a("plugin-error-request-will-fetch",{thrownErrorMessage:e.message})}const r=s.clone();try{let e;e=await fetch(s,"navigate"===s.mode?void 0:this._strategy.fetchOptions);for(const s of this.iterateCallbacks("fetchDidSucceed"))e=await s({event:t,request:r,response:e});return e}catch(e){throw n&&await this.runCallbacks("fetchDidFail",{error:e,event:t,originalRequest:n.clone(),request:r.clone()}),e}}async fetchAndCachePut(e){const t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}async cacheMatch(e){const t=g(e);let s;const{cacheName:a,matchOptions:n}=this._strategy,r=await this.getCacheKey(t,"read"),i=Object.assign(Object.assign({},n),{cacheName:a});s=await caches.match(r,i);for(const e of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await e({cacheName:a,matchOptions:n,cachedResponse:s,request:r,event:this.event})||void 0;return s}async cachePut(e,t){const s=g(e);await new Promise((e=>setTimeout(e,0)));const n=await this.getCacheKey(s,"write");if(!t)throw new a("cache-put-with-no-response",{url:(r=n.url,new URL(String(r),location.href).href.replace(new RegExp(`^${location.origin}`),""))});var r;const i=await this._ensureResponseSafeToCache(t);if(!i)return!1;const{cacheName:c,matchOptions:o}=this._strategy,h=await self.caches.open(c),l=this.hasCallback("cacheDidUpdate"),u=l?await async function(e,t,s,a){const n=d(t.url,s);if(t.url===n)return e.match(t,a);const r=Object.assign(Object.assign({},a),{ignoreSearch:!0}),i=await e.keys(t,r);for(const t of i)if(n===d(t.url,s))return e.match(t,a)}(h,n.clone(),["__WB_REVISION__"],o):null;try{await h.put(n,l?i.clone():i)}catch(e){if(e instanceof Error)throw"QuotaExceededError"===e.name&&await async function(){for(const e of p)await e()}(),e}for(const e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:c,oldResponse:u,newResponse:i.clone(),request:n,event:this.event});return!0}async getCacheKey(e,t){const s=`${e.url} | ${t}`;if(!this._cacheKeys[s]){let a=e;for(const e of this.iterateCallbacks("cacheKeyWillBeUsed"))a=g(await e({mode:t,request:a,event:this.event,params:this.params}));this._cacheKeys[s]=a}return this._cacheKeys[s]}hasCallback(e){for(const t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(const t of this._strategy.plugins)if("function"==typeof t[e]){const s=this._pluginStateMap.get(t),a=a=>{const n=Object.assign(Object.assign({},a),{state:s});return t[e](n)};yield a}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve(null)}async _ensureResponseSafeToCache(e){let t=e,s=!1;for(const e of this.iterateCallbacks("cacheWillUpdate"))if(t=await e({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return s||t&&200!==t.status&&(t=void 0),t}}class w{constructor(e={}){this.cacheName=e.cacheName||r(n.runtime),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,s="string"==typeof e.request?new Request(e.request):e.request,a="params"in e?e.params:void 0,n=new y(this,{event:t,request:s,params:a}),r=this._getResponse(n,s,t);return[r,this._awaitComplete(r,n,s,t)]}async _getResponse(e,t,s){let n;await e.runCallbacks("handlerWillStart",{event:s,request:t});try{if(n=await this._handle(t,e),!n||"error"===n.type)throw new a("no-response",{url:t.url})}catch(a){if(a instanceof Error)for(const r of e.iterateCallbacks("handlerDidError"))if(n=await r({error:a,event:s,request:t}),n)break;if(!n)throw a}for(const a of e.iterateCallbacks("handlerWillRespond"))n=await a({event:s,request:t,response:n});return n}async _awaitComplete(e,t,s,a){let n,r;try{n=await e}catch(r){}try{await t.runCallbacks("handlerDidRespond",{event:a,request:s,response:n}),await t.doneWaiting()}catch(e){e instanceof Error&&(r=e)}if(await t.runCallbacks("handlerDidComplete",{event:a,request:s,response:n,error:r}),t.destroy(),r)throw r}}class m extends w{constructor(e={}){e.cacheName=i(e.cacheName),super(e),this._fallbackToNetwork=!1!==e.fallbackToNetwork,this.plugins.push(m.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){return await t.cacheMatch(e)||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(e,t){let s;const n=t.params||{};if(!this._fallbackToNetwork)throw new a("missing-precache-entry",{cacheName:this.cacheName,url:e.url});{const a=n.integrity,r=e.integrity,i=!r||r===a;s=await t.fetch(new Request(e,{integrity:"no-cors"!==e.mode?r||a:void 0})),a&&i&&"no-cors"!==e.mode&&(this._useDefaultCacheabilityPluginIfNeeded(),await t.cachePut(e,s.clone()))}return s}async _handleInstall(e,t){this._useDefaultCacheabilityPluginIfNeeded();const s=await t.fetch(e);if(!await t.cachePut(e,s.clone()))throw new a("bad-precaching-response",{url:e.url,status:s.status});return s}_useDefaultCacheabilityPluginIfNeeded(){let e=null,t=0;for(const[s,a]of this.plugins.entries())a!==m.copyRedirectedCacheableResponsesPlugin&&(a===m.defaultPrecacheCacheabilityPlugin&&(e=s),a.cacheWillUpdate&&t++);0===t?this.plugins.push(m.defaultPrecacheCacheabilityPlugin):t>1&&null!==e&&this.plugins.splice(e,1)}}m.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e},m.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:e})=>e.redirected?await async function(e,t){let s=null;if(e.url&&(s=new URL(e.url).origin),s!==self.location.origin)throw new a("cross-origin-copy-response",{origin:s});const n=e.clone(),r={headers:new Headers(n.headers),status:n.status,statusText:n.statusText},i=t?t(r):r,c=function(){if(void 0===u){const e=new Response("");if("body"in e)try{new Response(e.body),u=!0}catch(e){u=!1}u=!1}return u}()?n.body:await n.blob();return new Response(c,i)}(e):e};class R{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map,this._strategy=new m({cacheName:i(e),plugins:[...t,new l({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(e){const t=[];for(const s of e){"string"==typeof s?t.push(s):s&&void 0===s.revision&&t.push(s.url);const{cacheKey:e,url:n}=o(s),r="string"!=typeof s&&s.revision?"reload":"default";if(this._urlsToCacheKeys.has(n)&&this._urlsToCacheKeys.get(n)!==e)throw new a("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(n),secondEntry:e});if("string"!=typeof s&&s.integrity){if(this._cacheKeysToIntegrities.has(e)&&this._cacheKeysToIntegrities.get(e)!==s.integrity)throw new a("add-to-cache-list-conflicting-integrities",{url:n});this._cacheKeysToIntegrities.set(e,s.integrity)}if(this._urlsToCacheKeys.set(n,e),this._urlsToCacheModes.set(n,r),t.length>0){const e=`Workbox is precaching URLs without revision info: ${t.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return c(e,(async()=>{const t=new h;this.strategy.plugins.push(t);for(const[t,s]of this._urlsToCacheKeys){const a=this._cacheKeysToIntegrities.get(s),n=this._urlsToCacheModes.get(t),r=new Request(t,{integrity:a,cache:n,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:s},request:r,event:e}))}const{updatedURLs:s,notUpdatedURLs:a}=t;return{updatedURLs:s,notUpdatedURLs:a}}))}activate(e){return c(e,(async()=>{const e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),s=new Set(this._urlsToCacheKeys.values()),a=[];for(const n of t)s.has(n.url)||(await e.delete(n),a.push(n.url));return{deletedURLs:a}}))}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}getIntegrityForCacheKey(e){return this._cacheKeysToIntegrities.get(e)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s)return(await self.caches.open(this.strategy.cacheName)).match(s)}createHandlerBoundToURL(e){const t=this.getCacheKeyForURL(e);if(!t)throw new a("non-precached-url",{url:e});return s=>(s.request=new Request(e),s.params=Object.assign({cacheKey:t},s.params),this.strategy.handle(s))}}let v;const C=()=>(v||(v=new R),v);s(227);const b=e=>e&&"object"==typeof e?e:{handle:e};class q{constructor(e,t,s="GET"){this.handler=b(t),this.match=e,this.method=s}setCatchHandler(e){this.catchHandler=b(e)}}class U extends q{constructor(e,t,s){super((({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)}),t,s)}}class L{constructor(){this._routes=new Map,this._defaultHandlerMap=new Map}get routes(){return this._routes}addFetchListener(){self.addEventListener("fetch",(e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)}))}addCacheListener(){self.addEventListener("message",(e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map((t=>{"string"==typeof t&&(t=[t]);const s=new Request(...t);return this.handleRequest({request:s,event:e})})));e.waitUntil(s),e.ports&&e.ports[0]&&s.then((()=>e.ports[0].postMessage(!0)))}}))}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const a=s.origin===location.origin,{params:n,route:r}=this.findMatchingRoute({event:t,request:e,sameOrigin:a,url:s});let i=r&&r.handler;const c=e.method;if(!i&&this._defaultHandlerMap.has(c)&&(i=this._defaultHandlerMap.get(c)),!i)return;let o;try{o=i.handle({url:s,request:e,event:t,params:n})}catch(e){o=Promise.reject(e)}const h=r&&r.catchHandler;return o instanceof Promise&&(this._catchHandler||h)&&(o=o.catch((async a=>{if(h)try{return await h.handle({url:s,request:e,event:t,params:n})}catch(e){e instanceof Error&&(a=e)}if(this._catchHandler)return this._catchHandler.handle({url:s,request:e,event:t});throw a}))),o}findMatchingRoute({url:e,sameOrigin:t,request:s,event:a}){const n=this._routes.get(s.method)||[];for(const r of n){let n;const i=r.match({url:e,sameOrigin:t,request:s,event:a});if(i)return n=i,(Array.isArray(n)&&0===n.length||i.constructor===Object&&0===Object.keys(i).length||"boolean"==typeof i)&&(n=void 0),{route:r,params:n}}return{}}setDefaultHandler(e,t="GET"){this._defaultHandlerMap.set(t,b(e))}setCatchHandler(e){this._catchHandler=b(e)}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(e){if(!this._routes.has(e.method))throw new a("unregister-route-but-not-found-with-method",{method:e.method});const t=this._routes.get(e.method).indexOf(e);if(!(t>-1))throw new a("unregister-route-route-not-registered");this._routes.get(e.method).splice(t,1)}}let k;class K extends q{constructor(e,t){super((({request:s})=>{const a=e.getURLsToCacheKeys();for(const n of function*(e,{ignoreURLParametersMatching:t=[/^utm_/,/^fbclid$/],directoryIndex:s="index.html",cleanURLs:a=!0,urlManipulation:n}={}){const r=new URL(e,location.href);r.hash="",yield r.href;const i=function(e,t=[]){for(const s of[...e.searchParams.keys()])t.some((e=>e.test(s)))&&e.searchParams.delete(s);return e}(r,t);if(yield i.href,s&&i.pathname.endsWith("/")){const e=new URL(i.href);e.pathname+=s,yield e.href}if(a){const e=new URL(i.href);e.pathname+=".html",yield e.href}if(n){const e=n({url:r});for(const t of e)yield t.href}}(s.url,t)){const t=a.get(n);if(t)return{cacheKey:t,integrity:e.getIntegrityForCacheKey(t)}}}),e.strategy)}}var T;T=[{'revision':'a22f50869d725a4bfc3823a739c2981a','url':'assets/Sherman/ww2_top_view_hull10.png'},{'revision':'5aa8050c94a20ab14dbc763e009c702a','url':'assets/Sherman/ww2_top_view_turret10.png'},{'revision':'a0d3eea18c478dfc91dd6553be9795ca','url':'assets/audios/Cannon/cannon_75mm_m3_shot_01.wav'},{'revision':'fedd8302a401600e2493dd5fd35b5f37','url':'assets/audios/Cannon/cannon_shell_drop_01.wav'},{'revision':'e6ff2fc444829386063cce35a0d2e3ca','url':'assets/audios/Cannon/reload_cannon_20mm_1.wav'},{'revision':'87710e942691ba84455fadea8f86d4bc','url':'assets/audios/Explosion/killscene_blast_ammoexplode_1.wav'},{'revision':'196a5a9058a8429975819d4636507ffc','url':'assets/audios/Explosion/tank_destroyed_03.wav'},{'revision':'b6ec4ca6c8ac5cfa7ae301e975cb45ad','url':'assets/audios/Hit/tank_hit_big_01.wav'},{'revision':'6e18acecc6ec9c17a941672dcc37d8ed','url':'assets/audios/Hit/tank_hit_med_01.wav'},{'revision':'ce3082dbb9f04afbc868725c69d28c82','url':'assets/audios/Hit/tank_hit_small_01.wav'},{'revision':'f36f6dfe9f51a0aae635b598b8ceb3b1','url':'assets/audios/Music/Erica.mp3'},{'revision':'2b013fe18c60ebe2a2361bce49733bc6','url':'assets/audios/Repair/extinguisher.wav'},{'revision':'d9485d595fc02f6cd7daedc86ed49f2f','url':'assets/audios/Speech/Damage/ge_tank_damaged_v2_r1_t1_mood_high.wav'},{'revision':'cb6a3a66dbd9cd19a792e86fe25be3b1','url':'assets/audios/Speech/Damage/ge_tank_damaged_v2_r2_t1_mood_high.wav'},{'revision':'3fc15700df94a355a0580e123c9fc8b3','url':'assets/audios/Speech/Damage/ge_tank_damaged_v2_r3_t1_mood_high.wav'},{'revision':'bcff034a2d6786a0bcdaa79b6bcdcf7d','url':'assets/audios/Speech/Damage/ge_tank_damaged_v2_r4_t1_mood_high.wav'},{'revision':'4ac059d2f78227ee228f685a9428ccf5','url':'assets/audios/Speech/Kill/ge_bomb_success_v3_r1_t1_mood_high.wav'},{'revision':'79ac3aaa89152cfdba90c787c6607a7a','url':'assets/audios/Speech/Kill/ge_bomb_success_v3_r2_t1_mood_high.wav'},{'revision':'5dc747bc62a56f628f62404f2c1bd5b8','url':'assets/audios/Speech/Kill/ge_bomb_success_v3_r3_t1_mood_high.wav'},{'revision':'c11da383cf2c9e6e607d41fcaf115934','url':'assets/audios/Speech/Kill/ge_bomb_success_v3_r4_t1_mood_high.wav'},{'revision':'9d8619973638205ef3069664c50c054f','url':'assets/audios/Speech/Kill/ge_bomb_success_v3_r5_t1_mood_high.wav'},{'revision':'8ec3a3d77ba38453e860182b6f62b8c1','url':'assets/audios/Track/tracks_speed_33_1.wav'},{'revision':'4d6ff601e3ca92874a0f25f8b146222d','url':'assets/barrel-grey-side-rust.png'},{'revision':'4b9da85b96ddde14aab85f1b11ad1d09','url':'assets/barrel-grey-side.png'},{'revision':'c9e80b715ecbab4eb6b6697aa5bdd45f','url':'assets/barrel-grey-top.png'},{'revision':'4c6b9bf95d24625cfe7615c489e4929c','url':'assets/barrel-red-side.png'},{'revision':'02a4ed01696099b3207f3e30e9e68812','url':'assets/barrel-red-top.png'},{'revision':'8bf4dbb1fd39a32c0503fff7b4b61bf9','url':'assets/font/font.fnt'},{'revision':'ef31d358125e351294f2f03d60bae83f','url':'assets/font/font.png'},{'revision':'b887c333d5ec8274b78d0851e7b3337b','url':'assets/images/phaser-logo.png'},{'revision':'6714fccbbe6a0c8e2737e452b508a836','url':'assets/images/tank.jpg'},{'revision':'d89e8b1055ea58afb123bd66f592b757','url':'assets/maps/levelMap.json'},{'revision':'e8868a107dd3a5b28018039ee752bc5c','url':'assets/medals/flat_medal1.png'},{'revision':'4d6ff601e3ca92874a0f25f8b146222d','url':'assets/obstacles/barrel-grey-side-rust.png'},{'revision':'4b9da85b96ddde14aab85f1b11ad1d09','url':'assets/obstacles/barrel-grey-side.png'},{'revision':'c9e80b715ecbab4eb6b6697aa5bdd45f','url':'assets/obstacles/barrel-grey-top.png'},{'revision':'4c6b9bf95d24625cfe7615c489e4929c','url':'assets/obstacles/barrel-red-side.png'},{'revision':'02a4ed01696099b3207f3e30e9e68812','url':'assets/obstacles/barrel-red-top.png'},{'revision':'a2829377942dd145eb99eec5b850d4a2','url':'assets/obstacles/tree-large.png'},{'revision':'906e0f210bb1aaf44e310844f7bbf696','url':'assets/obstacles/tree-small.png'},{'revision':'4041c38f8f7497d866d6e13bcf045333','url':'assets/pack.json'},{'revision':'edd16888d47c2148bbab2fc5335c0b4e','url':'assets/particles/smoke.png'},{'revision':'64758bf0cf6ee25d901c260184fb41ee','url':'assets/sprites/barrel-blue.png'},{'revision':'81bc804aae2018b3ae9e610d99a8d216','url':'assets/sprites/barrel-red.png'},{'revision':'00158066ebb349ffdadcdc81b3d130e2','url':'assets/sprites/bullet-blue.png'},{'revision':'4a273b23250f63b3f06eda3fa38f0926','url':'assets/sprites/bullet-red.png'},{'revision':'d9646540855e5aa7c2dd5c779c62d270','url':'assets/sprites/bulletBlue1.png'},{'revision':'882c09fc41e781b837804fd2e3e4e27b','url':'assets/sprites/explosion1.png'},{'revision':'f75ea2d3fec7df352a87c852c3f3b232','url':'assets/sprites/explosion2.png'},{'revision':'6e9e20e18355ff3188c3ce54f5177190','url':'assets/sprites/explosion3.png'},{'revision':'fb154d6532124f68dfea0bfe048b60b8','url':'assets/sprites/explosion4.png'},{'revision':'b3677fc64381d86cc867d99defd60e2b','url':'assets/sprites/explosion5.png'},{'revision':'52ebc2ffed900e4ea85408cd6f9f2d77','url':'assets/sprites/tank-blue.png'},{'revision':'edb6b872c01ac9e6aebe58e31da2fc25','url':'assets/sprites/tank-red.png'},{'revision':'928636c6d62973f0789fb78be4fd902e','url':'assets/sprites/tankBlue_barrel1.png'},{'revision':'38344825997005ff524c81bf1c8ae128','url':'assets/sprites/tankBody_blue.png'},{'revision':'b4a1e3ed3d95c28564dd346d495f08f7','url':'assets/tiles/tiles.png'},{'revision':'be0b7c90f79d205c65f36b28bb666cce','url':'assets/tool_wrench.png'},{'revision':'a2829377942dd145eb99eec5b850d4a2','url':'assets/tree-large.png'},{'revision':'906e0f210bb1aaf44e310844f7bbf696','url':'assets/tree-small.png'},{'revision':'d6f2466d8710867acd0489ed59c0bc5b','url':'assets/user-interfaces/Default/button_rectangle_depth_line.png'},{'revision':'02fa5aa3b32de6728469cd57c0c201bf','url':'assets/user-interfaces/Default/button_rectangle_line.png'},{'revision':'74ec0e34a4f22d1151719cb8525d2c63','url':'assets/user-interfaces/Default/button_round_depth_line.png'},{'revision':'f89542eb33168615d3505a7dcb5fbf2c','url':'assets/user-interfaces/Default/button_round_line.png'},{'revision':'8cb2181ef7ea15f37334c59a5323c432','url':'assets/user-interfaces/Default/button_square_depth_line.png'},{'revision':'e116af7b293e82eff8a741a5268565af','url':'assets/user-interfaces/Default/button_square_line.png'},{'revision':'9f677415f633a178f1e2d59ef35a66be','url':'assets/user-interfaces/Default/divider.png'},{'revision':'2f9a892848d3b4be41f2d8e65ea1056b','url':'assets/user-interfaces/Default/divider_edges.png'},{'revision':'8a7b6d634473c827db33227863318738','url':'assets/user-interfaces/Default/icon_arrow_down_dark.png'},{'revision':'a3f38292b61297ac6c660fee6ecb0488','url':'assets/user-interfaces/Default/icon_arrow_down_light.png'},{'revision':'76d6d13fab723dcddeb7560ab78a659a','url':'assets/user-interfaces/Default/icon_arrow_down_outline.png'},{'revision':'88c91dc2281d4d4e25bc3376e03709dc','url':'assets/user-interfaces/Default/icon_arrow_up_dark.png'},{'revision':'6b3973f541721243ade7b81cbd0b969a','url':'assets/user-interfaces/Default/icon_arrow_up_light.png'},{'revision':'4b829a358fd544987dff0e61f1ed9d49','url':'assets/user-interfaces/Default/icon_arrow_up_outline.png'},{'revision':'1e663bd03c1700be41b7e06eea01bf73','url':'assets/user-interfaces/Default/icon_play_dark.png'},{'revision':'532998e597c40f8d3aa21d3626f2720a','url':'assets/user-interfaces/Default/icon_play_light.png'},{'revision':'d47e070ee3d5cc2c14b0160ace804c58','url':'assets/user-interfaces/Default/icon_play_outline.png'},{'revision':'b13c0e8d67608befb768028dd8e266e5','url':'assets/user-interfaces/Default/icon_repeat_dark.png'},{'revision':'4f5439f799b71aa2cceb6b1380a784b9','url':'assets/user-interfaces/Default/icon_repeat_light.png'},{'revision':'8ae5e2206fde9a2bd7a43b2e266bdff6','url':'assets/user-interfaces/Default/icon_repeat_outline.png'},{'revision':'52b1dca8c9b81303fa24f8b74ca99e87','url':'assets/user-interfaces/Default/input_outline_rectangle.png'},{'revision':'81dbd8868d1f0e9399369806531fc2b8','url':'assets/user-interfaces/Default/input_outline_square.png'},{'revision':'9efe861befee98b3f81590fdcabd88be','url':'assets/user-interfaces/Default/input_rectangle.png'},{'revision':'c712e1035bf478e73b6f7c3e58cb5d61','url':'assets/user-interfaces/Default/input_square.png'},{'revision':'382cc4f34975fb434df3fe449d6f61e6','url':'assets/user-interfaces/Green/arrow_basic_e.png'},{'revision':'96c59a6b251192144fae3de8b8d7084e','url':'assets/user-interfaces/Green/arrow_basic_e_small.png'},{'revision':'bfa035dcd5ed4be27e304386212d7c74','url':'assets/user-interfaces/Green/arrow_basic_n.png'},{'revision':'3da8a539016514d1ac9fb9dfe6e6fd9a','url':'assets/user-interfaces/Green/arrow_basic_n_small.png'},{'revision':'59d87ddf08414280e071abd25b68cb65','url':'assets/user-interfaces/Green/arrow_basic_s.png'},{'revision':'91e28820eb178c0aa0de03b75b45ff53','url':'assets/user-interfaces/Green/arrow_basic_s_small.png'},{'revision':'745bf9bb701e85a4c4bb2ee752594b6e','url':'assets/user-interfaces/Green/arrow_basic_w.png'},{'revision':'1e7a66314eaa41368bc292570f2f4554','url':'assets/user-interfaces/Green/arrow_basic_w_small.png'},{'revision':'157e4784e568c853cb00e025e33a2a8e','url':'assets/user-interfaces/Green/arrow_decorative_e.png'},{'revision':'05227b4ef632157d97d168c0ea251945','url':'assets/user-interfaces/Green/arrow_decorative_e_small.png'},{'revision':'741ecf7c9bf5212ea5fd4cadb3bc3313','url':'assets/user-interfaces/Green/arrow_decorative_n.png'},{'revision':'ac1116262a74d2e721e3e0a5b0af06e6','url':'assets/user-interfaces/Green/arrow_decorative_n_small.png'},{'revision':'aa834410eee8f9ca54eb03a5e1152e86','url':'assets/user-interfaces/Green/arrow_decorative_s.png'},{'revision':'2bdcae5ff55f26e99635b98cc98352ad','url':'assets/user-interfaces/Green/arrow_decorative_s_small.png'},{'revision':'9cb2c7e92e00d8a0043fbbaec3f950ee','url':'assets/user-interfaces/Green/arrow_decorative_w.png'},{'revision':'5280087e5fd410a58aa75f0afc205622','url':'assets/user-interfaces/Green/arrow_decorative_w_small.png'},{'revision':'b193ae718ba58734eb0baf890ae95050','url':'assets/user-interfaces/Green/button_rectangle_border.png'},{'revision':'706d090f82d7d57008ff3fddbe4995df','url':'assets/user-interfaces/Green/button_rectangle_depth_border.png'},{'revision':'55b01b46ae4deb87c44717497b9da4f7','url':'assets/user-interfaces/Green/button_rectangle_depth_flat.png'},{'revision':'ee529eedc2bf275ff50f624eac48185a','url':'assets/user-interfaces/Green/button_rectangle_depth_gloss.png'},{'revision':'5dcb80e81d57ff5eae42ca2acaeb038d','url':'assets/user-interfaces/Green/button_rectangle_depth_gradient.png'},{'revision':'1bce4a663673490049061c48f587c642','url':'assets/user-interfaces/Green/button_rectangle_depth_line.png'},{'revision':'5bddf37b66a672b12e63e065b236abc4','url':'assets/user-interfaces/Green/button_rectangle_flat.png'},{'revision':'6c98275f526413a74990ea5c9d2eb832','url':'assets/user-interfaces/Green/button_rectangle_gloss.png'},{'revision':'9b3989d00ace5f0f89bd7d262eaf253e','url':'assets/user-interfaces/Green/button_rectangle_gradient.png'},{'revision':'f94a445bf7c5f84b0ccbf10b105422c7','url':'assets/user-interfaces/Green/button_rectangle_line.png'},{'revision':'41966b7a08a22c00f6fd3dcfbf7ebe49','url':'assets/user-interfaces/Green/button_round_border.png'},{'revision':'5480c96af26a2e53fb62f27c349a00b3','url':'assets/user-interfaces/Green/button_round_depth_border.png'},{'revision':'179fbfd9dfbfcfb595936d258bc41f6a','url':'assets/user-interfaces/Green/button_round_depth_flat.png'},{'revision':'0cddcc0d5b01f5b72ac32333cc132493','url':'assets/user-interfaces/Green/button_round_depth_gloss.png'},{'revision':'6924b0236cf69c72b672dd70af730bdd','url':'assets/user-interfaces/Green/button_round_depth_gradient.png'},{'revision':'ce3536437d721c0923c95fbbe22474f6','url':'assets/user-interfaces/Green/button_round_depth_line.png'},{'revision':'bcee6424db19abcb8ba0375f9763a488','url':'assets/user-interfaces/Green/button_round_flat.png'},{'revision':'f42fc2b736b30b81aff8c1005e5064e0','url':'assets/user-interfaces/Green/button_round_gloss.png'},{'revision':'77d5e5b09f1508ae07814d608e1ee898','url':'assets/user-interfaces/Green/button_round_gradient.png'},{'revision':'679e261670d652c19e2a475bbc5de004','url':'assets/user-interfaces/Green/button_round_line.png'},{'revision':'47f7bd0012b590144d8c41e953d26bff','url':'assets/user-interfaces/Green/button_square_border.png'},{'revision':'1e99a07033fc7c0212259efb3865ef3b','url':'assets/user-interfaces/Green/button_square_depth_border.png'},{'revision':'3a6401a1997edf76351ce51c2b32b061','url':'assets/user-interfaces/Green/button_square_depth_flat.png'},{'revision':'bf28e50131304dffa1d73adb8a7624e2','url':'assets/user-interfaces/Green/button_square_depth_gloss.png'},{'revision':'60b585d69993b262dd02983a216dfb99','url':'assets/user-interfaces/Green/button_square_depth_gradient.png'},{'revision':'17034f9c3d5b5812624f223f1df175dc','url':'assets/user-interfaces/Green/button_square_depth_line.png'},{'revision':'c6cce33f1776b92c73ba90793cc7f344','url':'assets/user-interfaces/Green/button_square_flat.png'},{'revision':'12acae0c8bad6105b86d7466d65ec23d','url':'assets/user-interfaces/Green/button_square_gloss.png'},{'revision':'6657546a9b9fc7758b853dfbb006368d','url':'assets/user-interfaces/Green/button_square_gradient.png'},{'revision':'4413e7c55ec872103c7c436eca71a0e8','url':'assets/user-interfaces/Green/button_square_line.png'},{'revision':'80ff8de59fb77eaad222b8a3a14e53dc','url':'assets/user-interfaces/Green/check_round_color.png'},{'revision':'308b8f3d99faedbb09569b0ddae97696','url':'assets/user-interfaces/Green/check_round_grey.png'},{'revision':'0a7a25b3f752864353eabab308e18ff7','url':'assets/user-interfaces/Green/check_round_grey_circle.png'},{'revision':'ea19c9990438a984450efc519ff8e869','url':'assets/user-interfaces/Green/check_round_round_circle.png'},{'revision':'33fbd00c4fa99810f5f1896321ba8dcf','url':'assets/user-interfaces/Green/check_square_color.png'},{'revision':'a30a6b9857ebad0c00b1fcdd1341817e','url':'assets/user-interfaces/Green/check_square_color_checkmark.png'},{'revision':'57fb5206adf572b216edf272cafec1ac','url':'assets/user-interfaces/Green/check_square_color_cross.png'},{'revision':'1b4685a52b570a4a6106dd194c7ca637','url':'assets/user-interfaces/Green/check_square_color_square.png'},{'revision':'52549667eef87666e8f88dfd2115ba63','url':'assets/user-interfaces/Green/check_square_grey.png'},{'revision':'5673e8782a741c652892a32688584f7d','url':'assets/user-interfaces/Green/check_square_grey_checkmark.png'},{'revision':'ab3acd34eb8da7ab94566d6c5cb9b424','url':'assets/user-interfaces/Green/check_square_grey_cross.png'},{'revision':'0080cb57d2d7c3dad6ad8452b5bd447f','url':'assets/user-interfaces/Green/check_square_grey_square.png'},{'revision':'0ad59290c7a7daaafca158ba9a912e9c','url':'assets/user-interfaces/Green/icon_checkmark.png'},{'revision':'817b45552b0fdf487e4e1f47883e603e','url':'assets/user-interfaces/Green/icon_circle.png'},{'revision':'7dcdfc5968fc6a0786c9efad191d8b3d','url':'assets/user-interfaces/Green/icon_cross.png'},{'revision':'ac94eb8e99fe64c2759ebb819bfc4e45','url':'assets/user-interfaces/Green/icon_outline_checkmark.png'},{'revision':'014b523afd27837f1fcf465a1a0bbe3c','url':'assets/user-interfaces/Green/icon_outline_circle.png'},{'revision':'69978a63ff4e63c8fa1cce1e7224a73f','url':'assets/user-interfaces/Green/icon_outline_cross.png'},{'revision':'81f81050ec7c4cf03746c29acf714aa1','url':'assets/user-interfaces/Green/icon_outline_square.png'},{'revision':'f3624d2a3c2f8e969466a55ec81bde09','url':'assets/user-interfaces/Green/icon_square.png'},{'revision':'7af7496198118f7b3ef1bba209be7a1d','url':'assets/user-interfaces/Green/slide_hangle.png'},{'revision':'eb78d7fcdf7782bf8d7f62f50305f72b','url':'assets/user-interfaces/Green/slide_horizontal_color.png'},{'revision':'fe991bc979e46b0e8a79b8241c79b702','url':'assets/user-interfaces/Green/slide_horizontal_color_section.png'},{'revision':'7f30efe5aabeedae8eb5991d15115e2a','url':'assets/user-interfaces/Green/slide_horizontal_color_section_wide.png'},{'revision':'2c6bb0a880a7a4c34178fdf5a3b9b3ec','url':'assets/user-interfaces/Green/slide_horizontal_grey.png'},{'revision':'ab65c8440ca811d45e8ba204e6a4a97d','url':'assets/user-interfaces/Green/slide_horizontal_grey_section.png'},{'revision':'5dbd59c28ff80211b41eb323f9d51104','url':'assets/user-interfaces/Green/slide_horizontal_grey_section_wide.png'},{'revision':'2004649126e92755d81e0a7c68adf59f','url':'assets/user-interfaces/Green/slide_vertical_color.png'},{'revision':'79c8164d3c27dbb4778a363fc62f3a77','url':'assets/user-interfaces/Green/slide_vertical_color_section.png'},{'revision':'60dcf08c647cac818ef0f8beafcb5180','url':'assets/user-interfaces/Green/slide_vertical_color_section_wide.png'},{'revision':'34733c14631a6ab034cb851f9c830c39','url':'assets/user-interfaces/Green/slide_vertical_grey.png'},{'revision':'39fb47c443764a3c51b65d5d880ba595','url':'assets/user-interfaces/Green/slide_vertical_grey_section.png'},{'revision':'9f7854c044e0510ae1104ab17fe0ed3f','url':'assets/user-interfaces/Green/slide_vertical_grey_section_wide.png'},{'revision':'8fd1999aaee8f3fbaf49b26446125fa7','url':'assets/user-interfaces/Green/star.png'},{'revision':'1576133399e8e59baed5b9ca9e8bd475','url':'assets/user-interfaces/Green/star_outline.png'},{'revision':'f60cc21709c8f411af03a4c552bae214','url':'assets/user-interfaces/Green/star_outline_depth.png'},{'revision':'7d3f7607ade3610c4f55f2752b4d29d7','url':'assets/user-interfaces/icons/audioOff.png'},{'revision':'f221148ae35ea6e3f2895fa31b7a1ef6','url':'assets/user-interfaces/icons/audioOn.png'},{'revision':'6a77d358fb14b338a99350881bfc6c28','url':'assets/user-interfaces/icons/forward.png'},{'revision':'b60ceb7c2a4d7ec9a61df4288cbff016','url':'assets/user-interfaces/icons/home.png'},{'revision':'65b43431ceda5949121d9cb56bb262ff','url':'assets/user-interfaces/icons/pause.png'},{'revision':'2483d25f89d2ccd528d6448568f47d89','url':'assets/user-interfaces/icons/return.png'},{'revision':'57040e5677322118f6d56a1d9e43c5c6','url':'favicon.ico'},{'revision':'2ffbc23293ee8a797bc61e9c02534206','url':'icons/icons-192.png'},{'revision':'8bdcc486cda9b423f50e886f2ddb6604','url':'icons/icons-512.png'},{'revision':'1e4a91c4c9d860ec98e78318ba5765a8','url':'index.html'},{'revision':null,'url':'main.d97457f8ddc53bdc5233.bundle.js'},{'revision':'4b7794a9c6ccfc90c36c434a89288a64','url':'manifest.json'},{'revision':null,'url':'vendors.6b2b307f762d3cca4c88.bundle.js'},{'revision':'bd5b234274f46d53c26c6a2587d17163','url':'vendors.6b2b307f762d3cca4c88.bundle.js.LICENSE.txt'}],C().precache(T),function(e){const t=C();!function(e,t,s){let n;if("string"==typeof e){const a=new URL(e,location.href);n=new q((({url:e})=>e.href===a.href),t,s)}else if(e instanceof RegExp)n=new U(e,t,s);else if("function"==typeof e)n=new q(e,t,s);else{if(!(e instanceof q))throw new a("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});n=e}(k||(k=new L,k.addFetchListener(),k.addCacheListener()),k).registerRoute(n)}(new K(t,e))}(undefined)})();