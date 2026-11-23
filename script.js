var KEY="findit.items.v1",items=[];
try{items=JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){items=[]}
if(!items.length){items=[
{id:1,type:"lost",name:"Blue water bottle",cat:"Other",loc:"Gym",desc:"Steel, sticker of a mountain.",contact:"ana@school.edu",claimed:false,at:Date.now()-864e5},
{id:2,type:"found",name:"Student ID",cat:"IDs & cards",loc:"Cafeteria",desc:"Left near the tray rack.",contact:"Guard desk",claimed:false,at:Date.now()-36e5*5}]}
function save(){try{localStorage.setItem(KEY,JSON.stringify(items))}catch(e){}}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function render(){
var q=document.getElementById("q").value.toLowerCase(),ft=document.getElementById("ft").value;
var r=items.filter(function(i){
if(ft==="lost"||ft==="found"){if(i.type!==ft)return false}
if(ft==="open"&&i.claimed)return false;
return (i.name+" "+i.loc+" "+i.desc+" "+i.cat).toLowerCase().indexOf(q)>-1}).sort(function(a,b){return b.at-a.at});
var el=document.getElementById("list");
if(!r.length){el.innerHTML='<div class="empty">No matching reports. Post one above.</div>';return}
el.innerHTML=r.map(function(i){
var done=i.type==="lost"?"Mark recovered":"Mark returned";
return '<div class="item '+i.type+(i.claimed?' claimed':'')+'"><div class="top"><span class="name">'+esc(i.name)+'</span><span class="badge">'+(i.claimed?(i.type==="lost"?"Recovered":"Returned"):(i.type==="lost"?"Lost":"Found"))+'</span></div><div class="meta">'+esc(i.cat)+' · '+esc(i.loc)+' · '+new Date(i.at).toLocaleDateString()+'</div><div>'+esc(i.desc)+'</div><div class="meta">Contact: '+esc(i.contact)+'</div><div class="acts">'+(i.claimed?'':'<button class="ghost" data-a="done" data-id="'+i.id+'">'+done+'</button>')+'<button class="ghost" data-a="del" data-id="'+i.id+'">Delete</button></div></div>'}).join("")}
document.getElementById("f").addEventListener("submit",function(e){
e.preventDefault();
var g=function(id){return document.getElementById(id).value.trim()};
if(!g("name")||!g("loc")||!g("contact")){document.getElementById("err").textContent="Add the item name, the place, and your contact.";return}
document.getElementById("err").textContent="";
items.push({id:Date.now(),type:g("type"),name:g("name"),cat:g("cat"),loc:g("loc"),desc:g("desc"),contact:g("contact"),claimed:false,at:Date.now()});
save();e.target.reset();render()});
document.getElementById("list").addEventListener("click",function(e){
var b=e.target.closest("button");if(!b)return;var id=+b.dataset.id;
if(b.dataset.a==="del")items=items.filter(function(i){return i.id!==id});
else items.forEach(function(i){if(i.id===id)i.claimed=true});
save();render()});
document.getElementById("q").addEventListener("input",render);
document.getElementById("ft").addEventListener("change",render);
render();
