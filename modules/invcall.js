const NAME = 0;
const CODE = 1;
const TIER = 2;
const AMOUNT = 3;
const CONTENTS = 4;
const IMAGE = 5;
const EXTRA_DATA = 6;

const NONE = "NONE";
const STACK = "STACK";
const QUEUE = "QUEUE";

const LOCALE_NAME = "loc";
const MODUS_NAME = "modus";
const ATH_NAME = "registry";
const SYLLADEX_NAME = "sdex";

function getDisplayCodeFromItem(item){
	return item[CODE];
}

function getTrueCodeFromItem(item){
	let extra = item[EXTRA_DATA];
	if(!extra){
		return item[CODE];
	}
	
	if(!(extra.trueCode)){
		return item[CODE];
	}
	
	return extra.trueCode;
}

function listAsNoMoreThanOne(listFrom, listTo, overflowList){
	if(listFrom.length>0){
		if(listTo.length==0){
			listTo[0] = listFrom[0];
		} else {
			overflowList.push(listFrom.pop());
			return 1;
		}
	}
	return 0;
}




exports.getItemFromCharData = function(client, userID, charID, dataType, index, removeFromInv = false){
	return getItemFromCharData(client, userID, charID, dataType, index, removeFromList);
}

function getItemFromCharData(client, userID, charID, dataType, index, removeFromInv = false){
	// Here, we take string-based indexes and parse them into numbers.
	if(isNaN(index)){
		index = parseInt(index, 10) - 1;
	}

	// Here, we also check to ensure that the parsing actually worked.
	if(isNaN(index) || !client || (!userID && !charID) || !dataType){
		return NONE;
	}
	
	if(index < 0){
		return NONE;
	}
	
	let inv = client.charcall.allData(client, userID, charID, dataType);
	if(inv === NONE){
		return NONE;
	}
	
	if(index >= inv.length){
		return NONE;
	}
	
	let retVal = inv[index];
	if(removeFromInv){
		let modus = QUEUE;
		if(dataType === SYLLADEX_NAME){
			modus = client.charcall.allData(client, userID, charID, MODUS_NAME);
			if(modus === "NONE"){
				modus = STACK;
			}
		}
		else if(dataType === ATH_NAME){
			modus = QUEUE;
		}

		let spillItems = removeItemFromInventory(inv, index, modus);
		if(spillItems.length > 0){
			let locale = client.charcall.allData(client, userID, charID, LOCALE_NAME);
			addItemsToRoom(client, locale, spillItems);
		}
		client.charcall.setAnyData(client,userid,charid,inv,dataType)
	}
}

function removeItemFromInventory(inv, index, modus){
	let spillItems = [];
	switch(modus){
		case QUEUE:
		case STACK:
			inv.splice(index, 1);
			break;
		default:
			console.log(`removeItemFromInventory does not support the modus type ${modus}!`);
			break;
	}
	return spillItems;
}

function addItemsToRoom(client, locale, spillItems){
	console.log(`addItemsToRoom is not yet implemented!`);
	console.log(`Failed to spill ${spillItems} into ${locale}!`);
	return;
}
