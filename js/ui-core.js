/* MoneyFlow – ui-core.js */
function rH(){var nm=ad?ad.name:"User",ini=nm.charAt(0).toUpperCase(),h=new Date().getHours(),gr=h<12?"Good Morning":h<17?"Good Afternoon":"Good Evening";$("AH").innerHTML='<div class="hl"><div class="hav">'+ini+'</div><div><div class="hg">'+gr+'</div><div class="hn">'+esc(nm)+'</div></div></div><div class="ha"><button class="hb" onclick="sV(\'transactions\')">🔍</button><button class="hb" onclick="oM(\'settings\')">⚙️</button></div>'}

var TABS=[["home","🏠","Home"],["transactions","📊","History"],["reports","📈","Reports"],["budgets","🎯","Budgets"],["itr","📋","ITR"]];
function rN(){var h="";for(var i=0;i<TABS.length;i++){var t=TABS[i];h+='<button class="xnb'+(cV===t[0]?" a":"")+'" onclick="sV(\''+t[0]+'\')"><span class="xni">'+t[1]+'</span><span class="xnl">'+t[2]+'</span></button>'}$("NV").innerHTML=h}
function sV(v){cV=v;sT="";cF="all";catFilter="all";groupFilter="all";dateFrom="";dateTo="";rN();rC()}
function rC(){var e=$("CT");e.scrollTop=0;if(cV==="home")e.innerHTML=rHome();else if(cV==="transactions")e.innerHTML=rTxns();else if(cV==="reports")e.innerHTML=rReports();else if(cV==="budgets")e.innerHTML=rBdg();else if(cV==="itr")e.innerHTML=rITR();else if(cV==="splits")e.innerHTML=rSpl();else if(cV==="recurring")e.innerHTML=rRec()}

function tH(t,d){var c=gC(t.category),ii=t.type==="income",isT=t.type==="transfer";var gtag=c.g==="need"?'<span class="gtag gtag-need">Need</span>':c.g==="want"?'<span class="gtag gtag-want">Want</span>':c.g==="savings"?'<span class="gtag gtag-savings">Savings</span>':"";var amtCol=t.excluded?"#aaa":ii?"#2E7D32":isT?"#1565C0":"#1a1a1a";var sign=ii?"+":isT?"\u21C4 ":"-";var tlabel=isT?'<span class="gtag" style="background:#E3F2FD;color:#1565C0">Transfer</span>':gtag;if(t.excluded)tlabel+='<span class="gtag" style="background:#EEEEEE;color:#999">Not counted</span>';return'<div class="tr" onclick="editT(\''+t.id+'\')" style="cursor:pointer'+(t.excluded?";opacity:.7":"")+'"><div class="ti" style="background:'+c.c+'12">'+c.i+'</div><div class="tf"><div class="tn">'+esc(t.note||c.l)+tlabel+'</div><div class="td">'+esc(t.date)+'</div></div><div class="xta" style="color:'+amtCol+'">'+sign+fF(t.amount)+'</div><div style="color:#ccc;font-size:18px;margin-left:6px;flex-shrink:0">\u203A</div></div>'}

function getNWS(txns){var n=0,w=0,sv=0;txns.forEach(function(t){if(t.type!=="expense"||t.excluded)return;var c=gC(t.category);if(c.g==="need")n+=t.amount;else if(c.g==="want")w+=t.amount;else if(c.g==="savings")sv+=t.amount});return{need:n,want:w,savings:sv}}

function rHome(){
  ensureAccounts();
  var cm=tMo(),mt=D.transactions.filter(function(t){return t.date&&t.date.indexOf(cm)===0});
  var inc=0,exp=0;mt.forEach(function(t){if(t.excluded)return;if(t.type==="income")inc+=t.amount;else if(t.type==="expense")exp+=t.amount});
  var net=inc-exp;
  var bu=D.monthlyBudget>0?Math.min(exp/D.monthlyBudget*100,100):0;
  var dl=new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate()-new Date().getDate();
  var sts=dl>0?Math.max(0,(D.monthlyBudget-exp)/dl):0;
  var nws=getNWS(mt);
  var cd={};mt.forEach(function(t){if(t.type==="expense"&&!t.excluded){cd[t.category]=(cd[t.category]||0)+t.amount}});
  var pie=[];for(var k in cd){var c=gC(k);pie.push({l:c.l,i:c.i,c:c.c,v:cd[k],g:c.g,id:k})}pie.sort(function(a,b){return b.v-a.v});
  var pT=0;pie.forEach(function(p){pT+=p.v});
  var dS="";if(pie.length>0){var R=52,C=2*Math.PI*R,off=0;pie.forEach(function(p){var pc=p.v/pT,da=pc*C,ga=C-da;dS+='<circle cx="70" cy="70" r="'+R+'" fill="none" stroke="'+p.c+'" stroke-width="16" stroke-dasharray="'+da.toFixed(2)+" "+ga.toFixed(2)+'" stroke-dashoffset="'+(-off).toFixed(2)+'" stroke-linecap="round"/>';off+=da})}
  var trend=[];for(var i=5;i>=0;i--){var d=new Date();d.setMonth(d.getMonth()-i);var m=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0");var ti=0,te=0;D.transactions.forEach(function(t){if(t.date&&t.date.indexOf(m)===0&&!t.excluded){if(t.type==="income")ti+=t.amount;else if(t.type==="expense")te+=t.amount}});trend.push({mo:MO[d.getMonth()],ic:ti,ex:te})}
  var mx=1;trend.forEach(function(t){mx=Math.max(mx,t.ic,t.ex)});
  var hT=trend.some(function(t){return t.ic>0||t.ex>0});

  // Upcoming bills (next 7 days)
  var today=new Date(),dayOfMonth=today.getDate();
  var upcoming=D.recurring.filter(function(r){
    var d=Number(r.dayOfMonth)||1;
    return d>=dayOfMonth&&d<=dayOfMonth+7;
  }).sort(function(a,b){return (a.dayOfMonth||1)-(b.dayOfMonth||1)}).slice(0,3);

  var h='<div style="animation:fadeUp .4s ease">';

  // Main summary card (kept, tightened)
  h+='<div class="xsc"><div class="xsp1"></div><div class="xsp2"></div>';
  h+='<div style="opacity:.7;font-size:13px;margin-bottom:4px">Spent in <span style="font-weight:600;opacity:1">'+MO[new Date().getMonth()]+'</span></div>';
  h+='<div class="da" onclick="homeNav(\'expense\')" style="cursor:pointer"><svg class="ds" viewBox="0 0 140 140">'+(pie.length>0?dS:'<circle cx="70" cy="70" r="52" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="16"/>')+'<text x="70" y="64" text-anchor="middle" fill="rgba(255,255,255,.5)" font-size="10">\u2197</text><text x="70" y="84" text-anchor="middle" fill="#fff" font-size="16" font-weight="700" font-family="DM Sans">'+fF(exp)+'</text></svg></div>';
  h+='<div class="xpb">\uD83D\uDEE1 '+bu.toFixed(0)+'% of budget</div>';
  h+='<div class="xss"><div class="xsi" onclick="homeNav(\'income\')" style="cursor:pointer"><div class="xsl">Income</div><div class="xsv xsg">'+fF(inc)+'</div></div>';
  h+='<div class="xsi" onclick="sV(\'budgets\')" style="cursor:pointer"><div class="xsl">Budget</div><div class="xsv">'+fF(D.monthlyBudget)+'</div></div>';
  h+='<div class="xsi"><div class="xsl">Safe/day</div><div class="xsv">'+fm(sts)+'</div></div></div></div>';

  // Glance cards (Net + Needs/Wants/Savings)
  h+='<div class="glance-row">';
  h+='<div class="glance-card" onclick="sV(\'reports\')" style="cursor:pointer"><div class="glance-label">Net</div><div class="glance-val" style="color:'+(net>=0?"#2E7D32":"#E53935")+'">'+(net>=0?"+":"-")+fF(Math.abs(net))+'</div></div>';
  h+='<div class="glance-card" onclick="homeNav(\'need\')" style="cursor:pointer"><div class="glance-label">Needs</div><div class="glance-val" style="color:#2E7D32">'+fF(nws.need)+'</div></div>';
  h+='<div class="glance-card" onclick="homeNav(\'want\')" style="cursor:pointer"><div class="glance-label">Wants</div><div class="glance-val" style="color:#E65100">'+fF(nws.want)+'</div></div>';
  h+='</div>';

  // Accounts strip (Axio-style)
  h+='<div class="sec" style="margin-bottom:12px"><div class="sh" style="margin-bottom:8px"><div class="st" style="margin:0">Accounts</div><button class="xsa" onclick="oM(\'settings\');setTimeout(function(){document.getElementById(\'accSection\')&&document.getElementById(\'accSection\').scrollIntoView()},200)">Manage \u203A</button></div>';
  h+='<div class="acc-strip">';
  getAccounts().forEach(function(a){
    h+='<div class="acc-card" onclick="editAccount(\''+a.id+'\')"><div class="acc-icon">'+a.icon+'</div><div class="acc-name">'+esc(a.name)+'</div><div class="acc-bal">'+fF(a.balance||0)+'</div></div>';
  });
  h+='<div class="acc-card acc-add" onclick="addAccount()"><div style="font-size:22px">+</div><div style="font-size:11px;font-weight:600">Add</div></div>';
  h+='</div></div>';

  // Quick actions
  h+='<div class="qr"><button class="qb" onclick="oM(\'add\');mS.type=\'expense\';rM()"><div class="xqi">\u2197</div><div class="xql">Expense</div></button><button class="qb" onclick="oM(\'add\');mS.type=\'income\';rM()"><div class="xqi">\u2199</div><div class="xql">Income</div></button><button class="qb" onclick="sV(\'budgets\')"><div class="xqi">\uD83C\uDFAF</div><div class="xql">Budgets</div></button><button class="qb" onclick="oM(\'split\')"><div class="xqi">\uD83D\uDC65</div><div class="xql">Split</div></button></div>';

  // Upcoming bills
  if(upcoming.length){
    h+='<div class="sec"><div class="sh"><div class="st">Upcoming Bills</div><button class="xsa" onclick="sV(\'recurring\')">See all \u203A</button></div>';
    upcoming.forEach(function(r){
      var c=gC(r.category);
      h+='<div class="upcom-row"><div class="upcom-day"><b>'+(r.dayOfMonth||1)+'</b>Day</div><div style="flex:1"><div style="font-size:13px;font-weight:600">'+esc(r.name)+'</div><div style="font-size:11px;color:var(--text-muted)">'+c.i+' '+c.l+' · '+r.frequency+'</div></div><div style="font-weight:700;color:#E65100">'+fF(r.amount)+'</div></div>';
    });
    h+='</div>';
  }

  // Categories
  if(pie.length>0){h+='<div class="sec"><div class="sh"><div class="st">Top Categories</div><button class="xsa" onclick="sV(\'budgets\')">See all \u203A</button></div><div class="wc">';pie.slice(0,5).forEach(function(p){var pc=(p.v/pT*100).toFixed(0);var gt=p.g==="need"?"gtag-need":p.g==="want"?"gtag-want":"gtag-savings";h+='<div class="cr" onclick="fltrCat(\''+p.id+'\')" style="cursor:pointer"><div class="xci" style="background:'+p.c+'12">'+p.i+'</div><div style="flex:1"><div class="xcn">'+p.l+' <span class="gtag '+gt+'">'+p.g+'</span></div><div class="bt"><div class="bf" style="width:'+pc+'%;background:'+p.c+'"></div></div></div><div class="xca">'+fF(p.v)+'</div><div style="color:#ccc;font-size:16px;margin-left:4px">\u203A</div></div>'});h+='</div></div>'}

  // Trends
  if(hT){var bars="";trend.forEach(function(t){var ih=Math.max(2,t.ic/mx*80),eh=Math.max(2,t.ex/mx*80);bars+='<div class="xbg"><div class="brs"><div class="xbc" style="height:'+(t.ic?ih:2)+'px;background:#3E277A;opacity:'+(t.ic?.85:.1)+'"></div><div class="xbc" style="height:'+(t.ex?eh:2)+'px;background:#FFB300;opacity:'+(t.ex?.85:.1)+'"></div></div><span class="bm">'+t.mo+'</span></div>'});h+='<div class="sec"><div class="st">Trends</div><div class="bch"><div class="bci">'+bars+'</div><div class="bl"><span><span class="bld" style="background:#3E277A"></span> Income</span><span><span class="bld" style="background:#FFB300"></span> Expense</span></div></div></div>'}

  // Recent
  h+='<div class="sec"><div class="sh"><div class="st">Recent</div><button class="xsa" onclick="sV(\'transactions\')">See all \u203A</button></div>';
  if(!D.transactions.length){
    h+='<div class="emp"><div class="empty-illust">\uD83D\uDCB8</div><div style="font-size:16px;font-weight:600;margin-bottom:8px">Start tracking smarter</div><div class="eps">Tap <strong style="color:#3E277A">+</strong> to add an expense, or share a bank SMS / import PDF from Settings.<br><br>\uD83D\uDCA1 Tip: Link phone + enable notifications for reminders.</div></div>';
  } else {
    D.transactions.slice(0,6).forEach(function(t){h+=tH(t,false)});
  }
  h+='</div></div>';
  return h;
}

function rTxns(){var fl=D.transactions.filter(function(t){
  if(cF==="income"&&t.type!=="income")return false;
  if(cF==="expense"&&t.type!=="expense")return false;
  if(catFilter!=="all"&&t.category!==catFilter)return false;
  if(groupFilter!=="all"&&gC(t.category).g!==groupFilter)return false;
  if(dateFrom&&t.date<dateFrom)return false;
  if(dateTo&&t.date>dateTo)return false;
  if(sT){var s=sT.toLowerCase();if((t.note||"").toLowerCase().indexOf(s)===-1&&gC(t.category).l.toLowerCase().indexOf(s)===-1)return false}
  return true});var gr={};fl.forEach(function(t){var d=t.date||"?";if(!gr[d])gr[d]=[];gr[d].push(t)});var ds=Object.keys(gr).sort(function(a,b){return b.localeCompare(a)});var h='<div class="st">All Transactions</div><input class="xsi2" placeholder="🔍 Search..." value="'+esc(sT)+'" oninput="sT=this.value;rC()"><div class="fr"><button class="fb'+(cF==="all"?" a":"")+'" onclick="cF=\'all\';rC()">All</button><button class="fb'+(cF==="income"?" a":"")+'" onclick="cF=\'income\';rC()">Income</button><button class="fb'+(cF==="expense"?" a":"")+'" onclick="cF=\'expense\';rC()">Expense</button><button class="fb" onclick="toggleFilters()" style="margin-left:auto">\u{1F50D} Filters</button></div><div id="advFilters" style="display:none;background:#fff;border-radius:14px;padding:14px;margin-bottom:10px;box-shadow:0 1px 6px rgba(0,0,0,.04)"><div style="display:flex;gap:8px;margin-bottom:10px"><div style="flex:1"><label style="font-size:11px;color:#888">From</label><input class="inp" type="date" value="'+dateFrom+'" oninput="dateFrom=this.value;rC()" style="margin-top:4px;padding:8px"></div><div style="flex:1"><label style="font-size:11px;color:#888">To</label><input class="inp" type="date" value="'+dateTo+'" oninput="dateTo=this.value;rC()" style="margin-top:4px;padding:8px"></div></div><div><label style="font-size:11px;color:#888">Category</label><select class="inp" onchange="catFilter=this.value;rC()" style="margin-top:4px;padding:8px"><option value="all">All Categories</option>'+CATS.map(function(c){return'<option value="'+c.id+'" '+(catFilter===c.id?"selected":"")+'>'+c.i+' '+c.l+'</option>'}).join("")+'</select></div><button class="fb" onclick="dateFrom=\'\';dateTo=\'\';catFilter=\'all\';groupFilter=\'all\';rC()" style="margin-top:10px;width:100%">Clear All Filters</button></div>';if(!ds.length)h+='<div class="emp"><div class="empty-illust">🔍</div><div style="font-size:15px;font-weight:600;margin-bottom:6px">No transactions match your filters</div><div class="eps">Try adjusting the date range or category filter above.</div></div>';else ds.forEach(function(d){h+='<div class="dh">'+d+'</div>';gr[d].forEach(function(t){h+=tH(t,true)})});return h}
function editT(id){
  var t=null;for(var i=0;i<D.transactions.length;i++)if(D.transactions[i].id===id){t=D.transactions[i];break}
  if(!t)return;
  oM("add");
  mS={type:t.type,category:t.category,amount:t.amount,note:t.note||"",date:t.date,editId:id,tags:t.tags||[],receipt:t.receipt||null,excluded:!!t.excluded};
  rM();
}
function toggleFilters(){var f=document.getElementById("advFilters");if(f)f.style.display=f.style.display==="none"?"block":"none"}
function dT(id){showConfirm("Delete transaction?","This action cannot be undone.",function(){D.transactions=D.transactions.filter(function(t){return t.id!==id});sv();toast("Transaction deleted");cM();rC()},"Delete")}

function rBdg(){var cm=tMo(),mt=D.transactions.filter(function(t){return t.date&&t.date.indexOf(cm)===0});var ts=0,cs={};mt.forEach(function(t){if(t.type==="expense"&&!t.excluded){ts+=t.amount;cs[t.category]=(cs[t.category]||0)+t.amount}});var pc=D.monthlyBudget>0?Math.min(100,ts/D.monthlyBudget*100):0;var nws=getNWS(mt);var ec=eCats();
var h='<div class="st">Budgets</div><div class="bmc"><div class="xsp1"></div><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span style="opacity:.7;font-size:13px">Monthly Budget</span><button style="background:rgba(255,255,255,.15);border:none;color:#fff;font-size:12px;padding:5px 14px;border-radius:8px;cursor:pointer" onclick="eMB()">Edit</button></div><div style="font-size:30px;font-weight:700">'+fF(D.monthlyBudget)+'</div><div class="bt" style="background:rgba(255,255,255,.15);margin-top:12px;height:6px"><div class="bf" style="width:'+pc+'%;background:#FFD54F;height:6px"></div></div><div style="display:flex;justify-content:space-between;margin-top:8px;font-size:12px;opacity:.6"><span>'+fF(ts)+' spent</span><span>'+pc.toFixed(0)+'%</span></div></div>';
h+='<div class="nws-row"><div class="nws-card nws-need"><div class="nws-label">Needs</div><div class="nws-val" style="color:#2E7D32">'+fF(nws.need)+'</div></div><div class="nws-card nws-want"><div class="nws-label">Wants</div><div class="nws-val" style="color:#E65100">'+fF(nws.want)+'</div></div><div class="nws-card nws-savings"><div class="nws-label">Savings</div><div class="nws-val" style="color:#1565C0">'+fF(nws.savings)+'</div></div></div>';
// Group by Need/Want/Savings
["need","want","savings"].forEach(function(grp){var label=grp==="need"?"Needs (Essential)":grp==="want"?"Wants (Lifestyle)":"Savings & Investment";var cats=ec.filter(function(c){return c.g===grp});h+='<div class="st" style="margin-top:16px">'+label+'</div>';cats.forEach(function(cat){var sp=cs[cat.id]||0,bg=D.budgets[cat.id]||0,p=bg>0?Math.min(100,sp/bg*100):0;h+='<div class="cbr" onclick="fltrCat(\''+cat.id+'\');" style="cursor:pointer"><div style="display:flex;align-items:center;gap:10px;margin-bottom:6px"><span style="font-size:18px">'+cat.i+'</span><span style="font-size:13px;font-weight:500;flex:1">'+cat.l+'</span><button class="eb" onclick="eCB(\''+cat.id+'\','+bg+')">'+(bg>0?fF(bg):"Set")+'</button></div>'+(bg>0?'<div class="bt"><div class="bf" style="width:'+p+'%;background:'+(p>90?"#E53935":cat.c)+'"></div></div><div style="color:#aaa;font-size:10px;margin-top:3px">'+fF(sp)+' / '+fF(bg)+'</div>':'')+(bg===0&&sp>0?'<div style="color:#aaa;font-size:10px">'+fF(sp)+' spent</div>':'')+'</div>'});
});return h}
function fltrCat(catId){cV='transactions';cF='all';catFilter=catId;groupFilter='all';sT='';dateFrom='';dateTo='';rN();rC();}
function eMB(){var v=window.prompt?window.prompt("Monthly budget (\u20B9):",D.monthlyBudget):null;if(v===null){var inp=document.createElement("input");inp.type="number";inp.value=D.monthlyBudget;inp.placeholder="Monthly budget";inp.style.cssText="width:100%;padding:12px;border:1.5px solid #6A4BBC;border-radius:12px;font-size:16px;margin:8px 0";var wrap=document.createElement("div");wrap.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:999;display:flex;align-items:center;justify-content:center;padding:20px";var card=document.createElement("div");card.style.cssText="background:#fff;border-radius:20px;padding:24px;width:100%;max-width:340px";card.innerHTML="<div style='font-weight:700;font-size:16px;margin-bottom:8px'>Monthly Budget (\u20B9)</div>";card.appendChild(inp);var btn=document.createElement("button");btn.textContent="Save";btn.style.cssText="width:100%;padding:12px;background:linear-gradient(135deg,#3E277A,#6A4BBC);color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:700;margin-top:8px;cursor:pointer";btn.onclick=function(){D.monthlyBudget=Number(inp.value)||0;sv();rC();document.body.removeChild(wrap)};wrap.appendChild(card);document.body.appendChild(wrap);setTimeout(function(){inp.focus()},100);return}D.monthlyBudget=Number(v)||0;sv();rC()}
function eCB(id,c){var v=window.prompt?window.prompt(gC(id).l+" budget (\u20B9):",c):null;if(v===null){var inp=document.createElement("input");inp.type="number";inp.value=c;inp.placeholder="Budget amount";inp.style.cssText="width:100%;padding:12px;border:1.5px solid #6A4BBC;border-radius:12px;font-size:16px;margin:8px 0";var wrap=document.createElement("div");wrap.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:999;display:flex;align-items:center;justify-content:center;padding:20px";var card=document.createElement("div");card.style.cssText="background:#fff;border-radius:20px;padding:24px;width:100%;max-width:340px";card.innerHTML="<div style='font-weight:700;font-size:16px;margin-bottom:8px'>"+gC(id).l+" Budget (\u20B9)</div>";card.appendChild(inp);var btn=document.createElement("button");btn.textContent="Save";btn.style.cssText="width:100%;padding:12px;background:linear-gradient(135deg,#3E277A,#6A4BBC);color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:700;margin-top:8px;cursor:pointer";btn.onclick=function(){D.budgets[id]=Number(inp.value)||0;sv();rC();document.body.removeChild(wrap)};wrap.appendChild(card);document.body.appendChild(wrap);setTimeout(function(){inp.focus()},100);return}D.budgets[id]=Number(v)||0;sv();rC()}

function rSpl(){var h='<div class="sh"><div class="st" style="margin-bottom:0">Split Bills</div><button class="ab" onclick="oM(\'split\')">+ New Split</button></div>';if(!D.splits.length)h+='<div class="emp"><div class="epi">👥</div><div>No splits yet</div></div>';else D.splits.forEach(function(s){var pp=fF(s.total/s.people.length);h+='<div class="xspc"><div style="display:flex;justify-content:space-between;align-items:start"><div><div style="font-weight:600;font-size:15px">'+esc(s.title)+'</div><div style="color:#aaa;font-size:12px;margin-top:2px">Total: '+fF(s.total)+'</div></div><button class="dl" onclick="dS(\''+s.id+'\')">×</button></div><div style="margin-top:10px">';s.people.forEach(function(p){h+='<div class="xsp"><div class="xsav">'+(p.name[0]||"?").toUpperCase()+'</div><span style="color:#666;font-size:13px;flex:1">'+esc(p.name)+'</span><span style="color:#E64A19;font-size:13px;font-weight:600">'+pp+'</span></div>'});h+='</div></div>'});return h}
function dS(id){D.splits=D.splits.filter(function(s){return s.id!==id});sv();toast("Deleted");rC()}

function rRec(){var h='<div class="sh"><div class="st" style="margin-bottom:0">Recurring Bills</div><button class="ab" onclick="oM(\'recurring\')">+ Add Bill</button></div>';if(!D.recurring.length)h+='<div class="emp"><div class="epi">🔄</div><div>No recurring bills</div></div>';else D.recurring.forEach(function(r){var c=gC(r.category);h+='<div class="xrc"><div style="display:flex;align-items:center;gap:12px"><div class="ti" style="background:'+c.c+'12">'+c.i+'</div><div style="flex:1"><div style="font-weight:600">'+esc(r.name)+'</div><div style="color:#aaa;font-size:12px">'+r.frequency+' - Day '+r.dayOfMonth+'</div></div><div style="font-weight:700;font-size:15px;color:#E64A19">'+fF(r.amount)+'</div><button class="dl" onclick="dR(\''+r.id+'\')">×</button></div></div>'});return h}
function dR(id){D.recurring=D.recurring.filter(function(r){return r.id!==id});sv();toast("Deleted");rC()}

function rReports(){
  var now=new Date();
  var thisMonth=getMonthData(now.getFullYear(),now.getMonth());
  var lastMonthDate=new Date(now.getFullYear(),now.getMonth()-1,1);
  var lastMonth=getMonthData(lastMonthDate.getFullYear(),lastMonthDate.getMonth());
  var changeExp=lastMonth.exp>0?((thisMonth.exp-lastMonth.exp)/lastMonth.exp*100):0;
  var changeInc=lastMonth.inc>0?((thisMonth.inc-lastMonth.inc)/lastMonth.inc*100):0;
  var dayAvg=getDayAvg(thisMonth.txns);
  var topMerchants=getTopMerchants(thisMonth.txns,5);
  var savings=thisMonth.inc-thisMonth.exp;
  var savingsRate=thisMonth.inc>0?(savings/thisMonth.inc*100):0;
  
  var h='<div style="animation:fadeUp .4s ease"><div class="st">Reports - '+MO[now.getMonth()]+' '+now.getFullYear()+'</div>';
  
  // Stats grid
  h+='<div class="stat-grid">';
  h+='<div class="stat-card"><div class="stat-label">Spent</div><div class="stat-value" style="color:#E53935">'+fF(thisMonth.exp)+'</div><div class="stat-change '+(changeExp>0?"stat-up":"stat-down")+'">'+(changeExp>0?"\u2191":"\u2193")+' '+Math.abs(changeExp).toFixed(0)+'% vs last month</div></div>';
  h+='<div class="stat-card"><div class="stat-label">Earned</div><div class="stat-value" style="color:#2E7D32">'+fF(thisMonth.inc)+'</div><div class="stat-change '+(changeInc>=0?"stat-down":"stat-up")+'">'+(changeInc>=0?"\u2191":"\u2193")+' '+Math.abs(changeInc).toFixed(0)+'% vs last month</div></div>';
  h+='<div class="stat-card"><div class="stat-label">Saved</div><div class="stat-value" style="color:'+(savings>=0?"#1565C0":"#E53935")+'">'+fF(savings)+'</div><div class="stat-change">'+savingsRate.toFixed(0)+'% of income</div></div>';
  h+='<div class="stat-card"><div class="stat-label">Daily Avg</div><div class="stat-value">'+fF(dayAvg)+'</div><div class="stat-change">'+thisMonth.txns.filter(function(t){return t.type==="expense"}).length+' transactions</div></div>';
  h+='</div>';
  
  // 50/30/20 Rule
  h+='<div class="report-card"><div style="font-weight:700;font-size:14px;margin-bottom:12px">50/30/20 Rule Check</div>';
  if(thisMonth.exp>0){
    var totalSpent=thisMonth.exp;
    var needPct=thisMonth.nws.need/totalSpent*100;
    var wantPct=thisMonth.nws.want/totalSpent*100;
    var savPct=thisMonth.nws.savings/totalSpent*100;
    h+='<div class="report-bar"><div class="report-bar-name">Needs</div><div class="report-bar-track"><div class="report-bar-fill" style="width:'+needPct+'%;background:#2E7D32"></div></div><div class="report-bar-val">'+needPct.toFixed(0)+'%</div></div>';
    h+='<div class="report-bar"><div class="report-bar-name">Wants</div><div class="report-bar-track"><div class="report-bar-fill" style="width:'+wantPct+'%;background:#E65100"></div></div><div class="report-bar-val">'+wantPct.toFixed(0)+'%</div></div>';
    h+='<div class="report-bar"><div class="report-bar-name">Savings</div><div class="report-bar-track"><div class="report-bar-fill" style="width:'+savPct+'%;background:#1565C0"></div></div><div class="report-bar-val">'+savPct.toFixed(0)+'%</div></div>';
    h+='<div style="font-size:11px;color:var(--text-muted);margin-top:10px">Ideal: 50% Needs, 30% Wants, 20% Savings</div>';
  }else{h+='<div style="color:#aaa;text-align:center;padding:10px">No expenses this month</div>'}
  h+='</div>';
  
  // Top Merchants
  if(topMerchants.length){
    h+='<div class="report-card"><div style="font-weight:700;font-size:14px;margin-bottom:12px">Top 5 Merchants</div>';
    var max=topMerchants[0].amt;
    topMerchants.forEach(function(m,i){
      var p=(m.amt/max*100);
      h+='<div class="report-bar"><div class="report-bar-name">'+esc(m.name.slice(0,12))+'</div><div class="report-bar-track"><div class="report-bar-fill" style="width:'+p+'%;background:linear-gradient(90deg,#3E277A,#6A4BBC)"></div></div><div class="report-bar-val">'+fF(m.amt)+'</div></div>';
    });
    h+='</div>';
  }
  
  // Tags overview
  var allTags=getAllTags();
  if(allTags.length){
    h+='<div class="report-card"><div style="font-weight:700;font-size:14px;margin-bottom:12px">Your Tags</div><div>';
    allTags.slice(0,15).forEach(function(t){h+='<span class="tag" style="font-size:12px;padding:4px 12px;margin:3px">#'+esc(t)+'</span>'});
    h+='</div></div>';
  }
  
  // Premium teaser
  if(!isPremium()){
    h+='<div class="report-card" style="background:linear-gradient(135deg,#FFD700,#FFA000);color:#000;cursor:pointer" onclick="showPremiumModal()"><div style="display:flex;align-items:center;gap:10px"><div style="font-size:28px">\u{1F48E}</div><div style="flex:1"><div style="font-weight:700;font-size:14px">Get Premium</div><div style="font-size:11px;opacity:.8">Unlimited features for \u20B999/year</div></div><div style="font-size:18px">\u203A</div></div></div>';
  }
  
  return h+'</div>';
}



// ===== ITR DATA STRUCTURE =====
// D.itrData = { fyData: {...}, earnings: [...], cashback: [...], locked: true }
// D.itrFile = { url, uploadedAt, fileName }

var ITR_SUBTAB = "summary"; // summary | earnings | cashback | add
var itrUnlocked = false;

function getITRData(){if(!D.itrData)D.itrData={fyData:{},earnings:[],cashback:[],locked:true};return D.itrData}

// ===== FIREBASE STORAGE UPLOAD =====
function uploadITRFile(){
  var inp=document.createElement("input");
  inp.type="file";inp.accept=".xlsx,.xls";
  inp.onchange=function(e){
    var file=e.target.files[0];if(!file)return;
    if(file.size>5*1024*1024){toast("File too large (max 5MB)");return}
    // Parse the file locally FIRST — the user sees their data even if cloud backup fails
    parseITRFile(file);
    // Then attempt a cloud backup in the background (non-blocking)
    if(fbOk&&uid&&storage){
      try{
        var path="users/"+uid+"/itr/"+file.name;
        var ref=storage.ref(path);
        ref.put(file).then(function(snap){
          return snap.ref.getDownloadURL();
        }).then(function(url){
          D.itrFile={url:url,uploadedAt:Date.now(),fileName:file.name,path:path};
          sv();rC();
        }).catch(function(err){
          D.itrFile={fileName:file.name,uploadedAt:Date.now(),localOnly:true};
          sv();
          toast("Data parsed. Cloud backup unavailable.");
          console.warn("ITR cloud backup failed:",err&&err.message);
        });
      }catch(err){
        D.itrFile={fileName:file.name,uploadedAt:Date.now(),localOnly:true};
        sv();
      }
    }else{
      D.itrFile={fileName:file.name,uploadedAt:Date.now(),localOnly:true};
      sv();
    }
  };
  inp.click();
}

function fetchITRFromCloud(){
  if(!D.itrFile||!D.itrFile.url||!storage){toast("No file uploaded");return}
  toast("Fetching from cloud...");
  fetch(D.itrFile.url).then(function(res){return res.blob()}).then(function(blob){
    parseITRFile(blob);
  }).catch(function(e){toast("Fetch failed: "+e.message)});
}

function deleteITRFile(){
  if(!D.itrFile){toast("No file to delete");return}
  if(!confirm("Delete uploaded Excel file?"))return;
  if(D.itrFile.path&&storage){
    storage.ref(D.itrFile.path).delete().catch(function(){});
  }
  D.itrFile=null;D.itrData={fyData:{},earnings:[],cashback:[],locked:true};
  sv();toast("Deleted");rC();
}

// ===== EXCEL PARSER =====
function parseITRFile(file){
  if(!window.XLSX){toast("Excel library not loaded");return}
  var reader=new FileReader();
  reader.onload=function(e){
    try{
      var data=new Uint8Array(e.target.result);
      var wb=XLSX.read(data,{type:"array"});
      var parsed={fyData:{},earnings:[],cashback:[],locked:true};
      
      wb.SheetNames.forEach(function(sn){
        var ws=wb.Sheets[sn];
        var rows=XLSX.utils.sheet_to_json(ws,{header:1,raw:true,defval:""});
        var lower=sn.toLowerCase();
        
        if(lower.indexOf("earning")>-1||lower.indexOf("expense")>-1){
          parsed.earnings=parseEarningsSheet(rows,ws);
        }else if(lower.indexOf("cashback")>-1||lower.indexOf("paytm")>-1||lower.indexOf("card")>-1){
          parsed.cashback=parseCashbackSheet(rows);
        }else{
          // Treat as FY data sheet
          var fyData=parseFYSheet(rows,ws,sn);
          Object.assign(parsed.fyData,fyData);
        }
      });
      
      D.itrData=parsed;
      sv();
      toast("Parsed "+Object.keys(parsed.fyData).length+" FYs, "+parsed.earnings.length+" years, "+parsed.cashback.length+" months");
      rC();
    }catch(err){
      toast("Parse error: "+err.message);
      console.error(err);
    }
  };
  if(file instanceof Blob)reader.readAsArrayBuffer(file);
  else reader.readAsArrayBuffer(file);
}

// Parse FY sheet (Fin. Year 2024-25 style)
function parseFYSheet(rows,ws,sheetName){
  var fys={};var currentFY=null;
  var mode=null; // income | deduction
  
  for(var i=0;i<rows.length;i++){
    var r=rows[i];var r0=(r[0]||"").toString().trim();
    
    // Detect FY header
    var fyMatch=r0.match(/Financial\s*Year\s*(\d{4})[-\s]*(\d{2,4})/i)||r0.match(/FY\s*(\d{4})[-\s]*(\d{2,4})/i)||r0.match(/(\d{4})[-\s]*(\d{2,4})\s*(?:FY|Tax|Year)/i);
    if(fyMatch){
      var y1=fyMatch[1];var y2=fyMatch[2].length===2?fyMatch[2]:fyMatch[2].slice(-2);
      currentFY=y1+"-"+y2;
      fys[currentFY]={fy:currentFY,incomes:[],exemptions:[],deductions:[],totals:{},hra:{},notes:""};
      continue;
    }
    
    if(!currentFY)continue;
    var fy=fys[currentFY];
    
    // Skip header rows
    if(r0.toLowerCase()==="period"||r0.toLowerCase().indexOf("total")===0){
      if(r0.toLowerCase().indexOf("total")===0){
        fy.totals.income=parseNum(r[1]);
        fy.totals.exemption=parseNum(r[2]);
        fy.totals.deduction=parseNum(r[11])||parseNum(r[4]);
      }
      continue;
    }
    if(r0.toLowerCase().indexOf("taxable")===0){
      fy.totals.taxable=parseNum(r[1]);continue;
    }
    if(r0.toLowerCase().indexOf("hra")===0){
      fy.hra.claim=parseNum(r[3]);continue;
    }
    
    // Income rows (Salary JPFL, Mutual Fund Interest, etc.)
    if(r0&&(r[1]||r[2])){
      var income=parseNum(r[1]);
      var exempt=parseNum(r[2]);
      if(income>0){
        var note=getCellNote(ws,i+1,0)||getCellNote(ws,i+1,1);
        fy.incomes.push({period:r0,amount:income,source:r0,note:note});
      }
    }
    
    // Exemption entries (Section + Head columns)
    if(r[3]&&r[4]){
      var sec=(r[3]||"").toString().trim();
      var head=(r[4]||"").toString().trim();
      if(sec&&head){
        var note=getCellNote(ws,i+1,4);
        fy.exemptions.push({section:sec,head:head,amount:parseNum(r[2]),note:note});
      }
    }
    
    // Deduction entries (columns L=11, M=12, N=13)
    if(r[12]&&r[13]){
      var dsec=(r[12]||"").toString().trim();
      var scheme=(r[13]||"").toString().trim();
      var damt=parseNum(r[11]);
      if(dsec){
        fy.deductions.push({section:dsec,scheme:scheme,amount:damt,note:""});
      }
    }
  }
  return fys;
}

// Parse Earnings sheet (lifetime 1994-2026)
function parseEarningsSheet(rows,ws){
  var out=[];
  for(var i=0;i<rows.length;i++){
    var r=rows[i];
    var year=parseNum(r[0]);
    if(!year||year<1990||year>2050)continue;
    out.push({
      year:year,
      fyPeriod:(r[1]||"").toString(),
      workPeriod:(r[2]||"").toString(),
      earnedActual:parseNum(r[3]),
      earnedInflation:parseNum(r[4]),
      source:(r[5]||"").toString(),
      itrFilled:(r[6]||"").toString(),
      gaveHomeActual:parseNum(r[7]),
      gaveHomeInflation:parseNum(r[8]),
      loanActual:parseNum(r[9]),
      loanInflation:parseNum(r[10]),
      savingsActual:parseNum(r[11]),
      expenseActual:parseNum(r[12]),
      expenseInflation:parseNum(r[13]),
      note:getCellNote(ws,i+1,7)||getCellNote(ws,i+1,3)||getCellNote(ws,i+1,9)||getCellNote(ws,i+1,11)
    });
  }
  return out;
}

// Parse cashback sheet
function parseCashbackSheet(rows){
  var out=[];
  for(var i=1;i<rows.length;i++){
    var r=rows[i];
    if(!r[0])continue;
    var d=null;
    // SheetJS raw:true returns Date objects for date cells
    if(r[0] instanceof Date){
      d=r[0];
    } else {
      // Fallback: try parsing string
      var s=""+r[0];
      if(s.toLowerCase().indexOf("total")>-1||s.toLowerCase().indexOf("month")>-1)continue;
      // Handle Excel serial number (44743 = days since 1899-12-30)
      var serial=parseFloat(s);
      if(!isNaN(serial)&&serial>40000&&serial<50000){
        d=new Date(Math.round((serial-25569)*86400*1000));
      } else {
        d=new Date(s);
      }
    }
    if(!d||isNaN(d.getTime()))continue;
    var earned=parseNum(r[1]);
    if(!earned)continue;
    out.push({
      month:d.toISOString().slice(0,7),
      monthLabel:d.toLocaleDateString("en-IN",{year:"numeric",month:"short"}),
      earned:earned,
      charges:parseNum(r[2]),
      rentCharges:parseNum(r[3]),
      net:parseNum(r[4])
    });
  }
  return out.sort(function(a,b){return b.month.localeCompare(a.month)});
}

function parseNum(v){if(v===null||v===undefined||v==="")return 0;if(typeof v==="number")return v;if(v instanceof Date)return 0;var s=""+v;if(s.charAt(0)==="="){var expr=s.slice(1);if(/^[\d+\-*/.() ]+$/.test(expr)){try{var r=parseFloat(Function("return "+expr)());if(!isNaN(r))return r}catch(e){}}return 0;}var n=parseFloat(s.replace(/[, \u20B9]/g,""));return isNaN(n)?0:n}
function getCellNote(ws,row,col){
  try{
    var addr=XLSX.utils.encode_cell({r:row,c:col});
    var cell=ws[addr];
    if(cell&&cell.c&&cell.c.length){return cell.c.map(function(x){return x.t}).join(" ")}
  }catch(e){}
  return "";
}

// ===== HRA CALCULATOR =====
function calcHRA(basic,hraReceived,rentPaid,isMetro){
  if(!basic||!rentPaid)return 0;
  var pct=isMetro?0.5:0.4;
  var actual=hraReceived||0;
  var pctBasic=basic*pct;
  var rentMinus10=rentPaid-(basic*0.1);
  if(rentMinus10<0)rentMinus10=0;
  return Math.min(actual,pctBasic,rentMinus10);
}

// ===== ITR RENDER =====
