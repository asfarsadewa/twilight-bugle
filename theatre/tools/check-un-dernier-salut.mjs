// Browser regression for the articulated musical: real painted contacts, seeks, changes and encore.
import { chromium } from 'playwright-core';
import { createServer } from 'vite';
import { resolve, join } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';
const ROOT=resolve(import.meta.dirname,'..'), OUT=resolve(ROOT,'../productions/un-dernier-salut/render/qa');
mkdirSync(OUT,{recursive:true});
const server=await createServer({root:ROOT,configFile:join(ROOT,'vite.config.ts'),server:{port:0,hmr:false,watch:null},logLevel:'error'});await server.listen();
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--use-angle=d3d11']});
const page=await browser.newPage({viewport:{width:1280,height:720}}), errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>m.type()==='error'&&errors.push(m.text()));
await page.route('**/__salut-qa',r=>r.fulfill({contentType:'text/html',body:'<html><head><link rel="stylesheet" href="/src/style.css"></head><body style="margin:0"><div id="stage"></div></body></html>'}));
await page.goto(`http://localhost:${server.httpServer.address().port}/__salut-qa`);
await page.evaluate(async()=>{
 const {Theatre}=await import('/src/theatre.ts'),{repertoire}=await import('/src/productions.ts');
 const shows=await Promise.all(repertoire.map(p=>p.load()));const p=shows.find(p=>p.id==='un-dernier-salut');
 const th=new Theatre(document.getElementById('stage'),1280,720,1,{en:true,py:false});await th.init('/house/house.glb');await th.load(p);window.qa={th,p,shows};
});
const report=await page.evaluate(async()=>{
 const {th,p,shows}=window.qa, {STAGE}=await import('/src/stage/piece.ts');
 const round=x=>Math.round(x*1e6)/1e6;
 // Parallel texture loads can insert joints in different orders; compare named angles, not load order.
 const state=t=>{th.frame(t);return [...th.pieces].filter(([id])=>!id.startsWith('old/')).map(([id,v])=>({id,show:v.root.visible,root:v.root.visible?v.root.position.toArray().map(round):[],joints:v.joints?Object.fromEntries(Object.entries(v.joints).sort(([a],[b])=>a.localeCompare(b)).map(([k,j])=>[k,round(j.rotation.z)])):null}));};
 const errors=[],worst=[],ranges={},contacts=[],feet=[],chainMax={},neck={};
 // Painted jaw, back neckline and lower neck landmarks from each actor's own core sheet.
 // The clown's high shirt collar needs its own check; the dancer's ruff cannot stand in for it.
 const neckMarks={dancer:{collar:[720,200],chin:[330,535],base:[260,596]},clown:{collar:[708,118],chin:[306,610],base:[231,667]}};
 const uv=(a,p)=>[(p[0]/1024-a.box[0])/(a.box[2]-a.box[0]),(p[1]/1024-a.box[1])/(a.box[3]-a.box[1])];
 for(let t=0;t<323;t+=.25){
  th.frame(t);
  for(const id of ['dancer','clown']){
   const a=th.pieces.get(id),turn=th.tl.value(`${id}.turn`,t);
   const marks=neckMarks[id],n=neck[id]??={min:Infinity,max:-Infinity,baseOverlapMax:-Infinity};
   const collar=a.body.worldToLocal(a.point('body',uv(a.spec.puppet.body.art,marks.collar)));
   const chin=a.body.worldToLocal(a.point('head',uv(a.spec.puppet.head.art,marks.chin)));
   const base=a.body.worldToLocal(a.point('head',uv(a.spec.puppet.head.art,marks.base)));
   const clearance=chin.y-collar.y;
   if(clearance<n.min){n.min=clearance;n.minAt=t;}
   if(clearance>n.max){n.max=clearance;n.maxAt=t;}
   n.baseOverlapMax=Math.max(n.baseOverlapMax,base.y-collar.y);
   for(const [key,j] of Object.entries(a.joints)){const r=ranges[`${id}.${key}`]??=[Infinity,-Infinity];r[0]=Math.min(r[0],j.rotation.z);r[1]=Math.max(r[1],j.rotation.z);}
   for(const c of a.spec.puppet.chains){
    const end=a.point(c.lower,c.end),target=[th.tl.value(`${id}.${c.target}x`,t),STAGE.floor+th.tl.value(`${id}.${c.target}y`,t)];
    const err=Math.hypot(end.x-target[0],end.y-target[1]);
    if(turn<.01||turn>.99){worst.push({t:round(t),id,chain:c.target,error:round(err),actual:end.toArray().map(round),target:target.map(round)});chainMax[`${id}.${c.target}`]=Math.max(chainMax[`${id}.${c.target}`]??0,err);}
   }
  }
 }
 worst.sort((a,b)=>b.error-a.error);
 // The artwork's left/right identity must survive a mirrored turn. This catches crossed hand targets
 // even when an inverse-kinematics solver can still reach them perfectly.
 const turnHands=[];
 for(const [id,t] of [['dancer',8.3],['dancer',8.8],['dancer',9.2],['dancer',10.1],['dancer',10.65],['dancer',11.2],['dancer',86.7],['clown',86.0],['clown',86.4],['clown',87.0],['clown',87.8],['clown',88.1],['dancer',200.1],['dancer',236.6],['clown',237.0]]){
  th.frame(t);const v=th.pieces.get(id),sample={id,t,turn:th.tl.value(`${id}.turn`,t)};
  for(const side of ['A','B']){const c=v.spec.puppet.chains.find(c=>c.target===`hand${side}`);const q=v.body.worldToLocal(v.point(c.lower,c.end));sample[side]=q.x;}
  sample.correct=sample.A<-.04&&sample.B>.04;turnHands.push(sample);
 }
 const outerElbows=[];
 for(const t of [20,48,80,150,175,232,295])for(const [id,side,sign] of [['dancer','A',-1],['clown','B',1]]){
  th.frame(t);const v=th.pieces.get(id),shoulder=v.joints[`arm${side}`].position;
  const elbow=v.body.worldToLocal(v.joints[`fore${side}`].getWorldPosition(v.root.position.clone()));
  outerElbows.push({id,t,outward:sign*(elbow.x-shoulder.x),rise:elbow.y-shoulder.y});
 }
 for(const t of [18,48,68,72,80,133.9,150,175,232,290,294.5,300.5,308.5,314]){
  th.frame(t);
  for(const [id,a] of th.pieces){const g=a.spec.grip;if(!g||!a.root.visible||th.tl.value(`${id}.held`,t,0)<.99)continue;const pin=a.point('body',g.pin),hand=th.pieces.get(g.piece).point(g.part,g.point);contacts.push({t,id,gap:round(Math.hypot(pin.x-hand.x,pin.y-hand.y))});}
 }
 for(const t of [2.4,2.8,3.2,4,4.3,4.6,5,5.3]){th.frame(t);const a=th.pieces.get('clown');feet.push({t,root:a.root.position.x,feet:a.spec.puppet.chains.filter(c=>c.target.startsWith('foot')).map(c=>a.point(c.lower,c.end).toArray())});}
 const a=state(174.8);state(310);state(20);state(135);const b=state(174.8),deterministic=JSON.stringify(a)===JSON.stringify(b);
 const differences=(x,y)=>x.map((v,i)=>JSON.stringify(v)===JSON.stringify(y[i])?null:{before:v,after:y[i]}).filter(Boolean);
 const lang=[];for(const l of p.master.lines){th.frame(l.start+.5);lang.push(document.querySelector('.surtitles .main').textContent===l.fr&&document.querySelector('.surtitles .second').textContent===l.id&&document.querySelector('.surtitles .en').textContent===l.en);}
 const damage=[150,230,300,319].map(t=>{th.frame(t);return {t,support:th.tl.value('support.rz',t),step:th.tl.value('step.y',t),roof:th.tl.value('canopy.y',t)};});
 const old=shows.find(x=>x.id==='the-sky-you-gave-me');await th.load(old);const oldState=JSON.stringify(state(291));await th.load(p,{production:old,at:291});state(th.start+.1);const incomingState=state(174.8),inFromOld=JSON.stringify(a)===JSON.stringify(incomingState);await th.load(old,{production:p,at:174.8});state(th.start+.1);
 const carried=[];for(let t=th.start;t<0;t+=.05){const out=th.tl.value('old/dancer.out',t,1);if(out>.15&&out<.80){th.frame(t);const v=th.pieces.get('old/dancer'),c=v.spec.puppet.chains.find(c=>c.target==='handB'),hand=v.point(c.lower,c.end);carried.push({out,relative:hand.sub(v.root.position).toArray()});}}
 const carryDrift=carried.length?Math.max(...carried.flatMap(v=>v.relative.map((x,i)=>Math.abs(x-carried[0].relative[i])))):999;
 const oldUnchanged=oldState===JSON.stringify(state(291));await th.load(p,{production:old,at:291});state(th.start+.1);await th.load(p,{production:p,at:232});state(th.start+.1);const encore=JSON.stringify(a)===JSON.stringify(state(174.8));
 return {count:shows.length,duration:p.master.duration,lyricLines:p.master.lines.length,deterministic,allLanguages:lang.every(Boolean),neck,turnHands,outerElbows,seekDiff:differences(a,b),changeoverDiff:differences(a,incomingState),carryDrift,ranges,chainMax,worst:worst.slice(0,24),contacts,feet,damage,inFromOld,oldUnchanged,encore};
});
report.errors=errors;writeFileSync(join(OUT,'runtime.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({...report,feet:undefined,ranges:undefined,worst:report.worst.slice(0,8)},null,2));
await browser.close();await server.close();
if(Object.values(report.neck).some(n=>n.min<.004||n.max>.045||n.baseOverlapMax>0)||report.turnHands.some(v=>!v.correct)||report.outerElbows.some(v=>v.outward<-.035)||report.damage.some(v=>v.support<70||v.step>-.26||v.roof>-.29)||report.carryDrift>.0001||errors.length||!report.deterministic||!report.allLanguages||!report.inFromOld||!report.oldUnchanged||!report.encore||report.contacts.some(x=>x.gap>.002)||Object.entries(report.chainMax).some(([k,v])=>v>(k.includes('foot')?.003:.035)))process.exitCode=1;
