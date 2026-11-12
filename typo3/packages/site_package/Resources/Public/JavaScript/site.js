(() => {
  const scriptUrl = document.currentScript?.src;
  const sprite = new URL('../Icons/sprite.svg', scriptUrl || location.href).href;
  document.querySelectorAll('.cms-form input[name$="[time]"]').forEach(input=>{input.type='time';});
  const labelIcons={name:'check',phone:'phone',email:'mail',pickup:'map-pin',destination:'navigation',date:'calendar-days',time:'clock',passengers:'users'};
  document.querySelectorAll('[data-preset-destination]').forEach(section=>{
    if(!section.dataset.presetDestination)return;
    const reverse=new URLSearchParams(location.search).get('richtung')==='ab-flughafen';
    const input=section.querySelector(`input[name$="[${reverse?'pickup':'destination'}]"]`);
    if(input&&!input.value)input.value=section.dataset.presetDestination;
  });
  document.querySelectorAll('.cms-form label[for]').forEach(label=>{
    const name=Object.keys(labelIcons).find(key=>label.htmlFor.endsWith(`-${key}`));
    if(!name)return;
    const icon=document.createElement('span');icon.className='cms-icon';icon.dataset.icon=labelIcons[name];icon.setAttribute('aria-hidden','true');label.prepend(icon);
  });
  document.querySelectorAll('[data-icon]').forEach(node => {
    const name = node.dataset.icon;
    if (!/^[a-z-]+$/.test(name)) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    const use = document.createElementNS(svg.namespaceURI, 'use');
    use.setAttribute('href', `${sprite}#${name}`); svg.append(use); node.append(svg);
  });
  const header = document.querySelector('[data-site-header]');
  const nav = document.querySelector('#main-navigation');
  const toggle = document.querySelector('.menu-toggle');
  const mobileNavigation = window.matchMedia('(max-width: 980px)');
  const dropdowns = [...document.querySelectorAll('[data-nav-dropdown]')];
  const setSubmenu = (dropdown, open) => {
    const button = dropdown.querySelector('[data-submenu-toggle]');
    const submenu = dropdown.querySelector('.nav-submenu');
    button.setAttribute('aria-expanded',String(open));
    button.setAttribute('aria-label',`${button.dataset.label}: Untermenü ${open?'schließen':'öffnen'}`);
    submenu.hidden = !open;
  };
  const closeSubmenus = () => dropdowns.forEach(dropdown=>setSubmenu(dropdown,false));
  const close = () => { closeSubmenus(); nav?.classList.remove('is-open'); toggle?.setAttribute('aria-expanded','false'); toggle?.setAttribute('aria-label','Menü öffnen'); document.body.classList.remove('menu-lock'); };
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    if(!open){close();return;}
    nav?.classList.add('is-open');toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Menü schließen');document.body.classList.add('menu-lock');
  });
  dropdowns.forEach(dropdown=>{
    const button = dropdown.querySelector('[data-submenu-toggle]');
    const submenu = dropdown.querySelector('.nav-submenu');
    dropdown.addEventListener('pointerenter',event=>{
      if(mobileNavigation.matches||event.pointerType!=='mouse'||!submenu.hidden)return;
      closeSubmenus();
      setSubmenu(dropdown,true);
    });
    dropdown.addEventListener('pointerleave',event=>{
      if(!mobileNavigation.matches&&event.pointerType==='mouse'&&!submenu.contains(document.activeElement))setSubmenu(dropdown,false);
    });
    button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';closeSubmenus();setSubmenu(dropdown,open);});
    dropdown.addEventListener('focusout',event=>{if(!dropdown.contains(event.relatedTarget))setSubmenu(dropdown,false);});
  });
  nav?.addEventListener('click', event => { if(event.target.closest('a')) close(); });
  document.addEventListener('click',event=>{if(!header?.contains(event.target))close();});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){
      const openDropdown=dropdowns.find(dropdown=>dropdown.querySelector('[aria-expanded=true]'));
      if(openDropdown){setSubmenu(openDropdown,false);openDropdown.querySelector('[data-submenu-toggle]').focus();event.preventDefault();return;}
      if(toggle?.getAttribute('aria-expanded')==='true'){close();toggle.focus();event.preventDefault();}
    }
    if(event.key==='Tab'&&mobileNavigation.matches&&toggle?.getAttribute('aria-expanded')==='true'){
      const focusable=[...header.querySelectorAll('a[href],button')].filter(el=>el.getClientRects().length);
      const first=focusable[0],last=focusable.at(-1);
      if(event.shiftKey&&document.activeElement===first){last.focus();event.preventDefault();}
      else if(!event.shiftKey&&document.activeElement===last){first.focus();event.preventDefault();}
    }
  });
  mobileNavigation.addEventListener('change',close);
  const backToTop = document.querySelector('[data-back-to-top]');
  const scrolled = () => {
    header?.classList.toggle('is-scrolled',window.scrollY>35);
    const height = Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
    const progress = header?.querySelector('.scroll-progress');
    if(progress)progress.style.transform=`scaleX(${Math.max(0,Math.min(1,window.scrollY/height))})`;
    if(backToTop){backToTop.classList.toggle('shown',window.scrollY>850);backToTop.tabIndex=window.scrollY>850?0:-1;}
  };
  backToTop?.addEventListener('click',()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
  document.querySelector('.faq-section .faq-item')?.setAttribute('open','');
  const heroImage=document.querySelector('.hero-image');
  if(heroImage&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    let scheduled=false;
    window.addEventListener('scroll',()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{heroImage.style.transform=`translate3d(0,${Math.min(window.scrollY,window.innerHeight)*.14}px,0) scale(1.06)`;scheduled=false;});},{passive:true});
  }
  window.addEventListener('scroll',scrolled,{passive:true}); scrolled();
  document.querySelectorAll('[data-review-carousel]').forEach(carousel => {
    const track = carousel.querySelector('.google-review-cards');
    const dots = carousel.querySelector('.review-carousel-dots');
    const pause = carousel.querySelector('[data-pause]');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let hovered = false, focused = false, visible = false, paused = false, timer;
    const step = () => (track.firstElementChild?.getBoundingClientRect().width || 0) + (parseFloat(getComputedStyle(track).columnGap)||0);
    const last = () => Math.max(0, track.children.length - Number(getComputedStyle(track).getPropertyValue('--review-columns')));
    const current = () => Math.max(0,Math.min(last(),Math.round(track.scrollLeft/(step()||1))));
    const go = index => track.scrollTo({left:index*step(),behavior:reduced.matches?'instant':'smooth'});
    const restart = () => {
      clearInterval(timer);
      if (carousel.dataset.autoplay !== '1' || paused || hovered || focused || !visible || reduced.matches || !last()) return;
      timer = setInterval(()=>{if(!document.hidden)go(current()>=last()?0:current()+1);},Math.max(3000,Number(carousel.dataset.interval)||5000));
    };
    const update = () => {
      const count = last();
      if(dots.children.length!==count+1){dots.replaceChildren();for(let i=0;i<=count;i++){const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',`Ab Bewertung ${i+1} anzeigen`);button.append(document.createElement('span'));button.addEventListener('click',()=>go(i));dots.append(button);}}
      [...dots.children].forEach((button,index)=>{if(index===current())button.setAttribute('aria-current','true');else button.removeAttribute('aria-current');});
      carousel.querySelector('.review-carousel-controls').hidden=!count;
      pause.hidden = reduced.matches || carousel.dataset.autoplay !== '1';
    };
    carousel.querySelector('[data-prev]').addEventListener('click',()=>go(current()<=0?last():current()-1));
    carousel.querySelector('[data-next]').addEventListener('click',()=>go(current()>=last()?0:current()+1));
    pause.addEventListener('click',()=>{paused=!paused;pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'Abspielen':'Pause';pause.setAttribute('aria-label',paused?'Automatischen Wechsel starten':'Automatischen Wechsel pausieren');restart();});
    carousel.addEventListener('mouseenter',()=>{hovered=true;restart();});carousel.addEventListener('mouseleave',()=>{hovered=false;restart();});
    carousel.addEventListener('focusin',()=>{focused=true;restart();});carousel.addEventListener('focusout',event=>{if(!carousel.contains(event.relatedTarget)){focused=false;restart();}});
    track.addEventListener('scroll',update,{passive:true});
    track.addEventListener('keydown',event=>{if(event.target!==track)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();go(Math.max(0,Math.min(last(),current()+(event.key==='ArrowRight'?1:-1))));}});
    new ResizeObserver(()=>{update();restart();}).observe(track);
    new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;restart();},{threshold:.2}).observe(track);
    reduced.addEventListener('change',()=>{update();restart();});document.addEventListener('visibilitychange',restart);
    update();
  });
})();
