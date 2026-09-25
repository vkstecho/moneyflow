/* MoneyFlow – constants.js */
var BASE_CATS=[
{id:"food",l:"Food & Drinks",i:"🍔",c:"#FF6B6B",t:"e",g:"need"},
{id:"groceries",l:"Groceries",i:"🛒",c:"#4CAF50",t:"e",g:"need"},
{id:"vegetables",l:"Vegetables & Fruits",i:"🥬",c:"#66BB6A",t:"e",g:"need"},
{id:"bills",l:"Bills & Utilities",i:"📄",c:"#FF9800",t:"e",g:"need"},
{id:"transport",l:"Transport & Travel",i:"🚗",c:"#9C27B0",t:"e",g:"need"},
{id:"fuel",l:"Fuel",i:"⛽",c:"#795548",t:"e",g:"need"},
{id:"health",l:"Health & Medical",i:"💊",c:"#00BCD4",t:"e",g:"need"},
{id:"rent",l:"Rent & Housing",i:"🏠",c:"#E64A19",t:"e",g:"need"},
{id:"dailycare",l:"Daily Care",i:"🧴",c:"#8D6E63",t:"e",g:"need"},
{id:"insurance",l:"Insurance",i:"🛡️",c:"#37474F",t:"e",g:"need"},
{id:"shopping",l:"Shopping",i:"🛍️",c:"#2196F3",t:"e",g:"want"},
{id:"entertainment",l:"Entertainment",i:"🎬",c:"#E91E63",t:"e",g:"want"},
{id:"education",l:"Education",i:"📚",c:"#FFC107",t:"e",g:"want"},
{id:"other",l:"Other",i:"📦",c:"#78909C",t:"e",g:"want"},
{id:"investment",l:"Investment",i:"📈",c:"#558B2F",t:"e",g:"savings"},
{id:"salary",l:"Salary",i:"💰",c:"#2E7D32",t:"i",g:"income"},
{id:"family",l:"From Friends & Family",i:"👥",c:"#6A4BBC",t:"i",g:"income"}
];
var CATS=BASE_CATS.concat((function(){try{return JSON.parse(localStorage.getItem("mf_custom_cats")||"[]")}catch(e){return[]}})());
var AXIO_MAP={
"FOOD & DRINKS":"food","VEGETABLES":"vegetables","FRUITS":"vegetables",
"GROCERIES":"groceries","SHOPPING":"shopping","BILLS":"bills",
"TRANSPORT":"transport","TRAVEL":"transport","FUEL":"fuel",
"ENTERTAINMENT":"entertainment","HEALTH":"health","EDUCATION":"education",
"RENT":"rent","HOME":"rent","DAILY CARE":"dailycare","BABY CARE":"dailycare",
"INVESTMENT":"investment","INSURANCE":"insurance","OTHER":"other",
"LEN DEN":"other","CREDIT":"family","SALARY":"salary",
"REFUND":"family","BILL PAYMENT":"other","TRANSFER":"other"
};
var MO=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function gC(id){for(var i=0;i<CATS.length;i++)if(CATS[i].id===id)return CATS[i];return CATS[CATS.length-1]}
function iCats(){return CATS.filter(function(c){return c.t==="i"})}
function eCats(){return CATS.filter(function(c){return c.t==="e"})}
var CURRENCIES={INR:{s:"\u20B9",n:"Indian Rupee",code:"INR"},USD:{s:"$",n:"US Dollar",code:"USD"},EUR:{s:"\u20AC",n:"Euro",code:"EUR"},GBP:{s:"\u00A3",n:"Pound",code:"GBP"},AED:{s:"AED ",n:"UAE Dirham",code:"AED"},SGD:{s:"S$",n:"Singapore $",code:"SGD"}};
function getCurrency(){return localStorage.getItem("mf_curr")||"INR"}
function setCurrency(c){localStorage.setItem("mf_curr",c);toast("Currency: "+CURRENCIES[c].n);rH();rC();rM()}
function getCurrSym(){return CURRENCIES[getCurrency()].s}
function fm(n){var s=getCurrSym();var a=Math.abs(n);return a>=1e5?s+(a/1e5).toFixed(1)+"L":a>=1e3?s+(a/1e3).toFixed(1)+"K":s+a.toLocaleString("en-IN")}
function fF(n){return getCurrSym()+Math.abs(n).toLocaleString("en-IN",{maximumFractionDigits:0})}
function fP(n){var c=getCurrency();var sym=c==="INR"?"Rs. ":CURRENCIES[c].s;var loc=c==="INR"?"en-IN":"en-US";return sym+Math.round(Math.abs(n||0)).toLocaleString(loc)}
function genId(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function tdy(){return new Date().toISOString().split("T")[0]}
function tMo(){var d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")}
function esc(s){var d=document.createElement("div");d.textContent=s;return d.innerHTML}
function $(id){return document.getElementById(id)}

