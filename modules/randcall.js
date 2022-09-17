
const bonus = [[1,2],[1,4],[1,6],[1,8],[1,10],[1,12],[2,16],[2,20],[2,24],[3,30],[3,36],[4,40],[5,50],[6,60],[7,70],[8,80],[10,100]];


exports.randLessThan = function(upperLimit){
	return randLessThan(upperLimit);
}

exports.spliceRandom = function(list){
	return spliceRandom(list);
}

exports.getAnyExcept = function(list, forbidden){
	let index = randLessThan(list.length - 1);
	if(index >= list.indexOf(forbidden)){
		index++;
	}
	return list[index];
}

function spliceRandom(list){
	let number = randLessThan(list.length);
	return list.splice(number, 1)[0];
}

// Note: upperLimit does not need to be an integer.
// Giving it (1.5) is the same as calling Math.floor((Math.random() * 6) / 4), for example.
function randLessThan(upperLimit){
	return Math.floor((Math.random() * upperLimit));
}

exports.rollXdY = function(x,y){
	return rollXdY(x, y);
}

function rollXdY(x, y){
	let retVal = 0;
	for(let i=0; i<x; i++){
		retVal += randLessThan(y);
	}
	return retVal + x;
}

function roll1dX(x){
	return randLessThan(x) + 1;
}

function rollXdYZTimes(x, y, z){
	let retVal = [];
	for(let i=0; i<z; i++){
		retVal.push(rollXdY(x, y));
	}
	return retVal;
}

function rollBonus(client, message, tier, bns = null){
	return rollBonusWithKnownConfig(client.configcall.get(client, message, "BONUS_ROLLS"), tier, bns);
}

exports.rollBonus = function(client, message, tier, bns = null){
	return rollBonus(client, message, tier, bns);
}

exports.rollBonusWithKnownConfig = function(config, tier, bns = null){
	return rollBonusWithKnownConfig(config, tier, bns);
}

function rollBonusWithKnownConfig(config, tier, bns = null){
	config = parseInt(config, 10);
	switch(config){
		case 0: return rollBonusUsingDice(tier, bns);
		case 1: return rollBonusUsingOldLabels(tier, bns);
		case 2: return rollBonusUsingOldMethod(tier, bns);
	}
	if(config !== "NONE"){
		console.log(`Someone just called rollBonusWithKnownConfig with config value "${config}". It didn't work.`);
	}
	return rollBonusUsingDice(tier, bns);
}

function rollBonusUsingOldMethod(tier, bns){
	let bonusRoll = bonus[tier];
	if(!tier && bns){
		bonusRoll = bns;
	}
	return Math.floor((Math.random() * (bonusRoll[1] - bonusRoll[0])) + bonusRoll[0]);
}

function rollBonusUsingOldLabels(tier, bns){
	let bonusRoll = bonus[tier];
	if(!tier && bns){
		bonusRoll = bns;
	}
	return rollXdY(bonusRoll[0], bonusRoll[1]);
}

function rollBonusUsingDice(tier, bns){
	let bonusRoll = bonus[tier];
	if(!tier && bns){
		bonusRoll = bns;
	}
	return rollXdY(bonusRoll[0], bonusRoll[1]/bonusRoll[0]);
}

// Note: Math.ceil(Math.random() * x) is not sufficient.
// This is because there is a very very very very very very very very slim chance the result will be 0.
// In fact, the chance is exactly one in 4,503,599,627,370,496.
exports.roll1dX = function(x){
	return Math.ceil(Math.random() * x) || x;
}

exports.rollToHit = function(noirBonus = false, refinedBonus = false, scienceBonus = false){
	let retVal = [roll1dX(20), (noirBonus == true) ? roll1dX(4) : 0];
	if(refinedBonus == true){
		retVal[1] += 2;
		if(scienceBonus == true){
			retVal[1] += 2;
		}
	}
	return retVal;
}
