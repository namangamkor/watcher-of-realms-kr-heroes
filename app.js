const progress=document.querySelector('.progress');
let scheduled=false;
function update(){const length=document.documentElement.scrollHeight-innerHeight;progress.style.width=(length>0?scrollY/length*100:0)+'%';scheduled=false;}
addEventListener('scroll',()=>{if(!scheduled){requestAnimationFrame(update);scheduled=true;}},{passive:true});addEventListener('resize',update);update();
const navlinks=[...document.querySelectorAll('.navlinks a,.mobile-nav a')];
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){navlinks.forEach(link=>{const selected=link.getAttribute('href')==='#'+entry.target.id;link.classList.toggle('active',selected);if(selected)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}}},{rootMargin:'-15% 0px -65% 0px'});document.querySelectorAll('[data-stage]').forEach(section=>observer.observe(section));}
