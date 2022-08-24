
//const GoogleSpreadsheet = require('google-spreadsheet');
//const { promisify } = require('util');
//const { GoogleSpreadsheet } = require('google-spreadsheet');
const lootcall = require("./lootcall.js");

//bedroom,living room, study, kitchen, bathroom, yard, shed

exports.dmcheck = function(client,message){
  try{
    if(message.member.roles.cache.some(role => role.name.toLowerCase() === 'dm')||message.member.roles.cache.some(role => role.name.toLowerCase() === 'author')){
      return true;
    }else{
      return false;
    }
  }catch(err){
    return false;
  }
}

//TODO: make experience and boondollars gained actually track what they say
exports.actionCheck = function(client, message, score){
  try{
    var userid = message.guild.id.concat(message.author.id);
    var charid = client.userMap.get(userid,"possess");
    let curCount = client.charcall.allData(client,userid,charid,"act");
    let name = client.charcall.allData(client,userid,charid,"name");
    let leaderAdd = message.guild.id+"mediumlead";
    let key = "";
    //curCount++;
    switch(score){
      case "alchemized":
        key = "itemsAlchemized"
        break;
      case "tile":
        key = "tilesDiscovered"
        break;
      case "underling":
        key = "underlingsDefeated"
        break;
      case "player":
        key = "playersDefeated"
        break;
      case "boss":
        key = "bossesDefeated"
        break;
      case "item":
        key = "itemsCaptchalogued"
        break;
    }

    //if the target doesn't have a score for the action being incremented, return.
    if(client.charcall.allData(client,userid,charid,key)=="NONE"){
      return;
    }

    increase = client.charcall.allData(client,userid,charid,key);
    increase++;
    client.charcall.setAnyData(client,userid,charid,increase,key);
    if(increase>client.landMap.get(leaderAdd,key)[1]){
      client.landMap.set(leaderAdd,[name,increase],key);
    }

    let b = client.charcall.allData(client,userid,charid,"b");
    let xp = client.charcall.allData(client,userid,charid,"xp");
    if(b>client.landMap.get(leaderAdd,"boondollarsGained")[1]){
      client.landMap.set(leaderAdd,[name,b],"boondollarsGained");
    }

    if(xp>client.landMap.get(leaderAdd,"experienceGained")[1]){
      client.landMap.set(leaderAdd,[name,xp],"experienceGained");
    }

    if(curCount!="NONE"&&curCount>=client.limit&&client.limit!=0){
      let tiles = client.charcall.allData(client,userid,charid,"tilesDiscovered");
      let alchemized = client.charcall.allData(client,userid,charid,"itemsAlchemized");
      let underlings =  client.charcall.allData(client,userid,charid,"underlingsDefeated");
      let players =  client.charcall.allData(client,userid,charid,"playersDefeated");
      let bosses = client.charcall.allData(client,userid,charid,"bossesDefeated");
      let items = client.charcall.allData(client,userid,charid,"itemsCaptchalogued");

      message.channel.send("That was your last action in the tournament, here's your final stats:");
      let stats = new client.MessageEmbed()
        .setTitle(`**HERE'S HOW YOU DID**`)
        .addFields(
          {name:`**EXPERIENCE GAINED**`,value:xp,inline:true},
          {name:`**BOONDOLLARS GAINED**`,value:b,inline:true},
          {name:`**TILES DISCOVERED**`,value:tiles,inline:true},
          {name:`**ITEMS ALCHEMIZED**`,value:alchemized,inline:true},
          {name:`**ITEMS CAPTCHALOGUED**`,value:items,inline:true},
          {name:`**UNDERLNGS DEFEATED**`,value:underlings,inline:true},
          {name:`**PLAYERS DEFEATED**`,value:players,inline:true},
          {name:`**BOSSES DEFEATED**`,value:bosses,inline:true}
        );
      message.channel.send({embed:[stats]});
    }
    //client.playerMap.set(charid,curCount,"act")
  }catch(err){
  }
}

exports.tick = function(client, message){

  var userid = message.guild.id.concat(message.author.id);
  var charid = client.userMap.get(userid,"possess");
  let curCount = client.charcall.allData(client,userid,charid,"act");
  let leaderAdd = message.guild.id+"mediumlead";
  //anything without an action counter gets bounced here
  if(curCount=="NONE")
    return;
  curCount++;
  client.funcall.sleepHeal(client,charid);
  let name = client.charcall.allData(client,userid,charid,"name");
  let b = client.charcall.allData(client,userid,charid,"b");
  let xp = client.charcall.allData(client,userid,charid,"xp");

  if(b>client.landMap.get(leaderAdd,"boondollarsGained")[1]){
    client.landMap.set(leaderAdd,[name,b],"boondollarsGained");
  }

  if(xp>client.landMap.get(leaderAdd,"experienceGained")[1]){
    client.landMap.set(leaderAdd,[name,xp],"experienceGained");
  }

  if(curCount==client.limit&&client.limit!=0){

    let tiles = client.playerMap.get(charid,"tilesDiscovered");
    let alchemized = client.playerMap.get(charid,"itemsAlchemized");
    let underlings =  client.playerMap.get(charid,"underlingsDefeated");
    let players =  client.playerMap.get(charid,"playersDefeated");
    let bosses = client.playerMap.get(charid,"bossesDefeated");
    let items = client.playerMap.get(charid,"itemsCaptchalogued");

    message.channel.send("That was your last action in the tournament, here's your final stats:");
    let stats = new client.MessageEmbed()
      .setTitle(`**HERE'S HOW YOU DID**`)
      .addFields(
        {name:`**EXPERIENCE GAINED**`,value:xp,inline:true},
        {name:`**BOONDOLLARS GAINED**`,value:b,inline:true},
        {name:`**TILES DISCOVERED**`,value:tiles,inline:true},
        {name:`**ITEMS ALCHEMIZED**`,value:alchemized,inline:true},
        {name:`**ITEMS CAPTCHALOGUED**`,value:items,inline:true},
        {name:`**UNDERLNGS DEFEATED**`,value:underlings,inline:true},
        {name:`**PLAYERS DEFEATED**`,value:players,inline:true},
        {name:`**BOSSES DEFEATED**`,value:bosses,inline:true}
      );
    message.channel.send({embed:[stats]});
    //enter stat stuff here
  }

  client.playerMap.set(charid,curCount,"act")
}

//function creates a list of random items to populate player house

exports.preItem = function(client,room,quantity,list,gristList) {
  //declares random number
  let itemList = [];
  let item;
  if(isNaN(room)){
    for(let j=0;j<quantity;j++){
      do{
        item = lootcall.itemGen(room,gristList);
      } while(itemList.includes(item[0]));

      list.push(item);
      itemList.push(item[0]);
    }
  }
  else {
    for(let j=0;j<quantity;j++){
      do{
        item = lootcall.lootGen(client,room);
      } while(itemList.includes(item[0]));

      list.push(item);
      itemList.push(item[0]);
    }
  }

  return list;
}
//creates a random list of characters that can be used in a captcha code
exports.ranChar = function(client, x) {
  let i;
  let string = "";
  for (i=0; i < x; i++){
    string += client.captchaCode[Math.floor(Math.random()*62)+2]
  }

  return string;
}
//test if player is registered
exports.regTest = function(client, message, target) {
  try {
    if(client.playerMap.get(message.guild.id.concat(target.id),"alive")==false){
      return false;
    }
    else{
      return true;
    }
  }
  catch(err){
    return false;
  }
}

//alchemy -- || takes lowest && takes highest
//  1<A<a<1
//  0-11  12-37  38-63

//|| false
//&& true

exports.alchemize = function(client, item1, item2, type){

  let code1 = [item1[1].charAt(0),item1[1].charAt(1),item1[1].charAt(2),item1[1].charAt(3),item1[1].charAt(4),item1[1].charAt(5),item1[1].charAt(6),item1[1].charAt(7)];
  let code2 = [item2[1].charAt(0),item2[1].charAt(1),item2[1].charAt(2),item2[1].charAt(3),item2[1].charAt(4),item2[1].charAt(5),item2[1].charAt(6),item2[1].charAt(7)];

  let tier;
  let i;
  let char1;
  let char2;
  if(code1 == code2){
    return item1;
  }

  let coderes = ["/","/","/","/","/","/","/","/"]
  for(i=0;i<8;i++){

    if(code1[i]=="/"||code1[i]=="#"||code1[i]=="@"){
      coderes[i]=code2[i];
    }
    else if(code2[i]=="/"||code2[i]=="#"||code1[i]=="@"){
      coderes[i]=code1[i];
    }
    else{
      char1 = client.captchaCode.indexOf(code1[i]);
      char2 = client.captchaCode.indexOf(code2[i]);

      switch(type){
        case "||":
          if(char1<char2){
            coderes[i]=code1[i];
          }
          else{
            coderes[i]=code2[i];
          }
          break;
        case "&&":
          if(char1>char2){
            coderes[i]=code1[i];
          }
          else{
            coderes[i]=code2[i];
          }

          break;
      }
    }
  }

  if(code1[0]==code2[0]){
    if(item1[2]>item2[2]){
      tier = item1[2] + 1;
    }
    else{
      tier = item2[2] + 1;
    }
  }
  else if(coderes[0]==code1[0]){
    tier = item1[2] + 1;
  }
  else {
    tier = item2[2] + 1;
  }
  if(tier > 16){
    var resItem = ["ALCHEMIZED ITEM",`${coderes[0]}${coderes[1]}${coderes[2]}${coderes[3]}${coderes[4]}${coderes[5]}${coderes[6]}${coderes[7]}`,16,1,[]];

    return resItem;
  }
  else {
    var resItem = ["ALCHEMIZED ITEM",`${coderes[0]}${coderes[1]}${coderes[2]}${coderes[3]}${coderes[4]}${coderes[5]}${coderes[6]}${coderes[7]}`,tier,1,[]];

    return resItem;
  }
}

//used to give xp to a player and level them up
exports.xpGive = function(client, message, xp, target){
  let curXp = client.playerMap.get(target,"xp");
  let curRung = client.playerMap.get(target,"rung");
  let name = client.playerMap.get(target,"name");

  let newXp = curXp+xp;

  client.playerMap.set(target, newXp,"xp");

  client.message.send(`${name} got ${xp} XP and now has ${newXp} XP!`);

  if(newXp >= client.xpReq(curRung+1)){

    let stats = client.playerMap.get(target,"stats");
    let curVit = client.playerMap.get(target,"vit");
    let curCache = client.cache(curRung);

    let gvGain = 0;
    let i;

    for(i = curRung; newXp >= client.xpReq(i+1); i++){
      gvGain += (client.gvGet(i+1) + (stats[1]*(client.gvGet(i+1) / 5)));
    }
    let newVit = curVit+gvGain;

    client.playerMap.set(target, newXp,"xp");

    let congrats = new client.MessageEmbed()
      .setTitle(`${name} ASCENDED THEIR ECHELADDER!`)
      .addFields(
        {name:"RUNG",value:`${curRung} + ${i - curRung}`,inline:true},
        {name:"GEL VISCOSITY",value:`${client.emojis.cache.get(client.emoji["GEL"])} ${curGel} + ${gvGain}`},
        {name:"GRIST CACHE",value: `${client.emojis.cache.get(client.grist["build"].emoji)} ${curCache} + ${client.cache(i) - curCache}`}
      )
      .setThumbnail(target.avatarURL()
    );
    message.channel.send({embeds:[congrats]});
  }
}

exports.combineArgs = function(args,start) {
  // Shouldn't this be zero?
  var i=1;

  if(start!=undefined){
    i=start;
  }

  var output ="";
  while(args[i]){
    if(output.length>0){
      output+=" ";
    }
    output = output + args[i];
    i++
  }

  return output;
}

exports.gristCacheEmbed = function(client,sburbid) {
  //retrieve character's grist details
  const gristTypes = ["build","uranium","amethyst","garnet","iron","marble","chalk","shale","cobalt","ruby","caulk","tar","amber","artifact","zillium","diamond"];
  let rung = client.sburbMap.get(sburbid,"rung");
  let max;
  if(client.sburbMap.get(sburbid,`godtier`)){
    max = `♾️`
  }
  else {
    max = client.cache(rung);
  }

  let grist = client.sburbMap.get(sburbid,"grist");
  let name = client.sburbMap.get(sburbid,"name");
  let msg =``;
  let i;


  //loop to list all of a player's grist types and amounts

  for(i=0;i<gristTypes.length;i++){
    msg += `${client.emojis.cache.get(client.grist[gristTypes[i]].emoji)} **${gristTypes[i].toUpperCase()} - ${grist[i]}**\n\n`
  }

  cachePrint = new client.MessageEmbed()
    .setTitle(`**${name.toUpperCase()}'S GRIST**`)
    .addFields(
      {name:`**GRIST CAP**`,value:`**${max}**`},
      {name:"**GRIST CACHE**",value:msg}
  );
  return cachePrint;
}

exports.chanMsg = function(client, target, msg, embed){
  if(!msg){
    return;
  }
  if(!client.charcall.controlCheck(client,target)){
    return;
  }
  else {
    controlList = client.charcall.charData(client,target,"control");
    for(let i=0;i<controlList.length;i++){
      if(embed!=undefined){
        if(msg=="NONE"){
          client.channels.cache.get(client.charcall.allData(client,controlList[i],target,"channel")).send({embeds:[embed]});
        }
        else {
          client.channels.cache.get(client.charcall.allData(client,controlList[i],target,"channel")).send(msg,{embeds:[embed]});
        }
      }
      else{
        client.channels.cache.get(client.charcall.allData(client,controlList[i],target,"channel")).send(msg);
      }
    }
  }
}

exports.sleepHeal = function(client,charid){
  userid = client.charcall.charData(client,charid,"control");
  let target;
  if(client.charcall.allData(client,userid,charid,"dreamer")){
    target = client.charcall.allData(client,userid,charid,"wakingID");
  }
  else {
    target = client.charcall.allData(client,userid,charid,"dreamingID");
  }

  if(target=="NONE"){
    return;
  }

  let vit = client.charcall.charData(client,target,"vit");
  let gel = client.charcall.allData(client,userid,target,"gel");

  if(vit<gel){
    let heal = 5;
    if(client.traitcall.traitCheck(client,target,"CUSHIONED")[1]){
      heal*=4;
    }
    else if(client.traitcall.traitCheck(client,target,"CUSHIONED")[0]){
      heal*=2;
    }

    if(vit+heal>gel){
      client.charcall.setAnyData(client,userid,target,gel,"vit");
    }
    else{
      client.charcall.setAnyData(client,userid,target,vit+heal,"vit");
    }
  }
}


exports.move = function(client,message,charid,local,target,mapCheck,msg,embedTitle="moving to"){
  let targetLandID = target[4];
  let targSec = client.landMap.get(targetLandID,target[0]);
  var occset = [(client.charcall.npcCheck(client,charid)?false:true),charid];
  var userid = message.guild.id.concat(message.author.id);

  // Remove the character from the previous room
  if(local[0]==target[0]&&local[4]==target[4]){
    let roomFrom = targSec[local[1]][local[2]][2][local[3]];
    roomFrom[4].splice(roomFrom[4].findIndex(occpos => occpos[1] === occset[1]),1);
  }
  // Remove the character from the previous room, interdimensionally
  else if(client.landMap.has(local[4])) {

    let sec = client.landMap.get(local[4],local[0]);
    let roomFrom = sec[local[1]][local[2]][2][local[3]];
    if(sec[0]){
      roomFrom[4].splice(roomFrom[4].findIndex(occpos => occpos[1] === occset[1]),1);
      client.landMap.set(local[4],sec,local[0]);
    }
  }

  let targetTile = onSomeoneEnterRoom(client, message, charid, targSec[target[1]][target[2]], target[3], target[0]);

  targetTile[2][target[3]][4].push(occset);
  if(targetLandID==message.guild.id+"medium" && targetTile[2][target[3]][4].length==1){
    switch(target[0]){
      case "d":
      case "dm":
        targetTile[2][target[3]][4]=targetTile[2][target[3]][4].concat(client.landcall.carSpawn(client,target,0,message.guild.id));
      break;
      case "p":
      case "pm":
        targetTile[2][target[3]][4]=targetTile[2][target[3]][4].concat(client.landcall.carSpawn(client,target,1,message.guild.id));
      break;
      case "bf":
        targetTile[2][target[3]][4]=targetTile[2][target[3]][4].concat(client.landcall.carSpawn(client,target,0,message.guild.id),client.landcall.carSpawn(client,target,1,message.guild.id));
      break;
    }
  }
  else if(targetLandID!=message.guild.id+"medium"){
    if(targetTile[2][target[3]][4].length==1){
      targSec =  client.strifecall.underSpawn(client,target,targSec,message.guild.id);
    }
  }

  //for now, NPCs won't reveal new tiles.
  if(!client.charcall.npcCheck(client,charid)&&targetTile[2][target[3]][3]==false){
    client.funcall.actionCheck(client,message,"tile")
    targetTile[2][target[3]][3]=true;
  }

  targSec[target[1]][target[2]] = targetTile;

  client.funcall.tick(client,message);
  client.charcall.setAnyData(client,userid,charid,target,"local");
  client.landMap.set(target[4],targSec,target[0]);

  let occNew = targetTile[2][target[3]][4];
  let location = targetTile[2][target[3]][2];
  msg +=`**${location}**`

  if(occNew.length > 1){
    let occCheck = [false,false];
    for(let i=0;i<occNew.length;i++){
      if(occNew[i][0]==false){
        occCheck[0]=true;
      } else if(!occNew[i][1]==charid){
        occCheck[1]=true;
      }
    }
  }

  if(targetTile[2].length>1){
    msg+=`\nThere are multiple rooms in this area!`;
  }

  async function moveEmbed(){
    var userid = message.guild.id.concat(message.author.id);
    var charid = client.userMap.get(userid,"possess");
    dex = targetTile[2][target[3]][5];
    var attachment = await client.imgcall.sdexCheck(client,message,0,false,3,dex,dex.length,`${targetTile[2][target[3]][2]} (>inspect)`);
    let occList = targetTile[2][target[3]][4];

    let i;
    let list = ``;
    for(let i=0;i<10&&i<occList.length;i++){
      list+=`**[${i+1}] ${client.charcall.charData(client,occList[i][1],"name").toUpperCase()}** \n *${client.charcall.charData(client,occList[i][1],"type")}*\n\n`
    }

    var listEmbed;
    var files = [attachment];
    listEmbed = new client.MessageEmbed()
      .setTitle(`**${embedTitle.toUpperCase()} ${targetTile[2][target[3]][2]}**`)
      .addFields(
        {name:`**ALERTS**`,value:msg},
        {name:`**ROOM**`,value:`**${targetTile[2][target[3]][2]}**`,inline:true},
        {name:`**PAGE**`,value:`**1**`,inline:true},
        {name:`**CURRENT OCCUPANTS** (>list)`,value:list}
      )
      .setImage(`attachment://actionlist.png`);
    if(mapCheck){
      miniMap = await client.landcall.drawMap(client,message,true);
      files.push(miniMap);
      listEmbed.setThumbnail(`attachment://landmap.png`);
    }
      client.channels.cache.get(client.charcall.allData(client,userid,charid,"channel")).send({embeds:[listEmbed], files:files});

      let checkQuest = client.questcall.checkQuest(client,userid,charid,occList);
      if(checkQuest[0]>0){
        let qfiles = [];
        let qattachement;
        for(let i=0;i<checkQuest[0];i++){
          qattachment = await client.diocall.dialogue(client,checkQuest[1][i][0],checkQuest[1][i][1]);
          qattachment.name = `dialogue${i}.png`
          qfiles.push(qattachment);
        }
        if(checkQuest[2]>0){
          let curBoon = client.charcall.allData(client,userid,charid,"b");
          let embed = new client.MessageEmbed()
          .setTitle(`**${client.charcall.charData(client,charid,"name")}** gained BOONDOLLARS!`)
          .addFields({name:`**BOONDOLLARS**`,value:`${client.emojis.cache.get(client.emoji["BOONS"])} ${curBoon} + ${checkQuest[2]}= **${curBoon+checkQuest[2]}**`,inline:true});
          client.charcall.setAnyData(client,userid,charid,curBoon+checkQuest[2],"b");
          client.channels.cache.get(client.charcall.allData(client,userid,charid,"channel")).send({embeds:[embed], files:qfiles});
        }else{
          client.channels.cache.get(client.charcall.allData(client,userid,charid,"channel")).send({files:qfiles});
        }
      }

  }

  let name = client.charcall.charData(client,charid,"name");

  for(let i=0;i<occNew.length;i++){
    try{
      if(occNew[i][1]!=charid){
      client.funcall.chanMsg(client,occNew[i][1],`**${name.toUpperCase()}** has entered the room!`)
    }

    }catch(err){
      console.log(err);
    }
  }
  moveEmbed();
  setTimeout(function(){
    client.tutorcall.progressCheck(client,message,8);
    client.tutorcall.progressCheck(client,message,9)
  },1500);
}
function dreamCheck(client,target,local){

  let targLocal = client.charcall.charData(client,target,"local");

  if(targLocal[0]===local[0]&&targLocal[1]===local[1]&&targLocal[2]===local[2]&&targLocal[3]===local[3]&&targLocal[4]===local[4]){
    return true;
  }
  else {
    return false;
  }
}
exports.dreamCheck =  function(client,target,local){
  return dreamCheck(client,target,local);
}

function onSomeoneEnterRoom(client, message, charid, tile, roomIndex, map){
  // console.log("onSomeoneEnterRoom called!");
  if(!tile[2] || !tile[2][roomIndex]){
	console.log("onSomeoneEnterRoom called on entering a room that doesn't exist!");
	return tile;
  }
  
  let triggers = tile[2][roomIndex][1];
  if(!triggers){
	return tile;
  }
  
  tile = actOnActionList(client, message, charid, tile, roomIndex, map, triggers.any);
  tile = actOnActionList(client, message, charid, tile, roomIndex, map, triggers.onSomeoneEnterRoom);
  
  return tile;
}

function actOnActionList(client, message, charid, tile, roomIndex, map, actionList){
  if(!actionList || actionList.length == 0){
	return tile;
  }

  for(let i=actionList.length - 1; i>=0; i--){
	let removeFromTriggers = [];
	let functionName = actionList[i].toUpperCase();
	switch(functionName){
	  case "LOOT_A":{
		let sec = getSectionFromMapName(map);
		if(isNaN(sec)){
			console.log(`LOOT_S trigger was unable to glean sec from designation "${map}"`);
			break;
		}
		tile[2][roomIndex][5] = [client.lootcall.lootA(client, sec, client.randcall.rollXdY(2,8) - 2)];

		removeFromTriggers.push(tile[2][roomIndex][1].onSomeoneEnterRoom);
		break;
	  }
	  case "LOOT_B":{
		let sec = getSectionFromMapName(map);
		if(isNaN(sec)){
			console.log(`LOOT_B trigger was unable to glean sec from designation "${map}"`);
			break;
		}
		tile[2][roomIndex][5] = [client.lootcall.lootB(client, sec, client.randcall.rollXdY(2,8) - 2)];

		removeFromTriggers.push(tile[2][roomIndex][1].onSomeoneEnterRoom);
		break;
	  }
	  case "DISTINGUISH":{
		if(roomIndex == 0){
		  console.log("Distinguishing tile!");
		  tile = JSON.parse(JSON.stringify(tile));
		}
		else{
		  console.log("Distinguishing room!");
		  tile[2][roomIndex] = JSON.parse(JSON.stringify(tile[2][roomIndex]));
		}
		removeFromTriggers.push(tile[2][roomIndex][1].any);
		break;
	  }
      default:{
	    console.log(`actOnActionList encountered unexpected action ${actionList[i].toUpperCase()}`);
	  }
	}
	
	for(let j=0; j<removeFromTriggers.length; j++){
	  removeFromTriggers[j].splice(removeFromTriggers[j].findIndex(name => name.toUpperCase() === functionName), 1);
	}
  }

  console.log(JSON.stringify(tile));
  return tile;
}


function getSectionFromMapName(mapName){
	switch(mapName){
		case "s1":
		case "s1d":
			return 1;
		case "s2":
		case "s2d":
			return 2;
		case "s3":
		case "s3d":
			return 3;
		case "s4":
		case "s4d":
			return 4;
	}

	return undefined;
}
