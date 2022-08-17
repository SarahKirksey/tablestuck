const funcall = require("../modules/funcall.js");
//inspect current area or item
const strifecall = require("../modules/strifecall.js");


const typeList = ["EMPTY","DUNGEON","CONSTRUCT","RETURN NODE","VILLAGE","HOUSE","GATE"];
exports.type = "house";
exports.desc ="Look at the items in the room you are in";
exports.use = `">inspect" lists all items in your current room.
">inspect [number]" allows for a closer inspection of an item in a room.
">inspect page [number]" lets you see more pages of what's in the room, as each page only holds 10 items and rooms have an unlimited amount of space.`;
exports.run = (client, message, args) => {

  var userid = message.guild.id.concat(message.author.id);
  var charid = client.userMap.get(userid,"possess");

  let local = client.charcall.charData(client,charid,"local");
  let land = local[4];
  let sec = client.landMap.get(land,local[0]);
  let area = sec[local[1]][local[2]];
  let room = area[2][local[3]];
  let occList = room[4];
  let dex = room[5];
//sec[local[1]][local[2]][2][local[3]][5] DEX

  if(!args[0] || args[0] == "page"){
    let page = 0;
    if (args[0]&&args[0] == "page") {
      page = parseInt(args[1], 10) - 1;
      if (isNaN(page)||page<0) {
        message.channel.send("That is not a valid page number!");
        return;
      }
    }

    async function dexCheck(){

    const attachment = await client.imgcall.sdexCheck(client,message,page,args,3,dex,dex.length,room[2]);
      client.tutorcall.progressCheck(client,message,3,["img",attachment]);
    }

    dexCheck();
    return;
  }

  value = parseInt(args[0], 10) - 1;
  if(isNaN(value)){
    message.channel.send("That is not a valid argument!");
    return;
  }

  if(value >= dex.length || value < 0) {
    message.channel.send("That is not a valid argument!")
    return;
  }

  let type = 3;
  let item = dex[value];

  while (args[1]) {
    // Viewing a specific item in a container
    let subValue = parseInt(args[1], 10) - 1;
    if(isNaN(subValue) || subValue < 0 || subValue >= dex[value][4].length){
      message.channel.send("That is not a valid argument!");
      return;
    }

    type = 0;
    dex = dex[value][4];
    item = dex[subValue];
    value = subValue;
    args.splice(0, 1);
  }

  //decypher captcha code and convert into weapon information

  async function itemInspect(){
  const attachment = await client.imgcall.inspect(client,message,args,type,dex[value]);

    client.tutorcall.progressCheck(client,message,4,["img",attachment]);
  }
  itemInspect();
}
