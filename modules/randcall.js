

exports.randLessThan = function(upperLimit){
	return randLessThan(upperLimit);
}

function randLessThan(upperLimit){
	return Math.floor((Math.random() * upperLimit));
}

function rollXdY(x, y){
	let retVal = 0;
	for(let i=0; i<x; i++){
		retVal += randLessThan(y);
	}
	return retVal + x;
}

function rollXdYZTimes(x, y, z){
	let retVal = [];
	for(let i=0; i<z; i++){
		retVal.push(rollXdY(x, y));
	}
	return retVal;
}

exports.rollXdY = function(x,y){
	return rollXdY(x, y);
}

// Note: Math.ceil(Math.random() * x) is not sufficient.
// This is because there is a very very very very very very very very slim chance the result will be 0.
// In fact, the chance is exactly one in 4,503,599,627,370,496.
exports.roll1dX = function(x){
	return Math.ceil(Math.random() * x) || x;
}

exports.rollToHit = function(noirBonus = false, refinedBonus = false){
	let retVal = (noirBonus == true) ? 
}

exports.tileToLocal = function(client,message,tile){
}