function showScriptDetails(){const home=document.getElementById('home'),detail=document.getElementById('detail');if(home)home.hidden=true;if(detail)detail.hidden=false;history.replaceState(null,'','#OBG-script');window.scrollTo({top:0,behavior:'smooth'});}
function showHome(){const home=document.getElementById('home'),detail=document.getElementById('detail');if(detail)detail.hidden=true;if(home)home.hidden=false;history.replaceState(null,'',location.pathname+location.search);window.scrollTo({top:0,behavior:'smooth'});}
document.addEventListener('DOMContentLoaded',()=>{
 const loader=document.getElementById('flz-loader');const hideLoader=()=>{if(loader){loader.classList.add('done');window.setTimeout(()=>loader.remove(),650);}};window.setTimeout(hideLoader,1250);window.addEventListener('load',hideLoader,{once:true});
 const clock=document.getElementById('live-clock'),date=document.getElementById('live-date');
 const tf=new Intl.DateTimeFormat('es-EC',{timeZone:'America/Guayaquil',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
 const df=new Intl.DateTimeFormat('es-EC',{timeZone:'America/Guayaquil',weekday:'long',day:'2-digit',month:'long',year:'numeric'});
 function updateTime(){const now=new Date();if(clock)clock.textContent=tf.format(now);if(date)date.textContent=df.format(now).replace(/,/g,'').toUpperCase();}
 updateTime();window.setInterval(updateTime,1000);
 document.querySelectorAll('.executor-coming').forEach(card=>{const announce=()=>alert('Esta sección estará disponible próximamente.');card.addEventListener('click',announce);card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();announce();}});});
 const featured=document.querySelector('.script-featured');if(featured){featured.addEventListener('click',event=>{if(event.target.closest('a,button'))return;showScriptDetails();});featured.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();showScriptDetails();}});}
 const cookieKey='flz-privacy-notice-v4';let dismissed=false;try{dismissed=localStorage.getItem(cookieKey)==='dismissed';}catch(error){}
 const banner=document.createElement('aside');banner.id='flz-cookie-banner';banner.setAttribute('role','dialog');banner.setAttribute('aria-label','Aviso de privacidad');banner.innerHTML='<div class="cookie-copy"><strong>Privacidad en FLZ</strong><p>Este sitio utiliza almacenamiento local para recordar que cerraste este aviso. No hay herramientas propias de analítica ni publicidad integradas actualmente. <a href="legal.html#privacidad">Lee nuestra política de privacidad.</a></p></div><button type="button" id="flz-cookie-accept">Entendido</button>';document.body.appendChild(banner);if(!dismissed)banner.classList.add('show');
 banner.querySelector('#flz-cookie-accept').addEventListener('click',()=>{try{localStorage.setItem(cookieKey,'dismissed');}catch(error){}banner.classList.remove('show');});
 const settings=document.getElementById('open-cookie-settings');if(settings)settings.addEventListener('click',()=>{banner.classList.add('show');banner.querySelector('strong').textContent='Preferencias de privacidad';});
 if(location.hash==='#OBG-script')showScriptDetails();
});
