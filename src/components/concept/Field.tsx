'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './useScrollProgress';
import styles from './Field.module.scss';

/* Jedno tło całej strony: ciemna, wolno płynąca materia (domain-warped fbm) podświetlona
   kolorem kostek. Kolor przechodzi przez paletę razem z przewijaniem, kursor zostawia poświatę. */

const VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';

const FRAG = `
precision highp float;
uniform vec2 r; uniform float t; uniform vec2 m; uniform vec3 c; uniform float s;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 R=mat2(.8,.6,-.6,.8);
  for(int i=0;i<5;i++){v+=a*n(p);p=R*p*2.03;a*=.5;}return v;}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*r)/r.y;
  float T=t*.035;
  vec2 q=vec2(fbm(uv*1.25+vec2(0.,T)),fbm(uv*1.25+vec2(5.2,1.3)-T));
  vec2 w=vec2(fbm(uv*1.5+2.6*q+vec2(1.7,9.2)+s*1.6),fbm(uv*1.5+2.6*q+vec2(8.3,2.8)-s*1.2));
  float f=fbm(uv*1.1+2.2*w);
  vec3 col=vec3(.022,.028,.026);
  col=mix(col,vec3(.035,.06,.05),smoothstep(.3,.85,f));
  col+=c*pow(smoothstep(.48,1.,f),2.4)*.3;
  float d=length(uv-m);
  col+=c*.085*exp(-d*d*4.);
  col*=1.-.42*dot(uv*.85,uv*.85);
  col+=(h(gl_FragCoord.xy+fract(t*.37))-.5)*.016;
  gl_FragColor=vec4(col,1.);
}`;

/* Kolory przy kolejnych sekcjach: zieleń → turkus → pomarańcz → fiolet → niebieski → zieleń */
const STOPS: [number, number, number][] = [
  [0.53, 0.76, 0.29], [0.24, 0.70, 0.64], [0.96, 0.54, 0.23],
  [0.61, 0.42, 0.84], [0.24, 0.50, 0.88], [0.53, 0.76, 0.29],
];

function colorAt(s: number): [number, number, number] {
  const x = Math.min(0.9999, Math.max(0, s)) * (STOPS.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  const a = STOPS[i]!, b = STOPS[i + 1]!;
  const e = f * f * (3 - 2 * f);
  return [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e, a[2] + (b[2] - a[2]) * e];
}

const SCALE = 0.5; // pół rozdzielczości: tło jest miękkie, a GPU odpoczywa

export function Field() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uR = gl.getUniformLocation(prog, 'r');
    const uT = gl.getUniformLocation(prog, 't');
    const uM = gl.getUniformLocation(prog, 'm');
    const uC = gl.getUniformLocation(prog, 'c');
    const uS = gl.getUniformLocation(prog, 's');

    const still = prefersReducedMotion();
    let w = 0, h = 0;
    const resize = () => {
      w = Math.max(1, Math.round(window.innerWidth * SCALE));
      h = Math.max(1, Math.round(window.innerHeight * SCALE));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };
    resize();

    // Kursor w układzie shadera (środek = 0, wysokość = 1), wygładzany
    const target = { x: 0.35, y: 0.1 };
    const mouse = { x: 0.35, y: 0.1 };
    const onMove = (e: PointerEvent) => {
      const vw = window.innerWidth, vh = window.innerHeight;
      target.x = (e.clientX - vw / 2) / vh;
      target.y = (vh / 2 - e.clientY) / vh;
    };

    let scroll = 0;
    const readScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll = max > 0 ? window.scrollY / max : 0;
    };
    readScroll();

    let raf = 0;
    const t0 = performance.now();
    const draw = (now: number) => {
      mouse.x += (target.x - mouse.x) * 0.06;
      mouse.y += (target.y - mouse.y) * 0.06;
      const col = colorAt(scroll);
      gl.uniform2f(uR, w, h);
      gl.uniform1f(uT, still ? 12 : (now - t0) / 1000);
      gl.uniform2f(uM, mouse.x, mouse.y);
      gl.uniform3f(uC, col[0], col[1], col[2]);
      gl.uniform1f(uS, scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.classList.add(styles.ready!);
      raf = still || document.hidden ? 0 : requestAnimationFrame(draw);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(draw); };

    const onScroll = () => { readScroll(); if (still) kick(); };
    const onResize = () => { resize(); readScroll(); kick(); };
    const onVisibility = () => { if (!document.hidden) kick(); };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    kick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return (
    <div className={styles.field} aria-hidden="true">
      <canvas ref={ref} className={styles.canvas} />
    </div>
  );
}
