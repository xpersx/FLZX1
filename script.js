function showScriptDetails(){
  document.getElementById('home').style.display='none';
  document.getElementById('detail').style.display='block';
  history.replaceState(null,'','#FLZ-script');
  window.scrollTo({top:0,behavior:'smooth'});
}
function showHome(){
  document.getElementById('detail').style.display='none';
  document.getElementById('home').style.display='block';
  history.replaceState(null,'',location.pathname+location.search);
  window.scrollTo({top:0,behavior:'smooth'});
}
function placeholder(event,network){
  event.preventDefault();
  alert('Añade aquí el enlace oficial de FLZ en '+network+'.');
}
document.addEventListener('DOMContentLoaded',function(){
  if(location.hash==='#FLZ-script') showScriptDetails();
});

// Smooth reveal, scroll progress and subtle pointer ambience
document.addEventListener('DOMContentLoaded',function(){
  const progress=document.createElement('div');
  progress.id='scroll-progress';
  document.body.appendChild(progress);
  const updateProgress=()=>{
    const max=document.documentElement.scrollHeight-window.innerHeight;
    progress.style.width=(max>0?(window.scrollY/max)*100:0)+'%';
  };
  updateProgress();
  window.addEventListener('scroll',updateProgress,{passive:true});
  window.addEventListener('resize',updateProgress);

  const revealTargets=document.querySelectorAll('.content,.section-top,.card,.social,.stat,.detail-grid,.panel');
  revealTargets.forEach((el)=>{
    if(!el.classList.contains('hero')) el.classList.add('reveal');
  });
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver((entries,obs)=>{
      entries.forEach((entry)=>{
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },{threshold:0.12,rootMargin:'0px 0px -35px 0px'});
    revealTargets.forEach((el)=>observer.observe(el));
  }else{
    revealTargets.forEach((el)=>el.classList.add('is-visible'));
  }

  if(window.matchMedia('(pointer:fine)').matches){
    window.addEventListener('pointermove',(event)=>{
      document.documentElement.style.setProperty('--mx',(event.clientX/window.innerWidth*100)+'%');
      document.documentElement.style.setProperty('--my',(event.clientY/window.innerHeight*100)+'%');
    },{passive:true});
  }
});

/* FLZ 2.0 enhancements */
document.addEventListener('DOMContentLoaded',()=>{
  // Intro loader
  const loader=document.createElement('div');
  loader.id='flz-loader';
  loader.innerHTML='<div class="loader-inner"><div class="loader-logo">FLZ<span>.</span></div><div class="loader-caption">CARGANDO EXPERIENCIA</div><div class="loader-track"></div></div>';
  document.body.appendChild(loader);
  const hideLoader=()=>loader.classList.add('done');
  window.addEventListener('load',()=>setTimeout(hideLoader,650),{once:true});
  setTimeout(hideLoader,2600);

  // Animated ambient particles
  const canvas=document.createElement('canvas');
  canvas.id='flz-particles';
  document.body.prepend(canvas);
  const ctx=canvas.getContext('2d');
  let particles=[],w=0,h=0,raf=0;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize(){
    const dpr=Math.min(window.devicePixelRatio||1,1.6);
    w=window.innerWidth;h=window.innerHeight;
    canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    particles=Array.from({length:Math.min(65,Math.floor(w/19))},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.6+.35,vx:(Math.random()-.5)*.22,vy:-Math.random()*.25-.05,a:Math.random()*.48+.12}));
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.y<-5){p.y=h+5;p.x=Math.random()*w}
      if(p.x<-5)p.x=w+5;if(p.x>w+5)p.x=-5;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(255,212,0,'+p.a+')';ctx.fill();
    });
    raf=requestAnimationFrame(draw);
  }
  resize();if(!reduced)draw();
  window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else if(!reduced)draw()});

  // Local clock and date; status only confirms this page rendered locally
  const clock=document.getElementById('live-clock'),date=document.getElementById('live-date');
  function tick(){
    const now=new Date();
    if(clock)clock.textContent=new Intl.DateTimeFormat('es-EC',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(now);
    if(date)date.textContent=new Intl.DateTimeFormat('es-EC',{day:'2-digit',month:'short',year:'numeric'}).format(now);
  }
  tick();setInterval(tick,1000);

  // Custom cursor on mouse/trackpad only
  if(matchMedia('(pointer:fine)').matches&&!reduced){
    const cursor=document.createElement('div');cursor.id='flz-cursor';document.body.appendChild(cursor);
    window.addEventListener('pointermove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';cursor.classList.add('visible')},{passive:true});
    document.addEventListener('pointerover',e=>{if(e.target.closest('a,button,.card'))cursor.classList.add('active');else cursor.classList.remove('active')});
    document.addEventListener('pointerleave',()=>cursor.classList.remove('visible'));
  }

  // Cookie notice: no analytics or advertising cookies are installed by this site.
  const consentKey='flz-cookie-choice-v1';
  const banner=document.createElement('section');
  banner.className='cookie-banner';banner.id='cookie-banner';
  banner.setAttribute('role','dialog');banner.setAttribute('aria-label','Preferencias de privacidad');
  banner.innerHTML='<h3>Tu privacidad importa</h3><p>FLZ no utiliza actualmente cookies publicitarias ni de analítica. Guardamos tu elección de privacidad en el almacenamiento local de este navegador para no mostrarte este aviso en cada visita. Consulta nuestra <a href="legal.html#cookies" style="color:#ffe04a;text-decoration:underline">Política de cookies</a> y <a href="legal.html#privacidad" style="color:#ffe04a;text-decoration:underline">Política de privacidad</a>.</p><div class="cookie-actions"><button class="cookie-accept" id="cookie-accept">Aceptar</button><button id="cookie-reject">Rechazar opcionales</button><button id="cookie-settings">Configurar</button></div>';
  document.body.appendChild(banner);
  const modal=document.createElement('div');modal.id='cookie-preferences';
  modal.innerHTML='<div class="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookie-title"><h3 id="cookie-title">Preferencias de privacidad</h3><p>El sitio no carga herramientas de analítica o publicidad. Estas opciones se muestran para que puedas revisar la configuración; las categorías opcionales permanecerán desactivadas hasta que se integre un proveedor y se solicite consentimiento válido.</p><label>Almacenamiento esencial de preferencia <span>Siempre activo</span></label><label>Analítica (no instalada) <input type="checkbox" id="cookie-analytics" disabled></label><label>Publicidad (no instalada) <input type="checkbox" id="cookie-marketing" disabled></label><div class="cookie-actions"><button class="cookie-accept" id="cookie-save">Guardar elección</button><button id="cookie-close">Cerrar</button></div></div>';
  document.body.appendChild(modal);
  const saved=localStorage.getItem(consentKey);
  if(!saved)banner.classList.add('show');
  const saveChoice=value=>{localStorage.setItem(consentKey,JSON.stringify({choice:value,updatedAt:new Date().toISOString()}));banner.classList.remove('show');modal.classList.remove('show')};
  document.getElementById('cookie-accept').onclick=()=>saveChoice('accepted');
  document.getElementById('cookie-reject').onclick=()=>saveChoice('rejected');
  document.getElementById('cookie-settings').onclick=()=>modal.classList.add('show');
  document.getElementById('cookie-close').onclick=()=>modal.classList.remove('show');
  document.getElementById('cookie-save').onclick=()=>saveChoice('custom-no-optional-trackers');
  document.getElementById('open-cookie-settings')?.addEventListener('click',()=>{banner.classList.add('show');modal.classList.add('show')});
  modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show')});
});
