

//generic room structure: [AREA TYPE,NUMBER OF ROOMS,[[[roomShopPool],[unused?],roomName,roomVisited,[occ],[roomInv]],[room2]]];
//default empty = [0,1,[[],[],"CLEARING",false,[underlings],[items]]];

const defaultEmpty = [0,1,[[[],[],"CLEARING",false,[],[]]]];
const defaultGate = [6,1,[[[],[],"GATE",false,[],[]]]];

const bossList = ["unicorn","kraken","hecatoncheires"];
const support = ["basilisk","basilisk","basilisk"];

//this function for rolling 2dx feels like it should be replaced by one function.
function dubs(x){
  return Math.floor(Math.random() * x) + Math.floor(Math.random() * x);
}

//Land Key(0-9):
//EMPTY, DUNGEON, CONSTRUCT, NODE, VILLAGE, HOUSE, GATE, WALL, BOSS, DENIZEN

const ASPECTS = ["TIME","SPACE","LIGHT","VOID","LIFE","DOOM","BREATH","BLOOD","HOPE","RAGE","MIND","HEART"];

const aspectItems = [
  ["WINDSOCK","0?mDbRTh",1,1,[]],
  ["PLANT","0PnCL1f3",1,1,[]],
  ["COIN","0hoBLIhT",1,1,[]],
  ["CLOCK","0qpAT1M3",1,1,[]],
  ["LOCKET","0iq9haRT",1,1,[]],
  ["HORN","0dr8R4g3",1,1,[]],
  ["HEIRLOOM","0Ms7bL0d",1,1,[]],
  ["ERASER","0Nt6Vo1d",1,1,[]],
  ["YARD STICK","02u5SpcE",1,1,[]],
  ["BRAIN IN JAR","05v4M1Nd",1,1,[]],
  ["RELIGIOUS SYMBOL","0sw3h0P3",1,1,[]],
  ["SKULL","0yx2d0Om",1,1,[]]
]

//defines a few more room constants
const defaultConstruct =[2,1,[[[],[],"LAND CONSTRUCT",false,[],[]]]];
const defaultNode =[3,1,[[[],[],"RETURN NODE",false,[],[]]]];
const defaultVillage =[4,2,[[[],[],"ROOM 1",false,[],[]],[[],[],"ROOM 2",false,[],[]]]];

//called to make a section of a land.
exports.landGen = function(client,sec,gateCoor,message,aspect,gristSet) {

  //Unused variables for generating outposts.
  let outpostCheck = false;
  let outpostChance = 3;
  let section = [];


//creates a 2d array that is an 11x11 grid of default squares for a land and dungeon.
  for(let i=0;i<11;i++){
    section.push(generateEmptyLine("CLEARING",0));
  }
  let dungeon = [];
  for(let i=0;i<11;i++){
    dungeon.push(generateEmptyLine("OUT OF BOUNDS",7));
  }

//empty is a one-dimentional array with the coordinates of every square on the 11x11
//land grid, used to determine which spaces are still open.
empty =[];
  for(let i=0;i<11;i++){
    for(let j=0;j<11;j++){
      empty.push([i,j]);
    }
  }

//generates the gate for a land, or if it's the fourth section, the denizen dungeon.
  let dunCount;
  let denizenCheck = false;
  //gate locations are pre-generated so they can be stored in the landmap.
  let pos = (gateCoor[0]*11)+(gateCoor[1]);
  //if this isn't the 4th section, then the gate is placed as normal.
  if (sec!=3){
  let gate = empty.splice(pos,1);
  section[gate[0][0]][gate[0][1]]=generateBasicTile(6, "GATE");
  } else {
    //if it is the 4th section, the denizen lair is created, and the entrance is placed in the middle.
    denizenCheck = true;
    let temp=empty.splice(60,1)[0];
    section[temp[0]][temp[1]]=generateBasicTile(1, "DENIZEN LAIR ENTRANCE");
    dungeon = dungeonGen(client,temp,sec,dungeon,message)[0];
  }
 //sections 1 and 2 have 6 dungeons, section 3 has 3 dungeons, and section 4 has only 1 denizen dungeon.
  if(sec>1){
    dunCount = 1;
  } else {
    dunCount = 2;
  }

//bedpos tells the game to generate the dream bed in the 4th section of a player's land,
//in one of the three areas.
  let bedpos = 0;
 if (sec==3){
  bedpos = Math.ceil(Math.random()*3);
 }
 //this is the big loop that runs the land gen code 3 times to spread out stuff.
 //it deincriments because j is used as an index multiplier, so the lands generate
 //bottom to top.
  for(j=3;j>0;j--){
    //since there's always a gate or denizen lair, the 11x11 grid has 120 empty spaces,
    //which means each third will have 40 in it. This makes it so that temp is never
    //an invalid value in empty.
    let length = 40;
  //Creates Dungeons
  for(let i=0;i<dunCount;i++){
    if(!denizenCheck){
  let temp=empty.splice(Math.floor(Math.random()*(length-1))+(40*(j-1)),1)[0];
  length--;
  section[temp[0]][temp[1]]=generateBasicTile(1, "DUNGEON ENTRANCE");
  dungeon = dungeonGen(client,temp,sec,dungeon,message)[0];
  }
  }

  //Creates Dreambed if needed
  if(bedpos==j){
    let temp=empty.splice(Math.floor(Math.random()*(length-1))+(40*(j-1)),1);
    length--;
    section[temp[0][0]][temp[0][1]]=generateBasicTile(2, "DREAM BED");
  }
  //Creates a Village (9 per section)
  for(let i=0;i<3;i++){
    let temp=empty.splice(Math.floor(Math.random()*(length-1))+(40*(j-1)),1);
    length--;
    section[temp[0][0]][temp[0][1]]=[4,2,[[client.funcall.preItem(client,1,7,[],gristSet),[],"ROOM 1",false,client.landcall.consortSpawn(client,message,[`s${sec+1}`,temp[0][0],temp[0][1],0],["shopkeep"],1),[]],[[],[],"ROOM 2",false,[],[]]]];

  }
  //Creates the Land Constructs (9 per section)
  for(let i=0;i<3;i++){
    let temp=empty.splice(Math.floor(Math.random()*(length-1))+(40*(j-1)),1);
    length--;
	let roomContents = (Math.floor(Math.random()*4)==0) ? [aspectItems[client.aspects.indexOf(aspect)]] : [];
    section[temp[0][0]][temp[0][1]]=[2,1,[[[],[],"LAND CONSTRUCT",false,[],roomContents]]];
  }
  //Creates the return nodes (12 per section)
  for(let i=0;i<4;i++){
    let temp=empty.splice(Math.floor(Math.random()*(length-1))+(40*(j-1)),1);
    length--;
    section[temp[0][0]][temp[0][1]]=generateBasicTile(3, "RETURN NODE");
  }
  //Creates free loot (9 per section)
  for(let i=0;i<3;i++){
    let temp=empty.splice(Math.floor(Math.random()*(length-1))+(40*(j-1)),1);
    length--;
    section[temp[0][0]][temp[0][1]]=[0,1,[[[],[],"CLEARING",false,[],[client.lootcall.lootB(client, sec, dubs(8))]]]];
  }
}
  //Moon outposts appear on only the first section of a land.
  if(sec==0){
    for(let i=0;i<2;i++){
      let moon=[["PROSPIT","DERSE"],["pc","dc"]];
      let temp=empty.splice(Math.floor(Math.random()*empty.length));
      let transCount = client.landMap.get(message.guild.id+"medium","transCount");
      let transList = client.landMap.get(message.guild.id+"medium","transList");
      let transCode = "0000";
      let transCode1 = "0000";
      let moonCode = "0000";
      //block to generate the ID of the transportalizers.
      while(transList.includes(transCode)||transCode=="0000"){
        transCode = "";
        for(k=0;k<4;k++){
          transCode+= client.captchaCode[Math.floor(Math.random()*38)]
        }
      }

      transList.push(transCode);
      transCount++;

      while(transList.includes(transCode1)||transCode1=="0000"){
        transCode1 = "";
        for(k=0;k<4;k++){
          transCode1+= client.captchaCode[Math.floor(Math.random()*38)]
        }
      }

      transList.push(transCode1);
      transCount++;

      let transLocal = client.landMap.get(message.guild.id+"medium","transLocal");
      //transSet goes on the land, transSet1 is added to the respective moon.
      var transSet = {
        local:["s1",temp[0][0],temp[0][1],0,message.guild.id.concat(message.author.id)],
        target:`${message.guild.id}${transCode1}`
      }

      var transSet1 = {
        local:[moon[1][i],transLocal[0],transLocal[1],0,message.guild.id+"medium"],
        target:`${message.guild.id}${transCode}`
      }

      let castle = client.landMap.get(message.guild.id+"medium",moon[1][i]);

      castle[transLocal[0]][transLocal[1]][2][0][5].push([`${message.author.username}`,`@/jG${transCode1}`,1,1,[],"https://cdn.discordapp.com/attachments/808757312520585227/814690784209010738/TRANSPORTALIZER.png"])

      section[temp[0][0]][temp[0][1]]=[11,1,[[[],[],`${moon[0][i]} OUTPOST`,false,[],[[`${moon[0][i]} TRANSPORTALIZER`,`@/jG${transCode}`,1,1,[],"https://cdn.discordapp.com/attachments/808757312520585227/814690784209010738/TRANSPORTALIZER.png"]]]]];
      client.transMap.set(`${message.guild.id}${transCode}`,transSet);
      client.transMap.set(`${message.guild.id}${transCode1}`,transSet1);
      client.landMap.set(message.guild.id+"medium",transList,"transList");
      client.landMap.set(message.guild.id+"medium",transCount,"transCount");
      client.landMap.set(message.guild.id+"medium",castle,moon[1][i]);

    }
  }
//all areas and dungeons of the section have been completed.
return [section,dungeon];


}

function dungeonGenA(client,roomCoor,sec,dungeon,message){
  //because section 1 and 2 dungeons only make 1 or 2 paths, respectively, the directions they
  //split off to has to be selected. If the exit is in a location where a direction
  //can't be used (aka too close to the edge of the map), the option is spliced from the array.
	
  let direction=["x+","x-","y+","y-"];
    //roomCoor[0]+,roomCoor[0]-,roomCoor[1]+,roomCoor[1]-
    if(roomCoor[0]>5){
      removed = direction.splice(direction.indexOf("x+"),1);
    } else if(roomCoor[0]<5){
      removed = direction.splice(direction.indexOf("x-"),1);
    }
    if(roomCoor[1]>5){
      removed = direction.splice(direction.indexOf("y+"),1);
    } else if(roomCoor[1]<5){
      removed = direction.splice(direction.indexOf("y-"),1);
    }
//s is used as a variable for a more usable sec, so section 1 is s = 1, etc.
//since only sections 1 and 2 run this part, s is either 1 or 2.
let s = sec+1;
//b counts for when it's time to spawn a dungeon's boss.
let b = 0;
let bossTime = false;
let occupied = false;
  for(let o=0;o<s;o++) {
    //randomly picks a direction from the remaining valid directions.
    switch (direction[Math.floor((Math.random() * direction.length))]) {
      case "x+":
        removed = direction.splice(direction.indexOf("x+"),1);
        for(let k=0;k<5;k++){
            b++;
          //checks if the room it's about to generate over is already a room or boss.
          if(dungeon[roomCoor[0]+k][roomCoor[1]][0]==1 || dungeon[roomCoor[0]+k][roomCoor[1]][0] == 8)
            occupied = true;
          //if b is at it's max value, generates the boss room and it's monsters.
          if ((b==5&&sec==0)||(b==10&&sec==1))
            bossTime = true;
          if(!occupied&&!bossTime){
            //if it's not a boss, makes a normal room with a chance of loot.
            dungeon[roomCoor[0]+k] [roomCoor[1]] = dungeonRoomGen(client,sec);
          } else if (bossTime){
            while(occupied){
              k--;
              if(dungeon[roomCoor[0]+k][roomCoor[1]][0]!=1 && dungeon[roomCoor[0]+k][roomCoor[1]][0] != 8){
                occupied = false;
              }
            }
            dungeon[roomCoor[0]+k] [roomCoor[1]] =[8,1,[[[],[],"BOSS ROOM",false,[
              client.strifecall.dungeonSpawn(client, sec, [roomCoor[0]+k,roomCoor[1]], bossList[sec], message),
              client.strifecall.dungeonSpawn(client, sec, [roomCoor[0]+k,roomCoor[1]], support[sec], message),
              client.strifecall.dungeonSpawn(client, sec, [roomCoor[0]+k,roomCoor[1]], support[sec], message)
            ],[client.lootcall.lootA(client, sec, dubs(8))]]]];
            k=5;
          }
      occupied = false;
      }
      break;
      case "x-":
      removed = direction.splice(direction.indexOf("x-"),1);
      for(let k=0;k<5;k++){
          b++;
        if(dungeon[roomCoor[0]-k][roomCoor[1]][0]==1 || dungeon[roomCoor[0]-k][roomCoor[1]][0] == 8)
          occupied = true;
        if ((b==5&&sec==0)||(b==10&&sec==1))
          bossTime = true;
        if(!occupied&&!bossTime){
          dungeon[roomCoor[0]-k] [roomCoor[1]] = dungeonRoomGen(client,sec);
        } else if (bossTime){
          while(occupied){
            k--;
            if(dungeon[roomCoor[0]-k][roomCoor[1]][0]!=1 && dungeon[roomCoor[0]-k][roomCoor[1]][0] != 8)
              occupied = false;
          }
          dungeon[roomCoor[0]-k] [roomCoor[1]] =[8,1,[[[],[],"BOSS ROOM",false,[
            client.strifecall.dungeonSpawn(client, sec, [roomCoor[0]-k,roomCoor[1]], bossList[sec], message),
            client.strifecall.dungeonSpawn(client, sec, [roomCoor[0]-k,roomCoor[1]], support[sec], message),
            client.strifecall.dungeonSpawn(client, sec, [roomCoor[0]-k,roomCoor[1]], support[sec], message)
          ],[client.lootcall.lootA(client, sec, dubs(8))]]]];
          k=5;
        }
      occupied = false;
      }
      break;
      case "y+":
      removed = direction.splice(direction.indexOf("y+"),1);
      for(let k=0;k<5;k++){
          b++;
        if(dungeon[roomCoor[0]][roomCoor[1]+k][0]==1 || dungeon[roomCoor[0]][roomCoor[1]+k][0] == 8)
          occupied = true;
        if ((b==5&&sec==0)||(b==10&&sec==1))
          bossTime = true;
        if(!occupied&&!bossTime){
          dungeon[roomCoor[0]] [roomCoor[1]+k] = dungeonRoomGen(client,sec);
        } else if (bossTime){
          while(occupied){
            k--;
            if(dungeon[roomCoor[0]][roomCoor[1]+k][0]!=1 && dungeon[roomCoor[0]][roomCoor[1]+k][0] != 8)
              occupied = false;
          }
          dungeon[roomCoor[0]] [roomCoor[1]+k] =[8,1,[[[],[],"BOSS ROOM",false,[
            client.strifecall.dungeonSpawn(client, sec, [roomCoor[0],roomCoor[1]+k], bossList[sec], message),
            client.strifecall.dungeonSpawn(client, sec, [roomCoor[0],roomCoor[1]+k], support[sec], message),
            client.strifecall.dungeonSpawn(client, sec, [roomCoor[0],roomCoor[1]+k], support[sec], message)
          ],[client.lootcall.lootA(client, sec, dubs(8))]]]];
          k=5;
        }
      occupied = false;
      }
      break;
      case "y-":
      removed = direction.splice(direction.indexOf("y-"),1);
      for(let k=0;k<5;k++){
          b++;
        if(dungeon[roomCoor[0]][roomCoor[1]-k][0]==1 || dungeon[roomCoor[0]][roomCoor[1]-k][0] == 8)
          occupied = true;
        if ((b==5&&sec==0)||(b==10&&sec==1))
          bossTime = true;
        if(!occupied&&!bossTime){
          dungeon[roomCoor[0]] [roomCoor[1]-k] = dungeonRoomGen(client,sec);
        } else if (bossTime){
          while(occupied){
            k--;
            if(dungeon[roomCoor[0]][roomCoor[1]-k][0]!=1 && dungeon[roomCoor[0]][roomCoor[1]-k][0] != 8)
              occupied = false;
          }
          dungeon[roomCoor[0]] [roomCoor[1]-k] =[8,1,[[[],[],"BOSS ROOM",false,[
            client.strifecall.dungeonSpawn(client, sec, [roomCoor[0],roomCoor[1]-k], bossList[sec], message),
            client.strifecall.dungeonSpawn(client, sec, [roomCoor[0],roomCoor[1]-k], support[sec], message),
            client.strifecall.dungeonSpawn(client, sec, [roomCoor[0],roomCoor[1]-k], support[sec], message)
          ],[client.lootcall.lootA(client, sec, dubs(8))]]]];
          k=5;
        }
      occupied = false;
      }
      break;
    }
  }
  
  return dungeon;
}

function dungeonGenB(client,roomCoor,sec,dungeon,message){
  //this is all for the section 3 dungeon, which generates in a cross pattern.
  //it checks every space in the cross, and as long as it isn't a boss room or enterance, it
  //makes a dungeon room there.
  for(k=0;k<11;k++){
    if(dungeon[roomCoor[0]] [k] [0] != 1 && dungeon[roomCoor[0]] [k] [0] != 8){
      dungeon[roomCoor[0]] [k] = dungeonRoomGen(client,sec);
    }
  }

  for(k=0;k<11;k++){
    if(dungeon[k] [roomCoor[1]] [0] != 1 && dungeon[k] [roomCoor[1]] [0] != 8){
      dungeon[k] [roomCoor[1]] = dungeonRoomGen(client,sec);
    }
  }
  let bosscheck = false;
  //flips a coin to choose which path to make the boss room in.
  switch(Math.floor((Math.random() * 1))){
    case 0:
    while(!bosscheck){
      //randomly picks a room along a path and places the boss in an empty room.
      let random = Math.floor((Math.random() * 11))
      if(dungeon[roomCoor[0]][random][0]==10){
        dungeon[roomCoor[0]] [random] =[8,1,[[[],[],"BOSS ROOM",false,[
        client.strifecall.dungeonSpawn(client, sec, [roomCoor[0],random], bossList[sec], message),
        client.strifecall.dungeonSpawn(client, sec, [roomCoor[0],random], support[sec], message),
        client.strifecall.dungeonSpawn(client, sec, [roomCoor[0],random], support[sec], message)],[client.lootcall.lootA(client, sec, dubs(8))]]]];
        bosscheck=true;
      }
    }
    break;
    case 1:
      while(!bosscheck){
      let random = Math.floor((Math.random() * 11))
      if(dungeon[random][roomCoor[1]][0]==10){
        dungeon[roomCoor[0]] [random] =[8,1,[[[],[],"BOSS ROOM",false,[
        client.strifecall.dungeonSpawn(client, sec, [random,roomCoor[1]], bossList[sec], message),
        client.strifecall.dungeonSpawn(client, sec, [random,roomCoor[1]], support[sec], message),
        client.strifecall.dungeonSpawn(client, sec, [random,roomCoor[1]], support[sec], message)],[client.lootcall.lootA(client, sec, dubs(8))]]]];
        bosscheck=true;
      }
    }
    break;
  }
	return dungeon;
}

function dungeonGenC(client,roomCoor,sec,dungeon,message){
	
//this is the section 4 dungeon, or the denizen dungeon.
let emptyTiles=[];
let genDirection =["n","s","e","w"];
let pathStart = [[roomCoor[0],roomCoor[1]],[roomCoor[0],roomCoor[1]],[roomCoor[0],roomCoor[1]],[roomCoor[0],roomCoor[1]]];
let g = 0;
let denizen = false;

//pathStart and genDirection work together to make sure there's at least one branch
//in each direction for the denizen dungeon.
while(pathStart.length != 0){
let curx = pathStart[0][0];
let cury = pathStart[0][1];
let deleted = pathStart.splice(0,1);
let hitWall = false;
let curDirection;
//after the 4 main directions have been made, the direction is randomly selected.
if(g<4){
curDirection = genDirection[g];
g++;
} else {
curDirection = genDirection[Math.floor((Math.random()*4))];
}
while(!hitWall){
  switch (curDirection){
    case "n":
    //this generates 2 rooms before checking direction agin.
    for(let m=0;m<2 && !hitWall;m++){
      if((--cury)<0){
        hitWall=true;
        //whenever a branching path hits a wall, there's a 10% chance the denizen spawns there.
        if(Math.floor(Math.random()*10)==0 && denizen == false){
          dungeon[curx][0] = [9,1,[[[],[],"DENIZEN CHAMBER",false,[
            client.strifecall.dungeonSpawn(client, sec, [curx,0], 'denizen', message),
          ],[client.lootcall.lootA(client, sec, dubs(8))]]]];
          denizen=true;
        }
        //if a wall isn't hit, the basic tile is made.
      } else {
        if(dungeon[curx][cury][0] == 7){
        dungeon[curx][cury] = dungeonRoomGen(client,sec);
        emptyTiles.push([curx,cury]);
      }
    }
  } if (Math.floor(Math.random()*2)==1 && g<4 &&!hitWall){
    //50% of the time, the tile is saved as a future branching point.
    pathStart.push([curx,cury]);
  }
   deleted = genDirection.splice(1,1);
   //the opposite direction is then removed from genDirection, to prevent backtracking.
    break;
    case "s":
    for(m=0;m<2 && !hitWall;m++){
      if((++cury)>10){
        hitWall=true;
        if(Math.floor(Math.random()*10)==0 && denizen == false){
          dungeon[curx][10] = [9,1,[[[],[],"DENIZEN CHAMBER",false,[
            client.strifecall.dungeonSpawn(client, sec, [curx,10], 'denizen', message),
          ],[client.lootcall.lootA(client, sec, dubs(8))]]]];
          denizen=true;
        }
      } else {
        if(dungeon[curx][cury][0] == 7){
        dungeon[curx][cury] = dungeonRoomGen(client,sec);
        emptyTiles.push([curx,cury]);
      }
    }
  } if (Math.floor(Math.random()*2)==1 && g<4 && !hitWall){
    pathStart.push([curx,cury]);
  }
deleted = genDirection.splice(0,1);
    break;
    case "e":
    for(m=0;m<2 && !hitWall;m++){
      if((++curx)>10){
        hitWall=true;
        if(Math.floor(Math.random()*10)==0 && denizen == false){
          dungeon[10][cury] = [9,1,[[[],[],"DENIZEN CHAMBER",false,[
            client.strifecall.dungeonSpawn(client, sec, [10,cury], 'denizen', message),
          ],[client.lootcall.lootA(client, sec, dubs(8))]]]];
          denizen=true;
        }
      } else {
        if(dungeon[curx][cury][0] == 7){
        dungeon[curx][cury] = dungeonRoomGen(client,sec);
        emptyTiles.push([curx,cury]);
      }
    }
  }if (Math.floor(Math.random()*2)==1 && g<4 && !hitWall){
      pathStart.push([curx,cury]);
    }
    deleted = genDirection.splice(3,1);
    break;
    case "w":
    for(m=0;m<2 && !hitWall;m++){
      if((--curx)<0){
        hitWall=true;
        if(Math.floor(Math.random()*10)==0 && denizen == false){
          dungeon[0][cury] = [9,1,[[[],[],"DENIZEN CHAMBER",false,[
            client.strifecall.dungeonSpawn(client, sec, [0,cury], 'denizen', message),
          ],[client.lootcall.lootA(client, sec, dubs(8))]]]];
          denizen=true;
        }
      } else {
        if(dungeon[curx][cury][0] == 7){
        dungeon[curx][cury] = dungeonRoomGen(client,sec);
        emptyTiles.push([curx,cury]);
      }
    }
  }if (Math.floor(Math.random()*2)==1 && g<4 && !hitWall){
      pathStart.push([curx,cury]);
    }
    deleted = genDirection.splice(2,1);
    break;
  }
//a new direction is then picked from the remaining 3 and genDirection is reset.
curDirection = genDirection[Math.floor((Math.random()*genDirection.length))];
genDirection =["n","s","e","w"];
//this iterates until the branch hits a wall.
}
}
//once all paths have been generated,if the denizen has yet to been generated, it
//will be placed in a random empty room.
if (denizen == false){
  roomToFill = emptyTiles.splice(Math.floor(Math.random()*(emptyTiles.length-1)),1);
  dungeon [roomToFill[0][0]][roomToFill[0][1]] = [9,1,[[[],[],"DENIZEN CHAMBER",false,[
    client.strifecall.dungeonSpawn(client, sec, [roomToFill[0][0],roomToFill[0][1]], 'denizen', message),],[client.lootcall.lootA(client, sec, dubs(8))]]]];
}
//four denizen minions are also placed around the map, to eventually be bosses.
for (d=0;d<4;d++){
  roomToFill = emptyTiles.splice(Math.floor(Math.random()*(emptyTiles.length-1)),1);
  dungeon [roomToFill[0][0]][roomToFill[0][1]] = [8,1,[[[],[],"DENIZEN MINION",false,[
    client.strifecall.dungeonSpawn(client, sec, [roomToFill[0][0],roomToFill[0][1]], 'basilisk', message),],[client.lootcall.lootA(client, sec, dubs(8))]]]];
}

	return dungeon;
}

function dungeonGen(client,roomCoor,sec,dungeon,message) {
  //lists current bosses and their names in the order they appear.
  let bossList = ["unicorn","kraken","hecatoncheires"];
  let support = ["basilisk","basilisk","basilisk"];
  //every dungeon has an exit where the entrance is, so we start with that.
  dungeon[roomCoor[0]][roomCoor[1]]=generateBasicTile(1, "DUNGEON EXIT");

  if(sec==0||sec==1){
	  dungeon = dungeonGenA(client,roomCoor,sec,dungeon,message);
} else if(sec==2)
{
	dungeon = dungeonGenB(client,roomCoor,sec,dungeon,message);
/*
[/][/][/]
[][][/]
[x][/][/]
*/
} else if(sec==3){
	dungeon = dungeonGenC(client,roomCoor,sec,dungeon,message);
} else{
	let whatJustEvenHappened = 1 / 0;
}
  return [dungeon];

}

function dungeonRoomGen(client,sec) {
  //25% of the time, there is loot in a dungeon room. That's what this is for.
  if(Math.floor((Math.random() * 4)) == 3)
    return [10,1,[[[],[],"DUNGEON ROOM",false,[],[client.lootcall.lootB(client, sec, dubs(8))]]]];
  else
    return generateBasicTile(10, "DUNGEON ROOM");
}
//==========================================================================================
exports.battlefieldGen = function(client,message){
  //though untested, this should in theory make a blank checkerboard pattern for the battlefield.
let battleMap = [];
let battleLine = [];
for(let u=0;u<11;u++){
  for (let m=0;m<11;m++){
    battleLine.push(generateBasicTile(((u + m) % 2 == 0) ? 0 : 7, "CLEARING"));
  }
  battleMap.push(battleLine);
  battleLine = [];
}
return battleMap;
}

exports.moonGen = function(client,castleLocal,towerLocal,message){
	
	const PROSP = 0;
	const DERSE = 1;
	const PLANETS = [PROSP, DERSE];

	const PROSP_MOON = 2;
	const DERSE_MOON = 3;
	const MOONS = [PROSP_MOON, DERSE_MOON];

	const PROSP_MAIN = [PROSP, PROSP_MOON];
	const DERSE_MAIN = [DERSE, DERSE_MOON];
	
	const ALL_MAIN = [PROSP, DERSE, PROSP_MOON, DERSE_MOON];

	const DUNGEON_P1 = 4;
	const DUNGEON_P2 = 5;
	const DUNGEON_P3 = 6;
	const PROSP_DUNGEONS = [DUNGEON_P1, DUNGEON_P2, DUNGEON_P3];
	
	const DUNGEON_D1 = 7;
	const DUNGEON_D2 = 8;
	const DUNGEON_D3 = 9;
	const DERSE_DUNGEONS = [DUNGEON_D1, DUNGEON_D2, DUNGEON_D3];

	const SLAB_DUNGEONS = [DUNGEON_P3, DUNGEON_D3];
	const ALL_DUNGEONS = [DUNGEON_P1, DUNGEON_P2, DUNGEON_P3, DUNGEON_D1, DUNGEON_D2, DUNGEON_D3];
	const ALL_DUNGEONS_BY_MOON = [PROSP_DUNGEONS, DERSE_DUNGEONS];
	
	const PROSP_CASTLE = 10;
	const PROSP_DERSE = 11;
	const CASTLES = [PROSP_CASTLE, DERSE_CASTLE];

  //generates everything needed for both moons.
  let section = [[],[],[],[],[],[],[],[],[],[],[],[]];
  
  
  for(let i=0;i<11;i++){
    for(let j=0; j<PROSP_MAIN.length; j++)
		section[PROSP_MAIN[j]].push(generateEmptyLine("STREET",10));
	
    for(let j=0; j<DERSE_MAIN.length; j++)
		section[DERSE_MAIN[j]].push(generateEmptyLine("ALLEYWAY",10));
	
	for(let j=0; j<CASTLES.length; j++)
        section[CASTLES[j]].push(generateEmptyLine("OUT OF BOUNDS",7));
  }

  // Why four?
  /*
  let dungeon = [[],[],[],[]];
  for(let i=0;i<11;i++){
    for(let j=0;j<dungeon.length;j++){
      dungeon[j].push(generateEmptyLine("OUT OF BOUNDS",7));
    }
  }
  */

  // The set of coordinates that pair up to make something that isn't a street, alleyway, or corridor.
  const select = [0,1,3,4,6,7,9,10];
  
  let empty = [];
  let empty2 = [];
  let empty3 = [];
  let empty4 = [];
  let empty5 = [];

  for(i=0;i<select.length;i++){
    for(j=0;j<select.length;j++){
      empty.push([select[i],select[j]]);
      empty2.push([select[i],select[j]]);
      empty3.push([select[i],select[j]]);
      empty4.push([select[i],select[j]]);
      empty5.push([select[i],select[j]]);
    }
  }

  for(let i=0; i<ALL_MAIN.length; i++){
    section[ALL_MAIN[i]][5][5]=generateBasicTile(13, "CHAIN");
  }

  section[PROSP_MOON][towerLocal[0]][towerLocal[1]]=generateBasicTile(11, "PROSPIT TOWER BASE", true);
  section[DERSE_MOON][towerLocal[0]][towerLocal[1]]=generateBasicTile(11, "DERSE TOWER BASE", true);
  empty.splice(select.indexOf(towerLocal[0])*8+select.indexOf(towerLocal[1]), 1);

  section[PROSP][castleLocal[0]][castleLocal[1]]=generateBasicTile(12, "PROSPIT CASTLE", true);
  section[DERSE][castleLocal[0]][castleLocal[1]]=generateBasicTile(12, "DERSE CASTLE", true);
  empty2.splice(select.indexOf(castleLocal[0])*8+select.indexOf(castleLocal[1]),1);
  
  let transLocal=[5,4];
  //castle generation
  for(let i=0; i<CASTLES.length; i++)
  {
	castle[i][5][5]=generateBasicTile(12, "CASTLE ENTRANCE", true);
	castle[i][4][5]=generateBasicTile(10, "HALL", true);
	castle[i][3][5]=generateBasicTile(8, "THRONE ROOM", true);
	castle[i][5][4]=generateBasicTile(19, "TRANSPORTALIZER HUB", true);
  }

  //end castle generation
  section.push(transLocal); // Not sure if/how/why this is necessary. But it might be? I guess?


//
//Prospit / Derse Main
//

// One of each of these
{
  let temp=empty2.splice(Math.floor(Math.random()*(empty2.length-1)),1)[0];
  section[PROSP][temp[0]][temp[1]]=generateBasicTile(15, "PRISON");
  section[DERSE][temp[0]][temp[1]]=generateBasicTile(15, "PRISON");
  
  temp=empty2.splice(Math.floor(Math.random()*(empty2.length-1)),1)[0];
  section[PROSP][temp[0]][temp[1]]=generateBasicTile(16, "COURT");
  section[DERSE][temp[0]][temp[1]]=generateBasicTile(16, "COURT");
  
  temp=empty2.splice(Math.floor(Math.random()*(empty2.length-1)),1)[0];
  section[PROSP][temp[0]][temp[1]]=generateBasicTile(17, "HOSPITAL");
  section[DERSE][temp[0]][temp[1]]=generateBasicTile(17, "HOSPITAL");

  temp=empty2.splice(Math.floor(Math.random()*(empty2.length-1)),1)[0];
  section[PROSP][temp[0]][temp[1]]=generateBasicTile(18, "BANK");
  section[DERSE][temp[0]][temp[1]]=generateBasicTile(18, "BANK");

  temp=empty2.splice(Math.floor(Math.random()*(empty2.length-1)),1)[0];
  section[PROSP][temp[0]][temp[1]]=generateBasicTile(21, "GUILD HALL");
  section[DERSE][temp[0]][temp[1]]=generateBasicTile(21, "GUILD HALL");

  temp=empty2.splice(Math.floor(Math.random()*(empty2.length-1)),1)[0];
  section[PROSP][temp[0]][temp[1]]=generateBasicTile(22, "THEATRE");
  section[DERSE][temp[0]][temp[1]]=generateBasicTile(22, "THEATRE");

  temp=empty2.splice(Math.floor(Math.random()*(empty2.length-1)),1)[0];
  section[PROSP][temp[0]][temp[1]]=generateBasicTile(23, "BINGO HALL");
  section[DERSE][temp[0]][temp[1]]=generateBasicTile(23, "CASINO");

  temp=empty2.splice(Math.floor(Math.random()*(empty2.length-1)),1)[0];
  section[PROSP][temp[0]][temp[1]]=generateBasicTile(24, "MUSEUM");
  section[DERSE][temp[0]][temp[1]]=generateBasicTile(24, "MUSEUM");

  temp=empty2.splice(Math.floor(Math.random()*(empty2.length-1)),1)[0];
  section[PROSP][temp[0]][temp[1]]=generateBasicTile(25, "LIBRARY");
  section[DERSE][temp[0]][temp[1]]=generateBasicTile(25, "LIBRARY");
}

// Two of each of these
for(i=0;i<2;i++){
  let temp=empty2.splice(Math.floor(Math.random()*(empty2.length-1)),1)[0];
  section[PROSP][temp[0]][temp[1]]=generateBasicTile(19, "POST OFFICE");
  section[DERSE][temp[0]][temp[1]]=generateBasicTile(19, "POST OFFICE");

  temp=empty2.splice(Math.floor(Math.random()*(empty2.length-1)),1)[0];
  section[PROSP][temp[0]][temp[1]]=generateBasicTile(14, "POLICE STATION");
  section[DERSE][temp[0]][temp[1]]=generateBasicTile(14, "POLICE STATION");
}

// Four of this
for(i=0;i<4;i++){
  let temp=empty2.splice(Math.floor(Math.random()*(empty2.length-1)),1)[0];

  section[PROSP][temp[0]][temp[1]]=generateBasicTile(20, "MILITARY OUTPOST");
  section[DERSE][temp[0]][temp[1]]=generateBasicTile(20, "MILITARY OUTPOST");
}

// Five of each of these
for(i=0;i<5;i++){
  let temp=empty2.splice(Math.floor(Math.random()*(empty2.length-1)),1)[0];
  section[PROSP][temp[0]][temp[1]]=generateBasicTile(26, "RESTAURANT");
  section[DERSE][temp[0]][temp[1]]=generateBasicTile(26, "RESTAURANT");

  temp=empty2.splice(Math.floor(Math.random()*(empty2.length-1)),1)[0];
  section[PROSP][temp[0]][temp[1]]=[27,1,[[[],[["CAPTCHALOGUE CARD","11111111",1,4,[]]],"GENERAL STORE",false,[],[]]]];
  section[DERSE][temp[0]][temp[1]]=[27,1,[[[],[["CAPTCHALOGUE CARD","11111111",1,4,[]]],"GENERAL STORE",false,[],[]]]];

  temp=empty2.splice(Math.floor(Math.random()*(empty2.length-1)),1)[0];
  section[PROSP][temp[0]][temp[1]]=generateBasicTile(28, "CANDY SHOP");
  section[DERSE][temp[0]][temp[1]]=generateBasicTile(29, "BUTCHER");

  temp=empty2.splice(Math.floor(Math.random()*(empty2.length-1)),1)[0];
  section[PROSP][temp[0]][temp[1]]=generateBasicTile(31, "TAILOR");
  section[DERSE][temp[0]][temp[1]]=generateBasicTile(30, "ARMORY");

  temp=empty2.splice(Math.floor(Math.random()*(empty2.length-1)),1)[0];
  section[PROSP][temp[0]][temp[1]]=generateBasicTile(32, "JEWELER");
  section[DERSE][temp[0]][temp[1]]=generateBasicTile(32, "JEWELER");
}

// Whatever's left
while(empty2.length>0){
  let temp=empty2.splice(Math.floor(Math.random()*(empty2.length-1)),1)[0];

  let ran = Math.floor(Math.random()*6);

  if(ran == 0){
    section[PROSP][temp[0]][temp[1]]=generateBasicTile(0, "PUBLIC PARK");
    section[DERSE][temp[0]][temp[1]]=generateBasicTile(0, "ABANDONED BUILDING");
  } else {
  section[PROSP][temp[0]][temp[1]]=generateBasicTile(45, "APPARTMENT");
  section[DERSE][temp[0]][temp[1]]=generateBasicTile(45, "SLUMS");
}
}


//
// Prospit/Derse moons
//
for(i=0;i<2;i++){
  let temp=empty.splice(Math.floor(Math.random()*(empty.length-1)),1)[0];

  section[PROSP_MOON][temp[0]][temp[1]]=generateBasicTile(14, "POLICE STATION");
  section[DERSE_MOON][temp[0]][temp[1]]=generateBasicTile(14, "POLICE STATION");
}
for(i=0;i<1;i++){
  let temp=empty.splice(Math.floor(Math.random()*(empty.length-1)),1)[0];

  section[PROSP_MOON][temp[0]][temp[1]]=generateBasicTile(17, "HOSPITAL");
  section[DERSE_MOON][temp[0]][temp[1]]=generateBasicTile(17, "HOSPITAL");
}
for(i=0;i<2;i++){
  let temp=empty.splice(Math.floor(Math.random()*(empty.length-1)),1)[0];

  section[PROSP_MOON][temp[0]][temp[1]]=generateBasicTile(19, "POST OFFICE");
  section[DERSE_MOON][temp[0]][temp[1]]=generateBasicTile(19, "POST OFFICE");
}
for(i=0;i<4;i++){
  let tempRan = Math.floor(Math.random()*(empty.length-1));
  let temp=empty.splice(tempRan,1)[0];

  section[PROSP_MOON][temp[0]][temp[1]]=generateBasicTile(1, "DUNGEON ENTRANCE");
  section[DERSE_MOON][temp[0]][temp[1]]=generateBasicTile(1, "DUNGEON ENTRANCE");
  section[DUNGEON_P1][temp[0]][temp[1]]=generateBasicTile(1, "DUNGEON EXIT");
  section[DUNGEON_D1][temp[0]][temp[1]]=generateBasicTile(1, "DUNGEON EXIT");

  empty3.splice(empty3.findIndex(tile => tile[0] == temp[0] && tile[1] == temp[1]),1)
}
for(i=0;i<5;i++){
  let temp=empty.splice(Math.floor(Math.random()*(empty.length-1)),1)[0];

  section[PROSP_MOON][temp[0]][temp[1]]=generateBasicTile(26, "RESTAURANT");
  section[DERSE_MOON][temp[0]][temp[1]]=generateBasicTile(26, "RESTAURANT");
}
for(i=0;i<5;i++){
  let temp=empty.splice(Math.floor(Math.random()*(empty.length-1)),1)[0];

  section[PROSP_MOON][temp[0]][temp[1]]=generateBasicTile(27, "GENERAL STORE");
  section[DERSE_MOON][temp[0]][temp[1]]=generateBasicTile(27, "GENERAL STORE");
}
for(i=0;i<5;i++){
  let temp=empty.splice(Math.floor(Math.random()*(empty.length-1)),1)[0];

  section[PROSP_MOON][temp[0]][temp[1]]=generateBasicTile(32, "JEWELER");
  section[DERSE_MOON][temp[0]][temp[1]]=generateBasicTile(32, "JEWELER");
}

for(let i=0; i<ASPECTS.length; i++){
  let temp=empty.splice(Math.floor(Math.random()*(empty.length-1)),1)[0];
  for(let j=0; j<MOONS.length; j++){
    section[MOONS[j]][temp[0]][temp[1]]=generateBasicTile(33 + i, `${ASPECTS[i]} MONUMENT`);
  }
}

while(empty.length>0){
  let temp=empty.splice(Math.floor(Math.random()*(empty.length-1)),1)[0];

  let ran = Math.floor(Math.random()*6);

  if(ran == 0){
    section[PROSP_MOON][temp[0]][temp[1]]=generateBasicTile(0, "PUBLIC PARK");
    section[DERSE_MOON][temp[0]][temp[1]]=generateBasicTile(0, "ABANDONED BUILDING");
  } else {
  section[PROSP_MOON][temp[0]][temp[1]]=generateBasicTile(45, "APPARTMENT");
  section[DERSE_MOON][temp[0]][temp[1]]=generateBasicTile(45, "SLUMS");
}
}


//
// Prospit/Derse Dungeons
//
  
  // Generate the basic "prison blocks" upon which the maps are built
  for(let i=0; i<ALL_DUNGEONS.length; i++){
    section[ALL_DUNGEONS[i]] = generatePrisonBlock();
  }

  // Replace 3 spaces in each level-1 and level-2 dungeon with stairs
  for(i=0;i<3;i++){
    let tempRan = Math.floor(Math.random()*(empty3.length-1));
    let temp=empty3.splice(tempRan,1)[0];

    section[DUNGEON_P1][temp[0]][temp[1]]=generateBasicTile(46, "DESCENDING STAIRS");
    section[DUNGEON_D1][temp[0]][temp[1]]=generateBasicTile(46, "DESCENDING STAIRS");
    section[DUNGEON_P2][temp[0]][temp[1]]=generateBasicTile(47, "ASCENDING STAIRS");
    section[DUNGEON_D2][temp[0]][temp[1]]=generateBasicTile(47, "ASCENDING STAIRS");

    empty4.splice(empty4.findIndex(tile => tile[0] == temp[0] && tile[1] == temp[1]),1);
  }

  // Replace 2 spaces in each level-2 and level-3 dungeon with stairs
  for(i=0;i<2;i++){
    let tempRan = Math.floor(Math.random()*(empty4.length-1));
    let temp=empty4.splice(tempRan,1)[0];

    section[DUNGEON_P2][temp[0]][temp[1]]=generateBasicTile(46, "DOWNSTAIRS ENTRANCE");
    section[DUNGEON_D2][temp[0]][temp[1]]=generateBasicTile(46, "DOWNSTAIRS ENTRANCE");
    section[DUNGEON_P3][temp[0]][temp[1]]=generateBasicTile(47, "ASCENDING STAIRS");
    section[DUNGEON_D3][temp[0]][temp[1]]=generateBasicTile(47, "ASCENDING STAIRS");

    empty5.splice(empty5.findIndex(tile => tile[0] == temp[0] && tile[1] == temp[1]),1);
  }

//tossing in the sac slabs, stealing the light aspect symbol for now.
  let tempRan = Math.floor(Math.random()*(empty4.length-1))[0];
  let temp=empty4.splice(tempRan,1)[0];
  section[DUNGEON_P3][temp[0]][temp[1]]=generateBasicTile(35, "SACRIFICIAL SLAB");
  section[DUNGEON_D3][temp[0]][temp[1]]=generateBasicTile(35, "SACRIFICIAL SLAB");
  empty5.splice(empty5.findIndex(tile => tile[0] == temp[0] && tile[1] == temp[1]),1);

// Replace all the appropriate empty corridors with prison cells.
// Not needed anymore because prison cells are considered part of the basic prison block.
/*
  while(empty3.length>0){
    let temp=empty3.splice(Math.floor(Math.random()*(empty3.length-1)),1)[0];
    section[DUNGEON_P1][temp[0]][temp[1]]=generateBasicTile(15, "PRISON CELL");
    section[DUNGEON_D1][temp[0]][temp[1]]=generateBasicTile(15, "PRISON CELL");
  }
  while(empty4.length>0){
    let temp=empty4.splice(Math.floor(Math.random()*(empty4.length-1)),1)[0];
    section[DUNGEON_P2][temp[0]][temp[1]]=generateBasicTile(15, "PRISON CELL");
    section[DUNGEON_D2][temp[0]][temp[1]]=generateBasicTile(15, "PRISON CELL");
  }
  while(empty5.length>0){
    let temp=empty5.splice(Math.floor(Math.random()*(empty5.length-1)),1)[0];
    section[DUNGEON_P3][temp[0]][temp[1]]=generateBasicTile(15, "PRISON CELL");
    section[DUNGEON_D3][temp[0]][temp[1]]=generateBasicTile(15, "PRISON CELL");
  }
*/

  return section;
}

function generatePrisonBlock(){
	// The x- and y-coordinates reserved for corridors.
	const corridors = [2, 5, 8];
	let sec = [];
	for(let i=0; i<11; i++){
		if(corridors.indexOf(i) >= 0){
			sec.push(generateEmptyLine("CORRIDOR", 10));
			continue;
		}
		
		let row = [];
		for(let j=0; j<11; j++){
			if(corridors.indexOf(j) >= 0){
				row.push(generateBasicTile(10, "CORRIDOR"));
			}
			else{
				row.push(generateBasicTile(15, "PRISON CELL"));
			}
		}
		sec.push(row);
	}
	return sec;
}


function generateEmptyLine(name, icon, length = 11){
	let retVal = [];
	for(let i=0; i<length; i++){
		retVal.push(generateBasicTile(icon, name));
	}
}

function generateBasicTile(icon, name, explored = false){
	return [
		icon,	// The image used to represent this tile. Sometimes carries other information, like the fact that a given tile is a wall. 
		1,		// The number of rooms in a tile. This is ALMOST always 1.
		
		// The actual room array.
		[
			// The one (and only) room within this tile
			[
				[],			// ???
				[],			// ???
				name,		// The name of this room. 
				explored,	// Whether this room has already been explored/visited.
				[],			// Entity list
				[]			// Loot list
			]
		]
	];
}



exports.drawMap = async function(client,message,mini) {

var userid = message.guild.id.concat(message.author.id);
var charid = client.userMap.get(userid,"possess");
var local = client.charcall.charData(client,charid,`local`);
var input = client.landMap.get(local[4],local[0]);
var aspect;

try {
  aspect = client.landMap.get(local[4],"aspect");
  if(aspect == undefined){
    aspect = "BREATH";
  }
} catch(err){
  aspect = "BREATH";
}
let aspectindex = ["TIME","SPACE","LIGHT","VOID","LIFE","DOOM","BREATH","BLOOD","HOPE","RAGE","MIND","HEART"];


const titlebar = await client.Canvas.loadImage("./miscsprites/TITLE.png");
const numbers = await client.Canvas.loadImage("./miscsprites/NUMBERS.png");
const tiles = await client.Canvas.loadImage("./miscsprites/MAPSHEET.png");
const gate = await client.Canvas.loadImage("./miscsprites/GATE.png");
const plgate = await client.Canvas.loadImage("./miscsprites/PLGATE.png");

let attachment;

client.Canvas.registerFont("./miscsprites/fontstuck.ttf",{family:`fontstuck`});
client.Canvas.registerFont("./miscsprites/Courier Std Bold.otf",{family:`Courier Standard Bold`});
if(!mini){
const canvas = client.Canvas.createCanvas(404,424);
const ctx = canvas.getContext('2d');
function applyText(canvas, msg, width){
let fontsize = 30
   while (ctx.measureText(msg).width > width){
ctx.font = `bold ${fontsize -= 2}px Courier Standard Bold`;
}
  return ctx.font;
}
let titlebarindex=0;
let landname;
 switch(local[0].slice(0,2)){
   case "pm":
   landname="PROSPIT MOON";
   break;
    case "p":
    landname="PROSPIT";
    break;
    case "pd":
    landname = `PROSPIT DUNGEON F${local[0].charAt(2)}`;
    break;
    case "pc":
    landname = `PROSPIT CASTLE`;
    break;
    case "dm":
    landname="DERSE MOON";
    break;
     case "d":
     landname="DERSE";
     break;
     case "dd":
     landname = `DERSE DUNGEON F${local[0].charAt(2)}`;
     break;
     case "dc":
     landname = `DERSE CASTLE`;
     break;
    default:
    let name = client.landMap.get(local[4],"name");
    landname = `Land of ${name[0]} and ${name[1]} [${local[0]}]`.toUpperCase();
  }
if(local[0].slice(0,1)=="p"){
  titlebarindex=1;
} else if(local[0].slice(0,1)=="d"){
  titlebarindex=2;
}
  ctx.drawImage(titlebar,0,32*titlebarindex,394,32,5,5,404,32);

  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.font = `bold 30px Courier Standard Bold`;
  ctx.font = applyText(canvas,landname,380);
  ctx.lineWidth = 10;
  ctx.fillStyle = '#969696';
  if(titlebarindex) {
    ctx.fillStyle = `#3e3e3e`;
  }
  ctx.fillText(landname,200,23);

 for(k=0;k<12;k++){
   ctx.drawImage(numbers,32*k,0,32,32,5+(32.8*k),37,32.8,32.8);
}
for(i=0;i<11;i++){
  ctx.drawImage(numbers,32*(i+1),0,32,32,5,5+(32*(i+2)),32.8,31);
    for(j=0;j<11;j++){
            //comment out this if check to turn off fog of war on the main map
      let tile = 0;
      if(i==local[1]&& j==local[2]){
        tile = 2;
      }
      if(tile!=2&&client.configMap.get(message.guild.id).options[5].selection==0&&!input[i][j][2][0][3]&&local[0]!="p"&&local[0]!="d"&&local[0]!="pm"&&local[0]!="dm"&&local[0]!="pc"&&local[0]!="dc"){
      //if(false){
         ctx.drawImage(tiles,0,32,32,32,5+(32.8*(j+1)),5+(32*(i+2)),32.8,31);

      } else {
       //str=`${client.emojis.cache.get("760188336245309512")}`;
       switch(input[i][j][0]){
         case 0:
         let player = false;
         if(input[i][j][2][0][4].length > 0){
         for(k=0;k<input[i][j][2][0][4].length;k++){
           if(input[i][j][2][0][4][k][0]&& input[i][j][2][0][4][k][1]!=charid){
             player=true;
           }
         }}
         ctx.drawImage(tiles,0,32*tile,32,32,5+(32.8*(j+1)),5+(32*(i+2)),32.8,31);
         if(player){
           ctx.drawImage(tiles,32,32*tile,32,32,5+(32.8*(j+1)),5+(32*(i+2)),32.8,31);
         }
         break;
         case 2:
         ctx.drawImage(tiles,0,32*tile,32,32,5+(32.8*(j+1)),5+(32*(i+2)),32.8,31);
          ctx.drawImage(tiles,32+32*(33+aspectindex.indexOf(aspect)),32*tile,32,32,5+(32.8*(j+1)),5+(32*(i+2)),32.8,31);//aspect
         break;
         case 6:
          ctx.drawImage(tiles,0,32*tile,32,32,5+(32.8*(j+1)),5+(32*(i+2)),32.8,31);
         if(tile==2){
           ctx.drawImage(plgate,5+(32.8*(j+1)),5+(32*(i+2)),32.8,31);
         } else {
           ctx.drawImage(gate,5+(32.8*(j+1)),5+(32*(i+2)),32.8,31);//gate
         }
         break;
        default:
          ctx.drawImage(tiles,0,32*tile,32,32,5+(32.8*(j+1)),5+(32*(i+2)),32.8,31);
          ctx.drawImage(tiles,32+32*input[i][j][0],32*tile,32,32,5+(32.8*(j+1)),5+(32*(i+2)),32.8,31);
       }
    }
  }
}

let attachment = new client.MessageAttachment(canvas.toBuffer(), 'landmap.png');
return attachment;
//message.channel.send(attachment);
} else {

const canvas = client.Canvas.createCanvas(192,192);
const ctx = canvas.getContext('2d');

for(i=-1;i<2;i++){
  for (j=-1;j<2;j++){
    let tile = 0;
     if(j + local[2] > 10 || j + local[2] < 0 || i +local[1] > 10 || i + local[1] <0){
    ctx.drawImage(tiles,32*8,32*tile,32,32,(64*(j+1)),(64*(i+1)),64,64);
    } else {
      if(i==0 && j==0){
        tile = 2;
      } else if(!input[i+local[1]][j+local[2]][2][0][3]&&local[0]!="p"&&local[0]!="d"&&local[0]!="pm"&&local[0]!="dm"){
        tile = 1;
      //} else if(i==local[1]&& j==local[2]){
      }
      switch(input[i+local[1]][j+local[2]][0]){
        case 0:
        let player = false;

        if(input[i+local[1]][j+local[2]][2][0][4].length > 0){
        for(k=0;k<input[i+local[1]][j+local[2]][2][0][4].length;k++){
          if(input[i+local[1]][j+local[2]][2][0][4][k][0] && input[i+local[1]][j+local[2]][2][0][4][k][1]!=charid){
            player=true;
          }
        }}
        ctx.drawImage(tiles,0,32*tile,32,32,(64*(j+1)),(64*(i+1)),64,64);
        if(player){
          ctx.drawImage(tiles,32,32*tile,32,32,(64*(j+1)),(64*(i+1)),64,64);
        }

        break;
         case 2:
         ctx.drawImage(tiles,0,32*tile,32,32,(64*(j+1)),(64*(i+1)),64,64);
          ctx.drawImage(tiles,32+32*(33+aspectindex.indexOf(aspect)),32*tile,32,32,(64*(j+1)),(64*(i+1)),64,64);//aspect
         break;
        case 6:
         ctx.drawImage(tiles,0,32*tile,32,32,(64*(j+1)),(64*(i+1)),64,64);
        if(tile==2){
          ctx.drawImage(plgate,(64*(j+1)),(64*(i+1)),64,64);
        } else {
          ctx.drawImage(gate,(64*(j+1)),(64*(i+1)),64,64);//gate
        }
        break;
         default:
          ctx.drawImage(tiles,0,32*tile,32,32,(64*(j+1)),(64*(i+1)),64,64);
          ctx.drawImage(tiles,32+32*input[i+local[1]][j+local[2]][0],32*tile,32,32,(64*(j+1)),(64*(i+1)),64,64);
      }
    }
  }
  }
  attachment = new client.MessageAttachment(canvas.toBuffer(), 'landmap.png');
  return attachment;
}
}
//this will be remade and moved to charcall.
// exports.underlingCheck = function(occList,client) {
//   check = false;
//   if(occList.length>0){
//     for(i=0;i<occList.length;i++){
//       if(occList[i][0]==false&&client.playerMap.get(occList[i][1],"faction")=="underling"){
//         check=true;
//       }
//     }
//   }
//
//   return check;
// }

//creates a carpacian
exports.carSpawn = function(client,local,lunar,sessionID){

  let picList = [
	["https://media.discordapp.net/attachments/808757312520585227/814739963824439296/dersite_short.png",
	 "https://media.discordapp.net/attachments/808757312520585227/814739982748221480/dersite_normal.png",
	 "https://media.discordapp.net/attachments/808757312520585227/814740004618240050/dersite_tall.png",
	 "https://media.discordapp.net/attachments/808757312520585227/814740019902021652/dersite_beefy.png"],
	["https://media.discordapp.net/attachments/808757312520585227/814740073681518612/prospitian_short.png",
	 "https://media.discordapp.net/attachments/808757312520585227/814740091306115112/prospitian_normal.png",
	 "https://media.discordapp.net/attachments/808757312520585227/814740144933830666/prospitian_tall.png",
	 "https://media.discordapp.net/attachments/808757312520585227/814740171705548861/prospitian_beefy.png"]
  ];

  let typeList = ["stout carapacian","medium carapacian","tall carapacian","large carapacian"];
  let lunarList = [["derse","prospit"],["DERSITE","PROSPITIAN"]];
  let repList = [[1000000,-1000000],[-1000000,1000000]]

  let num = Math.floor(Math.random()*4);

  let npcCount = client.landMap.get(sessionID+"medium","npcCount");

  let occ = []

  for(i=0;i<num;i++){

    npcCount++;

  let type = Math.floor(Math.random()*4);

  let npcSet = {
    name: `${lunarList[1][lunar]}`,
    control:[],
    type: typeList[type],
    faction: lunarList[0][lunar],
    vit:client.underlings[typeList[type]].vit,
    gel:client.underlings[typeList[type]].vit,
    gristtype: "diamond",
    strife:false,
    pos:0,
    alive:true,
    local:local,
    sdex:[],
    equip:0,
    trinket:[],
    armor:[],
    spec:[],
    equip:0,
    scards:1,
    kinds:[],
    port:1,
    modus:"STACK",
    cards:4,
    prototype:[],
    prospitRep:repList[lunar][1],
    derseRep:repList[lunar][0],
    underlingRep:0,
    playerRep:0,
    consortRep:0,
    prefTarg:[],
    xp:0,
    rung:0,
    b:0,
    bio:`A ${lunarList[1][lunar]} ${typeList[type]}`,
    img:picList[lunar][type],
    questData:[]
  }

  let id = `n${sessionID}/${npcCount}`;

  client.npcMap.set(id,npcSet);

  let occSet = [false,id];

  occ.push(occSet)
}
client.landMap.set(sessionID+"medium",npcCount,"npcCount");
return occ;
}

exports.consortSpawn = function(client,message,coords,type,count){

let sessionid = message.guild.id;
let charid = client.userMap.get(message.guild.id.concat(message.author.id),"possess");
let sburbid = client.charcall.charData(client,charid,"owner");
let npcCount = client.landMap.get(sessionid+"medium","npcCount");
let occ = [];
coords.push(sburbid);

  for(let i=0;i<count;i++){
    npcCount++;
    switch(type[i]){
      case "shopkeep":
        let consortSet = {
          name: `Shopkeep Consort`,
          control:[],
          type: "shopkeep",
          faction: "consort",
          vit:client.underlings["shopkeep"].vit,
          gel:client.underlings["shopkeep"].vit,
          gristtype: "diamond",
          strife:false,
          pos:0,
          alive:true,
          local:coords,
          sdex:[],
          equip:0,
          trinket:[],
          armor:[],
          spec:[],
          equip:0,
          scards:1,
          kinds:[],
          port:1,
          modus:"STACK",
          cards:4,
          prototype:[],
          prospitRep:0,
          derseRep:0,
          underlingRep:-1,
          playerRep:1,
          consortRep:1,
          prefTarg:[],
          xp:0,
          rung:0,
          b:0,
          bio:`A friendly shopkeeper!`,
          img:`https://cdn.discordapp.com/attachments/653038622135549952/917120918466224138/Salamander.png`,
          dialogue:["Buy my stuff.","Look at all these funny things I found! I bet you want all of them. Hope you brought your boons!","Nak."],
          questData:[client.questcall.createQuest(client,`Shopkeep Consort`,npcCount,coords,"kill")],
          shopPrices:[]
        }
        let id = `n${sessionid}/${npcCount}`;
        client.npcMap.set(id,consortSet);
        let occSet = [false,id];
        occ.push(occSet)
      break;
    }


  }
  client.landMap.set(sessionid+"medium",npcCount,"npcCount");
  return occ;
}
