
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

	let type = 3;

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

		const attachment = await client.imgcall.sdexCheck(client,message,page,args,type,dex,dex.length,room[2]);
			client.tutorcall.progressCheck(client,message,3,["img",attachment]);
		}

		dexCheck();
		return;
	}
	
	let contentsMode = false;
	
	switch(args[0].toLowerCase()){
		case "specibus": {
			dex = client.charcall.charData(client,charid,"spec");
			args.splice(0, 1);
			type = 1;
			break;
		}

		case "sylladex": {
			dex = client.charcall.charData(client,charid,"sdex");
			args.splice(0, 1);
			type = 0;
			break;
		}

		case "room": {
			// dex has already been initialized to the correct value.
			args.splice(0, 1);
			type = 4;
			break;
		}

		case "atheneum":
		case "atheneaum":
		case "registry":
		case "ath": {
			dex = client.charcall.allData(client,userid,charid,"registry");
			args.splice(0, 1);
			type = 4;
			break;
		}
	}
	
	if(args[0].toLowerCase() == "contents"){
		contentsMode = true;
		type = 2;
		args.splice(0, 1);
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

	let item = dex[value];
	let page = 0;
	let pageName = item[0];

	while (args[1]) {
		if (args[1] == "page") {
			contentsMode = true;
			page = parseInt(args[2], 10) - 1;
			if (isNaN(page)||page<0) {
				message.channel.send("That is not a valid page number!");
				return;
			}
			break;
		}

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

	async function itemInspect(mode = 0){
		const attachment = await client.imgcall.inspect(client,message,args,type,dex[value],mode);
		client.tutorcall.progressCheck(client,message,4,["img",attachment]);
	}

	if(!contentsMode){
		itemInspect(7);
	}
	else{
		async function dexCheck() {
			const attachment = await client.imgcall.sdexCheck(client,message,page,args,type,dex,dex.length,pageName);
			client.tutorcall.progressCheck(client,message,12,["img",attachment]);
		}
		dexCheck();
	}
}
