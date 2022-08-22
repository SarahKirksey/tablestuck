
exports.run = (client, message, args) => {

	if(!client.funcall.dmcheck(client,message)){
		message.channel.send("You must be a DM or Author to use this command!");
		return;
	}
	
	var userid = message.guild.id.concat(message.author.id);
	var charid = client.userMap.get(userid,"possess");
	let local = client.charcall.charData(client,charid,"local");

	message.channel.send(`Merging. Adorned in new clothes. They are...comfy.`);
	client.charcall.setAnyData(client,userid,charid,true,"godtier");

	// removes dreamself from wherever they are and merges the bodies if the player hasn't revived yet
	// if(!client.charcall.allData(client,userid,charid,"revived"))
	{
		let altself;

		// Attempt to identify the other self.
		if(client.charcall.allData(client,userid,charid,"dreamer")){
			altself = client.charcall.allData(client,userid,charid,"wakingID");
		} else {
			altself = client.charcall.allData(client,userid,charid,"dreamingID");
		}

		// Remove the other self from wherever they are.
		let dreamlocal = client.charcall.charData(client,altself,"local");
		if(dreamlocal[4] && client.landMap.has(dreamlocal[4])){
			let dreamsec = client.landMap.get(dreamlocal[4],dreamlocal[0]);
			let dreamoccList = dreamsec[dreamlocal[1]][dreamlocal[2]][2][dreamlocal[3]][4];
			for(let i=0;i<dreamoccList.length;i++){
				if(dreamoccList[i][1]==altself){
					dreamsec[dreamlocal[1]][dreamlocal[2]][2][dreamlocal[3]][4].splice(i,1);
					client.landMap.set(dreamlocal[4],dreamsec,dreamlocal[0]);
					break;
				}
			}
		}

		// Then, move the other self to the current location, and mark them as dead.
		client.charcall.setAnyData(client,userid,altself,local,"local");
		client.charcall.setAnyData(client,userid,charid,false,"alive");

		// Loot your other self.
		const cmd = client.commands.get("loot");
		cmd.run(client,message,args,true);
	}

	// If the player already has armor, remove it.
	if(client.charcall.charData(client,charid,"armor").length>0){
	  sdex = client.charcall.charData(client,charid,"sdex");
	  cardcount = client.charcall.charData(client,charid,"cards");
	  client.charcall.setAnyData(client,userid,charid,cardcount+1,"cards");
	  sdex.push(client.charcall.charData(client,charid,"armor")[0]);
	  client.charcall.setAnyData(client,userid,charid,sdex,"sdex");
	}

	let aspectList=["BREATH","LIFE","LIGHT","TIME","HEART","RAGE","BLOOD","VOID","SPACE","MIND","HOPE","DOOM"];
	let quickKey =[["m","n","o","p","q","r","s","t","u","v","w","x"],["D","C","B","A","9","8","7","6","5","4","3","2"]];

	// If on a dream bed, simply grab the aspect from the current Land
	let aspectIndex =aspectList.indexOf(client.landMap.get(local[4],"aspect"));

	// If grabbing the aspect from the current Land didn't work, try grabbing it from the player's Land.
	if(isNaN(aspectIndex) || local[4]!=client.charcall.allData(client,userid,charid,"owner") || aspectIndex == undefined)
	{
		let landID = client.sburbMap.get(client.charcall.allData(client,userid,charid,"owner"), "landID");
		aspectIndex = aspectList.indexOf(client.landMap.get(landID, "aspect"));
	}

	// Create the GTPJs and revive the player.
	client.charcall.setAnyData(client,userid,charid,[[`GODTIER PAJAMAS`,`s!${quickKey[0][aspectIndex]}${quickKey[1][aspectIndex]}0000`,1,1,[]]],"armor")
	client.charcall.setAnyData(client,userid,charid,true,"alive");
	client.charcall.setAnyData(client,userid,charid,client.charcall.allData(client,userid,charid,"gel"),"vit");
}
