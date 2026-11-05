(function(){'use strict';
const score=document.getElementById('original-score');
const foreground=document.getElementById('sa-v25-audio');
const status=document.getElementById('obsidian-status');
if(!score||!status||!foreground)return;
let intentionallyStopped=false;
let initialTried=false;
let pending=false;
let unlocked=false;
const types=['touchend','pointerup','click','keydown'];
const manualSelector='[data-obsidian-toggle],#audio-toggle,#obsidian-mini,#obsidian-panel-open,#obsidian-panel-close,#obsidian-volume,#obsidian-loop';
const songSelector='#sa-v25-song-play,#sa-v25-audio,.sa-v25-dock button';
function stopRetry(){intentionallyStopped=true;removeTriggers();}
function removeTriggers(){types.forEach(t=>document.removeEventListener(t,onGesture,true))}
function isValidGesture(e){
 if(e.type==='keydown')return ['Enter',' ','Spacebar'].includes(e.key);
 if(e.type==='touchend' && e.changedTouches && e.changedTouches.length>1)return false;
 return true;
}
function onGesture(event){
 if(intentionallyStopped||!score.paused||!foreground.paused){if(!score.paused||intentionallyStopped)removeTriggers();return}
 if(!isValidGesture(event))return;
 if(event.target?.closest?.(manualSelector)||event.target?.closest?.(songSelector))return;
 // A user action (tap/click/keyboard), not an autoplay workaround via muted sound.
 attempt(true);
}
function attempt(fromGesture){
 if(intentionallyStopped||!score.paused||!foreground.paused)return;
 if(pending&&!fromGesture)return;
 try{
  const promise=score.play();
  pending=true;
  if(promise&&typeof promise.then==='function'){
   promise.then(()=>{pending=false;unlocked=true;removeTriggers();status.textContent='THE OBSIDIAN DOOR · atmosphere playing';})
    .catch(error=>{
     pending=false;
     if(intentionallyStopped||!score.paused)return;
     if(error?.name==='NotAllowedError'||error?.name==='AbortError'){
       status.textContent='Votre navigateur attend un geste : touchez la page pour entendre THE OBSIDIAN DOOR.';
     }else status.textContent='La musique ne démarre pas. Touchez PLAY ATMOSPHERE pour réessayer.';
    });
  }else{pending=false;if(!score.paused){unlocked=true;removeTriggers()}}
 }catch(_){pending=false}
}
function init(){
 score.autoplay=true;
 score.loop=document.getElementById('obsidian-loop')?.checked??true;
 // Install before the initial autoplay promise settles: the earliest tap cannot be missed.
 types.forEach(t=>document.addEventListener(t,onGesture,true));
 document.querySelectorAll('[data-obsidian-toggle],#audio-toggle').forEach(x=>x.addEventListener('click',stopRetry,{capture:true}));
 score.addEventListener('play',()=>{unlocked=true;removeTriggers();status.textContent='THE OBSIDIAN DOOR · atmosphere playing'});
 foreground.addEventListener('play',removeTriggers);
 attempt(false);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();