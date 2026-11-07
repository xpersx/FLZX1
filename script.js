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

  // Animated background, kept light for phones.
  const canvas=document.createElement('canvas');canvas.id='flz-particles';document.body.prepend(canvas);
  const ctx=canvas.getContext('2d',{alpha:true});
  let width=0,height=0,particles=[],frame=0;
  function resizeCanvas(){
    const ratio=Math.min(devicePixelRatio||1,mobile?1:1.35);
    width=innerWidth;height=innerHeight;canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
    canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(ratio,0,0,ratio,0,0);
    const count=Math.min(mobile?22:48,Math.max(12,Math.floor(width/(mobile?18:25))));
    particles=Array.from({length:count},()=>({x:Math.random()*width,y:Math.random()*height,r:Math.random()*1.4+.4,vx:(Math.random()-.5)*.15,vy:-Math.random()*.18-.025,a:Math.random()*.32+.12}));
  }
  function animate(){
    ctx.clearRect(0,0,width,height);
    for(const p of particles){
      p.x+=p.vx;p.y+=p.vy;if(p.y<-5){p.y=height+5;p.x=Math.random()*width}
      if(p.x<-5)p.x=width+5;if(p.x>width+5)p.x=-5;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(255,212,0,'+p.a+')';ctx.fill();
    }
    frame=requestAnimationFrame(animate);
  }
  resizeCanvas();if(!reduced)animate();
  addEventListener('resize',resizeCanvas,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(frame);else if(!reduced)animate()});

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
  const progress=document.createElement('div');progress.id='flz-scroll-progress';document.body.appendChild(progress);
  let scrollQueued=false;
  addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%';scrollQueued=false;});}},{passive:true});

  // Subtle card spotlight.
  if(!mobile&&!reduced)document.querySelectorAll('.card').forEach(card=>card.addEventListener('pointermove',e=>{
    const r=card.getBoundingClientRect();card.style.setProperty('--card-x',(e.clientX-r.left)+'px');card.style.setProperty('--card-y',(e.clientY-r.top)+'px');
  },{passive:true}));

  // Custom cursor ring on desktop; native touch behavior remains untouched.
  if(!mobile&&!reduced){
    const cursor=document.createElement('div');cursor.id='flz-cursor';document.body.appendChild(cursor);
    let cursorX=0,cursorY=0,targetX=0,targetY=0;
    addEventListener('pointermove',e=>{targetX=e.clientX;targetY=e.clientY;cursor.classList.add('visible')},{passive:true});
    function moveCursor(){cursorX+=(targetX-cursorX)*.24;cursorY+=(targetY-cursorY)*.24;cursor.style.left=cursorX+'px';cursor.style.top=cursorY+'px';requestAnimationFrame(moveCursor)}
    moveCursor();
    document.addEventListener('pointerover',e=>cursor.classList.toggle('active',!!e.target.closest('a,button,.card,.social')));
    document.addEventListener('pointerout',e=>{if(!e.relatedTarget)cursor.classList.remove('visible')});
  }

  // Click sounds using Web Audio; user can toggle them. No audio files/network.
  let soundEnabled=true,audioContext=null;
  function clickSound(){
    if(!soundEnabled||reduced)return;
    try{
      const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;
      audioContext=audioContext||new AudioCtx();if(audioContext.state==='suspended')audioContext.resume();
      const osc=audioContext.createOscillator(),gain=audioContext.createGain(),now=audioContext.currentTime;
      osc.type='sine';osc.frequency.setValueAtTime(620,now);osc.frequency.exponentialRampToValueAtTime(940,now+.045);
      gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.035,now+.008);gain.gain.exponentialRampToValueAtTime(.0001,now+.075);
      osc.connect(gain);gain.connect(audioContext.destination);osc.start(now);osc.stop(now+.08);
    }catch(e){}
  }
  document.addEventListener('click',e=>{if(e.target.closest('a,button,.card,.social'))clickSound();},true);

  // Draggable FLZ Script pill: pointer events work with mouse and touch.
  const widget=document.createElement('div');widget.id='flz-float-widget';
  widget.innerHTML='<span class="float-brand"><b>FLZ</b> SCRIPT</span><button class="float-open" type="button">ABRIR ↗</button><button class="float-sound" type="button" aria-label="Silenciar sonidos">♫ ON</button>';
  document.body.appendChild(widget);
  const openButton=widget.querySelector('.float-open'),soundButton=widget.querySelector('.float-sound');
  openButton.addEventListener('click',e=>{e.stopPropagation();showScriptDetails();});
  soundButton.addEventListener('click',e=>{e.stopPropagation();soundEnabled=!soundEnabled;soundButton.textContent=soundEnabled?'♫ ON':'♫ OFF';soundButton.setAttribute('aria-label',soundEnabled?'Silenciar sonidos':'Activar sonidos');if(soundEnabled)clickSound();});
  let dragging=false,moved=false,startX=0,startY=0,originX=0,originY=0;
  widget.addEventListener('pointerdown',e=>{
    if(e.target.closest('button'))return;
    const rect=widget.getBoundingClientRect();dragging=true;moved=false;startX=e.clientX;startY=e.clientY;originX=rect.left;originY=rect.top;
    widget.classList.add('dragging');widget.setPointerCapture(e.pointerId);
  });
  widget.addEventListener('pointermove',e=>{
    if(!dragging)return;const dx=e.clientX-startX,dy=e.clientY-startY;
    if(Math.abs(dx)+Math.abs(dy)>5)moved=true;
    if(moved){const x=Math.max(6,Math.min(innerWidth-widget.offsetWidth-6,originX+dx));const y=Math.max(6,Math.min(innerHeight-widget.offsetHeight-6,originY+dy));widget.style.left=x+'px';widget.style.top=y+'px';widget.style.right='auto';widget.style.bottom='auto';}
  });
  const stopDrag=()=>{dragging=false;widget.classList.remove('dragging');};
  widget.addEventListener('pointerup',stopDrag);widget.addEventListener('pointercancel',stopDrag);

  // Cookie preferences. Versioned key ensures the updated banner appears once.
  const key='flz-privacy-choice-v2';
  const safeGet=()=>{try{return localStorage.getItem(key)}catch(e){return null}};
  const safeSet=value=>{try{localStorage.setItem(key,JSON.stringify({choice:value,savedAt:new Date().toISOString()}));}catch(e){}};
  const banner=document.createElement('aside');banner.id='flz-cookie-banner';banner.setAttribute('role','dialog');banner.setAttribute('aria-label','Aviso de privacidad');
  banner.innerHTML='<h3>Tu privacidad es importante</h3><p>Este sitio utiliza almacenamiento local para recordar tu elección. Actualmente no activa herramientas propias de publicidad ni analítica. Los servicios externos y el alojamiento pueden aplicar sus propias tecnologías. Lee la <a href="legal.html#privacidad" style="color:#ffe45c">política de privacidad</a> y la <a href="legal.html#cookies" style="color:#ffe45c">política de cookies</a>.</p><div class="cookie-actions"><button class="accept" id="flz-cookie-accept">Aceptar</button><button id="flz-cookie-reject">Rechazar opcionales</button><button id="flz-cookie-config">Configurar</button></div>';
  document.body.appendChild(banner);
  const modal=document.createElement('div');modal.id='flz-cookie-modal';
  modal.innerHTML='<div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="flz-cookie-title"><h3 id="flz-cookie-title">Preferencias de privacidad</h3><p>En esta versión no se han integrado herramientas opcionales de analítica ni publicidad. Por eso no se activan categorías opcionales desde este panel.</p><div class="cookie-option"><span>Almacenamiento de tu elección</span><strong>Esencial</strong></div><div class="cookie-option"><span>Analítica opcional</span><span>No instalada</span></div><div class="cookie-option"><span>Publicidad opcional</span><span>No instalada</span></div><div class="cookie-actions"><button class="accept" id="flz-cookie-save">Guardar y cerrar</button><button id="flz-cookie-close">Cerrar</button></div></div>';
  document.body.appendChild(modal);
  const hideConsent=choice=>{safeSet(choice);banner.classList.remove('show');modal.classList.remove('show');};
  if(!safeGet())banner.classList.add('show');
  banner.querySelector('#flz-cookie-accept').addEventListener('click',()=>hideConsent('accepted'));
  banner.querySelector('#flz-cookie-reject').addEventListener('click',()=>hideConsent('rejected'));
  banner.querySelector('#flz-cookie-config').addEventListener('click',()=>modal.classList.add('show'));
  modal.querySelector('#flz-cookie-save').addEventListener('click',()=>hideConsent('custom-no-optional-tools'));
  modal.querySelector('#flz-cookie-close').addEventListener('click',()=>modal.classList.remove('show'));
  modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show')});
  document.getElementById('open-cookie-settings')?.addEventListener('click',()=>{banner.classList.add('show');modal.classList.add('show')});
});
