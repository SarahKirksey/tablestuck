exports.run = (client, message, args) => {


  var userid = message.guild.id.concat(message.author.id);
  var charid = client.userMap.get(userid,"possess");
  var sburbid = client.sburbMap.get(charid,"owner");

  let local = client.playerMap.get(charid,"local");
  let land = local[4];
  let sec = client.landMap.get(land,local[0]);
  let area = sec[local[1]][local[2]];
  let room = area[2][local[3]];
  let dex  = room[0];

//temp to Test

let page = 0;

async function dexCheck(){
const attachment = await client.imgcall.sdexCheck(client,message,page,args,3,dex,dex.length,room[2]);

  message.channel.send(attachment);
}

if(area[0]==4){
dexCheck();
} else {
  message.channel.send("You're not in a village :(");
}





}
