exports.type = "author";
exports.desc = "Spawn underlings or NPCS";
exports.use = `">spawn [underling type]" spawns an underling in your current location of the specified type (imp,ogre,basilisk etc).
">spawn [underling type] [grist type]" changes the grist type from random to the specified type.`;
exports.run = function(client,message,args){

if(!client.funcall.dmcheck(client,message)){
message.channel.send("You must be a DM or Author to use this command!");
return;
}

if(!args[0]){
message.channel.send(`Please select what you want to spawn, such as \"${client.auth.prefix}spawn imp\".\nOptionally, you can specify the grist type with another argument, like \"${client.auth.prefix}spawn imp shale\".`);
return;
}

args[0] = args[0].toLowerCase();

switch(args[0]){
  case "ss": args[1] = "royal", args[0] = "Sovereign Slayer"; break;
  case "dd": args[1] = "royal", args[0] = "Draconian Dignitary"; break;
  case "hb": args[1] = "royal", args[0] = "Hegemonic Brute"; break;
  case "cd": args[1] = "royal", args[0] = "Courtyard Droll"; break;
}

let spawnList = ["imp","ogre","basilisk","lich","giclopse","titachnid","denizen","queen","king", "Draconian Dignitary", "Sovereign Slayer", "Hegemonic Brute", "Courtyard Droll"];
if(!spawnList.includes(args[0])){
let msg = `Sorry, your choice isn't recognized. The current spawns supported are:`;
for(let i=0;i<spawnList.length;i++){
  msg+=`\n${spawnList[i]}`;
}
message.channel.send(msg);
return;
}
let gristList = ["uranium","amethyst","garnet","iron","marble","chalk","shale","cobalt","ruby","caulk","tar","amber"];
if(args[1]&&!gristList.includes(args[1].toLowerCase())){
 let msg = `Sorry, that's not a valid grist type. The availible grist types are:\n`;
 for (let i=0;i<gristList.length;i++){
   msg+=`${gristList[i]}, `;
 }
 message.channel.send(msg);
 return;
}
let undername;
if(!args[1]){
undername = client.strifecall.spawn(client,message,args[0])
} else {
undername = client.strifecall.spawn(client,message,args[0],args[1].toLowerCase());
}
if(args[1] === "royal"){
  undername = args[0];
}
message.channel.send(`Spawned ${undername} in current room!`);
}
