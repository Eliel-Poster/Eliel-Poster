/* Foreground film playback, native media dialogs and the brand's localized white hover. */
(() => {
 const hero=document.querySelector('.reel-hero');
 if(!hero)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(hover:hover) and (pointer:fine)');
 const preview=document.querySelector('#hero-reel');
 const toggle=document.querySelector('.reel-toggle');
 const dialogs=[...document.querySelectorAll('.media-dialog')];
 let heroVisible=false,userPaused=false,explicitPlay=false,opener=null,oldOverflow='';
 function syncToggle(){
  const playing=!preview.paused;
  toggle.querySelector('[data-reel-label]').textContent=playing?'Pause':'Lire';
  toggle.querySelector('[data-reel-icon]').textContent=playing?'Ⅱ':'▶';
  toggle.setAttribute('aria-label',playing?'Mettre le film en pause':'Lire l’aperçu du film');
 }
 function playPreview(){preview.play().catch(syncToggle);}
 function syncPreview(){
  const allowed=explicitPlay||(!reduced.matches&&!navigator.connection?.saveData);
  if(allowed&&heroVisible&&!userPaused&&!document.hidden&&!dialogs.some(d=>d.open))playPreview();else preview.pause();
 }
 preview.controls=false;
 document.body.classList.add('media-ready');
 preview.addEventListener('play',syncToggle);preview.addEventListener('pause',syncToggle);
 toggle.addEventListener('click',()=>{if(preview.paused){userPaused=false;explicitPlay=true;playPreview();}else{userPaused=true;preview.pause();}});
 if('IntersectionObserver' in window){
  new IntersectionObserver(([entry])=>{
   document.body.classList.toggle('hero-past',!entry.isIntersecting);
  },{rootMargin:'-78px 0px 0px 0px'}).observe(hero);
  new IntersectionObserver(([entry])=>{heroVisible=entry.isIntersecting;syncPreview();},{threshold:.2}).observe(preview);
 }else{heroVisible=true;syncPreview();}
 document.addEventListener('visibilitychange',syncPreview);
 reduced.addEventListener('change',()=>{explicitPlay=false;syncPreview();});
 function openDialog(dialog,trigger){
  opener=trigger;preview.pause();oldOverflow=document.documentElement.style.overflow;
  document.documentElement.style.overflow='hidden';dialog.showModal();
  const video=dialog.querySelector('video');
  if(video){video.currentTime=0;video.play().catch(()=>{});}
 }
 document.querySelectorAll('[data-open-film],[data-open-artwork]').forEach(trigger=>trigger.addEventListener('click',event=>{
  if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  event.preventDefault();openDialog(document.getElementById(trigger.hasAttribute('data-open-film')?'film-dialog':'artwork-dialog'),trigger);
 }));
 dialogs.forEach(dialog=>{
  dialog.querySelector('[data-close-dialog]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close();});
  dialog.addEventListener('close',()=>{dialog.querySelector('video')?.pause();document.documentElement.style.overflow=oldOverflow;opener?.focus({preventScroll:true});syncPreview();});
 });
 addEventListener('pagehide',()=>{preview.pause();dialogs.forEach(d=>{d.querySelector('video')?.pause();if(d.open)d.close();});});
 const wordmark=hero.querySelector('.studio-wordmark');
 const letters=[...wordmark.children];
 let frame=0,x=0,y=0,tx=0,ty=0,ready=false;
 function clear(){cancelAnimationFrame(frame);frame=0;ready=false;wordmark.classList.remove('is-spotlit');}
 function draw(){
  frame=0;x+=(tx-x)*.25;y+=(ty-y)*.25;
  letters.forEach(el=>{const r=el.getBoundingClientRect();el.style.setProperty('--spot-x',`${x-r.left}px`);el.style.setProperty('--spot-y',`${y-r.top}px`);el.style.setProperty('--spot-radius',`${Math.min(125,r.height*.55)}px`);});
  wordmark.classList.add('is-spotlit');
  if(Math.abs(tx-x)+Math.abs(ty-y)>.2)frame=requestAnimationFrame(draw);
 }
 wordmark.addEventListener('pointermove',event=>{if(!fine.matches||reduced.matches||event.pointerType==='touch')return;tx=event.clientX;ty=event.clientY;if(!ready){x=tx;y=ty;ready=true;}if(!frame)frame=requestAnimationFrame(draw);},{passive:true});
 wordmark.addEventListener('pointerleave',clear);wordmark.addEventListener('pointercancel',clear);
 addEventListener('resize',clear);addEventListener('scroll',clear,{passive:true});addEventListener('blur',clear);
 fine.addEventListener('change',clear);reduced.addEventListener('change',clear);
})();
