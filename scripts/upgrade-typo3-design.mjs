import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { basename } from 'node:path';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { business, services, serviceUrl } from '../src/content.js';
import { airportTransfer } from '../src/airport.js';

const original = JSON.parse(readFileSync('typo3/seed/content.json','utf8'));
const upgraded = structuredClone(original);
const p = text => `<p>${text}</p>`;
const entry = (title, description, extra={}) => ({item_type:'stat',title,description:p(description),...extra});
const block = (type,fields,extra={}) => ({type,fields,...extra});
const iconFor = service => ({flughafen:'plane',kranken:'heart-pulse',dialyse:'shield-check',stadt:'map-pin',serie:'calendar-days',besorgung:'shopping-bag'})[service.id];
const photoFor = service => service.photo.startsWith('/') ? basename(service.photo) : `service-${service.id}-photo.jpg`;
const server = await createServer({server:{middlewareMode:true},appType:'custom'});
try {
  const {default:App} = await server.ssrLoadModule('/src/App.jsx');
  const rendered = Object.fromEntries(original.pages.map(page=>[page.path,renderToStaticMarkup(React.createElement(App,{pathname:page.path,search:''}))]));
  const extract = (path,queries) => JSON.parse(execFileSync('php',['scripts/design-extract.php'],{input:JSON.stringify({html:rendered[path],queries}),encoding:'utf8',maxBuffer:8*1024*1024}));
  const cls = name => `contains(concat(' ',normalize-space(@class),' '),' ${name} ')`;
  for(const page of upgraded.pages){
    page.elements.forEach((el,index)=>{el.match=index;});
    const source=extract(page.path,{paras:`//main//p`,hero:`//*[${cls('page-hero-copy')}]//p`});
    for(const el of page.elements){
      if(el.type==='form')el.items=[entry('Persönlicher Fahrdienst','',{icon:'shield-check'}),entry('24/7 erreichbar','',{icon:'clock'}),entry('Rastatt und Umgebung','',{icon:'map-pin'})];
      if(el.type==='pagehero'){
        el.fields.adler_note='Rastatt & Umgebung';
        if(source.hero[0])el.fields.bodytext=p(source.hero[0].text);
        el.fields.adler_primary_label='Fahrt anfragen';el.fields.adler_primary_link='/#buchen';
        el.fields.adler_secondary_label=business.phone;el.fields.adler_secondary_link=business.phoneHref;
      }
      if(el.type==='cta'){
        el.fields.adler_tertiary_label='Kontakt & Fahrtanfrage';el.fields.adler_tertiary_link='/kontakt/';
        el.image='taxi-adler-mercedes-fleet.webp';
      }
      if(el.type==='cards'&&el.fields.adler_theme==='dark'){
        el.fields.adler_layout='services';el.fields.bodytext=p('Ob zum Flughafen, zum nächsten Termin oder einfach durch die Stadt: Wir sind für Ihre Wege da.');
        el.fields.adler_note='Auch für kurzfristige Fahrten:';el.fields.adler_primary_label='Rufen Sie uns direkt an';el.fields.adler_primary_link=business.phoneHref;
        el.items.forEach((item,index)=>{item.image=photoFor(services[index]);item.icon=iconFor(services[index]);});
      }
    }
    if(page.path==='/'){
      const hero=page.elements.find(e=>e.type==='hero');hero.fields.adler_source_label='5,0 / 5 AUF GOOGLE';hero.fields.adler_source_link='/#bewertungen';hero.fields.adler_note='RASTATT · BADEN-WÜRTTEMBERG';hero.items[2].icon='car-front';
      page.elements.find(e=>e.type==='split').fields.adler_layout='benefits';
      const places=page.elements.find(e=>e.type==='cards'&&e.fields.header==='Ihre Stadt.');places.fields.adler_layout='places';places.fields.adler_anchor='rastatt';places.items[0].eyebrow='IM HERZEN DER STADT';places.items[0].icon='map-pin';places.items[1].eyebrow='GUT ANKOMMEN. WEITERKOMMEN.';places.items[1].icon='navigation';
      const steps=page.elements.find(e=>e.type==='steps');steps.fields.bodytext=p('Von der ersten Idee bis zum persönlichen Kontakt: Drei klare Schritte, ein entspanntes Gefühl.');steps.fields.adler_anchor='ablauf';steps.fields.adler_primary_label='Fahrtanfrage vorbereiten';steps.fields.adler_primary_link='/#buchen';
      steps.items.forEach((item,index)=>{item.icon=['map-pin','check','phone'][index];item.eyebrow=['IHR STARTPUNKT','ALLES IM BLICK','PERSÖNLICHER KONTAKT'][index];});
      const faq=page.elements.find(e=>e.type==='faq');faq.fields.header='Gut zu';faq.fields.adler_accent='wissen.';faq.fields.bodytext=p('Noch Fragen zu Ihrer Fahrt? Unser Team hilft Ihnen gerne persönlich weiter.');faq.fields.adler_primary_label='Jetzt anrufen';faq.fields.adler_primary_link=business.phoneHref;
      const footer=page.elements.find(e=>e.type==='footer');footer.fields.adler_primary_label='Navigation';footer.fields.adler_note='Leistungen';
      footer.items.forEach(item=>{item.link_group=item.link.includes('/leistungen/')||item.link===airportTransfer.path?'services':item.link.includes('/impressum/')||item.link.includes('/datenschutz/')?'legal':'navigation';});
      footer.items.unshift({item_type:'link',title:'Startseite',link:'/',link_group:'navigation'},{item_type:'link',title:'Fahrt anfragen',link:'/#buchen',link_group:'navigation'});
    }
    if(page.path==='/kontakt/'){const hero=page.elements.find(e=>e.type==='pagehero');hero.fields.adler_layout='contact';hero.fields.adler_eyebrow='KONTAKT & FAHRTANFRAGE';}
    if(['/datenschutz/','/impressum/'].includes(page.path)){
      const hero=page.elements.find(e=>e.type==='pagehero');hero.fields.adler_layout='legal';hero.fields.adler_primary_link='';hero.fields.adler_secondary_link='';
    }
    if(page.path==='/services/'){
      const hero=page.elements.find(e=>e.type==='pagehero');hero.fields.adler_primary_label='Leistungen entdecken';hero.fields.adler_primary_link='/services/#leistungsuebersicht';page.elements.find(e=>e.type==='cards').fields.adler_anchor='leistungsuebersicht';
      page.elements.splice(-1,0,block('split',{adler_layout:'editorial',adler_eyebrow:'GUT VORBEREITET',header:'Ihre Fahrt ist',adler_accent:'nicht irgendeine.',bodytext:p('Ein früher Flug, ein wichtiger Arzttermin, ein Abend mit Freunden: Jede Fahrt hat ihren eigenen Anlass. Deshalb stimmen wir die Details lieber persönlich ab.')+p('Nennen Sie uns Abholort, Ziel, Termin und die Anzahl der Personen. Für Gepäck, Kindersitze, Hilfsmittel oder besondere Anforderungen sprechen Sie uns bitte schon bei der Anfrage an.')+p('Ob allein, mit der Familie oder als größere Gruppe: Wir stimmen Ihre Fahrt, das Gepäck und die Verfügbarkeit individuell mit Ihnen ab. Auch mehr als 6 Personen können eine Fahrt anfragen.'),adler_primary_label:'Fragen Sie uns persönlich',adler_primary_link:'/kontakt/'}));
    }
    if(page.path==='/ueber-uns/'){
      const text=page.elements.find(e=>e.type==='text');text.type='split';text.fields.adler_layout='editorial';text.fields.header='Gute Fahrten beginnen mit';text.fields.adler_accent='gutem Kontakt.';text.fields.adler_eyebrow='UNSER ANSPRUCH';
      const info=extract(page.path,{copy:`//*[${cls('about-intro')}]//*[${cls('editorial-copy')}]`,values:`//*[${cls('value-row')}]`});
      text.fields.bodytext=info.copy[0].html.replace(/<a\b[\s\S]*?<\/a>/g,'');text.fields.adler_primary_label=business.phone;text.fields.adler_primary_link=business.phoneHref;
      page.elements.splice(2,0,block('cards',{adler_layout:'values',header:''},{items:info.values.map((value,index)=>({item_type:'card',title:['Ein direkter Draht.','Ein offenes Ohr.','Ein Stück Rastatt.'][index],description:value.html.replace(/^[\s\S]*?<h3>[\s\S]*?<\/h3>/,''),icon:['phone','heart-pulse','map-pin'][index]}))}));
    }
    const service=services.find(s=>serviceUrl(s)===page.path);
    if(service){
      page.elements.find(e=>e.type==='pagehero').image=photoFor(service);
      const detail=page.elements.find(e=>e.type==='text');detail.type='split';detail.fields.adler_layout='service';detail.fields.header='';detail.fields.adler_eyebrow=`${service.route[0]} → ${service.route[1]}`;
      detail.fields.bodytext=service.sections.map(s=>`<h3>${s.title}</h3>${p(s.text)}`).join('')+(service.notice?p(service.notice):'');
      detail.fields.adler_side_header='Diese Angaben helfen uns.';detail.fields.adler_side_text=`<ol>${service.checklist.map(t=>`<li>${t}</li>`).join('')}</ol>`;
      detail.fields.adler_primary_label='Anfrage vorbereiten';detail.fields.adler_primary_link=page.path+'#buchen';detail.fields.adler_secondary_label=business.phone;detail.fields.adler_secondary_link=business.phoneHref;
      for(const el of page.elements)if(el.type==='text')el.omit=true;
      page.elements.splice(1,0,block('text',{adler_layout:'highlights',bodytext:`<ul>${service.highlights.map(t=>`<li>${t}</li>`).join('')}</ul>`}));
      const related=services.filter(s=>s.id!==service.id).slice(service.id==='flughafen'?2:0,service.id==='flughafen'?4:2);
      page.elements.splice(page.elements.findIndex(e=>e.type==='form'),0,block('cards',{adler_layout:'related',adler_eyebrow:'AUCH FÜR SIE DA',header:'Weitere Wege mit uns.',adler_primary_label:'Alle Leistungen',adler_primary_link:'/services/'},{items:related.map(s=>({item_type:'card',title:s.title,description:p(s.subtitle),icon:iconFor(s),link:serviceUrl(s)}))}));
    }
    if(page.path===airportTransfer.path){
      const info=extract(page.path,{hero:`//*[${cls('airport-hero-copy')}]`,routes:`//*[${cls('airport-route-details')}]//article`,price:`//*[${cls('airport-price-layout')}]/*[1]`,factors:`//*[${cls('airport-price-factors')}]//div`,family:`//*[${cls('airport-family-layout')}]/*[2]`,local:`//*[${cls('airport-local-layout')}]/*[1]`,aside:`//*[${cls('airport-local-layout')}]//aside`});
      const select=(query)=>extract(page.path,{value:query}).value;
      const hero=page.elements.find(e=>e.type==='pagehero');Object.assign(hero.fields,{adler_layout:'airport',header:'Flughafentransfer',adler_accent:'Karlsruhe/Baden-Baden',adler_eyebrow:'AB KARLSRUHE · BADEN-BADEN · RASTATT & UMGEBUNG',adler_note:'Flughafen FKB · Baden-Airpark',bodytext:p(select(`//*[${cls('airport-hero-copy')}]/p`)[0].text),adler_primary_label:business.phone,adler_primary_link:business.phoneHref,adler_secondary_label:'Abholung am FKB',adler_secondary_link:airportTransfer.path+'?richtung=ab-flughafen#buchen',adler_tertiary_label:'Zum Flughafen',adler_tertiary_link:airportTransfer.path+'?richtung=zum-flughafen#buchen',adler_source_label:'IHRE VERBINDUNG ZUM FLUG',adler_side_header:'FKB',adler_side_text:p('<strong>Karlsruhe · Baden-Baden · Rastatt</strong>Ihre Abholadresse und Umgebung')+p('<strong>Karlsruhe/Baden-Baden</strong>Flughafen in Rheinmünster')});
      hero.items=[entry('24/7 telefonisch erreichbar','',{icon:'clock'}),entry('20 Jahre Erfahrung','',{icon:'shield-check'}),entry('Auch für größere Gruppen','',{icon:'users'}),entry('Hin- & Rückfahrt nach Absprache','',{icon:'check'})];
      hero.fields.adler_secondary_label='Transfer anfragen';hero.fields.adler_secondary_link=airportTransfer.path+'#buchen';
      hero.items.push(entry('Zum Flughafen','',{icon:'plane',link:airportTransfer.path+'?richtung=zum-flughafen#buchen'}),entry('Abholung am FKB','',{icon:'plane',link:airportTransfer.path+'?richtung=ab-flughafen#buchen'}));
      const form=page.elements.find(e=>e.type==='form');form.fields.adler_layout='airport';form.fields.adler_side_header='Ihr Transfer. Die Details zählen.';form.fields.adler_preset_destination=airportTransfer.airportName;
      form.fields.adler_side_text=select(`//*[${cls('airport-preparation')}]//p | //*[${cls('airport-preparation')}]//ul`).map(t=>`<div>${t.html}</div>`).join('').replace('Das Formular bleibt in diesem Entwurf eine Vorschau ohne Versand.','Eine Anfrage ist noch keine verbindliche Buchung.');
      page.elements.filter(e=>e.type==='text'||e.type==='cards'||e.type==='vehicles').forEach(e=>e.omit=true);
      const sections=[];
      const headerFrom=(query)=>{
        const title=select(`${query}//h2`)[0];const em=select(`${query}//h2/em`)[0];return {header:title.text.replace(em?.text||'','').trim(),adler_accent:em?.text||''};
      };
      sections.push(block('split',{adler_layout:'airport-routes',adler_eyebrow:'HINFLIEGEN. HEIMKOMMEN.',...headerFrom(`//*[${cls('airport-section-heading')}]`),bodytext:select(`//*[${cls('airport-section-heading')}]/p`).map(t=>p(t.text)).join(''),adler_anchor:'transfer-ablauf'},{items:info.routes.map((r,index)=>entry(['01 · VOR DEM ABFLUG','02 · NACH DER LANDUNG'][index],'',{description:r.html.replace(/^[\s\S]*?(?=<h3>)/,'').replace(/<a\b[\s\S]*?<\/a>/g,''),icon:'plane',link_label:index?'Flughafenabholung vorbereiten':'Hinfahrt vorbereiten',link:airportTransfer.path+`?richtung=${index?'ab-flughafen':'zum-flughafen'}#buchen`}))}));
      sections.push(block('split',{adler_layout:'airport-price',adler_eyebrow:'PREIS AUF ANFRAGE',...headerFrom(`//*[${cls('airport-price-layout')}]/*[1]`),bodytext:select(`//*[${cls('airport-price-layout')}]/*[1]/p`).map(t=>p(t.text)).join(''),adler_side_header:'FÜR EINE KONKRETE PREISAUSKUNFT',adler_primary_label:'Fahrpreis erfragen',adler_primary_link:business.phoneHref,adler_anchor:'transfer-preis'},{items:info.factors.map((f,index)=>entry(select(`//*[${cls('airport-price-factors')}]//div/strong`)[index].text,select(`//*[${cls('airport-price-factors')}]//div/small`)[index].text))}));
      sections.push(block('split',{adler_layout:'airport-family',adler_eyebrow:'FÜR FAMILIEN & GRÖSSERE GRUPPEN',...headerFrom(`//*[${cls('airport-family-layout')}]/*[2]`),bodytext:select(`//*[${cls('airport-family-layout')}]/*[2]/p`).map(t=>`<p>${t.html}</p>`).join(''),adler_note:'Fahrzeugabbildung illustrativ. Fahrzeug und Gepäckraum nach Absprache.',adler_primary_label:'Fahrt für Ihre Gruppe anfragen',adler_primary_link:airportTransfer.path+'#buchen'},{image:'taxi-vw-touran-black.webp'}));
      sections.push(block('split',{adler_layout:'airport-local',adler_eyebrow:'IHR STARTPUNKT ZÄHLT',...headerFrom(`//*[${cls('airport-local-layout')}]/*[1]`),bodytext:select(`//*[${cls('airport-local-layout')}]/*[1]/p`).map(t=>p(t.text)).join(''),adler_side_header:'Flughafen Karlsruhe/Baden-Baden',adler_side_text:info.aside[0].html.replace(/<h3>[\s\S]*?<\/h3>/,''),adler_primary_label:'Weitere Flughafenfahrten',adler_primary_link:'/leistungen/flughafenfahrten/'},{items:select(`//*[${cls('airport-service-areas')}]//li`).map((t,index)=>entry(select(`//*[${cls('airport-service-areas')}]//li/strong`)[index].text,select(`//*[${cls('airport-service-areas')}]//li/span`)[index].text))}));
      page.elements.splice(page.elements.findIndex(e=>e.type==='faq'),0,...sections);
      const faq=page.elements.find(e=>e.type==='faq');Object.assign(faq.fields,{header:'Fragen zu Ihrem',adler_accent:'Flughafentransfer.',adler_eyebrow:'VOR DER FAHRT',bodytext:p('Die wichtigsten Antworten zu Vorbestellung, Flughafenabholung und Reisegepäck. Für Ihre konkrete Fahrt sind wir persönlich erreichbar.'),adler_anchor:'transfer-fragen',adler_primary_label:business.phone,adler_primary_link:business.phoneHref});
    }
  }
  if(existsSync('typo3/seed/design-upgrade.json'))writeFileSync('typo3/seed/design-previous.json',readFileSync('typo3/seed/design-upgrade.json'));
  writeFileSync('typo3/seed/design-upgrade.json',JSON.stringify({original,upgraded},null,2)+'\n');
  console.log('Prepared non-destructive design upgrade for 13 pages.');
}finally{await server.close();}
