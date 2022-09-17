exports.type = "sylladex";
exports.desc = "Checks information on traits"
exports.use = `">trait" will display any currently active traits and your progress to the set bonus.
">trait [trait name]" lets you see what any named trait does, as well as it's set bonus.`
exports.run = (client, message, args) => {

  if(!args[0]){
    var userid = message.guild.id.concat(message.author.id);
    var charid = client.userMap.get(userid,"possess");
    let allTraits;

    // Special check for the temporary prototypings that can be gained from using the AMALGAMATE action during strife
    let prototypes;
    let local = client.charcall.allData(client, userid, charid, "local");
    if(local && local != "NONE" && client.charcall.charData(client,charid,"strife")==true){
      let strifeKey = `${local[0]}/${local[1]}/${local[2]}/${local[3]}/${local[4]}`;
      if(client.strifeMap.has(strifeKey)){
        let special;
        let strifeList = client.strifeMap.get(strifeKey, "list");
        for(let i=0; i<strifeList.length;i++){
          if(strifeList[i][1] == charid){
            special = strifeList[i][8];
            break;
          }
        }
        if(special && special["prototypes"]){
          prototypes = special["prototypes"];
        }
      }
    }

    if(!prototypes){
      prototypes = undefined;
    }

    allTraits = client.traitcall.getTraitSet(client, charid, prototypes);

    let msg = ``;
    for (key in allTraits) {
      if(key != "NONE"){
        msg+=`**${key}**\nTrait Bonus - *${client.traitDesc[key].trait}*\n\nSet Bonus ${allTraits[key]}/3 ${(allTraits[key]>=3?`ACTIVE - `:`INACTIVE - `)} *${client.traitDesc[key].set}*\n\n`;
      }
    }

    if(msg.length==0){
      msg="NO TRAITS ACTIVE!";
    }

    var embed = new client.MessageEmbed()
    .setTitle(`ACTIVE TRAITS`)
    .addFields(
      {name:`HELP`,value:`These are all your active traits and the bonuses they give you! These traits are determined by your equipped WEAPON, ARMOR, and TRINKET.\n\nIf you have at least 3 of the same trait equipped, you also get the SET BONUS listed alongside the trait.\n\n If you'd like to see details on traits you don't have, do ${client.auth.prefix}trait [trait name]`},
      {name:`TRAITS`,value:msg}
    );

    client.tutorcall.progressCheck(client,message,25,["embed",embed]);
    return;

  }

  try{

    var embed = new client.MessageEmbed()
    .setTitle(`${args[0].toUpperCase()} TRAIT`)
    .addFields(
      {name:`TRAIT BONUS`,value:`*${client.traitDesc[args[0].toUpperCase()].trait}*`},
      {name:`SET BONUS (3 iterations of trait must be active)`,value:`*${client.traitDesc[args[0].toUpperCase()].set}*`}
    )
    .setThumbnail(client.traitDesc[args[0].toUpperCase()].img)

    message.channel.send({embeds:[embed]});
    return;

  }catch(err){
    message.channel.send("That doesn't seem to be a trait!");
  }

}
