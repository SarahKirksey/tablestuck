exports.run = async function(client, message, args){

  var userid = message.guild.id.concat(message.author.id);
  var charid = client.userMap.get(userid,"possess");
  let chumroll = client.charcall.allData(client,userid,charid,"chumroll");
  if(chumroll=="NONE"){
    message.channel.send("You have no chums to pester!");
    return;
  }
  let tagList = [];

  for(let i=0;i<chumroll.length;i++){
    if(client.charcall.allData(client,userid,chumroll[i],"chumtag")){
      tagList.push(client.charcall.allData(client,userid,chumroll[i],"chumtag"));
    }else{
      tagList.push(i);
    }
  }

  if(!args[0]){
    message.channel.send(`check your chumroll and use a chum's tag to message them! For example, ${client.auth.prefix}pester gt Fuck you!`);
      client.tutorcall.progressCheck(client,message,11);
    return;
  }

  let value;

  if(tagList.includes(args[0].toUpperCase())){
    value=tagList.indexOf(args[0].toUpperCase());
  }else{
    message.channel.send(`That isn't a valid tag! Check your ${client.auth.prefix}chumroll and use a chum's tag to message them!`);
    client.tutorcall.progressCheck(client,message,11);
    return;
  }

  if(!args[1]){
    message.channel.send("You need to type a message to send to your chum!");
    return;
  }

  let msg=``;

  let i;

  for(i=1;i<args.length;i++){
    console.log(i);
    console.log(args.length);
    msg+=`${args[i]} `;
  }

  try{

    client.hookcall.pester(client,message,charid,chumroll[value],msg);
    client.tutorcall.progressCheck(client,message,11);
  }catch(err){
    message.channel.send("Failed to send message!");
  }

}
