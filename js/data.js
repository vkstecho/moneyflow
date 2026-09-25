/* MoneyFlow – data.js */
function goApp(){
  $("LS").classList.add("hidden");
  $("AS").classList.remove("hidden");
  uid=auth.currentUser?auth.currentUser.uid:null;
  // Isolate each user's local data under their own key (prevents cross-user data leak)
  if(uid){
    DK="mf_data_v5_"+uid;
    try{var s=localStorage.getItem(DK);D=s?JSON.parse(s):emptyD()}catch(e){D=emptyD()}
  }else{
    D=emptyD();
  }
  ensureAccounts();
  checkRecurring();
  rH();rN();rC();
  function afterReady(){
    checkRecurring();rH();rC();
    var nm=ad&&ad.name?String(ad.name).trim():"";
    if(!nm||nm==="User"){
      oM("name");
    }else{
      setTimeout(startOnboarding,400);
    }
    setTimeout(function(){scheduleReminder();checkBudgetAlert()},2000);
  }
  if(uid){cloudLoad().then(afterReady).catch(afterReady)}
  else{afterReady()}
}

// DATA
var DK="mf_v5";
function emptyD(){return{transactions:[],budgets:{},splits:[],recurring:[],monthlyBudget:33000,itr:[],accounts:[{id:"cash",name:"Cash",type:"cash",balance:0,color:"#2E7D32",icon:"💵"},{id:"bank",name:"Bank",type:"bank",balance:0,color:"#1565C0",icon:"🏦"},{id:"card",name:"Credit Card",type:"credit",balance:0,color:"#E65100",icon:"💳"}]}}
var D=emptyD();
function ensureAccounts(){if(!D.accounts||!D.accounts.length){D.accounts=[{id:"cash",name:"Cash",type:"cash",balance:0,color:"#2E7D32",icon:"💵"},{id:"bank",name:"Bank",type:"bank",balance:0,color:"#1565C0",icon:"🏦"},{id:"card",name:"Credit Card",type:"credit",balance:0,color:"#E65100",icon:"💳"}]}}
function getAccounts(){ensureAccounts();return D.accounts}
function sv(){try{localStorage.setItem(DK,JSON.stringify(D))}catch(e){}cloudSync()}
function cloudSync(){
  if(!fbOk||!uid||syncing)return;
  syncing=true;
  db.collection("users").doc(uid).set({data:D,name:(ad&&ad.name)||"User",updated:Date.now()},{merge:true})
    .then(function(){syncing=false})
    .catch(function(e){syncing=false;console.warn("Sync failed:",e.message)});
}
function cloudLoad(){
  if(!fbOk||!uid)return Promise.resolve();
  return db.collection("users").doc(uid).get().then(function(doc){
    if(doc.exists){
      var dd=doc.data();
      var cn=dd.name;
      if(cn&&cn!=="User"&&ad){
        if(!ad.name||ad.name==="User"||ad.name!==cn){ad.name=cn;localStorage.setItem(AK,JSON.stringify(ad));rH()}
      }
      var cloudData=dd.data;
      if(cloudData&&cloudData.transactions){
        // Merge: cloud wins if newer, otherwise keep local
        var cloudCount=cloudData.transactions.length;
        var localCount=D.transactions.length;
        if(cloudCount>=localCount){
          D=cloudData;
          ensureAccounts();
          localStorage.setItem(DK,JSON.stringify(D));
          toast("Synced "+cloudCount+" transactions from cloud");
        }else{
          // Local has more, push to cloud
          cloudSync();
        }
      }
    }
  }).catch(function(e){console.warn("Load failed:",e.message)});
}
var cV="home",cF="all",sT="",dateFrom="",dateTo="",catFilter="all",groupFilter="all";
function homeNav(kind){
  cV="transactions";sT="";catFilter="all";dateFrom="";dateTo="";
  if(kind==="income"){cF="income";groupFilter="all"}
  else if(kind==="expense"){cF="expense";groupFilter="all"}
  else if(kind==="need"||kind==="want"||kind==="savings"){cF="expense";groupFilter=kind}
  else{cF="all";groupFilter="all"}
  rN();rC();
}

