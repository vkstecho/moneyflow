/* MoneyFlow – settings.js */
// SETTINGS
function rStM(){
  var hasPic=ad&&ad.pic;
  var hasPhone=ad&&ad.phone&&ad.phone.length===10;
  var bioOn=isBiometricEnabled();
  var bioSupp=isBiometricSupported();
  var nm=ad?ad.name:"User";var ini=nm.charAt(0).toUpperCase();
  
  var h='<div class="mh"><span class="xmt">Settings</span><button class="xmc" onclick="cM()">\u00D7</button></div>';
  
  // Profile section
  h+='<div style="text-align:center;padding:8px 0 20px"><div class="profile-pic-wrap" onclick="uploadProfilePic()"><div class="profile-pic">'+(hasPic?'<img src="'+ad.pic+'">':ini)+'</div><div class="profile-edit">\u270F\uFE0F</div></div><div style="font-weight:700;font-size:18px;color:#1a1a1a">'+esc(nm)+'</div><div style="color:#999;font-size:13px;margin-top:2px">'+(hasPhone?"+91 "+ad.phone:"No mobile linked")+'</div><button class="eb" style="margin-top:10px;padding:8px 20px;font-size:12px;background:#EDE7F6;color:#3E277A;font-weight:600" onclick="cM();editProfile()">\u270F\uFE0F Edit Profile</button></div>';
  
  // Account section
  h+='<div class="section-divider">Account</div>';
  
  if(!hasPhone){
    h+='<div class="set-card" onclick="addMobileNumber()"><div class="set-icon" style="background:#E3F2FD">\u{1F4F1}</div><div class="set-text"><div class="set-title">Add Mobile Number</div><div class="set-sub">Link your phone for SMS tracking</div></div><div class="set-arrow">\u203A</div></div>';
  }

  // Accounts / Sources (Axio-style)
  h+='<div class="section-divider" id="accSection">Accounts & Sources</div>';
  ensureAccounts();
  getAccounts().forEach(function(a){
    h+='<div class="set-card" style="padding:12px 14px"><div class="set-icon" style="background:'+a.color+'18;width:36px;height:36px;font-size:16px">'+a.icon+'</div><div class="set-text"><div class="set-title" style="font-size:13px">'+esc(a.name)+'</div><div class="set-sub">'+a.type+' · '+fF(a.balance||0)+'</div></div><button class="eb" style="padding:4px 10px;font-size:11px" onclick="editAccount(\''+a.id+'\')">Edit</button><button class="dl" onclick="deleteAccount(\''+a.id+'\')" style="margin-left:4px">\u00D7</button></div>';
  });
  h+='<div class="set-card" onclick="addAccount()"><div class="set-icon" style="background:#E8F5E9">\u2795</div><div class="set-text"><div class="set-title">Add Account</div><div class="set-sub">Cash, Bank, Card, Wallet...</div></div><div class="set-arrow">\u203A</div></div>';
  
  // Biometric section
  if(bioSupp){
    h+='<div class="section-divider">Security</div>';
    if(bioOn){
      h+='<div class="set-card" onclick="disableBiometric()"><div class="set-icon" style="background:#E8F5E9">\u{1F510}</div><div class="set-text"><div class="set-title">Fingerprint Login</div><div class="set-sub">Enabled - tap to disable</div></div><div class="set-toggle on"></div></div>';
    }else{
      h+='<div class="set-card" onclick="setupBiometric()"><div class="set-icon" style="background:#FFF3E0">\u{1F510}</div><div class="set-text"><div class="set-title">Enable Fingerprint Login</div><div class="set-sub">Skip OTP next time</div></div><div class="set-toggle"></div></div>';
    }
  }
  
  // Data section
  // Theme toggle
var darkOn=getTheme()==="dark";
h+='<div class="section-divider">Appearance</div>';
h+='<div class="set-card" onclick="toggleTheme()"><div class="set-icon" style="background:'+(darkOn?"#1a1d27":"#FFF3E0")+'">'+(darkOn?"🌙":"☀️")+'</div><div class="set-text"><div class="set-title">Dark Mode</div><div class="set-sub">'+(darkOn?"Currently on - tap to disable":"Tap to enable")+'</div></div><div class="set-toggle'+(darkOn?" on":"")+'"></div></div>';
// Custom categories
h+='<div class="section-divider">Categories</div>';
var customCats=getCustomCats();
h+='<div class="set-card" onclick="addCustomCategory()"><div class="set-icon" style="background:#E8F5E9">➕</div><div class="set-text"><div class="set-title">Add Custom Category</div><div class="set-sub">'+customCats.length+' custom categor'+(customCats.length===1?"y":"ies")+' added</div></div><div class="set-arrow">›</div></div>';
customCats.forEach(function(c){
  h+='<div class="set-card" style="padding:10px 14px"><div class="set-icon" style="background:'+c.c+'15;width:32px;height:32px;font-size:16px">'+c.i+'</div><div class="set-text"><div class="set-title" style="font-size:13px">'+esc(c.l)+'</div><div class="set-sub">'+c.g.charAt(0).toUpperCase()+c.g.slice(1)+'</div></div><button class="dl" onclick="deleteCustomCategory(\''+c.id+'\')">×</button></div>';
});
// PIN
var pinOn=isPinSet();
h+='<div class="section-divider">Privacy</div>';
if(pinOn){
  h+='<div class="set-card" onclick="disablePin()"><div class="set-icon" style="background:#E8F5E9">🔢</div><div class="set-text"><div class="set-title">PIN Lock</div><div class="set-sub">Enabled - tap to disable</div></div><div class="set-toggle on"></div></div>';
}else{
  h+='<div class="set-card" onclick="setupPin()"><div class="set-icon" style="background:#FFF3E0">🔢</div><div class="set-text"><div class="set-title">Set up PIN Lock</div><div class="set-sub">4-digit PIN as backup to fingerprint</div></div><div class="set-toggle"></div></div>';
}
// Currency
var currCurr=getCurrency();
h+='<div class="section-divider">Currency</div>';
h+='<div class="set-card"><div class="set-icon" style="background:#E1F5FE">'+CURRENCIES[currCurr].s+'</div><div class="set-text"><div class="set-title">'+CURRENCIES[currCurr].n+' ('+currCurr+')</div><div class="set-sub">Tap below to change</div></div></div>';
h+='<div style="background:var(--card);border-radius:14px;padding:12px;margin-bottom:10px"><div class="curr-grid">';
Object.keys(CURRENCIES).forEach(function(k){h+='<button class="curr-btn'+(currCurr===k?" a":"")+'" onclick="setCurrency(\''+k+'\')"><div class="curr-sym">'+CURRENCIES[k].s+'</div><div class="curr-name">'+k+'</div></button>'});
h+='</div></div>';
// Notifications
var notifP=getNotifPerm();
h+='<div class="section-divider">Notifications</div>';
if(notifP==="granted"){h+='<div class="set-card"><div class="set-icon" style="background:#E8F5E9">\u{1F514}</div><div class="set-text"><div class="set-title">Notifications Enabled</div><div class="set-sub">Daily reminders & budget alerts on</div></div><div class="set-toggle on"></div></div>';}
else{h+='<div class="set-card" onclick="requestNotifPerm()"><div class="set-icon" style="background:#FFF3E0">\u{1F514}</div><div class="set-text"><div class="set-title">Enable Notifications</div><div class="set-sub">Get daily reminders & alerts</div></div><div class="set-toggle"></div></div>';}
// Premium
h+='<div class="section-divider">Premium</div>';
h+='<div class="set-card" onclick="showPremiumModal()" style="background:linear-gradient(135deg,#FFD700,#FFA000);color:#000"><div class="set-icon" style="background:rgba(0,0,0,.1);color:#000">\u{1F48E}</div><div class="set-text"><div class="set-title" style="color:#000">MoneyFlow Premium</div><div class="set-sub" style="color:rgba(0,0,0,.7)">Unlock all features</div></div><div class="set-arrow" style="color:#000">\u203A</div></div>';
h+='<div class="section-divider">Data</div>';
  h+='<div class="set-card" onclick="cM();oM(\'pdfrange\')"><div class="set-icon" style="background:#EDE7F6">\u{1F4C4}</div><div class="set-text"><div class="set-title">Export Statement</div><div class="set-sub">Download PDF report</div></div><div class="set-arrow">\u203A</div></div>';
  h+='<div class="set-card" onclick="cM();importPDF()"><div class="set-icon" style="background:#FFF3E0">\u{1F4E5}</div><div class="set-text"><div class="set-title">Import data from other app</div><div class="set-sub">Migrate transactions from another finance app</div></div><div class="set-arrow">\u203A</div></div>';
  
  // Sharing
  h+='<div class="set-card" onclick="cM();backupJSON()"><div class="set-icon" style="background:#E1F5FE">\u{1F4BE}</div><div class="set-text"><div class="set-title">Backup Data</div><div class="set-sub">Download as JSON file</div></div><div class="set-arrow">\u203A</div></div>';h+='<div class="set-card" onclick="cM();restoreJSON()"><div class="set-icon" style="background:#F3E5F5">\u{1F504}</div><div class="set-text"><div class="set-title">Restore Backup</div><div class="set-sub">Import from JSON file</div></div><div class="set-arrow">\u203A</div></div>';h+='<div class="section-divider">Share</div>';
  h+='<div class="set-card" onclick="cM();shareApp()"><div class="set-icon" style="background:#E8F5E9">\u{1F4F2}</div><div class="set-text"><div class="set-title">Share App</div><div class="set-sub">Tell your friends about MoneyFlow</div></div><div class="set-arrow">\u203A</div></div>';
  
  // Stats
  h+='<div style="text-align:center;color:#999;font-size:12px;margin:20px 0">'+D.transactions.length+' transactions \u00B7 '+D.splits.length+' splits \u00B7 '+D.recurring.length+' bills</div>';
  
  // Danger zone
  h+='<div class="section-divider" style="color:#E53935">Danger Zone</div>';
  h+='<div class="set-card" onclick="clearAll()"><div class="set-icon" style="background:#FFEBEE">\u{1F5D1}\uFE0F</div><div class="set-text"><div class="set-title" style="color:#E53935">Clear All Data</div><div class="set-sub">Permanently delete everything</div></div></div>';
  h+='<div class="set-card" onclick="cM();logout()"><div class="set-icon" style="background:#FFEBEE">\u{1F6AA}</div><div class="set-text"><div class="set-title" style="color:#E53935">Logout</div><div class="set-sub">Sign out of MoneyFlow</div></div></div>';
  
  h+='<div style="text-align:center;color:#bbb;font-size:11px;margin-top:24px;padding-top:16px;border-top:1px solid #f0f0f0">Powered by VKS Tech<br>moneyflow.vkstech.com</div>';
  
  return h;
}
function clearAll(){if(confirm("Delete ALL data?")){D=emptyD();sv();toast("Cleared");cM();rC()}}
