/* MoneyFlow – export.js */
// PDF EXPORT
function exportPDF(fromD,toD){
  toast("Generating statement...");
  setTimeout(function(){try{
    var jsPDF=window.jspdf.jsPDF;
    var doc=new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    var W=210,H=297,M=15;
    var PURPLE=[62,39,122],GREEN=[46,125,50],RED=[197,40,40],GREY=[120,120,120],LILAC=[214,198,240];

    // Filter: date range + exclude non-counted transactions
    var txns=D.transactions.filter(function(t){
      if(t.excluded)return false;
      if(!t.date)return false;
      if(fromD&&t.date<fromD)return false;
      if(toD&&t.date>toD)return false;
      return true;
    });
    function fmtD(s){try{return new Date(s).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}catch(e){return s}}
    var periodTxt=(fromD||toD)?((fromD?fmtD(fromD):"Start")+"  -  "+(toD?fmtD(toD):"Today")):"All Time";

    // ---- HEADER BAND ----
    doc.setFillColor(PURPLE[0],PURPLE[1],PURPLE[2]);
    doc.rect(0,0,W,40,"F");
    try{doc.addImage(MF_LOGO,"JPEG",M,7,26,26)}catch(e){}
    doc.setTextColor(255,255,255);
    doc.setFont("helvetica","bold");doc.setFontSize(20);
    doc.text("MoneyFlow",M+31,16.5);
    doc.setFont("helvetica","normal");doc.setFontSize(8.5);
    doc.setTextColor(LILAC[0],LILAC[1],LILAC[2]);
    doc.text("Powered by VKS Tech",M+31,22);
    var pbw=doc.getTextWidth("Powered by VKS Tech");
    try{doc.addImage(VKS_LOGO,"JPEG",M+31+pbw+1.8,18.6,4.6,4.6)}catch(e){}
    doc.setTextColor(255,255,255);doc.setFontSize(10);doc.setFont("helvetica","bold");
    doc.text("Account Statement",M+31,29);
    // right-side account info
    doc.setFontSize(9.5);doc.setFont("helvetica","bold");doc.setTextColor(255,255,255);
    doc.text(ad&&ad.name?ad.name:"User",W-M,11.5,{align:"right"});
    doc.setFont("helvetica","normal");doc.setFontSize(8);doc.setTextColor(LILAC[0],LILAC[1],LILAC[2]);
    var ry=16;
    if(ad&&ad.phone&&/^[0-9]{10}$/.test(ad.phone)){doc.text("+91 "+ad.phone,W-M,ry,{align:"right"});ry+=4.3}
    doc.text("Period: "+periodTxt,W-M,ry,{align:"right"});ry+=4.3;
    doc.text("Generated: "+fmtD(new Date()),W-M,ry,{align:"right"});ry+=4.3;
    doc.text(txns.length+" transaction"+(txns.length===1?"":"s"),W-M,ry,{align:"right"});

    // ---- SUMMARY ----
    var inc=0,exp=0;
    txns.forEach(function(t){if(t.type==="income")inc+=t.amount;else if(t.type==="expense")exp+=t.amount});
    var net=inc-exp;
    var nws=getNWS(txns);
    var y=52;
    var cardW=(W-2*M-12)/3,cardH=22,gap=6;
    function sumCard(x,label,value,col){
      doc.setFillColor(248,246,252);
      doc.roundedRect(x,y,cardW,cardH,2.5,2.5,"F");
      doc.setFont("helvetica","normal");doc.setFontSize(7.5);doc.setTextColor(GREY[0],GREY[1],GREY[2]);
      doc.text(label,x+cardW/2,y+8,{align:"center"});
      doc.setFont("helvetica","bold");doc.setFontSize(12.5);doc.setTextColor(col[0],col[1],col[2]);
      doc.text(value,x+cardW/2,y+16,{align:"center"});
    }
    sumCard(M,"TOTAL INCOME",fP(inc),GREEN);
    sumCard(M+cardW+gap,"TOTAL EXPENSE",fP(exp),RED);
    sumCard(M+2*(cardW+gap),"NET BALANCE",(net<0?"-":"")+fP(net),net<0?RED:PURPLE);
    y+=cardH+8;
    doc.setDrawColor(232,228,240);doc.setFillColor(252,251,254);
    doc.roundedRect(M,y,W-2*M,12,2,2,"FD");
    doc.setFontSize(8.5);doc.setFont("helvetica","bold");
    var seg=(W-2*M)/3;
    doc.setTextColor(GREEN[0],GREEN[1],GREEN[2]);
    doc.text("Needs  "+fP(nws.need),M+seg*0.5,y+7.5,{align:"center"});
    doc.setTextColor(230,81,0);
    doc.text("Wants  "+fP(nws.want),M+seg*1.5,y+7.5,{align:"center"});
    doc.setTextColor(21,101,192);
    doc.text("Savings  "+fP(nws.savings),M+seg*2.5,y+7.5,{align:"center"});
    y+=19;

    // ---- TRANSACTION TABLE ----
    if(txns.length>0){
      var sorted=txns.slice().sort(function(a,b){return(b.date||"").localeCompare(a.date||"")});
      var rows=sorted.map(function(t){
        var c=gC(t.category),isInc=t.type==="income";
        return[t.date||"-",t.note||c.l,c.l,c.g||"-",isInc?"CR":"DR",isInc?fP(t.amount):"",!isInc?fP(t.amount):""];
      });
      doc.autoTable({
        startY:y,
        head:[["Date","Description","Category","Group","Dr/Cr","Income","Expense"]],
        body:rows,
        foot:[["","","","","TOTAL",fP(inc),fP(exp)]],
        styles:{fontSize:7.5,cellPadding:2,lineColor:[236,236,236],lineWidth:0.1,textColor:[45,45,45],valign:"middle"},
        headStyles:{fillColor:PURPLE,textColor:[255,255,255],fontStyle:"bold",fontSize:7.5},
        footStyles:{fillColor:[237,231,246],textColor:PURPLE,fontStyle:"bold",fontSize:8},
        alternateRowStyles:{fillColor:[250,249,252]},
        columnStyles:{
          0:{cellWidth:20},
          2:{cellWidth:26},
          3:{cellWidth:18,halign:"center"},
          4:{cellWidth:14,halign:"center"},
          5:{cellWidth:25,halign:"right"},
          6:{cellWidth:25,halign:"right"}
        },
        margin:{left:M,right:M,bottom:18},
        didParseCell:function(data){
          if(data.section==="body"){
            if(data.column.index===4){data.cell.styles.textColor=data.cell.raw==="CR"?GREEN:RED;data.cell.styles.fontStyle="bold"}
            if(data.column.index===5&&data.cell.raw)data.cell.styles.textColor=GREEN;
            if(data.column.index===6&&data.cell.raw)data.cell.styles.textColor=RED;
          }
        }
      });
    }else{
      doc.setFontSize(10);doc.setFont("helvetica","normal");doc.setTextColor(GREY[0],GREY[1],GREY[2]);
      doc.text("No transactions in the selected period.",W/2,y+12,{align:"center"});
    }

    // ---- FOOTER (every page) ----
    var pages=doc.internal.getNumberOfPages();
    for(var p=1;p<=pages;p++){
      doc.setPage(p);
      var fy=H-9;
      doc.setDrawColor(232,228,240);doc.line(M,fy-4.5,W-M,fy-4.5);
      doc.setFontSize(7.5);doc.setFont("helvetica","bold");doc.setTextColor(PURPLE[0],PURPLE[1],PURPLE[2]);
      var bw=doc.getTextWidth("MoneyFlow");
      doc.text("MoneyFlow",M,fy);
      doc.setFont("helvetica","normal");doc.setTextColor(GREY[0],GREY[1],GREY[2]);
      doc.text(" - Powered by VKS Tech",M+bw,fy);
      doc.text("moneyflow.vkstech.com",W/2,fy,{align:"center"});
      doc.text("Page "+p+" of "+pages,W-M,fy,{align:"right"});
    }

    doc.save("MoneyFlow_Statement_"+(fromD||"all")+"_to_"+(toD||"now")+".pdf");
    toast("Statement downloaded!");
  }catch(e){toast("Error: "+(e.message||e))}},300);
}

// PDF IMPORT (Axio format)
function backupJSON(){
  var data={data:D,exported:new Date().toISOString(),user:ad?ad.name:"User",version:"5"};
  var blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  var url=URL.createObjectURL(blob);
  var a=document.createElement("a");a.href=url;
  a.download="MoneyFlow_Backup_"+new Date().toISOString().slice(0,10)+".json";
  a.click();URL.revokeObjectURL(url);
  toast("Backup downloaded!");
}
function restoreJSON(){
  var inp=document.createElement("input");inp.type="file";inp.accept=".json";
  inp.onchange=function(e){
    var f=e.target.files[0];if(!f)return;
    var r=new FileReader();
    r.onload=function(ev){
      try{
        var imp=JSON.parse(ev.target.result);
        if(!imp.data||!imp.data.transactions)return toast("Invalid backup file");
        if(!confirm("Replace all current data with backup? This cannot be undone."))return;
        D=imp.data;sv();toast("Restored "+D.transactions.length+" transactions!");cM();rC();
      }catch(err){toast("Error: "+err.message)}
    };
    r.readAsText(f);
  };
  inp.click();
}
function importPDF(){
  var inp=document.createElement("input");inp.type="file";inp.accept=".pdf";
  inp.onchange=function(e){
    var file=e.target.files[0];if(!file)return;
    toast("Processing PDF...");
    var reader=new FileReader();
    reader.onload=function(ev){
      var data=new Uint8Array(ev.target.result);
      if(!window.pdfjsLib){toast("PDF.js not loaded");return}
      pdfjsLib.getDocument({data:data}).promise.then(function(pdf){
        var allText="";var promises=[];
        for(var i=1;i<=pdf.numPages;i++){
          promises.push(pdf.getPage(i).then(function(page){
            return page.getTextContent().then(function(tc){
              return tc.items.map(function(it){return it.str}).join(" ");
            })
          }))
        }
        Promise.all(promises).then(function(pages){
          allText=pages.join("\n");
          parseAxio(allText);
        });
      }).catch(function(e){toast("Error reading PDF: "+e.message)});
    };
    reader.readAsArrayBuffer(file);
  };
  inp.click();
}

function parseAxio(text){
  var fullText=text;
  // Month name to number map
  var MONTHS={jan:"01",feb:"02",mar:"03",apr:"04",may:"05",jun:"06",jul:"07",aug:"08",sep:"09",oct:"10",nov:"11",dec:"12"};
  // Parse various date formats: "15 Jan 2024", "15/01/2024", "2024-01-15", "Jan 15, 2024"
  function parseDate(str){
    var m;
    // ISO: 2024-01-15
    m=str.match(/(\d{4})-(\d{2})-(\d{2})/);
    if(m)return m[1]+"-"+m[2]+"-"+m[3];
    // DD Mon YYYY or DD/Mon/YYYY
    m=str.match(/(\d{1,2})[\/\-\s]+([A-Za-z]{3,9})[\/\-\s,\s]+(\d{4})/);
    if(m){var mo=MONTHS[m[2].slice(0,3).toLowerCase()];if(mo)return m[3]+"-"+mo+"-"+m[1].padStart(2,"0")}
    // Mon DD YYYY or Mon DD, YYYY
    m=str.match(/([A-Za-z]{3,9})[\/\-\s]+(\d{1,2})[\/\-\s,\s]+(\d{4})/);
    if(m){var mo=MONTHS[m[1].slice(0,3).toLowerCase()];if(mo)return m[3]+"-"+mo+"-"+m[2].padStart(2,"0")}
    // DD/MM/YYYY or DD-MM-YYYY
    m=str.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if(m)return m[3]+"-"+m[2].padStart(2,"0")+"-"+m[1].padStart(2,"0");
    return "";
  }
  // Match amounts with DR/CR or Debit/Credit (case-insensitive, full words)
  var txRe=/([\d,]+(?:\.\d{1,2})?)\s+(DR|CR|Debit|Credit)(?:\s|$)/gi;
  var matches=[];var m;
  while((m=txRe.exec(fullText))!==null){
    var start=Math.max(0,m.index-300);
    var end=Math.min(fullText.length,m.index+400);
    var ctx=fullText.substring(start,end);
    // Find date in context window
    var date=parseDate(ctx);
    if(!date)continue;
    var amt=parseFloat(m[1].replace(/,/g,""));
    if(!amt||amt<=0)continue;
    var typeStr=m[2].toUpperCase();
    var type=(typeStr==="CR"||typeStr==="CREDIT")?"income":"expense";
    // Category from text around the match
    var afterDR=fullText.substring(m.index,m.index+400);
    var cat="other";
    var catNames=Object.keys(AXIO_MAP);
    catNames.sort(function(a,b){return b.length-a.length});
    for(var i=0;i<catNames.length;i++){if(afterDR.toUpperCase().indexOf(catNames[i])!==-1){cat=AXIO_MAP[catNames[i]];break}}
    // Note: text before amount, grab a meaningful merchant name
    var beforeAmt=fullText.substring(Math.max(0,m.index-250),m.index);
    var noteMatch=beforeAmt.match(/([A-Za-z][A-Za-z0-9\s&@.\-\/]{3,50})\s*[\d,]+\s*$/);
    var note=noteMatch?noteMatch[1].trim().replace(/\s+/g," "):"";
    if(note.length>60)note=note.slice(-60);
    matches.push({date:date,amount:amt,type:type,category:cat,note:note||"Imported"});
  }
  // Deduplicate by date+amount+type
  var seen={};var unique=[];
  matches.forEach(function(mx){
    var key=mx.date+"-"+mx.amount+"-"+mx.type;
    if(!seen[key]){seen[key]=true;unique.push(mx)}
  });
  if(!unique.length){
    toast("No transactions found. PDF may use image pages or unsupported format.");
    return;
  }
  var added=0;
  unique.forEach(function(mx){
    var exists=D.transactions.some(function(t){return t.date===mx.date&&t.amount===mx.amount&&t.type===mx.type});
    if(!exists){
      D.transactions.push({id:genId(),type:mx.type,amount:mx.amount,category:mx.category,note:mx.note,date:mx.date,createdAt:Date.now(),imported:true});
      added++;
    }
  });
  D.transactions.sort(function(a,b){return(b.date||"").localeCompare(a.date||"")});
  sv();
  toast("Imported "+added+" of "+unique.length+" transactions!");
  cM();rC();
}

