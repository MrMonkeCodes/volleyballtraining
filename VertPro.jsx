const { useState, useEffect, useRef } = React;

// ── easing & math ─────────────────────────────────────────────────
const lerp=(a,b,t)=>a+(b-a)*t;
const lp=(a,b,t)=>({x:lerp(a.x,b.x,t),y:lerp(a.y,b.y,t)});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const sat=(v)=>clamp(v,0,1);
const easeInOut=t=>t<.5?4*t*t*t:(t-1)*(2*t-2)*(2*t-2)+1;
const easeOut=t=>1-Math.pow(1-t,3);
const easeOut4=t=>1-Math.pow(1-t,4);
const easeIn=t=>t*t*t;
const easeIn2=t=>t*t;
const smoothstep=t=>t*t*(3-2*t);
const smootherstep=t=>t*t*t*(t*(t*6-15)+10);
const lerpPose=(a,b,t)=>{const o={};for(const k in a)o[k]=lp(a[k],b[k],t);return o;};
const ang=(a,b)=>Math.atan2(b.y-a.y,b.x-a.x);
const dist=(a,b)=>Math.hypot(b.x-a.x,b.y-a.y);
const rot=(p,cx,cy,a)=>({x:cx+(p.x-cx)*Math.cos(a)-(p.y-cy)*Math.sin(a),y:cy+(p.x-cx)*Math.sin(a)+(p.y-cy)*Math.cos(a)});

const SKIN='#c8956c';
const SKIN_D='#a06b40';
const SKIN_S='#e8b48a';
const SHIRT='#2a4a7f';
const SHIRT_D='#1a2f50';
const SHIRT_H='#3a6aaf';
const SHORTS='#1a1a2e';
const SHORTS_D='#0a0a1a';
const SHOE='#e8e0d0';
const SHOE_D='#c8b89a';
const HAIR='#1a0a00';

function drawBody(ctx, p, opts={}) {
  const c = ctx;
  c.save();
  c.lineCap='round'; c.lineJoin='round';
  const fill=(col,stroke,sw=1)=>{c.fillStyle=col;if(stroke){c.strokeStyle=stroke;c.lineWidth=sw;}};
  const seg=(x1,y1,x2,y2,w,col,scol)=>{
    const a=ang({x:x1,y:y1},{x:x2,y:y2});
    const p2=a+Math.PI/2;
    const w1=w, w2=w*.65;
    c.beginPath();
    c.moveTo(x1+Math.cos(p2)*w1, y1+Math.sin(p2)*w1);
    c.quadraticCurveTo((x1+x2)/2+Math.cos(p2)*((w1+w2)/2)*1.1,(y1+y2)/2+Math.sin(p2)*((w1+w2)/2)*1.1,x2+Math.cos(p2)*w2, y2+Math.sin(p2)*w2);
    c.lineTo(x2-Math.cos(p2)*w2, y2-Math.sin(p2)*w2);
    c.quadraticCurveTo((x1+x2)/2-Math.cos(p2)*((w1+w2)/2)*1.1,(y1+y2)/2-Math.sin(p2)*((w1+w2)/2)*1.1,x1-Math.cos(p2)*w1, y1-Math.sin(p2)*w1);
    c.closePath();
    c.fillStyle=col; c.fill();
    if(scol){c.strokeStyle=scol;c.lineWidth=.6;c.stroke();}
  };
  const oval=(cx,cy,rx,ry,a,col,scol,sw=.6)=>{
    c.beginPath();c.ellipse(cx,cy,rx,ry,a,0,Math.PI*2);
    c.fillStyle=col;c.fill();
    if(scol){c.strokeStyle=scol;c.lineWidth=sw;c.stroke();}
  };
  const {sho,hips,neck,head,eL,eR,hL,hR,kL,kR,fL,fR}=p;
  const torsoW=12, hipW=10;
  const td=ang(sho,hips);
  const tp=td+Math.PI/2;
  c.beginPath();
  c.moveTo(sho.x+Math.cos(tp)*torsoW, sho.y+Math.sin(tp)*torsoW);
  c.bezierCurveTo(sho.x+Math.cos(tp)*torsoW+Math.cos(td)*8, sho.y+Math.sin(tp)*torsoW+Math.sin(td)*8,hips.x+Math.cos(tp)*hipW+Math.cos(td)*(-4), hips.y+Math.sin(tp)*hipW+Math.sin(td)*(-4),hips.x+Math.cos(tp)*hipW, hips.y+Math.sin(tp)*hipW);
  c.lineTo(hips.x-Math.cos(tp)*hipW, hips.y-Math.sin(tp)*hipW);
  c.bezierCurveTo(hips.x-Math.cos(tp)*hipW+Math.cos(td)*(-4), hips.y-Math.sin(tp)*hipW+Math.sin(td)*(-4),sho.x-Math.cos(tp)*torsoW+Math.cos(td)*8, sho.y-Math.sin(tp)*torsoW+Math.sin(td)*8,sho.x-Math.cos(tp)*torsoW, sho.y-Math.sin(tp)*torsoW);
  c.closePath();
  c.fillStyle=SHIRT; c.fill();
  c.strokeStyle=SHIRT_D; c.lineWidth=.8; c.stroke();
  c.globalAlpha=.18;
  c.beginPath();
  c.moveTo(sho.x+Math.cos(tp)*4, sho.y+Math.sin(tp)*4);
  c.lineTo(sho.x+Math.cos(tp)*2+Math.cos(td)*6, sho.y+Math.sin(tp)*2+Math.sin(td)*6);
  c.lineWidth=3; c.strokeStyle=SHIRT_H; c.stroke();
  c.globalAlpha=1;
  oval(lerp(neck.x,head.x,.3), lerp(neck.y,head.y,.3), 4, 6, ang(neck,head), SKIN, SKIN_D);
  seg(hips.x-4, hips.y, kL.x, kL.y, 7.5, SHORTS, SHORTS_D);
  seg(hips.x+4, hips.y, kR.x, kR.y, 7.5, SHORTS, SHORTS_D);
  seg(kL.x, kL.y, fL.x, fL.y-4, 5.5, SKIN, SKIN_D);
  seg(kR.x, kR.y, fR.x, fR.y-4, 5.5, SKIN, SKIN_D);
  oval(kL.x, kL.y, 5, 4.5, ang(hips,kL), SKIN_S, SKIN_D, .5);
  oval(kR.x, kR.y, 5, 4.5, ang(hips,kR), SKIN_S, SKIN_D, .5);
  const drawShoe=(kx,ky,fx,fy,side)=>{
    const a=ang({x:kx,y:ky},{x:fx,y:fy});
    c.beginPath();
    c.ellipse(fx+Math.cos(a)*4, fy+2, 9, 3.5, a*.3, 0, Math.PI*2);
    c.fillStyle=SHOE_D; c.fill();
    c.beginPath();
    c.moveTo(fx-Math.cos(a+Math.PI/2)*4, fy-Math.sin(a+Math.PI/2)*4);
    c.lineTo(fx+Math.cos(a)*10, fy+Math.sin(a)*5-1);
    c.lineTo(fx+Math.cos(a)*10+Math.cos(a+Math.PI/2)*3, fy+Math.sin(a)*5+Math.sin(a+Math.PI/2)*3-1);
    c.lineTo(fx+Math.cos(a+Math.PI/2)*3, fy+Math.sin(a+Math.PI/2)*3);
    c.closePath();
    c.fillStyle=SHOE; c.fill(); c.strokeStyle=SHOE_D; c.lineWidth=.6; c.stroke();
    c.globalAlpha=.35; c.strokeStyle='#888'; c.lineWidth=.5;
    for(let i=0;i<2;i++){const lx=fx+Math.cos(a)*(3+i*3.5);const ly=fy+Math.sin(a)*(2+i*1.5);c.beginPath(); c.moveTo(lx-2,ly-2); c.lineTo(lx+2,ly-2); c.stroke();}
    c.globalAlpha=1;
  };
  drawShoe(kL.x,kL.y,fL.x,fL.y,0);
  drawShoe(kR.x,kR.y,fR.x,fR.y,1);
  seg(sho.x-10, sho.y, eL.x, eL.y, 5, SHIRT, SHIRT_D);
  seg(sho.x+10, sho.y, eR.x, eR.y, 5, SHIRT, SHIRT_D);
  oval(sho.x-10, sho.y, 7, 6, ang(sho,eL), SHIRT_H, SHIRT_D, .7);
  oval(sho.x+10, sho.y, 7, 6, ang(sho,eR), SHIRT_H, SHIRT_D, .7);
  seg(eL.x, eL.y, hL.x, hL.y, 4, SKIN, SKIN_D);
  seg(eR.x, eR.y, hR.x, hR.y, 4, SKIN, SKIN_D);
  oval(eL.x, eL.y, 4, 3.5, ang(sho,eL), SKIN_S, SKIN_D, .5);
  oval(eR.x, eR.y, 4, 3.5, ang(sho,eR), SKIN_S, SKIN_D, .5);
  oval(hL.x, hL.y, 4, 3, ang(eL,hL), SKIN, SKIN_D, .6);
  oval(hR.x, hR.y, 4, 3, ang(eR,hR), SKIN, SKIN_D, .6);
  oval(head.x, head.y, 10, 11, 0, SKIN, SKIN_D, .8);
  c.beginPath();
  c.ellipse(head.x, head.y-5, 10, 8, 0, Math.PI, Math.PI*2);
  c.fillStyle=HAIR; c.fill();
  c.globalAlpha=.6;
  c.beginPath(); c.ellipse(head.x+2, head.y-4, 8, 5, -.2, Math.PI, Math.PI*2);
  c.fillStyle=HAIR; c.fill(); c.globalAlpha=1;
  oval(head.x+9, head.y+1, 2.5, 3, 0, SKIN, SKIN_D, .5);
  oval(head.x+4, head.y+1, 2.5, 2, 0, '#fff', '#999', .4);
  c.beginPath(); c.arc(head.x+4.5, head.y+1, 1.3, 0, Math.PI*2);
  c.fillStyle='#2a1a0a'; c.fill();
  c.beginPath(); c.moveTo(head.x+2, head.y-2); c.lineTo(head.x+7, head.y-2.5);
  c.strokeStyle=HAIR; c.lineWidth=1; c.stroke();
  c.beginPath(); c.moveTo(head.x+6, head.y+1); c.quadraticCurveTo(head.x+8, head.y+3, head.x+6, head.y+4);
  c.strokeStyle=SKIN_D; c.lineWidth=.8; c.stroke();
  c.beginPath(); c.arc(head.x+5, head.y+6, 2, -.1, Math.PI+.1);
  c.strokeStyle=SKIN_D; c.lineWidth=.7; c.stroke();
  c.globalAlpha=.08;
  c.fillStyle='#fff';
  c.beginPath(); c.ellipse((fL.x+fR.x)/2, Math.max(fL.y,fR.y)+4, 16, 4, 0, 0, Math.PI*2); c.fill();
  c.globalAlpha=1;
  c.restore();
}

const pose=(cx,gY,cr=0,o={})=>{
  const hy=gY-52+cr*22, ky=gY-26+cr*12, sy=hy-24;
  return{head:{x:cx+(o.hx||0), y:sy-22},neck:{x:cx, y:sy-6},sho:{x:cx, y:sy+2},hips:{x:cx, y:hy},kL:{x:cx-8+(o.kLx||0), y:ky+(o.kLy||0)},kR:{x:cx+8+(o.kRx||0), y:ky+(o.kRy||0)},fL:{x:cx-10+(o.fLx||0), y:gY+(o.fLy||0)},fR:{x:cx+10+(o.fRx||0), y:gY+(o.fRy||0)},eL:{x:cx-18+(o.eLx||0), y:sy+16+(o.eLy||0)},eR:{x:cx+18+(o.eRx||0), y:sy+16+(o.eRy||0)},hL:{x:cx-14+(o.hLx||0), y:sy+32+(o.hLy||0)},hR:{x:cx+14+(o.hRx||0), y:sy+32+(o.hRy||0)}};
};
const airP=(cx,topY,up=false)=>{
  const sy=topY+8;
  return{head:{x:cx, y:topY-4},neck:{x:cx, y:topY+8},sho:{x:cx, y:sy+4},hips:{x:cx, y:sy+28},kL:{x:cx-12, y:sy+46},kR:{x:cx+12, y:sy+46},fL:{x:cx-10, y:sy+62},fR:{x:cx+10, y:sy+62},eL:up?{x:cx-22,y:sy-6}:{x:cx-22,y:sy+20},eR:up?{x:cx+22,y:sy-6}:{x:cx+22,y:sy+20},hL:up?{x:cx-16,y:topY-18}:{x:cx-26,y:sy+34},hR:up?{x:cx+16,y:topY-18}:{x:cx+26,y:sy+34}};
};

const barbell=(ctx,cx,y)=>{
  ctx.strokeStyle='#777'; ctx.lineWidth=5; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(cx-44,y); ctx.lineTo(cx+44,y); ctx.stroke();
  [[-44,-30],[30,44]].forEach(([a,b])=>{ctx.fillStyle='#444'; ctx.fillRect(cx+a,y-7,b-a,14);ctx.strokeStyle='#666'; ctx.lineWidth=1; ctx.strokeRect(cx+a,y-7,b-a,14);});
};
const gnd=(ctx,gY,W,col)=>{
  ctx.strokeStyle='#2a2a2a'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(0,gY); ctx.lineTo(W,gY); ctx.stroke();
  ctx.globalAlpha=.03; ctx.strokeStyle=col; ctx.lineWidth=.5;
  for(let x=0;x<W;x+=14){ctx.beginPath();ctx.moveTo(x,gY);ctx.lineTo(x,gY+2);ctx.stroke();}
  ctx.globalAlpha=1;
};
const box=(ctx,x,y,w,h)=>{
  ctx.fillStyle='#1e1e1e'; ctx.fillRect(x,y,w,h);
  ctx.strokeStyle='#3a3a3a'; ctx.lineWidth=1.5; ctx.strokeRect(x,y,w,h);
  ctx.fillStyle='#252525';
  for(let i=1;i<3;i++){ctx.fillRect(x,y+h*i/3,w,1);}
};
const net=(ctx,nx,topY,gY,col)=>{
  ctx.strokeStyle='#282828'; ctx.lineWidth=2.5;
  ctx.beginPath(); ctx.moveTo(nx,topY); ctx.lineTo(nx,gY); ctx.stroke();
  ctx.strokeStyle='#222'; ctx.lineWidth=.7;
  for(let y=topY+6;y<gY;y+=8){ctx.beginPath();ctx.moveTo(nx-4,y);ctx.lineTo(nx,y);ctx.stroke();}
  ctx.strokeStyle=col+'44'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(nx-5,topY); ctx.lineTo(nx+2,topY); ctx.stroke();
};
const vball=(ctx,x,y,r,a)=>{
  ctx.globalAlpha=a;
  ctx.fillStyle='#ddd'; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#999'; ctx.lineWidth=.8; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.stroke();
  ctx.strokeStyle='#888'; ctx.lineWidth=.6;
  ctx.beginPath(); ctx.moveTo(x-r,y); ctx.quadraticCurveTo(x,y-r*.5,x+r,y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x-r*.5,y-r*.85); ctx.quadraticCurveTo(x+r*.6,y,x-r*.5,y+r*.85); ctx.stroke();
  ctx.globalAlpha=1;
};

const jumpShadow=(ctx,cx,gY,bodyY,maxH)=>{
  const frac=sat((gY-bodyY)/maxH);
  ctx.globalAlpha=lerp(.18,.02,frac);
  ctx.fillStyle='#aaa';
  ctx.beginPath(); ctx.ellipse(cx,gY+3,lerp(16,5,frac),3.5,0,0,Math.PI*2); ctx.fill();
  ctx.globalAlpha=1;
};
const ripple=(ctx,cx,gY,age,col)=>{
  ctx.globalAlpha=sat(1-age)*.35; ctx.strokeStyle=col; ctx.lineWidth=1.2;
  ctx.beginPath(); ctx.arc(cx,gY,age*26,Math.PI,Math.PI*2); ctx.stroke();
  ctx.globalAlpha=1;
};
const speedLines=(ctx,cx,gY,speed,col)=>{
  ctx.globalAlpha=speed*.18; ctx.strokeStyle=col; ctx.lineWidth=.8;
  for(let i=0;i<3;i++){const yo=i*13; ctx.beginPath(); ctx.moveTo(cx-30-i*5,gY-36-yo); ctx.lineTo(cx-18-i*5,gY-36-yo); ctx.stroke();}
  ctx.globalAlpha=1;
};

const EXERCISES={
  "Depth Jumps":{
    muscles:['quad','calf','glute','hamstring'],
    howTo:[
      {step:'Setup', desc:'Stand on a box 12–18 inches high. Step (don\'t jump) off the edge.'},
      {step:'Land', desc:'Hit the ground with both feet simultaneously, absorbing with soft ankles, knees, and hips.'},
      {step:'React', desc:'Immediately explode upward as fast as possible — minimize ground contact time.'},
      {step:'Arms', desc:'Drive both arms up aggressively to add 2–3 inches to your jump height.'},
      {step:'Reset', desc:'Land softly, walk back to the box, and rest 30–60 seconds between reps.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,gY=152,cx=76;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      box(ctx,12,gY-24,52,24); gnd(ctx,gY,W,col);
      let p;
      if(t<.10){p=pose(38,gY-24,.05,{hx:1});}
      else if(t<.22){const v=easeIn2((t-.10)/.12);p=lerpPose(pose(38,gY-24),pose(cx,gY,.2,{eLy:8,eRy:8,hLy:14,hRy:14}),easeOut(v));}
      else if(t<.38){const v=smootherstep(sat((t-.22)/.16));const cr=lerp(.1,.92,Math.sin(v*Math.PI));const dl=Math.sin(v*Math.PI);p=pose(cx,gY,cr,{eLy:dl*12,eRy:dl*12,hLy:dl*20,hRy:dl*20,hLx:-5,hRx:5});if(v<.55) ripple(ctx,cx,gY,v*.6,col);}
      else if(t<.54){const v=easeOut4(sat((t-.38)/.16));const cr=lerp(.85,0,v);p=pose(cx,gY,cr,{eLy:lerp(14,-44,v),eRy:lerp(14,-44,v),hLy:lerp(22,-62,v),hRy:lerp(22,-62,v),hLx:-6,hRx:6});ctx.globalAlpha=sat(1-v)*.25; ctx.strokeStyle=col; ctx.lineWidth=1;ctx.beginPath(); ctx.arc(cx,gY,v*22,Math.PI,Math.PI*2); ctx.stroke(); ctx.globalAlpha=1;}
      else if(t<.80){const v=(t-.54)/.26;const peakH=92, yOff=peakH*4*v*(1-v), bodyY=gY-yOff;jumpShadow(ctx,cx,gY,bodyY,peakH);const tuck=Math.sin(v*Math.PI)*.3;const ap=airP(cx,bodyY-30,true);p={...ap,eL:{x:cx-20,y:ap.sho.y+lerp(-4,14,v*.8)},eR:{x:cx+20,y:ap.sho.y+lerp(-4,14,v*.8)},hL:{x:cx-14,y:ap.sho.y+lerp(-16,8,v*.8)},hR:{x:cx+14,y:ap.sho.y+lerp(-16,8,v*.8)},kL:{x:cx-11-tuck*3,y:ap.kL.y-tuck*10},kR:{x:cx+11+tuck*3,y:ap.kR.y-tuck*10},fL:{x:cx-9,y:ap.fL.y-tuck*16},fR:{x:cx+9,y:ap.fR.y-tuck*16}};if(v>.3&&v<.7){const fade=sat(1-Math.abs(v-.5)/.2);ctx.globalAlpha=fade*.65; ctx.strokeStyle=col; ctx.lineWidth=.8; ctx.setLineDash([2,4]);ctx.beginPath(); ctx.moveTo(cx+30,bodyY-26); ctx.lineTo(cx+30,gY); ctx.stroke();ctx.setLineDash([]); ctx.fillStyle=col; ctx.font='bold 7px monospace';ctx.fillText(Math.round(yOff*.88)+'"',cx+33,bodyY-20); ctx.globalAlpha=1;}}
      else{const v=smootherstep(sat((t-.80)/.20));const ap=airP(cx,gY-18,true); const lp2=pose(cx,gY,.28);p=lerpPose(ap,lp2,easeOut4(v));if(v>.7) ripple(ctx,cx,gY,(v-.7)/.3,col);jumpShadow(ctx,cx,gY,gY-18*(1-v),80);}
      drawBody(ctx,p);
    }
  },
  "Box Jumps":{
    muscles:['quad','glute','calf'],
    howTo:[
      {step:'Start Position', desc:'Stand about 1 foot away from the box with feet hip-width apart.'},
      {step:'Load', desc:'Hinge at your hips and bend your knees into a quarter squat, swinging arms back.'},
      {step:'Explode', desc:'Drive your arms forward and up while pushing through both feet to launch onto the box.'},
      {step:'Land Soft', desc:'Land with both feet simultaneously in a soft quarter squat — never land stiff-legged.'},
      {step:'Step Down', desc:'Always step down (don\'t jump down) to save your joints for the next rep.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,gY=152,startX=32,boxX=102,boxTop=gY-36;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      box(ctx,72,boxTop,60,36); gnd(ctx,gY,W,col);
      let p;
      if(t<.20){const v=smootherstep(t/.20);p=pose(startX,gY,v*.82,{eLy:lerp(0,16,v),eRy:lerp(0,16,v),hLy:lerp(0,26,v),hRy:lerp(0,26,v),hLx:-5,hRx:5,hx:2});}
      else if(t<.50){const v=(t-.20)/.30;const px=lerp(startX,boxX,easeOut(v));const peakH=80, yOff=peakH*4*v*(1-v), bodyY=gY-yOff;jumpShadow(ctx,px,gY,bodyY,peakH+20);const ap=airP(px,bodyY-28,true);p={...ap,eL:{x:px-20,y:ap.sho.y+lerp(-18,10,v)},eR:{x:px+20,y:ap.sho.y+lerp(-18,10,v)},hL:{x:px-14,y:ap.sho.y+lerp(-32,6,v)},hR:{x:px+14,y:ap.sho.y+lerp(-32,6,v)},head:{x:px+lerp(0,3,v),y:ap.head.y}};if(v>.3&&v<.72){const fade=Math.sin(sat((v-.3)/.42)*Math.PI);ctx.globalAlpha=fade*.6; ctx.strokeStyle=col; ctx.lineWidth=.8; ctx.setLineDash([2,4]);ctx.beginPath(); ctx.moveTo(px+28,bodyY-22); ctx.lineTo(px+28,gY); ctx.stroke();ctx.setLineDash([]); ctx.fillStyle=col; ctx.font='bold 7px monospace';ctx.fillText(Math.round(peakH*4*v*(1-v)*.9)+'"',px+31,bodyY-16); ctx.globalAlpha=1;}}
      else if(t<.64){const v=smootherstep(sat((t-.50)/.14));p=pose(boxX,boxTop,lerp(.5,.12,easeOut(v)),{eLy:lerp(8,2,v),eRy:lerp(8,2,v),hLy:lerp(16,4,v),hRy:lerp(16,4,v)});if(v<.55) ripple(ctx,boxX,boxTop,(v/.55)*.7,col);}
      else if(t<.78){p=pose(boxX,boxTop,lerp(.12,0,easeOut(sat((t-.64)/.14))));}
      else{p=lerpPose(pose(boxX,boxTop,.05),pose(startX,gY,.04),easeInOut(sat((t-.78)/.22)));}
      drawBody(ctx,p);
    }
  },
  "Broad Jumps":{
    muscles:['quad','glute','hamstring','calf'],
    howTo:[
      {step:'Setup', desc:'Stand with feet shoulder-width apart, toes at a starting line.'},
      {step:'Load', desc:'Swing your arms back and drop into a quarter squat simultaneously.'},
      {step:'Launch', desc:'Explode forward at roughly a 45° angle, driving arms forward and up for momentum.'},
      {step:'Reach', desc:'Extend your legs forward as you peak, reaching as far as possible with your feet.'},
      {step:'Land & Measure', desc:'Land with both feet, absorb the force, and measure from your toes to the starting line.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,gY=152;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      gnd(ctx,gY,W,col);
      if(t>.14&&t<.90){const pr=sat((t-.14)/.76);ctx.strokeStyle=col+'1e'; ctx.lineWidth=1; ctx.setLineDash([3,4]);ctx.beginPath(); ctx.moveTo(18,gY+14); ctx.lineTo(18+pr*104,gY+14); ctx.stroke();ctx.setLineDash([]); ctx.fillStyle=col+'55'; ctx.font='8px monospace';ctx.fillText(Math.round(pr*10)+'ft',20+pr*104,gY+12);}
      let p;
      if(t<.16){const v=smootherstep(t/.16);p=pose(20,gY,v*.88,{hLy:v*18,hRy:v*18,hLx:-4,hRx:4,hx:2});}
      else if(t<.52){const v=(t-.16)/.36;const px=lerp(20,118,easeOut(v));const peakH=62, yOff=peakH*4*v*(1-v), bodyY=gY-yOff;jumpShadow(ctx,px,gY,bodyY,peakH+10);const ap=airP(px,bodyY-26,false);p={...ap,head:{x:px+lerp(0,5,v*.7),y:ap.head.y},eL:{x:px-22,y:ap.sho.y+lerp(-10,18,v)},eR:{x:px+22,y:ap.sho.y+lerp(-10,18,v)},hL:{x:px-28,y:ap.sho.y+lerp(-6,32,v)},hR:{x:px+28,y:ap.sho.y+lerp(-6,32,v)}};}
      else if(t<.68){const v=smootherstep(sat((t-.52)/.16));p=pose(118,gY,lerp(.55,.12,easeOut(v)),{hLy:lerp(18,2,v),hRy:lerp(18,2,v)});if(v<.5) ripple(ctx,118,gY,(v/.5)*.65,col);}
      else{p=pose(118,gY,lerp(.12,0,easeOut(sat((t-.68)/.32))));}
      drawBody(ctx,p);
    }
  },
  "Back Squat":{
    muscles:['quad','glute','hamstring','core'],
    howTo:[
      {step:'Bar Position', desc:'Rest the barbell across your upper traps (high bar) or rear delts (low bar). Never on your neck.'},
      {step:'Stance', desc:'Feet slightly wider than shoulder-width, toes pointed out 15–30°.'},
      {step:'Brace', desc:'Take a deep breath into your belly, brace your core like you\'re about to get punched.'},
      {step:'Descend', desc:'Push your knees out over your toes and sit your hips back and down until thighs are at least parallel.'},
      {step:'Drive Up', desc:'Push the floor away, keep your chest tall, and lock out at the top. Exhale at the top.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,cx=70,gY=152;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      gnd(ctx,gY,W,col);
      const depth=t<.5?smootherstep(t*2):smootherstep((1-t)*2);
      const p=pose(cx,gY,depth); const by=p.sho.y-3;
      barbell(ctx,cx,by);
      ctx.strokeStyle=col+'14'; ctx.lineWidth=1; ctx.setLineDash([3,3]);
      ctx.beginPath(); ctx.moveTo(10,gY-54+depth*22); ctx.lineTo(130,gY-54+depth*22); ctx.stroke(); ctx.setLineDash([]);
      drawBody(ctx,{...p,eL:{x:cx-28,y:by+8},eR:{x:cx+28,y:by+8},hL:{x:cx-36,y:by+2},hR:{x:cx+36,y:by+2}});
    }
  },
  "Romanian Deadlift":{
    muscles:['hamstring','glute','lats'],
    howTo:[
      {step:'Grip', desc:'Hold the barbell with an overhand grip just outside your hips, arms straight.'},
      {step:'Hinge', desc:'Push your hips backward while keeping a slight bend in your knees — this is NOT a squat.'},
      {step:'Lower', desc:'Lower the bar along your legs until you feel a deep stretch in your hamstrings (usually mid-shin).'},
      {step:'Flat Back', desc:'Keep your spine neutral the entire time — no rounding. Chest faces the floor, not straight down.'},
      {step:'Drive Up', desc:'Squeeze your glutes and push your hips forward to return to standing.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,cx=70,gY=152;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      gnd(ctx,gY,W,col);
      const h=t<.5?smootherstep(t*2):smootherstep((1-t)*2), lean=h*.55;
      const hy=gY-54+h*20, sy=hy-26+h*28;
      const p={head:{x:cx+lean*22,y:sy-22},neck:{x:cx+lean*16,y:sy-6},sho:{x:cx+lean*14,y:sy+2},hips:{x:cx,y:hy},kL:{x:cx-9,y:gY-26},kR:{x:cx+9,y:gY-26},fL:{x:cx-10,y:gY},fR:{x:cx+10,y:gY},eL:{x:cx+lean*8-5,y:hy+h*12},eR:{x:cx+lean*8+5,y:hy+h*12},hL:{x:cx+lean*14-8,y:hy+20+h*24},hR:{x:cx+lean*14+8,y:hy+20+h*24}};
      ctx.strokeStyle='#666'; ctx.lineWidth=5; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(cx-38,p.hL.y); ctx.lineTo(cx+38,p.hL.y); ctx.stroke();
      [[-38,-24],[24,38]].forEach(([a,b])=>{ctx.fillStyle='#444';ctx.fillRect(cx+a,p.hL.y-7,b-a,14);ctx.strokeStyle='#666';ctx.lineWidth=1;ctx.strokeRect(cx+a,p.hL.y-7,b-a,14);});
      drawBody(ctx,p);
    }
  },
  "Trap Bar Deadlift":{
    muscles:['quad','glute','hamstring','lats','core'],
    howTo:[
      {step:'Step Inside', desc:'Stand in the center of the trap bar (hex bar) with feet hip-width apart.'},
      {step:'Hinge & Grip', desc:'Push hips back, bend knees, and grip the handles at your sides. Hips higher than knees.'},
      {step:'Set Your Back', desc:'Chest up, lats engaged, take a big breath and brace your core before every pull.'},
      {step:'Drive', desc:'Push the floor away with your legs while your hips and shoulders rise at the same rate.'},
      {step:'Lock Out', desc:'Stand tall at the top, squeezing glutes. Lower with control — don\'t drop the weight.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,cx=70,gY=152;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      gnd(ctx,gY,W,col);
      const lift=t<.5?easeOut4(t*2):1-easeOut4((t-.5)*2);
      const p=pose(cx,gY,(1-lift)*.88); const by=p.hips.y+6;
      ctx.strokeStyle='#666'; ctx.lineWidth=3; ctx.strokeRect(cx-30,by-11,60,22);
      ctx.strokeStyle='#555'; ctx.lineWidth=4;
      ctx.beginPath(); ctx.moveTo(cx-44,by); ctx.lineTo(cx-30,by); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx+30,by); ctx.lineTo(cx+44,by); ctx.stroke();
      drawBody(ctx,{...p,hL:{x:cx-30,y:by},hR:{x:cx+30,y:by},eL:{x:cx-22,y:by-10},eR:{x:cx+22,y:by-10}});
    }
  },
  "Jump Squats (light)":{
    muscles:['quad','glute','calf'],
    howTo:[
      {step:'Weight', desc:'Use only 20–30% of your bodyweight (or bodyweight only). This is a speed exercise, not a strength one.'},
      {step:'Descend', desc:'Drop quickly into a quarter squat — you don\'t need to go deep.'},
      {step:'Explode', desc:'Drive up as fast as possible, leaving the ground completely. Speed is everything here.'},
      {step:'Land', desc:'Absorb with soft knees upon landing, then immediately repeat.'},
      {step:'Intent', desc:'Every single rep should feel like you\'re trying to touch the ceiling. Half-effort negates the benefit.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,cx=70,gY=152;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      gnd(ctx,gY,W,col);
      let p;
      if(t<.22){const v=smootherstep(t/.22);p=pose(cx,gY,v*.72,{eLy:v*12,eRy:v*12,hLy:v*20,hRy:v*20});}
      else if(t<.48){const v=(t-.22)/.26;const peakH=58, yOff=peakH*4*v*(1-v), bodyY=gY-yOff;jumpShadow(ctx,cx,gY,bodyY,peakH);const ap=airP(cx,bodyY-28,true);p={...ap,eL:{x:cx-20,y:ap.sho.y+lerp(-4,12,v)},eR:{x:cx+20,y:ap.sho.y+lerp(-4,12,v)},hL:{x:cx-14,y:ap.sho.y+lerp(-18,6,v)},hR:{x:cx+14,y:ap.sho.y+lerp(-18,6,v)}};}
      else if(t<.62){const v=smootherstep(sat((t-.48)/.14));p=pose(cx,gY,lerp(.5,.08,easeOut(v)));if(v<.55) ripple(ctx,cx,gY,(v/.55)*.6,col);}
      else{p=pose(cx,gY,lerp(.08,0,easeOut(sat((t-.62)/.38))));}
      drawBody(ctx,p);
    }
  },
  "Bulgarian Split Squat":{
    muscles:['quad','glute','hamstring'],
    howTo:[
      {step:'Setup', desc:'Place your rear foot on a bench behind you, laces down. Front foot should be 2–3 feet forward.'},
      {step:'Balance', desc:'Find your balance before adding weight — this takes practice. Use a wall if needed at first.'},
      {step:'Descend', desc:'Drop your rear knee straight toward the ground, keeping your front shin mostly vertical.'},
      {step:'Depth', desc:'Lower until your front thigh is parallel to the floor, or as far as flexibility allows.'},
      {step:'Drive', desc:'Press through your front heel to stand back up. Keep your torso tall throughout.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,gY=152;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      box(ctx,82,gY-30,50,16); gnd(ctx,gY,W,col);
      const depth=t<.5?smootherstep(t*2):smootherstep((1-t)*2);
      const cx=60, hy=gY-52+depth*24, sy=hy-26;
      drawBody(ctx,{head:{x:cx,y:sy-22},neck:{x:cx,y:sy-6},sho:{x:cx,y:sy+2},hips:{x:cx,y:hy},kL:{x:cx-18,y:gY-24+depth*10},kR:{x:cx+18,y:hy+20},fL:{x:cx-26,y:gY},fR:{x:cx+22,y:gY-30},eL:{x:cx-18,y:sy+18},eR:{x:cx+18,y:sy+18},hL:{x:cx-14,y:sy+34},hR:{x:cx+14,y:sy+34}});
    }
  },
  "Nordic Curls":{
    muscles:['hamstring','glute'],
    howTo:[
      {step:'Anchor', desc:'Kneel and have a partner hold your ankles, or anchor them under a bar or pad.'},
      {step:'Lower Slowly', desc:'With a straight body line from knee to head, slowly lower yourself toward the floor using only your hamstrings to control the descent.'},
      {step:'Catch', desc:'When you can no longer hold, catch yourself with your hands and use a small push to assist back up.'},
      {step:'Pull Back', desc:'Use your hamstrings to curl your body back to the upright starting position.'},
      {step:'Progression', desc:'Start with 3–5 reps. This is an extremely difficult exercise — even one rep of controlled lowering is effective.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,gY=152;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      box(ctx,4,gY-16,42,16); gnd(ctx,gY,W,col);
      const lean=t<.42?easeOut4(t/.42)*.76:(.76-easeOut4((t-.42)/.58)*.76);
      const angle=Math.PI*lean, ax=25, ay=gY-16, bL=68;
      const bx=ax+Math.sin(angle)*bL, by=ay-Math.cos(angle)*bL;
      const hx2=bx+Math.sin(angle)*14, hy2=by-Math.cos(angle)*14;
      const aA=angle+.55, fL2=20;
      drawBody(ctx,{head:{x:hx2,y:hy2},neck:{x:hx2-Math.sin(angle)*10,y:hy2+Math.cos(angle)*10},sho:{x:bx+Math.sin(angle)*4,y:by-Math.cos(angle)*4},hips:{x:bx,y:by},kL:{x:ax-8,y:gY-10},kR:{x:ax+8,y:gY-10},fL:{x:ax-8,y:gY},fR:{x:ax+8,y:gY},eL:{x:bx-Math.sin(aA)*14,y:by+Math.cos(aA)*14},eR:{x:bx+Math.sin(aA)*6,y:by+Math.cos(aA)*14},hL:{x:bx-Math.sin(aA)*fL2,y:by+Math.cos(aA)*fL2},hR:{x:bx+Math.sin(aA)*(fL2-8),y:by+Math.cos(aA)*fL2}});
    }
  },
  "Single-Leg Hops":{
    muscles:['calf','quad','glute'],
    howTo:[
      {step:'Balance', desc:'Stand on one leg with a slight knee bend. The other leg hangs naturally.'},
      {step:'Load', desc:'Dip slightly by bending your standing knee — just enough to load the calf and quad.'},
      {step:'Hop', desc:'Spring off your foot, pushing through your toes. Land on the same foot.'},
      {step:'Minimize Contact', desc:'The goal is to spend as little time on the ground as possible between hops — like a pogo stick.'},
      {step:'Direction', desc:'You can hop in place, forward, sideways, or in a pattern. Mix it up for coordination benefits.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,gY=152;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      gnd(ctx,gY,W,col);
      const cx=70+Math.sin(t*Math.PI*2)*34;
      const airFrac=sat(Math.sin(t*Math.PI*2)*.8+.2);
      const bodyY=gY-airFrac*52, hy=bodyY-30, sy=hy-26;
      jumpShadow(ctx,cx,gY,bodyY,60);
      drawBody(ctx,{head:{x:cx,y:sy-22},neck:{x:cx,y:sy-6},sho:{x:cx,y:sy+2},hips:{x:cx,y:hy},kL:{x:cx-9,y:hy+22},kR:{x:cx+14,y:hy+14},fL:{x:cx-10,y:bodyY},fR:{x:cx+18,y:hy+28},eL:{x:cx-20,y:sy+12+airFrac*10},eR:{x:cx+20,y:sy+12-airFrac*10},hL:{x:cx-24,y:sy+26-airFrac*18},hR:{x:cx+24,y:sy+26+airFrac*18}});
    }
  },
  "Calf Raises (weighted)":{
    muscles:['calf'],
    howTo:[
      {step:'Position', desc:'Stand with the balls of your feet on a raised surface (step, plate, or calf raise machine) so your heels can drop below your toes.'},
      {step:'Full Stretch', desc:'Let your heels drop as low as possible at the bottom — the full stretch is where gains happen.'},
      {step:'Rise Slow', desc:'Raise up onto your toes as high as you can, squeezing your calves at the top for 1 second.'},
      {step:'Control Down', desc:'Lower slowly over 3 seconds. Don\'t bounce at the bottom.'},
      {step:'Load', desc:'Holding dumbbells or a barbell adds intensity. Even bodyweight on one leg is very challenging.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,cx=70,gY=152;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      gnd(ctx,gY,W,col);
      const rise=(t<.5?smootherstep(t*2):smootherstep((1-t)*2))*20;
      const p=pose(cx,gY-rise);
      barbell(ctx,cx,p.sho.y-3);
      drawBody(ctx,{...p,hL:{x:cx-38,y:p.sho.y+2},hR:{x:cx+38,y:p.sho.y+2},eL:{x:cx-30,y:p.sho.y+8},eR:{x:cx+30,y:p.sho.y+8}});
    }
  },
  "Arm Swing Drills":{
    muscles:['delt','bicep','tricep'],
    howTo:[
      {step:'Start Position', desc:'Stand with feet shoulder-width apart in a slight athletic stance.'},
      {step:'Elbow Angle', desc:'Keep elbows bent at roughly 90°. Arms should swing like a pendulum, not flap like wings.'},
      {step:'Back Swing', desc:'Drive one arm forcefully backward until your hand passes your hip — this loads the forward swing.'},
      {step:'Forward Drive', desc:'Explode the arm forward and up, reaching roughly eye level. Arms should stop at chin height in front.'},
      {step:'Sync', desc:'Practice syncing opposite arms. Then practice timing both arms together for a two-foot jump takeoff.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,cx=70,gY=152;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      gnd(ctx,gY,W,col);
      const sw=Math.sin(t*Math.PI*2), p=pose(cx,gY);
      ctx.strokeStyle=col+'0e'; ctx.lineWidth=14; ctx.lineCap='round';
      ctx.beginPath(); ctx.arc(cx-16,p.sho.y+14,28,-1.4,.9); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx+16,p.sho.y+14,28,Math.PI-.9,Math.PI+1.4); ctx.stroke();
      drawBody(ctx,{...p,eL:{x:cx-20-sw*8,y:p.sho.y+12+sw*14},eR:{x:cx+20+sw*8,y:p.sho.y+12-sw*14},hL:{x:cx-16-sw*16,y:p.sho.y-2+sw*26},hR:{x:cx+16+sw*16,y:p.sho.y-2-sw*26}});
    }
  },
  "Max Vertical Jumps":{
    muscles:['quad','glute','calf','core'],
    howTo:[
      {step:'Measurement', desc:'Stand next to a wall with your dominant arm raised — mark your standing reach.'},
      {step:'Load', desc:'Dip into a comfortable quarter-to-half squat, loading your arms back simultaneously.'},
      {step:'Explode', desc:'Drive your arms upward while fully extending your ankles, knees, and hips at the same moment.'},
      {step:'Reach', desc:'At the peak, extend your reaching arm as high as possible and slap or mark the wall.'},
      {step:'Measure', desc:'Subtract your standing reach from your jump reach — that\'s your vertical. Track it every week.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,cx=52,gY=152;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      gnd(ctx,gY,W,col);
      ctx.strokeStyle='#1e1e1e'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(112,6); ctx.lineTo(112,gY); ctx.stroke();
      for(let i=0;i<7;i++){ctx.strokeStyle='#2a2a2a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(107,14+i*18);ctx.lineTo(112,14+i*18);ctx.stroke();}
      const arc=t<.5?easeOut4(t*2):easeOut4((1-t)*2);
      const peakH=84, bodyY=gY-arc*peakH;
      let p=arc<.18?pose(cx,gY,arc/.18*.86):lerpPose(pose(cx,gY,.86),airP(cx,bodyY-28,true),easeOut4(sat((arc-.18)/.82)));
      jumpShadow(ctx,cx,gY,bodyY,peakH);
      if(arc>.7){const dy=bodyY-24;ctx.fillStyle=col;ctx.beginPath();ctx.arc(108,dy,5,0,Math.PI*2);ctx.fill();ctx.strokeStyle=col+'44';ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(p.hR.x,p.hR.y);ctx.lineTo(108,dy);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=col;ctx.font='bold 8px monospace';ctx.fillText('+6"',113,dy+3);}
      drawBody(ctx,p);
    }
  },
  "Step-Ups (explosive)":{
    muscles:['quad','glute'],
    howTo:[
      {step:'Height', desc:'Use a box or step that puts your knee at roughly 90° when your foot is on top — typically 12–20 inches.'},
      {step:'Foot Placement', desc:'Place your entire foot flat on the box. Don\'t let your heel hang off the edge.'},
      {step:'Drive', desc:'Push through your heel on the box to drive your body upward. The trail leg should only assist minimally.'},
      {step:'Extend', desc:'Fully lock out your hip at the top — squeeze your glute and stand tall.'},
      {step:'Control Down', desc:'Step back down with control. Don\'t crash into the ground between reps.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,gY=152;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      box(ctx,62,gY-34,68,34); gnd(ctx,gY,W,col);
      let p;
      if(t<.30){const v=smootherstep(t/.30);p=lerpPose(pose(48,gY),{...pose(76,gY-34,.28),kR:{x:55,y:gY-18},fR:{x:55,y:gY}},easeOut(v));}
      else if(t<.55)p=lerpPose(pose(76,gY-34,.28),airP(76,gY-82,true),easeOut4((t-.30)/.25));
      else if(t<.72)p=lerpPose(airP(76,gY-80,true),pose(76,gY-34),easeOut((t-.55)/.17));
      else p=pose(76,gY-34,lerp(.18,0,easeOut((t-.72)/.28)));
      drawBody(ctx,p);
    }
  },
  "Vert Test":{
    muscles:['quad','glute','calf'],
    howTo:[
      {step:'Morning Only', desc:'Test first thing in the morning, before any training. Fatigue can steal 2–4 inches from your result.'},
      {step:'Stand & Mark', desc:'Stand flat-footed next to a wall and reach up with your dominant arm — mark the highest point.'},
      {step:'No Approach', desc:'This is a standing vertical — no steps allowed. Feet stay in place until you jump.'},
      {step:'3 Attempts', desc:'Take 3 full-effort jumps with 60 seconds rest between each. Record only the best attempt.'},
      {step:'Log It', desc:'Write down the date and result. Progress only becomes visible over weeks — trust the process.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,cx=52,gY=152;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      gnd(ctx,gY,W,col);
      ctx.strokeStyle='#1e1e1e'; ctx.lineWidth=2.5; ctx.beginPath(); ctx.moveTo(114,6); ctx.lineTo(114,gY); ctx.stroke();
      for(let i=0;i<8;i++){ctx.strokeStyle=i===2?col+'55':'#222';ctx.lineWidth=i===2?1.4:1;ctx.beginPath();ctx.moveTo(108,12+i*16);ctx.lineTo(114,12+i*16);ctx.stroke();}
      const arc=t<.5?easeOut4(t*2):easeOut4((1-t)*2);
      const peakH=86, bodyY=gY-arc*peakH;
      let p=arc<.2?pose(cx,gY,arc/.2*.86):lerpPose(pose(cx,gY,.86),airP(cx,bodyY-28,true),easeOut4(sat((arc-.2)/.8)));
      jumpShadow(ctx,cx,gY,bodyY,peakH);
      if(arc>.66){const dy=bodyY-22;ctx.fillStyle=col;ctx.beginPath();ctx.arc(110,dy,5,0,Math.PI*2);ctx.fill();ctx.strokeStyle=col+'44';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(110,dy);ctx.lineTo(110,12+2*16);ctx.stroke();ctx.fillStyle=col;ctx.font='bold 8px monospace';ctx.fillText('+4"',115,dy+3);}
      drawBody(ctx,p);
    }
  },
  "Spike Approach":{
    muscles:['quad','glute','delt','bicep'],
    howTo:[
      {step:'4-Step Pattern', desc:'Right-handed: start with your left foot. Pattern is Left → Right → Left-Right (plant). Left-handers mirror this.'},
      {step:'Angle', desc:'Approach at roughly 45° to the net from behind the attack line. Never run straight at the net.'},
      {step:'Accelerate', desc:'Each step should be faster than the last. Your final two steps are your power steps.'},
      {step:'Plant & Load', desc:'Your second-to-last step (right foot) is the longest — it brakes your momentum and loads your jump.'},
      {step:'Two-Foot Jump', desc:'Jump off both feet simultaneously, not one. Swing both arms up for maximum height.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,gY=152;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      gnd(ctx,gY,W,col); net(ctx,116,44,gY,col);
      let p;
      if(t<.28){const v=t/.28, cx=lerp(8,74,easeOut(v));const step=v*4, sp=step%1;const bob=Math.abs(Math.sin(sp*Math.PI))*5;const legS=Math.sin(sp*Math.PI*2)*20, armS=Math.sin(sp*Math.PI*2+Math.PI)*24;p={head:{x:cx+3,y:gY-102+bob},neck:{x:cx+2,y:gY-88+bob},sho:{x:cx+1,y:gY-82+bob},hips:{x:cx,y:gY-60+bob*.4},kL:{x:cx-8,y:gY-28+legS*.35},kR:{x:cx+8,y:gY-28-legS*.35},fL:{x:cx-10+legS*.75,y:gY},fR:{x:cx+10-legS*.75,y:gY},eL:{x:cx-18-armS*.45,y:gY-72+bob},eR:{x:cx+18+armS*.45,y:gY-72+bob},hL:{x:cx-14-armS*.9,y:gY-58+bob},hR:{x:cx+14+armS*.9,y:gY-58+bob}};speedLines(ctx,cx,gY,easeOut(v),col);}
      else if(t<.40){const v=smootherstep(sat((t-.28)/.12)), cx=74;p=pose(cx,gY,v*.82,{eLy:lerp(0,18,v),eRy:lerp(0,18,v),hLy:lerp(0,30,v),hRy:lerp(0,30,v),hLx:-8,hRx:6,hx:2});if(v>.3) ripple(ctx,cx,gY,sat((v-.3)/.7)*.55,col);}
      else if(t<.64){const v=(t-.40)/.24, cx=74;const peakH=94, yOff=peakH*4*v*(1-v), bodyY=gY-yOff;jumpShadow(ctx,cx,gY,bodyY,peakH);const ap=airP(cx,bodyY-30,false);const nonHit=v<.5?easeOut4(v*2):lerp(1,.8,v);const hitLoad=v>.35?smootherstep(sat((v-.35)/.65)):0;p={...ap,hL:{x:cx-12,y:ap.sho.y-44*nonHit},eL:{x:cx-20,y:ap.sho.y-22*nonHit},hR:{x:cx+14+hitLoad*14,y:ap.sho.y-16+hitLoad*32},eR:{x:cx+22+hitLoad*8,y:ap.sho.y-6+hitLoad*18}};if(v>.45){const ba=smootherstep(sat((v-.45)/.3));vball(ctx,108,gY-104,9,ba*.88);}if(v>.3&&v<.72){const fade=Math.sin(sat((v-.3)/.42)*Math.PI);ctx.globalAlpha=fade*.5; ctx.strokeStyle=col; ctx.lineWidth=.8; ctx.setLineDash([2,4]);ctx.beginPath(); ctx.moveTo(cx+32,bodyY-22); ctx.lineTo(cx+32,gY); ctx.stroke();ctx.setLineDash([]); ctx.fillStyle=col; ctx.font='bold 7px monospace';ctx.fillText(Math.round(yOff*.9)+'"',cx+35,bodyY-16); ctx.globalAlpha=1;}}
      else if(t<.78){const v=easeOut4(sat((t-.64)/.14)), cx=74;const spikeY=gY-80+v*22, ap=airP(cx,spikeY-28,false);const swing=v;p={...ap,hL:{x:cx-14,y:ap.sho.y-16+swing*12},eL:{x:cx-20,y:ap.sho.y-8+swing*8},hR:{x:cx+28+swing*28,y:ap.sho.y-8+swing*46},eR:{x:cx+22+swing*18,y:ap.sho.y-2+swing*28}};if(v>.25){const bv=sat((v-.25)/.5), bx=lerp(108,132,easeOut(bv)), by=lerp(gY-104,gY-74,easeIn2(bv)), ba=sat(1-bv*1.6);vball(ctx,bx,by,9,ba*.85);ctx.globalAlpha=ba*.35; ctx.strokeStyle=col; ctx.lineWidth=.8; ctx.setLineDash([2,3]);ctx.beginPath(); ctx.moveTo(108,gY-104); ctx.lineTo(bx,by); ctx.stroke();ctx.setLineDash([]); ctx.globalAlpha=1;}else vball(ctx,108,gY-104,9,.88);}
      else{const v=smootherstep(sat((t-.78)/.22)), cx=74;const fromP={...airP(cx,gY-28,false),hR:{x:cx+42,y:gY-56},eR:{x:cx+36,y:gY-64}};p=lerpPose(fromP,pose(cx,gY,.22),easeOut4(v));if(v<.35) ripple(ctx,cx,gY,(v/.35)*.55,col);}
      drawBody(ctx,p);
    }
  },
  "Blocking Jumps":{
    muscles:['quad','glute','delt'],
    howTo:[
      {step:'Start Position', desc:'Stand close to the net in an athletic stance — feet shoulder-width, weight on the balls of your feet.'},
      {step:'Read the Setter', desc:'Watch the setter\'s hands to time your block. Don\'t jump too early.'},
      {step:'Load', desc:'A quick, shallow dip — your block jump is faster and more reactive than an attack jump.'},
      {step:'Jump Straight Up', desc:'Jump vertically, not forward into the net. Arms reach up and over the net.'},
      {step:'Penetrate', desc:'Push your hands and wrists over the net plane, angling fingers down toward the court. Land and reset immediately.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,cx=56,gY=152;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      gnd(ctx,gY,W,col); net(ctx,100,28,gY,col);
      const arc=t<.5?easeOut4(t*2):easeOut4((1-t)*2);
      const peakH=72, bodyY=gY-arc*peakH, hy=bodyY-30, sy=hy-26;
      const hU=arc>.44?smootherstep(sat((arc-.44)/.56)):0;
      const p={head:{x:cx,y:sy-22},neck:{x:cx,y:sy-6},sho:{x:cx,y:sy+2},hips:{x:cx,y:hy},kL:{x:cx-10,y:bodyY-8},kR:{x:cx+10,y:bodyY-8},fL:{x:cx-10,y:bodyY+(1-arc)*22},fR:{x:cx+10,y:bodyY+(1-arc)*22},eL:{x:cx-20,y:sy+4-hU*24},eR:{x:cx+20,y:sy+4-hU*24},hL:{x:cx-16,y:sy-10-hU*32},hR:{x:cx+16,y:sy-10-hU*32}};
      jumpShadow(ctx,cx,gY,bodyY,peakH);
      if(hU>.28){ctx.fillStyle=col+'12';ctx.beginPath();ctx.ellipse(cx+4,p.hR.y,24,7,0,0,Math.PI*2);ctx.fill();}
      drawBody(ctx,p);
    }
  },
  "Lateral Shuffle":{
    muscles:['quad','glute','calf'],
    howTo:[
      {step:'Stance', desc:'Stay in a low athletic stance — hips down, back straight, never let your knees lock out.'},
      {step:'Push, Don\'t Cross', desc:'Push off the outside foot and bring your feet together, then push again. Never cross your feet.'},
      {step:'Stay Low', desc:'Your head height should stay constant. If you\'re bobbing up and down, you\'re too slow to react.'},
      {step:'Quick Feet', desc:'Aim for rapid, small steps rather than big lunges. Fast feet = faster defense.'},
      {step:'Direction Change', desc:'To reverse direction, plant your outside foot hard and instantly push the other way.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,gY=152;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      gnd(ctx,gY,W,col);
      ctx.strokeStyle=col+'10'; ctx.lineWidth=12; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(16,gY+16); ctx.lineTo(126,gY+16); ctx.stroke();
      const cx=70+Math.sin(t*Math.PI*2)*44, dir=Math.cos(t*Math.PI*2);
      const bob=Math.abs(Math.sin(t*Math.PI*4))*5, step=Math.sin(t*Math.PI*4)*13, hy=gY-50+bob, sy=hy-26;
      drawBody(ctx,{head:{x:cx+dir*8,y:sy-22},neck:{x:cx+dir*5,y:sy-6},sho:{x:cx+dir*4,y:sy+2},hips:{x:cx,y:hy},kL:{x:cx-10+step,y:gY-24},kR:{x:cx+10-step,y:gY-24},fL:{x:cx-16+step*1.6,y:gY},fR:{x:cx+16-step*1.6,y:gY},eL:{x:cx-20-dir*9,y:sy+14},eR:{x:cx+20+dir*9,y:sy+14},hL:{x:cx-16-dir*16,y:sy+30},hR:{x:cx+16+dir*16,y:sy+30}});
    }
  },
  "Lateral Band Walk":{
    muscles:['glute','quad'],
    howTo:[
      {step:'Band Position', desc:'Place a resistance band just above your ankles or around your knees. Above the ankle is harder.'},
      {step:'Stance', desc:'Feet hip-width apart in a slight squat. Keep tension on the band — never let your feet come together completely.'},
      {step:'Step Out', desc:'Step one foot out to the side, maintaining the squat position and keeping tension on the band.'},
      {step:'Follow', desc:'Bring the trailing foot in — but not all the way. Keep 6–8 inches of space between feet.'},
      {step:'Feel the Burn', desc:'You should feel this in your glute medius (side of your butt). If you feel it in your quads only, go lower.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,gY=152;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      gnd(ctx,gY,W,col);
      const cx=70+Math.sin(t*Math.PI*2)*34, sp=24+Math.sin(t*Math.PI*4)*9;
      const fLp={x:cx-sp,y:gY}, fRp={x:cx+sp,y:gY};
      ctx.shadowColor='#FF3366'; ctx.shadowBlur=6; ctx.strokeStyle='#FF336688'; ctx.lineWidth=4; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(fLp.x,gY-4); ctx.quadraticCurveTo(cx,gY+13,fRp.x,gY-4); ctx.stroke();
      ctx.shadowBlur=0;
      drawBody(ctx,{head:{x:cx,y:gY-102},neck:{x:cx,y:gY-86},sho:{x:cx,y:gY-80},hips:{x:cx,y:gY-58},kL:{x:cx-sp*.6,y:gY-30},kR:{x:cx+sp*.6,y:gY-30},fL:fLp,fR:fRp,eL:{x:cx-20,y:gY-70},eR:{x:cx+20,y:gY-70},hL:{x:cx-16,y:gY-56},hR:{x:cx+16,y:gY-56}});
    }
  },
  "Overhead Press":{
    muscles:['delt','tricep','trap'],
    howTo:[
      {step:'Grip', desc:'Grip just outside shoulder-width. Bar rests on the front of your shoulders (front rack position).'},
      {step:'Brace', desc:'Big breath, brace your core and glutes. Your lower back should not arch excessively.'},
      {step:'Press', desc:'Push the bar straight up. As it passes your face, slightly tuck your chin so the bar clears your nose.'},
      {step:'Lock Out', desc:'At the top, shrug your shoulders up slightly and lock your elbows. The bar should be directly over your mid-foot.'},
      {step:'Lower', desc:'Bring the bar back to your shoulders with control. Don\'t let it crash down.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,cx=70,gY=152;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      gnd(ctx,gY,W,col);
      const press=t<.5?easeOut4(t*2):easeOut4((1-t)*2);
      const p=pose(cx,gY), by=p.sho.y-4-press*48;
      barbell(ctx,cx,by);
      drawBody(ctx,{...p,eL:{x:cx-26,y:lerp(p.sho.y+16,by+20,press)},eR:{x:cx+26,y:lerp(p.sho.y+16,by+20,press)},hL:{x:cx-36,y:by+4},hR:{x:cx+36,y:by+4}});
    }
  },
  "Hip Flexor Stretch":{
    muscles:['quad','glute'],
    howTo:[
      {step:'Half-Kneeling', desc:'Kneel on one knee (back leg) with your front foot flat on the floor, front knee over your ankle.'},
      {step:'Tall Spine', desc:'Sit tall — don\'t lean forward. Imagine a string pulling the top of your head toward the ceiling.'},
      {step:'Tuck & Squeeze', desc:'Tuck your pelvis under (posterior tilt) and squeeze the glute of the back leg. This intensifies the stretch.'},
      {step:'Breathe Into It', desc:'Take slow deep breaths and relax deeper into the stretch with each exhale. Never force it.'},
      {step:'Hold', desc:'Hold for 45–60 seconds per side. Daily stretching is needed to see lasting hip flexor flexibility gains.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,gY=152;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      gnd(ctx,gY,W,col);
      const pulse=8+Math.sin(t*Math.PI*5)*4;
      ctx.strokeStyle='#FF6B3522'; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(78,gY-32,pulse,0,Math.PI*2); ctx.stroke();
      const cx=58, hy=gY-56, sy=hy-28;
      drawBody(ctx,{head:{x:cx,y:sy-22},neck:{x:cx,y:sy-6},sho:{x:cx,y:sy+2},hips:{x:cx,y:hy},kL:{x:cx-24,y:gY-22},kR:{x:cx+26,y:gY-4},fL:{x:cx-32,y:gY},fR:{x:cx+24,y:gY},eL:{x:cx-20,y:sy+20},eR:{x:cx+20,y:sy+20},hL:{x:cx-24,y:hy-4},hR:{x:cx+24,y:hy-4}});
    }
  },
  "Wrist Curls":{
    muscles:['forearm'],
    howTo:[
      {step:'Position', desc:'Sit on a bench and rest your forearms on your thighs with palms facing up. Wrists hang just past your knees.'},
      {step:'Grip', desc:'Hold a light dumbbell or barbell with an underhand (supinated) grip.'},
      {step:'Lower', desc:'Let the weight roll down your fingers to your fingertips — full extension at the bottom.'},
      {step:'Curl', desc:'Curl your wrists upward as high as you can, squeezing your forearms at the top.'},
      {step:'Reverse', desc:'Also do reverse wrist curls (palms down) for balanced forearm strength and injury prevention.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,cx=70,gY=152;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      box(ctx,34,gY-20,72,20); gnd(ctx,gY,W,col);
      const curl=Math.sin(t*Math.PI*2)*15;
      const p={head:{x:cx,y:gY-114},neck:{x:cx,y:gY-98},sho:{x:cx,y:gY-92},hips:{x:cx,y:gY-20},kL:{x:cx-22,y:gY-20},kR:{x:cx+22,y:gY-20},fL:{x:cx-26,y:gY},fR:{x:cx+26,y:gY},eL:{x:cx-24,y:gY-34},eR:{x:cx+24,y:gY-34},hL:{x:cx-28,y:gY-20+curl},hR:{x:cx+28,y:gY-20+curl}};
      [[cx-38,cx-18],[cx+18,cx+38]].forEach(([a,b])=>{ctx.strokeStyle='#666';ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a,p.hL.y);ctx.lineTo(b,p.hL.y);ctx.stroke();ctx.fillStyle='#444';ctx.fillRect(a,p.hL.y-5,4,10);ctx.fillRect(b-4,p.hL.y-5,4,10);});
      drawBody(ctx,p);
    }
  },
  "Pallof Press":{
    muscles:['core','lats'],
    howTo:[
      {step:'Setup', desc:'Attach a band or cable at chest height. Stand sideways to the anchor, feet shoulder-width apart.'},
      {step:'Hold at Chest', desc:'Hold the band handle at your chest with both hands. The band should already be pulling sideways.'},
      {step:'Press Out', desc:'Slowly press your hands straight out in front of you. Resist rotating toward the anchor — that\'s the whole point.'},
      {step:'Hold', desc:'Pause for 1–2 seconds with arms fully extended. Feel your core working to prevent rotation.'},
      {step:'Return', desc:'Pull your hands back to your chest with control. Do all reps on one side, then switch.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,cx=76,gY=152;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      gnd(ctx,gY,W,col);
      const ext=t<.5?easeOut4(t*2):easeOut4((1-t)*2);
      const p=pose(cx,gY), ay=p.sho.y+8, hx=lerp(cx-6,cx+30,ext);
      ctx.strokeStyle='#333'; ctx.lineWidth=8; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(0,ay); ctx.lineTo(8,ay); ctx.stroke();
      ctx.shadowColor='#FFD60A'; ctx.shadowBlur=4; ctx.strokeStyle='#FFD60A44'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(8,ay); ctx.lineTo(hx,ay); ctx.stroke(); ctx.shadowBlur=0;
      ctx.fillStyle='#FFD60A'; ctx.beginPath(); ctx.arc(hx,ay,5,0,Math.PI*2); ctx.fill();
      drawBody(ctx,{...p,eL:{x:cx-2,y:ay+4},eR:{x:cx+12,y:ay+4},hL:{x:hx-7,y:ay},hR:{x:hx+7,y:ay}});
    }
  },
  "Plank":{
    muscles:['core','lats'],
    howTo:[
      {step:'Position', desc:'Forearms flat on the ground, elbows directly under your shoulders. Toes tucked under.'},
      {step:'Body Line', desc:'Form a straight line from your heels to the top of your head — no sagging hips or piked butt.'},
      {step:'Squeeze Everything', desc:'Flex your quads, squeeze your glutes, brace your core as if taking a punch. All at once.'},
      {step:'Breathe', desc:'Take slow, controlled breaths. Don\'t hold your breath — that spikes blood pressure unnecessarily.'},
      {step:'Build Time', desc:'Start with 20–30 seconds done perfectly. A shaky, perfect plank beats a 2-minute sloppy one.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,gY=152;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      gnd(ctx,gY,W,col);
      const wb=Math.sin(t*Math.PI*5)*1.2, by=gY-40+wb;
      drawBody(ctx,{head:{x:122,y:by-16},neck:{x:116,y:by-6},sho:{x:108,y:by},hips:{x:38,y:by+2},kL:{x:28,y:by+4},kR:{x:24,y:by+6},fL:{x:14,y:gY},fR:{x:18,y:gY},eL:{x:88,y:by+2},eR:{x:80,y:by+2},hL:{x:80,y:gY-4},hR:{x:72,y:gY-4}});
    }
  },
  "Dead Bug":{
    muscles:['core'],
    howTo:[
      {step:'Start', desc:'Lie on your back. Raise arms straight up toward the ceiling and bring knees to 90° (tabletop position).'},
      {step:'Lower Back Down', desc:'Press your lower back firmly into the floor — this must stay throughout. Use your core to keep it there.'},
      {step:'Extend Opposite Limbs', desc:'Slowly lower your right arm overhead and extend your left leg out — keeping both just above the floor.'},
      {step:'Return', desc:'Bring them back to the starting position, then switch sides.'},
      {step:'Go Slow', desc:'This is a control exercise, not a cardio one. 3–4 seconds out, 3–4 seconds back. Speed kills the benefit.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,gY=152;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      gnd(ctx,gY,W,col);
      const opp=Math.sin(t*Math.PI*2), by=gY-68;
      drawBody(ctx,{head:{x:18,y:by-4},neck:{x:28,y:by+4},sho:{x:70,y:by+8},hips:{x:70,y:by+44},kL:{x:52,y:by+48-opp*30},kR:{x:88,y:by+48+opp*30},fL:{x:38,y:by+60-opp*34},fR:{x:102,y:by+60+opp*34},eL:{x:52,y:by+12+opp*18},eR:{x:88,y:by+12-opp*18},hL:{x:36,y:by+18+opp*28},hR:{x:104,y:by+18-opp*28}});
    }
  },
  "Rotator Cuff Band":{
    muscles:['delt','forearm'],
    howTo:[
      {step:'Setup', desc:'Anchor a light resistance band at elbow height. Stand sideways to the anchor with the band in your far hand.'},
      {step:'Tuck Elbow', desc:'Keep your elbow pinned to your side at 90° the entire time — only your forearm moves.'},
      {step:'External Rotation', desc:'Rotate your forearm away from your body (outward) against the band\'s resistance. Slow and controlled.'},
      {step:'Return', desc:'Slowly return to the starting position. Don\'t let the band yank you back.'},
      {step:'Internal Rotation', desc:'Also do the reverse: stand with the anchor on the same side and rotate inward. Both directions matter equally.'},
    ],
    fn:(ctx,t,col)=>{
      const W=140,H=180,cx=70,gY=152;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a0a0a'; ctx.fillRect(0,0,W,H);
      gnd(ctx,gY,W,col);
      const rot=Math.sin(t*Math.PI*2), p=pose(cx,gY);
      const ex=cx+24, ey=p.sho.y+16, fa=-0.35+rot*1.15;
      const hx=ex+Math.cos(fa)*24, hy2=ey+Math.sin(fa)*24;
      ctx.strokeStyle='#2a2a2a'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(0,ey); ctx.lineTo(cx-24,ey); ctx.stroke();
      ctx.shadowColor='#00FFFF'; ctx.shadowBlur=5; ctx.strokeStyle='#00FFFF77'; ctx.lineWidth=3.5; ctx.beginPath(); ctx.moveTo(cx-24,ey); ctx.lineTo(hx,hy2); ctx.stroke(); ctx.shadowBlur=0;
      ctx.strokeStyle='#00FFFF14'; ctx.lineWidth=10; ctx.beginPath(); ctx.arc(ex,ey,24,-1.6,.9); ctx.stroke();
      drawBody(ctx,{...p,eR:{x:ex,y:ey},hR:{x:hx,y:hy2}});
    }
  },
};

function AnimCanvas({exercise,color}){
  const ref=useRef(null), fr=useRef(0), raf=useRef(null);
  useEffect(()=>{
    const canvas=ref.current; if(!canvas)return;
    const ctx=canvas.getContext('2d');
    const ex=EXERCISES[exercise];
    const loop=()=>{ex?.fn(ctx,(fr.current%180)/180,color);fr.current++;raf.current=requestAnimationFrame(loop);};
    fr.current=0; raf.current=requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(raf.current);
  },[exercise,color]);
  return React.createElement('canvas',{ref,width:140,height:180,style:{display:'block',borderRadius:'3px'}});
}

const MC={quad:'#FF6B35',hamstring:'#9B5DE5',glute:'#FF3366',calf:'#00B4FF',core:'#FFD60A',lats:'#00FF87',pec:'#FF6B35',delt:'#00FFFF',bicep:'#FF9F1C',tricep:'#C77DFF',forearm:'#4CC9F0',trap:'#06D6A0',spine:'#AAAAAA',bone:'#DDDDDD'};

function MuscleLegend({exercise}){
  const ex=EXERCISES[exercise];
  if(!ex?.muscles?.length) return null;
  return React.createElement('div',{style:{display:'flex',flexWrap:'wrap',gap:'6px',marginTop:'14px'}},
    ex.muscles.map(m=>React.createElement('div',{key:m,style:{display:'flex',alignItems:'center',gap:'5px',background:'#111',border:`1px solid ${MC[m]}44`,padding:'3px 8px',borderRadius:'2px'}},
      React.createElement('div',{style:{width:'8px',height:'8px',borderRadius:'50%',background:MC[m],flexShrink:0}}),
      React.createElement('span',{style:{fontFamily:'monospace',fontSize:'8px',color:MC[m],letterSpacing:'1px',textTransform:'uppercase'}},m)
    ))
  );
}

function HowToSection({exercise, color}){
  const ex = EXERCISES[exercise];
  if(!ex?.howTo?.length) return null;
  return React.createElement('div', {style:{marginTop:'14px'}},
    React.createElement('div', {style:{fontFamily:'monospace',fontSize:'9px',color:'#444',letterSpacing:'2px',marginBottom:'10px'}}, 'HOW TO DO IT'),
    ...ex.howTo.map((item, i) =>
      React.createElement('div', {key:i, style:{display:'flex',gap:'12px',padding:'9px 0',borderBottom: i < ex.howTo.length-1 ? '1px solid #161616' : 'none'}},
        React.createElement('div', {style:{
          minWidth:'22px',height:'22px',borderRadius:'50%',
          background: `${color}22`,
          border:`1px solid ${color}55`,
          display:'flex',alignItems:'center',justifyContent:'center',
          fontFamily:'monospace',fontSize:'9px',fontWeight:'bold',
          color:color, flexShrink:0, marginTop:'1px'
        }}, i+1),
        React.createElement('div', {},
          React.createElement('div', {style:{fontSize:'11px',fontWeight:'bold',color:'#ddd',marginBottom:'3px',fontFamily:'monospace',letterSpacing:'0.5px'}}, item.step),
          React.createElement('div', {style:{fontSize:'12px',color:'#888',lineHeight:1.65}}, item.desc)
        )
      )
    )
  );
}

function Modal({item,color,onClose}){
  const [activeTab, setActiveTab] = useState('demo');
  return React.createElement('div',{onClick:onClose,style:{position:'fixed',inset:0,background:'#000000e8',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}},
    React.createElement('div',{onClick:e=>e.stopPropagation(),style:{background:'#0e0e0e',border:`2px solid ${color}`,maxWidth:'390px',width:'100%',padding:'28px 24px',position:'relative',borderRadius:'3px',maxHeight:'90vh',overflowY:'auto'}},
      React.createElement('button',{onClick:onClose,style:{position:'absolute',top:'14px',right:'18px',background:'none',border:'none',color:'#555',fontSize:'20px',cursor:'pointer'}},'✕'),
      React.createElement('div',{style:{fontFamily:'monospace',fontSize:'9px',color,letterSpacing:'3px',marginBottom:'6px'}},'EXERCISE GUIDE'),
      React.createElement('div',{style:{fontSize:'20px',fontWeight:'bold',marginBottom:'2px'}},item.name),
      React.createElement('div',{style:{fontFamily:'monospace',fontSize:'11px',color:'#444',marginBottom:'16px'}},item.sets),

      // Tab switcher
      React.createElement('div',{style:{display:'flex',gap:'2px',marginBottom:'16px',background:'#111',padding:'3px',borderRadius:'3px'}},
        ['demo','how to'].map(tab =>
          React.createElement('button',{
            key:tab,
            onClick:()=>setActiveTab(tab),
            style:{
              flex:1, padding:'7px', background: activeTab===tab ? color+'22' : 'transparent',
              border: activeTab===tab ? `1px solid ${color}55` : '1px solid transparent',
              color: activeTab===tab ? color : '#555',
              fontFamily:'monospace', fontSize:'9px', fontWeight:'900',
              letterSpacing:'2px', textTransform:'uppercase', cursor:'pointer', borderRadius:'2px'
            }
          }, tab === 'demo' ? '▶ DEMO' : '📋 HOW TO')
        )
      ),

      activeTab === 'demo' && React.createElement('div', {},
        React.createElement('div',{style:{display:'flex',justifyContent:'center',background:'#080808',border:'1px solid #181818',padding:'18px 28px',marginBottom:'16px',borderRadius:'3px'}},
          React.createElement(AnimCanvas,{exercise:item.name,color})
        ),
        React.createElement(MuscleLegend,{exercise:item.name}),
        React.createElement('div',{style:{background:'#0a0a0a',border:'1px solid #1a1a1a',borderLeft:`3px solid ${color}`,padding:'16px',marginTop:'14px'}},
          React.createElement('div',{style:{fontFamily:'monospace',fontSize:'9px',color:'#444',letterSpacing:'2px',marginBottom:'8px'}},'COACHING CUE'),
          React.createElement('div',{style:{fontSize:'13px',color:'#bbb',lineHeight:1.75}},item.note)
        )
      ),

      activeTab === 'how to' && React.createElement('div', {},
        React.createElement(HowToSection, {exercise: item.name, color}),
        React.createElement(MuscleLegend,{exercise:item.name}),
        React.createElement('div',{style:{background:'#0a0a0a',border:'1px solid #1a1a1a',borderLeft:`3px solid ${color}`,padding:'16px',marginTop:'14px'}},
          React.createElement('div',{style:{fontFamily:'monospace',fontSize:'9px',color:'#444',letterSpacing:'2px',marginBottom:'8px'}},'COACHING CUE'),
          React.createElement('div',{style:{fontSize:'13px',color:'#bbb',lineHeight:1.75}},item.note)
        )
      )
    )
  );
}

function JumpInfo(){
  const [phase,setPhase]=useState(0);
  const phases=[
    {label:'APPROACH',icon:'🏃',color:'#FFD60A',title:'4-Step Attack Approach',desc:'The approach generates the horizontal momentum that becomes vertical lift.',muscles:['quad','glute','calf'],cues:['Angle your approach at 45° to the net','Accelerate through your last two steps','Your last step is your longest','Plant your right foot slightly in front','Keep eyes on the ball the entire approach'],physics:'Horizontal velocity converts to vertical force at takeoff. A proper approach can add 4–8" to your standing reach.'},
    {label:'PLANT',icon:'⚡',color:'#FF6B35',title:'Two-Foot Plant & Load',desc:'The penultimate step is the power step. Your body lowers and loads the posterior chain.',muscles:['hamstring','glute','quad'],cues:['Heel-to-toe contact on penultimate step','Hips drop 4–6 inches during plant','Arms swing back behind your hips','Knees track over toes','Body leans slightly forward'],physics:'Ground reaction force during plant can exceed 4x bodyweight.'},
    {label:'TAKEOFF',icon:'🚀',color:'#00FF87',title:'Triple Extension & Arm Drive',desc:'Simultaneous extension of ankle, knee, and hip transfers all stored energy upward.',muscles:['calf','quad','glute'],cues:['Push through the floor','Arm swing adds 2–4"','Reach for maximum height','Explode from heels through toes','Eyes up — contact point is above the net'],physics:'Research shows arms contribute 10–15% of total jump height.'},
    {label:'AIRTIME',icon:'✋',color:'#00B4FF',title:'Peak Reach & Contact',desc:'At peak height, your arm is fully extended. Timing your swing for contact at the apex is everything.',muscles:['delt','bicep','core'],cues:['Contact the ball at the highest point','Snap your wrist for topspin','Non-hitting arm stabilizes rotation','Eyes open through contact','Shoulder stays high until after contact'],physics:'Every inch of additional reach equals roughly 2–3% more court coverage.'},
    {label:'LANDING',icon:'🛬',color:'#9B5DE5',title:'Two-Foot Controlled Landing',desc:'Injury prevention begins here. Hard landings transfer 8–10x bodyweight to your joints.',muscles:['quad','calf','hamstring'],cues:['Land on both feet simultaneously','Absorb with 3 joints: ankle, knee, hip','Knees track over toes','Land in athletic position','Never land with locked knees'],physics:'Athletes who land poorly lose 30–40% of explosive ability to injury.'},
  ];
  const ph=phases[phase];
  const M=s=>({fontFamily:'monospace',...s});
  return React.createElement('div',{style:{padding:'20px'}},
    React.createElement('div',{style:M({fontSize:'10px',letterSpacing:'4px',color:'#444',marginBottom:'16px'})},'JUMP MECHANICS BREAKDOWN'),
    React.createElement('div',{style:{display:'flex',gap:'4px',marginBottom:'20px',flexWrap:'wrap'}},
      phases.map((ph2,i)=>React.createElement('button',{key:i,onClick:()=>setPhase(i),style:{background:phase===i?ph2.color+'22':'#111',border:`1px solid ${phase===i?ph2.color:ph2.color+'33'}`,color:phase===i?ph2.color:ph2.color+'66',padding:'6px 12px',cursor:'pointer',fontFamily:'monospace',fontSize:'9px',letterSpacing:'1px',fontWeight:'900',borderRadius:'2px'}},ph2.icon+' '+ph2.label))
    ),
    React.createElement('div',{style:{background:'#111',border:`1px solid ${ph.color}33`,borderLeft:`3px solid ${ph.color}`,padding:'20px',marginBottom:'16px'}},
      React.createElement('div',{style:{fontSize:'18px',fontWeight:'bold',marginBottom:'6px'}},ph.title),
      React.createElement('div',{style:{fontSize:'13px',color:'#888',lineHeight:1.7,marginBottom:'16px'}},ph.desc),
      React.createElement('div',{style:{display:'flex',flexWrap:'wrap',gap:'5px',marginBottom:'16px'}},
        ph.muscles.map(m=>React.createElement('div',{key:m,style:{display:'flex',alignItems:'center',gap:'5px',background:'#0a0a0a',border:`1px solid ${MC[m]}44`,padding:'3px 8px',borderRadius:'2px'}},
          React.createElement('div',{style:{width:'7px',height:'7px',borderRadius:'50%',background:MC[m]}}),
          React.createElement('span',{style:{fontFamily:'monospace',fontSize:'8px',color:MC[m],letterSpacing:'1px',textTransform:'uppercase'}},m)
        ))
      ),
      React.createElement('div',{style:M({fontSize:'9px',color:'#444',letterSpacing:'2px',marginBottom:'10px'})},'COACHING CUES'),
      ...ph.cues.map((cue,i)=>React.createElement('div',{key:i,style:{display:'flex',gap:'10px',padding:'7px 0',borderBottom:i<ph.cues.length-1?'1px solid #161616':'none',fontSize:'12px',color:'#bbb',lineHeight:1.6}},
        React.createElement('span',{style:{color:ph.color,fontFamily:'monospace',fontSize:'10px',marginTop:'1px',flexShrink:0}},'→'),cue))
    ),
    React.createElement('div',{style:{background:ph.color+'0d',border:`1px solid ${ph.color}22`,padding:'14px 16px',borderRadius:'2px'}},
      React.createElement('div',{style:M({fontSize:'9px',color:ph.color,letterSpacing:'3px',marginBottom:'8px'})},'THE PHYSICS'),
      React.createElement('div',{style:{fontSize:'12px',color:'#aaa',lineHeight:1.7}},ph.physics)
    ),
    React.createElement('div',{style:{marginTop:'20px',background:'#0f0f0f',border:'1px solid #1e1e1e',padding:'16px'}},
      React.createElement('div',{style:M({fontSize:'9px',color:'#444',letterSpacing:'3px',marginBottom:'12px'})},'MUSCLE COLOR KEY'),
      React.createElement('div',{style:{display:'flex',flexWrap:'wrap',gap:'8px'}},
        Object.entries(MC).filter(([k])=>!['spine','bone'].includes(k)).map(([k,v])=>
          React.createElement('div',{key:k,style:{display:'flex',alignItems:'center',gap:'5px'}},
            React.createElement('div',{style:{width:'10px',height:'10px',borderRadius:'2px',background:v,flexShrink:0}}),
            React.createElement('span',{style:{fontFamily:'monospace',fontSize:'8px',color:'#666',textTransform:'uppercase'}},k)
          )
        )
      )
    )
  );
}

const days=[
  {day:'MON',full:'Monday',type:'STRENGTH + POWER',intensity:'HIGH',accentColor:'#00FF87',sections:[
    {label:'PRE-PRACTICE · 20 min',items:[
      {name:'Depth Jumps',sets:'3x4',note:'Max effort — do these FIRST, completely fresh',priority:true},
      {name:'Spike Approach',sets:'4x3',note:'Full 4-step approach — drive through both arms on takeoff',priority:true},
      {name:'Arm Swing Drills',sets:'5 min',note:'Aggressive arm load — syncs with your jump for free inches',priority:false},
    ]},
    {label:'POST-PRACTICE · 35 min',items:[
      {name:'Back Squat',sets:'4x5',note:'Heavy — 80% 1RM. Foundation of your vertical',priority:true},
      {name:'Romanian Deadlift',sets:'3x6',note:'Slow eccentric — builds posterior chain for explosive jumps',priority:false},
      {name:'Overhead Press',sets:'3x8',note:'Develops shoulder strength for powerful spikes and serves',priority:false},
      {name:'Calf Raises (weighted)',sets:'3x15',note:'Full ROM — calves contribute to every jump',priority:false},
    ]},
  ]},
  {day:'TUE',full:'Tuesday',type:'SKILL + CONDITIONING',intensity:'MEDIUM',accentColor:'#FFD60A',sections:[
    {label:'TRAINING · 35 min',items:[
      {name:'Spike Approach',sets:'3x5',note:'Focus on hitting zone — approach angle and arm swing timing',priority:true},
      {name:'Blocking Jumps',sets:'3x6',note:'Explode straight up, hands penetrate over the net',priority:true},
      {name:'Lateral Shuffle',sets:'4x10m',note:'Stay low — volleyball defense is built on lateral quickness',priority:false},
      {name:'Hip Flexor Stretch',sets:'2x45s/side',note:'Tight hips kill jump height and spike power',priority:false},
      {name:'Rotator Cuff Band',sets:'3x15',note:'Prehab for shoulders — every set now prevents months off later',priority:false},
    ]},
  ]},
  {day:'WED',full:'Wednesday',type:'POWER + STRENGTH',intensity:'HIGH',accentColor:'#00FF87',sections:[
    {label:'PRE-PRACTICE · 15 min',items:[
      {name:'Box Jumps',sets:'4x4',note:'Land soft, step down — reset fully between reps',priority:true},
      {name:'Broad Jumps',sets:'3x4',note:'Max distance, explosive intent off the ground',priority:true},
    ]},
    {label:'POST-PRACTICE · 35 min',items:[
      {name:'Trap Bar Deadlift',sets:'4x4',note:'Explosive off the floor — most sport-specific lift for jumpers',priority:true},
      {name:'Bulgarian Split Squat',sets:'3x8/leg',note:'Fixes leg imbalances — critical for consistent approach jumps',priority:false},
      {name:'Nordic Curls',sets:'3x5',note:'Bulletproofs hamstrings against spike landing injuries',priority:false},
      {name:'Pallof Press',sets:'3x12/side',note:'Rotational core stability — generates more power through the ball',priority:false},
    ]},
  ]},
  {day:'THU',full:'Thursday',type:'RECOVERY + MOBILITY',intensity:'LOW',accentColor:'#00B4FF',sections:[
    {label:'RECOVERY · 35 min',items:[
      {name:'Arm Swing Drills',sets:'3x10',note:'Groove the pattern while fresh — adds 2–3" on its own',priority:true},
      {name:'Lateral Band Walk',sets:'3x12/side',note:'Activates glutes for lateral defense and jump stability',priority:false},
      {name:'Hip Flexor Stretch',sets:'2x60s/side',note:'Full hold — recovery day is the best time to gain flexibility',priority:false},
      {name:'Dead Bug',sets:'3x8/side',note:'Deep core control — keeps your body tight in the air',priority:false},
      {name:'Rotator Cuff Band',sets:'2x20',note:'Low resistance shoulder health maintenance',priority:false},
    ]},
  ]},
  {day:'FRI',full:'Friday',type:'EXPLOSIVE + SKILL',intensity:'HIGH',accentColor:'#00FF87',sections:[
    {label:'PRE-PRACTICE · 20 min',items:[
      {name:'Depth Jumps',sets:'3x4',note:'From 12" box — minimal ground contact time',priority:true},
      {name:'Single-Leg Hops',sets:'3x6/leg',note:'Unilateral explosiveness — mirrors real approach mechanics',priority:true},
      {name:'Blocking Jumps',sets:'3x5',note:'Practice net penetration and timing on every rep',priority:false},
    ]},
    {label:'POST-PRACTICE · 25 min',items:[
      {name:'Jump Squats (light)',sets:'4x5',note:'25% bodyweight — max intent, velocity over load',priority:true},
      {name:'Step-Ups (explosive)',sets:'3x6/leg',note:'Drive through heel, full hip extension at top',priority:false},
      {name:'Plank',sets:'3x45s',note:'Lock in the core — transfers force from legs to spike arm',priority:false},
      {name:'Wrist Curls',sets:'3x15',note:'Forearm strength for snap at ball contact',priority:false},
    ]},
  ]},
  {day:'SAT',full:'Saturday',type:'TEST DAY',intensity:'MEDIUM',accentColor:'#FF6B35',sections:[
    {label:'TESTING · 30 min',items:[
      {name:'Vert Test',sets:'3 attempts',note:'Track progress — measure every Saturday morning',priority:true},
      {name:'Spike Approach',sets:'5 reps',note:'Max effort swings — apply the full week of training',priority:true},
      {name:'Max Vertical Jumps',sets:'3 reps',note:'Standing vert for comparison alongside approach jump',priority:false},
      {name:'Hip Flexor Stretch',sets:'15 min',note:'Full body cooldown — you earned it',priority:false},
    ]},
  ]},
  {day:'SUN',full:'Sunday',type:'FULL REST',intensity:'REST',accentColor:'#9B5DE5',sections:[
    {label:'RECOVERY PROTOCOL',items:[
      {name:'Dead Bug',sets:'Optional',note:'Gentle movement only — no load',priority:false},
      {name:'Hip Flexor Stretch',sets:'10 min',note:'Light stretching to keep blood moving',priority:false},
      {name:'Plank',sets:'1x30s',note:'Single set max — just to stay connected',priority:false},
    ]},
  ]},
];

const mlColors=['#00FF87','#FFD60A','#FF6B35','#9B5DE5'];
const milestones=[{weeks:'1–3',target:'22–23"',focus:'Technique + neural adaptation'},{weeks:'4–6',target:'24–26"',focus:'Strength gains translating'},{weeks:'7–9',target:'26–28"',focus:'Plyometric power peaks'},{weeks:'10–12',target:'28–30"+',focus:'Full system integration'}];
const rules=[
  {icon:'⚡',rule:'Plyo BEFORE practice, lifts AFTER',why:'You need full CNS freshness for max-effort jumps',color:'#00FF87'},
  {icon:'🚫',rule:'Never lift heavy the day before a game',why:'Fatigue destroys explosiveness — time it right',color:'#FF4444'},
  {icon:'😴',rule:'Sunday is sacred',why:'Elite athletes improve on rest days, not training days',color:'#9B5DE5'},
  {icon:'📏',rule:'Measure every Saturday morning',why:'Track gains or adjust program accordingly',color:'#FFD60A'},
  {icon:'🏐',rule:'Skill work counts as training volume',why:'Spike reps and blocking drills are CNS load',color:'#FF6B35'},
  {icon:'💪',rule:'Protect your shoulders every week',why:'Rotator cuff work is non-optional for spikers',color:'#00B4FF'},
];

export default function VertPro(){
  const [activeDay,setActiveDay]=useState(0);
  const [tab,setTab]=useState('schedule');
  const [checked,setChecked]=useState({});
  const [modal,setModal]=useState(null);
  const cur=days[activeDay];
  const toggle=k=>setChecked(p=>({...p,[k]:!p[k]}));
  const allItems=cur.sections.flatMap((s,si)=>s.items.map((item,ii)=>({item,key:`${activeDay}-${si}-${ii}`})));
  const done=allItems.filter(({key})=>checked[key]).length;
  const pct=allItems.length>0?Math.round(done/allItems.length*100):0;
  const badge={HIGH:{bg:'#00FF8718',color:'#00FF87',label:'HIGH LOAD'},MEDIUM:{bg:'#FFD60A18',color:'#FFD60A',label:'MODERATE'},LOW:{bg:'#00B4FF18',color:'#00B4FF',label:'RECOVERY'},REST:{bg:'#9B5DE518',color:'#9B5DE5',label:'FULL REST'}}[cur.intensity];
  const M=s=>({fontFamily:'monospace',...s});

  return (
    <div style={{minHeight:'100vh',background:'#080808',color:'#eee',fontFamily:'Georgia,serif',maxWidth:'680px',margin:'0 auto'}}>
      {modal&&<Modal item={modal} color={cur.accentColor} onClose={()=>setModal(null)}/>}
      <div style={{background:'#0f0f0f',padding:'28px 24px 0',borderBottom:`3px solid ${cur.accentColor}`}}>
        <div style={M({fontSize:'10px',letterSpacing:'4px',color:'#444',marginBottom:'6px'})}>VOLLEYBALL ATHLETE PROGRAM · WEEKLY SCHEDULE</div>
        <div style={{fontSize:'26px',fontWeight:'bold',lineHeight:1.1,marginBottom:'20px'}}>
          20″ → <span style={{color:cur.accentColor,fontStyle:'italic'}}>30″+ VERT</span>
          <div style={M({fontSize:'11px',color:'#555',fontStyle:'normal',marginTop:'4px',letterSpacing:'2px'})}>VOLLEYBALL-SPECIFIC TRAINING SYSTEM</div>
        </div>
        <div style={{display:'flex',overflowX:'auto',scrollbarWidth:'none'}}>
          {['schedule','jump info','milestones','rules'].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:'10px 16px',background:tab===t?cur.accentColor:'transparent',color:tab===t?'#000':'#555',border:'none',cursor:'pointer',fontSize:'10px',fontFamily:'monospace',fontWeight:'900',letterSpacing:'2px',textTransform:'uppercase',whiteSpace:'nowrap'}}>{t}</button>
          ))}
        </div>
      </div>

      {tab==='jump info'&&<JumpInfo/>}

      {tab==='schedule'&&<>
        <div style={{display:'flex',overflowX:'auto',background:'#0c0c0c',borderBottom:'1px solid #1a1a1a',scrollbarWidth:'none'}}>
          {days.map((d,i)=>(
            <button key={i} onClick={()=>setActiveDay(i)} style={{flex:'0 0 auto',padding:'14px 16px',background:activeDay===i?'#1a1a1a':'transparent',borderTop:'none',borderLeft:'none',borderRight:'none',borderBottom:activeDay===i?`2px solid ${d.accentColor}`:'2px solid transparent',color:activeDay===i?d.accentColor:'#444',cursor:'pointer',fontFamily:'monospace',fontSize:'10px',fontWeight:'900',letterSpacing:'1px',minWidth:'64px',textAlign:'center'}}>
              <div>{d.day}</div>
              <div style={{fontSize:'8px',marginTop:'3px',opacity:.7}}>{d.intensity==='REST'?'REST':d.intensity==='LOW'?'EASY':d.intensity==='HIGH'?'HARD':'MED'}</div>
            </button>
          ))}
        </div>
        {cur.intensity!=='REST'&&(
          <div style={{padding:'14px 20px 0',background:'#0c0c0c'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
              <span style={M({fontSize:'9px',color:'#444',letterSpacing:'2px'})}>TODAY'S PROGRESS</span>
              <span style={M({fontSize:'9px',color:cur.accentColor})}>{done}/{allItems.length} DONE</span>
            </div>
            <div style={{height:'3px',background:'#1a1a1a',borderRadius:'2px'}}>
              <div style={{height:'100%',width:`${pct}%`,background:cur.accentColor,borderRadius:'2px',transition:'width .4s'}}/>
            </div>
          </div>
        )}
        <div style={{padding:'20px 20px 40px'}}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'24px'}}>
            <div>
              <div style={{fontSize:'22px',fontWeight:'bold'}}>{cur.full}</div>
              <div style={M({fontSize:'11px',color:'#555',letterSpacing:'2px',marginTop:'4px'})}>{cur.type}</div>
            </div>
            <div style={{background:badge.bg,color:badge.color,fontFamily:'monospace',fontSize:'9px',fontWeight:'900',letterSpacing:'2px',padding:'5px 10px',border:`1px solid ${badge.color}44`}}>{badge.label}</div>
          </div>
          {cur.sections.map((sec,si)=>(
            <div key={si} style={{marginBottom:'28px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'10px'}}>
                <div style={M({fontSize:'9px',letterSpacing:'3px',color:cur.accentColor,fontWeight:'900'})}>{sec.label}</div>
                <div style={{flex:1,height:'1px',background:'#1e1e1e'}}/>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'2px'}}>
                {sec.items.map((item,ii)=>{
                  const key=`${activeDay}-${si}-${ii}`,dn=!!checked[key];
                  return(
                    <div key={ii} style={{background:dn?'#0d1a12':item.priority?'#141414':'#0f0f0f',borderLeft:`3px solid ${dn?cur.accentColor:item.priority?cur.accentColor:'#222'}`,padding:'14px 16px',display:'flex',alignItems:'center',gap:'12px',opacity:dn?.5:1,transition:'all .2s'}}>
                      <div onClick={()=>toggle(key)} style={{width:'16px',height:'16px',borderRadius:'3px',flexShrink:0,border:`2px solid ${dn?cur.accentColor:'#333'}`,background:dn?cur.accentColor:'transparent',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                        {dn&&<span style={{color:'#000',fontSize:'10px',fontWeight:'bold'}}>✓</span>}
                      </div>
                      <div style={{flex:1,cursor:'pointer'}} onClick={()=>toggle(key)}>
                        <div style={{fontSize:'14px',fontWeight:item.priority?'bold':'normal',color:dn?'#555':item.priority?'#fff':'#aaa',textDecoration:dn?'line-through':'none'}}>
                          {item.name}{item.priority&&!dn&&<span style={{color:cur.accentColor,marginLeft:'6px',fontSize:'10px',fontFamily:'monospace'}}>★</span>}
                        </div>
                        <div style={M({fontSize:'11px',color:'#555',marginTop:'3px'})}>{item.note}</div>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'6px',minWidth:'80px'}}>
                        <div style={M({fontSize:'12px',fontWeight:'bold',color:dn?'#333':item.priority?cur.accentColor:'#444',whiteSpace:'nowrap'})}>{item.sets}</div>
                        <button onClick={()=>setModal(item)} style={{background:'transparent',border:`1px solid ${cur.accentColor}44`,color:cur.accentColor,fontFamily:'monospace',fontSize:'8px',letterSpacing:'1px',padding:'3px 7px',cursor:'pointer',whiteSpace:'nowrap'}}>▶ DEMO</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </>}

      {tab==='milestones'&&(
        <div style={{padding:'24px 20px'}}>
          <div style={M({fontSize:'10px',letterSpacing:'4px',color:'#444',marginBottom:'20px'})}>12-WEEK ROADMAP TO 30″+</div>
          {milestones.map((m,i)=>(
            <div key={i} style={{display:'flex',gap:'20px',alignItems:'stretch',marginBottom:'4px'}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',minWidth:'20px'}}>
                <div style={{width:'10px',height:'10px',borderRadius:'50%',background:mlColors[i],marginTop:'18px'}}/>
                {i<3&&<div style={{width:'1px',flex:1,background:'#222',marginTop:'4px'}}/>}
              </div>
              <div style={{flex:1,background:'#111',border:'1px solid #1e1e1e',padding:'16px 18px',marginBottom:'4px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={M({fontSize:'10px',color:'#555',letterSpacing:'2px'})}>WEEKS {m.weeks}</div>
                  <div style={{fontSize:'22px',fontWeight:'bold',color:mlColors[i],fontStyle:'italic'}}>{m.target}</div>
                </div>
                <div style={{fontSize:'13px',color:'#777',marginTop:'6px'}}>{m.focus}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==='rules'&&(
        <div style={{padding:'24px 20px'}}>
          <div style={M({fontSize:'10px',letterSpacing:'4px',color:'#444',marginBottom:'20px'})}>NON-NEGOTIABLE RULES</div>
          {rules.map((r,i)=>(
            <div key={i} style={{background:'#111',border:'1px solid #1e1e1e',borderLeft:`3px solid ${r.color}`,padding:'18px',marginBottom:'4px'}}>
              <div style={{fontSize:'20px',marginBottom:'8px'}}>{r.icon}</div>
              <div style={{fontSize:'15px',fontWeight:'bold',marginBottom:'6px'}}>{r.rule}</div>
              <div style={M({fontSize:'12px',color:'#666'})}>{r.why}</div>
            </div>
          ))}
          <div style={{marginTop:'20px',background:'#00FF8710',border:'1px solid #00FF8730',padding:'18px'}}>
            <div style={M({fontSize:'9px',color:'#00FF87',letterSpacing:'3px',marginBottom:'10px'})}>THE HONEST TRUTH</div>
            <div style={{fontSize:'13px',color:'#aaa',lineHeight:1.7}}>Going from 20″ to 30″+ is achievable — but volleyball demands more than just a big vert. The athletes who dominate combine <em>explosiveness</em> with lateral quickness, shoulder durability, and core transfer. Train the whole system.</div>
          </div>
        </div>
      )}
    </div>
  );
}
