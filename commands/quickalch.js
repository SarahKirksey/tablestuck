const funcall = require("../modules/funcall.js");

const strifecall = require("../modules/strifecall.js");

//command to alchemize an item from a totem in the alchemiter
exports.type = "alchemy";
exports.desc = "Faster alchemy unlocked by by Instant Alchemizer";
exports.use = `">quickalch [number]" lets you use the Instant Alchemizer to add an item in your sylladex to your atheneum.
">quickalch [number] &&/||/and/or [number]" lets you combine two items in your invetory in alchemy, either using AND AND (&&,and) alchemy or OR OR (| |,or) alchemy. The resulting item is added to your atheneum.`;
exports.run = (client, message, args) => {

//defining the costs to alchemize the item based on the tier

  const tierCost = [0,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,65536,131072]

//defining important variables

  var userid = message.guild.id.concat(message.author.id);
  var charid = client.userMap.get(userid,"possess");
  var local = client.charcall.charData(client,charid,"local");
  let land = local[4];
  let sec = client.landMap.get(land,local[0]);
  let area = sec[local[1]][local[2]];
  let room = area[2][local[3]];
  var playerGrist = client.charcall.allData(client,userid,charid,"grist");
  let sdex = client.charcall.charData(client,charid,"sdex");
  let registry = client.charcall.allData(client,userid,charid,"registry");
  if(playerGrist=="NONE"){
    message.channel.send("You can't alchemize without any grist!");
    return;
  }

//define variables for the FOR loop

  let i;
  let alchemiter = [false,false];
  let ialchemiter = false;
  let item;
  let cost1;
  let cost2;
  let grist;

//Check every item in the room to find alchemiter, if there is check for any cruxite artifact


  for(i=0;i<room[5].length;i++){
    if(room[5][i][1].charAt(0) == "/"&&room[5][i][0]=="INSTANT ALCHEMITER"){
      ialchemiter = true;
    }
  }


if (ialchemiter == true || client.traitcall.traitCheck(client,charid,"COMPUTER")[1]){


  // If there is only one argument, the player simply wants to register the item into the athenaeum
  if(args.length == 1){
    select1 = parseInt(args[0], 10) - 1;
    if(isNaN(select1)){
      message.channel.send("That is is not a valid argument!");
      return;
    }

    if(select1 >= sdex.length || select1< 0){
      message.channel.send(`That is not a valid item! Check the list of items in your Sylladex with ${client.auth.prefix}sylladex`);
      return;
    }

    // Grab a copy of the item from the sylladex, and set the quantity and contents to 1 and empty, respectively.
    item1 = sdex[select1].slice();
    item1[3] = 1;
    item1[4] = [];

    // Make sure the code doesn't already exist in the athenaeum
    function checkCode(checkItem){
      return checkItem[1] == item1[1];
    }

    if(registry.findIndex(checkCode)!= -1){
      message.channel.send("You've already registered an item with that code!");
      return;
    }

    if(item1[1].charAt(0) == "/"||item1[1]=="########"){
      message.channel.send("You can't alchemize that!");
      return;
    }

    // If everything checks out, add the item to the registry!
    registry.unshift(item1);
    client.charcall.setAnyData(client,userid,charid,registry,"registry");
    message.channel.send(`Registered the ${item1[0]} to the alchemy atheneum! Alchemize it using the ${client.auth.prefix}alchemize command`);
    client.funcall.tick(client,message);
    return;

  }

  let argsCount = args.length;

  if(argsCount < 3){
    client.tutorcall.progressCheck(client,message,48,["text",`To use the Instant Alchemiter, you need to select an item from your sylladex or atheneum, select an alchemy type (&& or ||), and select a second item from your sylladex or atheneum. For example, ${client.auth.prefix}quickalch 1 && 2. If you want to just reproduce a single item, just select the first item.`]);
    return;
  }

  let is1Ath = (args[0].toLowerCase() == "ath");
  let is2Ath = (args[argsCount - 2].toLowerCase() == "ath");

  if((is1Ath ? 1 : 0) + (is2Ath ? 1 : 0) + 3 != argsCount)
  {
    client.tutorcall.progressCheck(client,message,48,["text",`To use the Instant Alchemiter, you need to select an item from your sylladex or atheneum, select an alchemy type (&& or ||), and select a second item from your sylladex or atheneum. For example, ${client.auth.prefix}quickalch 1 && ath 2. If you want to just reproduce a single item, just select the first item.`]);
    return;
  }

  if(is1Ath)
  {
      select1 = parseInt(args[1], 10) - 1;
      if(isNaN(select1))
      {
        message.channel.send("Item 1 is not a valid argument!");
        return;
      }
      if(select1 >= registry.length || select1< 0){
        message.channel.send(`The first selection is not a valid item! Check the list of items in your Sylladex with ${client.auth.prefix}sylladex`);
        return;
      }
      args.splice(0, 1);
  }
  else
  {
      select1 = parseInt(args[0], 10) - 1;
      if(isNaN(select1))
      {
        message.channel.send("Item 1 is not a valid argument!");
        return;
      }
      if(select1 >= sdex.length || select1< 0)
      {
        message.channel.send(`The first selection is not a valid item! Check the list of items in your Sylladex with ${client.auth.prefix}sylladex`);
        return;
      }
  }


  if(is2Ath)
  {
      select2 = parseInt(args[3], 10) - 1;
      if(isNaN(select2))
      {
        message.channel.send("Item 2 is not a valid argument!");
        return;
      }
      if(select2 >= registry.length || select2< 0)
      {
        message.channel.send(`The second selection is not a valid item! Check the list of items in your Sylladex with ${client.auth.prefix}sylladex`);
        return;
      }
      args.splice(2, 1);
  }
  else
  {
      select2 = parseInt(args[2], 10) - 1;
      if(isNaN(select2))
      {
        message.channel.send("Item 2 is not a valid argument!");
        return;
      }
      if(select2 >= sdex.length || select2< 0)
      {
        message.channel.send(`The second selection is not a valid item! Check the list of items in your Sylladex with ${client.auth.prefix}sylladex`);
        return;
      }
  }

  if(select1==select2){

  }

  if(is1Ath) { item1 = registry[select1]; } else { item1 = sdex[select1]; }
  if(is2Ath) { item2 = registry[select2]; } else { item2 = sdex[select2]; }


  let mode = args[1].toLowerCase();
  // Check the mode of the alchemy being performed
  if(mode=="oror"||mode=="or")
  {
      mode = "||";
  }
  else if(mode=="andand"||mode=="and")
  {
      mode = "&&";
  }

  if(mode!="||"&&mode!="&&")
  {
      message.channel.send("That is not a valid alchemy type!");
      return;
  }

  // Alchemize up a new item
  newItem = funcall.alchemize(client,item1,item2,mode);

  // Apply trait-based changes to freshly-alchemized items, as you do
  // TODO: Move this to funcall.alchemize.
  if(client.traitcall.itemTrait(client,newItem,"SHITTY"))
  {
    newItem[2]=1;
    newItem[1] = newItem[1][0] + "0" + newItem[1].substr(2);
  }
  else if(client.traitcall.itemTrait(client,newItem,"TRICKSTER"))
  {
    newItem[2]=16;
    newItem[1] = newItem[1][0] + "?" + newItem[1].substr(2);
  }
  else if(client.traitcall.itemTrait(client,newItem,"EXQUISITE"))
  {
    newItem[1] = newItem[1][0] + "!" + newItem[1].substr(2);
  }

  // Determine whether the resulting code is already in the athenaeum. If so, notify the player and don't register the item.
  function checkNewCode(checkItem){
    return checkItem[1] == newItem[1];
  }

  if(registry.findIndex(checkNewCode)!= -1){
    message.channel.send("You've already registered an item with that code!");
    return;
  }

  // Lastly, add the new item to the athenaeum and save the ath data.
  registry.unshift(newItem);
  client.charcall.setAnyData(client,userid,charid,registry,"registry");
  message.channel.send(`Registered the resulting item to the alchemy atheneum! Alchemize it using the ${client.auth.prefix}alchemize command`);
  client.funcall.tick(client,message);

  return;
}
else{
    client.tutorcall.progressCheck(client,message,42,["text","To QUICK ALCHEMIZE, you must be in a room with an INSTANT ALCHEMITER."]);
    return;
  }

}
