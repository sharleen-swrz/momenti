const header=document.querySelector('.header');
const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
const shooting=document.querySelector('.shooting-menu');
const shootingToggle=document.querySelector('.shooting-toggle');
const flyout=document.querySelector('.shooting-flyout');
function setFlyout(open){if(!shootingToggle||!flyout)return;shootingToggle.setAttribute('aria-expanded',String(open));flyout.hidden=!open;header?.classList.toggle('flyout-open',open)}
function closeMenu(){setFlyout(false);nav?.classList.remove('is-open');toggle?.setAttribute('aria-expanded','false');toggle?.setAttribute('aria-label','Menü öffnen');header?.classList.remove('menu-open')}
if(toggle&&nav){
 toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Menü schliessen':'Menü öffnen');nav.classList.toggle('is-open',open);header?.classList.toggle('menu-open',open);header?.classList.remove('is-hidden');if(!open)setFlyout(false)});
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
}
if(shooting&&shootingToggle){
 shootingToggle.addEventListener('click',()=>setFlyout(shootingToggle.getAttribute('aria-expanded')!=='true'));
 shooting.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'&&window.matchMedia('(min-width:801px)').matches)setFlyout(true)});
 header?.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse'&&!shooting.contains(document.activeElement))setFlyout(false)});
 nav?.querySelectorAll(':scope > a').forEach(link=>link.addEventListener('pointerenter',()=>{if(!shooting.contains(document.activeElement))setFlyout(false)}));
 shooting.addEventListener('focusout',event=>{if(!shooting.contains(event.relatedTarget))setFlyout(false)});
 shootingToggle.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();setFlyout(true);flyout?.querySelector('a')?.focus()}});
 document.addEventListener('click',event=>{if(!shooting.contains(event.target))setFlyout(false)});
}
document.addEventListener('keydown',event=>{if(event.key==='Escape'){if(shootingToggle?.getAttribute('aria-expanded')==='true'){setFlyout(false);shootingToggle.focus()}else{closeMenu();if(window.matchMedia('(max-width:800px)').matches)toggle?.focus()}}});
const backToTop=document.querySelector('.back-to-top');
function updateBackToTop(){
 const scrollable=document.documentElement.scrollHeight-window.innerHeight;
 if(backToTop)backToTop.hidden=scrollable<=0||window.scrollY<scrollable*.5;
}
backToTop?.addEventListener('click',()=>{window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})});
window.addEventListener('resize',updateBackToTop);
window.addEventListener('load',updateBackToTop);
let previousY=Math.max(0,window.scrollY);
let directionY=previousY;
let previousDirection=0;
let scheduled=false;
let idleTimer;
let pointerOverHeader=false;
const idleDelay=1400;
function interactingWithHeader(){return pointerOverHeader||header?.classList.contains('menu-open')||header?.contains(document.activeElement)}
function scheduleHide(){
 clearTimeout(idleTimer);
 if(window.scrollY<112)return;
 idleTimer=setTimeout(()=>{if(window.scrollY>=112&&!interactingWithHeader()){setFlyout(false);header?.classList.add('is-hidden')}},idleDelay);
}
header?.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){pointerOverHeader=true;clearTimeout(idleTimer)}});
header?.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse'){pointerOverHeader=false;scheduleHide()}});
header?.addEventListener('focusin',()=>{clearTimeout(idleTimer);header.classList.remove('is-hidden')});
header?.addEventListener('focusout',()=>scheduleHide());
header?.addEventListener('click',()=>scheduleHide());
function updateHeader(){
 const y=Math.max(0,window.scrollY);
 const delta=y-previousY;
 const direction=Math.sign(delta);
 if(direction&&direction!==previousDirection){directionY=previousY;previousDirection=direction}
 header?.classList.toggle('is-scrolled',y>24);
 if(y<112||interactingWithHeader()){header?.classList.remove('is-hidden')}
 else if(Math.abs(y-directionY)>12){header?.classList.toggle('is-hidden',direction>0)}
 previousY=y;scheduled=false;scheduleHide();updateBackToTop();
}
window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateHeader)}},{passive:true});
updateHeader();


// Inhalte erst beim Eintritt in den sichtbaren Bereich sanft einblenden.
const reducedMotion=window.matchMedia('(prefers-reduced-motion:reduce)');
if('IntersectionObserver' in window&&!reducedMotion.matches){
 const revealTargets=document.querySelectorAll('.hero-copy > *, .hero-image, .manifesto, .section-top, .category-card, .about-copy > *, .memory-journey article, .contact > *, .category-intro-image, .category-intro-copy > *, .prices-intro > *, .footer > *');
 const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}})},{threshold:0.06});
 revealTargets.forEach(element=>{element.classList.add('scroll-reveal');revealObserver.observe(element)});
 document.addEventListener('focusin',event=>{const element=event.target.closest('.scroll-reveal');if(element){element.classList.add('is-visible');revealObserver.unobserve(element)}});
 reducedMotion.addEventListener('change',event=>{if(event.matches){revealTargets.forEach(element=>element.classList.add('is-visible'));revealObserver.disconnect()}});
}
