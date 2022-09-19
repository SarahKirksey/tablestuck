const funcall = require("../modules/funcall.js");
//simple ping command to check if the bot is online.
const strifecall = require("../modules/strifecall.js");
exports.type = "sburb";
exports.desc = "Build your client's house up";
exports.use = `">build" tells you how much grist has been expended on your client's house, and how much it takes to reach the next gate.
">build [number]" expends the given number of build grist from the client to build up their house.`;

//define variables to determine required grist to reach each gate
const gateReq = [100,200,400,800,1600,3200,6400,12800];
const MAX_HEIGHT_INDEX = 7;

const ROOM_NAMES = ["FINAL ROOFTOP"];
const ROOMS_BEFORE = 7;
const GATES_PER_ROOM = 8;

exports.run = (client, message, args) => {



  //retrieve player location

  var userid = message.guild.id.concat(message.author.id);
  var charid = client.userMap.get(userid,"possess");
  var local = client.charcall.charData(client,charid,"local");
  var room = client.landMap.get(local[4],local[0])[local[1]][local[2]][2][local[3]];

  //check for computer with sburb installed in room or inventory

  let compCheck = client.traitcall.compTest(client,message,charid,room);

  if(compCheck[0]==false){
    message.channel.send("To use SBURB commands, you must have an item with the COMPUTER trait either in your Inventory or in the room you are in.");
    return;
  }
  if(compCheck[1]==false){
    message.channel.send("It seems that you have a computer, but you don't have SBURB installed on it!");
    return;
  }

  //if no client player is connected, cancel

  if(client.charcall.allData(client,userid,charid,"client") == "NA"||client.charcall.allData(client,userid,charid,"client") == "NONE") {
    message.channel.send("You aren't connected to a client!");
    return;
  }

  //retrieve clients charid
  let targsburb = client.charcall.allData(client,userid,charid,"client");
  //checks if amount spent is greater than amount of grist player has
  let buildSpent = client.landMap.get(targsburb,"spent");
  let grist = client.sburbMap.get(targsburb,"grist");
  let gate = 0;
  let curGate = client.landMap.get(targsburb,"gate");
  //convert grist amount to number
  if(!args[0]){
    let messText = `Your client ${(curGate>0?`has access to gate number ${curGate}`:`hasn't reached a gate yet.`)}.`;
    let messText2 = `\nYou have expended ${buildSpent} grist on the house`;
    if(curGate >= MAX_HEIGHT_INDEX + 1)
    {
      messText = `Your client has reached the build limit!`;
      messText2 += "."
    }
    else
    {
      messText2 += ` so far, and need to expend ${gateReq[curGate]-buildSpent} more to reach the ${(curGate < MAX_HEIGHT_INDEX) ? `next gate` : `build limit!`}!`;
    }

    if(curGate >= GATES_PER_ROOM){
      addRoomsToHouse(client, message, targsburb, curGate, client.landMap.get(targsburb,"h"));
    }

    messText += messText2;
    client.tutorcall.progressCheck(client,message,21,["text", messText]);
    return;
  }

  if(args[0].toLowerCase() == "gate"){
    if(!args[1]){
      message.channel.send("Specify a gate to build to!");
      return;
    }
    let targetGate = parseInt(args[1], 10);
    if(isNaN(targetGate) || targetGate<1 || targetGate > 8){
      message.channel.send("That's not a valid Gate! Enter a number 1-7, or 8 to build to the build limit.");
      return;
    }
    args[0] = `${gateReq[targetGate - 1] - buildSpent}`;
  }

  value = parseInt(args[0], 10);
  if(isNaN(value) || value<1){
    message.channel.send("That is not a valid amount of grist to spend!");
    return;
  }

  // Limit at the eighth position, rather than the seventh gate, in preparation for The Ultimate Alchemy.
  if(value + buildSpent > gateReq[MAX_HEIGHT_INDEX])
  {
    let diff = value + buildSpent - gateReq[MAX_HEIGHT_INDEX];
    value -= diff;
  }

  if(value < 1)
  {
    if(curGate >= GATES_PER_ROOM){
      addRoomsToHouse(client, message, targsburb, curGate, client.landMap.get(targsburb,"h"));
    }

    message.channel.send("The Client has already reached the build limit! Their house can't go any higher!");
    if(curGate <= MAX_HEIGHT_INDEX)
    {
        gate = MAX_HEIGHT_INDEX + 1;
        client.landMap.set(targsburb,gate,"gate");
    }
    return;
  }

  if(value > grist[0]) {
    message.channel.send("The Client doesn't have enough Build Grist!");
    return;
  }

  //increases built amount and decreases build grist total
  buildSpent += value;
  grist[0] -= value;

  //check if player has enough grist to reach next gate
  for(let i=0;i<gateReq.length;i++){
    if(buildSpent>=gateReq[i]){
      gate++;
    }
  }

  client.sburbMap.set(targsburb,grist,"grist");
  client.landMap.set(targsburb,buildSpent,"spent");


  //if player can now reach next gate, send message

  client.funcall.tick(client,message);

  if(gate>curGate){
    if(curGate >= GATES_PER_ROOM){
      addRoomsToHouse(client, message, targsburb, curGate, client.landMap.get(targsburb,"h"));
    }

    client.landMap.set(targsburb,gate,"gate");
    message.channel.send(`Expended ${value} BUILD GRIST to build house. The CLIENT PLAYER'S house now reaches ${gate <= MAX_HEIGHT_INDEX ? `GATE ${gate}.` : `the build limit!`}`);
    }
    else {
      message.channel.send(`Expended ${value} BUILD GRIST to build house.`);
  }

}

function addRoomsToHouse(client, message, targsburb, currGate, houseMap){
  let house = houseMap[0][0];
  let currentRooms = house[1];
  let desiredRooms = Math.floor(currGate / GATES_PER_ROOM) + ROOMS_BEFORE;
  console.log(`Rooms before: ${currentRooms}/${desiredRooms}`);
  let did = false;
  for(let i=currentRooms; i<desiredRooms; i++){
    house = addRoomToHouse(client, message, house, i);
	did = true;
  }

  houseMap[0][0] = house;

  if(did){
    client.landMap.set(targsburb,houseMap,"h");
  }

  return houseMap;
}

function addRoomToHouse(client, message, house, index){
  if(house[1] != index){
    console.log(`House has ${house[1]} rooms; addRoomToHouse told to push room to index ${index}!`);
  }

  let room = [[],{"onSomeoneEnterRoom": ["populateNewHouseRoomLoot"]},ROOM_NAMES[index - ROOMS_BEFORE],false,[],[]];
  house[2].push(room);
  house[1] = house[1] + 1;

  return house;
}
