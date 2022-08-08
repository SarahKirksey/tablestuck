const log = true;
//Declaring important variables
const tierDmg = [1,5,7,10,14,19,25,32,40,49,59,70,82,95,109,124,140];
const tierBD = [[1,2],[1,4],[1,6],[1,8],[1,10],[1,12],[2,16],[2,20],[2,24],[3,30],[3,36],[4,40],[5,50],[6,60],[7,70],[8,80],[10,100]];
const tierAv = [1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];

                  // 0                 //5                //10                //15                //20                //25                //30                //35                //40                //45                //50                //55                     //60                     //65                     //70                     //75                     //80                     //85                      //90                          //95                         //100
const rungGrist = [ 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 88, 96,104,112,120,128,136,144,152,160,176,192,208,224,240,256,272,288,304,320,352,384,416,448,480,512,544,576,608,640,704,768,832,896,960,1024,1088,1152,1216,1280,1408,1536,1664,1792,1920,2048,2176,2304,2432,2560,2816,3072,3328,3584,3840,4096,4352,4608,4864,5120,5632,6144,6656,7168,7680,8192,8704,9216,9728,10240,11264,12288,13312,14336,15360,16384,17408,18432,19456,20480];
const rungReq   = [  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 34, 38, 42, 46, 50, 54, 58, 62, 66, 70, 78, 86, 94,102,110,118,126,134,142,150,166,182,198,214,230,246,262,278,294,310,342,374,406,438,470, 502, 534, 566, 598, 630, 694, 758, 822, 886, 950,1014,1078,1142,1206,1270,1398,1526,1654,1782,1910,2038,2166,2294,2422,2550,2806,3062,3318,3574,3830,4086,4342,4598,4854, 5110, 5622, 6134, 6646, 7158, 7670, 8182, 8694, 9206, 9718,10230,9999999999999999];
const rungGel   = [100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,205,210,215,220,225,230,235,240,245,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500, 510, 520, 530, 540, 550, 565, 580, 595, 610, 625, 640, 655, 670, 685, 700, 715, 730, 745, 760, 775, 790, 805, 820, 835, 850, 865, 880, 895, 910, 925, 940, 955, 970, 985, 1000, 1020, 1040, 1060, 1080, 1100, 1120, 1140, 1160, 1180, 1200, 1220, 1240, 1260, 1280, 1300]; // Additional values added to support PLUSH trait
const rungBoon  = [  0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80,160,160,160,160,160,160,160,160,160,160,320,320,320,320,320, 320, 320, 320, 320, 320, 640, 640, 640, 640, 640, 640, 640, 640, 640, 640,1280,1280,1280,1280,1280,1280,1280,1280,1280,1280,2560,2560,2560,2560,2560,2560,2560,2560,2560, 2560, 5120, 5120, 5120, 5120, 5120, 5120, 5120, 5120, 5120, 5120]
const actionList = ["accede","accelerate","accessorize","acclaim","acclimate","accomplish","account","accumulate","accuse","acerbate","acknowledge","acquaint","acquire","actualize","actuate","activate","acupressure","arbitrate","arborize","archive","ardor","arf","argufy","arise","arithmetize","armamentify","arraign","arrange","arrest","arrive","arrogate","arsenalize","articulate","artillerate","asphixiate","aspire","ass","assail","assassinate","assault","assemble","assert","assess","asseverate","assign","assimilate","assist","assure","astonish","astound","astrict","arsonate","accomodate","abuse","abjure","abstain","absorb","abolish","abstract","abate"]


const gristTypes = ["build","uranium","amethyst","garnet","iron","marble","chalk","shale","cobalt","ruby","caulk","tar","amber","artifact","zillium","diamond"];


function inflict(client, message, local, list, target, chance, status, attacker){
  //quickjump
    let alert = ``;
  if(!list[target][7].includes(status)){
    if(!Math.floor((Math.random() * chance))){

      if(client.traitcall.traitCheck(client,list[target][1],"BREATH")[1]){
        alert+= `**UNRESTRAINED** TARGET IS IMMUNE TO ALL STATUS EFFECTS!\n`;
        return alert;
      }
      if(list[target][7].includes("STATUSIMMUNE")){
        alert+=  `TARGET IS IMMUNE TO STATUS EFFECTS THIS TURN!\n`;
        return alert;
      }
      if(client.traitcall.traitCheck(client,list[target][1],"ELECTRIC")[1]&& status=="STUN"){
        alert+= `TARGET IS IMMUNE TO STUN!\n`;
        return alert;
      }

      list[target][7].push(status);
      alert+= `INFLICTED ${status} ON OPPONENT!\n`;

      if(client.traitcall.traitCheck(client,list[target][1],"BLOOD")[1]){
        let bl;
          alert+=`**THICKER THAN WATER** Target shared status effect with everyone!\n`;
        for(bl=0;bl<list.length;bl++){
          alert+= inflict(client,message,local,list,bl,1,status,attacker);
        }
      }
      if(client.traitcall.traitCheck(client,list[attacker][1],"COLD")[1]&& status=="FROSTBITE"){
        list[target][7].push("DAZED");
        alert+= `INFLICTED DAZE ON OPPONENT!\n`;
      }
    }

}
return alert;
}

function passTurn(client, charid, message, local) {

  let strifeLocal = `${local[0]}/${local[1]}/${local[2]}/${local[3]}/${local[4]}`;

  //check if the strife exists in the database
  if(client.strifeMap.has(strifeLocal)){
  //Retrieve information from strife database
  let turn = client.strifeMap.get(strifeLocal,"turn");
  let list = client.strifeMap.get(strifeLocal,"list");
  let init = client.strifeMap.get(strifeLocal,"init");
  //quick catch to ignore any pass if it's not the creature's turn, if it passes other similar checks.
  //console.log(`The passing creature is ${charid}.\n it's ${list[init[turn][0]][1]}'s turn right now.'`)
if(client.charcall.charData(client,charid,"pos")!=init[turn][0]){
    console.log("stopped a pass from a creature out of turn!");
    return;
  }

  //check if the character whose turn it is has any status effects
  for(let i=(list[init[turn][0]][7].length - 1);i>=0;i--){
    switch(list[init[turn][0]][7][i]){
      case "TARGFAV":
      case "GRAPPLE":
      case "PROTECT":
      case "NEXTBD":
      case "NEXTFAV":
        removed = list[init[turn][0]][7].splice(i,1);
    }
  }

//reset favorability to 0
  list[init[turn][0]][4]=0;

  client.strifeMap.set(strifeLocal,list,"list");

  let active = client.strifeMap.get(strifeLocal,"active");

  let msg;

   msg = `${client.charcall.charData(client,list[init[turn][0]][1],"name")} passes their turn!`;

 //send passing turn message to every participating character's terminal channel
  for(let i=0;i<active.length;i++){
    if(client.charcall.controlCheck(client,list[active[i]][1])){
      client.funcall.chanMsg(client,list[active[i]][1],msg);
    }
  }

//keep passing turn until turn is passed to a character who is still alive
  let check = false;
  var newturn;
  let endCheck = false;

  for(turn++;check==false;turn++){
    if(turn>=init.length){
      turn = 0;
    }
    //if there is only one character left, preps to end combat.
    if(active.length<=1){
      check = true;
      endCheck = true;
    }
    if(active.includes(init[turn][0])){
      newturn = turn;
      check = true;
    }
  }

  if(!endCheck){
  client.strifeMap.set(strifeLocal,newturn,"turn");
  //call the command to start the next character's turn
  setTimeout(startTurn,1500,client,message,local);
} else {
  for(let i=0;i<active.length;i++){
    //removes every character with a controller.
    if(client.charcall.controlCheck(client,list[active[i]][1]))
      leaveStrife(client,message,local,active[i]);
  }

}

} else {
  console.log("Stopped passTurn being run in a location with no strife!");
}

}

//function used to kill characters when their vitality reaches 0

function kill(client,message,local,target,pos){
try{
  let strifeLocal = `${local[0]}/${local[1]}/${local[2]}/${local[3]}/${local[4]}`;
  let list = client.strifeMap.get(strifeLocal,"list");
  let active = client.strifeMap.get(strifeLocal,"active");
  let userid = message.guild.id.concat(message.author.id);
  //sets the target to be dead, regardless of character type.
  client.charcall.setAnyData(client,userid,list[target][1],false,"alive");
  //if the character dying is a player, give kill credit.
  if(client.charcall.charData(client,list[target][1],"type")=="player"){

  charid = client.userMap.get(userid,"possess");
  //as long as the killer has a character that tracks player kills, they get the credit.
  if(client.charcall.allData(client,userid,charid,"playersDefeated")!="NONE"){
  increase = client.charcall.allData(client,userid,charid,"playersDefeated");
  increase++;
  client.charcall.setAnyData(client,userid,charid,increase,"playersDefeated");
  if(increase>client.landMap.get(`${message.guild.id}mediumlead`,"playersDefeated")[1]){
    client.landMap.set(`${message.guild.id}mediumlead`,[client.charcall.charData(client,charid,"name"),increase],"playersDefeated");
  }
}
    let name = client.charcall.charData(client,list[target][1],"name");
    let underlevel = [];
    //send death message to all participating character's terminals
    for(let k=0;k<active.length;k++){
      //any npcs involved in killing a player gain xp, amount to be changed.
      if(client.charcall.charData(client,list[active[k]][1],"faction")!="player"&&client.charcall.allData(client,userid,list[active[k]][1],"xp")!="NONE"){
        underlevel.push(list[active[k]][1]);
      }
      //don't need to filter out if a character is controlled, chanMsg does that.
      else if(list[active[k]][1]!=list[target][1]){
      client.funcall.chanMsg(client,list[active[k]][1],`${name} died!`);
      }
    }
    underxp = Math.floor(client.charcall.allData(client,userid,list[target][1],"xp")/2/underlevel.length);
    for(let i=0;i<underlevel.length;i++){
      client.funcall.chanMsg(client,underlevel[i],`${name} died!\nYou gained ${underxp} XP!`);
      giveXp(client,underlevel[i],underxp);
    }
      client.funcall.chanMsg(client,list[target][1],`***YOU DIED***`);

    //call the function to remove the character from strife
    //if there were only two characters left, both are removed from strife.
    if(active.length==2){
      leaveStrife(client,message,local,target);
      message.channel.send(`Last opponent defeated!`);
      leaveStrife(client,message,local,pos);
      //this is for if you kill yourself in strife.
    }else if(active.length<=1){
      leaveStrife(client,message,local,pos);
      //in every other case,just the dead player is removed.
    } else {
      leaveStrife(client,message,local,target);
    }
    //since leaveStrife already handles ending strife, it doesn't need to be touched here.
//end of player kill
  }else{
    //the only reason npcs are seperate from players here is because they need to drop grist.
    let npc;
    npc = client.charcall.charData(client,list[target][1],"type");

    if(npc=="unicorn"||npc=="kraken"||npc=="hecatoncheires"||npc=="denizen"){
      client.funcall.actionCheck(client,message,"boss");
    }else if (npc=="underling") {
      client.funcall.actionCheck(client,message,"underling");
    }
    client.questcall.stepQuest(client,userid,charid,`kill${npc}`);

let rewardMsg = `The **${client.charcall.charData(client,list[target][1],"name")}** has been defeated! \nYou get `
let xp;
if(client.charcall.allData(client,userid,list[target][1],"xp")!="NONE"){
xp = client.underlings[npc].xp+client.charcall.allData(client,userid,list[target][1],"xp");
} else {
xp = client.underlings[npc].xp;
}


    //figure out what all the underling drops on death
const BUILD = 0;
const ARTIFACT = 13;
const ZILLIUM = 14;
switch(client.charcall.charData(client,list[target][1],"faction")){
    case "underling":
    let primaryType = list[target][2];
    let secondType;
    let ranroll = (Math.floor((Math.random() * 8) + 1)) + (Math.floor((Math.random() * 20) + 1));
    let repgrist = "build";
    let repGristIndex = BUILD;
    switch(ranroll){
      case 2:
        secondType = "rainbow";
      break;
      case 15:
        secondType = "diamond";
      break;
      case 16:
        secondType = "zillium";
      break;
      default:
        let typeRoll = Math.floor((Math.random() * 12) + 1);
        secondType = gristTypes[typeRoll];
    }

    if(list[target][7].includes("CORRUPT")){
      repgrist = "artifact";
      primaryType = "artifact";
      secondType = "artifact";
      repGristIndex = ARTIFACT;
    }
    if(client.traitcall.traitCheck(client,list[pos][1],"TRICKSTER")[1]){
      repgrist = "zillium";
      primaryType = "zillium";
      secondType = "zillium";
      repGristIndex = ZILLIUM;
    }
    //split rewards between all participating players

    let multiplier;
    switch(client.configcall.get(client, message, "GRIST")){
      case 1:
      multiplier = 2;
      break;
      case 2:
      multiplier = .5;
      break;
      default:
      multiplier = 1;
    }
    let players = [];
    //this defines players as characters who are possessed and can hold grist, disregarding
    //the currently dying npc (in case its an npc that can hold grist.)
    for(let i=0;i<active.length;i++){
     if(active[i]!=target&&client.charcall.controlCheck(client,list[active[i]][1])&&client.charcall.allData(client,userid,charid,"grist")!="NONE"){
       players.push(list[active[i]][1]);
     }
    }
    let amount = (client.underlings[npc].drop / players.length)*multiplier;
    if(client.traitcall.traitCheck(client,list[pos][1],"META")[1]){
      amount*=2;
    }
    if(list[target][7].includes("DOUBLEGRIST")){
      amount*=2;
    }
    for(let i=0;i<players.length;i++){
      let charid = players[i];
      let userid = client.charcall.charData(client,charid,"control");
      let rung = client.charcall.allData(client,userid,charid,"rung");
      let grist = client.charcall.allData(client,userid,charid,"grist");
      let godtier = client.charcall.allData(client,userid,charid,`godtier`);
      //if an npc can collect grist but can't godtier, this will avoid crashes.
      if(godtier=="NONE") godtier = false;

      if((repgrist == "build") != (repGristIndex == 0)){
        console.log(`Something went wrong! repgrist is ${repgrist}, but the index is ${repGristIndex}!`);
      }

      if(!godtier&&grist[repGristIndex]+Math.ceil(amount*4)>rungGrist[rung]){
        grist[repGristIndex]=rungGrist[rung];
      } else {
        grist[repGristIndex]+=Math.ceil(amount*4);
      }

      if(!godtier&&grist[client.grist[primaryType].pos]+Math.ceil(amount*2)>rungGrist[rung]){
        grist[client.grist[primaryType].pos]=rungGrist[rung];
      } else {
        grist[client.grist[primaryType].pos]+=Math.ceil(amount*2);
      }
      //if rainbow grist, add to all grist types
      if(secondType=="rainbow"){
        let j;
        for(j=1;j<13;j++){
          if(!godtier&&grist[j]+Math.ceil(amount)>rungGrist[rung]){
            grist[j]=rungGrist[rung];
          } else {
            grist[j]+=Math.ceil(amount);
          }
        }

      } else {
        if(!godtier&&grist[client.grist[secondType].pos]+Math.ceil(amount)>rungGrist[rung]){
          grist[client.grist[secondType].pos]=rungGrist[rung];
        } else {
          grist[client.grist[secondType].pos]+=Math.ceil(amount);
        }
      }
      rewardMsg+=`**${client.emojis.cache.get(client.grist[repgrist].emoji)} ${Math.ceil(amount*4)}, ${client.emojis.cache.get(client.grist[primaryType].emoji)} ${Math.ceil(amount*2)}, ${client.emojis.cache.get(client.grist[secondType].emoji)} ${Math.ceil(amount)}** and `;
      client.charcall.setAnyData(client,userid,charid,grist,"grist");

    if(!godtier&&client.charcall.allData(client,userid,charid,"xp")!="NONE"){
      client.funcall.chanMsg(client,charid,`${rewardMsg}**${xp} XP**`);
      giveXp(client,charid,xp);
    } else {
      client.funcall.chanMsg(client,charid,`${rewardMsg}**0 XP**`);
    }
  }
    break;
    case "derse":
    case "prospit":
    for(i=0;i<active.length;i++){
      let charid = list[active[i]][1];
      client.funcall.chanMsg(client,charid,`The **${client.charcall.charData(client,list[target][1],"name")}** has been defeated!`);
    }
    break;
    default:
    name = client.charcall.charData(client,list[target][1],"name");
    for(i=0;i<active.length;i++){
      let charid = list[active[i]][1];
      client.funcall.chanMsg(client,charid,`The **${name}** has been defeated!`);
    }
    break;
}
//call function to remove the dead target from strife
      leaveStrife(client,message,local,target);
      if(active.length<=1){
        client.tutorcall.progressCheck(client,message,37,["text",`Last opponent defeated, leaving Strife!`]);
        leaveStrife(client,message,local,0,false);

      }
  }
}catch(err){
  console.log(err);
}

}

function giveXp(client,target,xp){
  userid = client.charcall.charData(client,target,"control")[0];
  curXp = client.charcall.allData(client,userid,target,"xp");
  curRung = client.charcall.allData(client,userid,target,"rung");

//check if XP gained is higher than what is needed to level up

  if((curRung==100)||(curXp+xp)<rungReq[(curRung+1)]){
    //if not levelling up, set new XP total
    client.charcall.setAnyData(client,userid,target,curXp + xp,"xp");
  } else {
    let curGv = client.charcall.allData(client,userid,target,"gel");
    let curBoon = client.charcall.allData(client,userid,target,"b");
    let name = client.charcall.allData(client,userid,target,"name");
    let newRung = curRung;
    let newGv;
    let newBoon = curBoon;
    let i;

    //give rewards for every new rung climbed
    for(i=curRung;curXp + xp >= rungReq[(i+1)]; i++){
      newBoon+=rungBoon[i+1];
    }

    client.charcall.setAnyData(client,userid,target,curXp + xp,"xp");
    client.charcall.setAnyData(client,userid,target,rungGel[i],"gel");
    client.charcall.setAnyData(client,userid,target,i,"rung");
    client.charcall.setAnyData(client,userid,target,newBoon,"b");

    let congrats = new client.MessageEmbed()
    .setTitle(`**${name}** climbed their ECHELADDER!`)
    .addFields(
      {name:`**RUNG**`,value:`${curRung} + ${i - curRung}`,inline:true},
      {name:`**GEL VISCOSITY**`,value:`${client.emojis.cache.get(client.emoji["GEL"])} ${curGv} + ${rungGel[i] - curGv}`,inline:true},
      {name:`**BOONDOLLARS**`,value:`${client.emojis.cache.get(client.emoji["BOONS"])} ${curBoon} + ${newBoon - curBoon}`,inline:true}
    );
    client.funcall.chanMsg(client,target,"NONE",congrats);

  }
}

function leaveStrife(client,message,local,pos,leavemsg = true){

  let strifeLocal = `${local[0]}/${local[1]}/${local[2]}/${local[3]}/${local[4]}`
  if(!client.strifeMap.has(strifeLocal)) return;
  let list = client.strifeMap.get(strifeLocal,"list");
  let init = client.strifeMap.get(strifeLocal,"init");
  var charid = list[pos][1];
  let userid = client.charcall.charData(client,charid,"control");
  let turn = client.strifeMap.get(strifeLocal,"turn");
  let active = client.strifeMap.get(strifeLocal,"active");
  let sec = client.landMap.get(local[4],local[0]);

//if it's an npc without a controller leaving, it will be deleted from the room.
if((userid=="NONE"||userid.length<1)&&!list[pos][0]){
let removed = [active.splice(active.indexOf(pos),1),sec[local[1]][local[2]][2][local[3]][4].splice(sec[local[1]][local[2]][2][local[3]][4].findIndex(occpos => occpos[1] === list[pos][1]),1)];
client.strifeMap.set(strifeLocal,active,"active");
client.landMap.set(local[4],sec,local[0]);
if(init[turn][0] == pos){
  setTimeout(passTurn,1500,client,charid,message,local);
}
return;
} else {
  players=[];
  for(let i=0;i<active.length;i++){
    if(client.charcall.controlCheck(client,list[active[i]][1])){
      players.push(list[active[i]]);
    }
  }
  if(players.length <= 1){
    for(let i=0;i<active.length;i++){
      client.charcall.setAnyData(client,userid[0],list[active[i]][1],false,"strife");
    }
    client.strifeMap.delete(strifeLocal);
    let vit = Math.max(list[pos][3] - getCharHealth(client,userid[0],charid)[2], 1);
    client.charcall.setAnyData(client,userid[0],charid,vit,"vit");

  }else{
    //remove player from list of active characters
    let removed = [active.splice(active.indexOf(pos),1)];
    client.strifeMap.set(strifeLocal,active,"active");
    client.landMap.set(local[4],sec,local[0]);
    client.charcall.setAnyData(client,userid[0],charid,false,"strife");
    let vit = Math.max(list[pos][3] - getCharHealth(client,userid[0],charid)[2], 1);
    client.charcall.setAnyData(client,userid[0],charid,vit,"vit");
    if(init[turn][0] == pos){
      setTimeout(passTurn,1500,client,charid,message,local);
    }
  }
}


  if(!client.charcall.charData(client,charid,"alive")){
    if(client.charcall.allData(client,userid[0],charid,"dreamingID")=="NONE"){
      //if the character has no dreamself, it is likely an underling, so it is removed from the room
      //and the controller is pushed back to their default body.
      let removed = sec[local[1]][local[2]][2][local[3]][4].splice(sec[local[1]][local[2]][2][local[3]][4].findIndex(occpos => occpos[1] === list[pos][1]),1);
      client.landMap.set(local[4],sec,local[0]);
      let controllers = client.charcall.charData(client,charid,"control");
      console.log(`Controllers: ${controllers}`);
      for(let i=0;i<controllers.length;i++){
      target = client.charcall.allData(client,controllers[i],charid,"speeddial")[0];
      client.userMap.set(controllers[i],target,"possess");
      targList = client.charcall.charData(client,target,"control");
      targList.push(controllers[i]);
      client.charcall.setAnyData(client,userid,target,targList,"control");
      }
      client.funcall.chanMsg(client,charid,`You have been shifted to your first Speed Dial option.`);
      client.charcall.setAnyData(client,userid,charid,[],"control");
      return;
    }
    //switches the dreaming and waking self, and all those who control them.
    if(client.configcall.get(client, message, "DEATH")==0){
      if(client.charcall.allData(client,userid,charid,"dreamer")){
        target = client.charcall.allData(client,userid,charid,"wakingID");
      } else {
        target = client.charcall.allData(client,userid,charid,"dreamingID");
      }
    (client.charcall.allData(client,userid,charid,"dreamer")?client.charcall.setAnyData(client,userid,charid,false,"dreamer"):client.charcall.setAnyData(client,userid,charid,true,"dreamer"));
    //up to here, the actual number of controllers has beeen arbitrary, since nothing was changed.
    //now we need to make sure all controllers are moved to the other self and
    //possession is set appropriately.
    let controllers = client.charcall.charData(client,charid,"control");
    let targList = client.charcall.charData(client,target,"control");
    for(let i=0;i<controllers.length;i++){
    client.userMap.set(controllers[i],target,"possess");
    targList.push(controllers[i]);
    }
    client.charcall.setAnyData(client,userid,charid,[],"control");
    client.charcall.setAnyData(client,userid,target,targList,"control");
  client.funcall.chanMsg(client,target,`You've been knocked out! You are currently awake as ${(client.charcall.allData(client,userid,charid,"dreamer")?`your dream self`:`your waking self`)}, and your other body is at ${client.charcall.charData(client,charid,"vit")} VIT. perform various actions as your current self to heal, and >sleep when your body is healed again!`);
} else {
  let godtier = client.charcall.allData(client,userid,charid,"godtier");
  if(godtier=="NONE") godtier = false;
  if(godtier){
    if(client.configcall.get(client, message, "IMMORTAL")==0){
      client.charcall.setAnyData(client,userid,charid,Date.now(),"sleepTimer");
      message.channel.send(`Looks like your conditional immortality saves you from perishing forever, though it'll take some time to get up again. You can ${client.auth.prefix}revive yourself in 5 minutes.`);
      return;
    } else {
      message.channel.send(`You've fallen in combat, and though you reached godtier, your life still hangs in the balance. Call out to your Author, and they will ${client.auth.prefix}revive you if your death was not Heroic or Just.`);
      return;
    }
  } else {
  sburbidArray = client.landMap.get(message.guild.id+"medium","playerList");
  local = client.charcall.charData(client,charid,"local");
  landName = client.landMap.get(local[4],"name");

  let msg = `A player has died! You have a weird sense they are `;
  switch(client.charcall.charData(client,charid,"local")[0]){
    case "h":
    msg += `in ${client.sburbMap.get(local[4],"name")}'s house...`;
    break;
    case "s1":
    case "s2":
    case "s3":
    case "s4":
    msg += `on the land of ${landName[0]} and ${landName[1]}...`;
    break;
    case "s1d":
    case "s2d":
    case "s3d":
    case "s4d":
    msg += `deep below the land of ${landName[0]} and ${landName[1]}...`;
    break;
    case "p":
    case "pm":
    msg += `on a bright moon...`;
    break;
    case "d":
    case "dm":
    msg += `on a dark moon...`;
    break;
    case "pc":
    msg += `in a bright castle...`;
    break;
    case "dc":
    msg += `in a dark castle...`;
    break;
    case "pmd":
    case "pmd1":
    case "pmd2":
    msg += `in a bright dungeon...`;
    break;
    case "dmd":
    case "dmd1":
    case "dmd2":
    msg += `in a dark dungeon...`;
    break;
    default:
    msg += `in some unknown place...`;
  }
  msg += ` You should try to find them, and ${client.auth.prefix}revive them!`;
  for(let i=0;i<sburbidArray.length;i++){
    destination = client.sburbMap.get(sburbidArray[i],"wakingID");
    altdestination = client.sburbMap.get(sburbidArray[i],"wakingID");
    if(destination!=charid&&altdestination!=charid){
      client.funcall.chanMsg(client,destination,msg);
    }
  }
}
  if(client.charcall.allData(client,userid,charid,"revived")){
  message.channel.send("It seems that you've died again. That might spell the end of your journey, for now...");
  } else {
  message.channel.send("Your allies have been alerted that you've perished. Now you can only wait for one of them to give you your second chance...");
  }
}
} else {
  if(leavemsg){
    setTimeout(client.funcall.chanMsg,1500,client,charid,"Leaving Strife!");
  }
}
}

//used to start a player or underlings turn and initiate

function startTurn(client, message, local) {
//retrieve strife id
  let strifeLocal = `${local[0]}/${local[1]}/${local[2]}/${local[3]}/${local[4]}`;

  client.strifeMap.set(strifeLocal,Date.now(),"time");
  let userid = message.guild.id.concat(message.author.id);
  let turn = client.strifeMap.get(strifeLocal,"turn");
  let list = client.strifeMap.get(strifeLocal,"list");
  let init = client.strifeMap.get(strifeLocal,"init");
  let type = client.charcall.charData(client,list[init[turn][0]][1],"type");
  let i;
//reset actions taken this turn
  list[init[turn][0]][6]=[];

  let stamina;
  let stamfav = 0;
  let stamroll;
  let stamsg;
  let carry = true;
  if(client.configcall.get(client, message, "RETAIN")==1){
    carry = false;
  }
  let removed;
  let stunned = false;
  let alert = ``;
//go through checking for status effects and applying them

//CLEARSTART

  for(i=(list[init[turn][0]][7].length-1);i>=0;i--){
    switch(list[init[turn][0]][7][i]){
      case "STAMFAV":
        stamfav++;
        removed = list[init[turn][0]][7].splice(i,1);
      break;
      case "HAUNT":
        removed = list[init[turn][0]][7].splice(i,1);
        list[init[turn][0]][7].push("HAUNT2");
      break;
      case "HAUNT2":
        removed = list[init[turn][0]][7].splice(i,1);
        list[init[turn][0]][7].push("HAUNT3");
      break;
      case "HAUNT3":
        removed = list[init[turn][0]][7].splice(i,1);
      break;
      case "CARRY":
        carry=true;
        removed = list[init[turn][0]][7].splice(i,1);
      break;
      case "STUN":
        stunned=true;
        removed = list[init[turn][0]][7].splice(i,1);
      break;
      case "ALLBD":
      case "ALLFAV":
      case "ALLUNFAV":
      case "DISCOUNT":
      case "ROLLOUT1":
      case "ROLLOUT2":
      case "STATUSIMMUNE":
      case "AV":
      case "DEFLECT":
      case "DEFROST":
      case "DEGRAP":
      case "GRISTINVERT":
        removed = list[init[turn][0]][7].splice(i,1);
      break;
      case "DAZED":
      stamfav--;
        removed = list[init[turn][0]][7].splice(i,1);
      break;
    }
  }
//roll player stamina
  stamMax = client.underlings[type].stm;

if(client.traitcall.traitCheck(client,list[init[turn][0]][1],"CHARLATAN")[0]){

  let specibus = client.charcall.charData(client,list[init[turn][0]][1],"spec");
  let equip = client.charcall.charData(client,list[init[turn][0]][1],"equip");

  if(specibus.length>0){

  let charlaCode = specibus[equip][1].substring(0,4) +
    client.captchaCode[Math.floor((Math.random() * (client.captchaCode.length-4)))+2]+
    client.captchaCode[Math.floor((Math.random() * (client.captchaCode.length-4)))+2]+
    client.captchaCode[Math.floor((Math.random() * (client.captchaCode.length-4)))+2]+
    client.captchaCode[Math.floor((Math.random() * (client.captchaCode.length-4)))+2];

  specibus[equip][1] = charlaCode;

  client.charcall.setAnyData(client,userid,list[init[turn][0]][1],specibus,"spec");

  }
}

if(client.traitcall.traitCheck(client,list[init[turn][0]][1],"TIME")[1]){
  stamfav++;
}

    let endurance = client.traitcall.traitCheck(client,list[init[turn][0]][1],"ENDURING");

    // Stamina value that are currently used are 4, 6, 8, 10, and 12.
    //        Normal     Enduring[0]     Enduring[1]
    //  4     1d4        1d3 + 1         1d2 + 2
    //  6     1d6        1d4.5 + 1       1d3 + 3     // 1d4.5 is basically (1d9)/2, round up.
    //  8     1d8        1d6 + 2         1d4 + 4
    //  10    1d10       1d7.5 + 2       1d5 + 5     // 1d7.5 is basically (1d15)/2, round up.
    //  12    1d12       1d9 + 3         1d6 + 6
    //
    if(endurance[1]){

      stamroll = [Math.floor((Math.random() * stamMax/2) + Math.floor(stamMax/2)+1),Math.floor((Math.random() * stamMax/2) + Math.floor(stamMax/2)+1)];

    } else if(endurance[0]){

      stamroll = [Math.floor((Math.random() * (stamMax-stamMax/4)) + Math.floor(stamMax/4)+1), Math.floor((Math.random() * (stamMax-stamMax/4)) + Math.floor(stamMax/4)+1)];

    } else {

    stamroll = [Math.floor((Math.random() * stamMax) + 1),Math.floor((Math.random() * stamMax) + 1)];

  }

    if(stamfav==0){
      stamina=stamroll[0];
      stamsg=`${stamroll[0]}`
    } else if(stamfav>0){
      if(stamroll[0]>stamroll[1]){
        stamina=stamroll[0];
        stamsg=`~~${stamroll[1]}~~ ${stamroll[0]}`
      } else {
        stamina=stamroll[1];
        stamsg=`~~${stamroll[0]}~~ ${stamroll[1]}`
      }
    } else {
      if(stamroll[0]<stamroll[1]){
        stamina=stamroll[0];
        stamsg=`~~${stamroll[1]}~~ ${stamroll[0]}`
      } else {
        stamina=stamroll[1];
        stamsg=`~~${stamroll[0]}~~ ${stamroll[1]}`
      }
    }

    if(client.traitcall.traitCheck(client,list[init[turn][0]][1],"LIFE")[0]&&list[init[turn][0]][5]>0){
      //let curVit = list[init[turn][0]][3];
      let gel = client.charcall.allData(client,userid,list[init[turn][0]][1],"gel");

      let heal = Math.floor((list[init[turn][0]][5]*.04)*gel);
      if((heal+list[init[turn][0]][3])>gel){
        list[init[turn][0]][3]=gel;
      } else {
        list[init[turn][0]][3]+=heal;
      }
      alert+=`\nLife trait consumed ${list[init[turn][0]][5]} STAMINA and restored ${heal} VITALITY!\n`;
      list[init[turn][0]][5] = 0;
    }

    if(client.traitcall.traitCheck(client,list[init[turn][0]][1],"LIFE")[1]){
      let armor = client.charcall.charData(client,list[init[turn][0]][1],"armor");
      let gel = client.charcall.allData(client,userid,list[init[turn][0]][1],"gel");
      let heal = Math.floor((Math.random() * (tierBD[armor[0][2]][1] - 1)) + tierBD[armor[0][2]][0]);

      if((heal+list[init[turn][0]][3])>gel){
        list[init[turn][0]][3]=gel;
      } else {
        list[init[turn][0]][3]+=heal;
      }
      alert+=`**GARDEN OF EDEN** passively regenerated ${heal} vitality!\n`;
    }

    if(carry==true||client.traitcall.traitCheck(client,list[init[turn][0]][1],"BUSINESS")[0]){
      let carrystam = list[init[turn][0]][5];

      stamsg +=` + ${carrystam}`;
      stamina += carrystam;
    }

    if(client.traitcall.traitCheck(client,list[init[turn][0]][1],"CANDY")[1]){
      stamina+=1;
      stamsg += ` + 1`;
    }
    if(client.traitcall.traitCheck(client,list[init[turn][0]][1],"BUSINESS")[1]){
      stamina+=1;
      stamsg += ` + 1`;
    }
    if(client.traitcall.traitCheck(client,list[init[turn][0]][1],"WELSH")[0]){
      stamina+=1;
      stamsg += ` + 1`;
    }
    if(client.traitcall.traitCheck(client,list[init[turn][0]][1],"TIME")[0]){
      stamina+=1;
      stamsg += ` + 1`;
    }

    if(list[init[turn][0]][7].includes("FROSTBITE")){
      stamina-=1;
      stamsg += ` - 1`;
    }
    if(stunned){
      stamina = 0;
      stamsg =`0 (STUNNED)`;
    }

    //set rolled stamina to strife data
    list[init[turn][0]][5]=stamina;

    client.strifeMap.set(strifeLocal,list,"list");

    let active = client.strifeMap.get(strifeLocal,"active");

    if(client.traitcall.traitCheck(client,list[init[turn][0]][1],"HEART")[1]){
      alert+=`**FEAR THE SUPEREGO** - Performed a random action for free!\n`;
    }



//retrieve player channel information

let turnMsg = ``;
  let ping = client.charcall.allData(client,userid,list[init[turn][0]][1],"ping");
//send message to player's channel
if(ping!="NONE"){
  turnMsg+=`${message.guild.members.cache.get(ping)} `;
}

  turnMsg+=`it's your turn!\nYou have ${stamsg} STAMINA and ${list[init[turn][0]][3]} VITALITY remaining!\nSee the list of actions you can take with ${client.auth.prefix}act, and ${client.auth.prefix}pass your turn once you're done!${alert}`;
//strifelist
//send message to player's channel
  let embed = strifeList(client,local,active,list,turn,init,list[init[turn][0]][1],0,`STRIFE LIST (>list)`);
    client.funcall.chanMsg(client,list[init[turn][0]][1],turnMsg,embed);

    for(i=0;i<active.length;i++){
      if(client.charcall.controlCheck(client,list[active[i]][0]) && active[i]!=init[turn][0]){
        client.funcall.chanMsg(client,list[active[i]][1],`${client.charcall.charData(client,list[init[turn][0]][1],"name")} starts their turn with ${stamsg} STAMINA!${alert}`);
      }
    }

    if(client.traitcall.traitCheck(client,list[init[turn][0]][1],"HEART")[1]){

    let heartTarg;
    let heartAttack =false;

    while(!heartAttack){

      heartTarg=active[Math.floor(Math.random()*active.length)];
      if(heartTarg!=init[turn][0]||active.length==1){
        heartAttack=true;
      }

    }
    let action = actionList[Math.floor(Math.random()*actionList.length)];
    act(client,charid,message,local,action,heartTarg);
    }

  if(client.charcall.charData(client,list[init[turn][0]][1],"control").length<1){
    setTimeout(npcTurn,1500,client,message,list[init[turn][0]][1],local);
  }

}

exports.pass = function(client,charid,message,local) {
  passTurn(client,charid,message,local);
}

exports.start = function(client, message, local) {
  setTimeout(startTurn,1500,client,message,local);
}

exports.turnTest = function(client, message, local) {
//test if it's a player's turn
  let strifeLocal = `${local[0]}/${local[1]}/${local[2]}/${local[3]}/${local[4]}`;

  let turn = client.strifeMap.get(strifeLocal,"turn");
  let init = client.strifeMap.get(strifeLocal,"init");
  var userid = message.guild.id.concat(message.author.id);
  var charid = client.userMap.get(userid,"possess");
  let pos = client.charcall.charData(client,charid,"pos");

  if(init[turn][0] == pos) {
    return true;
  } else {
    return false;
  }

}

exports.underSpawn = function(client, local, sec, sessionID) {
//chance to spawn an underling everytime a player moves in house or on underling tile
//roll random numbers to decide what underlings spawn where under specific circumstance
  let area = sec[local[1]][local[2]];
  let room = area[2][local[3]];

let underlingChoice;
let rung = client.sburbMap.get(local[4],"rung");
if(client.landMap.get(local[4],"enter")==false&&local[0]=="h"){
return sec;
}

switch (local[0]){
  case "h":
    if(rung < 15){
    underlingChoice=["imp"];
      } else {
    underlingChoice = ["imp","ogre"];
  }
  break;
  case "s1":
  underlingChoice = ["imp","ogre","basilisk"];
  break;
  case "s1d":
  underlingChoice = ["ogre","basilisk"];
  break;
  case "s2":
  underlingChoice = ["ogre","basilisk","lich"];
  break;
  case "s2d":
  underlingChoice = ["basilisk"];
  break;
  case "s3":
  underlingChoice = ["basilisk","lich","giclopse"];
  break;
  case "s3d":
  underlingChoice = ["basilisk","lich"];
  break;
  case "s4":
  underlingChoice = ["lich","giclopse","titachnid"];
  break;
  case "s4d":
  underlingChoice = ["lich"];
  break;
}
if(rung < 5){
spawnBank = Math.ceil(Math.random() * 2);
} else if( rung < 10){
  spawnBank = Math.ceil(Math.random() * 3);
} else {
spawnBank = Math.ceil(Math.random() * 6);
}

let npcCount = client.landMap.get(sessionID+"medium","npcCount");

while(spawnBank!=0){
let cost = Math.ceil(Math.random() * underlingChoice.length);

  if((spawnBank-(cost)) >= 0){
  npcCount++;
  sec[local[1]][local[2]][2][local[3]][4].push(underSpawn(client,local,underlingChoice[cost-1],sessionID,npcCount));
  spawnBank = spawnBank - (cost);
}
}
client.landMap.set(sessionID+"medium",npcCount,"npcCount");
return sec;
}

exports.leaveStrife = function(client,message,local,target){
  leaveStrife(client,message,local,target);
}

exports.underRally = function(client, local) {
//check if any underlings are in room, if so they will be added to the strife
  let sec = client.landMap.get(local[4],local[0]);
  let occList = sec[local[1]][local[2]][2][local[3]][4];

  let strifeLocal = `${local[0]}/${local[1]}/${local[2]}/${local[3]}/${local[4]}`

  let i;

  for(i=0;i<occList.length;i++){

    if(occList[i][0]==false&&client.charcall.charData(client,occList[i][1],"control").length===0&&client.charcall.charData(client,occList[i][1],"alive")){

      let profile = [false,occList[i][1],client.charcall.charData(client,occList[i][1],"gristtype"),client.charcall.charData(client,occList[i][1],"vit"),0,0,[],[]]
      client.charcall.setAnyData(client,'-',occList[i][1],true,"strife");
      let list = client.strifeMap.get(strifeLocal,"list");
      let init = client.strifeMap.get(strifeLocal,"init");
      let active = client.strifeMap.get(strifeLocal,"active");

      var pos = list.length;
      client.charcall.setAnyData(client,'-',occList[i][1],pos,"pos");
      let initRoll = [pos, Math.floor((Math.random() * 20) + 1)];

      list.push(profile);
      active.push(pos);

      let j;
      let placed = false;

      for(j=0;j<init.length  && placed==false;j++){
        if(init[j][1]<initRoll[1]){
          placed = true;
          let removed = init.splice(j,0,initRoll);
        } else {
          if(j+1==init.length){
            init.push(initRoll);
            placed = true;
          }
        }
      }



      client.strifeMap.set(strifeLocal,list,"list");
      client.strifeMap.set(strifeLocal,init,"init");
      client.strifeMap.set(strifeLocal,active,"active");

    }

  }

  }


  function act(client,charid,message,local,action,target){
    const HEALTH = 3;
    const STAMIN = 5;
    const STATUS = 7;

    let strifeLocal = `${local[0]}/${local[1]}/${local[2]}/${local[3]}/${local[4]}`;
    //if strife database does not exist, cancel code
    if(!client.strifeMap.has(strifeLocal)){
      console.log("Stopped a crash from act being run without a strife!");
      return;
    }

    let bounceCheck = false;

    client.strifeMap.set(strifeLocal,Date.now(),"time");
    var turn = client.strifeMap.get(strifeLocal,"turn");
    let list = client.strifeMap.get(strifeLocal,"list");
    let active = client.strifeMap.get(strifeLocal,"active");
    let init = client.strifeMap.get(strifeLocal,"init");

    //quick catch to ignore any action if it's not the creature's turn, if it passes other similar checks.
    if(client.charcall.charData(client,charid,"pos")!=init[turn][0]){
      console.log("stopped an action from a creature out of turn!");
      return;
    }
    if(action=="arbitrate"){
      action = actionList[Math.floor(Math.random()*actionList.length)];
    }

    let alert = ``;
    let dmgLvl = client.actionList[action].dmg;

    //check action tags
    let aa = client.actionList[action].add;

    let bd = 0;
    let br = 0;
    let fav = list[init[turn][0]][4];
    let bdmax = false;
    let strikeBonus = 0;

    let att = client.actionList[action].att;

    let grist;
    let dmg;
    let bdroll;
    let absorb = false;
    let tarGrist;

    if(client.traitcall.traitCheck(client,list[target][1],"BLOOD")[0]){
      if(!Math.floor(Math.random()*12)&&active.length>2){
        // Subtract two from the length to account for the attacker and the target.
        // Then, if the number is greater than or equal to either, shift it up.
        // This way, we effectively ignore the attacker and the original defender, without needing to reroll.
        let newTarget = active[Math.floor(Math.random()*(active.length-2))];
        if(newTarget>=target && newTarget>=init[turn][0]){
          target += 2;
        }
        else if (newTarget>=target || newTarget>=init[turn][0]){
          target += 1;
        }
        alert+=`The target was changed!\n`;
      }
    }

    if(aa.includes("RANDMG")){
        dmgLvl = Math.ceil(Math.random()*3);
    }

    try{
      //retrieve target grist
    tarGrist = list[target][2];
  } catch(err) {
    console.log(list[target][1]);
    console.log("THIS IS THE GUY, TAKE HIM OUT");
  }
    let targName = "Target"
    let attName = "Attacker"
//check if current turn is a player

let specibus = client.charcall.charData(client,list[init[turn][0]][1],"spec");
let equip = client.charcall.charData(client,list[init[turn][0]][1],"equip");

if(specibus.length>0){

grist = client.gristTypes[client.codeCypher[1][client.captchaCode.indexOf(specibus[equip][1].charAt(1))]];
dmg = tierDmg[specibus[equip][2]];
bdroll = tierBD[specibus[equip][2]];

}
else {
  let underling = client.charcall.charData(client,list[init[turn][0]][1],"type");
  dmg = client.underlings[underling].d;
  bdroll = client.underlings[underling].bd;
  grist = list[init[turn][0]][2];

}


  let attUnit = list[init[turn][0]];
  let targUnit = list[target];

  attName = client.charcall.charData(client,attUnit[1],"name");
  targName = client.charcall.charData(client,targUnit[1],"name");


    let brroll;
    let av = 0;

  let armor = client.charcall.charData(client,targUnit[1],"armor");

    if(armor.length>0){
      av = tierAv[armor[0][2]];
      brroll = tierBD[armor[0][2]];
    } else {
      av = client.underlings[client.charcall.charData(client,targUnit[1],"type")].av;
      brroll = client.underlings[client.charcall.charData(client,targUnit[1],"type")].bd;
    }
    let effective = "HIT!"

  try{
    let attackEfficacy = 0;

    // Establish basic efficacy: effective, ineffective, or neither.
    if(client.grist[tarGrist].ineffective.includes(grist)){
        attackEfficacy = 1;
    } else if(client.grist[tarGrist].effective.includes(grist)){
        attackEfficacy = -1;
    }

    // Check whether grist effectiveness should be inverted for this action.
    // If both combatants involved have inverted grist, or if they both do not, attacks are resolved normally.
    if(targUnit[STATUS].includes("GRISTINVERT") != attUnit[STATUS].includes("GRISTINVERT"))
    {
        attackEfficacy *= -1;
    }

    // Apply bonuses associated with the efficacy of the attack: BD for the attacker, or BR for the defender.
    // This is also a convenient place to include the REFINED trait bonus's logic.
    if(attackEfficacy > 0)
    {
      bd += attackEfficacy;
      effective="EFFECTIVE!";
      if(client.traitcall.traitCheck(client,attUnit[1],"REFINED")[0]){
        strikeBonus+=2;
      }
    }
    else if (attackEfficacy < 0)
    {
      br += (attackEfficacy * -1);
      effective="INEFFECTIVE!";
    }

    if(client.traitcall.traitCheck(client,attUnit[1],"NOIR")[0]){
      strikeBonus += Math.ceil(Math.random()*4);
    }

} catch(err) {
  console.log(err)
  console.log(grist);
  console.log(tarGrist);
}


    let targUnitGel = targUnit[0] ? getCharHealth(client, "-", targUnit[1])[1] : client.underlings[client.charcall.charData(client,targUnit[1],"type")].vit;
    if(!targUnit[0] && client.traitcall.traitCheck(client,targUnit[1],"PLUSH")[0]){
      targUnitGel = Math.floor(targUnitGel * 1.25);
    }

    let attUnitGel = attUnit[0] ? getCharHealth(client, "-", attUnit[1])[1] : client.underlings[client.charcall.charData(client,attUnit[1],"type")].vit;
    if(!attUnit[0] && client.traitcall.traitCheck(client,attUnit[1],"PLUSH")[0]){
      attUnitGel = Math.floor(attUnitGel * 1.25);
    }

    //check for each action tag that is NONCOMBATIVE
    //PRE-ROLL ACT
    let pre;
    for(pre=(aa.length - 1);pre>=0;pre--){
      switch(aa[pre]){
        case "FAV":
          fav++;
          break;
        case "UNFAV":
          fav--;
          break;

        case "CARRY":
        case "ALLBD":
        case "ALLFAV":
        case "ALLUNFAV":
        case "NEXTFAV":
        case "STAMFAV":
          attUnit[STATUS].push(aa[pre]);
          break;

        case "STAMADD":
          newStam = Math.ceil(Math.random() * 4);
          attUnit[STAMIN]+= newStam;
          let p;
          for(p=0;p<active.length;p++){
            if(list[active[p]][0]==true){
              alert+=`${attName} gains ${newStam} STAMINA, they now have ${attUnit[STAMIN]} STAMINA!\n`
            }
          }
          break;
          case "STAMADD+":
          newStam = Math.ceil(Math.random() * 8);
            attUnit[STAMIN]+= newStam;
            let j;
            for(j=0;j<active.length;j++){
              if(list[active[j]][0]==true){
                alert+=`${attName} gains ${newStam} STAMINA, they now have ${attUnit[STAMIN]} STAMINA!\n`
              }
            }
            break;
        case "PROTECT":
          targUnit[STATUS].push("PROTECT");
          break;
        case "DISCOUNT":
        case "STATUSIMMUNE":
        case "NEXTBD":
        case "AV":
        case "DEFLECT":
        case "DEFROST":
        case "BLOCK":
        case "GRISTINVERT":
        case "DEGRAP":
          attUnit[STATUS].push(aa[pre]);
          break;
        case "CLEARSTATUS":
          attUnit[STATUS]=[];
          break;
        case "STATUSDROP":

          removed = attUnit[STATUS].splice(Math.floor(Math.random()*attUnit[STATUS].length),1);
          alert+=`REMOVED THE ${removed} STATUS EFFECT\n`;

          break;

        // ABJURE
        case "SCALEDMG":
          if(attUnit[HEALTH]<Math.floor(attUnitGel/4)){
            dmgLvl=3;
          } else if(attUnit[HEALTH]<Math.floor(attUnitGel/2)) {
            dmgLvl=2;
          }
          break;
          case "ROLLOUT":
            if(attUnit[STATUS].includes("ROLLOUT1")){
              dmgLvl=2;
              removed = attUnit[STATUS].splice(attUnit[STATUS].indexOf("ROLLOUT1"),1);
              attUnit[STATUS].push("ROLLOUT2")
            }else if(attUnit[STATUS].includes("ROLLOUT2")){
              dmgLvl=3;
            }else{
              attUnit[STATUS].push("ROLLOUT1");
            }
            break;
      }
    }

    let costMsg = `${client.actionList[action].cst}`;

    if(attUnit[STATUS].includes("DISCOUNT")){
      if(client.actionList[action].cst>1){
      alert += `ACTIONS DISCOUNTED THIS TURN\n`;
      costMsg +=` - 1`;
       }
     }
   //closing here
    if(client.traitcall.traitCheck(client,attUnit[1],"MIND")[1]){
      if(client.actionList[action].cst > 1){
        alert += `**BUTTERFLY EFFECT** - ACTIONS DISCOUNTED\n`;
        costMsg += ` - 1`;
      }
    }


    //
    //if action deals damage or imposes effect (on the target)
  if(att == true) {
      let precon;
      for(precon=(attUnit[STATUS].length - 1);precon>=0;precon--){
        let removed;

        //check for COMBATATIVE tags
        switch(attUnit[STATUS][precon]){
          case "CORRUPT":
          case "GRAPPLE":
            case "HAUNT":
            case "HAUNT2":
            case "HAUNT3":
              fav--;
              break;

            case "NEXTFAV":
              removed = attUnit[STATUS].splice(precon,1);
            // fallthrough
            case "ALLFAV":
              fav++;
              break;

          case "NEXTBD":
            removed = attUnit[STATUS].splice(precon,1);
            // fallthrough
          case "ALLBD":
            bd++
            break;
          }
        }



      //check enemy tags
      let precont;
        for(precont=(targUnit[STATUS].length - 1);precont>=0;precont--){

          switch(targUnit[STATUS][precont]){
            case "CORRUPT":
            case "HAUNT":
            case "HAUNT2":
            case "HAUNT3":
            case "GRAPPLE":
            case "TARGFAV":
              fav++
            break;

            case "ALLUNFAV":
            case "PROTECT":
              fav--;
              break;

            case "AV":
              av++;
              break;
          }

}

if(client.traitcall.traitCheck(client,attUnit[1],"BROKEN")[0]){
  fav--;
}
if(client.traitcall.traitCheck(client,targUnit[1],"VOID")[1]){
  fav--;
}

    let strikeCheck;
    let strikemsg;

//roll to hit, similar to how stamina is handled
    let strikeRoll = [Math.floor((Math.random() * 20) + 1),Math.floor((Math.random() * 20) + 1)];

    if(client.traitcall.traitCheck(client,attUnit[1],"META")[0]){
      if(strikeRoll[0]==1||strikeRoll[0]==20||strikeRoll[1]==1||strikeRoll[1]==20){
        alert += `YOUR META GEAR AVOIDED A 1 (OR A 20...)\n`;
          strikeRoll = [Math.floor((Math.random() * 18) + 2),Math.floor((Math.random() * 18) + 2)];
      }
    }

    if(client.traitcall.traitCheck(client,attUnit[1],"WELSH")[1]||client.traitcall.traitCheck(client,attUnit[1],"LIGHT")[0]){
      if(strikeRoll[0]==1){
        alert+=`TURNED A 1 INTO A 20!\n`;
        strikeRoll[0]=20;
      }
      if(strikeRoll[1]==1){
        if(fav!=0){
          alert+=`TURNED A 1 INTO A 20!\n`;
          strikeRoll[1]=20;
        }

      }
    }
    if(client.traitcall.traitCheck(client,targUnit[1],"WELSH")[1]||client.traitcall.traitCheck(client,targUnit[1],"VOID")[0]){
      if(strikeRoll[0]==20){
        alert+=`TARGET TURNED A 20 INTO A 1!\n`;
        strikeRoll[0]=1;
      }
      if(strikeRoll[1]==20){
        if(fav!=0){
        alert+=`TARGET TURNED A 20 INTO A 1!\n`;
        strikeRoll[1]=1;
        }
      }
    }

    if(client.traitcall.traitCheck(client,attUnit[1],"LIGHT")[1]){
      for(let i=0; i<=1; i++)
      {
      if(strikeRoll[i]<6){
        alert+=`**BORN LUCKY** - Rerolled a roll less than 5\n`
          // Roll 1d16+5 instead of 1d20. In the event of a 21, set it to 20 and pretend it was a 1.
          // This way, no further re-rolls are actually required.
          strikeRoll[i] = Math.floor((Math.random() * 16) + 6);
          if(strikeRoll[i]==21){
            strikeRoll[i]=20;
            alert+=`TURNED A 1 INTO A 20!\n`
          }
      }
      }
    }

    if(fav == 0) {
      strikeCheck = strikeRoll[0];
      strikeMsg = `${strikeRoll[0]}`;
    }
      else
      {
        let lowRoll = Math.min(strikeRoll[0], strikeRoll[1]);
        let highRoll = Math.max(strikeRoll[0], strikeRoll[1]);

        strikeCheck = fav > 0 ? highRoll : lowRoll;
        let otherRoll = fav > 0 ? lowRoll : highRoll;

            strikeMsg = `~~${otherRoll}~~ ${strikeCheck}`;

      }

if(strikeBonus>0){
  strikeMsg += ` + ${strikeBonus} = ${strikeCheck+strikeBonus}`;
}
if(strikeBonus<0){
  strikeMsg += ` - ${strikeBonus * -1} = ${strikeCheck+strikeBonus}`;
}


  if(client.traitcall.traitCheck(client,targUnit[1],"FROG")[0]){
    av++;
  }
  if(client.traitcall.traitCheck(client,targUnit[1],"EXQUISITE")[1]){
    av = av+2;
  }
  if(client.traitcall.traitCheck(client,targUnit[1],"BREATH")[0]){
    av = av+2;
  }

  if((strikeCheck+strikeBonus)>av && (client.traitcall.traitCheck(client,targUnit[1],"FROG")[1] && !(Math.floor((Math.random() * 12))))){
    strikeCheck=0;
    alert+=`TARGET JUMPED OUT OF THE WAY! FROGGERS!!!\n`;
  }


  if((strikeCheck+strikeBonus)>av){

    if(aa.includes("AUTOCRIT")){
      strikeCheck=20;
    }

    //check traits that inflict status effects on hit

    //if(client.traitcall.traitCheck(client,attUnit[1],"CANDY")[1]==true){

    // Burn
    if(client.traitcall.traitCheck(client,attUnit[1],"HOT")[0]){
    alert+=inflict(client, message, local, list, target, 12, "BURN", init[turn][0]);
    }
    if(client.traitcall.traitCheck(client,attUnit[1],"IRRADIATED")[0]){
    alert+=inflict(client, message, local, list, target, 12, "BURN", init[turn][0]);
    }

    // Bleed
    if(aa.includes("BLEED4")){
    alert+=inflict(client, message, local, list, target, 4, "BLEED", init[turn][0]);
    }
    if(aa.includes("BLEED8")){
    alert+=inflict(client, message, local, list, target, 8, "BLEED", init[turn][0]);
    }
    if(client.traitcall.traitCheck(client,attUnit[1],"SHARP")[0]){
    alert+=inflict(client, message, local, list, target, 12, "BLEED", init[turn][0]);
    }
    if(client.traitcall.traitCheck(client,attUnit[1],"VAMPIRIC")[0]){
    alert+=inflict(client, message, local, list, target, 12, "BLEED", init[turn][0]);
    }
    if(client.traitcall.traitCheck(client,targUnit[1],"THORNS")[0]){
    alert+=inflict(client, message, local, list, init[turn][0], 12, "BLEED", target);
    }

    // Stun
    if(aa.includes("STUN4")){
    alert+=inflict(client, message, local, list, target, 4, "STUN", init[turn][0]);
    }
if(client.traitcall.traitCheck(client,attUnit[1],"RAGE")[0]){
   alert+=inflict(client, message, local, list, target, 6, "STUN", init[turn][0]);
}
if(client.traitcall.traitCheck(client,attUnit[1],"ELECTRIC")[0]){
   alert+=inflict(client, message, local, list, target, 12, "STUN", init[turn][0]);
}


if(client.traitcall.traitCheck(client,attUnit[1],"COLD", init[turn][0])[0]){
  alert+=inflict(client, message, local, list, target, 12, "FROSTBITE", init[turn][0]);
}

let bluntness = client.traitcall.traitCheck(client,attUnit[1],"BLUNT");
  if(bluntness[0] && !targUnit[STATUS].includes("DAZED")){
    let dchance=12;
    if(bluntness[1]){
      dchance = 6;
    }
    alert+=inflict(client, message, local, list, target, dchance, "DAZED", init[turn][0]);
  }

  if(client.traitcall.traitCheck(client,attUnit[1],"SHITTY")[1]){
  alert+=inflict(client, message, local, list, target, 12, "CORRUPT", init[turn][0]);
  }

  // Haunt
  if(client.traitcall.traitCheck(client,attUnit[1],"SPOOKY")[0]){
  if(!targUnit[STATUS].includes("HAUNT")&&!targUnit[STATUS].includes("HAUNT2")&&!targUnit[STATUS].includes("HAUNT3")){
    alert+=inflict(client, message, local, list, target, 12, "HAUNT", init[turn][0]);
  }
  }
  if(client.traitcall.traitCheck(client,attUnit[1],"GRIMDARK")[0]){
  if(!targUnit[STATUS].includes("HAUNT")&&!targUnit[STATUS].includes("HAUNT2")&&!targUnit[STATUS].includes("HAUNT3")){
    alert+=inflict(client, message, local, list, target, 12, "HAUNT", init[turn][0]);
  }
  }

if(client.traitcall.traitCheck(client,targUnit[1],"CAT")[0]){
  br++;
}
if(client.traitcall.traitCheck(client,attUnit[1],"BROKEN")[1]){
  if(!Math.floor((Math.random() * 12))){
    bdmax = true;
  }
}

  if(client.traitcall.traitCheck(client,attUnit[1],"STICKY")[0]){
  alert+=inflict(client, message, local, list, target, 12, "GRAPPLE", init[turn][0]);
  }
  if(client.traitcall.traitCheck(client,attUnit[1],"STICKY")[1] && targUnit[STATUS].includes("GRAPPLE")){
  bd++;
  }

          if(targUnit[STATUS].includes("DEFROST")){
            removed = targUnit[STATUS].splice(targUnit[STATUS].indexOf("DEFROST"),1);
            alert+=`TARGET INFLICTS FROSTBITE ON ATTACKER!\n`
            alert+=inflict(client, message, local, list, init[turn][0], 1, "FROSTBITE", target);
          }
          if(targUnit[STATUS].includes("DEGRAP")){
            removed = targUnit[STATUS].splice(targUnit[STATUS].indexOf("DEGRAP"),1);
            alert+=`TARGET GRAPPLES ATTACKER!\n`
            alert+=inflict(client, message, local, list, init[turn][0], 1, "GRAPPLE", target);
          }


        if(client.traitcall.traitCheck(client,attUnit[1],"IRRADIATED")[1]&&strikeCheck==20){

          let radioburn=false;
          for(let ir=0;ir<list.length;ir++){
            if((init[turn][0]!=ir)&&(!list[ir][STATUS].includes("BURN"))){
              if(client.traitcall.traitCheck(client,list[ir][1],"BREATH")[1]){
                alert+= `**UNRESTRAINED** - TARGET IS IMMUNE TO ALL STATUS EFFECTS!\n`;
              } else {
              list[ir][STATUS].push("BURN");
              radioburn = true;
              if(client.traitcall.traitCheck(client,list[ir][1],"BLOOD")[1]){
                if(!attUnit[STATUS].includes("BURN")){
                  attUnit[STATUS].push("BURN");
                  alert+=`**THICKER THAN WATER** - Target shared status effect with everyone!\n`;
                }
              }
            }
            }
          }
          if(radioburn){
            alert+=`RADIOACTIVE!!! BURNED ALL OPPONENTS!\n`;
          }
        }

if(client.traitcall.traitCheck(client,list[init[turn][0]][1],"CHARLATAN")[1]){
  let rageList = ["BURN","GRAPPLE","BLEED","FROSTBITE","DAZED","STUN","CORRUPT","HAUNT"];
  if(list[target][7].includes("HAUNT")||list[target][7].includes("HAUNT2")||list[target][7].includes("HAUNT3")){
    removed = rageList.splice(rageList.indexOf("HAUNT"),1);
  }
alert+=inflict(client, message, local, list, target, 6, rageList[Math.floor((Math.random() * rageList.length))], init[turn][0]);
};

if(aa.includes("RANDSTATUS")){

  let statusList = ["BURN","GRAPPLE","BLEED","FROSTBITE","DAZED","STUN","CORRUPT","HAUNT"];

  let rs;

  if(targUnit[STATUS].includes("HAUNT")||targUnit[STATUS].includes("HAUNT2")||targUnit[STATUS].includes("HAUNT3")){
    removed = statusList.splice(statusList.indexOf("HAUNT"),1);
  }
  for(rs=0;rs<targUnit[STATUS].length;rs++){
    if(statusList.includes(targUnit[STATUS][rs])){
      removed = statusList.splice(statusList.indexOf(targUnit[STATUS][rs]),1);
    }
  }

  if(statusList.length==0){
    alert+=`TARGET ALREADY HAS ALL INFLICTABLE STATUS EFFECTS!\n`;
  } else {
    alert+=inflict(client, message, local, list, target, 1, statusList[Math.floor((Math.random() * statusList.length))], init[turn][0]);
  }

}

        //check for all COMBATATIVE COMBAT TAGS
        //check target status effects

        let postcon;
        for(postcon=(targUnit[STATUS].length-1);postcon>=0;postcon--){

          switch(targUnit[STATUS][postcon]){
            case "BURN":
              bd++;
              if(client.traitcall.traitCheck(client,attUnit[1],"HOT")[1]){
                bd++;
              }
              break;
            case "BLEED":
              bd++;
          }

        }

        let post;
        for(post=0;post<aa.length;post++){
          switch(aa[post]){
            case "BD":
              bd++;
              break;
            case "TARGFAV":
            case "GRAPPLE":
            case "BURN":
            case "FROSTBITE":
            case "STUN":
            alert+=inflict(client, message, local, list, target, 1, aa[post], init[turn][0]);
              break;
            case "STUNCHANCE":
            alert+=inflict(client, message, local, list, target, 4, "STUN", init[turn][0]);
              break;
            case "BDSELFSTATUS":
              bd+=attUnit[STATUS].length;
              break;
            case "BDTARGSTATUS":
              bd+=targUnit[STATUS].length;
              break;
            case "DAZED":
            alert+=inflict(client, message, local, list, target, 1, "DAZED", init[turn][0]);
              break;
            case "ABSORB":
              absorb = true;
              break;
            case "DOUBLEGRIST":
              targUnit[STATUS].push("DOUBLEGRIST");
              break;

            case "CORRUPTING":
              targUnit[STATUS].push("CORRUPT");
              break;



          }
        }

        //if check passed, calculate all bonus damage

    let k;
    for(k=0;k<attUnit[STATUS].length;k++){
    try{
      if(`${attUnit[STATUS][k].substring(0,4)}`==`MEAT`){
        let meat = attUnit[STATUS].splice(k,1);
        meat = meat[0].substring(4);

        meatVal = parseInt(meat, 10);
        if(isNaN(meatVal)){
          console.log(`${meat} looked like a meat status, but it wasn't. Putting it back....`);
          attUnit[STATUS].splice(k, 0, meat);
          continue;
        }
        else{
          bd+=meatVal;
        }
      }

    } catch(err) {
      console.log(err);
    }
  }

        let bonusDmg = 0;
        let bonusRes = 0;

  let damagemsg = `${dmg * dmgLvl}`;
  let equals = false;
  let paren = false;
    if(bd>0){
      equals=true;
      if(client.traitcall.traitCheck(client,attUnit[1],"MEAT")[1]){
        bd++;
      }
      let i;
      for(i=0;i<bd;i++){
        let bddice =[Math.floor((Math.random() * (bdroll[1] - bdroll[0])) + bdroll[0]),Math.floor((Math.random() * (bdroll[1] - bdroll[0])) + bdroll[0])];
        if (bdmax){
          bddice = [bdroll[1],bdroll[1]];
        }
        if(client.traitcall.traitCheck(client,targUnit[1],"CUTE")[1]||client.traitcall.traitCheck(client,targUnit[1],"REFINED")[1]){
          bddice[0]= Math.floor(bddice[0]/2);
          bddice[1]= Math.floor(bddice[1]/2);
        }

          }
            let bdadd;
            if(!client.traitcall.traitCheck(client,attUnit[1],"SHARP")[1]){
              bdadd = bddice[0];
              damagemsg+= ` + ${bdadd}`;
            } else {
              if (bddice[0]>bddice[1]){
                damagemsg += ` + (~~${bddice[1]}~~ ${bddice[0]})`
                bdadd = bddice[0];
              } else{
                damagemsg += ` + (~~${bddice[0]}~~ ${bddice[1]})`
                bdadd = bddice[1];
              }
            }
            bonusDmg += bdadd;

          }
          if(client.traitcall.traitCheck(client,targUnit[1],"CUTE")[1]){
            alert += `TARGET IS TOO CUTE, THEY TOOK REDUCED BD!\n`
          }
          if(client.traitcall.traitCheck(client,targUnit[1],"REFINED")[1]){
            alert += `TARGET IS REFINED, THEY TOOK REDUCED BD!\n`
          }
        }

    if(br>0){
      equals=true;
      if(client.traitcall.traitCheck(client,targUnit[1],"CUTE")[0]){
        br++;
      }
      if(client.traitcall.traitCheck(client,targUnit[1],"PLUSH")[1]){
        br+=2;
      }
      let i;
      for(i=0;i<br;i++){
        let bradd = Math.floor((Math.random() * (brroll[1] - 1)) + brroll[0]);
        bonusRes += bradd;
        damagemsg+= ` - ${bradd}`;
      }
    }

        let damage = ((dmg * dmgLvl) + bonusDmg) - bonusRes;

        if(client.traitcall.traitCheck(client,targUnit[1],"SPOOKY")[1]&&(attUnit[STATUS].includes("HAUNT2")||attUnit[STATUS].includes("HAUNT")||attUnit[STATUS].includes("HAUNT3"))){
          equals=true;
          damage=Math.floor(damage/2);
          damagemsg = `(`+damagemsg+`)`;
          paren = true;
          damagemsg +=` / 2`;
        }

    if(strikeCheck == 20){
      if(effective=="HIT!"){
        effective="CRITICAL HIT!"
      } else {
        effective=effective.slice(0, -1) + " CRITICAL!"
      }

      if(client.traitcall.traitCheck(client,list[init[turn][0]][1],"HOPE")[0]){

        let hopeStam = client.actionList[action].cst;
        alert+=`ACTION IS FREE!\n`;

        if(list[init[turn][0]][7].includes("DISCOUNT")){
          if(client.actionList[action].cst>1){
          hopeStam--;
           }
         }
           //closing here
            if(client.traitcall.traitCheck(client,attUnit[1],"MIND")[1]){
              if(client.actionList[action].cst > 1){
                hopeStam--;
              }
            }

            if(client.traitcall.traitCheck(client,attUnit[1],"HOPE")[1]){
              alert+=`**BURNING SPIRIT** - GOT ${hopeStam} STAMINA!\n`
              hopeStam*=2;
            }

            attUnit[STAMIN]+=hopeStam;

          }

          equals=true;

      // Noir crit
      if(client.traitcall.traitCheck(client,attUnit[1],"NOIR")[1]){
        damage *= 3;
        if(!paren){
          damagemsg = `(`+damagemsg+`)`;
          paren = true;
        }
        damagemsg += ` * 3`;
        alert +=`1000/1000 CLOCKS DESTROYED! TRIPLE DAMAGE!\n`;
      }
      // Normal crit
      else{
        damage *= 2;
        if(!paren){
          damagemsg = `(`+damagemsg+`)`;
          paren = true;
        }
        damagemsg += ` * 2`
      }

      // Rage
      if(client.traitcall.traitCheck(client,attUnit[1],"RAGE")[1]){
      damage *= 2;
      damagemsg += ` * 2`;
      alert +=`**BLASPHEMOUS WORD** - CRIT DOUBLED!\n`;
    }
    };

    if(damage < 0 || att == false) {
      damage = 0;
    };


    if(equals){
      damagemsg+= ` = **${damage}**`;
    }


    if(client.traitcall.traitCheck(client,targUnit[1],"HEART")[0]){
      if(!Math.floor(Math.random()*20)){
        targUnit[HEALTH]+= damage;
        alert+=`The pain fuels their soul, damage converted to ${damage} points of healing!\n`;
        damage=0;
        if(targUnitGel<targUnit[HEALTH]){
          targUnit[HEALTH]=targUnitGel;
        }
      }
    }

    if(aa.includes("HEAL")){
      targUnit[HEALTH]+= damage;
      alert+=`HEALED TARGET BY ${damage} POINTS OF HEALING!\n`;
      damage=0;
    }

    let last = [attUnit[1],targUnit[1],damage];

    if(client.traitcall.traitCheck(client,attUnit[1],"VAMPIRIC")[1]&&targUnit[STATUS].includes("BLEED") ){
      attUnit[HEALTH]+= bonusDmg;
      alert+= `VAMPIRICALLY SIPHONED ${bonusDmg} VITALITY!\n`

      if(attUnitGel<attUnit[HEALTH]){
        attUnit[HEALTH]=attUnitGel;
      }

    }

       if(client.traitcall.traitCheck(client,attUnit[1],"DOOM")[1]&&strikeCheck==20){


          alert+= `**MORTAL DECAY** YOUR DAMAGE SPREADS TO ALL FOES.\n`;
          for(let id=0;id<active.length;id++){
            if(active[id]!=init[turn][0]&&active[id]!=target){
              list[id][HEALTH]-= damage;
              if(list[id][HEALTH] < 1 && client.traitcall.traitCheck(client,list[id][1],"CAT")[1] && !list[id][STATUS].includes("NINELIVES")) {
                list[id][HEALTH] = 1;
                alert += `ONE TARGET USED ITS LAST OF 9 LIVES, SURVIVED AT 1 HP!\n`;
                list[id][STATUS].push("NINELIVES");
              }
            }
          }
        }


        if(aa.includes("SPLASHBD")){
          if(active.length>2){
            let id;
            let splashbd= Math.floor((Math.random() * (bdroll[1] - bdroll[0])) + bdroll[0]);
            alert+=`DEALT ${splashbd} DAMAGE TO ALL FOES.\n`
            for(id=0;id<active.length;id++){
              if(active[id]!=init[turn][0]&&active[id]!=target){
                list[id][HEALTH]-= splashbd;
                if(list[id][HEALTH] < 1 && client.traitcall.traitCheck(client,list[id][1],"CAT")[1] && !list[id][STATUS].includes("NINELIVES")) {
                  list[id][HEALTH] = 1;
                  alert += `ONE TARGET USED ITS LAST OF 9 LIVES, SURVIVED AT 1 HP!\n`;
                  list[id][STATUS].push("NINELIVES");
                }
              }
            }
          }
        }

        if(targUnit[STATUS].includes("BLOCK")){
          alert+= `TARGET BLOCKED ALL DAMAGE!\n`;
          damage=0;
          let dc;
          for(dc=(targUnit[STATUS].length - 1);dc>=0;dc--){
            if(targUnit[STATUS][dc]=="BLOCK"){
              removed = targUnit[STATUS].splice(dc,1);
              }
          }
        }

    if(targUnit[STATUS].includes("DEFLECT")){

      alert+= `TARGET REFLECTED ${damage} DAMAGE TO ATTACKER!\n`;

      attUnit[HEALTH]-=damage;
      damage=0;
      let dc;
      for(dc=(targUnit[STATUS].length - 1);dc>=0;dc--){
        if(targUnit[STATUS][dc]=="DEFLECT"){
          removed = targUnit[STATUS].splice(dc,1);
          }
      }

    }

    targUnit[HEALTH] -= damage;
    if(absorb==true){
      let healdif = damage;
      if(attUnitGel<attUnit[HEALTH]+damage){
        healdif = attUnitGel-attUnit[HEALTH];
        attUnit[HEALTH] = attUnitGel;
      } else {
        attUnit[HEALTH]+= damage;
      }
      alert +=`ATTACKER HEALS FOR ${healdif} VITALITY!\n`
    }

    if(client.traitcall.traitCheck(client,targUnit[1],"THORNS")[1]){
      let thornDmg = Math.floor((Math.random() * (brroll[1] - 1)) + brroll[0]);
      attUnit[HEALTH]-= thornDmg;
      alert += `TOOK ${thornDmg} DAMAGE FROM TARGET THORNS!\n`;
    }

        if(targUnit[HEALTH] < 1 && client.traitcall.traitCheck(client,targUnit[1],"CAT")[1] && !targUnit[STATUS].includes("NINELIVES")) {
          targUnit[HEALTH] = 1;
          alert += `THE TARGET USED ITS LAST OF 9 LIVES, SURVIVED AT 1 HP!\n`;
          targUnit[STATUS].push("NINELIVES")
        }

        let bounceChance=12;
        if(client.traitcall.traitCheck(client,attUnit[1],"BOUNCY")[1]){
          bounceChance=6;
        }

        if(client.traitcall.traitCheck(client,attUnit[1],"BOUNCY")[0]&&!Math.floor((Math.random() * bounceChance))){
          bounceCheck=true;
          alert+=`BOUNCY!!! IF TARGET IS STILL ALIVE, ATTACKING AGAIN!\n`;
        }

        client.strifeMap.set(strifeLocal,last,"last");

        if(alert.length==0){
          alert=`NONE`;
        }
        let embed = new client.MessageEmbed()
        .setTitle(`${attName.toUpperCase()} ${client.actionList[action].name}S ${targName.toUpperCase()}!`)
    .addFields(
      {name:'CST',value:costMsg,inline:true},
      {name:'DMG',value:`${(dmg * dmgLvl)}`,inline:true},
      {name:"ADDITIONAL ACTION",value:client.actionList[action].aa},
      {name:"STRIKE",value:strikeMsg,inline:true},
      {name:"TARGET AV",value:av.toString(),inline:true},
      {name:"HIT",value:`${effective}`},
      {name:"DAMAGE",value:damagemsg,inline:true},
      {name:"ADDITIONAL ALERTS",value:alert}
    )
        .setColor(client.actionList[action].col)
        .setImage(client.actionList[action].img);

        for(i=0;i<active.length;i++){
          if(client.charcall.controlCheck(client,list[active[i]][0])){
            client.funcall.chanMsg(client,list[active[i]][1],"NONE",embed);
          }
        }

    }
    else
    {
        //if attack misses

        if(aa.includes("REFUND")){

          let hopeStam = client.actionList[action].cst;
          alert+=`ACTION IS FREE!\n`;

          if(attUnit[STATUS].includes("DISCOUNT")){
            if(client.actionList[action].cst>1){
              hopeStam--;
            }
          }
          //closing here
          if(client.traitcall.traitCheck(client,attUnit[1],"MIND")[1]){
            if(client.actionList[action].cst > 1){
              hopeStam--;
            }
          }

          attUnit[STAMIN]+=hopeStam;
        }

        if(alert.length==0){
          alert=`NONE`;
        }

        let embed = new client.MessageEmbed()
        .setTitle(`${attName.toUpperCase()} ${client.actionList[action].name}S ${targName.toUpperCase()}!`)
    .addFields(
      {name:'CST',value:costMsg,inline:true},
      {name:'DMG',value:`${(dmg * dmgLvl)}`,inline:true},
      {name:"ADDITIONAL ACTION",value:client.actionList[action].aa},
      {name:"STRIKE",value:strikeMsg,inline:true},
      {name:"TARGET AV",value:av.toString(),inline:true},
      {name:"HIT",value:`MISS!`},
      {name:"ADDITIONAL ALERTS",value:alert}
    )
    .setColor(client.actionList[action].col)
    .setImage(client.actionList[action].img);

    for(i=0;i<active.length;i++){
        client.funcall.chanMsg(client,list[active[i]][1],"NONE",embed);
    }
  }

}
else {
    //if att is false

    if(alert.length==0){
      alert=`NONE`;
    }

    let embed = new client.MessageEmbed()
    .setTitle(`${attName.toUpperCase()} ${client.actionList[action].name}S ${targName.toUpperCase()}!`)
    .addFields(
      {name:'CST',value:costMsg,inline:true},
      {name:'DMG',value:`${(dmg * dmgLvl)}`,inline:true},
      {name:"ADDITIONAL ACTION",value:client.actionList[action].aa},
      {name:"ADDITIONAL ALERTS",value:alert}
    )
    //.setColor(client.actionList[action].col)
    .setImage(client.actionList[action].img);
    for(i=0;i<active.length;i++){
      if(client.charcall.controlCheck(client,list[active[i]][0])){
        client.funcall.chanMsg(client,list[active[i]][1],"NONE",embed);
      }
    }

  }

  client.strifeMap.set(strifeLocal,list,"list");

  if(targUnit[STATUS].includes("DOUBLEGRIST")&&targUnit[HEALTH]>0){
    removed = targUnit[STATUS].splice(targUnit[STATUS].indexOf("DOUBLEGRIST"));
  }

try{
for(let ik=0;ik<active.length;ik++){
if(list[active[ik]][3] < 1){
  setTimeout(kill,1000,client,message,local,active[ik],init[turn][0]);
}else{
  if(bounceCheck && active[ik]==target){
    act(client,charid,message,local,"aggrieve",active[ik]);
    }
  }
}
}catch(err){
  console.log("Tried to kill someone in a database that did not exist");
  console.log(err);
}
  }

  exports.act = function(client,charid,message,local,action,target){
    act(client,charid,message,local,action,target);
  }


exports.spawn = function(client,message,underling,pregrist = false){
  let charid = client.userMap.get(message.guild.id.concat(message.author.id),"possess");
  let local = client.charcall.charData(client,charid,"local");
  let sec = client.landMap.get(local[4],local[0]);
  let npcCount = client.landMap.get(message.guild.id+"medium","npcCount");
  sec[local[1]][local[2]][2][local[3]][4].push(underSpawn(client,local,underling,message.guild.id,npcCount,pregrist));
  client.landMap.set(message.guild.id+"medium",npcCount+1,"npcCount");
  client.landMap.set(local[4],sec,local[0]);
  return client.charcall.charData(client,sec[local[1]][local[2]][2][local[3]][4][sec[local[1]][local[2]][2][local[3]][4].length-1][1],"name");
}

  function underSpawn(client,local,underling,sessionID,npcCount,pregrist=false){

    let landGrist;

    try{
      landGrist = client.landMap.get(local[4],"grist");
    }catch(err){
      landGrist = ["uranium","amethyst","garnet","iron","marble","chalk","shale","cobalt","ruby","caulk","tar","amber"];
    }
    let grist;
    if(pregrist){
      grist = pregrist;
    } else {
      grist = landGrist[Math.floor((Math.random() * landGrist.length))];
    }
    let sessionProto = client.landMap.get(sessionID+"medium",`prototype`);
    let protoCheck = [];

    for(let i=0; i<sessionProto.length; i++){
      protoCheck.push(i);
    }

    let undername = ``;
    let prototype = [];
    let protoCount = Math.floor(Math.random()*4);
    if(sessionProto.length<protoCount){
      prototype = sessionProto;
    } else {
      for(i=0;i<protoCount;i++){
        prototype.push(sessionProto[protoCheck.splice(Math.floor(Math.random()*protoCheck.length),1)]);
      }
    }
    for(i=0;i<prototype.length;i++){
      undername += prototype[i][0]+` `;
    }
    let npcSet = {
      name: `${grist.toUpperCase()} ${undername}${underling.toUpperCase()}`,
      control:[],
      type: underling,
      faction: "underling",
      vit:client.underlings[underling].vit,
      gel:client.underlings[underling].vit,
      gristtype: grist,
      strife:false,
      pos:0,
      alive:true,
      local:local,
      sdex:[],
      equip:0,
      trinket:[],
      armor:[],
      spec:[],
      equip:0,
      scards:1,
      kinds:[],
      port:1,
      modus:"STACK",
      cards:4,
      prototype:prototype,
      prospitRep:0,
      derseRep:0,
      underlingRep:100,
      playerRep:-1,
      consortRep:-1,
      prefTarg:[],
      xp:0,
      rung:0,
      b:0,
      bio:`A ${grist} ${underling}`,
      img:client.underlings[underling].img,
      questData:[]
    }
    //rep [prospit,derse,underling,player]

    npcID = `n${sessionID}/${npcCount}`;

    client.npcMap.set(npcID,npcSet);

    let occset = [false,npcID];

    //sec[local[1]][local[2]][2][local[3]][4].push(occset);

    //client.landMap.set(local[4],sec,local[0]);

    return(occset);
  }

  exports.dungeonSpawn = function(client, section, coords, underling, message){
    let sessionid = message.guild.id;
    let charid = client.userMap.get(message.guild.id.concat(message.author.id),"possess");
    let sburbid = client.charcall.charData(client,charid,"owner");
    let npcCount = client.landMap.get(sessionid+"medium","npcCount");
    let local = ["s" + section + "d", coords[0], coords[1], 0, sburbid];

    npcCount++;
    let underlingSpawn = underSpawn(client, local, underling, sessionid, npcCount);

    client.landMap.set(sessionid+"medium",npcCount,"npcCount");
    return(underlingSpawn);
  }


exports.npcTurn = function(client, message, charid, local) {
  npcTurn(client,message,charid,local);
}
function npcTurn(client, message, charid, local){

  let strifeLocal = `${local[0]}/${local[1]}/${local[2]}/${local[3]}/${local[4]}`;

 if(!client.strifeMap.has(strifeLocal))return;
  let active = client.strifeMap.get(strifeLocal,"active")
  let list = client.strifeMap.get(strifeLocal,"list")
  let turn = client.strifeMap.get(strifeLocal,"turn")
  let init = client.strifeMap.get(strifeLocal,"init")

  if(!list[init[turn][0]][0]&&list[init[turn][0]][3]>0){

  let faction = client.charcall.charData(client,list[init[turn][0]][1],"faction");
  let spec = client.charcall.charData(client,list[init[turn][0]][1],"spec");
  let equip = client.charcall.charData(client,list[init[turn][0]][1],"equip");
  let type = client.charcall.charData(client,list[init[turn][0]][1],"type");
  let prototype = client.charcall.charData(client,list[init[turn][0]][1],"prototype");
  let prefTarg = client.charcall.charData(client,list[init[turn][0]][1],"prefTarg");

  let prefMove = client.underlings[type].prefMove;

  let targetList = [];

  //create a list of targets based on faction reputation.

  if(prefTarg.length>0&&active.includes(prefTarg[0])){
    targetList=prefTarg;
  }else{

  for(let i=0;i<active.length;i++){
    if(client.charcall.allData(client,"-",list[active[i]][1],`${faction}Rep`)<0){
      targetList.push(active[i]);
    }
  }
}
//randomly decide target from list
  let target = targetList[Math.floor((Math.random() * targetList.length))];

  let actionSet = [];
  let tempAct;
  if(spec.length!=0){
    for(let i=0;i<4;i++){
      tempAct = client.action[client.codeCypher[i+4][client.captchaCode.indexOf(spec[equip][1].charAt(i+4))]];
      if(client.actionList[tempAct].cst<=list[init[turn][0]][5]&&(!list[init[turn][0]][6].includes(tempAct)||(client.actionList[tempAct].aa.includes("REUSE")))&&tempAct!="no action"&&tempAct!="abscond"){
        actionSet.push(tempAct);
      }

    }
  }
  for(let j =0;j<prototype.length;j++){
    for(let i=0;i<4;i++){
      tempAct = client.action[client.codeCypher[i+4][client.captchaCode.indexOf(prototype[j][1].charAt(i+4))]];
      if(client.actionList[tempAct].cst<=list[init[turn][0]][5]&&(!list[init[turn][0]][6].includes(tempAct)||(client.actionList[tempAct].aa.includes("REUSE")))&&tempAct!="no action"&&tempAct!="abscond"){
        actionSet.push(tempAct);
      }
    }
  }

    tempAct=client.underlings[type].act;
    for(let i=0;i<tempAct.length;i++){
      if(client.actionList[tempAct[i]].cst<=list[init[turn][0]][5]&&(!list[init[turn][0]][6].includes(tempAct[i])||(client.actionList[tempAct[i]].aa.includes("REUSE")))&&tempAct[i]!="no action"&&tempAct[i]!="abscond"){
        actionSet.push(tempAct[i]);
      }
    }
    if(actionSet.length>0&&targetList.length>0){


      let action = actionSet[Math.floor((Math.random() * actionSet.length))];
      if(actionSet.includes(prefMove)){
        action=prefMove;
      }

      if(actionSet.includes("arrive")){
        if(list[init[turn][0]][6].length==0){
          action = "arrive";
        } else {
          while(action=="arrive"){
            action = actionSet[Math.floor((Math.random() * actionSet.length))];
          }
        }
      }
      list[init[turn][0]][5]-=client.actionList[action].cst;
      list[init[turn][0]][6].push(action);
      client.strifeMap.set(strifeLocal,list,"list");

      if(action=="arf"){
        targetList=[];
        for(let i=0;i<active.length;i++){
          if(client.charcall.allData(client,"-",list[active[i]][1],`${faction}Rep`)>=0){
            targetList.push(active[i]);
          }

        }
        if(targetList.length<1){
          targetList.push(init[turn][0]);
        }
        target = targetList[Math.floor((Math.random() * targetList.length))];

      }
      setTimeout(act,1000,client,charid,message,local,action,target)
        setTimeout(npcTurn,2000,client,message,charid,local);


    }else{
      setTimeout(passTurn,1000,client,charid,message,local);
    }
}else{
  console.log("A dead NPC tried to take a turn, or an unpossessed player had their turn passed!");
    setTimeout(passTurn,1500,client,charid,message,local);
}

}

function strifeList(client,local,active,list,turn,init,charid,page,title){
  let msg = ``;
  let i;
  let pageMax = Math.ceil(active.length/10);

  if(page > pageMax-1 || page < 0) {
    page=0;
    return;
  }

  for(i=0+(page*10);i<((page+1)*10)&&i<active.length;i++){
    if(active[i]==init[turn][0]){
      msg += `**[${i+1}]** **${client.charcall.charData(client,list[active[i]][1],"name").toUpperCase()}** [VIT - ${list[active[i]][3]}] [**TURN**]\n\n`
    } else {
      msg += `**[${i+1}]** **${client.charcall.charData(client,list[active[i]][1],"name").toUpperCase()}** [VIT - ${list[active[i]][3]}]\n\n`
    }
  }

  let embed = new client.MessageEmbed()
  .setTitle(`**${title}**`)
  .addFields(
    {name:`PAGE`,value:`${page+1}/${pageMax}`},
    {name:`**CHARACTERS IN STRIFE**`,value:msg}
  )
  .setColor("#00e371")

  //try{message.channel.send(embed);}catch(err){message.channel.send(msg)};
  return embed
}
exports.strifeList = function(client,local,active,list,turn,init,charid,page,title){

let embed =strifeList(client,local,active,list,turn,init,charid,page,title);
client.funcall.chanMsg(client,charid,"NONE",embed);

}

function getCharHealth(client, userid, charid){
    let vit = client.charcall.allData(client,userid,charid,"vit");
    let gel = client.charcall.allData(client,userid,charid,"gel");

    let gelDiff = 0;

    if(gel == "NONE"){
		//try{
			gel = client.underlings[client.charcall.charData(client,charid,"type")].vit;
		//}
		//catch (e){

		//}
	}

    if(gel != undefined){
        let plushness = client.traitcall.traitCheck(client,charid,"PLUSH");
        if(plushness[0] == true){
            let rung = client.charcall.allData(client,userid,charid,"rung");
            if(rung != "NONE"){
                gelDiff = rungGel[rung+5] - rungGel[rung];
                vit += gelDiff;
                gel += gelDiff;
            }
			else{
				gelDiff = Math.floor(gel / 4);
                vit += gelDiff;
                gel += gelDiff;
			}
        }
    }

    return [vit, gel, gelDiff];
}

exports.getCharHealth = function(client, userid, charid){
    return getCharHealth(client, userid, charid);
}
