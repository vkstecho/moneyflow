/* MoneyFlow – init.js */
// INIT
if(fbOk){auth.onAuthStateChanged(function(user){if(user&&ad&&ad["in"])goApp();else if(!user&&!(ad&&ad["in"]))safeRL()})}
function safeRL(){try{rL()}catch(e){console.error("rL error:",e);var c=document.getElementById("LC");if(c)c.innerHTML='<div style="font-size:17px;font-weight:700;margin-bottom:4px">Welcome!</div><div style="font-size:13px;color:#999;margin-bottom:20px">Enter your phone number to get started</div><div class="xpw"><span class="xpp">+91</span><input class="xpi" id="PI" type="tel" maxlength="10" placeholder="Phone number" inputmode="numeric"></div><div id="LE" class="xerr" style="display:none"></div><button class="xbtn xbp" id="SB" onclick="sOTP()">Get OTP</button><div style="display:flex;align-items:center;gap:10px;margin:18px 0 8px"><div style="flex:1;height:1px;background:#eee"></div><span style="color:#999;font-size:11px;font-weight:600">OR</span><div style="flex:1;height:1px;background:#eee"></div></div><button class="xbtn xbo" onclick="signInGoogle()" style="display:flex;align-items:center;justify-content:center;gap:10px">Sign in with Google</button>'}}
if(ad&&ad["in"]&&isPinSet()){
  // Show PIN screen instead of app
  setTimeout(function(){verifyPin(function(){goApp();handleShareTarget();handleQuickAction()})},100);
  $("LS").classList.add("hidden");$("AS").classList.add("hidden");
}else if(!(ad&&ad["in"])){safeRL()}else{setTimeout(function(){handleShareTarget();handleQuickAction()},500)}

// WEB SHARE TARGET + SMS Parser
function parseBankSMSText(text){
  if(!text)return null;
  var t=text.replace(/\n/g," ").replace(/\s+/g," ");
  var isDebit=/debit|debited|spent|paid|sent|withdrawn|purchase|dr\.?|outward|upi.*paid|txn.*debited/i.test(t);
  var isCredit=/credit|credited|received|deposited|refund|cr\.?|inward|received from/i.test(t);
  if(!isDebit&&!isCredit)return null;
  var amt=0;
  // Multiple amount patterns (Rs, INR, ₹, and plain numbers near keywords)
  var patterns=[
    /(?:rs\.?|inr|\u20B9)\s*([\d,]+\.?\d*)/i,
    /(?:amt|amount|of)\s*(?:rs\.?|inr|\u20B9)?\s*([\d,]+\.?\d*)/i,
    /([\d,]+\.?\d*)\s*(?:rs\.?|inr|\u20B9)/i
  ];
  for(var pi=0;pi<patterns.length;pi++){
    var m=t.match(patterns[pi]);
    if(m){amt=parseFloat(m[1].replace(/,/g,""));if(amt>0)break}
  }
  if(!amt||amt<=0)return null;
  // Merchant extraction (improved)
  var merchant="";
  var mm=t.match(/(?:at|to|from|paid to|sent to|received from|towards|for)\s+([A-Za-z0-9\s&.@\-\/]{2,40}?)(?:\s+(?:on|ref|upi|via|txn|amt|rs|inr|info|avl|available|a\/c|account)|$)/i);
  if(mm)merchant=mm[1].trim().replace(/\s+/g," ").slice(0,40);
  if(!merchant){
    var mm2=t.match(/(?:VPA|UPI ID)[:\s]+([A-Za-z0-9@.]+)/i);
    if(mm2)merchant=mm2[1].slice(0,30);
  }
  // Auto-categorize (expanded keywords)
  var cat="other";
  var combined=(merchant+" "+t).toLowerCase();
  var keywords={
    food:["swiggy","zomato","restaurant","cafe","hotel","dominos","mcdonald","kfc","starbucks","burger"],
    groceries:["bigbasket","blinkit","zepto","dmart","grocery","reliance fresh","more supermarket","jiomart"],
    shopping:["amazon","flipkart","myntra","ajio","meesho","nykaa","snapdeal","tata cliq"],
    bills:["electricity","airtel","jio","vodafone","recharge","bill","bsnl","tata power","bescom","water bill","gas bill"],
    fuel:["petrol","diesel","fuel","hp petrol","bpcl","iocl","indian oil","shell"],
    transport:["uber","ola","irctc","metro","cab","rapido","train","flight","indigo","air india"],
    health:["pharmacy","medical","hospital","apollo","medplus","1mg","netmeds","practo"],
    entertainment:["netflix","hotstar","spotify","movie","bookmyshow","prime video","youtube premium","disney"],
    insurance:["insurance","policy","lic","acko","digit","policybazaar"],
    rent:["rent","landlord","house rent"],
    education:["school","college","course","udemy","byju","unacademy"]
  };
  for(var k in keywords){if(keywords[k].some(function(w){return combined.indexOf(w)>-1})){cat=k;break}}
  if(isCredit){cat=/salary|sal cr|salary credit/i.test(t)?"salary":"family"}
  return{type:isCredit?"income":"expense",amount:amt,category:cat,note:merchant||"From SMS",date:tdy(),tags:["from-sms"]};
}
function handleShareTarget(){
  var params=new URLSearchParams(window.location.search);
  if(!params.get("share"))return false;
  var text=params.get("text")||params.get("title")||"";
  if(!text)return false;
  var parsed=parseBankSMSText(text);
  if(!parsed){toast("Could not detect transaction from message");return true}
  // Wait for app to be ready then open modal
  setTimeout(function(){
    if(!ad||!ad["in"]){toast("Please login first to add transaction");return}
    oM("add");
    mS=Object.assign({},mS,parsed,{tags:["from-sms"]});
    rM();
    toast("\u{1F4F2} SMS detected! Review and save");
    // Clear URL params
    window.history.replaceState({},document.title,"/");
  },1000);
  return true;
}
// Quick action shortcuts
function handleQuickAction(){
  var params=new URLSearchParams(window.location.search);
  var act=params.get("action");
  if(!act)return;
  setTimeout(function(){
    if(!ad||!ad["in"])return;
    if(act==="expense"){oM("add");mS.type="expense";rM()}
    else if(act==="income"){oM("add");mS.type="income";rM()}
    else if(act==="reports"){sV("reports")}
    window.history.replaceState({},document.title,"/");
  },1000);
}

// PWA: Service Worker + Install Prompt
var deferredPrompt=null;
if("serviceWorker" in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("/sw.js").then(function(reg){console.log("SW registered")}).catch(function(e){console.warn("SW failed",e)})})}
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();deferredPrompt=e;showInstallBtn()});
window.addEventListener("appinstalled",function(){deferredPrompt=null;hideInstallBtn();toast("App installed!")});
function showInstallBtn(){var b=document.getElementById("installBtn");if(b){b.style.display="flex"}else{var btn=document.createElement("button");btn.id="installBtn";btn.innerHTML="\u{1F4F2} Install App";btn.onclick=installApp;btn.style.cssText="position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#3E277A,#6A4BBC);color:#fff;border:none;padding:12px 24px;border-radius:50px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 6px 20px rgba(62,39,122,.4);z-index:999;display:flex;align-items:center;gap:8px;font-family:DM Sans,sans-serif";document.body.appendChild(btn)}}
function hideInstallBtn(){var b=document.getElementById("installBtn");if(b)b.style.display="none"}
function installApp(){if(!deferredPrompt)return;deferredPrompt.prompt();deferredPrompt.userChoice.then(function(){deferredPrompt=null;hideInstallBtn()})}