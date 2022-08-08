
const funcall = require("./funcall.js");

                 //0                                                     //5                                                    //10                                                         //15                                                             //20                                                         //25                                                         //30                                                         //35                                                               //40                                                            //45                                                   //50                                                             //55                                                           //60                                                   //65                                                         //70                                                       //75                                                             //80                                                        //85                                                   //90                                                      //95                                                    //100                                                        //105                                                                                    //110                                                                                                                     //115
const codeList = ["s$//$$$$","022x$$$$","0O3w$$$$","0d4v$$$$","0R5u$$$$","0b6t$$$$","0g7s$$$$","0x8r$$$$","0E9q$$$$","0fAp$$$$","0IBo$$$$",   "00Cncccc","0qDm$$$$","0CEl$$$$",   "0XFk$$$$","0NGj$$$$","08Hi$$$$",        "0tIh$$$$", "0OJg$$$$", "05Kf$$$$","0bLe$$$$","0ePa$$$$","0SQZ$$$$",     "0cRY$$$$","0sSX$$$$", "0XTW$$$$",    "04UV$$$$","0QVU$$$$",  "0rWT$$$$","0VXS$$$$","0PYR$$$$",    "0OZQ$$$$",  "0HaP$$$$","0kbO$$$$","0kcN$$$$","0IdM$$$$",  "0oeL$$$$",   "0CfK$$$$","0AgJ$$$$",       "0AhI%%%%","0yiH%%%%","0jjG%%%%",        "0JkF%%%%","0?lE%%%%", "0?lE$$$$","0PnC$$$$","0hoB$$$$","0qpA$$$$","0iq9$$$$","0dr8$$$$","0Ms7$$$$","0Nt6$$$$","02u5$$$$",  "05v4$$$$","0sw3$$$$",        "0yx2$$$$","2K//O1pY","3J//0lqF",        "4H//K0eE","5A//dU0L","6l//E9H1","74//0CUT","89//EsUj","9A//K0W5","AU//hsV0","BH//1lSP",     "Cf//p0MW","D6//KW1m","Ea//1e8Z", "FF//1koc","GI//H9E8","Hz//0qiI","IP//0adf",    "Jz//q03R","Kh//fZ1G","LB//IoDi",     "Ma//X71X", "N4//DmTk",   "OC//cANq", "PP//1dho","Q2//Jb81",  "Rf//Sd1i","Sw//91Ji","Tc//hA1N",   "Uq//pK30","V5//l1kb","Wq//JF4M","Xt//P8KJ","Yc//sdZ0","Z6//0FHC","ak//0ep0","bb//u80I","cK//15Q3",   "dr//pea1","e9//LVcl", "f5//0hTI","gH//i9Gx","hD//CqU1","iA//560e","jv//0Lg5","k5//Cq1U","lm//K1Jl",  "mZ//Tjk1","nt//1F2o",    "o9//ipZm","ph//pojb","qV//HM1j", "r4//EY90",      "ALCHEMY ITEM - ITEMKIND","ALCHEMY ITEM - GRIST","ALCHEMY ITEM - ACTION","ALCHEMY ITEM - RARE ACTION","ALCHEMY ITEM - TRAIT","ALCHEMY ITEM - RARE TRAIT", "RANDOM WEAPON", "RANDOM ARMOR", "STRIFE CARD", "STRIFE SPECIBUS", "BOONDOLLARS", "RAINBOW GRIST"];
const nameList = ["CLOTHES", "LAPTOP",  "LOCKBOX", "BREAD",   "GUSHERS", "STEAK",   "CANDLE",  "ICE",     "BATTERY", "PIN",     "DOORSTOPPER","JPEG",    "RIBBON",  "OUIJA BOARD","CAT",     "DOG",     "SHATTERED GLASS", "PILLOW",   "SUITCASE", "SPRING",  "GLUE",    "BRICK",   "VAMPIRE TEETH","FROG",    "HARLEQUIN","CRYSTAL BALL","SMUPPET", "MICROSCOPE","DUMBBELL","FEATHER", "PROSPIT FLAG","DERSE FLAG","YOGA MAT","ROSE",    "FIREWORK","POKER CHIP","URANIUM ROD","PIPE",    "WHOOPIE CUSHION","DIAMOND", "INK",     "TABLESTUCK GUIDE","CUEBALL", "LOLLIPOP", "FAN",     "PLANT",   "COIN",    "CLOCK",   "LOCKET",  "HORN",    "HEIRLOOM","ERASER",  "YARD STICK","BRAIN",   "RELIGIOUS SYMBOL","SKULL",   "HAMMER",  "KNITTING NEEDLES","KATANA",  "RIFLE",   "FORK",    "GLOVE",   "PUPPET",  "PISTOL",  "LANCE",   "THROWING STAR","SICKLE",  "CLAWS",   "CHAINSAW", "CANE",    "DICE",    "BOW",     "BASEBALL BAT","WAND",    "SPEAR",   "STUFFED BUNNY","MAGAZINE", "FANCY SANTA","UMBRELLA", "BROOM",   "FLASHLIGHT","SAW",     "WRENCH",  "SCREWDRIVER","PLIERS",  "NAIL",    "CROWBAR", "BOOK",    "YOYO",    "STAPLER", "SHOTGUN", "PENCIL",  "PAINT BRUSH","SCYTHE",  "SCISSORS", "KNIFE",   "SHOVEL",  "ROPE",    "AXE",     "DART",    "CHAIN",   "BASKETBALL","ROCK",    "HOCKEY STICK","TRIDENT", "RAZOR",   "PAPER FAN","PLAYING CARDS", "ALCHEMY ITEM - ITEMKIND","ALCHEMY ITEM - GRIST","ALCHEMY ITEM - ACTION","ALCHEMY ITEM - RARE ACTION","ALCHEMY ITEM - TRAIT","ALCHEMY ITEM - RARE TRAIT", "RANDOM WEAPON", "RANDOM ARMOR", "STRIFE CARD", "STRIFE SPECIBUS", "BOONDOLLARS", "RAINBOW GRIST"];


const tables = {
  bedroom:[2,6,8,9,10,11,12,13,14,15,17,22,23,24,25,27,28,29,32,58,65,67,71,72,73,75,88,92,103],
  study:[2,8,9,10,11,12,13,16,17,18,20,22,25,26,27,29,37,56,57,59,63,74,85,87,91,107],
  living:[1,6,8,11,14,15,17,18,23,24,26,27,28,32,38,61,69,70,78,80,99,106],
  kitchen:[1,9,10,11,13,16,18,19,20,21,33,60,79,93,94,95,97,100],
  bathroom:[1,2,6,11,12,19,20,21,22,24,25,26,33,62,76,77,105],
  yard:[11,14,15,16,19,21,23,28,29,32,33,64,66,68,81,82,83,84,86,89,90,96,98,101,102,104],
  shed:[1,2,6,8,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,32,33,34,35,36,37,38,39,40,41,42,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107],
  weapon:[56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107],
  artifact:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55],
  simpleloot:[108,109,110,112,114,115,116,117,118,119],
  allloot:[108,109,110,111,112,113,114,115,116,117,118,119],
  rareloot:[111,113,114,115,116,117,118,119]
}
const randomChar = {
  allRandom: ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"],
  allWeapons: ["2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","x"],
  allTrinkets:["t","u","v"],
  simpleActions:["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q"],
  simpleTraits1: ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","y","z"],
  simpleTraits2: ["z","y","x","w","v","u","t","s","r","q","p","o","n","m","l","k","j","i","h","g","f","e","d","c","b","a","Z","Y","X","W","V","U","T","S","R","Q","P","O","1","0"],
  allTraits1: ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","y","z","c","d","e","f","g","h","i","j","k","l"],
  allTraits2: ["z","y","x","w","v","u","t","s","r","q","p","o","n","m","l","k","j","i","h","g","f","e","d","c","b","a","Z","Y","X","W","V","U","T","S","R","Q","P","O","1","0","N","M","L","K","J","I","H","G","F","E"],
  rareActions:["r","s","t","u","v","w","x","y","z"],
  rareTraits1:["c","d","e","f","g","h","i","j","k","l"],
  rareTraits2:["N","M","L","K","J","I","H","G","F","E"],
  aspectTraits1:["m","n","o","p","q","r","s","t","u","v","w","x"],
  aspectTraits2:["D","C","B","A","9","8","7","6","5","4","3","2"],
  gristRef:["2","3","4","5","6","7","8","9","A","B","C","D"],
  gristNameRef:["uranium","amethyst","garnet","iron","marble","chalk","shale","cobalt","ruby","caulk","tar","amber"]

}

exports.itemGen = function(table,gristList) {

  let select = tables[table][Math.floor(Math.random()*tables[table].length)];

  let defCode = codeList[select];
  let code = ``;
  for(let i=0;i<defCode.length;i++){
    if(defCode.charAt(i)=="$"){
      switch(i){
        case 0:
        code += `${randomChar.allWeapons[Math.floor(Math.random()*randomChar.allWeapons.length)]}`
        break;
        case 1:
        code += `${randomChar.allRandom[Math.floor(Math.random()*randomChar.allRandom.length)]}`
        break;
        case 2:
        code += `${randomChar.simpleTraits1[Math.floor(Math.random()*randomChar.simpleTraits1.length)]}`
        break;
        case 3:
        code += `${randomChar.simpleTraits2[Math.floor(Math.random()*randomChar.simpleTraits2.length)]}`
        break;
        default:
        code += `${randomChar.simpleActions[Math.floor(Math.random()*randomChar.simpleActions.length)]}`
        break;
      }
    }else if(defCode.charAt(i)=="%"){

      switch(i){
        case 2:
        code += `${randomChar.allTraits1[Math.floor(Math.random()*randomChar.allTraits1.length)]}`
        break;
        case 3:
        code += `${randomChar.allTraits2[Math.floor(Math.random()*randomChar.allTraits2.length)]}`
        break;
        default:
          code+=`${randomChar.allRandom[Math.floor(Math.random()*randomChar.allRandom.length)]}`;
        break;
      }
    }else if(i==1&&code.charAt(0)!="0"&&code.charAt(0)!="/"){
      code += `${randomChar.gristRef[randomChar.gristNameRef.indexOf(gristList[Math.floor(Math.random()*4)])]}`

    }else{
      code+=`${defCode.charAt(i)}`
    }
  }

return [nameList[select],code,1,1,[]];

}

exports.lootGen = function(client,level){

  tierVary    = [ 1, 3,  6,   9,  12];
  quantityMin = [ 5,25,125, 625,3125];
  quantityMax = [10,50,250,1250,6250];

let loot;
switch(level){
case 4:
  loot = tables.rareloot;
  break;
case 3:
  loot = tables.allloot;
  break;
default:
  loot = tables.simpleloot;
  break;
}

let name = nameList[loot[Math.floor(Math.random()*loot.length)]];

let quantity = 1;
let tier = 1;

let code="";
let actpos;
switch(name){
  case "ALCHEMY ITEM - ITEMKIND":
  roll = randomChar.allRandom[Math.floor(Math.random()*randomChar.allRandom.length)]
    name = `ALCHEMY ITEM - ${client.kind[client.codeCypher[0][client.captchaCode.indexOf(roll)]].toUpperCase()}`
  code = `${roll}///////`;
  break;

  case "ALCHEMY ITEM - GRIST":
      roll = randomChar.allRandom[Math.floor(Math.random()*randomChar.allRandom.length)];
      code = `/${roll}//////`;
      name = `ALCHEMY ITEM - ${client.gristTypes[client.codeCypher[1][client.captchaCode.indexOf(roll)]].toUpperCase()}`
  break;

  case "ALCHEMY ITEM - ACTION":
      actpos=Math.floor(Math.random()*4)+4;
      roll = randomChar.simpleActions[Math.floor(Math.random()*randomChar.simpleActions.length)]
      for(let i=0;i<8;i++){
        (i!=actpos?code+="/":code += roll);
      }

      name = `ALCHEMY ITEM - ${client.action[client.captchaCode.indexOf(roll)].toUpperCase()}`
  break;

  case "ALCHEMY ITEM - RARE ACTION":
      roll = randomChar.rareActions[Math.floor(Math.random()*randomChar.rareActions.length)];
      actpos=Math.floor(Math.random()*4)+4;
      for(let i=0;i<8;i++){
        (i!=actpos?code+="/":code += roll);
      }

      name = `ALCHEMY ITEM - ${client.action[client.captchaCode.indexOf(roll)].toUpperCase()}`

  break;

  case "ALCHEMY ITEM - TRAIT":
    roll1 = randomChar.simpleTraits1[Math.floor(Math.random()*randomChar.simpleTraits1.length)];
    roll2 = randomChar.simpleTraits2[Math.floor(Math.random()*randomChar.simpleTraits2.length)];

    code+="//";
    if(Math.floor(Math.random()*2)==0){
      code+=roll1
      code+="/";
      name = `ALCHEMY ITEM - ${client.traitList[client.captchaCode.indexOf(roll1)].toUpperCase()}`
    }else{
      code+="/";
      code+=roll2
      name = `ALCHEMY ITEM - ${client.traitList2[client.captchaCode.indexOf(roll2)].toUpperCase()}`
    }
    code+="////"
  break;

  case "ALCHEMY ITEM - RARE TRAIT":

  roll1 = randomChar.rareTraits1[Math.floor(Math.random()*randomChar.rareTraits1.length)];
  roll2 = randomChar.rareTraits2[Math.floor(Math.random()*randomChar.rareTraits2.length)];

    code+="//";
    if(Math.floor(Math.random()*2)==0){
      code+=roll1
      code+="/";
      name = `ALCHEMY ITEM - ${client.traitList[client.captchaCode.indexOf(roll1)].toUpperCase()}`
    }else{
      code+="/";
      code+=roll2
      name = `ALCHEMY ITEM - ${client.traitList2[client.captchaCode.indexOf(roll2)].toUpperCase()}`
    }
    code+="////"
  break;
  case "RANDOM WEAPON":

    for(let i=0;i<8;i++){
      switch(i){
        case 0:
        code += `${randomChar.allWeapons[Math.floor(Math.random()*randomChar.allWeapons.length)]}`
        break;
        case 1:
        code += `${randomChar.allRandom[Math.floor(Math.random()*randomChar.allRandom.length)]}`
        break;
        case 2:
        code += `${randomChar.simpleTraits1[Math.floor(Math.random()*randomChar.simpleTraits1.length)]}`
        break;
        case 3:
        code += `${randomChar.simpleTraits2[Math.floor(Math.random()*randomChar.simpleTraits2.length)]}`
        break;
        default:
        code += `${randomChar.simpleActions[Math.floor(Math.random()*randomChar.simpleActions.length)]}`
        break;
      }
    }

    tier = tierVary[level];

  break;
  case "RANDOM ARMOR":

  code+="s";
  for(let i=1;i<8;i++){
    switch(i){
      case 1:
      code += `${randomChar.allRandom[Math.floor(Math.random()*randomChar.allRandom.length)]}`
      break;
      case 2:
      code += `${randomChar.simpleTraits1[Math.floor(Math.random()*randomChar.simpleTraits1.length)]}`
      break;
      case 3:
      code += `${randomChar.simpleTraits2[Math.floor(Math.random()*randomChar.simpleTraits2.length)]}`
      break;
      default:
      code += `${randomChar.simpleActions[Math.floor(Math.random()*randomChar.simpleActions.length)]}`
      break;
    }
  }
  tier = tierVary[level];
  break;

  case "STRIFE CARD":
  code="////////"
  quantity = level+1;
  break;

  case "STRIFE SPECIBUS":
  code="////////"
  quantity = Math.ceil(level+1/2);
  break;

  case "BOONDOLLARS":
  code="////////"
  quantity = Math.ceil(Math.random()*(quantityMax[level]-quantityMin[level]))+quantityMin[level];
  break;

  case "RAINBOW GRIST":
  code="////////"
  quantity = Math.ceil(Math.random()*(quantityMax[level]-quantityMin[level]))+quantityMin[level];
  break;

}

  return [name,code,tier,quantity,[]];

}

exports.lootA = function(client,section){
  return ["BOSS CHEST","y!3IXhgi",1,1,[client.lootcall.lootGen(client,section+1),client.lootcall.lootGen(client,section+1),client.lootcall.lootGen(client,section+1)]];
}

exports.lootB = function(client,section){
  return ["CHEST","y03wX2Ze",1,1,[client.lootcall.lootGen(client,section),client.lootcall.lootGen(client,section)]];
}