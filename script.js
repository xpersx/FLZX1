function showScriptDetails(){
  document.getElementById('home').style.display='none';
  document.getElementById('detail').style.display='block';
  history.replaceState(null,'','#obg-script');
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
  alert('Añade aquí el enlace oficial de OBG en '+network+'.');
}
document.addEventListener('DOMContentLoaded',function(){
  if(location.hash==='#obg-script') showScriptDetails();
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
