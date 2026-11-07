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