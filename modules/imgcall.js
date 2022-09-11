
  const tierCost = [0,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,65536,131072]

const trait1Search = ["NONE","COMPUTER","STORAGE","FOOD","CANDY","MEAT","HOT","COLD","ELECTRIC","SHARP","BLUNT","SHITTY","CUTE","SPOOKY","CAT","DOG","BROKEN","CUSHIONED","BUSINESS","BOUNCY","STICKY","MELEE","RANGED","MAGIC","REFINED","VAMPIRIC","FROG","HARLEQUIN","WIZARD","PLUSH","SCIENTIFIC","HEAVY","LIGHTWEIGHT","PROSPIT","DERSE","ENDURING","THORNS","ROCKET","GAMBLING","IRRADIATED","NOIR","CHARLATAN","EXQUISITE","GRIMDARK","META","WELSH", "TRICKSTER","BREATH","LIFE","LIGHT","TIME","HEART","RAGE","BLOOD","VOID","SPACE","MIND","HOPE","DOOM"]
const  trait2Search = ["NONE","DOOM","HOPE","MIND","SPACE","VOID","BLOOD","RAGE","HEART","TIME","LIGHT","LIFE","BREATH","TRICKSTER","WELSH","META","GRIMDARK","EXQUISITE","CHARLATAN","NOIR","IRRADIATED","GAMBLING","ROCKET","THORNS","ENDURING","DERSE","PROSPIT","LIGHTWEIGHT","HEAVY","SCIENTIFIC","PLUSH","WIZARD","HARLEQUIN","FROG","VAMPIRIC","REFINED","MAGIC","RANGED","MELEE","STICKY","BOUNCY","BUSINESS","CUSHIONED","BROKEN","DOG","CAT","SPOOKY","CUTE","SHITTY","BLUNT","SHARP","ELECTRIC","COLD","HOT","MEAT","CANDY","FOOD","STORAGE","COMPUTER"];

const RINGKIND_INDEX = 64;

const CARDBACK_HEADER_HEIGHT = 32;
const CARDBACK_HEADER_WIDTH = 146;
const CARDBACK_MAIN_OFFSET_X = 154;
const CARDBACK_MAIN_OFFSET_Y = 96;
const CARDBACK_TEXTBOX_HEIGHT = 48;
const CARDBACK_TEXTBOX_MARGIN = 2;
const CARDBACK_TEXTBOX_OFFSET = 40;
const CARDBACK_TEXTBOX_WIDTH = 146;
const CARDBACK_TRAITSTART_X = 16;
const CARDBACK_TRAITSTART_Y = 140;

const TRAIT_IMAGE_SIZE = 32;

const TRAIT1_TEXT_X = CARDBACK_TRAITSTART_X + TRAIT_IMAGE_SIZE + CARDBACK_TEXTBOX_MARGIN;
const TRAIT2_TEXT_X = CARDBACK_TRAITSTART_X + CARDBACK_MAIN_OFFSET_X + TRAIT_IMAGE_SIZE + CARDBACK_TEXTBOX_MARGIN;


const textSplitMode = 0;

exports.sdexCheck = async function (client, message,page, args, type, sdex, cards,banner){
  client.Canvas.registerFont("./miscsprites/fontstuck.ttf",{family:`FONTSTUCK`});
  client.Canvas.registerFont("./miscsprites/Courier Std Bold.otf",{family:`Courier Standard Bold`});
  const canvas = client.Canvas.createCanvas(1056,560);
  const ctx = canvas.getContext('2d');
  const ITEMS_PER_PAGE = 10;

  //list light, list dark, card fg, card bg, card shade

  let scheme = ["#992445","#0c6137","#992ae1","#484848"];
  let typeList = ["sylladex","strife specibus","container","room inventory"];
  let cardList = ["captchalogue cards","strife cards","storage space","room space"]
  let usedCards = sdex.length;
  let maxPage = Math.floor((usedCards-1)/ITEMS_PER_PAGE);

//set background
  ctx.linewidth = 5;

//set top text line

  ctx.fillStyle = scheme[type];
  ctx.fillRect(0,0,canvas.width,32);

  ctx.fillStyle = "#ffffff";
  ctx.font = `bold 32px Courier Standard Bold`;
  ctx.fillText(`${banner.toLowerCase()}::page ${page+1}/${maxPage+1}`,16,24);

  if(type<3){

    let msg = `${cardList[type]}::${usedCards}/${cards}`

    ctx.fillText(msg,canvas.width-16-ctx.measureText(msg).width,24);

  }

  const cardSheet = await client.Canvas.loadImage(`./miscsprites/CAPTCHACARD.png`);
  const gristSheet = await client.Canvas.loadImage(`./miscsprites/GRISTSPRITES.png`);
  const traitSheet = await client.Canvas.loadImage(`./miscsprites/TRAITSPRITES.png`);
  const kindSheet = await client.Canvas.loadImage(`./miscsprites/WEAPONKINDSLARGE.png`);

  //ctx.drawImage(cardSheet,0,0,192,232,16,48,192,232);

  let j = page*10;

  for(let i=0;i<10;i++){

    let x = 16+((i%5)*208);

    let y = 48+(264*Math.floor(i/5))

    if(j<cards){

//draw card

      ctx.drawImage(cardSheet,194*(type+1),0,194,232,x,y,194,232);

      if(j<sdex.length)
      await drawCard(client,canvas,ctx,sdex[j],x,y,gristSheet,traitSheet,kindSheet);

//number selection

      ctx.fillStyle = "#000000";
      ctx.font = `bold 20px FONTSTUCK`;
      ctx.font = applyText(canvas,ctx, j+1,20,12,"FONTSTUCK",26)
      ctx.fillText(j+1,x+152+26-ctx.measureText(j+1).width-Math.floor((26-ctx.measureText(j+1).width)/2),y+20+Math.floor(ctx.measureText(j+1).emHeightAscent/2));

      //16 28


    } else {

    ctx.drawImage(cardSheet,0,0,194,232,x,y,194,232);

  }

  j++

  }

//send message

  let attachment = new client.MessageAttachment(canvas.toBuffer(), 'actionlist.png');

return attachment;

}


async function drawQueenRingCard(client,canvas,ctx,item,x,y,gristSheet,traitSheet,kindSheet){

  ctx.fillStyle = "#ffffff";
  ctx.font = `bold 16px Courier Standard Bold`;
  //captcha code
  ctx.fillText("UNKNOWN",x+16,y+28);
  //tier
  ctx.fillStyle = "#000000";
  ctx.font = `bold 10px FONTSTUCK`;
  ctx.fillText("TIER",x+16,y+45);
  ctx.fillText("??",x+63+(Math.floor((14-ctx.measureText("??").width)/2)),y+45);
  //22 196

  //name
  let name = item[0];
  ctx.font = applyText(canvas,ctx,name,16,8,"FONTSTUCK",130)
  name = splitText(canvas,ctx,name,18,textSplitMode)
  ctx.fillText(name,x+20,y+196-(Math.floor(14-ctx.measureText(name).emHeightAscent+ctx.measureText(name).emHeightDescent)/2));

  let gristType = 17;

  //grist type
  //sheet, X coord to pull, y coord to pull, pull width, pull height, place coords
  ctx.drawImage(gristSheet,(gristType%8)*32,Math.floor(gristType/8)*32,32,32,x+122,y+68,32,32);

  let orbs = 4;
  if(item[6] && item[6]["orbs"] !== undefined){
    orbs = item[6]["orbs"];
  }

  //traits
  ctx.drawImage(traitSheet,((trait1Search.length + 1 + orbs)%8)*32,Math.floor((trait1Search.length + 1 + orbs)/8)*32,32,32,x+122,y+104,32,32);
  ctx.drawImage(traitSheet,((trait2Search.length + 1 + orbs)%8)*32,Math.floor((trait2Search.length + 1 + orbs)/8)*32,32,32,x+122,y+140,32,32);

  //weaponkind//
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold 8px FONTSTUCK`;
  ctx.fillText("ringkind",x+22,y+214);

  msg = `x${item[3]}`

  ctx.fillText(msg,x+160-ctx.measureText(msg).width,y+214);

  //image
  try{
    if(item[5]==undefined){
      ctx.drawImage(kindSheet,RINGKIND_INDEX*96,0,96,96,x+17,y+61,96,96);
  
    }
    else{
      let img = await client.Canvas.loadImage(item[5]);
    
      ctx.drawImage(img,x+17,y+61,96,96);
    }
  }
  catch(err){
    ctx.drawImage(kindSheet,RINGKIND_INDEX*96,0,96,96,x+17,y+61,96,96);
  }
}

async function inspectQueenRing(client,message,args,type,item,splitType=7){
  let leftAlign = Math.floor(splitType / 4);
  splitType = splitType % 4;

  client.Canvas.registerFont("./miscsprites/fontstuck.ttf",{family:`FONTSTUCK`});
  client.Canvas.registerFont("./miscsprites/Courier Std Bold.otf",{family:`Courier Standard Bold`});
  const canvas = client.Canvas.createCanvas(582,464);
  const ctx = canvas.getContext('2d');

  let trait1 = "ROYAL";
  let trait2 = "ROYAL";
  let action = [ "amalgamate", "amaze", "amass", "amerce" ];

  const cardSheet = await client.Canvas.loadImage(`./miscsprites/CAPTCHACARD.png`);
  const gristSheet = await client.Canvas.loadImage(`./miscsprites/GRISTSPRITES.png`);
  const traitSheet = await client.Canvas.loadImage(`./miscsprites/TRAITSPRITES.png`);
  const kindSheet = await client.Canvas.loadImage(`./miscsprites/WEAPONKINDSLARGE.png`);

  const backSheet = await client.Canvas.loadImage(`./miscsprites/BACKSHEET.png`)

  //drawing card templates
  ctx.drawImage(cardSheet,194*(type+1),232,194,232,0,116,194,232);
  ctx.drawImage(backSheet,388*(type+1),0,388,464,194,0,388,464);

//drawing front of card
  await drawQueenRingCard(client,canvas,ctx,item,0,116,gristSheet,traitSheet,kindSheet);

//drawing back of card
  let x=194;
  let y=0;

  let orbs = 4;
  if(item[6] && item[6]["orbs"] !== undefined){
    orbs = item[6]["orbs"];
  }

  //draw grist
  let gristType = 17;
  ctx.drawImage(gristSheet,(gristType%8)*32,Math.floor(gristType/8)*32,32,32,x+62,y+88,44,44);

  //draw effective grist
  for(let i=0;i<4;i++){
    for(let j=0;j<2;j++){
      ctx.drawImage(gristSheet,(gristType%8)*32,Math.floor(gristType/8)*32,32,32,x+116+(52*i),y+38+50*j,44,44);
	}
  }

  //draw trait symbols
  ctx.drawImage(traitSheet,((trait1Search.length + 1 + orbs)%8)*32,Math.floor((trait1Search.length + 1 + orbs)/8)*32,32,32,x+16,140,32,32);
  ctx.drawImage(traitSheet,((trait1Search.length + 1 + orbs)%8)*32,Math.floor((trait1Search.length + 1 + orbs)/8)*32,32,32,x+170,140,32,32);

  //draw trait names
  ctx.fillStyle = "#000000";
  middleText(
    canvas,
    ctx,
    trait1,
    x+CARDBACK_TEXTBOX_HEIGHT+CARDBACK_TEXTBOX_MARGIN,
    142,
    x+159,
    169,
    16,
    8,
    "FONTSTUCK");

  ctx.fillStyle = "#000000";
  middleText(
    canvas,
    ctx,
    trait2,
    x+204,
    142,
    x+313,
    169,
    16,
    8,
    "FONTSTUCK");

  //draw trait descriptions
  middleText2(canvas,ctx,client.traitDesc[trait1].trait,x+16,y+180,x+161,y+227,18,12,"Courier Standard Bold",splitType,18);
  middleText2(canvas,ctx,client.traitDesc[trait2].trait,x+170,y+180,x+315,y+227,18,12,"Courier Standard Bold",splitType,18);


  //draw actions
  let actionBox=[[x+16,236,276],[x+170,236,276],[x+16,332,372],[x+170,332,372]];
  for(let j=0;j<4;j++){
    let tempcolor;
    let tempbg;
    switch(action[j].substring(0,2)){
      case `am`:
      tempcolor=  `#ffffff`;
      tempbg = `#000000`;
      break;
      default:
      tempcolor= `#ffffff`;
      tempbg = `#cccccc`;
    }
	
	let xPos = j % 2;
	let yPos = Math.floor(j / 2);

    ctx.fillStyle = tempbg;
    ctx.fillRect(
      x + 16 + CARDBACK_MAIN_OFFSET_X * xPos,
      236 + CARDBACK_MAIN_OFFSET_Y * yPos,
      CARDBACK_HEADER_WIDTH,
      CARDBACK_HEADER_HEIGHT);

    ctx.strokeStyle = tempcolor;
    ctx.fillStyle = tempcolor;
    ctx.lineWidth=CARDBACK_TEXTBOX_MARGIN * 2;
    ctx.strokeRect(
      x + 16 + CARDBACK_MAIN_OFFSET_X * xPos + CARDBACK_TEXTBOX_MARGIN,
      236 + CARDBACK_MAIN_OFFSET_Y * yPos + CARDBACK_TEXTBOX_MARGIN,
      CARDBACK_HEADER_WIDTH - CARDBACK_TEXTBOX_MARGIN,
      CARDBACK_HEADER_HEIGHT - CARDBACK_TEXTBOX_MARGIN
    );
  
    // Action name
    ctx.font = `bold 20px FONTSTUCK`;
    ctx.font = applyText(canvas,ctx,action[j].toUpperCase(),16,8,"FONTSTUCK",140);
    middleText(canvas,ctx,action[j],actionBox[j][0]+2,actionBox[j][1]+2,actionBox[j][0]+144,actionBox[j][1]+30);

    let charsPerLine = 20;
	if(j==2){
      charsPerLine = 24;
	}

    // Action description
    if(client.actionList[action[j]].aa.length > 1){
      actionDesc = `CST - ${client.actionList[action[j]].cst} DMG - ${client.actionList[action[j]].dmg}\n${splitText(canvas,ctx,client.actionList[action[j]].aa,charsPerLine,splitType)}`
    }
    else{
      actionDesc = `${client.actionList[action[j]].aa}`;
    }


    ctx.font = applyText(canvas,ctx,action[j].toUpperCase(),18,8,"Courier Standard Bold",130);
    ctx.fillStyle = "#000000";
    middleText2(canvas,ctx,actionDesc,actionBox[j][0],actionBox[j][2],actionBox[j][0]+146,actionBox[j][2]+48,18,8,"Courier Standard Bold");
  
  }

  let attachment = new client.MessageAttachment(canvas.toBuffer(), 'inspect.png');

  return attachment;
}

async function drawCard(client,canvas,ctx,item,x,y,gristSheet,traitSheet,kindSheet){
  if(client.invcall.isItemQueenRing(item)){
    await drawQueenRingCard(client,canvas,ctx,item,x,y,gristSheet,traitSheet,kindSheet);
    return;
  }

  ctx.fillStyle = "#ffffff";
  ctx.font = `bold 16px Courier Standard Bold`;
  //captcha code
ctx.fillText(item[1],x+16,y+28);
//tier
ctx.fillStyle = "#000000";
ctx.font = `bold 10px FONTSTUCK`;
ctx.fillText("TIER",x+16,y+45);
ctx.fillText(item[2],x+63+(Math.floor((14-ctx.measureText(item[2]).width)/2)),y+45);
//22 196
//name
let name = item[0];

ctx.font = applyText(canvas,ctx,name,16,8,"FONTSTUCK",130)
name = splitText(canvas,ctx,name,18,textSplitMode)
ctx.fillText(name,x+20,y+196-(Math.floor(14-ctx.measureText(name).emHeightAscent+ctx.measureText(name).emHeightDescent)/2));


let gristType = client.codeCypher[1][client.captchaCode.indexOf(item[1].charAt(1))];

//grist type
//sheet, X coord to pull, y coord to pull, pull width, pull height, place coords
ctx.drawImage(gristSheet,(gristType%8)*32,Math.floor(gristType/8)*32,32,32,x+122,y+68,32,32);
//client.traitList[client.captchaCode.indexOf(item[1].charAt(2))]
//traits
ctx.drawImage(traitSheet,(trait1Search.indexOf(client.traitList[client.captchaCode.indexOf(item[1].charAt(2))])%8)*32,Math.floor(trait1Search.indexOf(client.traitList[client.captchaCode.indexOf(item[1].charAt(2))])/8)*32,32,32,x+122,y+104,32,32);
ctx.drawImage(traitSheet,(trait2Search.indexOf(client.traitList[client.captchaCode.indexOf(item[1].charAt(3))])%8)*32,Math.floor(trait2Search.indexOf(client.traitList[client.captchaCode.indexOf(item[1].charAt(3))])/8)*32,32,32,x+122,y+140,32,32);

//weaponkind//
ctx.fillStyle = "#ffffff";
ctx.font = `bold 8px FONTSTUCK`;
ctx.fillText(client.kind[client.codeCypher[0][client.captchaCode.indexOf(item[1].charAt(0))]],x+22,y+214);

msg = `x${item[3]}`

ctx.fillText(msg,x+160-ctx.measureText(msg).width,y+214);

//image
try{
  if(item[5]==undefined){
    ctx.drawImage(kindSheet,client.codeCypher[0][client.captchaCode.indexOf(item[1].charAt(0))]*96,0,96,96,x+17,y+61,96,96);

}else{
  let img = await client.Canvas.loadImage(item[5]);

  ctx.drawImage(img,x+17,y+61,96,96);
}
}catch(err){
ctx.drawImage(kindSheet,client.codeCypher[0][client.captchaCode.indexOf(item[1].charAt(0))]*96,0,96,96,x+17,y+61,96,96);
}

}


function applyText(canvas,ctx, msg,fontsize,minsize,font,targ){
  ctx.font = `bold ${fontsize}px ${font}`;
  while (ctx.measureText(msg).width > targ){
    ctx.font = `bold ${fontsize -= 1}px ${font}`;
    if(fontsize<=minsize){
      return ctx.font;
    }
  }
  return ctx.font;
}

function splitText(canvas,ctx, msg,max, mode = 0){
  let retVal = msg;
  switch(mode){
  case 0:
    retVal = splitText1(msg, max);
	break;
  case 1:
    retVal = splitText2(msg, max);
	break;
  case 2:
    retVal = splitText3(msg, max);
	break;
  case 3:
    retVal = splitText4(msg, max);
	break;
  }

  return retVal;
}

function splitText1(msg,max){
  for(let k=0;k<Math.floor(msg.length/max);k++){

    let i = max*(k+1);
    let check = false
    for(let i = max*(k+1);i>max*k&&!check;i--){
      if(msg.charAt(i)==" "){
        check=true;
        var msg1 = msg.substring(0,i);
        var msg2 = msg.substring(i+1);
        msg = msg1+'\n'+msg2;
      }
    }
    if(!check){
      var msg1 = msg.substring(0,max*(k+1));
      var msg2 = msg.substring(max*(k+1)+1);
      msg = msg1+'\n'+msg2;
    }
  }

  return(msg);
}

function splitText2(msg,max){
  for(let k=0;k<Math.floor(msg.length/max);k++){
    let i = max*(k+1);
    let check = false
    for(let i = max*(k+1);i>max*k&&!check;i--){
      if(msg.charAt(i)==" "){
        check=true;
        var msg1 = msg.substring(0,i);
        var msg2 = msg.substring(i+1);
        msg = msg1+'\n'+msg2;
      }
    }
    if(!check){
      var msg1 = msg.substring(0,max*(k+1));
      var msg2 = msg.substring(max*(k+1)+1);
      msg = msg1+'\n'+msg2;
    }
  }

  if(msg.length>max){
    //console.log(msg);
    let i=max-2;
  var middle = Math.floor(msg.length/2);
  var split = msg.indexOf(' ',i);
  var check = true
  while(split==-1&&check){
    i--;
    split =msg.indexOf(' ',i)
    if(i<1){
      check=false;
    }
  }
  if(check){
  var msg1 = msg.substring(0,split);
  var msg2 = msg.substring(split+1);
  msg = msg1+'\n'+msg2;
}
//console.log(msg);
  return msg;
} else {
  return msg;
}
}

function splitText3(msg,max){
  let numLines = 1;
  while(msg.length > max * numLines){
    numLines += 1;
  }
  
  if(numLines == 1){
    return msg;
  }

  let firstSplit = -1;
  let secondSplit = -1;
  if(numLines % 2 == 1){
    // We add 1 because we plan to split based on the location of the last space.
    // If the character at the end of maxFirstLine happens to be a space, we're good.
    firstSplit = msg.lastIndexOf(" ", msg.length / numLines + 1);
	secondSplit = msg.lastIndexOf(" ", msg.length / numLines + 2 + msg.length / (numLines - 1));
  }
  else{
    secondSplit = msg.lastIndexOf(" ", msg.length / 2 + 1);
  }
  
  if(firstSplit < 0 && secondSplit < 0){
    return msg;
  }
  else if(firstSplit < 0 && secondSplit >= 0 || firstSplit == secondSplit){
    return `${splitText3(msg.slice(0, secondSplit), max)}\n${splitText3(msg.slice(secondSplit+1), max)}`;
  }
  else{
    return `${msg.slice(0, firstSplit)}\n${splitText3(msg.slice(firstSplit+1, secondSplit), max)}\n${splitText3(msg.slice(secondSplit+1), max)}`;
  }

  return(msg);
}

function splitText4(msg,max){
  let words = msg.split(" ");
  msg = splitText4Words(words,max);
  return(msg);
}

function splitText4Words(words,max){
  if(words.length <= 0){
    return "";
  }

  // Fill the line with as many of the remaining words as we can, without exceeding the limit.
  let msg = words.splice(0, 1)[0];
  while(words.length > 0 && msg.length + 1 + words[0].length < max){
    msg += ` ${words.splice(0, 1)[0]}`;
  }

  // If there are still words left, apply a new line and make a recursive call to this function, to handle the remaining words.
  if(words.length > 0){
    msg += `\n${splitText4Words(words,max)}`;
  }

  return(msg);
}

exports.inspect = async function (client,message,args,type,item,splitType=7){
  if(client.invcall.isItemQueenRing(item)){
    return inspectQueenRing(client,message,args,type,item,splitType);
  }

  let leftAlign = Math.floor(splitType / 4);
  splitType = splitType % 4;

  client.Canvas.registerFont("./miscsprites/fontstuck.ttf",{family:`FONTSTUCK`});
  client.Canvas.registerFont("./miscsprites/Courier Std Bold.otf",{family:`Courier Standard Bold`});
  const canvas = client.Canvas.createCanvas(582,464);
  const ctx = canvas.getContext('2d');

  let trait1 = client.traitList[client.captchaCode.indexOf(item[1].charAt(2))]
  let trait2 = client.traitList2[client.captchaCode.indexOf(item[1].charAt(3))]
  let action =[client.action[client.codeCypher[4][client.captchaCode.indexOf(item[1].charAt(4))]],client.action[client.codeCypher[5][client.captchaCode.indexOf(item[1].charAt(5))]],client.action[client.codeCypher[6][client.captchaCode.indexOf(item[1].charAt(6))]],client.action[client.codeCypher[7][client.captchaCode.indexOf(item[1].charAt(7))]]];

  const cardSheet = await client.Canvas.loadImage(`./miscsprites/CAPTCHACARD.png`);
  const gristSheet = await client.Canvas.loadImage(`./miscsprites/GRISTSPRITES.png`);
  const traitSheet = await client.Canvas.loadImage(`./miscsprites/TRAITSPRITES.png`);
  const kindSheet = await client.Canvas.loadImage(`./miscsprites/WEAPONKINDSLARGE.png`);

  const backSheet = await client.Canvas.loadImage(`./miscsprites/BACKSHEET.png`)

  //drawing card templates
  let x=194;
  let y=0;

  ctx.drawImage(cardSheet,194*(type+1),232,194,232,0,116,194,232);
  ctx.drawImage(backSheet,388*(type+1),0,388,464,194,0,388,464);
  //drawing front of card
  await drawCard(client,canvas,ctx,item,0,116,gristSheet,traitSheet,kindSheet);

  //drawing back of card

  //draw grist
  let gristType = client.codeCypher[1][client.captchaCode.indexOf(item[1].charAt(1))];

  ctx.drawImage(gristSheet,(gristType%8)*32,Math.floor(gristType/8)*32,32,32,x+62,y+88,44,44);
  //draw effective grist

  let effectiveGrists = [ client.grist[client.gristTypes[gristType]].effective, client.grist[client.gristTypes[gristType]].ineffective ];

  for(let i=0;i<4;i++){
    for(let j=0;j<2;j++){
      tempGrist=client.grist[effectiveGrists[j][i]].spos;
      ctx.drawImage(gristSheet,(tempGrist%8)*32,Math.floor(tempGrist/8)*32,32,32,x+116+(52*i),y+38+50*j,44,44);
	}
  }

  //draw trait symbols
  ctx.drawImage(traitSheet,(trait1Search.indexOf(trait1)%8)*32,Math.floor(trait1Search.indexOf(trait1)/8)*32,32,32,x+16,140,32,32);
  ctx.drawImage(traitSheet,(trait1Search.indexOf(trait2)%8)*32,Math.floor(trait1Search.indexOf(trait2)/8)*32,32,32,x+170,140,32,32);

  //draw trait names
  ctx.fillStyle = "#000000";
  middleText(canvas,ctx,trait1,x+50,142,x+159,169,16,8,"FONTSTUCK");
  ctx.fillStyle = "#000000";
  middleText(canvas,ctx,trait2,x+204,142,x+313,169,16,8,"FONTSTUCK");
  
  let drawFunction;
  switch(leftAlign){
    case 0:
	  drawFunction = middleText;
	  break;
    case 1:
	  drawFunction = middleText2;
	  break;
  }

  //draw trait descriptions
  drawFunction(canvas,ctx,client.traitDesc[trait1].trait,x+16,y+180,x+161,y+227,18,12,"Courier Standard Bold",splitType,18);
  drawFunction(canvas,ctx,client.traitDesc[trait2].trait,x+170,y+180,x+315,y+227,18,12,"Courier Standard Bold",splitType,18);

  //draw action names

  let actionBox=[[x+16,236,276],[x+170,236,276],[x+16,332,372],[x+170,332,372]];
//drawing actions
for(let j=0;j<4;j++){
  let tempcolor;
  let tempbg;
    switch(action[j].substring(0,2)){
      case `no`:
      tempcolor= `#6D6D6D`;
      tempbg = `#cccccc`;
      break;
      case `ac`:
      tempcolor=  `#6688FE`;
      tempbg = `#b3c3ff`;
      break;
      case `ar`:
      tempcolor= `#9B38F4`;
      tempbg = `#dbb3ff`;
      break;
      case `as`:
      tempcolor=  `#ff4e31`;
      tempbg = `#ffbdb3`;
      break;
      case `ab`:
      tempcolor=  `#ffae00`;
      tempbg = `#ffe7b3`;
      break;
      case `am`:
      tempcolor=  `#000000`;
      tempbg = `#cccccc`;
      break;
      case `ab`:
      tempcolor=  `#ffae00`;
      tempbg = `#ffe7b3`;
      break;
      case 'ag':
      tempcolor = "#3ef443";
      tempbg = `#aaf2ac`;
      break;
      default:
      tempcolor= `#6D6D6D`;
      tempbg = `#cccccc`;
  }

  if(action[j]=="abscond"){
    tempcolor=`#ff3779`;
    tempbg=`#ffb3cc`;
  }

  ctx.strokeStyle = tempcolor;
  ctx.fillStyle = tempcolor;
  ctx.lineWidth=4;
  ctx.strokeRect(actionBox[j][0]+2,actionBox[j][1]+2,146-2,32-2);

  // Action name
  ctx.font = `bold 20px FONTSTUCK`;
  ctx.font = applyText(canvas,ctx,action[j].toUpperCase(),16,8,"FONTSTUCK",140);
  middleText(canvas,ctx,action[j],actionBox[j][0]+2,actionBox[j][1]+2,actionBox[j][0]+144,actionBox[j][1]+30);

  // Action description
  if(client.actionList[action[j]].aa.length > 1){
    actionDesc = `CST - ${client.actionList[action[j]].cst} DMG - ${client.actionList[action[j]].dmg}\n${splitText(canvas,ctx,client.actionList[action[j]].aa,20,splitType)}`
  }
  else{
    actionDesc = `${client.actionList[action[j]].aa}`;
  }
  ctx.font = applyText(canvas,ctx,action[j].toUpperCase(),18,8,"Courier Standard Bold",130);
  ctx.fillStyle = "#000000";
  drawFunction(canvas,ctx,actionDesc,actionBox[j][0],actionBox[j][2],actionBox[j][0]+146,actionBox[j][2]+48,18,8,"Courier Standard Bold");

}

  let attachment = new client.MessageAttachment(canvas.toBuffer(), 'inspect.png');

return attachment;


}

function middleText(canvas,ctx,msg,x1,y1,x2,y2,fontsize,minsize,font,splitType=-1,lineWidthMax=24){
  if(splitType >= 0){
    msg = splitText(canvas,ctx,msg,lineWidthMax,splitType);
  }

  let lineCount = 1;
/*
  for(let i=0;i<msg.length;i++){
    if(msg.charAt(i)==`\n`){
      lineCount++;
    }
  }
*/
  let lineCheck = false;
  let tempString = msg;

  while(!lineCheck){
    if(tempString.search("\n")==-1){
      lineCheck=true;
    }else{
      tempString=tempString.substring(tempString.search("\n")+1)
      lineCount++;
    }
  }

  sizeCheck = false;

  ctx.font = `bold ${fontsize}px ${font}`;


  while((((ctx.measureText(msg).emHeightAscent)+(Math.floor(ctx.measureText(msg).emHeightAscent)/3))*lineCount)>y2-y1&&!sizeCheck){


    if(fontsize<=minsize){
      sizeCheck=true;
    } else {
    ctx.font = `bold ${fontsize -= 1}px ${font}`;
    }
  }

  applyText(canvas,ctx,msg,fontsize,minsize,font,x2-x1);

  yr = y2-y1-((ctx.measureText(msg).emHeightAscent*lineCount)+((Math.floor(ctx.measureText(msg).emHeightAscent)/3)*(lineCount-1))) ;
  y3 = y1+Math.floor(yr/2)+ctx.measureText(msg).emHeightAscent;

  //y3=y2-(Math.floor(((y2-y1)-(ctx.measureText(msg).emHeightAscent*lineCount))/2))

  //console.log(`y2 ${y2} - ( y2 ${y2} - y1 ${y1} (text height ${ctx.measureText(msg).emHeightAscent} * linecount ${lineCount})/2) = y3 ${y3}`)

  x3=x1+(Math.floor(x2-x1-ctx.measureText(msg).width)/2);
  ctx.fillText(msg,x3,y3);

}

function middleText2(canvas,ctx,msg,x1,y1,x2,y2,fontsize,minsize,font,splitType=-1,lineWidthMax=24){
  if(msg == "/"){
    middleText(canvas,ctx,msg,x1,y1,x2,y2,fontsize,minsize,font);
    return;
  }

  msg = splitText(canvas,ctx,msg,lineWidthMax,splitType);

  let targetX = x2-x1-CARDBACK_TEXTBOX_MARGIN*2;
  let targetY = y2-y1-CARDBACK_TEXTBOX_MARGIN*2;

  let lineCount = 1;
  for(let i=0;i<msg.length;i++){
    if(msg[i]==`\n`){
      lineCount++;
    }
  }
  
  if(lineCount <= 2){
    middleText(canvas,ctx,msg,x1,y1,x2,y2,fontsize,minsize,font);
    return;
  }

  ctx.font = `bold ${fontsize}px ${font}`;
  
  let multiplier = (5 * lineCount - 2) / 3;
  while(Math.floor(multiplier * ctx.measureText(msg).emHeightAscent) > targetY){
    if(fontsize<=minsize){
      break;
    } else {
      ctx.font = `bold ${fontsize -= 1}px ${font}`;
    }
  }

  applyText(canvas, ctx, msg, fontsize, minsize, font, targetX);

  x3 = x1+CARDBACK_TEXTBOX_MARGIN;
  y3 = y1+CARDBACK_TEXTBOX_MARGIN + ctx.measureText(msg).emHeightAscent;
  
  ctx.fillText(msg,x3,y3);

}

exports.alchCheck = async function (client, message, page, args, sdex, priceSet ,banner){

  client.Canvas.registerFont("./miscsprites/fontstuck.ttf",{family:`FONTSTUCK`});
  client.Canvas.registerFont("./miscsprites/Courier Std Bold.otf",{family:`Courier Standard Bold`});
  const canvas = client.Canvas.createCanvas(1056,600);
  const ctx = canvas.getContext('2d');

  //list light, list dark, card fg, card bg, card shade
  let cards = sdex.length;
  let scheme = ["#992445","#0c6137","#992ae1","#484848","#245cb2"];
  let typeList = ["sylladex","strife specibus","container","room inventory"];
  let cardList = ["captchalogue cards","strife cards","storage space","room space"]
  let maxPage = Math.ceil(cards/10)-1;
  let type = 3;

//set background
  ctx.linewidth = 5;

//set top text line

  ctx.fillStyle = scheme[type];
  ctx.fillRect(0,0,canvas.width,32);

  ctx.fillStyle = "#ffffff";
  ctx.font = `bold 32px Courier Standard Bold`;
  ctx.fillText(`${banner.toLowerCase()}::page ${page+1}/${maxPage+1}`,16,24);

  if(type<3){

    let msg = `${cardList[type]}::${sdex.length}/${cards}`

    ctx.fillText(msg,canvas.width-16-ctx.measureText(msg).width,24);

  }

  const cardSheet = await client.Canvas.loadImage(`./miscsprites/CAPTCHACARD.png`);
  const gristSheet = await client.Canvas.loadImage(`./miscsprites/GRISTSPRITES.png`);
  const traitSheet = await client.Canvas.loadImage(`./miscsprites/TRAITSPRITES.png`);
  const kindSheet = await client.Canvas.loadImage(`./miscsprites/WEAPONKINDSLARGE.png`);
  const priceCard = await client.Canvas.loadImage(`./miscsprites/PRICECARD.png`);
  const priceBlank = await client.Canvas.loadImage(`./miscsprites/PRICECARDBLANK.png`);

  //ctx.drawImage(cardSheet,0,0,192,232,16,48,192,232);

  let j = page*10;

  for(let i=0;i<10;i++){

    let x = 16+((i%5)*208);

    let y = 48+(274*Math.floor(i/5))

    if(j<cards){

//draw card

      if(j>=priceSet.length){
        type=4;
      }

      ctx.drawImage(cardSheet,194*(type+1),0,194,232,x,y,194,232);

      if(j<sdex.length)
      await drawCard(client,canvas,ctx,sdex[j],x,y,gristSheet,traitSheet,kindSheet);

      ctx.drawImage(priceCard,0,0,194,36,x,y+236,194,36);

      ctx.fillStyle = "#000000";

      if(j<priceSet.length){
        //first grist cost image always build
        ctx.drawImage(gristSheet,(client.grist.build.spos%8)*32,Math.floor(client.grist.build.spos/8)*32,32,32,x,y+236,32,32);
        //second grist cost image
        ctx.drawImage(gristSheet,(client.grist[priceSet[j][0]].spos%8)*32,Math.floor(client.grist[priceSet[j][0]].spos/8)*32,32,32,x+98,y+236,32,32);

        //first grist cost
        middleText(canvas,ctx,"0",x+34,y+236,x+91,y+267,18,8,"FONTSTUCK");
        //second grist cost
        middleText(canvas,ctx,priceSet[j][1].toString(),x+132,y+236,x+189,y+267,18,8,"FONTSTUCK");
      }else{

        let gristType = client.codeCypher[1][client.captchaCode.indexOf(sdex[j][1].charAt(1))];
        let tier = sdex[j][2];

        if(client.traitcall.itemTrait(client,sdex[j],"SHITTY")){

          tier=1;
          gristType = 0;

        } else if(client.traitcall.itemTrait(client,sdex[j],"TRICKSTER")){
          tier=16;
          gristType = 14;
        }

        let cost = tierCost[tier];
        let cost2 = tierCost[tier-1];
        if(tier-1<0){
          cost2=0;
        }

        if(client.traitcall.itemTrait(client,sdex[j],"EXQUISITE")){

          gristType = 13;

        }

        if(gristType ==13){

          cost*=2;
          cost2*=2
        }

        ctx.drawImage(gristSheet,(15%8)*32,Math.floor(15/8)*32,32,32,x,y+236,32,32);
        //second grist cost image
        ctx.drawImage(gristSheet,(gristType%8)*32,Math.floor(gristType/8)*32,32,32,x+98,y+236,32,32);

        //first grist cost
        middleText(canvas,ctx,cost.toString(),x+34,y+236,x+91,y+267,18,8,"FONTSTUCK");
        //second grist cost
        middleText(canvas,ctx,cost2.toString(),x+132,y+236,x+189,y+267,18,8,"FONTSTUCK");

      }

//number selection

      ctx.fillStyle = "#000000";
      ctx.font = `bold 20px FONTSTUCK`;
      ctx.font = applyText(canvas,ctx, j+1,20,12,"FONTSTUCK",26)
      ctx.fillText(j+1,x+152+26-ctx.measureText(j+1).width-Math.floor((26-ctx.measureText(j+1).width)/2),y+20+Math.floor(ctx.measureText(j+1).emHeightAscent/2));

      //16 28


    } else {

    ctx.drawImage(cardSheet,0,0,194,232,x,y,194,232);
    ctx.drawImage(priceBlank,0,0,194,36,x,y+236,194,36);

  }

  j++

  }


//send message

  let attachment = new client.MessageAttachment(canvas.toBuffer(), 'actionlist.png');

return attachment;



}


exports.alchCheckFiltered = async function (client, message, page, args, sdex, priceSet ,banner, numbers, row_length = 5, num_rows = 3){

  let ITEMS_PER_PAGE = row_length * num_rows;

  client.Canvas.registerFont("./miscsprites/fontstuck.ttf",{family:`FONTSTUCK`});
  client.Canvas.registerFont("./miscsprites/Courier Std Bold.otf",{family:`Courier Standard Bold`});
  const canvas = client.Canvas.createCanvas(16 + 208 * row_length, 52 + 274 * num_rows);
  const ctx = canvas.getContext('2d');

  //list light, list dark, card fg, card bg, card shade
  let cards = sdex.length;
  let scheme = ["#992445","#0c6137","#992ae1","#484848","#245cb2"];
  let typeList = ["sylladex","strife specibus","container","room inventory"];
  let cardList = ["captchalogue cards","strife cards","storage space","room space"]
  let maxPage = Math.ceil(numbers.length/ITEMS_PER_PAGE)-1;
  let type = 3;

//set background
  ctx.linewidth = 5;

//set top text line

  ctx.fillStyle = scheme[type];
  ctx.fillRect(0,0,canvas.width,32);

  ctx.fillStyle = "#ffffff";
  ctx.font = `bold 32px Courier Standard Bold`;
  ctx.fillText(`${banner.toLowerCase()}::page ${page+1}/${maxPage+1}`,16,24);

  const cardSheet = await client.Canvas.loadImage(`./miscsprites/CAPTCHACARD.png`);
  const gristSheet = await client.Canvas.loadImage(`./miscsprites/GRISTSPRITES.png`);
  const traitSheet = await client.Canvas.loadImage(`./miscsprites/TRAITSPRITES.png`);
  const kindSheet = await client.Canvas.loadImage(`./miscsprites/WEAPONKINDSLARGE.png`);
  const priceCard = await client.Canvas.loadImage(`./miscsprites/PRICECARD.png`);
  const priceBlank = await client.Canvas.loadImage(`./miscsprites/PRICECARDBLANK.png`);

  //ctx.drawImage(cardSheet,0,0,192,232,16,48,192,232);

  let j = page*ITEMS_PER_PAGE;

  for(let i=0;i<ITEMS_PER_PAGE;i++){

    let x = 16+((i%row_length)*208);
    let y = 48+(274*Math.floor(i/row_length))

    if(j<numbers.length){

//draw card

      if(numbers[j]>=priceSet.length||numbers[j]<0){
        type=4;
      }

      ctx.drawImage(cardSheet,194*(type+1),0,194,232,x,y,194,232);

      if(numbers[j]<sdex.length){
		await drawCard(client,canvas,ctx,sdex[numbers[j]],x,y,gristSheet,traitSheet,kindSheet);
	  }

      ctx.drawImage(priceCard,0,0,194,36,x,y+236,194,36);

      ctx.fillStyle = "#000000";

      if(j<priceSet.length){
        //first grist cost image always build
        ctx.drawImage(gristSheet,(client.grist.build.spos%8)*32,Math.floor(client.grist.build.spos/8)*32,32,32,x,y+236,32,32);
        //second grist cost image
        ctx.drawImage(gristSheet,(client.grist[priceSet[j][0]].spos%8)*32,Math.floor(client.grist[priceSet[j][0]].spos/8)*32,32,32,x+98,y+236,32,32);

        //first grist cost
        middleText(canvas,ctx,"0",x+34,y+236,x+91,y+267,18,8,"FONTSTUCK");
        //second grist cost
        middleText(canvas,ctx,priceSet[j][1].toString(),x+132,y+236,x+189,y+267,18,8,"FONTSTUCK");
      }else{

        let gristType = client.codeCypher[1][client.captchaCode.indexOf(sdex[numbers[j]][1].charAt(1))];
        let tier = sdex[numbers[j]][2];

        if(client.traitcall.itemTrait(client,sdex[numbers[j]],"SHITTY")){

          tier=1;
          gristType = 0;

        } else if(client.traitcall.itemTrait(client,sdex[numbers[j]],"TRICKSTER")){
          tier=16;
          gristType = 14;
        }

        let cost = tierCost[tier];
        let cost2 = tierCost[tier-1];
        if(tier-1<0){
          cost2=0;
        }

        if(client.traitcall.itemTrait(client,sdex[numbers[j]],"EXQUISITE")){

          gristType = 13;

        }

        if(gristType ==13){

          cost*=2;
          cost2*=2
        }

        ctx.drawImage(gristSheet,(15%8)*32,Math.floor(15/8)*32,32,32,x,y+236,32,32);
        //second grist cost image
        ctx.drawImage(gristSheet,(gristType%8)*32,Math.floor(gristType/8)*32,32,32,x+98,y+236,32,32);

        //first grist cost
        middleText(canvas,ctx,cost.toString(),x+34,y+236,x+91,y+267,18,8,"FONTSTUCK");
        //second grist cost
        middleText(canvas,ctx,cost2.toString(),x+132,y+236,x+189,y+267,18,8,"FONTSTUCK");

      }

//number selection

      ctx.fillStyle = "#000000";
      ctx.font = `bold 20px FONTSTUCK`;
      ctx.font = applyText(canvas,ctx, numbers[j]+1,20,12,"FONTSTUCK",26);
      ctx.fillText(
		numbers[j]+1,
		x+152+26-ctx.measureText(numbers[j]+1).width-Math.floor((26-ctx.measureText(numbers[j]+1).width)/2),
		y+20+Math.floor(ctx.measureText(numbers[j]+1).emHeightAscent/2)
	  );

      //16 28


    } else {

    ctx.drawImage(cardSheet,0,0,194,232,x,y,194,232);
    ctx.drawImage(priceBlank,0,0,194,36,x,y+236,194,36);

  }

  j++

  }


//send message

  let attachment = new client.MessageAttachment(canvas.toBuffer(), 'actionlist.png');

return attachment;



}

exports.characterImg = async function (client, message, custom){

  const canvas = client.Canvas.createCanvas(224,288);
  const ctx = canvas.getContext('2d');

  let hairReplace = [153,229,80];
  let hairOptions = [[0,0,0],[255,255,255],[0,0,0],[255,255,255],[0,0,0]]

  if(client.fs.existsSync(`./miscsprites/SPRITES/Bot/Head/HairBack/${custom[0]}.png`)){

    let hairback = await client.Canvas.loadImage(`./miscsprites/SPRITES/Bot/Head/HairBack/${custom[0]}.png`);

    ctx.drawImage(hairback,0,0);

  }

  let body = await client.Canvas.loadImage(`./miscsprites/SPRITES/Bot/body/BASE.png`);

  let head = await client.Canvas.loadImage(`./miscsprites/SPRITES/Bot/head/BASE.png`);

  let hair = await client.Canvas.loadImage(`./miscsprites/SPRITES/Bot/head/hair/${custom[0]}.png`);
  let eyes = await client.Canvas.loadImage(`./miscsprites/SPRITES/Bot/head/eyes/${custom[2]}.png`);
  let mouth = await client.Canvas.loadImage(`./miscsprites/SPRITES/Bot/head/mouth/${custom[3]}.png`);
  let glasses = await client.Canvas.loadImage(`./miscsprites/SPRITES/Bot/head/glasses/${custom[4]}.png`);

  ctx.drawImage(body,0,0);
  ctx.drawImage(head,0,0);
  ctx.drawImage(hair,0,0);
  ctx.drawImage(glasses,0,0);
  ctx.drawImage(eyes,0,0);
  ctx.drawImage(mouth,0,0);

  let imageData = ctx.getImageData(0,0,canvas.width,canvas.height);

  for(let j=0;j<imageData.data.length;j+=4){

    if(imageData.data[j]==hairReplace[0]&&
      imageData.data[j+1]==hairReplace[1]&&
      imageData.data[j+2]==hairReplace[2]
    ){
      imageData.data[j]=hairOptions[custom[1]][0]
        imageData.data[j+1]=hairOptions[custom[1]][1]
        imageData.data[j+2]=hairOptions[custom[1]][2]
    }

  }

  ctx.putImageData(imageData,0,0)

  let attachment = new client.MessageAttachment(canvas.toBuffer(), `character.png`);

  message.channel.send(attachment);

}
