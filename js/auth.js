/* MoneyFlow – auth.js */
// AUTH
var AK="mf_auth",ad=null;try{var x=localStorage.getItem(AK);if(x)ad=JSON.parse(x)}catch(e){}
var lPh="",oTm=0,oInt=null,lSt="phone",sending=false,verifying=false;
function svA(p,n){ad={phone:p,name:n||"User","in":true};localStorage.setItem(AK,JSON.stringify(ad))}
function logout(){if(fbOk)auth.signOut();uid=null;D=emptyD();DK="mf_v5";if(ad)ad["in"]=false;localStorage.setItem(AK,JSON.stringify(ad));$("AS").classList.add("hidden");$("LS").classList.remove("hidden");lSt="phone";cRes=null;rcv=null;$("rcc").innerHTML="";rL()}
function toast(m){var t=$("TT");t.textContent=m;t.classList.remove("hidden");clearTimeout(t._t);t._t=setTimeout(function(){t.classList.add("hidden")},2200)}

function rL(){
  var c=$("LC");if(!c)return;
  if(isBiometricEnabled()&&isBiometricSupported()&&!(ad&&ad["in"])){
    var bioUser=JSON.parse(localStorage.getItem("mf_bio_user")||"null");
    var bnm=bioUser?bioUser.name:"User";
    c.innerHTML='<div style="text-align:center;padding:10px 0 20px"><div style="font-size:60px;margin-bottom:8px">\u{1F510}</div><div style="font-size:18px;font-weight:700;color:#3E277A">Welcome back, '+esc(bnm)+'!</div><div style="color:#888;font-size:13px;margin-top:4px">Use fingerprint to unlock</div></div><button class="xbtn xbp" onclick="loginBiometric()">\u{1F510} Unlock with Fingerprint</button><button class="xbtn xbo" onclick="localStorage.removeItem(\'mf_bio_id\');localStorage.removeItem(\'mf_bio_user\');rL()">Use Password Instead</button>';
    return;
  }

  if(ad&&ad.phone&&ad["in"]&&lSt==="phone"){goApp();return}
  if(ad&&ad.phone&&lSt==="phone")lSt="returning";
  if(lSt==="phone"){
    c.innerHTML='<div style="font-size:17px;font-weight:700;margin-bottom:4px">Welcome!</div><div style="font-size:13px;color:#999;margin-bottom:20px">Enter your phone number to get started</div><div class="xpw"><span class="xpp">🇮🇳 +91</span><input class="xpi" id="PI" type="tel" maxlength="10" placeholder="Phone number" inputmode="numeric"></div><div id="LE" class="xerr" style="display:none"></div><button class="xbtn xbp" id="SB" onclick="sOTP()">Get OTP →</button><div style=\"display:flex;align-items:center;gap:10px;margin:18px 0 8px\"><div style=\"flex:1;height:1px;background:#eee\"></div><span style=\"color:#999;font-size:11px;font-weight:600\">OR</span><div style=\"flex:1;height:1px;background:#eee\"></div></div><button class=\"xbtn xbo\" id=\"GB\" onclick=\"signInGoogle()\" style=\"display:flex;align-items:center;justify-content:center;gap:10px;border:2px solid #EDE7F6;background:#fff;color:#3E277A\"><svg width=\"18\" height=\"18\" viewBox=\"0 0 48 48\"><path fill=\"#EA4335\" d=\"M24 9.5c3.5 0 6.7 1.2 9.2 3.6l6.8-6.8C35.9 2.4 30.5 0 24 0 14.6 0 6.5 5.4 2.6 13.2l8 6.2C12.4 13.7 17.7 9.5 24 9.5z\"/><path fill=\"#4285F4\" d=\"M47 24.5c0-1.6-.2-3.1-.4-4.5H24v9h12.9c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 7.1-10.4 7.1-17.7z\"/><path fill=\"#FBBC05\" d=\"M10.5 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-8-6.2C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.9-6.2z\"/><path fill=\"#34A853\" d=\"M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.2 1.5-4.9 2.3-8.2 2.3-6.3 0-11.6-4.2-13.5-9.9l-8 6.2C6.5 42.6 14.6 48 24 48z\"/></svg>Sign in with Google</button>';
    setTimeout(function(){var p=$("PI");if(p){p.focus();p.oninput=function(){this.value=this.value.replace(/[^0-9]/g,"")}}},100);mkRc();
  }else if(lSt==="otp"){
    var mk=lPh.slice(0,2)+"******"+lPh.slice(8);
    c.innerHTML='<div style="font-size:17px;font-weight:700;margin-bottom:4px">Verify OTP</div><div style="text-align:center;font-size:14px;color:#888;margin-bottom:4px">Sent to <strong>+91 '+mk+'</strong></div><div style="color:#6A4BBC;font-size:13px;cursor:pointer;text-align:center;font-weight:600;margin-bottom:12px" onclick="lSt=\'phone\';cRes=null;rL()">Change number</div><div class="xow" id="OW"></div><div id="OTT" class="xotm"></div><div id="OE" class="xerr" style="display:none"></div><button class="xbtn xbp" id="VB" onclick="vOTP()">Verify & Continue</button>';
    var ow=$("OW");for(var i=1;i<=6;i++){var b=document.createElement("input");b.className="xob";b.id="O"+i;b.maxLength=1;b.inputMode="numeric";b.setAttribute("data-idx",i);ow.appendChild(b)}
    ow.addEventListener("input",function(e){var el=e.target;if(!el.classList.contains("xob"))return;el.value=el.value.replace(/[^0-9]/g,"");var idx=parseInt(el.getAttribute("data-idx"));if(el.value&&idx<6){var nx=$("O"+(idx+1));if(nx)nx.focus()}if(idx===6&&el.value)vOTP()});
    ow.addEventListener("keydown",function(e){var el=e.target;if(!el.classList.contains("xob"))return;if(e.key==="Backspace"&&!el.value){var idx=parseInt(el.getAttribute("data-idx"));if(idx>1){var pv=$("O"+(idx-1));if(pv){pv.focus();pv.value=""}}}});
    setTimeout(function(){var o=$("O1");if(o)o.focus()},100);sTm();
  }else if(lSt==="returning"){
    c.innerHTML='<div style="text-align:center;padding:20px 0"><div style="font-size:18px;font-weight:700;color:#3E277A">Welcome back, '+esc(ad.name)+'!</div><div style="color:#888;font-size:13px;margin-top:4px">+91 '+ad.phone+'</div></div><button class="xbtn xbp" onclick="lSt=\'phone\';lPh=ad.phone;rL()">Login with OTP</button><button class="xbtn xbo" onclick="lSt=\'phone\';lPh=\'\';ad=null;localStorage.removeItem(AK);rL()">Use Different Number</button>';
  }
}
function sOTP(){if(sending||!fbOk)return;var pi=$("PI");if(!pi)return;lPh=pi.value.trim();if(lPh.length!==10){shE("LE","Enter valid 10-digit number");return}sending=true;var btn=$("SB");btn.disabled=true;btn.innerHTML='<span class="xspn"></span> Sending...';hiE("LE");mkRc();auth.signInWithPhoneNumber("+91"+lPh,rcv).then(function(r){cRes=r;sending=false;lSt="otp";rL()}).catch(function(e){sending=false;btn.disabled=false;btn.innerHTML="Get OTP →";var m=e.code==="auth/too-many-requests"?"Too many attempts.":e.code==="auth/invalid-phone-number"?"Invalid number.":"Failed: "+(e.message||"");shE("LE",m);rcv=null;$("rcc").innerHTML="";mkRc()})}
function vOTP(){if(verifying||!cRes)return;var code="";for(var i=1;i<=6;i++){var b=$("O"+i);code+=b?b.value:""}if(code.length<6){shE("OE","Enter complete 6-digit OTP");return}verifying=true;var btn=$("VB");btn.disabled=true;btn.innerHTML='<span class="xspn"></span> Verifying...';hiE("OE");cRes.confirm(code).then(function(){verifying=false;clearInterval(oInt);svA(lPh,ad&&ad.name?ad.name:"");goApp()}).catch(function(e){verifying=false;btn.disabled=false;btn.innerHTML="Verify & Continue";shE("OE",e.code==="auth/code-expired"?"OTP expired.":"Invalid OTP.");for(var i=1;i<=6;i++){var b=$("O"+i);if(b){b.value="";b.classList.add("err");setTimeout(function(b){b.classList.remove("err")},400,b)}}$("O1").focus()})}
function sTm(){oTm=60;clearInterval(oInt);uTm();oInt=setInterval(function(){oTm--;uTm();if(oTm<=0)clearInterval(oInt)},1000)}
function uTm(){var e=$("OTT");if(!e)return;e.innerHTML=oTm>0?"Resend in <b>"+oTm+"s</b>":"<b onclick='rsO()'>Resend OTP</b>"}
function rsO(){lSt="phone";rL();setTimeout(function(){var p=$("PI");if(p)p.value=lPh;sOTP()},300)}
function shE(id,m){var e=$(id);if(e){e.textContent=m;e.style.display="block"}}
function hiE(id){var e=$(id);if(e)e.style.display="none"}
// CURRENCY SUPPORT


// TAGS HELPERS
function getAllTags(){var s={};D.transactions.forEach(function(t){if(t.tags&&t.tags.length)t.tags.forEach(function(tg){s[tg]=(s[tg]||0)+1})});return Object.keys(s).sort(function(a,b){return s[b]-s[a]})}

// ACCOUNTS (Axio-style multi-account)
function addAccount(){
  var name=prompt("Account name (e.g. HDFC, Paytm, Cash):");
  if(!name||!name.trim())return;
  ensureAccounts();
  var icons={cash:"💵",bank:"🏦",credit:"💳",wallet:"📱",savings:"🐷",loan:"📉"};
  var type=prompt("Type: cash / bank / credit / wallet / savings / loan","bank")||"bank";
  type=type.toLowerCase().trim();
  if(!icons[type])type="bank";
  var colors={cash:"#2E7D32",bank:"#1565C0",credit:"#E65100",wallet:"#6A4BBC",savings:"#00897B",loan:"#C62828"};
  D.accounts.push({id:genId(),name:name.trim().slice(0,24),type:type,balance:0,color:colors[type]||"#3E277A",icon:icons[type]});
  sv();toast("Account added");rC();
}
function editAccount(id){
  ensureAccounts();
  var a=null;for(var i=0;i<D.accounts.length;i++)if(D.accounts[i].id===id){a=D.accounts[i];break}
  if(!a)return;
  var bal=prompt("Update balance for "+a.name+" ("+getCurrSym()+"):",a.balance||0);
  if(bal===null)return;
  a.balance=Number(bal)||0;
  sv();toast("Balance updated");rC();
}
function deleteAccount(id){
  ensureAccounts();
  if(D.accounts.length<=1){toast("Keep at least one account");return}
  if(!confirm("Delete this account?"))return;
  D.accounts=D.accounts.filter(function(a){return a.id!==id});
  sv();toast("Account removed");rM();rC();
}

// ANALYTICS HELPERS
function getMonthData(year,month){
  var key=year+"-"+String(month+1).padStart(2,"0");
  var txns=D.transactions.filter(function(t){return t.date&&t.date.indexOf(key)===0});
  var inc=0,exp=0,catBreak={};
  txns.forEach(function(t){
    if(t.excluded)return;
    if(t.type==="income")inc+=t.amount;
    else if(t.type==="expense"){exp+=t.amount;catBreak[t.category]=(catBreak[t.category]||0)+t.amount}
  });
  return{txns:txns,inc:inc,exp:exp,cat:catBreak,nws:getNWS(txns)};
}
function getDayAvg(txns){
  if(!txns.length)return 0;
  var dates={};txns.forEach(function(t){if(t.type==="expense")dates[t.date]=(dates[t.date]||0)+t.amount});
  var keys=Object.keys(dates);
  if(!keys.length)return 0;
  var total=0;keys.forEach(function(d){total+=dates[d]});
  return total/keys.length;
}
function getTopMerchants(txns,limit){
  var m={};txns.forEach(function(t){if(t.type==="expense"&&t.note){var k=t.note.toLowerCase().slice(0,30);m[k]=(m[k]||0)+t.amount}});
  return Object.keys(m).map(function(k){return{name:k,amt:m[k]}}).sort(function(a,b){return b.amt-a.amt}).slice(0,limit||5);
}

// PUSH NOTIFICATIONS
function getNotifPerm(){return Notification.permission||"default"}
function requestNotifPerm(){
  if(!("Notification" in window)){toast("Notifications not supported");return}
  Notification.requestPermission().then(function(p){
    if(p==="granted"){toast("Notifications enabled!");scheduleReminder()}
    else toast("Permission denied");
    rM();
  });
}
function scheduleReminder(){
  // Schedule daily reminder at 8 PM
  if(getNotifPerm()!=="granted")return;
  var lastReminder=localStorage.getItem("mf_last_reminder");
  var today=tdy();
  if(lastReminder===today)return;
  var now=new Date();var hour=now.getHours();
  if(hour>=20){
    new Notification("MoneyFlow Reminder",{body:"Don't forget to log today's expenses!",icon:"/assets/icon.jpeg",badge:"/assets/icon.jpeg"});
    localStorage.setItem("mf_last_reminder",today);
  }
}
function checkBudgetAlert(){
  if(getNotifPerm()!=="granted")return;
  var cm=tMo();
  var spent=0;D.transactions.forEach(function(t){if(t.type==="expense"&&t.date&&t.date.indexOf(cm)===0)spent+=t.amount});
  var pct=D.monthlyBudget>0?spent/D.monthlyBudget*100:0;
  var lastAlert=localStorage.getItem("mf_last_budget_alert")||"";
  if(pct>=90&&lastAlert!==cm+"-90"){
    new Notification("Budget Alert!",{body:"You've used "+pct.toFixed(0)+"% of your monthly budget",icon:"/assets/icon.jpeg"});
    localStorage.setItem("mf_last_budget_alert",cm+"-90");
  }
}

// REFERRAL TRACKING
function getReferralStats(){return JSON.parse(localStorage.getItem("mf_referrals")||'{"shared":0,"installed":0}')}
function trackShare(){var s=getReferralStats();s.shared++;localStorage.setItem("mf_referrals",JSON.stringify(s))}

// PREMIUM (placeholder)
function isPremium(){return localStorage.getItem("mf_premium")==="1"}
function showPremiumModal(){
  var html='<div class="bio-prompt" id="premModal" onclick="document.getElementById(\'premModal\').remove()"><div class="bio-card" onclick="event.stopPropagation()"><div class="bio-icon" style="background:linear-gradient(135deg,#FFD700,#FFA000);font-size:42px">\u{1F48E}</div><div style="font-size:22px;font-weight:700;color:#3E277A;margin-bottom:12px">MoneyFlow Premium</div><div style="text-align:left;color:#666;font-size:14px;line-height:1.8;margin-bottom:20px"><div>\u2713 Unlimited custom categories</div><div>\u2713 Receipt photo storage</div><div>\u2713 Advanced analytics & reports</div><div>\u2713 Multiple wallets/accounts</div><div>\u2713 Priority support</div><div>\u2713 Ad-free forever</div></div><div style="font-size:28px;font-weight:700;color:#3E277A;margin-bottom:4px">\u20B999/year</div><div style="color:#999;font-size:12px;margin-bottom:20px">Less than \u20B98.5/month</div><button class="xbtn xbp" onclick="toast(\'Premium coming soon! Notified you\');document.getElementById(\'premModal\').remove()">Notify Me When Available</button><button class="onb-skip" onclick="document.getElementById(\'premModal\').remove()" style="margin-top:8px;width:100%">Maybe later</button></div></div>';
  var div=document.createElement("div");div.innerHTML=html;document.body.appendChild(div.firstChild);
}

// THEME
function getTheme(){return localStorage.getItem("mf_theme")||"light"}
function setTheme(t){localStorage.setItem("mf_theme",t);document.documentElement.setAttribute("data-theme",t);var meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute("content",t==="dark"?"#0f1117":"#3E277A")}
function toggleTheme(){setTheme(getTheme()==="dark"?"light":"dark");rM();rH()}
// Apply on load
setTheme(getTheme());

// CUSTOM CATEGORIES
function getCustomCats(){try{return JSON.parse(localStorage.getItem("mf_custom_cats")||"[]")}catch(e){return[]}}
function saveCustomCats(arr){localStorage.setItem("mf_custom_cats",JSON.stringify(arr));rebuildCats()}
function rebuildCats(){
  // Reload CATS to include custom ones
  CATS=BASE_CATS.concat(getCustomCats());
}
function addCustomCategory(){
  var name=prompt("Category name (e.g. Pet Care):");
  if(!name||name.length<2)return;
  var icons=["🐶","🎮","🎨","✈️","🏋️","☕","🎵","🌱","💼","🎁","📱","🎸"];
  var icon=prompt("Choose icon: "+icons.join(" "),icons[0]);
  if(!icon)return;
  var grp=prompt("Group? Type: need / want / savings","want");
  if(["need","want","savings"].indexOf(grp)===-1)grp="want";
  var colors=["#FF6B6B","#4CAF50","#2196F3","#FF9800","#9C27B0","#E91E63","#00BCD4","#FFC107"];
  var color=colors[Math.floor(Math.random()*colors.length)];
  var custom=getCustomCats();
  var id="cust_"+Date.now();
  custom.push({id:id,l:name,i:icon,c:color,t:"e",g:grp,custom:true});
  saveCustomCats(custom);
  toast("Category added!");rM();
}
function deleteCustomCategory(id){
  if(!confirm("Delete this category?"))return;
  var custom=getCustomCats().filter(function(c){return c.id!==id});
  saveCustomCats(custom);toast("Deleted");rM();
}

// PIN LOCK
function getPin(){return localStorage.getItem("mf_pin")}
function isPinSet(){return getPin()!==null}
function setupPin(){showPinModal("set",null,function(p1){showPinModal("confirm",p1,function(p2){if(p1===p2){localStorage.setItem("mf_pin",p1);toast("PIN set!");cM();rM();}else{toast("PINs don't match. Try again");}})})}
function disablePin(){if(confirm("Remove PIN protection?")){localStorage.removeItem("mf_pin");toast("PIN removed");rM();}}
function verifyPin(callback){showPinModal("verify",getPin(),callback)}
function showPinModal(mode,expected,cb){
  var titles={set:"Create 4-digit PIN",confirm:"Confirm your PIN",verify:"Enter your PIN"};
  var entered="";
  var html='<div class="bio-prompt" id="pinPrompt"><div class="bio-card"><div class="bio-icon">🔢</div><div style="font-weight:700;font-size:18px;color:#3E277A;margin-bottom:4px">'+titles[mode]+'</div><div style="color:#999;font-size:13px;margin-bottom:8px" id="pinMsg">Enter 4 digits</div><div class="pin-dots" id="pinDots"></div><div class="pin-pad">';
  for(var i=1;i<=9;i++)html+='<button class="pin-key" onclick="pinPress('+i+')">'+i+'</button>';
  html+='<button class="pin-key" onclick="closePinModal()" style="background:#FFEBEE;color:#E53935">✕</button>';
  html+='<button class="pin-key" onclick="pinPress(0)">0</button>';
  html+='<button class="pin-key" onclick="pinBack()" style="background:#FFF3E0;color:#FF9800">⌫</button>';
  html+='</div></div></div>';
  var div=document.createElement("div");div.innerHTML=html;document.body.appendChild(div.firstChild);
  window._pinExpected=expected;window._pinMode=mode;window._pinCb=cb;window._pinEntered="";
  updatePinDots();
}
function pinPress(n){if(window._pinEntered.length>=4)return;window._pinEntered+=n;updatePinDots();if(window._pinEntered.length===4){setTimeout(function(){var p=window._pinEntered;if(window._pinMode==="verify"){if(p===window._pinExpected){closePinModal();window._pinCb&&window._pinCb(p)}else{var msg=document.getElementById("pinMsg");if(msg){msg.textContent="Wrong PIN. Try again";msg.style.color="#E53935"}window._pinEntered="";updatePinDots()}}else{closePinModal();window._pinCb&&window._pinCb(p)}},150)}}
function pinBack(){window._pinEntered=window._pinEntered.slice(0,-1);updatePinDots()}
function updatePinDots(){var d=document.getElementById("pinDots");if(!d)return;var html="";for(var i=0;i<4;i++)html+='<div class="pin-dot'+(i<window._pinEntered.length?" f":"")+'"></div>';d.innerHTML=html}
function closePinModal(){var p=document.getElementById("pinPrompt");if(p)p.remove();window._pinEntered=""}

// ONBOARDING TOUR
var onbStep=0;
var onbSlides=[
  {i:"💰",t:"Welcome to MoneyFlow!",d:"Track every rupee effortlessly. Add expenses and income with just a tap."},
  {i:"📊",t:"Need / Want / Savings",d:"Every expense is auto-tagged so you understand where your money really goes."},
  {i:"🔐",t:"Your Data, Your Control",d:"Enable fingerprint login, backup to cloud, and export PDF statements anytime."}
];
function startOnboarding(){if(localStorage.getItem("mf_onboarded"))return;onbStep=0;showOnbStep()}
function showOnbStep(){
  var s=onbSlides[onbStep];
  var dots="";for(var i=0;i<onbSlides.length;i++)dots+='<div class="onb-dot'+(i===onbStep?" a":"")+'"></div>';
  var html='<div class="onb-overlay" id="onbOv"><div class="onb-card"><div class="onb-icon">'+s.i+'</div><div class="onb-title">'+s.t+'</div><div class="onb-text">'+s.d+'</div><div class="onb-dots">'+dots+'</div><div class="onb-btns"><button class="onb-skip" onclick="finishOnboarding()">Skip</button><button class="onb-next" onclick="nextOnb()">'+(onbStep===onbSlides.length-1?"Get Started":"Next →")+'</button></div></div></div>';
  var existing=document.getElementById("onbOv");if(existing)existing.remove();
  var div=document.createElement("div");div.innerHTML=html;document.body.appendChild(div.firstChild);
}
function nextOnb(){onbStep++;if(onbStep>=onbSlides.length)finishOnboarding();else showOnbStep()}
function finishOnboarding(){localStorage.setItem("mf_onboarded","1");var ov=document.getElementById("onbOv");if(ov)ov.remove()}

function shareApp(){
  var shareData={
    title:"MoneyFlow - Track Every Rupee",
    text:"Hey! Check out MoneyFlow - a free personal finance tracker. Auto-tracks expenses from bank SMS, supports Need/Want/Savings categories, and works completely offline. By VKS Tech.",
    url:"https://moneyflow.vkstech.com"
  };
  if(navigator.share){
    navigator.share(shareData).then(function(){trackShare();toast("Thanks for sharing!")}).catch(function(e){if(e.name!=="AbortError")toast("Share failed")});
  }else{
    // Fallback: copy link
    var msg=shareData.text+" "+shareData.url;
    if(navigator.clipboard){
      navigator.clipboard.writeText(msg).then(function(){toast("Link copied to clipboard!")});
    }else{
      var ta=document.createElement("textarea");ta.value=msg;document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta);toast("Link copied!");
    }
  }
}

function editProfile(){
  oM("editProf");
  mS={editName:ad?ad.name:"",editPhone:ad?ad.phone||"":""};
  rM();
}
function saveProfile(){
  if(!mS.editName||mS.editName.length<2){toast("Enter valid name");return}
  var ph=(mS.editPhone||"").replace(/[^0-9]/g,"");
  if(ph&&ph.length!==10){toast("Phone must be 10 digits");return}
  ad.name=mS.editName.trim();
  if(ph)ad.phone=ph;
  localStorage.setItem(AK,JSON.stringify(ad));
  cloudSync();
  toast("Profile updated!");
  cM();rH();rM();
}
function rEditProfModal(){
  return '<div class="mh"><span class="xmt">Edit Profile</span><button class="xmc" onclick="cM()">\u00D7</button></div>'+
    '<div style="text-align:center;padding:8px 0 16px"><div style="font-size:13px;color:var(--text-muted)">Update your display info. Note: changing phone number does not change login phone.</div></div>'+
    '<div class="ig"><label class="il">Display Name</label><input class="inp" value="'+esc(mS.editName||"")+'" oninput="mS.editName=this.value" placeholder="Your name"></div>'+
    '<div class="ig"><label class="il">Mobile Number</label><div class="xpw"><span class="xpp">+91</span><input class="xpi" value="'+esc(mS.editPhone||"")+'" oninput="mS.editPhone=this.value.replace(/[^0-9]/g,\'\').slice(0,10)" placeholder="10-digit number" inputmode="numeric"></div></div>'+
    '<button class="sub" onclick="saveProfile()">Save Changes</button>';
}

// PROFILE PICTURE
function uploadProfilePic(){
  var inp=document.createElement("input");
  inp.type="file";inp.accept="image/*";inp.capture="user";
  inp.onchange=function(e){
    var f=e.target.files[0];if(!f)return;
    if(f.size>2*1024*1024){toast("Image too large (max 2MB)");return}
    var r=new FileReader();
    r.onload=function(ev){
      ad.pic=ev.target.result;
      localStorage.setItem(AK,JSON.stringify(ad));
      cloudSync();toast("Profile updated!");rH();rM();
    };
    r.readAsDataURL(f);
  };
  inp.click();
}

// BIOMETRIC LOGIN (WebAuthn)
function isBiometricSupported(){return window.PublicKeyCredential!==undefined&&navigator.credentials!==undefined}
function isBiometricEnabled(){return localStorage.getItem("mf_bio_id")!==null}
function setupBiometric(){
  if(!isBiometricSupported()){toast("Biometric not supported on this device");return}
  if(!ad||!ad.phone){toast("Please login first");return}
  var challenge=new Uint8Array(32);crypto.getRandomValues(challenge);
  var userId=new TextEncoder().encode(ad.phone);
  navigator.credentials.create({
    publicKey:{
      challenge:challenge,
      rp:{name:"MoneyFlow",id:window.location.hostname},
      user:{id:userId,name:ad.phone,displayName:ad.name||"User"},
      pubKeyCredParams:[{alg:-7,type:"public-key"},{alg:-257,type:"public-key"}],
      authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required"},
      timeout:60000,
      attestation:"none"
    }
  }).then(function(cred){
    var idArr=Array.from(new Uint8Array(cred.rawId));
    localStorage.setItem("mf_bio_id",JSON.stringify(idArr));
    localStorage.setItem("mf_bio_user",JSON.stringify(ad));
    toast("\u{1F510} Fingerprint enabled!");rM();
  }).catch(function(e){toast("Setup failed: "+(e.message||"cancelled"))});
}
function loginBiometric(){
  if(!isBiometricSupported()||!isBiometricEnabled()){toast("Biometric not available");return}
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
    var bioUser=JSON.parse(localStorage.getItem("mf_bio_user"));
    ad=bioUser;ad["in"]=true;
    localStorage.setItem(AK,JSON.stringify(ad));
    toast("Welcome back!");goApp();
  }).catch(function(e){toast("Authentication failed")});
}
function disableBiometric(){
  if(confirm("Disable fingerprint login?")){
    localStorage.removeItem("mf_bio_id");
    localStorage.removeItem("mf_bio_user");
    toast("Fingerprint disabled");rM();
  }
}

// ADD MOBILE NUMBER (for Google users) - proper Firebase account linking
function addMobileNumber(){
  if(!fbOk||!auth.currentUser){toast("Please login first");return}
  oM("linkphone");
}
function rLinkPhoneModal(){
  var h='<div class="mh"><span class="xmt">Link Mobile Number</span><button class="xmc" onclick="cM()">\u00D7</button></div>';
  h+='<div id="lrcc"></div>';
  if(mS.linkStep==="otp"){
    var mk=(mS.linkPhoneFull||"").slice(0,2)+"******"+(mS.linkPhoneFull||"").slice(8);
    h+='<div style="text-align:center;color:var(--text-muted);font-size:13px;margin-bottom:14px">Enter the 6-digit code sent to <strong>+91 '+esc(mk)+'</strong></div>';
    h+='<div class="ig"><label class="il">OTP Code</label><input class="inp" id="lotpInp" maxlength="6" inputmode="numeric" value="'+esc(mS.linkOtp||"")+'" oninput="mS.linkOtp=this.value.replace(/[^0-9]/g,\'\').slice(0,6)" placeholder="6-digit code"></div>';
    h+='<button class="sub" id="lvBtn" onclick="confirmLinkOTP()">Verify & Link</button>';
    h+='<button class="eb" style="width:100%;margin-top:8px;padding:10px" onclick="mS.linkStep=\'num\';mS.linkOtp=\'\';rM()">\u2190 Change number</button>';
  }else{
    h+='<div style="text-align:center;color:var(--text-muted);font-size:13px;margin-bottom:14px">Link your phone so you can sign in with either Google or your mobile number \u2014 your data stays in one account.</div>';
    h+='<div class="ig"><label class="il">Mobile Number</label><div class="xpw"><span class="xpp">+91</span><input class="xpi" id="lphInp" inputmode="numeric" value="'+esc(mS.linkPhone||"")+'" oninput="mS.linkPhone=this.value.replace(/[^0-9]/g,\'\').slice(0,10)" placeholder="10-digit number"></div></div>';
    h+='<button class="sub" id="lsBtn" onclick="sendLinkOTP()">Send OTP</button>';
  }
  return h;
}
function sendLinkOTP(){
  var num=(mS.linkPhone||"").replace(/[^0-9]/g,"");
  if(num.length!==10){toast("Enter a valid 10-digit number");return}
  if(!auth.currentUser){toast("Session expired, please login again");return}
  var btn=$("lsBtn");if(btn){btn.disabled=true;btn.innerHTML='<span class="xspn"></span> Sending...'}
  var rc=mkLinkRc();
  auth.currentUser.linkWithPhoneNumber("+91"+num,rc).then(function(cr){
    mS.linkConf=cr;mS.linkPhoneFull=num;mS.linkStep="otp";mS.linkOtp="";rM();
  }).catch(function(e){
    if(btn){btn.disabled=false;btn.innerHTML="Send OTP"}
    var m="Failed to send OTP";
    if(e.code==="auth/credential-already-in-use"||e.code==="auth/account-exists-with-different-credential"||e.code==="auth/phone-number-already-exists")m="This number is already linked to a different account.";
    else if(e.code==="auth/provider-already-linked")m="A mobile number is already linked to this account.";
    else if(e.code==="auth/too-many-requests")m="Too many attempts. Try again later.";
    else if(e.code==="auth/invalid-phone-number")m="Invalid phone number.";
    else if(e.message)m=e.message;
    toast(m);
    if(lrcv){try{lrcv.clear()}catch(_){}lrcv=null}
  });
}
function confirmLinkOTP(){
  var code=(mS.linkOtp||"").replace(/[^0-9]/g,"");
  if(code.length!==6){toast("Enter the complete 6-digit OTP");return}
  if(!mS.linkConf){toast("Please request a new OTP");mS.linkStep="num";rM();return}
  var btn=$("lvBtn");if(btn){btn.disabled=true;btn.innerHTML='<span class="xspn"></span> Linking...'}
  mS.linkConf.confirm(code).then(function(){
    if(ad){ad.phone=mS.linkPhoneFull;localStorage.setItem(AK,JSON.stringify(ad))}
    cloudSync();
    cM();toast("\u2705 Mobile number linked!");rH();
    if(lrcv){try{lrcv.clear()}catch(_){}lrcv=null}
  }).catch(function(e){
    if(btn){btn.disabled=false;btn.innerHTML="Verify & Link"}
    toast(e.code==="auth/code-expired"?"OTP expired, request a new one":"Invalid OTP, try again");
  });
}
// Styled confirmation dialog (replaces native confirm)
function showConfirm(title,msg,onYes,yesLabel,danger){
  var wrap=document.createElement("div");
  wrap.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:24px";
  var card=document.createElement("div");
  card.style.cssText="background:#fff;border-radius:20px;padding:24px;width:100%;max-width:320px;text-align:center;animation:fadeUp .25s ease";
  card.innerHTML='<div style="font-weight:700;font-size:17px;color:#1a1a1a;margin-bottom:8px">'+esc(title)+'</div><div style="color:#888;font-size:13px;margin-bottom:20px">'+esc(msg||"")+'</div>';
  var row=document.createElement("div");row.style.cssText="display:flex;gap:10px";
  var no=document.createElement("button");no.textContent="Cancel";
  no.style.cssText="flex:1;padding:12px;border:1.5px solid #E0E0E0;background:#fff;color:#666;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer";
  var yes=document.createElement("button");yes.textContent=yesLabel||"Confirm";
  yes.style.cssText="flex:1;padding:12px;border:none;background:"+(danger===false?"linear-gradient(135deg,#3E277A,#6A4BBC)":"linear-gradient(135deg,#E53935,#C62828)")+";color:#fff;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer";
  no.onclick=function(){document.body.removeChild(wrap)};
  yes.onclick=function(){document.body.removeChild(wrap);if(onYes)onYes()};
  row.appendChild(no);row.appendChild(yes);card.appendChild(row);wrap.appendChild(card);
  wrap.onclick=function(e){if(e.target===wrap)document.body.removeChild(wrap)};
  document.body.appendChild(wrap);
}

function signInGoogle(){if(!fbOk)return;var btn=document.getElementById("GB");if(btn)btn.disabled=true;var provider=new firebase.auth.GoogleAuthProvider();auth.signInWithPopup(provider).then(function(result){var user=result.user;var nm=user.displayName||"User";var ph=user.phoneNumber?user.phoneNumber.replace("+91",""):(user.email||"google");svA(ph,nm);goApp()}).catch(function(e){if(btn)btn.disabled=false;shE("LE","Google sign-in failed: "+(e.message||""))})}
function checkRecurring(){
  if(!D.recurring||!D.recurring.length)return;
  var t=new Date();var today=tdy();
  var added=0;
  D.recurring.forEach(function(r){
    var lastAdded=r.lastAdded||"";
    var thisMonthKey=t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0");
    // Only add if today >= due day this month, and we haven't added this month
    if(t.getDate()>=r.dayOfMonth&&!lastAdded.startsWith(thisMonthKey)){
      var dueDate=t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(r.dayOfMonth).padStart(2,"0");
      D.transactions.unshift({id:genId(),type:"expense",amount:r.amount,category:r.category,note:r.name+" (auto)",date:dueDate,createdAt:Date.now(),recurring:true});
      r.lastAdded=today;added++;
    }
  });
  if(added>0){D.transactions.sort(function(a,b){return(b.date||"").localeCompare(a.date||"")});sv();toast("Added "+added+" recurring bill(s)")}
}
