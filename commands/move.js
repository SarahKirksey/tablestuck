exports.type = "house";
exports.desc = "Move around the world";
exports.use = `">move" lists all rooms you can move to, in your current tile. This might be rooms in a house, or areas in a village.
">move [number]" lets you move between rooms in a tile."
">move [n,s,e,w,north,south,east,west]" lets you move between tiles on your planet, or anywhere else that you travel between tiles.
">move [direction] [number]" lets you move multiple rooms in a straight line, if all rooms have been explored."`;

const MAP_EDGE_ERROR = "You've reached the edge of the section! You can't go any farther!";
const HIT_WALL_ERROR = "You can't go that way!";
const UNDERLING_ERROR = "You can't continue on until the Underlings have been defeated!";
const UNEXPLORED_ERROR = "You can't just rush headlong into unexplored places!";

exports.run = (client, message, args) => {

  var userid = message.guild.id.concat(message.author.id);
  var charid = client.userMap.get(userid,"possess");
  var occset = [(client.charcall.npcCheck(client,charid)?false:true),charid];
  let msg = ``;
  let msg2 = null;
  let local = client.charcall.charData(client,charid,"local");
  let mapCheck = true;
  let sec = client.landMap.get(local[4],local[0])

  if(!args[0]){

    for (let i = 0; i < sec[local[1]][local[2]][2].length; i++) {

      msg += `**[${i+1}] ${sec[local[1]][local[2]][2][i][2]}**\n\n`
    }
    roomDirect = new client.MessageEmbed()
    .setTitle(`**AREA DIRECTORY**`)
    .addFields(
      {name:"**HELP**",value:"Select a room number below to move to that room in this area, or select a direction (North, South, East or West) to move to the surrounding area!"},
      {name:"**ROOMS**",value:msg});
    client.tutorcall.progressCheck(client,message,8,["embed",roomDirect]);
    return;
  }

  let target = [local[0],local[1],local[2],0,local[4]];

  value = parseInt(args[0], 10) - 1;

  if(isNaN(value)){

	args[0] = args[0].toLowerCase();
	
	let distance = 1;
	if(args[1] && parseInt(args[1], 10))
	{
		distance = parseInt(args[1], 10);
	}
	
	let direction;
	let xDiff = 0;
	let yDiff = 0;

    switch(args[0]){
      case "n":
      case "north":
	    direction = "NORTH";
		yDiff = -1;
      break;
      case "s":
      case "south":
	    direction = "SOUTH";
		yDiff = 1;
      break;
      case "e":
      case "east":
	    direction = "EAST";
		xDiff = 1;
      break;
      case "w":
      case "west":
	    direction = "WEST";
		xDiff = -1;
      break;
      default:

      message.channel.send("That is not a valid argument! Select a direction or room to move to!");
      return;

    }
	
    target[1]=local[1]+distance*yDiff;
	target[2]=local[2]+distance*xDiff;
	
	
	msg += `You move ${direction} and enter a `;
	
	for(let i=1; i<distance; i++)
	{
		let blockMovement = false;
		if(local[1]+yDiff*i>=sec.length || local[2]+xDiff*i>=sec.length || local[1]+yDiff*i<0 || local[2]+xDiff*i<0){
			blockMovement = true;
			msg2 = MAP_EDGE_ERROR;
		}
		else if(sec[local[1]+yDiff*i][local[2]+xDiff*i][2][0][3] !== true)
		{
			if(local[0].length>1&&local[0].charAt(local[0].length-1)=="d"){
				blockMovement = true;
				msg2 = UNEXPLORED_ERROR;
			}
			else{
				// Stop the player at this tile, instead of stopping them immediately before it.
				distance = i;
				target[1] = local[1] + yDiff * distance;
				target[2] = local[2] + xDiff * distance;
				break;
			}
		}
		else if(sec[local[1]+yDiff*i][local[2]+xDiff*i][0]==7) {
			blockMovement = true;
			msg2 = HIT_WALL_ERROR;
		}
		
		if(blockMovement)
		{
			distance = i-1;
			target[1] = local[1] + yDiff * distance;
			target[2] = local[2] + xDiff * distance;
			break;
		}
	}

  } else {
    if(value >= sec[local[1]][local[2]][2].length || value < 0){
      message.channel.send(`That is not a valid room! Check the list of room's with ${client.auth.prefix}move`);
      return;
    }

    target[3]=value;
    if(local[0]=="h"){
      if(local[4]==charid){
        msg+=`You move within your house and enter the `;
      } else {
        msg+=`You move within ${client.sburbMap.get(local[4],"name").toUpperCase()}'s house and enter the `
      }
    } else {
    msg+=`You move between rooms and enter the `;
  }
    mapCheck = false;

  }

  if(target[1]>=sec.length||target[2]>=sec.length||target[1]<0||target[2]<0){
    message.channel.send(MAP_EDGE_ERROR);
    return;
  } else if(sec[target[1]][target[2]][0]==7){
    message.channel.send(HIT_WALL_ERROR);
    return;
  } else if(target[0].length>1&&target[0].charAt(local[0].length-1)=="d"){
    if(sec[target[1]][target[2]][2][0][3]==false && client.charcall.underlingCheck(sec[local[1]][local[2]][2][local[3]][4],client)){
      message.channel.send(UNDERLING_ERROR);
      return;
    }
  }
  let move = client.funcall.move(client,message,charid,local,target,mapCheck,msg);

  if(msg2 != null){
    message.channel.send(msg2);
  }
}
