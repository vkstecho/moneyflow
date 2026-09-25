/* MoneyFlow – ui-itr.js */
function rITR(){
  // Check PIN lock
  if((isPinSet()||isBiometricEnabled())&&!itrUnlocked){
    return renderITRLock();
  }
  
  var h='<div style="animation:fadeUp .4s ease">';
  
  // File upload/status bar
  h+='<div class="sh"><div class="st" style="margin-bottom:0">Tax & Earnings</div>';
  if(D.itrFile){
    h+='<button class="ab" style="background:#E8F5E9;color:#2E7D32" onclick="document.getElementById(\'itrMenu\').classList.toggle(\'hidden\')">\u{1F4CE} File \u25BE</button></div>';
    h+='<div id="itrMenu" class="hidden" style="background:var(--card);border-radius:12px;padding:10px;margin-bottom:10px;box-shadow:0 4px 12px var(--shadow)"><div style="font-size:11px;color:var(--text-muted);margin-bottom:6px">'+esc(D.itrFile.fileName)+'</div><button class="eb" style="margin:2px" onclick="fetchITRFromCloud()">\u{1F504} Re-parse</button><button class="eb" style="margin:2px" onclick="uploadITRFile()">\u{1F4E4} Replace</button><button class="eb" style="margin:2px;background:#FFEBEE;color:#E53935" onclick="deleteITRFile()">\u{1F5D1}\uFE0F Delete</button></div>';
  }else{
    h+='<button class="ab" onclick="uploadITRFile()">\u{1F4E4} Upload Excel</button></div>';
    h+='<div class="itr-upload-zone" onclick="uploadITRFile()"><div style="font-size:48px;margin-bottom:8px">\u{1F4CA}</div><div style="font-weight:700;color:#3E277A;margin-bottom:4px">Upload Your ITR Excel</div><div style="font-size:12px;color:var(--text-muted)">Safely stored in Firebase. Tap to browse.</div></div>';
  }
  
  var data=getITRData();
  var fys=Object.keys(data.fyData||{}).sort().reverse();
  
  // Sub-tabs
  if(fys.length||data.earnings.length||data.cashback.length){
    h+='<div class="itr-sub-tabs">';
    h+='<button class="itr-sub-tab'+(ITR_SUBTAB==="summary"?" a":"")+'" onclick="ITR_SUBTAB=\'summary\';rC()">\u{1F4CB} ITR ('+fys.length+')</button>';
    h+='<button class="itr-sub-tab'+(ITR_SUBTAB==="earnings"?" a":"")+'" onclick="ITR_SUBTAB=\'earnings\';rC()">\u{1F4C8} Lifetime ('+data.earnings.length+')</button>';
    h+='<button class="itr-sub-tab'+(ITR_SUBTAB==="cashback"?" a":"")+'" onclick="ITR_SUBTAB=\'cashback\';rC()">\u{1F4B3} Cards ('+data.cashback.length+')</button>';
    h+='<button class="itr-sub-tab'+(ITR_SUBTAB==="hra"?" a":"")+'" onclick="ITR_SUBTAB=\'hra\';rC()">\u{1F3E0} HRA Calc</button>';
    h+='</div>';
  }
  
  if(ITR_SUBTAB==="summary")h+=renderITRSummary(fys,data);
  else if(ITR_SUBTAB==="earnings")h+=renderEarnings(data.earnings);
  else if(ITR_SUBTAB==="cashback")h+=renderCashback(data.cashback);
  else if(ITR_SUBTAB==="hra")h+=renderHRACalc();
  
  return h+'</div>';
}

function renderITRLock(){
  var bioAvail=isBiometricSupported()&&isBiometricEnabled();
  var pinAvail=isPinSet();
  var h='<div class="itr-lock-screen">';
  h+='<div class="itr-lock-icon">\u{1F512}</div>';
  h+='<div class="itr-lock-title">Private Section</div>';
  h+='<div class="itr-lock-sub">Your tax & earnings data is protected.<br>Verify to continue.</div>';
  if(bioAvail){
    h+='<button class="xbtn xbp" style="max-width:280px;margin:0 auto 10px" onclick="unlockITRBio()">\u{1F510} Unlock with Fingerprint</button>';
  }
  if(pinAvail){
    h+='<button class="xbtn xbo" style="max-width:280px;margin:0 auto" onclick="unlockITR()">\u{1F522} Unlock with PIN</button>';
  }
  if(!bioAvail&&!pinAvail){
    h+='<div style="color:var(--text-muted);font-size:13px;margin:16px 0">No lock set up yet.</div>';
    h+='<button class="xbtn xbp" style="max-width:280px;margin:0 auto" onclick="itrUnlocked=true;rC()">Continue without lock</button>';
  }
  h+='</div>';
  return h;
}

function unlockITRBio(){
  if(!isBiometricSupported()||!isBiometricEnabled()){toast("Fingerprint not set up");return}
  var idArr=JSON.parse(localStorage.getItem("mf_bio_id"));
  var challenge=new Uint8Array(32);crypto.getRandomValues(challenge);
  navigator.credentials.get({
    publicKey:{
      challenge:challenge,
      allowCredentials:[{id:new Uint8Array(idArr),type:"public-key"}],
      userVerification:"required",
      timeout:60000
    }
  }).then(function(){
    itrUnlocked=true;toast("Unlocked");rC();
  }).catch(function(){toast("Verification failed")});
}

function unlockITR(){
  if(!isPinSet()){itrUnlocked=true;rC();return}
  verifyPin(function(){itrUnlocked=true;rC()});
}

function renderITRSummary(fys,data){
  if(!fys.length){
    return '<div class="emp"><div class="empty-illust">\u{1F4CB}</div><div style="font-size:15px;font-weight:600">No FY data yet</div><div class="eps">Upload your ITR Excel to see year-wise summaries</div></div>';
  }
  var h="";
  fys.forEach(function(fy){
    var d=data.fyData[fy];
    var totalInc=d.totals.income||d.incomes.reduce(function(s,i){return s+i.amount},0);
    var totalEx=d.totals.exemption||0;
    var totalDed=d.totals.deduction||0;
    var taxable=d.totals.taxable||(totalInc-totalEx-totalDed);
    
    h+='<div class="fy-card"><div class="sp"></div>';
    h+='<div class="fy-label">Financial Year</div>';
    h+='<div class="fy-year">FY '+fy+'</div>';
    h+='<div style="font-size:12px;opacity:.6">'+d.incomes.length+' income sources</div>';
    h+='<div class="fy-grid">';
    h+='<div class="fy-stat"><div class="fy-stat-label">Gross Income</div><div class="fy-stat-val" style="color:#81C784">'+fF(totalInc)+'</div></div>';
    h+='<div class="fy-stat"><div class="fy-stat-label">Exemptions</div><div class="fy-stat-val" style="color:#FFB74D">'+fF(totalEx)+'</div></div>';
    h+='<div class="fy-stat"><div class="fy-stat-label">Deductions</div><div class="fy-stat-val" style="color:#4FC3F7">'+fF(totalDed)+'</div></div>';
    h+='<div class="fy-stat"><div class="fy-stat-label">Taxable Income</div><div class="fy-stat-val" style="color:#FFD54F">'+fF(taxable)+'</div></div>';
    h+='</div></div>';
    
    // Income Details
    if(d.incomes.length){
      h+='<div class="itr-card"><div style="font-weight:700;font-size:14px;margin-bottom:10px">\u{1F4B0} Income Sources</div>';
      d.incomes.forEach(function(i){
        h+='<div class="itr-income-row"><div style="flex:1"><div class="itr-income-period">'+esc(i.period)+'</div>';
        if(i.note)h+='<div class="itr-income-note">\u{1F4DD} '+esc(i.note.slice(0,80))+'</div>';
        h+='</div><div class="itr-income-amt">'+fF(i.amount)+'</div></div>';
      });
      h+='</div>';
    }
    
    // Exemptions
    if(d.exemptions.length){
      h+='<div class="itr-card"><div style="font-weight:700;font-size:14px;margin-bottom:10px">\u{1F4DD} Exemptions</div>';
      d.exemptions.forEach(function(e){
        h+='<div class="itr-exempt-row"><span class="itr-section-label">'+esc(e.section)+'</span><div style="font-size:13px;font-weight:600;margin-top:2px">'+esc(e.head)+'</div>';
        if(e.amount)h+='<div style="font-size:12px;color:#E65100;font-weight:700">'+fF(e.amount)+'</div>';
        if(e.note)h+='<div class="itr-note-expand">'+esc(e.note)+'</div>';
        h+='</div>';
      });
      h+='</div>';
    }
    
    // Deductions
    if(d.deductions.length){
      h+='<div class="itr-card"><div style="font-weight:700;font-size:14px;margin-bottom:10px">\u{1F4B8} Deductions</div>';
      d.deductions.forEach(function(e){
        h+='<div class="itr-deduct-row"><span class="itr-section-label" style="background:rgba(46,125,50,.1);color:#2E7D32">'+esc(e.section)+'</span><div style="font-size:13px;font-weight:600;margin-top:2px">'+esc(e.scheme)+'</div>';
        if(e.amount)h+='<div style="font-size:12px;color:#2E7D32;font-weight:700">'+fF(e.amount)+'</div>';
        h+='</div>';
      });
      h+='</div>';
    }
    
    // Tax Calculation Summary
    h+='<div class="itr-calc-card"><div style="font-weight:700;font-size:14px;margin-bottom:10px;opacity:.9">\u{1F9EE} Calculation</div>';
    h+='<div class="itr-calc-row"><span style="opacity:.7">Gross Income</span><span>'+fF(totalInc)+'</span></div>';
    h+='<div class="itr-calc-row"><span style="opacity:.7">(-) Exemptions</span><span>'+fF(totalEx)+'</span></div>';
    h+='<div class="itr-calc-row"><span style="opacity:.7">(-) Deductions</span><span>'+fF(totalDed)+'</span></div>';
    h+='<div class="itr-calc-row total"><span>Taxable Income</span><span>'+fF(taxable)+'</span></div>';
    if(d.hra&&d.hra.claim){
      h+='<div style="font-size:11px;opacity:.6;margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.2)">HRA Claim: '+fF(d.hra.claim)+'</div>';
    }
    h+='</div>';
  });
  return h;
}

function renderEarnings(earnings){
  if(!earnings.length){
    return '<div class="emp"><div class="empty-illust">\u{1F4C8}</div><div style="font-size:15px;font-weight:600">No earnings timeline yet</div><div class="eps">Upload your Excel to see lifetime journey</div></div>';
  }
  var totalEarned=0,totalInflated=0;
  earnings.forEach(function(e){totalEarned+=e.earnedActual;totalInflated+=e.earnedInflation});
  
  var h='<div class="fy-card"><div class="sp"></div>';
  h+='<div class="fy-label">Lifetime Earnings</div>';
  h+='<div class="fy-year">'+earnings.length+' years tracked</div>';
  h+='<div class="fy-grid">';
  h+='<div class="fy-stat"><div class="fy-stat-label">Total Earned (Actual)</div><div class="fy-stat-val" style="color:#81C784">'+fF(totalEarned)+'</div></div>';
  h+='<div class="fy-stat"><div class="fy-stat-label">Inflation Adjusted</div><div class="fy-stat-val" style="color:#FFD54F">'+fF(totalInflated)+'</div></div>';
  h+='</div></div>';
  
  earnings.sort(function(a,b){return b.year-a.year}).forEach(function(e){
    var yearShort=(""+e.year).slice(-2);
    h+='<div class="timeline-card"><div class="timeline-year">'+yearShort+'</div>';
    h+='<div class="timeline-period">'+esc(e.workPeriod||e.fyPeriod||e.year)+'</div>';
    if(e.source)h+='<div class="timeline-source">\u{1F4BC} '+esc(e.source)+'</div>';
    if(e.itrFilled)h+='<div class="timeline-source">\u{1F4CB} ITR: '+esc(e.itrFilled)+'</div>';
    h+='<div class="timeline-grid">';
    if(e.earnedActual)h+='<div class="timeline-stat"><div class="timeline-stat-label">Earned</div><div class="timeline-stat-val" style="color:#2E7D32">'+fF(e.earnedActual)+'</div></div>';
    if(e.gaveHomeActual)h+='<div class="timeline-stat"><div class="timeline-stat-label">Home</div><div class="timeline-stat-val" style="color:#FF9800">'+fF(e.gaveHomeActual)+'</div></div>';
    if(e.savingsActual)h+='<div class="timeline-stat"><div class="timeline-stat-label">Saved</div><div class="timeline-stat-val" style="color:#1565C0">'+fF(e.savingsActual)+'</div></div>';
    h+='</div>';
    if(e.note)h+='<div class="itr-note-expand">'+esc(e.note)+'</div>';
    h+='</div>';
  });
  return h;
}

function renderCashback(cb){
  if(!cb.length){
    return '<div class="emp"><div class="empty-illust">\u{1F4B3}</div><div style="font-size:15px;font-weight:600">No cashback data yet</div></div>';
  }
  var totalEarned=0,totalCharges=0,totalNet=0;
  cb.forEach(function(c){totalEarned+=c.earned;totalCharges+=c.charges;totalNet+=c.net});
  
  var h='<div class="fy-card"><div class="sp"></div>';
  h+='<div class="fy-label">Cashback Card</div>';
  h+='<div class="fy-year">'+cb.length+' months</div>';
  h+='<div class="fy-grid">';
  h+='<div class="fy-stat"><div class="fy-stat-label">Total Earned</div><div class="fy-stat-val" style="color:#81C784">'+fF(totalEarned)+'</div></div>';
  h+='<div class="fy-stat"><div class="fy-stat-label">Charges</div><div class="fy-stat-val" style="color:#ef9a9a">'+fF(totalCharges)+'</div></div>';
  h+='<div class="fy-stat"><div class="fy-stat-label">Net Cashback</div><div class="fy-stat-val" style="color:#4FC3F7">'+fF(totalNet)+'</div></div>';
  h+='</div></div>';
  
  cb.forEach(function(c){
    h+='<div class="cashback-row"><div><div style="font-size:13px;font-weight:600">'+esc(c.monthLabel)+'</div><div style="font-size:11px;color:var(--text-muted)">Earned: '+fF(c.earned)+' | Charges: '+fF(c.charges)+'</div></div><div style="text-align:right"><div style="font-size:10px;color:var(--text-muted)">Net</div><div style="font-weight:700;color:#2E7D32">'+fF(c.net)+'</div></div></div>';
  });
  return h;
}

// HRA Calculator State
var hraCalc={basic:0,hra:0,rent:0,metro:false};
function renderHRACalc(){
  var result=calcHRA(hraCalc.basic,hraCalc.hra,hraCalc.rent,hraCalc.metro);
  var h='<div class="itr-card"><div style="font-weight:700;font-size:15px;margin-bottom:14px;color:var(--text)">\u{1F3E0} HRA Exemption Calculator</div>';
  h+='<div style="font-size:12px;color:var(--text-muted);margin-bottom:14px;line-height:1.5">HRA exemption = Minimum of: (1) Actual HRA received, (2) '+(hraCalc.metro?"50%":"40%")+' of Basic Salary, (3) Rent paid - 10% of Basic Salary</div>';
  
  h+='<div class="ig"><label class="il">Basic Salary (Annual, \u20B9)</label><input class="inp" type="number" value="'+(hraCalc.basic||"")+'" oninput="hraCalc.basic=Number(this.value);rC()" placeholder="e.g. 600000" inputmode="numeric"></div>';
  h+='<div class="ig"><label class="il">HRA Received (Annual, \u20B9)</label><input class="inp" type="number" value="'+(hraCalc.hra||"")+'" oninput="hraCalc.hra=Number(this.value);rC()" placeholder="e.g. 240000" inputmode="numeric"></div>';
  h+='<div class="ig"><label class="il">Rent Paid (Annual, \u20B9)</label><input class="inp" type="number" value="'+(hraCalc.rent||"")+'" oninput="hraCalc.rent=Number(this.value);rC()" placeholder="e.g. 300000" inputmode="numeric"></div>';
  h+='<div class="ig" style="display:flex;align-items:center;gap:10px"><label class="il" style="margin:0">Living in Metro City?</label><div class="set-toggle'+(hraCalc.metro?" on":"")+'" onclick="hraCalc.metro=!hraCalc.metro;rC()" style="cursor:pointer"></div><span style="font-size:12px;color:var(--text-muted)">'+(hraCalc.metro?"Yes (Delhi/Mumbai/Kolkata/Chennai)":"No (40% limit)")+'</span></div>';
  
  // Calculation breakdown
  h+='<div class="hra-calc-box"><div style="font-weight:700;font-size:13px;margin-bottom:8px;color:var(--text)">Breakdown:</div>';
  h+='<div class="hra-calc-row"><span>Actual HRA Received</span><span style="font-weight:600;color:var(--text)">'+fF(hraCalc.hra)+'</span></div>';
  var pctBasic=hraCalc.basic*(hraCalc.metro?0.5:0.4);
  h+='<div class="hra-calc-row"><span>'+(hraCalc.metro?"50%":"40%")+' of Basic Salary</span><span style="font-weight:600;color:var(--text)">'+fF(pctBasic)+'</span></div>';
  var rentCalc=Math.max(0,hraCalc.rent-hraCalc.basic*0.1);
  h+='<div class="hra-calc-row"><span>Rent - 10% of Basic</span><span style="font-weight:600;color:var(--text)">'+fF(rentCalc)+'</span></div>';
  h+='<div class="hra-calc-result">HRA Exemption: '+fF(result)+'</div></div>';
  h+='</div>';
  return h;
}

// MODALS
var mT="",mS={};
function oM(t){mT=t;if(t==="add")mS={type:"expense",category:"food",amount:"",note:"",date:tdy(),tags:[],receipt:null,excluded:false};else if(t==="editProf")mS={editName:"",editPhone:""};else if(t==="split")mS={title:"",total:"",names:["",""]};else if(t==="recurring")mS={name:"",amount:"",category:"bills",frequency:"Monthly",day:"1"};else if(t==="name")mS={nameInput:""};else if(t==="linkphone")mS={linkStep:"num",linkPhone:"",linkOtp:"",linkConf:null,linkPhoneFull:""};else if(t==="pdfrange")mS={rangeFrom:tMo()+"-01",rangeTo:tdy(),preset:"month"};rM();$("OV").classList.remove("hidden")}
function cM(){if(mT==="name"){var n=mS&&mS.nameInput?String(mS.nameInput).trim():"";if(!n){toast("Please enter your name to continue");return}}$("OV").classList.add("hidden")}
function rM(){var m=$("ML");if(mT==="add")m.innerHTML=rAM();else if(mT==="split")m.innerHTML=rSM();else if(mT==="recurring")m.innerHTML=rRM();else if(mT==="editProf")m.innerHTML=rEditProfModal();else if(mT==="settings")m.innerHTML=rStM();else if(mT==="name")m.innerHTML=rNameModal();else if(mT==="linkphone")m.innerHTML=rLinkPhoneModal();else if(mT==="pdfrange")m.innerHTML=rPdfRangeModal()}
function rPdfRangeModal(){
  function pb(key,label){return '<button onclick="setStmtRange(\''+key+'\')" style="flex:1;min-width:78px;padding:9px 6px;border:1.5px solid '+(mS.preset===key?"#6A4BBC":"#E0E0E0")+';background:'+(mS.preset===key?"#EDE7F6":"#fff")+';color:'+(mS.preset===key?"#3E277A":"#666")+';border-radius:10px;font-size:12px;font-weight:600;cursor:pointer">'+label+'</button>'}
  var n=D.transactions.filter(function(t){return !t.excluded&&t.date&&(!mS.rangeFrom||t.date>=mS.rangeFrom)&&(!mS.rangeTo||t.date<=mS.rangeTo)}).length;
  return '<div class="mh"><span class="xmt">Generate Statement</span><button class="xmc" onclick="cM()">\u00D7</button></div>'+
  '<div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">Choose the period for your PDF statement.</div>'+
  '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">'+pb("month","This Month")+pb("last","Last Month")+pb("3m","Last 3 Months")+pb("fy","This FY")+pb("all","All Time")+'</div>'+
  '<div style="display:flex;gap:10px"><div class="ig" style="flex:1"><label class="il">From</label><input class="inp" type="date" value="'+(mS.rangeFrom||"")+'" oninput="mS.rangeFrom=this.value;mS.preset=\'custom\';rM()"></div><div class="ig" style="flex:1"><label class="il">To</label><input class="inp" type="date" value="'+(mS.rangeTo||"")+'" oninput="mS.rangeTo=this.value;mS.preset=\'custom\';rM()"></div></div>'+
  '<div style="text-align:center;font-size:12px;color:var(--text-muted);margin:2px 0 12px">'+n+' transaction'+(n===1?"":"s")+' will be included</div>'+
  '<button class="sub" style="background:linear-gradient(135deg,#3E277A,#6A4BBC)" onclick="genStatement()">\u{1F4C4} Generate PDF</button>';
}
function setStmtRange(key){
  var now=new Date(),y=now.getFullYear(),mo=now.getMonth();
  function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
  if(key==="month"){mS.rangeFrom=iso(new Date(y,mo,1));mS.rangeTo=tdy()}
  else if(key==="last"){mS.rangeFrom=iso(new Date(y,mo-1,1));mS.rangeTo=iso(new Date(y,mo,0))}
  else if(key==="3m"){mS.rangeFrom=iso(new Date(y,mo-2,1));mS.rangeTo=tdy()}
  else if(key==="fy"){var fy=mo>=3?y:y-1;mS.rangeFrom=fy+"-04-01";mS.rangeTo=tdy()}
  else if(key==="all"){mS.rangeFrom="";mS.rangeTo=""}
  mS.preset=key;rM();
}
function genStatement(){var f=mS.rangeFrom||"",t=mS.rangeTo||"";cM();exportPDF(f,t);}
function rNameModal(){
  return '<div class="mh"><span class="xmt">Welcome to MoneyFlow!</span></div>'+
    '<div style="text-align:center;color:var(--text-muted);font-size:13px;margin:4px 0 16px">What should we call you?</div>'+
    '<div class="ig"><label class="il">Your Name</label><input class="inp" id="nameInp" value="'+esc(mS.nameInput||"")+'" oninput="mS.nameInput=this.value" placeholder="Enter your name" autocomplete="name"></div>'+
    '<button class="sub" onclick="saveName()">Continue</button>';
}
function saveName(){
  var n=(mS.nameInput||"").trim();
  if(!n){toast("Please enter your name");return}
  if(n.length>40)n=n.slice(0,40);
  if(!ad)ad={phone:lPh||"",name:n,"in":true};
  else{ad.name=n;ad["in"]=true}
  localStorage.setItem(AK,JSON.stringify(ad));
  cM();rH();
  cloudSync();
  setTimeout(startOnboarding,300);
}

function rAM(){
  var isE=mS.type==="expense",cats=isE?eCats():iCats();
  if(isE&&gC(mS.category).t!=="e")mS.category="food";
  if(!isE&&gC(mS.category).t!=="i")mS.category="salary";
  var cg="";cats.forEach(function(c){cg+='<button class="xcb'+(mS.category===c.id?" a":"")+'" style="--c:'+c.c+'" onclick="mS.category=\''+c.id+'\';rM()"><span>'+c.i+'</span><span class="xcl">'+c.l+'</span></button>'});
  return'<div class="mh"><span class="xmt">'+(mS.editId?"Edit Transaction":"Add Transaction")+'</span><button class="xmc" onclick="cM()">×</button></div><div class="tgr"><button class="tgb" style="'+(isE?"background:#FFF0F0;color:#E53935;border-color:#FFCDD2":"")+'" onclick="mS.type=\'expense\';rM()">Expense</button><button class="tgb" style="'+(!isE?"background:#EDE7F6;color:#3E277A;border-color:#D1C4E9":"")+'" onclick="mS.type=\'income\';rM()">Income</button><button class="tgb" style="'+((mS.type==='transfer')?"background:#E3F2FD;color:#1565C0;border-color:#90CAF9":"")+'" onclick="mS.type=\'transfer\';rM()">&#8644; Transfer</button></div><div class="ig"><label class="il">Amount (₹)</label><input class="inp" type="number" value="'+mS.amount+'" oninput="mS.amount=this.value" placeholder="0" inputmode="numeric"></div><div class="ig"><label class="il">Category</label><div class="cg">'+cg+'</div></div><div class="ig"><label class="il">Note</label><input class="inp" value="'+esc(mS.note)+'" oninput="mS.note=this.value" placeholder="Description..."></div><div class="ig"><label class="il">Tags (optional)</label><div class="tag-input" id="tagBox">'+(mS.tags||[]).map(function(t,i){return'<span class="tag-pill">#'+esc(t)+'<button onclick="rmTag('+i+')">\u00D7</button></span>'}).join('')+'<input type="text" placeholder="Add tag..." onkeydown="addTagKey(event,this)"></div></div><div class="ig"><label class="il">Receipt Photo (optional)</label>'+(mS.receipt?'<div style="display:flex;align-items:center;gap:10px"><img src="'+mS.receipt+'" class="receipt-thumb" onclick="viewReceipt(this.src)"><button class="eb" onclick="mS.receipt=null;rM()">Remove</button></div>':'<button class="eb" onclick="addReceipt()" style="width:100%;padding:10px">\u{1F4F7} Add Receipt Photo</button>')+'</div><div class="ig"><label class="il">Date</label><input class="inp" type="date" max="'+tdy()+'" value="'+mS.date+'" oninput="mS.date=this.value"></div>'+(mS.type!=="transfer"?'<div class="ig"><label class="il">Count in '+(isE?"expenses":"income")+'</label><div onclick="mS.excluded=!mS.excluded;rM()" style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border:1.5px solid '+(mS.excluded?"#FFCDD2":"#C8E6C9")+';border-radius:12px;cursor:pointer;background:'+(mS.excluded?"#FFF5F5":"#F1F8F1")+'"><span style="font-size:12.5px;color:#555">'+(mS.excluded?"Excluded - shown in history for detail only":"Counted in your totals")+'</span><span style="font-size:11px;font-weight:700;padding:5px 13px;border-radius:20px;background:'+(mS.excluded?"#E0E0E0;color:#888":"#2E7D32;color:#fff")+'">'+(mS.excluded?"OFF":"ON")+'</span></div></div>':'')+'<button class="sub" style="background:'+(mS.type==="transfer"?"linear-gradient(135deg,#1565C0,#0D47A1)":(isE?"linear-gradient(135deg,#E53935,#C62828)":"linear-gradient(135deg,#3E277A,#6A4BBC)"))+'" onclick="subA()">'+(mS.editId?"Save Changes":(mS.type==="transfer"?"Add Transfer":(isE?"Add Expense":"Add Income")))+'</button>'+(mS.editId?'<button onclick="dT(\''+mS.editId+'\')" style="width:100%;margin-top:10px;padding:13px;background:#fff;color:#E53935;border:1.5px solid #FFCDD2;border-radius:14px;font-size:14px;font-weight:700;cursor:pointer">\uD83D\uDDD1\uFE0F Delete Transaction</button>':'')
}
function addTagKey(e,inp){if(e.key!=="Enter"&&e.key!==",")return;e.preventDefault();var v=inp.value.trim().replace(/[#,\s]/g,"");if(!v)return;if(!mS.tags)mS.tags=[];if(mS.tags.indexOf(v)===-1)mS.tags.push(v);inp.value="";rM()}
function rmTag(i){mS.tags.splice(i,1);rM()}
function addReceipt(){var inp=document.createElement("input");inp.type="file";inp.accept="image/*";inp.capture="environment";inp.onchange=function(e){var f=e.target.files[0];if(!f)return;if(f.size>1024*1024){toast("Image too large (max 1MB)");return}var r=new FileReader();r.onload=function(ev){mS.receipt=ev.target.result;rM()};r.readAsDataURL(f)};inp.click()}
function viewReceipt(src){var html='<div class="receipt-modal" onclick="this.remove()"><button class="close" onclick="this.parentElement.remove()">\u00D7</button><img src="'+src+'"></div>';var div=document.createElement("div");div.innerHTML=html;document.body.appendChild(div.firstChild)}

function subA(){
  var a=Number(mS.amount);
  if(!a||a<=0)return toast("Enter valid amount");
  if(mS.date>tdy())return toast("Future dates not allowed");
  if(mS.editId){
    for(var i=0;i<D.transactions.length;i++){
      if(D.transactions[i].id===mS.editId){
        D.transactions[i].type=mS.type;
        D.transactions[i].amount=a;
        D.transactions[i].category=mS.category;
        D.transactions[i].note=mS.note;
        D.transactions[i].date=mS.date;
        D.transactions[i].tags=mS.tags||[];
        D.transactions[i].receipt=mS.receipt||null;
        D.transactions[i].excluded=!!mS.excluded;
        break;
      }
    }
    D.transactions.sort(function(a,b){return(b.date||"").localeCompare(a.date||"")});
    sv();toast("Updated!");cM();rC();return;
  }
  D.transactions.unshift({id:genId(),type:mS.type,amount:a,category:mS.category,note:mS.note,date:mS.date,createdAt:Date.now(),tags:mS.tags||[],receipt:mS.receipt||null,excluded:!!mS.excluded});
  D.transactions.sort(function(a,b){return(b.date||"").localeCompare(a.date||"")});
  sv();toast(mS.type==="income"?"Income added!":"Expense added!");cM();rC();
}

function rSM(){var nh="";mS.names.forEach(function(n,i){nh+='<div class="pr"><input class="inp" value="'+esc(n)+'" oninput="mS.names['+i+']=this.value" placeholder="Person '+(i+1)+'">'+(mS.names.length>2?'<button class="dl" onclick="mS.names.splice('+i+',1);rM()">×</button>':'')+'</div>'});var vn=mS.names.filter(function(n){return n.trim()});var pp=mS.total&&vn.length>=2?fF(Number(mS.total)/vn.length):"";return'<div class="mh"><span class="xmt">Split Bill</span><button class="xmc" onclick="cM()">×</button></div><div class="ig"><label class="il">What for?</label><input class="inp" value="'+esc(mS.title)+'" oninput="mS.title=this.value" placeholder="Dinner, Trip..."></div><div class="ig"><label class="il">Total (₹)</label><input class="inp" type="number" value="'+mS.total+'" oninput="mS.total=this.value" placeholder="0" inputmode="numeric"></div><div class="ig"><label class="il">People</label>'+nh+'<button class="eb" style="margin-top:4px" onclick="mS.names.push(\'\');rM()">+ Add</button></div>'+(pp?'<div style="color:#888;font-size:12px;margin-bottom:12px;text-align:center">Each pays: '+pp+'</div>':'')+'<button class="sub" style="background:linear-gradient(135deg,#3E277A,#6A4BBC)" onclick="subSp()">Create Split</button>'}
function subSp(){var t=Number(mS.total);if(!mS.title||!t||t<=0)return toast("Fill all fields");var p=mS.names.filter(function(n){return n.trim()}).map(function(n){return{name:n.trim()}});if(p.length<2)return toast("Need 2+ people");D.splits.unshift({id:genId(),title:mS.title,total:t,people:p,createdAt:Date.now()});sv();toast("Split added!");cM();rC()}

function rRM(){var opts="";eCats().forEach(function(c){opts+='<option value="'+c.id+'"'+(mS.category===c.id?" selected":"")+'>'+c.i+' '+c.l+'</option>'});return'<div class="mh"><span class="xmt">Recurring Bill</span><button class="xmc" onclick="cM()">×</button></div><div class="ig"><label class="il">Bill Name</label><input class="inp" value="'+esc(mS.name)+'" oninput="mS.name=this.value" placeholder="Netflix, Rent..."></div><div class="ig"><label class="il">Amount (₹)</label><input class="inp" type="number" value="'+mS.amount+'" oninput="mS.amount=this.value" placeholder="0" inputmode="numeric"></div><div class="ig"><label class="il">Category</label><select class="inp" onchange="mS.category=this.value">'+opts+'</select></div><div style="display:flex;gap:10px"><div class="ig" style="flex:1"><label class="il">Frequency</label><select class="inp" onchange="mS.frequency=this.value"><option'+(mS.frequency==="Monthly"?" selected":"")+'>Monthly</option><option'+(mS.frequency==="Weekly"?" selected":"")+'>Weekly</option><option'+(mS.frequency==="Yearly"?" selected":"")+'>Yearly</option></select></div><div class="ig" style="flex:1"><label class="il">Day</label><input class="inp" type="number" min="1" max="31" value="'+mS.day+'" oninput="mS.day=this.value"></div></div><button class="sub" style="background:linear-gradient(135deg,#FF9800,#E65100)" onclick="subRc()">Add Bill</button>'}
function subRc(){var a=Number(mS.amount);if(!mS.name||!a||a<=0)return toast("Fill all fields");D.recurring.unshift({id:genId(),name:mS.name,amount:a,category:mS.category,frequency:mS.frequency,dayOfMonth:Number(mS.day)||1});sv();toast("Bill added!");cM();rC()}

