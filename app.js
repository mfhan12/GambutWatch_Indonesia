const $=id=>document.getElementById(id);
const NS="http://www.w3.org/2000/svg";
const km=(a,b,c,d)=>{const r=Math.PI/180;return Math.hypot((c-a)*r*Math.cos((b+d)/2*r),(d-b)*r)*6371};
const col=s=>s>=60?"var(--ember)":s>=35?"var(--warn)":"var(--ok)";
const lvl=s=>s>=60?"Tinggi":s>=35?"Sedang":"Rendah";
// wilayah: id, nama, [x0,x1,y0,y1], pusat gambut [lon,lat,rx,ry], kabupaten: [nama,lon,lat,gambut,hariKering,angin]
const R=[
{id:"aceh",n:"Aceh",b:[95.4,98.6,1.9,5.0],p:[96.6,3.9,.35,.18],u:[["Nagan Raya",96.5,4.0,.85,18,14],["Aceh Barat Daya",96.85,3.75,.5,12,12],["Aceh Tamiang",98.0,4.2,.3,8,10],["Aceh Singkil",97.8,2.3,.7,16,13],["Bireuen",96.7,5.2,.83,16,12],["Lhokseumawe",97.15,5.18,.81,17,13],["Banda Aceh",95.32,5.55,.80,18,15],["Aceh Besar",95.5,5.4,.84,15,11],["Aceh Tengah",96.85,4.6,.81,14,10],["Aceh Tenggara",97.8,3.38,.83,15,11],["Aceh Timur",97.7,4.8,.80,18,14],["Aceh Utara",97.2,5.0,.81,17,13],["Bener Meriah",96.8,4.75,.82,13,9],["Gayo Lues",97.35,3.95,.84,14,10],["Pidie",95.95,5.15,.82,17,13],["Pidie Jaya",96.22,5.18,.81,16,12],["Simeulue",96.0,2.6,.87,15,11],["Langsa",97.97,4.47,.79,18,14],["Sabang",95.32,5.88,.78,20,15],["Subulussalam",98.0,2.65,.85,16,12]]},
{id:"riau",n:"Riau",b:[100.4,104.2,-1.3,2.5],p:[102.3,0.7,.9,.7],u:[["Pelalawan",102.0,0.3,.9,22,15],["Siak",102.0,0.9,.8,20,14],["Bengkalis",102.0,1.5,.85,19,16],["Kep. Meranti",102.7,1.0,.95,21,15],["Rokan Hilir",100.9,2.0,.6,14,12],["Indragiri Hilir",103.2,-0.5,.9,17,13]]},
{id:"jambi",n:"Jambi",b:[102.6,104.9,-2.4,-0.4],p:[103.8,-1.3,.5,.3],u:[["Muaro Jambi",103.9,-1.6,.7,16,12],["Tanjung Jabung Timur",104.2,-1.1,.8,15,13],["Tanjung Jabung Barat",103.6,-0.9,.55,12,11]]},
{id:"sumsel",n:"Sumatra Selatan",b:[103.4,106.6,-4.2,-1.9],p:[105.0,-3.1,.8,.4],u:[["Ogan Komering Ilir",105.5,-3.3,.85,24,14],["Banyuasin",104.5,-2.7,.7,21,13],["Musi Banyuasin",103.9,-2.6,.5,17,11]]},
{id:"kalbar",n:"Kalimantan Barat",b:[108.6,111.8,-3.2,1.0],p:[109.9,-0.9,.7,.8],u:[["Kubu Raya",109.4,-0.3,.85,17,13],["Ketapang",110.6,-1.8,.7,20,12],["Mempawah",109.1,0.4,.5,11,11],["Kayong Utara",110.0,-1.2,.8,16,12]]},
{id:"kalteng",n:"Kalimantan Tengah",b:[111.6,115.4,-3.9,-1.2],p:[113.6,-2.7,.9,.45],u:[["Pulang Pisau",114.0,-2.7,.9,25,15],["Kapuas",114.4,-3.0,.85,23,14],["Katingan",113.0,-1.9,.75,19,13],["Kotawaringin Timur",112.6,-2.5,.6,15,12],["Palangka Raya",113.9,-2.2,.7,22,14]]},
{id:"sumut",n:"Sumatra Utara",b:[97.4,100.6,1.4,4.2],p:[99.6,2.6,.4,.3],u:[["Asahan",99.6,2.9,.45,10,11],["Labuhanbatu",100.0,2.2,.55,11,11],["Batu Bara",99.5,3.2,.4,9,11],["Langkat",98.2,3.7,.4,9,11]]},
{id:"kalsel",n:"Kalimantan Selatan",b:[114.3,116.6,-4.3,-1.7],p:[114.7,-3.0,.4,.35],u:[["Barito Kuala",114.6,-3.0,.7,17,12],["Banjar",115.0,-3.3,.5,14,11],["Tanah Laut",114.9,-3.8,.3,10,11],["Hulu Sungai Utara",115.2,-2.4,.45,13,10]]},
{id:"kaltim",n:"Kalimantan Timur",b:[115.5,118.6,-2.6,2.2],p:[116.6,-0.4,.5,.4],u:[["Kutai Kartanegara",116.8,-0.4,.4,13,11],["Kutai Timur",117.5,0.8,.3,12,10],["Penajam Paser Utara",116.7,-1.2,.25,11,10],["Berau",117.4,2.0,.25,10,10]]}
];
// data simulasi
let seed=7;const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
let F=[];
R.forEach(r=>r.u.forEach(u=>{const n=Math.round(u[3]*u[4]/3);for(let i=0;i<n;i++){const d=Math.floor(Math.pow(rnd(),1.6)*30);F.push([u[1]+(rnd()-.5)*.3,u[2]+(rnd()-.5)*.3,d,["rendah","sedang","tinggi"][Math.floor(rnd()*3)]])}}));
const SIMF=F.slice();R.forEach(r=>r.u.forEach(u=>{u.d4=u[4];u.d5=u[5]}));
function score(){R.forEach(r=>r.u.forEach(u=>{u.hs=F.filter(f=>km(u[1],u[2],f[0],f[1])<=25).length;
 u.s=Math.round(100*(.35*Math.min(u[4]/20,1)+.30*Math.min(u.hs/6,1)+.20*u[3]+.15*Math.min(u[5]/25,1)))}));
 R.forEach(r=>{r.s=Math.round(r.u.reduce((a,u)=>a+u.s,0)/r.u.length);r.c=[(r.b[0]+r.b[1])/2,(r.b[2]+r.b[3])/2]})}
score();
const NAT=[94.5,119.5,-6.2,6.2];

let reports=[],cur=null,sel=null;
try{reports=JSON.parse(localStorage.getItem("gw_reports2")||"[]")}catch(e){}
const days=()=>+$("days").value;
const SU="https://server.arcgisonline.com/ArcGIS/rest/services/",TO={maxNativeZoom:16,maxZoom:18};
const map=L.map("map",{preferCanvas:true,minZoom:4,maxZoom:18}).fitBounds([[NAT[2],NAT[0]],[NAT[3],NAT[1]]]);
L.tileLayer(SU+"World_Imagery/MapServer/tile/{z}/{y}/{x}",{...TO,attribution:"Citra © Esri, Maxar, Earthstar Geographics, GIS User Community"}).addTo(map);
const gRoad=L.layerGroup([L.tileLayer(SU+"Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",TO),L.tileLayer(SU+"Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",TO)]).addTo(map);
const [gPeat,gFire,gRep,gUnit,gPin]=[1,2,3,4,5].map(()=>L.layerGroup().addTo(map));
const hx=s=>s>=60?"#e5471f":s>=35?"#e89a1b":"#4c8a4f";
const PI=L.divIcon({className:"mkw",html:'<span class="pp"></span>',iconSize:[14,14],iconAnchor:[7,7]}),RI=L.divIcon({className:"mkw",html:'<span class="rp"></span>',iconSize:[12,12],iconAnchor:[6,6]});
const mkIcon=(n,s,on)=>L.divIcon({className:"mkw",iconSize:[0,0],html:`<div class="mk"><i style="background:${hx(s)}${on?";border-color:#ffd54a;transform:scale(1.25)":""}"></i><span>${n}</span></div>`});
const ell=r=>{const[x,y,a,b]=r.p;return Array.from({length:40},(_,i)=>{const t=i/40*2*Math.PI;return[y+b*Math.sin(t),x+a*Math.cos(t)]})};
const fitNat=()=>map.fitBounds([[NAT[2],NAT[0]],[NAT[3],NAT[1]]]);
function draw(){
  [gPeat,gFire,gRep,gUnit].forEach(g=>g.clearLayers());
  const bd=map.getBounds().pad(.1),inV=(lon,lat)=>bd.contains([lat,lon]),z=map.getZoom(),regs=cur?[cur]:R;
  if($("lPeat").checked)regs.forEach(r=>L.polygon(ell(r),{color:"#f0d6a8",weight:1.5,dashArray:"4 3",fillColor:"#b99a76",fillOpacity:.35}).bindTooltip("Area gambut (contoh) – "+r.n).addTo(gPeat));
  if($("lFire").checked){const A=thin(F.filter(f=>f[2]<days()&&inV(f[0],f[1])));
    A.forEach(f=>{const m=L.circleMarker([f[1],f[0]],{radius:z>=10?6:z>=7?4:2.2,color:"#fff",weight:z>=7?1:0,fillColor:"#e5471f",fillOpacity:.9});
      if(z>=7)m.bindTooltip(`Titik api ${f[2]===0?"hari ini":f[2]+" hari lalu"} • keyakinan ${f[3]}`);m.addTo(gFire)});
    if(z>=8)A.filter(f=>f[2]===0).slice(0,300).forEach(f=>L.marker([f[1],f[0]],{icon:PI,interactive:false,keyboard:false}).addTo(gFire))}
  if($("lRep").checked)reports.filter(r=>inV(r.lon,r.lat)).forEach(r=>L.marker([r.lat,r.lon],{icon:RI,title:"Laporan: "+r.kind}).addTo(gRep));
  const items=cur||z>=7?(cur?[cur]:R).flatMap(r=>r.u.map((u,i)=>({n:u[0],s:u.s,la:u[2],lo:u[1],on:cur&&sel===i,go:()=>{if(cur!==r)openRegion(r,1);pickUnit(i,1)}}))):R.map(r=>({n:r.n,s:r.s,la:r.c[1],lo:r.c[0],go:()=>openRegion(r)}));
  items.forEach(o=>L.marker([o.la,o.lo],{icon:mkIcon(o.n,o.s,o.on),title:`${o.n}, risiko ${lvl(o.s)}`}).on("click",o.go).addTo(gUnit));
  if(cur&&sel!==null){const u=cur.u[sel];L.circle([u[2],u[1]],{radius:25000,color:"#fff",weight:1.5,dashArray:"4 4",fill:false,interactive:false}).addTo(gUnit)}
  stats();
}
map.on("moveend",draw);
$("lRoad").onchange=()=>$("lRoad").checked?gRoad.addTo(map):map.removeLayer(gRoad);
map.on("click",e=>{const{lat,lng}=e.latlng,A=F.filter(f=>f[2]<days()),near=A.reduce((m,f)=>Math.min(m,km(lng,lat,f[0],f[1])),1e9);
  gPin.clearLayers();L.circleMarker([lat,lng],{radius:7,color:"#fff",weight:2,fillColor:"#2f6fdb",fillOpacity:1}).addTo(gPin);
  $("detail").innerHTML=`<b>Titik terpilih</b> ${lat.toFixed(4)}, ${lng.toFixed(4)}<br>Titik api terdekat (${days()} hari): ${A.length?near.toFixed(1)+" km":"tidak ada"}<button type="button" class="btn alt" id="usePin">Gunakan titik ini untuk laporan</button>`;
  $("usePin").onclick=()=>{let br=null,bi=0,d=1e9;R.forEach(r=>r.u.forEach((u,i)=>{const k=km(lng,lat,u[1],u[2]);if(k<d){d=k;br=r;bi=i}}));
    if(d>150){$("gmsg").textContent="Titik ini di luar wilayah yang dipantau. Pilih wilayah dari daftar.";tab(2);return}
    gps=[lng,lat];$("fr").value=br.id;fillUnits();$("fv").value=bi;$("gmsg").textContent=`Titik peta dipakai. Terdekat: ${br.u[bi][0]}, ${br.n} (${d.toFixed(0)} km).`;tab(2)}});
function stats(){
  const regs=cur?[cur]:R,inR=(lon,lat)=>(live&&!cur)||regs.some(r=>lon>=r.b[0]&&lon<=r.b[1]&&lat>=r.b[2]&&lat<=r.b[3]);
  $("sHot").textContent=F.filter(f=>f[2]<days()&&inR(f[0],f[1])).length;
  $("lHot").textContent="titik api "+(cur?"di "+cur.n:live?"di Sumatra & Kalimantan (langsung)":"di "+R.length+" wilayah (simulasi)");
  const units=regs.flatMap(r=>r.u);
  $("sHigh").textContent=units.filter(u=>u.s>=60).length;
  $("lHigh").textContent="kabupaten berisiko tinggi";
  $("sRep").textContent=reports.filter(r=>inR(r.lon,r.lat)).length;
}
function crumb(){
  $("crumb").innerHTML=cur?`<button id="back">← Sumatra &amp; Kalimantan</button><span>${cur.n}</span>`:"<span>Sumatra &amp; Kalimantan – "+R.length+" wilayah gambut utama</span>";
  if(cur)$("back").onclick=()=>{cur=null;sel=null;fitNat();refresh();$("detail").textContent="Pilih wilayah di peta atau di daftar."};
}
function list(){
  $("list").innerHTML="";
  const items=cur?cur.u.map((u,i)=>({i,n:u[0],s:u.s,sub:`${u.hs} titik api dalam 25 km • ${u[4]} hari tanpa hujan`,go:()=>pickUnit(i,1)}))
   :R.map(r=>({n:r.n,s:r.s,sub:`${r.u.length} kabupaten dipantau • skor rata-rata`,go:()=>openRegion(r)}));
  items.sort((a,b)=>b.s-a.s).forEach(it=>{const r=document.createElement("div");r.className="row";r.tabIndex=0;
    r.innerHTML=`<div class="n"><b>${it.n}</b><small>${it.sub}</small><div class="bar"><i style="width:${it.s}%;background:${col(it.s)}"></i></div></div><span class="badge" style="background:${col(it.s)}">${it.s} ${lvl(it.s)}</span>`;
    r.onclick=it.go;r.onkeydown=e=>{if(e.key==="Enter")it.go()};$("list").appendChild(r)});
}
function refresh(){crumb();list();draw()}
function openRegion(r,nf){cur=r;sel=null;if(!nf)map.fitBounds([[r.b[2],r.b[0]],[r.b[3],r.b[1]]]);refresh();$("fr").value=r.id;fillUnits();
  $("detail").innerHTML=`<b>${r.n}</b> — risiko rata-rata <b style="color:${col(r.s)}">${lvl(r.s)} (${r.s}/100)</b><br>Pilih kabupaten untuk melihat rincian.`}
function pickUnit(i,go){
  sel=i;const u=cur.u[i];
  const near=F.filter(f=>f[2]<days()).map(f=>km(u[1],u[2],f[0],f[1])).sort((a,b)=>a-b)[0];
  const adv=u.s>=60?"Siaga: dilarang membakar lahan, siapkan sekat kanal dan alat pemadam, segera hubungi perangkat desa atau BPBD jika melihat asap.":u.s>=35?"Waspada: pantau perkembangan titik api tiap hari.":"Kondisi relatif aman, tetap pantau laporan terbaru.";
  $("detail").innerHTML=`<b>${u[0]}</b>, ${cur.n} — risiko <b style="color:${col(u.s)}">${lvl(u.s)} (${u.s}/100)</b><br>Gambut ${Math.round(u[3]*100)}% • ${u[4]} hari tanpa hujan • angin ${u[5]} km/j<br>Titik api terdekat (periode dipilih): ${near!==undefined?near.toFixed(1)+" km":"tidak ada"}<br><i>${adv}</i>`;
  $("fv").value=i;if(go)map.setView([u[2],u[1]],Math.max(map.getZoom(),11));draw();
}
function tab(n){[1,2,3].forEach(i=>{$("p"+i).hidden=i!==n;$("t"+i).setAttribute("aria-selected",i===n)})}
$("t1").onclick=()=>tab(1);$("t2").onclick=()=>tab(2);$("t3").onclick=()=>tab(3);
["days","lPeat","lFire","lRep"].forEach(id=>$(id).onchange=()=>{
  if(id==="days"&&live&&lk()!==last){pull();return}
  draw();nat();if(cur&&sel!==null)pickUnit(sel)});
R.forEach(r=>$("fr").add(new Option(r.n,r.id)));
function fillUnits(){const r=R.find(x=>x.id===$("fr").value);$("fv").innerHTML="";r.u.forEach((u,i)=>$("fv").add(new Option(u[0],i)))}
$("fr").onchange=fillUnits;fillUnits();
let gps=null;
$("gps").onclick=()=>{
  if(!navigator.geolocation){$("gmsg").textContent="Perangkat tidak mendukung GPS. Pilih wilayah dari daftar.";return}
  $("gmsg").textContent="Mencari lokasi…";
  navigator.geolocation.getCurrentPosition(p=>{
    const lo=p.coords.longitude,la=p.coords.latitude;let br=null,bi=0,d=1e9;
    R.forEach(r=>r.u.forEach((u,i)=>{const k=km(lo,la,u[1],u[2]);if(k<d){d=k;br=r;bi=i}}));
    if(d>150){gps=null;$("gmsg").textContent="Lokasimu di luar wilayah yang dipantau. Pilih wilayah terdekat dari daftar.";return}
    gps=[lo,la];map.setView([la,lo],13);$("fr").value=br.id;fillUnits();$("fv").value=bi;
    $("gmsg").textContent=`Lokasi ditemukan. Terdekat: ${br.u[bi][0]}, ${br.n} (${d.toFixed(0)} km).`;
  },()=>{$("gmsg").textContent="Lokasi tidak bisa diakses. Pilih wilayah dari daftar.";},{timeout:8000});
};
function repList(){
  if(!reports.length){$("reps").innerHTML='<div class="msg">Belum ada laporan.</div>';return}
  $("reps").innerHTML=reports.slice().reverse().slice(0,6).map(r=>`<div class="rep"><b>${r.kind}</b> • ${r.village}, ${r.region}<br>${r.note?r.note.replace(/</g,"&lt;")+"<br>":""}<span class="badge" style="background:${r.ok?"var(--ok)":"var(--warn)"}">${r.ok?"Cocok dengan titik api satelit":"Menunggu verifikasi"}</span></div>`).join("");
}
$("form").onsubmit=e=>{
  e.preventDefault();
  const r=R.find(x=>x.id===$("fr").value),u=r.u[+$("fv").value];
  const lon=gps?gps[0]:u[1]+(rnd()-.5)*.1,lat=gps?gps[1]:u[2]+(rnd()-.5)*.1;
  const ok=F.some(f=>f[2]<=3&&km(lon,lat,f[0],f[1])<=3);
  reports.push({kind:$("fk").value,village:u[0],region:r.n,note:$("fn").value.trim(),lon,lat,ok});
  try{localStorage.setItem("gw_reports2",JSON.stringify(reports))}catch(x){}
  $("fmsg").textContent=ok?"Laporan terkirim dan cocok dengan titik api satelit 3 hari terakhir.":"Laporan terkirim. Menunggu verifikasi perangkat desa.";
  $("fn").value="";$("ff").value="";gps=null;$("gmsg").textContent="";
  repList();draw();
};

// ===== Pemantauan langsung se-Indonesia =====
let live=false,hasLive=false,tmr=null,upd=null,last="";
const BB=[94.7,118.95,-5.95,6.2];
// Kunci FIRMS bawaan agar semua pengunjung bisa memuat data langsung tanpa mengisi kunci sendiri.
// Kunci ini gratis dan bisa diganti kapan saja di firms.modaps.eosdis.nasa.gov/api/map_key/
const DEFAULT_KEY="f970c607861981f297243ba9e02f3eb8";
// area asing/pulau lain di dalam kotak (semenanjung Malaysia, Borneo utara, Jawa barat, Sulawesi barat): kasar
const XC=[[[100,7],[104.8,7],[104.8,1],[103.4,1.1],[102.3,1.9],[100.9,3],[100.2,4.2],[100,5.5]],[[109.6,2.1],[111,1.4],[113,1.3],[114.2,1.8],[115,3.9],[115.7,4.2],[117.7,4.3],[119.5,4.3],[119.5,7.6],[109,7.6]],[[105.9,-5.9],[109,-5.9],[109,-8],[105.5,-8]],[[118.3,-6],[119,-6],[119,-.5],[118.3,-.5]]];
const pip=(x,y,p)=>{let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c}return c};
const inID=(x,y)=>x>=BB[0]&&x<=BB[1]&&y>=BB[2]&&y<=BB[3]&&!XC.some(p=>pip(x,y,p));
// pusat provinsi (perkiraan) untuk pengelompokan
const PV=[["Aceh",96.7,4.2],["Sumatra Utara",99,2.1],["Sumatra Barat",100.6,-.9],["Riau",101.8,.5],["Kep. Riau",104.5,.9],["Jambi",102.7,-1.6],["Bengkulu",102.3,-3.5],["Sumatra Selatan",104.2,-3.1],["Bangka Belitung",106.1,-2.3],["Lampung",105.2,-4.9],["Kalimantan Barat",110.5,-.1],["Kalimantan Tengah",113.4,-1.7],["Kalimantan Selatan",115.3,-3],["Kalimantan Timur",116.5,.5],["Kalimantan Utara",116.8,3]];
function thin(a){const k=Math.ceil(a.length/6000);return k>1?a.filter((_,i)=>i%k===0):a}
const lk=()=>($("fkey").value||"").trim()+"|"+(days()<=1?1:5);
function csv(t){const L=t.trim().split("\n"),h=L.shift().split(","),ix=k=>h.indexOf(k),la=ix("latitude"),lo=ix("longitude"),ad=ix("acq_date"),at=ix("acq_time"),cf=ix("confidence"),now=Date.now(),o=[];
 if(la<0||lo<0)throw new Error("format");
 for(const l of L){const c=l.split(","),x=+c[lo],y=+c[la];if(!inID(x,y))continue;
  const tm=(at>=0?c[at]:"0000").padStart(4,"0"),ts=Date.parse(`${c[ad]}T${tm.slice(0,2)}:${tm.slice(2)}:00Z`),age=Math.max(0,Math.floor((now-ts)/864e5)),q=(c[cf]||"").trim().toLowerCase();
  o.push([x,y,isNaN(age)?0:age,q==="h"||+q>=80?"tinggi":q==="l"||(+q>0&&+q<30)?"rendah":"sedang"])}return o}
async function getFire(){
 const d=days(),key=($("fkey").value||"").trim()||DEFAULT_KEY,B=`${BB[0]},${BB[2]},${BB[1]},${BB[3]}`,
 u=key?`https://firms.modaps.eosdis.nasa.gov/api/area/csv/${encodeURIComponent(key)}/VIIRS_SNPP_NRT/${B}/${Math.min(Math.max(d,1),5)}`
  :`https://firms.modaps.eosdis.nasa.gov/data/active_fire/suomi-npp-viirs-c2/csv/SUOMI_VIIRS_C2_South_East_Asia_${d<=1?"24h":"7d"}.csv`;
 const r=await fetch(u,{cache:"no-store",signal:AbortSignal.timeout?AbortSignal.timeout(30000):undefined});
 if(!r.ok)throw new Error("HTTP "+r.status);const o=csv(await r.text());last=lk();return o}
async function getWx(){
 const us=R.flatMap(r=>r.u),q=k=>us.map(u=>u[k]).join(",");
 const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${q(2)}&longitude=${q(1)}&daily=precipitation_sum&past_days=30&forecast_days=1&current=wind_speed_10m&wind_speed_unit=kmh&timezone=Asia%2FJakarta`);
 if(!r.ok)throw new Error("HTTP "+r.status);const j=await r.json();
 return(Array.isArray(j)?j:[j]).map(w=>{const p=w.daily.precipitation_sum;let d=0;for(let k=p.length-2;k>=0&&(p[k]||0)<1;k--)d++;return[d,Math.round(w.current.wind_speed_10m)]})}
function status(msg,cls){$("lstat").textContent=live?"Data langsung":"Mode simulasi";$("ldot").className="dot "+(cls||(live?"on":""));$("lsub").textContent=msg||"";$("lbtn").textContent=live?"Matikan (kembali ke simulasi)":"Aktifkan data langsung";
 $("demo").innerHTML=live&&hasLive?'Titik api: <b>NASA FIRMS (VIIRS S-NPP)</b>, cuaca: <b>Open-Meteo</b>. Peta gambut dan laporan warga masih contoh. Satelit melintas beberapa kali sehari, jadi data FIRMS tertunda sekitar 3 jam, bukan detik demi detik.':'Data di halaman ini adalah <b>contoh simulasi</b> untuk '+R.length+' wilayah gambut di Sumatra dan Kalimantan. Klik <b>Aktifkan data langsung</b> untuk menarik titik api NASA FIRMS dan cuaca Open-Meteo.'}
async function pull(){
 status("Mengambil data…","");$("ldot").className="dot";
 const [a,b]=await Promise.allSettled([getFire(),getWx()]);
 const fo=a.status==="fulfilled",wo=b.status==="fulfilled";
 if(!live)return;
 if(fo){F=a.value;hasLive=true}
 if(wo)b.value.forEach((v,i)=>{const u=R.flatMap(r=>r.u)[i];u[4]=v[0];u[5]=v[1]});
 if(!fo&&!hasLive){live=false;clearInterval(tmr);F=SIMF;score();status("Gagal mengambil titik api ("+a.reason.message+"). Periksa koneksi internet lalu coba lagi. Tampilan kembali ke data simulasi.","err");refresh();nat();return}
 if(fo||wo)upd=new Date();score();
 const t=upd?upd.toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"}):"";
 status(`${t} • titik api ${fo?"✓ "+F.length:"✗ gagal (data lama)"} • cuaca ${wo?"✓":"✗ gagal"}`,fo&&wo?"":"err");
 refresh();nat();if(cur&&sel!==null)pickUnit(sel)}
function sched(){clearInterval(tmr);tmr=setInterval(()=>{if(!document.hidden)pull()},+$("lint").value*6e4)}
$("lbtn").onclick=()=>{
 if(live){live=false;hasLive=false;clearInterval(tmr);F=SIMF;R.forEach(r=>r.u.forEach(u=>{u[4]=u.d4;u[5]=u.d5}));score();status();refresh();nat();return}
 live=true;pull();sched()};
$("lint").onchange=()=>{if(live)sched()};
try{$("fkey").value=localStorage.getItem("gw_key")||""}catch(e){}
$("fkey").onchange=()=>{try{localStorage.setItem("gw_key",$("fkey").value.trim())}catch(e){}if(live)pull()};
function nat(){
 const A=F.filter(f=>f[2]<days()),g=A.filter(f=>R.some(r=>f[0]>=r.b[0]&&f[0]<=r.b[1]&&f[1]>=r.b[2]&&f[1]<=r.b[3])).length,hi=A.filter(f=>f[3]==="tinggi").length,c={};
 A.forEach(f=>{let b,d=1e9;PV.forEach(p=>{const k=km(f[0],f[1],p[1],p[2]);if(k<d){d=k;b=p[0]}});c[b]=(c[b]||0)+1});
 const T=Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,10),m=T.length?T[0][1]:1;
 $("p3").innerHTML=`<h2>Pantauan Sumatra &amp; Kalimantan</h2><div class="msg" style="margin:0 0 8px">${live&&hasLive?"Data langsung":"Data simulasi (hanya "+R.length+" wilayah gambut)"} • ${days()} hari terakhir${live&&upd?" • diperbarui "+upd.toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"}):""}</div>
 <div class="stats" style="margin:0 0 8px"><div class="stat hot"><b>${A.length}</b><span>titik api</span></div><div class="stat"><b>${hi}</b><span>keyakinan tinggi</span></div><div class="stat"><b>${A.length?Math.round(100*g/A.length):0}%</b><span>di wilayah gambut terpantau</span></div></div>
 ${T.map(([n,v])=>`<div class="row" style="cursor:default"><div class="n"><b>${n}</b><div class="bar"><i style="width:${100*v/m}%;background:var(--ember)"></i></div></div><span class="badge" style="background:var(--ember)">${v}</span></div>`).join("")||'<div class="msg">Belum ada titik api pada periode ini.</div>'}
 <p class="formula">Provinsi ditentukan dari titik pusat provinsi terdekat, jadi hanya perkiraan. Filter batas pulau/negara juga kasar, sehingga titik di perbatasan bisa meleset. Titik satelit belum tentu kebakaran.</p>`}
refresh();repList();nat();
