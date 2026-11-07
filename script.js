function showScriptDetails(){
  const home=document.getElementById('home'),detail=document.getElementById('detail');
  if(home)home.style.display='none';if(detail)detail.style.display='block';
  history.replaceState(null,'','#FLZ-script');window.scrollTo({top:0,behavior:'smooth'});
}
function showHome(){
  const home=document.getElementById('home'),detail=document.getElementById('detail');
  if(detail)detail.style.display='none';if(home)home.style.display='block';
  history.replaceState(null,'',location.pathname+location.search);window.scrollTo({top:0,behavior:'smooth'});
}
function placeholder(event,network){event.preventDefault();alert('Añade aquí el enlace oficial de FLZ en '+network+'.');}

document.addEventListener('DOMContentLoaded',()=>{
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile=window.matchMedia('(pointer:coarse)').matches;

  // Loader: short and never blocks the page for long.
  const loader=document.createElement('div');
  loader.id='flz-loader';
  loader.innerHTML='<div class="loader-inner"><div class="loader-logo">FLZ<span>.</span></div><div class="loader-caption">PREPARANDO TU EXPERIENCIA</div><div class="loader-track"></div></div>';
  document.body.appendChild(loader);
  const removeLoader=()=>loader.classList.add('done');
  window.addEventListener('load',()=>setTimeout(removeLoader,350),{once:true});
  setTimeout(removeLoader,1600);

  // Minimal background: no particle canvas or decorative lightning overlays.
  // Ecuador time zone, independent of device timezone settings.
  const clock=document.getElementById('live-clock'),date=document.getElementById('live-date');
  const timeFormatter=new Intl.DateTimeFormat('es-EC',{timeZone:'America/Guayaquil',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
  const dateFormatter=new Intl.DateTimeFormat('es-EC',{timeZone:'America/Guayaquil',weekday:'short',day:'2-digit',month:'short',year:'numeric'});
  function updateClock(){const now=new Date();if(clock)clock.textContent=timeFormatter.format(now);if(date)date.textContent=dateFormatter.format(now).replace(/,/g,'').toUpperCase();}
  updateClock();setInterval(updateClock,1000);

  // Reveal-on-scroll and staggered cards.
  const revealItems=document.querySelectorAll('.content,.section-top,.card,.social,.detail-grid,.panel');
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver((entries,obs)=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');obs.unobserve(entry.target);}
    }),{threshold:.08,rootMargin:'0px 0px -25px 0px'});
    revealItems.forEach((el,i)=>{el.classList.add('reveal');el.style.transitionDelay=(el.classList.contains('card')?(i%3)*75:0)+'ms';observer.observe(el);});
  }else revealItems.forEach(el=>el.classList.add('is-visible'));

  // Scroll progress indicator.
  const progress=document.createElement('div');progress.id='flz-scroll-progress';progress.innerHTML='<span id="flz-progress-spark" aria-hidden="true">⚡</span>';document.body.appendChild(progress);
  let scrollQueued=false;
  addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%';scrollQueued=false;});}},{passive:true});

  // Click sounds using Web Audio; user can toggle them. No audio files/network.
  let soundEnabled=true,audioContext=null;
  function clickSound(hover=false){
    if(!soundEnabled||reduced)return;
    try{
      const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;
      audioContext=audioContext||new AudioCtx();if(audioContext.state==='suspended')audioContext.resume();
      const osc=audioContext.createOscillator(),gain=audioContext.createGain(),now=audioContext.currentTime;
      osc.type='sine';osc.frequency.setValueAtTime(hover ? 390 : 520,now);osc.frequency.exponentialRampToValueAtTime(hover ? 520 : 760,now+(hover ? .075 : .055));
      gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(hover ? .009 : .016,now+.018);gain.gain.exponentialRampToValueAtTime(.0001,now+(hover ? .15 : .12));
      osc.connect(gain);gain.connect(audioContext.destination);osc.start(now);osc.stop(now+(hover ? .16 : .13));
    }catch(e){}
  }
  document.addEventListener('click',e=>{if(e.target.closest('a,button,.card,.social'))clickSound(false);},true);
  // Quiet hover sound starts automatically; no permission popup.
  let lastHoverSound=0;
  if(!mobile)document.addEventListener('pointerover',e=>{const item=e.target.closest('a,button,.card,.social,.stat');if(item&&!item.contains(e.relatedTarget)){const now=performance.now();if(now-lastHoverSound>95){lastHoverSound=now;clickSound(true);}}},{passive:true});

  // The featured script card opens the details view on click or keyboard activation.
  const featuredCard=document.querySelector('.script-featured');
  if(featuredCard){
    featuredCard.addEventListener('click',event=>{
      if(event.target.closest('a,button'))return;
      showScriptDetails();
    });
    featuredCard.addEventListener('keydown',event=>{
      if(event.key==='Enter'||event.key===' '){
        event.preventDefault();
        showScriptDetails();
      }
    });
  }

  // Privacy notice: this site currently stores only the user's dismissal choice.
  const key='flz-privacy-notice-v3';
  const safeGet=()=>{try{return localStorage.getItem(key)}catch(e){return null}};
  const safeSet=value=>{try{localStorage.setItem(key,value)}catch(e){}};
  const banner=document.createElement('aside');
  banner.id='flz-cookie-banner';
  banner.setAttribute('role','dialog');
  banner.setAttribute('aria-label','Aviso de privacidad');
  banner.innerHTML='<h3>Privacidad y almacenamiento local</h3><p>FLZ guarda en tu navegador únicamente la preferencia de cerrar este aviso. En esta versión no se han integrado herramientas propias de analítica ni publicidad. El alojamiento y los servicios externos pueden tratar datos técnicos según sus propias políticas. Consulta nuestra <a href="legal.html#privacidad" style="color:#ffe45c">política de privacidad</a> y <a href="legal.html#cookies" style="color:#ffe45c">política de cookies</a>.</p><div class="cookie-actions"><button class="accept" id="flz-cookie-accept">Entendido</button><a class="cookie-policy-link" href="legal.html#cookies">Leer política</a></div>';
  document.body.appendChild(banner);
  const modal=document.createElement('div');
  modal.id='flz-cookie-modal';
  modal.innerHTML='<div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="flz-cookie-title"><h3 id="flz-cookie-title">Información de almacenamiento</h3><p>La web usa localStorage para recordar que cerraste este aviso. No hay categorías opcionales de analítica o publicidad activas en esta versión. Puedes borrar esta preferencia desde la configuración de datos del sitio en tu navegador.</p><div class="cookie-option"><span>Preferencia para cerrar este aviso</span><strong>Almacenamiento local</strong></div><div class="cookie-option"><span>Analítica propia</span><span>No integrada</span></div><div class="cookie-option"><span>Publicidad propia</span><span>No integrada</span></div><div class="cookie-actions"><button class="accept" id="flz-cookie-close">Cerrar</button></div></div>';
  document.body.appendChild(modal);
  const hideNotice=()=>{safeSet('dismissed');banner.classList.remove('show');modal.classList.remove('show')};
  if(!safeGet())banner.classList.add('show');
  banner.querySelector('#flz-cookie-accept').addEventListener('click',hideNotice);
  document.getElementById('open-cookie-settings')?.addEventListener('click',()=>{modal.classList.add('show')});
});
