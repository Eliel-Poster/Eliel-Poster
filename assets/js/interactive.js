/* Keep only one foreground film playing, and release playback when it leaves view. */
(() => {
 const videos=[...document.querySelectorAll('video')];
 videos.forEach(video=>video.addEventListener('play',()=>videos.forEach(other=>{if(other!==video)other.pause();})));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)videos.forEach(video=>video.pause());});
 if('IntersectionObserver' in window){
  const visible=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)entry.target.pause();}));
  videos.filter(video=>video.id!=='hero-reel'&&!video.closest('dialog')).forEach(video=>visible.observe(video));
 }
})();
