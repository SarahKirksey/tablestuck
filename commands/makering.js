const images = [];

exports.run = (client, message, args) => {
	var userid = message.guild.id.concat(message.author.id);
	var charid = client.userMap.get(userid,"possess");

	if(!client.funcall.dmcheck(client,message)){
		message.channel.send("You must be a DM to use this command!");
		return;
	}

	let dex = client.charcall.charData(client,charid,"sdex");
	let cards = client.charcall.charData(client,charid,"cards");

	let orbs = client.landMap.get(`${message.guild.id}medium`,"playerList").length;
	let prototypes = client.landMap.get(`${message.guild.id}medium`,"prototype").length;
	
	let ringName = "RING OF ORBS";
	
	if(prototypes === 0){
		orbs = 0;
	}

	switch(orbs){
	case 0:
		ringName += " NOFOLD";
		break;
	case 1:
		ringName += " ONEFOLD";
		break;
	case 2:
		ringName += " TWOFOLD";
		break;
	case 3:
		ringName += " THREEFOLD";
		break;
	case 4:
		ringName += " FOURFOLD";
		break;
	case 5:
		ringName += " FIVEFOLD";
		break;
	case 6:
		ringName += " SIXFOLD";
		break;
	case 7:
		ringName += " SEVENFOLD";
		break;
	case 8:
		ringName += " EIGHTFOLD";
		break;
	case 9:
		ringName += " NINEFOLD";
		break;
	case 10:
		ringName += " TENFOLD";
		break;
	case 11:
		ringName += " ELEVENFOLD";
		break;
	case 12:
		ringName += " TWELVEFOLD";
		break;
	default:
		ringName += " MANYFOLD";
		break;
	}

	let ring = [
		ringName,
		"UNKNOWN",
		orbs * orbs, // The tier is the number of orbs squared, meaning that the trinket bonus equals the number of orbs.
		1,
		[],
		images[orbs], // For any entry not in the array, this will evaluate to "undefined". It will then default to the "ringkind" artwork.
		{
			// "v" because the ring should, on the back end, be treated as a pair of glasses.
			"trueCode": "vℚ𝕟𝕤®𝚒𝚗𝚐",
			"orbs": orbs <= 12 ? orbs : undefined
		}
	];

	dex.unshift(ring);
	cards += 1;

	client.charcall.setAnyData(client, userid, charid, dex, "sdex");
	client.charcall.setAnyData(client, userid, charid, cards, "cards");
}
