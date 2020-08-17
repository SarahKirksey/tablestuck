const funcall = require("../modules/funcall.js");
//simple ping command to check if the bot is online.
const strifecall = require("../modules/strifecall.js");

exports.run = (client, message, args) => {

  if(funcall.regTest(client, message, message.author) == false){
    message.channel.send("You're not a registered player!");
    return;
  }

  if(strifecall.strifeTest(client, message, message.author) == true){
    message.channel.send("You can't do that in Strife! You need to either win the Strife or leave Strife using Abscond!");
    return;
  }

  var charid = message.guild.id.concat(message.author.id);

  let local = client.playerMap.get(charid,"local");
  let land = local[4];
  let sec = client.landMap.get(land,local[0]);
  let area = sec[local[1]][local[2]];
  let room = area[2][local[3]];
  let sdex = client.playerMap.get(charid,"sdex");
  let cards = client.playerMap.get(charid,"cards")

  selectDex = parseInt(args[0], 10) - 1;
  if(isNaN(selectDex)){

    message.channel.send("That is not a valid argument!");
    return;
  }
  if(selectDex >= cards || selectDex< 0){
    message.channel.send("That is not a valid item! Check the list of items in your Sylladex with >sylladex");
    return;
  }
  let dropItem;
  if(selectDex >= sdex.length){

    if(cards <= 1) {
      message.channel.send("Cannot eject your last CAPTCHALOGUE CARD!");
      return;
    }

    cards-=1;
    client.playerMap.set(charid,cards,"cards");
    dropItem=["CAPTCHALOGUE CARD","11111111",1,1,[]];
  } else {
    dropItem=sdex.splice(selectDex,1)[0];
  }
  room[5].push(dropItem);
  sec[local[1]][local[2]][2][local[3]] = room;
  client.landMap.set(land,sec,local[0]);
  client.playerMap.set(charid,sdex,"sdex");
  message.channel.send(`Ejected the ${dropItem[0]}!`);
}
