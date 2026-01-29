
const ROWS=4, COLS=4;
const COUNT=ROWS*COLS;
const EMPTY=COUNT-1;
const IMG="images/puzzle.png";
const BEST_KEY="best_moves_simple";

let tiles=[...Array(COUNT).keys()];
let moves=0;

const board=document.getElementById("board");
const movesEl=document.getElementById("moves");
const bestEl=document.getElementById("best");
const toastEl=document.getElementById("toast");

function pos(i){return{r:Math.floor(i/COLS),c:i%COLS};}
function idx(r,c){return r*COLS+c;}
function neighbors(i){
 const {r,c}=pos(i);let a=[];
 if(r>0)a.push(idx(r-1,c));
 if(r<ROWS-1)a.push(idx(r+1,c));
 if(c>0)a.push(idx(r,c-1));
 if(c<COLS-1)a.push(idx(r,c+1));
 return a;
}
function empty(){return tiles.indexOf(EMPTY);}

function tileSize(){
 const r=board.getBoundingClientRect();
 return {w:r.width/COLS,h:r.height/ROWS};
}

function setMoves(n){moves=n;movesEl.textContent=n;}
function loadBest(){bestEl.textContent=localStorage.getItem(BEST_KEY)||"—";}
function maybeBest(){
 const b=localStorage.getItem(BEST_KEY);
 if(!b||moves<Number(b)){localStorage.setItem(BEST_KEY,moves);loadBest();}
}
function toast(t){
 toastEl.textContent=t;
 toastEl.classList.add("show");
 clearTimeout(toastEl._t);
 toastEl._t=setTimeout(()=>toastEl.classList.remove("show"),1200);
}

function render(){
 board.innerHTML="";
 const {w,h}=tileSize();
 for(let slot=0;slot<COUNT;slot++){
  const t=tiles[slot];
  if(t===EMPTY)continue;
  const d=document.createElement("div");
  d.className="tile";
  d.style.width=w+"px";
  d.style.height=h+"px";
  const p=pos(slot);
  d.style.transform=`translate(${p.c*w}px,${p.r*h}px)`;
  const tp=pos(t);
  d.style.backgroundImage=`url(${IMG})`;
  d.style.backgroundSize=`${COLS*100}% ${ROWS*100}%`;
  d.style.backgroundPosition=`${tp.c/(COLS-1)*100}% ${tp.r/(ROWS-1)*100}%`;
  d.onclick=()=>move(slot);
  board.appendChild(d);
 }
}

function move(i){
 const e=empty();
 if(!neighbors(e).includes(i))return;
 [tiles[i],tiles[e]]=[tiles[e],tiles[i]];
 setMoves(moves+1);
 render();
 if(solved()){toast("Solved!");maybeBest();}
}

function solved(){
 for(let i=0;i<COUNT;i++)if(tiles[i]!==i)return false;
 return true;
}

function shuffle(){
 tiles=[...Array(COUNT).keys()];
 for(let i=0;i<200;i++){
  const e=empty();
  const n=neighbors(e);
  const p=n[Math.floor(Math.random()*n.length)];
  [tiles[p],tiles[e]]=[tiles[e],tiles[p]];
 }
 setMoves(0);
 render();
}

window.onresize=render;
loadBest();
shuffle();
