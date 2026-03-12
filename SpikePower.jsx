const { useState, useEffect, useRef } = React;

// ── Math helpers ──────────────────────────────────────────────────
const lerp = (a,b,t) => a+(b-a)*t;
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
const sat = v => clamp(v,0,1);
const easeOut = t => 1-Math.pow(1-t,3);
const easeOut4 = t => 1-Math.pow(1-t,4);
const easeIn2 = t => t*t;
const smoothstep = t => t*t*(3-2*t);
const smootherstep = t => t*t*t*(t*(t*6-15)+10);

// ── Color palette ─────────────────────────────────────────────────
const C = {
  bg: '#07080a',
  surface: '#0d0f12',
  border: '#1a1d22',
  accent: '#FF4D00',
  accentGlow: '#FF4D0033',
  gold: '#FFB800',
  blue: '#00C8FF',
  green: '#00FF87',
  text: '#e8e4de',
  muted: '#4a4a55',
  dim: '#1e2028',
};

// ── Canvas drawing helpers ─────────────────────────────────────────
const SKIN='#c8956c', SKIN_D='#a06b40', SKIN_S='#e8b48a';
const SHIRT='#1a1a2e', SHIRT_D='#0d0d1a', SHIRT_H='#2a2a4e';
const SHORTS='#0f1218', SHOE='#e8e0d0', SHOE_D='#c8b89a', HAIR='#1a0a00';

function drawAthlete(ctx, p) {
  const c = ctx;
  c.save(); c.lineCap='round'; c.lineJoin='round';

  const seg=(x1,y1,x2,y2,w,col,scol)=>{
    const a=Math.atan2(y2-y1,x2-x1), p2=a+Math.PI/2, w1=w, w2=w*.65;
    c.beginPath();
    c.moveTo(x1+Math.cos(p2)*w1,y1+Math.sin(p2)*w1);
    c.quadraticCurveTo((x1+x2)/2+Math.cos(p2)*((w1+w2)/2)*1.1,(y1+y2)/2+Math.sin(p2)*((w1+w2)/2)*1.1,x2+Math.cos(p2)*w2,y2+Math.sin(p2)*w2);
    c.lineTo(x2-Math.cos(p2)*w2,y2-Math.sin(p2)*w2);
    c.quadraticCurveTo((x1+x2)/2-Math.cos(p2)*((w1+w2)/2)*1.1,(y1+y2)/2-Math.sin(p2)*((w1+w2)/2)*1.1,x1-Math.cos(p2)*w1,y1-Math.sin(p2)*w1);
    c.closePath(); c.fillStyle=col; c.fill();
    if(scol){c.strokeStyle=scol;c.lineWidth=.6;c.stroke();}
  };
  const oval=(cx,cy,rx,ry,a,col,scol,sw=.6)=>{
    c.beginPath();c.ellipse(cx,cy,rx,ry,a,0,Math.PI*2);
    c.fillStyle=col;c.fill();
    if(scol){c.strokeStyle=scol;c.lineWidth=sw;c.stroke();}
  };

  const {sho,hips,neck,head,eL,eR,hL,hR,kL,kR,fL,fR}=p;
  const td=Math.atan2(hips.y-sho.y,hips.x-sho.x), tp=td+Math.PI/2;
  const tW=11, hW=9;

  // torso
  c.beginPath();
  c.moveTo(sho.x+Math.cos(tp)*tW,sho.y+Math.sin(tp)*tW);
  c.bezierCurveTo(sho.x+Math.cos(tp)*tW+Math.cos(td)*7,sho.y+Math.sin(tp)*tW+Math.sin(td)*7,hips.x+Math.cos(tp)*hW+Math.cos(td)*(-3),hips.y+Math.sin(tp)*hW+Math.sin(td)*(-3),hips.x+Math.cos(tp)*hW,hips.y+Math.sin(tp)*hW);
  c.lineTo(hips.x-Math.cos(tp)*hW,hips.y-Math.sin(tp)*hW);
  c.bezierCurveTo(hips.x-Math.cos(tp)*hW+Math.cos(td)*(-3),hips.y-Math.sin(tp)*hW+Math.sin(td)*(-3),sho.x-Math.cos(tp)*tW+Math.cos(td)*7,sho.y-Math.sin(tp)*tW+Math.sin(td)*7,sho.x-Math.cos(tp)*tW,sho.y-Math.sin(tp)*tW);
  c.closePath(); c.fillStyle=SHIRT; c.fill(); c.strokeStyle=SHIRT_D; c.lineWidth=.7; c.stroke();

  // neck, legs, arms
  oval(lerp(neck.x,head.x,.3),lerp(neck.y,head.y,.3),4,6,Math.atan2(head.y-neck.y,head.x-neck.x),SKIN,SKIN_D);
  seg(hips.x-4,hips.y,kL.x,kL.y,7,SHORTS,SKIN_D);
  seg(hips.x+4,hips.y,kR.x,kR.y,7,SHORTS,SKIN_D);
  seg(kL.x,kL.y,fL.x,fL.y-3,5,SKIN,SKIN_D);
  seg(kR.x,kR.y,fR.x,fR.y-3,5,SKIN,SKIN_D);
  oval(kL.x,kL.y,4.5,4,Math.atan2(kL.y-hips.y,kL.x-hips.x),SKIN_S,SKIN_D,.5);
  oval(kR.x,kR.y,4.5,4,Math.atan2(kR.y-hips.y,kR.x-hips.x),SKIN_S,SKIN_D,.5);

  // shoes
  const shoe=(kx,ky,fx,fy)=>{
    const a=Math.atan2(fy-ky,fx-kx);
    c.beginPath();c.ellipse(fx+Math.cos(a)*4,fy+2,8,3,a*.3,0,Math.PI*2);c.fillStyle=SHOE_D;c.fill();
    c.beginPath();
    c.moveTo(fx-Math.cos(a+Math.PI/2)*3.5,fy-Math.sin(a+Math.PI/2)*3.5);
    c.lineTo(fx+Math.cos(a)*9,fy+Math.sin(a)*4.5-1);
    c.lineTo(fx+Math.cos(a)*9+Math.cos(a+Math.PI/2)*2.5,fy+Math.sin(a)*4.5+Math.sin(a+Math.PI/2)*2.5-1);
    c.lineTo(fx+Math.cos(a+Math.PI/2)*2.5,fy+Math.sin(a+Math.PI/2)*2.5);
    c.closePath();c.fillStyle=SHOE;c.fill();c.strokeStyle=SHOE_D;c.lineWidth=.6;c.stroke();
  };
  shoe(kL.x,kL.y,fL.x,fL.y); shoe(kR.x,kR.y,fR.x,fR.y);

  seg(sho.x-9,sho.y,eL.x,eL.y,5,SHIRT,SHIRT_D);
  seg(sho.x+9,sho.y,eR.x,eR.y,5,SHIRT,SHIRT_D);
  oval(sho.x-9,sho.y,6.5,5.5,Math.atan2(eL.y-sho.y,eL.x-sho.x),SHIRT_H,SHIRT_D,.6);
  oval(sho.x+9,sho.y,6.5,5.5,Math.atan2(eR.y-sho.y,eR.x-sho.x),SHIRT_H,SHIRT_D,.6);
  seg(eL.x,eL.y,hL.x,hL.y,3.5,SKIN,SKIN_D);
  seg(eR.x,eR.y,hR.x,hR.y,3.5,SKIN,SKIN_D);
  oval(eL.x,eL.y,3.5,3,Math.atan2(eL.y-sho.y,eL.x-sho.x),SKIN_S,SKIN_D,.5);
  oval(eR.x,eR.y,3.5,3,Math.atan2(eR.y-sho.y,eR.x-sho.x),SKIN_S,SKIN_D,.5);
  oval(hL.x,hL.y,3.5,2.5,Math.atan2(hL.y-eL.y,hL.x-eL.x),SKIN,SKIN_D,.5);
  oval(hR.x,hR.y,3.5,2.5,Math.atan2(hR.y-eR.y,hR.x-eR.x),SKIN,SKIN_D,.5);

  // head
  oval(head.x,head.y,9.5,10.5,0,SKIN,SKIN_D,.7);
  c.beginPath();c.ellipse(head.x,head.y-4.5,9.5,7.5,0,Math.PI,Math.PI*2);c.fillStyle=HAIR;c.fill();
  c.globalAlpha=.55;c.beginPath();c.ellipse(head.x+2,head.y-3.5,7.5,4.5,-.2,Math.PI,Math.PI*2);c.fillStyle=HAIR;c.fill();c.globalAlpha=1;
  oval(head.x+8.5,head.y+1,2.3,2.8,0,SKIN,SKIN_D,.4);
  oval(head.x+3.5,head.y+1,2.3,1.8,0,'#fff','#999',.3);
  c.beginPath();c.arc(head.x+4,head.y+1,1.2,0,Math.PI*2);c.fillStyle='#2a1a0a';c.fill();
  c.beginPath();c.moveTo(head.x+1.5,head.y-2);c.lineTo(head.x+6.5,head.y-2.5);c.strokeStyle=HAIR;c.lineWidth=.9;c.stroke();
  c.beginPath();c.moveTo(head.x+5.5,head.y+1);c.quadraticCurveTo(head.x+7.5,head.y+3,head.x+5.5,head.y+3.5);c.strokeStyle=SKIN_D;c.lineWidth=.7;c.stroke();
  c.beginPath();c.arc(head.x+4.5,head.y+5.5,1.8,-.1,Math.PI+.1);c.strokeStyle=SKIN_D;c.lineWidth=.6;c.stroke();

  c.globalAlpha=.07;c.fillStyle='#ccc';
  c.beginPath();c.ellipse((fL.x+fR.x)/2,Math.max(fL.y,fR.y)+4,15,3.5,0,0,Math.PI*2);c.fill();
  c.globalAlpha=1;
  c.restore();
}

const lerpP=(a,b,t)=>{const o={};for(const k in a)o[k]={x:lerp(a[k].x,b[k].x,t),y:lerp(a[k].y,b[k].y,t)};return o;};

function drawBall(ctx,x,y,r,glow,col='#ddd'){
  if(glow>0){
    const g=ctx.createRadialGradient(x,y,0,x,y,r*3);
    g.addColorStop(0,`rgba(255,180,0,${glow*.5})`);
    g.addColorStop(1,'transparent');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*3,0,Math.PI*2);ctx.fill();
  }
  ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#aaa';ctx.lineWidth=.7;ctx.stroke();
  ctx.strokeStyle='#888';ctx.lineWidth=.55;
  ctx.beginPath();ctx.moveTo(x-r,y);ctx.quadraticCurveTo(x,y-r*.45,x+r,y);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x-r*.45,y-r*.8);ctx.quadraticCurveTo(x+r*.55,y,x-r*.45,y+r*.8);ctx.stroke();
}

// ─── Spike phase canvases ──────────────────────────────────────────
const PHASES = [
  {
    id:'load',
    label:'WIND-UP',
    color:'#FFB800',
    tagline:'Load the spring',
    mechanic:'Elbow high, hand behind ear — like pulling a bow. Every inch of backswing = more speed forward.',
    powerTip:'Your hitting shoulder should drop back so your chest opens toward the setter. The bigger the rotation, the more power transfers.',
    mistakes:['Elbow drops below shoulder — kills rotation','Rushing the wind-up — no time to load','Arm stays in front of body — zero elastic energy'],
    draw:(ctx,t,col)=>{
      const W=160,H=200,gY=178,cx=80;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#08090b';ctx.fillRect(0,0,W,H);
      // power arc guide
      ctx.globalAlpha=.08+Math.sin(t*Math.PI*2)*.04;
      ctx.strokeStyle=col;ctx.lineWidth=12;ctx.lineCap='round';
      ctx.beginPath();ctx.arc(cx+6,gY-82,42,-2.4,-0.5);ctx.stroke();
      ctx.globalAlpha=1;
      const v=smoothstep(sat(Math.sin(t*Math.PI*2)*.5+.5));
      const load=lerp(0.2,1,v);
      const by=gY-62, sy=by-28, hy=by+18;
      const p={
        head:{x:cx-load*6,y:sy-24},neck:{x:cx-load*4,y:sy-8},
        sho:{x:cx,y:sy},hips:{x:cx,y:by},
        kL:{x:cx-9,y:gY-30},kR:{x:cx+9,y:gY-30},
        fL:{x:cx-11,y:gY},fR:{x:cx+11,y:gY},
        eL:{x:cx-22,y:sy+14},
        eR:{x:cx+14+load*8,y:sy-8-load*16},
        hL:{x:cx-18,y:sy+28},
        hR:{x:cx+10+load*12,y:sy-22-load*22},
      };
      // elbow angle indicator
      if(load>.5){
        ctx.globalAlpha=.35;ctx.strokeStyle=col;ctx.lineWidth=.8;ctx.setLineDash([2,3]);
        ctx.beginPath();ctx.moveTo(p.eR.x,p.eR.y);ctx.lineTo(p.eR.x+22,p.eR.y);ctx.stroke();
        ctx.beginPath();ctx.moveTo(p.eR.x,p.eR.y);ctx.lineTo(p.hR.x,p.hR.y);ctx.stroke();
        ctx.setLineDash([]);ctx.globalAlpha=1;
        ctx.fillStyle=col;ctx.font='bold 8px monospace';
        ctx.globalAlpha=load*.7;ctx.fillText('90°+',p.eR.x+14,p.eR.y-4);ctx.globalAlpha=1;
      }
      drawAthlete(ctx,p);
      // label: "ELBOW UP"
      ctx.globalAlpha=.55+Math.sin(t*Math.PI*2+1)*.2;
      ctx.fillStyle=col;ctx.font='bold 7px monospace';ctx.letterSpacing='1px';
      ctx.fillText('ELBOW HIGH',p.eR.x-10,p.eR.y-14);
      ctx.globalAlpha=1;
    }
  },
  {
    id:'shoulder',
    label:'SHOULDER ROTATION',
    color:'#FF4D00',
    tagline:'Rotate, don\'t arm-swing',
    mechanic:'The hitting arm is just the whip. Power starts at the hips, flows through the core, and explodes through the shoulder.',
    powerTip:'Think of throwing a baseball — hips rotate first, shoulders follow a split-second later. This sequential rotation is where elite hitters generate force.',
    mistakes:['Hips stay square to the net — upper-body only swing','Shoulders and hips rotate at the same time — no whip','Locked core — energy leaks before reaching the arm'],
    draw:(ctx,t,col)=>{
      const W=160,H=200,gY=178,cx=80;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#08090b';ctx.fillRect(0,0,W,H);
      const v=sat(Math.sin(t*Math.PI*2)*.5+.5);
      const rot=smoothstep(v);
      const by=gY-64,sy=by-26;
      // rotation arc
      ctx.globalAlpha=.12;ctx.strokeStyle=col;ctx.lineWidth=20;
      ctx.beginPath();ctx.arc(cx,by+4,18,-1.8+rot*.8,-1.8+rot*.8+.6);ctx.stroke();
      ctx.globalAlpha=.25;ctx.lineWidth=2;ctx.setLineDash([3,3]);
      ctx.beginPath();ctx.arc(cx,by+4,18,-2.4,.2);ctx.stroke();
      ctx.setLineDash([]);ctx.globalAlpha=1;
      const hipRot = rot*12, shoRot = rot*22;
      const p={
        head:{x:cx+shoRot*.4,y:sy-22},neck:{x:cx+shoRot*.25,y:sy-6},
        sho:{x:cx,y:sy},hips:{x:cx,y:by},
        kL:{x:cx-9,y:gY-28},kR:{x:cx+9,y:gY-28},
        fL:{x:cx-12,y:gY},fR:{x:cx+12,y:gY},
        eL:{x:cx-20-shoRot*.5,y:sy+18+shoRot*.3},
        eR:{x:cx+22+shoRot*.8,y:sy+4-shoRot*.5},
        hL:{x:cx-16-shoRot*.4,y:sy+32+shoRot*.2},
        hR:{x:cx+26+shoRot,y:sy-8-shoRot*.3},
      };
      // hip → shoulder arrow
      ctx.globalAlpha=.4;ctx.strokeStyle=col;ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(cx-hipRot,by+2);ctx.lineTo(cx+hipRot,by+2);ctx.stroke();
      ctx.globalAlpha=.3;ctx.strokeStyle='#00FF87';
      ctx.beginPath();ctx.moveTo(cx-shoRot,sy+2);ctx.lineTo(cx+shoRot,sy+2);ctx.stroke();
      ctx.globalAlpha=1;
      drawAthlete(ctx,p);
    }
  },
  {
    id:'contact',
    label:'CONTACT POINT',
    color:'#FF4D00',
    tagline:'Highest point, straight arm',
    mechanic:'Contact the ball at full arm extension, slightly in front of your hitting shoulder. Too close = no leverage. Too far = no control.',
    powerTip:'Your palm should hit the top-back of the ball. A flat, stiff palm transfers more force than a cupped hand. Make the sound LOUD.',
    mistakes:['Contacting the ball behind your head — power goes backward','Bent elbow at contact — arm acts as a shock absorber','Ball too far in front — you\'re pushing, not hitting'],
    draw:(ctx,t,col)=>{
      const W=160,H=200,gY=178,cx=72;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#08090b';ctx.fillRect(0,0,W,H);
      const v=sat(Math.sin(t*Math.PI*2)*.5+.5);
      const hit=smoothstep(v);
      const airY=gY-hit*88, by=airY-30, sy=by-26;
      // shadow
      ctx.globalAlpha=lerp(.15,.03,hit);ctx.fillStyle='#aaa';
      ctx.beginPath();ctx.ellipse(cx,gY+2,lerp(14,5,hit),3,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
      const bx=cx+28+hit*14, ballY=sy-20-hit*28;
      // impact flash
      if(hit>.75){
        const flash=(hit-.75)/.25;
        ctx.globalAlpha=flash*.55;
        const g=ctx.createRadialGradient(bx,ballY,0,bx,ballY,28);
        g.addColorStop(0,col+'ff');g.addColorStop(.5,col+'44');g.addColorStop(1,'transparent');
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(bx,ballY,28,0,Math.PI*2);ctx.fill();
        ctx.globalAlpha=1;
        // impact lines
        ctx.globalAlpha=flash*.6;ctx.strokeStyle=col;ctx.lineWidth=1.2;
        for(let i=0;i<6;i++){const a=i*Math.PI/3+hit*2;ctx.beginPath();ctx.moveTo(bx+Math.cos(a)*10,ballY+Math.sin(a)*10);ctx.lineTo(bx+Math.cos(a)*18,ballY+Math.sin(a)*18);ctx.stroke();}
        ctx.globalAlpha=1;
      }
      const p={
        head:{x:cx+8,y:sy-20},neck:{x:cx+6,y:sy-6},
        sho:{x:cx,y:sy},hips:{x:cx,y:by},
        kL:{x:cx-11,y:by+22},kR:{x:cx+11,y:by+20},
        fL:{x:cx-10,y:airY+lerp(20,0,hit)},fR:{x:cx+10,y:airY+lerp(22,2,hit)},
        eL:{x:cx-18,y:sy+16},
        eR:{x:bx-18,y:sy-10},
        hL:{x:cx-14,y:sy+30},
        hR:{x:bx,y:ballY},
      };
      drawBall(ctx,bx,ballY,9,hit>.75?(hit-.75)/.25*1.2:0);
      drawAthlete(ctx,p);
      // "CONTACT ZONE" label
      ctx.globalAlpha=.4;ctx.strokeStyle=col;ctx.lineWidth=.7;ctx.setLineDash([2,3]);
      ctx.beginPath();ctx.moveTo(cx+22,sy-30);ctx.lineTo(bx+12,sy-30);ctx.stroke();
      ctx.setLineDash([]);ctx.globalAlpha=1;
      ctx.fillStyle=col;ctx.font='7px monospace';ctx.globalAlpha=.55;
      ctx.fillText('CONTACT ZONE',cx+20,sy-34);ctx.globalAlpha=1;
    }
  },
  {
    id:'snap',
    label:'WRIST SNAP',
    color:'#00C8FF',
    tagline:'The topspin finisher',
    mechanic:'After palm contact, snap your wrist forward and down to put topspin on the ball. This makes it drop into the court instead of sailing out.',
    powerTip:'Think of snapping a towel — the wrist crack comes AFTER the arm swings through. The snap adds 5–15 mph of ball speed and curve.',
    mistakes:['No wrist action — flat ball floats out of bounds','Snapping too early — turns into a push shot','Stiff fingers — reduces snap velocity significantly'],
    draw:(ctx,t,col)=>{
      const W=160,H=200,gY=178,cx=72;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#08090b';ctx.fillRect(0,0,W,H);
      const v=sat(Math.sin(t*Math.PI*2)*.5+.5);
      const snap=smoothstep(v);
      const airY=gY-76, by=airY-30, sy=by-24;
      ctx.globalAlpha=.07;ctx.fillStyle='#aaa';
      ctx.beginPath();ctx.ellipse(cx,gY+2,8,2.5,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
      // ball trajectory arc (topspin)
      const bStartX=cx+40,bStartY=sy-30;
      const progress=snap;
      const bx=bStartX+progress*50, by2=bStartY+progress*progress*80;
      // draw trajectory guide
      ctx.globalAlpha=.2;ctx.strokeStyle=col;ctx.lineWidth=1;ctx.setLineDash([2,4]);
      ctx.beginPath();
      for(let i=0;i<=20;i++){const ti=i/20;ctx.lineTo(bStartX+ti*50,bStartY+ti*ti*80);}
      ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
      // spin indicator on ball
      if(snap>.15){
        ctx.globalAlpha=.4;ctx.strokeStyle=col;ctx.lineWidth=1.2;
        for(let i=0;i<3;i++){
          const a=-Math.PI*.4+i*.3+snap*8;
          ctx.beginPath();ctx.arc(bx-2,by2-2,5,a,a+.8);ctx.stroke();
        }
        ctx.globalAlpha=1;
      }
      drawBall(ctx,bx,by2,8,0);
      const wristSnap=snap*1.4;
      const p={
        head:{x:cx+8,y:sy-20},neck:{x:cx+5,y:sy-6},
        sho:{x:cx,y:sy},hips:{x:cx,y:by},
        kL:{x:cx-10,y:by+22},kR:{x:cx+10,y:by+20},
        fL:{x:cx-10,y:airY+18},fR:{x:cx+10,y:airY+16},
        eL:{x:cx-17,y:sy+16},
        eR:{x:cx+32,y:sy-14+snap*6},
        hL:{x:cx-13,y:sy+30},
        hR:{x:bStartX+snap*12,y:bStartY+snap*12+snap*14},
      };
      drawAthlete(ctx,p);
      // wrist angle label
      ctx.globalAlpha=.5;ctx.fillStyle=col;ctx.font='7px monospace';
      ctx.fillText('SNAP ↓',p.hR.x+4,p.hR.y+12);ctx.globalAlpha=1;
    }
  },
  {
    id:'followthrough',
    label:'FOLLOW-THROUGH',
    color:'#00FF87',
    tagline:'Let the arm finish across',
    mechanic:'After contact, your hitting arm swings all the way across your body. Stopping early kills velocity — the follow-through IS the swing.',
    powerTip:'Your hand should end up near the opposite hip after the swing. If your arm stops at the ball, you hit the brake at impact.',
    mistakes:['Arm stops at contact — braking at the worst moment','Pulling off the shot — elbow flares out early','No body rotation on follow-through — power didn\'t transfer'],
    draw:(ctx,t,col)=>{
      const W=160,H=200,gY=178,cx=72;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#08090b';ctx.fillRect(0,0,W,H);
      const v=sat(Math.sin(t*Math.PI*2)*.5+.5);
      const fol=smoothstep(v);
      const airY=gY-70, by=airY-30, sy=by-24;
      ctx.globalAlpha=.06;ctx.fillStyle='#aaa';
      ctx.beginPath();ctx.ellipse(cx,gY+2,8,2.5,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
      // motion trail of the arm
      ctx.globalAlpha=.15;ctx.strokeStyle=col;ctx.lineWidth=8;ctx.lineCap='round';
      ctx.beginPath();ctx.arc(cx+18,sy+2,36,-1.8,-1.8+fol*2.2);ctx.stroke();
      ctx.globalAlpha=1;
      const swing=fol;
      const hRx=cx+36-swing*48, hRy=sy-22+swing*52;
      const p={
        head:{x:cx+10-swing*8,y:sy-20},neck:{x:cx+6-swing*4,y:sy-6},
        sho:{x:cx,y:sy},hips:{x:cx,y:by},
        kL:{x:cx-10,y:by+22},kR:{x:cx+10,y:by+22},
        fL:{x:cx-10,y:airY+16},fR:{x:cx+10,y:airY+14},
        eL:{x:cx-16,y:sy+18},
        eR:{x:cx+24-swing*18,y:sy-10+swing*28},
        hL:{x:cx-12,y:sy+32},
        hR:{x:hRx,y:hRy},
      };
      drawAthlete(ctx,p);
      // "FULL FINISH" annotation
      if(swing>.6){
        ctx.globalAlpha=(swing-.6)/.4*.5;
        ctx.fillStyle=col;ctx.font='bold 7px monospace';
        ctx.fillText('FULL FINISH',hRx-14,hRy+14);ctx.globalAlpha=1;
      }
    }
  },
];

// ─── Training exercises with power focus ──────────────────────────
const TRAINING = [
  {
    id:'med-throw',
    title:'Med Ball Overhead Throw',
    category:'POWER TRANSFER',
    color:'#FF4D00',
    sets:'4×6',
    icon:'🏀',
    description:'Builds the full kinetic chain from legs through arm. The closest gym movement to an actual spike.',
    howTo:[
      {step:'Setup', desc:'Stand 3–4 feet from a wall or with a partner. Hold a 4–6 lb medicine ball overhead.'},
      {step:'Load', desc:'Shift weight back, hips drop slightly, ball goes behind your head — same as spike wind-up.'},
      {step:'Explode', desc:'Drive through your legs, rotate your hips, then shoulders. Throw the ball as hard as possible at the wall.'},
      {step:'Arm Path', desc:'Your throwing arm follows the exact same arc as a spike — this is deliberate skill training, not just strength.'},
      {step:'Reset', desc:'Catch or retrieve the ball, reset fully, then throw again. Max effort every rep — no cruise control.'},
    ],
    powerKey:'The wall throw trains your nervous system to fire your kinetic chain in the right sequence. Each rep literally programs your spike power.',
  },
  {
    id:'band-pull',
    title:'Resistance Band Spike Swing',
    category:'ARM SPEED',
    color:'#FFB800',
    sets:'3×12',
    icon:'⚡',
    description:'Isolates the shoulder rotation and arm swing pattern under resistance to build specific spike speed.',
    howTo:[
      {step:'Setup', desc:'Anchor a band at shoulder height behind you. Stand in your spike posture, band in your hitting hand.'},
      {step:'Wind-Up', desc:'Pull into your full wind-up position — elbow high, hand behind ear, shoulder rotated back.'},
      {step:'Fire', desc:'Perform your full spike swing motion against the band resistance. Don\'t rush it — control the path.'},
      {step:'Snap', desc:'Include your wrist snap at the end of every rep. The band shouldn\'t prevent it — just make it harder.'},
      {step:'Return', desc:'Return slowly to the loaded position — the slow return also builds strength in the stabilizing muscles.'},
    ],
    powerKey:'Band resistance forces your arm to fight for every inch of the swing path, building specific motor patterns that directly increase hitting speed.',
  },
  {
    id:'plyo-pushup',
    title:'Plyo Push-Up (Clap)',
    category:'UPPER EXPLOSIVE POWER',
    color:'#FF4D00',
    sets:'4×5',
    icon:'💥',
    description:'Trains explosive upper-body force production — the same fast-twitch muscle fiber recruitment needed at ball contact.',
    howTo:[
      {step:'Setup', desc:'Standard push-up position. Hands slightly wider than shoulder-width.'},
      {step:'Lower', desc:'Lower your chest to just above the floor in a controlled manner.'},
      {step:'Explode', desc:'Push as hard and fast as possible — hands should leave the ground completely.'},
      {step:'Clap', desc:'Clap your hands while airborne, then catch yourself with soft elbows on landing.'},
      {step:'Reset', desc:'Full reset between reps — this is a max-effort exercise. Do NOT rush. 5 perfect reps > 15 sloppy reps.'},
    ],
    powerKey:'The ground-leaving push trains your pecs and triceps to generate force at max velocity — the same quality needed to make the ball explode off your palm.',
  },
  {
    id:'wrist-snap',
    title:'Towel Wrist Snap Drill',
    category:'WRIST SPEED',
    color:'#00C8FF',
    sets:'3×20',
    icon:'🌊',
    description:'Isolates the wrist snap to build speed and timing of the most neglected part of the spike.',
    howTo:[
      {step:'Setup', desc:'Hold a small towel, one end in your hitting hand. Extend your arm forward as if at contact point.'},
      {step:'Arm Set', desc:'Lock your elbow — only your wrist and hand move during this drill.'},
      {step:'Snap', desc:'Snap your wrist forward and down sharply so the towel cracks like a whip. The SOUND is your feedback.'},
      {step:'Timing', desc:'The snap should happen at the very END of the arm swing, not during it. Practice the feel of the delay.'},
      {step:'Add Ball', desc:'Progress to snapping against a ball held at contact height by a partner — aim for a loud smack, not a soft push.'},
    ],
    powerKey:'Elite hitters add 5–15 mph purely through wrist speed. Most players never train this directly. A cracking towel proves you have it.',
  },
  {
    id:'standing-spike',
    title:'Standing Wall Spike',
    category:'TECHNIQUE VOLUME',
    color:'#00FF87',
    sets:'5×10',
    icon:'🏐',
    description:'High-repetition spike swings against a wall to groove perfect mechanics without the fatigue of approach jumps.',
    howTo:[
      {step:'Distance', desc:'Stand about 2 feet from a wall or rebounder. Hold or toss a ball to contact height.'},
      {step:'Wind-Up', desc:'Perform your full wind-up — elbow high, shoulder back, chest open. No shortcuts.'},
      {step:'Swing', desc:'Execute your full arm path: shoulder rotation → arm extension → wrist snap.'},
      {step:'Sound Check', desc:'You should hear a sharp CRACK, not a thud. Thud = flat palm with no snap. Crack = good contact.'},
      {step:'Reset', desc:'Retrieve ball, reset posture, repeat. Focus on the SAME motion every single rep — you\'re building a habit.'},
    ],
    powerKey:'You can\'t approach-jump 50 times in a session without burning out. Wall reps let you get 10x the quality mechanics repetitions with minimal fatigue.',
  },
  {
    id:'rotational-cable',
    title:'Rotational Cable Pull',
    category:'HIP-TO-SHOULDER CHAIN',
    color:'#FF4D00',
    sets:'3×10/side',
    icon:'🔄',
    description:'Directly trains the rotational kinetic chain — the most under-developed power source in volleyball players.',
    howTo:[
      {step:'Setup', desc:'Set cable or band at hip height. Stand sideways to anchor, feet shoulder-width, slight squat.'},
      {step:'Load', desc:'Rotate toward the anchor, letting your hips and shoulders wind up — this is your "coil."'},
      {step:'Drive', desc:'Initiate with your hips rotating away from the anchor first. Hips LEAD, shoulders FOLLOW.'},
      {step:'Finish', desc:'Complete the rotation — your chest should end up facing away from the anchor.'},
      {step:'Resist Return', desc:'Control the return slowly — this eccentric phase builds the power for the next rep.'},
    ],
    powerKey:'Research shows elite volleyball hitters generate 60–70% of their spike power from hip and trunk rotation. This exercise directly trains that source.',
  },
];

// ─── Animated phase canvas component ──────────────────────────────
function PhaseCanvas({ phase }) {
  const ref = useRef(null), fr = useRef(0), raf = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const loop = () => {
      phase.draw(ctx, (fr.current % 180) / 180, phase.color);
      fr.current++;
      raf.current = requestAnimationFrame(loop);
    };
    fr.current = 0;
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [phase]);
  return <canvas ref={ref} width={160} height={200} style={{display:'block',borderRadius:'4px'}} />;
}

// ─── Power meter bar ───────────────────────────────────────────────
function PowerBar({ label, value, color, unit='' }) {
  return (
    <div style={{marginBottom:'10px'}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'5px'}}>
        <span style={{fontFamily:'monospace',fontSize:'10px',color:'#666',letterSpacing:'1px'}}>{label}</span>
        <span style={{fontFamily:'monospace',fontSize:'11px',fontWeight:'bold',color}}>{value}{unit}</span>
      </div>
      <div style={{height:'4px',background:'#1a1d22',borderRadius:'2px'}}>
        <div style={{
          height:'100%',width:`${value}%`,
          background:`linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius:'2px',
          boxShadow:`0 0 6px ${color}44`
        }}/>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────
export default function SpikePower() {
  const [activePhase, setActivePhase] = useState(0);
  const [activeTraining, setActiveTraining] = useState(null);
  const [activeTab, setActiveTab] = useState('technique');

  const phase = PHASES[activePhase];

  return (
    <div style={{
      minHeight:'100vh',
      background:C.bg,
      color:C.text,
      fontFamily:"'Georgia', serif",
      maxWidth:'700px',
      margin:'0 auto',
    }}>

      {/* ── Header ── */}
      <div style={{
        background:C.surface,
        borderBottom:`3px solid ${C.accent}`,
        padding:'28px 24px 0',
        position:'relative',
        overflow:'hidden',
      }}>
        {/* Background text */}
        <div style={{
          position:'absolute',top:'-10px',right:'12px',
          fontFamily:'monospace',fontSize:'80px',fontWeight:'900',
          color:`${C.accent}06`,letterSpacing:'-4px',
          userSelect:'none',pointerEvents:'none',
        }}>POWER</div>

        <div style={{fontFamily:'monospace',fontSize:'9px',letterSpacing:'4px',color:C.muted,marginBottom:'8px'}}>
          VOLLEYBALL · SPIKE POWER SYSTEM
        </div>
        <div style={{fontSize:'28px',fontWeight:'bold',lineHeight:1.1,marginBottom:'6px'}}>
          Hit the Ball
          <span style={{color:C.accent,fontStyle:'italic'}}> Harder.</span>
        </div>
        <div style={{fontFamily:'monospace',fontSize:'11px',color:'#555',letterSpacing:'2px',marginBottom:'20px'}}>
          MECHANICS · TECHNIQUE · TRAINING
        </div>

        {/* Power stats */}
        <div style={{
          display:'flex',gap:'0',marginBottom:'0',
          borderTop:`1px solid ${C.border}`,
          overflow:'hidden',
        }}>
          {[
            {label:'KINETIC CHAIN',val:'5 LINKS',col:C.accent},
            {label:'AVG ELITE SPEED',val:'70 MPH',col:C.gold},
            {label:'WRIST ADDS',val:'+15 MPH',col:C.blue},
          ].map((s,i)=>(
            <div key={i} style={{
              flex:1,padding:'12px 14px',
              borderRight:i<2?`1px solid ${C.border}`:'none',
            }}>
              <div style={{fontFamily:'monospace',fontSize:'8px',color:C.muted,letterSpacing:'1px',marginBottom:'4px'}}>{s.label}</div>
              <div style={{fontFamily:'monospace',fontSize:'14px',fontWeight:'bold',color:s.col}}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Tab nav */}
        <div style={{display:'flex',marginTop:'1px',gap:'2px'}}>
          {['technique','training','power chain'].map(t=>(
            <button key={t} onClick={()=>setActiveTab(t)} style={{
              padding:'10px 16px',
              background:activeTab===t?C.accent:'transparent',
              color:activeTab===t?'#fff':C.muted,
              border:'none',cursor:'pointer',
              fontSize:'9px',fontFamily:'monospace',
              fontWeight:'900',letterSpacing:'2px',
              textTransform:'uppercase',whiteSpace:'nowrap',
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* ── TECHNIQUE TAB ── */}
      {activeTab==='technique' && (
        <div style={{padding:'20px'}}>
          <div style={{fontFamily:'monospace',fontSize:'9px',letterSpacing:'3px',color:C.muted,marginBottom:'16px'}}>
            5 PHASES OF A POWER SPIKE
          </div>

          {/* Phase selector */}
          <div style={{display:'flex',gap:'3px',marginBottom:'20px',overflowX:'auto',scrollbarWidth:'none'}}>
            {PHASES.map((ph,i)=>(
              <button key={i} onClick={()=>setActivePhase(i)} style={{
                flex:'0 0 auto',
                padding:'8px 12px',
                background:activePhase===i?`${ph.color}20`:C.dim,
                border:`1px solid ${activePhase===i?ph.color:C.border}`,
                color:activePhase===i?ph.color:C.muted,
                cursor:'pointer',fontFamily:'monospace',
                fontSize:'8px',fontWeight:'900',
                letterSpacing:'1px',whiteSpace:'nowrap',
                borderRadius:'2px',
              }}>
                {i+1}. {ph.label}
              </button>
            ))}
          </div>

          {/* Phase detail */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'160px 1fr',
            gap:'20px',
            alignItems:'start',
            marginBottom:'16px',
          }}>
            {/* Canvas */}
            <div style={{
              background:'#08090b',
              border:`1px solid ${phase.color}33`,
              borderRadius:'4px',
              padding:'10px',
              display:'flex',
              justifyContent:'center',
            }}>
              <PhaseCanvas phase={phase} />
            </div>

            {/* Info */}
            <div>
              <div style={{
                fontFamily:'monospace',fontSize:'8px',
                letterSpacing:'3px',color:phase.color,
                marginBottom:'6px',
              }}>PHASE {activePhase+1}</div>
              <div style={{fontSize:'20px',fontWeight:'bold',marginBottom:'4px',lineHeight:1.2}}>
                {phase.label}
              </div>
              <div style={{
                fontSize:'13px',fontStyle:'italic',
                color:phase.color,marginBottom:'12px',
              }}>"{phase.tagline}"</div>
              <div style={{fontSize:'13px',color:'#aaa',lineHeight:1.7,marginBottom:'14px'}}>
                {phase.mechanic}
              </div>
              {/* Power tip */}
              <div style={{
                background:`${phase.color}0d`,
                border:`1px solid ${phase.color}33`,
                borderLeft:`3px solid ${phase.color}`,
                padding:'12px',borderRadius:'2px',
              }}>
                <div style={{fontFamily:'monospace',fontSize:'8px',color:phase.color,letterSpacing:'2px',marginBottom:'6px'}}>
                  ⚡ POWER TIP
                </div>
                <div style={{fontSize:'12px',color:'#bbb',lineHeight:1.65}}>
                  {phase.powerTip}
                </div>
              </div>
            </div>
          </div>

          {/* Common mistakes */}
          <div style={{
            background:C.dim,
            border:`1px solid ${C.border}`,
            borderLeft:`3px solid #FF3355`,
            padding:'16px',
            marginBottom:'12px',
          }}>
            <div style={{fontFamily:'monospace',fontSize:'9px',color:'#FF3355',letterSpacing:'2px',marginBottom:'12px'}}>
              ✗ COMMON MISTAKES THIS PHASE
            </div>
            {phase.mistakes.map((m,i)=>(
              <div key={i} style={{
                display:'flex',gap:'10px',
                padding:'7px 0',
                borderBottom:i<phase.mistakes.length-1?`1px solid ${C.border}`:'none',
                fontSize:'12px',color:'#888',lineHeight:1.6,
              }}>
                <span style={{color:'#FF3355',fontFamily:'monospace',flexShrink:0}}>✗</span>
                {m}
              </div>
            ))}
          </div>

          {/* Phase navigation */}
          <div style={{display:'flex',gap:'8px',justifyContent:'space-between'}}>
            <button
              onClick={()=>setActivePhase(p=>Math.max(0,p-1))}
              disabled={activePhase===0}
              style={{
                flex:1,padding:'10px',
                background:activePhase===0?C.dim:`${C.border}88`,
                border:`1px solid ${activePhase===0?C.border:C.muted}`,
                color:activePhase===0?'#333':C.muted,
                fontFamily:'monospace',fontSize:'9px',cursor:activePhase===0?'default':'pointer',
                letterSpacing:'2px',
              }}
            >← PREV PHASE</button>
            <button
              onClick={()=>setActivePhase(p=>Math.min(PHASES.length-1,p+1))}
              disabled={activePhase===PHASES.length-1}
              style={{
                flex:1,padding:'10px',
                background:activePhase===PHASES.length-1?C.dim:`${phase.color}22`,
                border:`1px solid ${activePhase===PHASES.length-1?C.border:phase.color}`,
                color:activePhase===PHASES.length-1?'#333':phase.color,
                fontFamily:'monospace',fontSize:'9px',cursor:activePhase===PHASES.length-1?'default':'pointer',
                letterSpacing:'2px',fontWeight:'bold',
              }}
            >NEXT PHASE →</button>
          </div>
        </div>
      )}

      {/* ── TRAINING TAB ── */}
      {activeTab==='training' && (
        <div style={{padding:'20px'}}>
          <div style={{fontFamily:'monospace',fontSize:'9px',letterSpacing:'3px',color:C.muted,marginBottom:'6px'}}>
            SPIKE POWER TRAINING DRILLS
          </div>
          <div style={{fontSize:'13px',color:'#666',marginBottom:'20px',lineHeight:1.6}}>
            6 exercises specifically targeting the muscles and movements that create hitting power.
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:'3px'}}>
            {TRAINING.map((ex,i)=>(
              <div key={ex.id}>
                <div
                  onClick={()=>setActiveTraining(activeTraining===ex.id?null:ex.id)}
                  style={{
                    background:activeTraining===ex.id?`${ex.color}12`:C.dim,
                    border:`1px solid ${activeTraining===ex.id?ex.color:C.border}`,
                    borderLeft:`3px solid ${ex.color}`,
                    padding:'16px',cursor:'pointer',
                    transition:'all .2s',
                  }}
                >
                  <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                    <div style={{fontSize:'20px',flexShrink:0}}>{ex.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'3px'}}>
                        <span style={{fontFamily:'monospace',fontSize:'8px',color:ex.color,letterSpacing:'2px',background:`${ex.color}15`,padding:'2px 6px',borderRadius:'2px'}}>
                          {ex.category}
                        </span>
                      </div>
                      <div style={{fontSize:'15px',fontWeight:'bold',marginBottom:'3px'}}>{ex.title}</div>
                      <div style={{fontFamily:'monospace',fontSize:'11px',color:'#555'}}>{ex.description}</div>
                    </div>
                    <div style={{textAlign:'right',flexShrink:0}}>
                      <div style={{fontFamily:'monospace',fontSize:'13px',fontWeight:'bold',color:ex.color}}>{ex.sets}</div>
                      <div style={{fontFamily:'monospace',fontSize:'10px',color:C.muted,marginTop:'4px'}}>
                        {activeTraining===ex.id?'▲ HIDE':'▼ HOW TO'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded how-to */}
                {activeTraining===ex.id && (
                  <div style={{
                    background:'#0a0c0f',
                    border:`1px solid ${ex.color}33`,
                    borderTop:'none',
                    borderLeft:`3px solid ${ex.color}`,
                    padding:'0 16px 16px',
                  }}>
                    <div style={{
                      background:`${ex.color}0a`,
                      border:`1px solid ${ex.color}22`,
                      padding:'12px 14px',
                      margin:'0 0 14px',
                    }}>
                      <div style={{fontFamily:'monospace',fontSize:'8px',color:ex.color,letterSpacing:'2px',marginBottom:'5px'}}>⚡ WHY THIS BUILDS POWER</div>
                      <div style={{fontSize:'12px',color:'#aaa',lineHeight:1.65}}>{ex.powerKey}</div>
                    </div>

                    <div style={{fontFamily:'monospace',fontSize:'9px',color:C.muted,letterSpacing:'2px',marginBottom:'10px'}}>HOW TO DO IT</div>
                    {ex.howTo.map((step,si)=>(
                      <div key={si} style={{
                        display:'flex',gap:'12px',
                        padding:'9px 0',
                        borderBottom:si<ex.howTo.length-1?`1px solid ${C.border}`:'none',
                      }}>
                        <div style={{
                          minWidth:'22px',height:'22px',borderRadius:'50%',
                          background:`${ex.color}18`,border:`1px solid ${ex.color}44`,
                          display:'flex',alignItems:'center',justifyContent:'center',
                          fontFamily:'monospace',fontSize:'9px',fontWeight:'bold',
                          color:ex.color,flexShrink:0,marginTop:'1px',
                        }}>{si+1}</div>
                        <div>
                          <div style={{fontSize:'11px',fontWeight:'bold',color:'#ddd',marginBottom:'3px',fontFamily:'monospace',letterSpacing:'0.5px'}}>{step.step}</div>
                          <div style={{fontSize:'12px',color:'#888',lineHeight:1.65}}>{step.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── POWER CHAIN TAB ── */}
      {activeTab==='power chain' && (
        <div style={{padding:'20px'}}>
          <div style={{fontFamily:'monospace',fontSize:'9px',letterSpacing:'3px',color:C.muted,marginBottom:'16px'}}>
            THE KINETIC CHAIN — WHERE POWER COMES FROM
          </div>

          <div style={{
            background:C.dim,border:`1px solid ${C.border}`,
            padding:'16px',marginBottom:'16px',
          }}>
            <div style={{fontSize:'13px',color:'#aaa',lineHeight:1.75}}>
              A volleyball spike is not an arm exercise. Power travels upward like a crack of a whip — starting at the ground and multiplying at each joint. Break the chain anywhere and you lose velocity.
            </div>
          </div>

          {/* Chain links */}
          {[
            {num:1,name:'GROUND PUSH',muscle:'Legs & Calves',color:C.green,pct:25,desc:'Your feet push into the ground during the jump. Ground reaction force launches your entire body upward — this is where it all starts.', cue:'Drive THROUGH the floor, not just off it'},
            {num:2,name:'HIP ROTATION',muscle:'Glutes & Core',color:C.gold,pct:35,desc:'As you peak in the air, your hips rotate explosively toward the net. This rotation speeds up everything above it through angular momentum.', cue:'Hips lead the shoulder by a half-second'},
            {num:3,name:'TRUNK ROTATION',muscle:'Obliques & Lats',color:C.accent,pct:55,desc:'Your obliques and lats whip your torso through. Your chest opens toward the ball — this is the largest single power contributor in the chain.', cue:'Feel your rib cage rotate, not just your shoulder'},
            {num:4,name:'SHOULDER DRIVE',muscle:'Deltoid & Rotator Cuff',color:C.accent,pct:75,desc:'The shoulder joint transfers all the trunk rotation into linear arm speed. Your arm is passive here — it rides the rotation wave.', cue:'Elbow leads, hand trails — not the other way'},
            {num:5,name:'WRIST SNAP',muscle:'Forearm Flexors',color:C.blue,pct:100,desc:'The final amplifier. A fast wrist snap adds 5–15 mph to ball speed and creates the topspin that brings the ball down into the court.', cue:'Snap happens AFTER contact, not during'},
          ].map((link,i)=>(
            <div key={i} style={{display:'flex',gap:'16px',alignItems:'stretch',marginBottom:'3px'}}>
              {/* Timeline connector */}
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',minWidth:'32px'}}>
                <div style={{
                  width:'32px',height:'32px',borderRadius:'50%',
                  background:`${link.color}20`,border:`2px solid ${link.color}`,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontFamily:'monospace',fontSize:'12px',fontWeight:'bold',
                  color:link.color,flexShrink:0,marginTop:'14px',
                }}>{link.num}</div>
                {i<4&&<div style={{width:'2px',flex:1,background:`linear-gradient(${link.color}44,${C.border})`,marginTop:'4px'}}/>}
              </div>

              {/* Card */}
              <div style={{
                flex:1,background:C.dim,border:`1px solid ${C.border}`,
                borderLeft:`3px solid ${link.color}`,padding:'14px',
                marginBottom:'3px',
              }}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px'}}>
                  <div>
                    <div style={{fontFamily:'monospace',fontSize:'8px',color:link.color,letterSpacing:'2px',marginBottom:'3px'}}>{link.name}</div>
                    <div style={{fontSize:'16px',fontWeight:'bold'}}>{link.muscle}</div>
                  </div>
                  <div style={{
                    fontFamily:'monospace',fontSize:'18px',fontWeight:'bold',
                    color:link.color,
                  }}>{link.pct}%</div>
                </div>

                {/* Power accumulation bar */}
                <div style={{height:'3px',background:'#1a1d22',borderRadius:'2px',marginBottom:'10px'}}>
                  <div style={{
                    height:'100%',width:`${link.pct}%`,
                    background:`linear-gradient(90deg,${link.color}55,${link.color})`,
                    borderRadius:'2px',boxShadow:`0 0 6px ${link.color}44`,
                  }}/>
                </div>

                <div style={{fontSize:'12px',color:'#888',lineHeight:1.65,marginBottom:'10px'}}>
                  {link.desc}
                </div>

                <div style={{
                  display:'flex',gap:'8px',alignItems:'center',
                  background:`${link.color}0a`,padding:'8px 10px',
                }}>
                  <span style={{color:link.color,fontSize:'12px'}}>→</span>
                  <span style={{fontFamily:'monospace',fontSize:'10px',color:link.color,letterSpacing:'0.5px'}}>
                    {link.cue}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Power percentages summary */}
          <div style={{
            background:C.dim,border:`1px solid ${C.border}`,
            padding:'18px',marginTop:'8px',
          }}>
            <div style={{fontFamily:'monospace',fontSize:'9px',color:C.muted,letterSpacing:'3px',marginBottom:'14px'}}>
              POWER SOURCE BREAKDOWN
            </div>
            <PowerBar label="LEGS & JUMP" value={25} color={C.green} unit="%" />
            <PowerBar label="HIP ROTATION" value={35} color={C.gold} unit="%" />
            <PowerBar label="TRUNK / CORE" value={55} color={C.accent} unit="%" />
            <PowerBar label="SHOULDER DRIVE" value={20} color='#ff8855' unit="%" />
            <PowerBar label="WRIST SNAP" value={15} color={C.blue} unit="%" />
            <div style={{
              marginTop:'14px',padding:'12px',
              background:`${C.accent}0a`,border:`1px solid ${C.accent}22`,
            }}>
              <div style={{fontFamily:'monospace',fontSize:'9px',color:C.accent,letterSpacing:'2px',marginBottom:'6px'}}>
                THE BOTTOM LINE
              </div>
              <div style={{fontSize:'12px',color:'#888',lineHeight:1.65}}>
                Most players train their arm and ignore their hips and core. Flipping that ratio — training hip and trunk rotation first — is the fastest path to dramatically more hitting power.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
