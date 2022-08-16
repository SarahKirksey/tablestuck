

//generic room structure: [AREA TYPE,NUMBER OF ROOMS,[[[roomShopPool],[unused?],roomName,roomVisited,[occ],[roomInv]],[room2]]];
//default empty = [0,1,[[],[],"CLEARING",false,[underlings],[items]]];

const defaultEmpty = [0,1,[[[],[],"CLEARING",false,[],[]]]];
const defaultGate = [6,1,[[[],[],"GATE",false,[],[]]]];

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
    let temp=empty.splice(60,1);
    section[temp[0][0]][temp[0][1]]=generateBasicTile(1, "DENIZEN LAIR ENTRANCE");
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
  let temp=empty.splice(Math.floor(Math.random()*length)-1+(40*(j-1)),1);
  length--;
  section[temp[0][0]][temp[0][1]]=generateBasicTile(1, "DUNGEON ENTRANCE");
  dungeon = dungeonGen(client,temp,sec,dungeon,message)[0];
  }
  }

  //Creates Dreambed if needed
  if(bedpos==j){
    let temp=empty.splice(Math.floor(Math.random()*length)-1+(40*(j-1)),1);
    length--;
    section[temp[0][0]][temp[0][1]]=generateBasicTile(2, "DREAM BED");
  }
  //Creates a Village (9 per section)
  for(let i=0;i<3;i++){
    let temp=empty.splice(Math.floor(Math.random()*length)-1+(40*(j-1)),1);
    length--;
    section[temp[0][0]][temp[0][1]]=[4,2,[[client.funcall.preItem(client,1,7,[],gristSet),[],"ROOM 1",false,client.landcall.consortSpawn(client,message,[`s${sec+1}`,temp[0][0],temp[0][1],0],["shopkeep"],1),[]],[[],[],"ROOM 2",false,[],[]]]];

  }
  //Creates the Land Constructs (9 per section)
  for(let i=0;i<3;i++){
    let temp=empty.splice(Math.floor(Math.random()*length)-1+(40*(j-1)),1);
    length--;
	let roomContents = (Math.floor(Math.random()*4)==0) ? [aspectItems[client.aspects.indexOf(aspect)]] : [];
    section[temp[0][0]][temp[0][1]]=[2,1,[[[],[],"LAND CONSTRUCT",false,[],roomContents]]];
  }
  //Creates the return nodes (12 per section)
  for(let i=0;i<4;i++){
    let temp=empty.splice(Math.floor(Math.random()*length)-1+(40*(j-1)),1);
    length--;
    section[temp[0][0]][temp[0][1]]=generateBasicTile(3, "RETURN NODE");
  }
  //Creates free loot (9 per section)
  for(let i=0;i<3;i++){
    let temp=empty.splice(Math.floor(Math.random()*length)-1+(40*(j-1)),1);
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

function dungeonGen(client,roomCoor,sec,dungeon,message) {
  //lists current bosses and their names in the order they appear.
  let bossList = ["unicorn","kraken","hecatoncheires"];
  let support = ["basilisk","basilisk","basilisk"];
  //every dungeon has an exit where the entrance is, so we start with that.
  dungeon[roomCoor[0][0]][roomCoor[0][1]]=generateBasicTile(1, "DUNGEON EXIT");

  let s = 0;
  let lv2 = [];
  let lv3 = [];
  //because section 1 and 2 dungeons only make 1 or 2 paths, respectively, the directions they
  //split off to has to be selected. If the exit is in a location where a direction
  //can't be used (aka too close to the edge of the map), the option is spliced from the array.
  if(sec==0||sec==1){
  let direction=["x+","x-","y+","y-"];
    //roomCoor[0][0]+,roomCoor[0][0]-,roomCoor[0][1]+,roomCoor[0][1]-
    if(roomCoor[0][0]>5){
      removed = direction.splice(direction.indexOf("x+"),1);
    } else if(roomCoor[0][0]<5){
      removed = direction.splice(direction.indexOf("x-"),1);
    }
    if(roomCoor[0][1]>5){
      removed = direction.splice(direction.indexOf("y+"),1);
    } else if(roomCoor[0][1]<5){
      removed = direction.splice(direction.indexOf("y-"),1);
    }
//s is used as a variable for a more usable sec, so section 1 is s = 1, etc.
//since only sections 1 and 2 run this part, s is either 1 or 2.
s = sec+1;
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
          if(dungeon[roomCoor[0][0]+k][roomCoor[0][1]][0]==1 || dungeon[roomCoor[0][0]+k][roomCoor[0][1]][0] == 8)
            occupied = true;
          //if b is at it's max value, generates the boss room and it's monsters.
          if ((b==5&&sec==0)||(b==10&&sec==1))
            bossTime = true;
          if(!occupied&&!bossTime){
            //if it's not a boss, makes a normal room with a chance of loot.
            dungeon[roomCoor[0][0]+k] [roomCoor[0][1]] = dungeonRoomGen(client,sec);
          } else if (bossTime){
            while(occupied){
              k--;
              if(dungeon[roomCoor[0][0]+k][roomCoor[0][1]][0]!=1 && dungeon[roomCoor[0][0]+k][roomCoor[0][1]][0] != 8){
                occupied = false;
              }
            }
            dungeon[roomCoor[0][0]+k] [roomCoor[0][1]] =[8,1,[[[],[],"BOSS ROOM",false,[
              client.strifecall.dungeonSpawn(client, sec, [roomCoor[0][0]+k,roomCoor[0][1]], bossList[sec], message),
              client.strifecall.dungeonSpawn(client, sec, [roomCoor[0][0]+k,roomCoor[0][1]], support[sec], message),
              client.strifecall.dungeonSpawn(client, sec, [roomCoor[0][0]+k,roomCoor[0][1]], support[sec], message)
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
        if(dungeon[roomCoor[0][0]-k][roomCoor[0][1]][0]==1 || dungeon[roomCoor[0][0]-k][roomCoor[0][1]][0] == 8)
          occupied = true;
        if ((b==5&&sec==0)||(b==10&&sec==1))
          bossTime = true;
        if(!occupied&&!bossTime){
          dungeon[roomCoor[0][0]-k] [roomCoor[0][1]] = dungeonRoomGen(client,sec);
        } else if (bossTime){
          while(occupied){
            k--;
            if(dungeon[roomCoor[0][0]-k][roomCoor[0][1]][0]!=1 && dungeon[roomCoor[0][0]-k][roomCoor[0][1]][0] != 8)
              occupied = false;
          }
          dungeon[roomCoor[0][0]-k] [roomCoor[0][1]] =[8,1,[[[],[],"BOSS ROOM",false,[
            client.strifecall.dungeonSpawn(client, sec, [roomCoor[0][0]-k,roomCoor[0][1]], bossList[sec], message),
            client.strifecall.dungeonSpawn(client, sec, [roomCoor[0][0]-k,roomCoor[0][1]], support[sec], message),
            client.strifecall.dungeonSpawn(client, sec, [roomCoor[0][0]-k,roomCoor[0][1]], support[sec], message)
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
        if(dungeon[roomCoor[0][0]][roomCoor[0][1]+k][0]==1 || dungeon[roomCoor[0][0]][roomCoor[0][1]+k][0] == 8)
          occupied = true;
        if ((b==5&&sec==0)||(b==10&&sec==1))
          bossTime = true;
        if(!occupied&&!bossTime){
          dungeon[roomCoor[0][0]] [roomCoor[0][1]+k] = dungeonRoomGen(client,sec);
        } else if (bossTime){
          while(occupied){
            k--;
            if(dungeon[roomCoor[0][0]][roomCoor[0][1]+k][0]!=1 && dungeon[roomCoor[0][0]][roomCoor[0][1]+k][0] != 8)
              occupied = false;
          }
          dungeon[roomCoor[0][0]] [roomCoor[0][1]+k] =[8,1,[[[],[],"BOSS ROOM",false,[
            client.strifecall.dungeonSpawn(client, sec, [roomCoor[0][0],roomCoor[0][1]+k], bossList[sec], message),
            client.strifecall.dungeonSpawn(client, sec, [roomCoor[0][0],roomCoor[0][1]+k], support[sec], message),
            client.strifecall.dungeonSpawn(client, sec, [roomCoor[0][0],roomCoor[0][1]+k], support[sec], message)
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
        if(dungeon[roomCoor[0][0]][roomCoor[0][1]-k][0]==1 || dungeon[roomCoor[0][0]][roomCoor[0][1]-k][0] == 8)
          occupied = true;
        if ((b==5&&sec==0)||(b==10&&sec==1))
          bossTime = true;
        if(!occupied&&!bossTime){
          dungeon[roomCoor[0][0]] [roomCoor[0][1]-k] = dungeonRoomGen(client,sec);
        } else if (bossTime){
          while(occupied){
            k--;
            if(dungeon[roomCoor[0][0]][roomCoor[0][1]-k][0]!=1 && dungeon[roomCoor[0][0]][roomCoor[0][1]-k][0] != 8)
              occupied = false;
          }
          dungeon[roomCoor[0][0]] [roomCoor[0][1]-k] =[8,1,[[[],[],"BOSS ROOM",false,[
            client.strifecall.dungeonSpawn(client, sec, [roomCoor[0][0],roomCoor[0][1]-k], bossList[sec], message),
            client.strifecall.dungeonSpawn(client, sec, [roomCoor[0][0],roomCoor[0][1]-k], support[sec], message),
            client.strifecall.dungeonSpawn(client, sec, [roomCoor[0][0],roomCoor[0][1]-k], support[sec], message)
          ],[client.lootcall.lootA(client, sec, dubs(8))]]]];
          k=5;
        }
      occupied = false;
      }
      break;
    }
  }
} else if(sec==2){
  //this is all for the section 3 dungeon, which generates in a cross pattern.
  //it checks every space in the cross, and as long as it isn't a boss room or enterance, it
  //makes a dungeon room there.
  for(k=0;k<11;k++){
    if(dungeon[roomCoor[0][0]] [k] [0] != 1 && dungeon[roomCoor[0][0]] [k] [0] != 8){
      dungeon[roomCoor[0][0]] [k] = dungeonRoomGen(client,sec);
    }
  }

  for(k=0;k<11;k++){
    if(dungeon[k] [roomCoor[0][1]] [0] != 1 && dungeon[k] [roomCoor[0][1]] [0] != 8){
      dungeon[k] [roomCoor[0][1]] = dungeonRoomGen(client,sec);
    }
  }
  let bosscheck = false;
  //flips a coin to choose which path to make the boss room in.
  switch(Math.floor((Math.random() * 1))){
    case 0:
    while(!bosscheck){
      //randomly picks a room along a path and places the boss in an empty room.
      let random = Math.floor((Math.random() * 11))
      if(dungeon[roomCoor[0][0]][random][0]==10){
        dungeon[roomCoor[0][0]] [random] =[8,1,[[[],[],"BOSS ROOM",false,[
        client.strifecall.dungeonSpawn(client, sec, [roomCoor[0][0],random], bossList[sec], message),
        client.strifecall.dungeonSpawn(client, sec, [roomCoor[0][0],random], support[sec], message),
        client.strifecall.dungeonSpawn(client, sec, [roomCoor[0][0],random], support[sec], message)],[client.lootcall.lootA(client, sec, dubs(8))]]]];
        bosscheck=true;
      }
    }
    break;
    case 1:
      while(!bosscheck){
      let random = Math.floor((Math.random() * 11))
      if(dungeon[random][roomCoor[0][1]][0]==10){
        dungeon[roomCoor[0][0]] [random] =[8,1,[[[],[],"BOSS ROOM",false,[
        client.strifecall.dungeonSpawn(client, sec, [random,roomCoor[0][1]], bossList[sec], message),
        client.strifecall.dungeonSpawn(client, sec, [random,roomCoor[0][1]], support[sec], message),
        client.strifecall.dungeonSpawn(client, sec, [random,roomCoor[0][1]], support[sec], message)],[client.lootcall.lootA(client, sec, dubs(8))]]]];
        bosscheck=true;
      }
    }
    break;
  }
/*
[/][/][/]
[][][/]
[x][/][/]
*/
} else if(sec==3){
//this is the section 4 dungeon, or the denizen dungeon.
let emptyTiles=[];
let genDirection =["n","s","e","w"];
let pathStart = [[roomCoor[0][0],roomCoor[0][1]],[roomCoor[0][0],roomCoor[0][1]],[roomCoor[0][0],roomCoor[0][1]],[roomCoor[0][0],roomCoor[0][1]]];
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
  roomToFill = emptyTiles.splice(Math.floor(Math.random()*emptyTiles.length)-1,1);
  dungeon [roomToFill[0][0]][roomToFill[0][1]] = [9,1,[[[],[],"DENIZEN CHAMBER",false,[
    client.strifecall.dungeonSpawn(client, sec, [roomToFill[0][0],roomToFill[0][1]], 'denizen', message),],[client.lootcall.lootA(client, sec, dubs(8))]]]];
}
//four denizen minions are also placed around the map, to eventually be bosses.
for (d=0;d<4;d++){
  roomToFill = emptyTiles.splice(Math.floor(Math.random()*emptyTiles.length)-1,1);
  dungeon [roomToFill[0][0]][roomToFill[0][1]] = [8,1,[[[],[],"DENIZEN MINION",false,[
    client.strifecall.dungeonSpawn(client, sec, [roomToFill[0][0],roomToFill[0][1]], 'basilisk', message),],[client.lootcall.lootA(client, sec, dubs(8))]]]];
}

} else if(sec=="m"){
//this is in theory for the moon dungeon, but I never see where it's called, and it's
//an exact copy of the section 4 gen. Look into why this is here.
let emptyTiles=[];
let genDirection =["n","s","e","w"];
let pathStart = [[roomCoor[0][0],roomCoor[0][1]],[roomCoor[0][0],roomCoor[0][1]],[roomCoor[0][0],roomCoor[0][1]],[roomCoor[0][0],roomCoor[0][1]]];
let g = 0;
let denizen = false;
while(pathStart.length != 0){
let curx = pathStart[0][0];
let cury = pathStart[0][1];
let deleted = pathStart.splice(0,1);
let hitWall = false;
let curDirection;
if(g<4){
curDirection = genDirection[g];
g++;
} else {
curDirection = genDirection[Math.floor((Math.random()*4))];
}
while(!hitWall){
  //let hallLength = Math.floor((Math.random()*3))+1;
  switch (curDirection){
    case "n":
    for(m=0;m<2 && !hitWall;m++){
      if((--cury)<0){
        hitWall=true;
        if(Math.floor(Math.random()*10)==0 && denizen == false){
          dungeon[curx][0] = [9,1,[[[],[],"DENIZEN CHAMBER",false,[
            client.strifecall.dungeonSpawn(client, sec, [curx,0], 'denizen', message),
          ],[client.lootcall.lootA(client, sec, dubs(8))]]]];
          denizen=true;
        }

      } else {
        if(dungeon[curx][cury][0] == 7){
        dungeon[curx][cury] = dungeonRoomGen(client,sec);
        emptyTiles.push([curx,cury]);
      }
    }
  } if (Math.floor(Math.random()*2)==1 && g<4 &&!hitWall){
    pathStart.push([curx,cury]);
  }
   deleted = genDirection.splice(1,1);
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
curDirection = genDirection[Math.floor((Math.random()*genDirection.length))];
genDirection =["n","s","e","w"];
}
}
if (denizen == false){
  roomToFill = emptyTiles.splice(Math.floor(Math.random()*emptyTiles.length)-1,1);
  dungeon [roomToFill[0][0]][roomToFill[0][1]] = [9,1,[[[],[],"DENIZEN CHAMBER",false,[
    client.strifecall.dungeonSpawn(client, sec, [roomToFill[0][0],roomToFill[0][1]], 'denizen', message),],[client.lootcall.lootA(client, sec, dubs(8))]]]];
}
for (d=0;d<4;d++){
  roomToFill = emptyTiles.splice(Math.floor(Math.random()*emptyTiles.length)-1,1);
  dungeon [roomToFill[0][0]][roomToFill[0][1]] = [8,1,[[[],[],"DENIZEN MINION",false,[
    client.strifecall.dungeonSpawn(client, sec, [roomToFill[0][0],roomToFill[0][1]], 'basilisk', message),],[client.lootcall.lootA(client, sec, dubs(8))]]]];
}

}
//lv2 and lv3 are always empty, this is for the moon dungeons later.
  return [dungeon,lv2,lv3];

}

function dungeonRoomGen(client,sec) {
  //25% of the time, there is loot in a dungeon room. That's what this is for.
  switch(Math.floor((Math.random() * 4))){

case 3:
return [10,1,[[[],[],"DUNGEON ROOM",false,[],[client.lootcall.lootB(client, sec, dubs(8))]]]];
break;
  default:
  return generateBasicTile(10, "DUNGEON ROOM");
  }

}
//==========================================================================================
exports.battlefieldGen = function(client,message){
  //though untested, this should in theory make a blank checkerboard pattern for the battlefield.
let battleMap = [];
let battleLine = [];
let lastBlack = true;
for(let u=0;u<11;u++){
  for (let m=0;m<11;m++){
    if (lastBlack){
      battleLine.push(generateBasicTile(0, "CLEARING"))
      lastBlack = false;
    } else {
      battleLine.push(generateBasicTile(10, "CLEARING"))
      lastBlack = true;
    }
  }
  battleMap.push(battleLine);
  battleLine = [];
}
return battleMap;
}

exports.moonGen = function(client,castleLocal,towerLocal,message){

	const PROSPIT = 0;
	const DERSE = 1;
	const PLANETS = [PROSPIT, DERSE];

	const PROSPIT_MOON = 2;
	const DERSE_MOON = 3;
	const MOONS = [PROSPIT_MOON, DERSE_MOON];

	const PROSPIT_MAIN = [PROSPIT, PROSPIT_MOON];
	const DERSE_MAIN = [DERSE, DERSE_MOON];

	const DUNGEON_P1 = 4;
	const DUNGEON_P2 = 5;
	const DUNGEON_P3 = 6;
	const PROSPIT_DUNGEONS = [DUNGEON_P1, DUNGEON_P2, DUNGEON_P3];

	const DUNGEON_D1 = 7;
	const DUNGEON_D2 = 8;
	const DUNGEON_D3 = 9;
	const DERSE_DUNGEONS = [7, 8, 9];

	const SLAB_DUNGEONS = [DUNGEON_P3, DUNGEON_D3];
	const ALL_DUNGEONS = [DUNGEON_P1, DUNGEON_P2, DUNGEON_P3, DUNGEON_D1, DUNGEON_D2, DUNGEON_D3];
	const ALL_DUNGEONS_BY_MOON = [PROSPIT_DUNGEONS, DERSE_DUNGEONS];


//generates everything needed for both moons.
  let section = [[],[],[],[],[],[],[],[],[],[]];
  for(i=0;i<11;i++){
  //bunch of empty spaces being made.
  //prospit,derse,prospitmoon,dersemoon,pdungeon1,2,3,ddungeon1,2,3
    section[0].push(generateEmptyLine("STREET",10));
    section[1].push(generateEmptyLine("ALLEYWAY",10));
    section[2].push(generateEmptyLine("STREET",10));
    section[3].push(generateEmptyLine("ALLEYWAY",10));

	for(let j=4; j<=9; j++)
	{
		section[j].push(generateEmptyLine("CORRIDOR",10));
	}


  }

  let dungeon = [[],[],[],[]];
  for(i=0;i<11;i++){
    for(j=0;j<dungeon.length;j++){
      dungeon[j].push(generateEmptyLine("OUT OF BOUNDS",7));
    }
  }

  let castle = [[],[]];

  for(i=0;i<11;i++){
    for(j=0;j<castle.length;j++){
      castle[j].push(generateEmptyLine("OUT OF BOUNDS",7));
    }
}

  let select = [0,1,3,4,6,7,9,10]
  let empty = [];
  let empty2 = [];
  let empty3 = [];
  let empty4 = [];
  let empty5 = [];

  for(i=0;i<8;i++){
    for(j=0;j<8;j++){
      empty.push([select[i],select[j]]);
      empty2.push([select[i],select[j]]);
      empty3.push([select[i],select[j]]);
      empty4.push([select[i],select[j]]);
      empty5.push([select[i],select[j]]);
    }
  }
/*
  let empty2 = [];
  for(i=0;i<8;i++){
    for(j=0;j<8;j++){
      empty2.push([select[i],select[j]]);
    }
  }

  let empty3 = [];
  for(i=0;i<8;i++){
    for(j=0;j<8;j++){
      empty3.push([select[i],select[j]]);
    }
  }

  let empty4 = [];
  for(i=0;i<8;i++){
    for(j=0;j<8;j++){
      empty4.push([select[i],select[j]]);
    }
  }

  let empty5 = [];
  for(i=0;i<8;i++){
    for(j=0;j<8;j++){
      empty5.push([select[i],select[j]]);
    }
  }
*/

  section[0][5][5]=generateBasicTile(13, "CHAIN");
  section[1][5][5]=generateBasicTile(13, "CHAIN");
  section[2][5][5]=generateBasicTile(13, "CHAIN");
  section[3][5][5]=generateBasicTile(13, "CHAIN");

  section[2][towerLocal[0]][towerLocal[1]]=[11,1,[[[],[],"PROSPIT TOWER BASE",true,[],[]]]];
  section[3][towerLocal[0]][towerLocal[1]]=[11,1,[[[],[],"DERSE TOWER BASE",true,[],[]]]];
  empty.splice(select.indexOf(towerLocal[0])*8+select.indexOf(towerLocal[1]), 1);

  section[0][castleLocal[0]][castleLocal[1]]=[12,1,[[[],[],"PROSPIT CASTLE",true,[],[]]]];
  section[1][castleLocal[0]][castleLocal[1]]=[12,1,[[[],[],"DERSE CASTLE",true,[],[]]]];
  empty2.splice(select.indexOf(castleLocal[0])*8+select.indexOf(castleLocal[1]),1);
  let transLocal=[0,0];
  //castle generation
  castle[0][5][5]=[12,1,[[[],[],"CASTLE ENTRANCE",true,[],[]]]];
  castle[1][5][5]=[12,1,[[[],[],"CASTLE ENTRANCE",true,[],[]]]];

  castle[0][4][5]=[10,1,[[[],[],"HALL",true,[],[]]]];
  castle[0][3][5]=[8,1,[[[],[],"THRONE ROOM",true,[],[]]]];
  castle[0][5][4]=[19,1,[[[],[],"TRANSPORTALIZER HUB",true,[],[]]]];

  castle[1][4][5]=[10,1,[[[],[],"HALL",true,[],[]]]];
  castle[1][3][5]=[8,1,[[[],[],"THRONE ROOM",true,[],[]]]];
  castle[1][5][4]=[19,1,[[[],[],"TRANSPORTALIZER HUB",true,[],[]]]];

  transLocal=[5,4];
  //end castle generation

  section.push(castle[0]);
  section.push(castle[1]);
  section.push(transLocal);
//Prospit / Derse Main

for(i=0;i<2;i++){
  let temp=empty2.splice(Math.floor(Math.random()*empty2.length)-1,1);

  section[0][temp[0][0]][temp[0][1]]=generateBasicTile(14, "POLICE STATION");
  section[1][temp[0][0]][temp[0][1]]=generateBasicTile(14, "POLICE STATION");
}
for(i=0;i<1;i++){
  let temp=empty2.splice(Math.floor(Math.random()*empty2.length)-1,1);

  section[0][temp[0][0]][temp[0][1]]=generateBasicTile(15, "PRISON");
  section[1][temp[0][0]][temp[0][1]]=generateBasicTile(15, "PRISON");
}
for(i=0;i<1;i++){
  let temp=empty2.splice(Math.floor(Math.random()*empty2.length)-1,1);

  section[0][temp[0][0]][temp[0][1]]=generateBasicTile(16, "COURT");
  section[1][temp[0][0]][temp[0][1]]=generateBasicTile(16, "COURT");
}
for(i=0;i<1;i++){
  let temp=empty2.splice(Math.floor(Math.random()*empty2.length)-1,1);

  section[0][temp[0][0]][temp[0][1]]=generateBasicTile(17, "HOSPITAL");
  section[1][temp[0][0]][temp[0][1]]=generateBasicTile(17, "HOSPITAL");
}
for(i=0;i<1;i++){
  let temp=empty2.splice(Math.floor(Math.random()*empty2.length)-1,1);

  section[0][temp[0][0]][temp[0][1]]=generateBasicTile(18, "BANK");
  section[1][temp[0][0]][temp[0][1]]=generateBasicTile(18, "BANK");
}
for(i=0;i<2;i++){
  let temp=empty2.splice(Math.floor(Math.random()*empty2.length)-1,1);

  section[0][temp[0][0]][temp[0][1]]=generateBasicTile(19, "POST OFFICE");
  section[1][temp[0][0]][temp[0][1]]=generateBasicTile(19, "POST OFFICE");
}
for(i=0;i<4;i++){
  let temp=empty2.splice(Math.floor(Math.random()*empty2.length)-1,1);

  section[0][temp[0][0]][temp[0][1]]=generateBasicTile(20, "MILITARY OUTPOST");
  section[1][temp[0][0]][temp[0][1]]=generateBasicTile(20, "MILITARY OUTPOST");
}
for(i=0;i<1;i++){
  let temp=empty2.splice(Math.floor(Math.random()*empty2.length)-1,1);

  section[0][temp[0][0]][temp[0][1]]=generateBasicTile(21, "GUILD HALL");
  section[1][temp[0][0]][temp[0][1]]=generateBasicTile(21, "GUILD HALL");
}
for(i=0;i<1;i++){
  let temp=empty2.splice(Math.floor(Math.random()*empty2.length)-1,1);

  section[0][temp[0][0]][temp[0][1]]=generateBasicTile(22, "THEATRE");
  section[1][temp[0][0]][temp[0][1]]=generateBasicTile(22, "THEATRE");
}
for(i=0;i<1;i++){
  let temp=empty2.splice(Math.floor(Math.random()*empty2.length)-1,1);

  section[0][temp[0][0]][temp[0][1]]=generateBasicTile(23, "BINGO HALL");
  section[1][temp[0][0]][temp[0][1]]=generateBasicTile(23, "CASINO");
}
for(i=0;i<1;i++){
  let temp=empty2.splice(Math.floor(Math.random()*empty2.length)-1,1);

  section[0][temp[0][0]][temp[0][1]]=generateBasicTile(24, "MUSEUM");
  section[1][temp[0][0]][temp[0][1]]=generateBasicTile(24, "MUSEUM");
}
for(i=0;i<1;i++){
  let temp=empty2.splice(Math.floor(Math.random()*empty2.length)-1,1);

  section[0][temp[0][0]][temp[0][1]]=generateBasicTile(25, "LIBRARY");
  section[1][temp[0][0]][temp[0][1]]=generateBasicTile(25, "LIBRARY");
}
for(i=0;i<5;i++){
  let temp=empty2.splice(Math.floor(Math.random()*empty2.length)-1,1);

  section[0][temp[0][0]][temp[0][1]]=generateBasicTile(26, "RESTAURANT");
  section[1][temp[0][0]][temp[0][1]]=generateBasicTile(26, "RESTAURANT");
}
for(i=0;i<5;i++){
  let temp=empty2.splice(Math.floor(Math.random()*empty2.length)-1,1);

  section[0][temp[0][0]][temp[0][1]]=[27,1,[[[],[["CAPTCHALOGUE CARD","11111111",1,4,[]]],"GENERAL STORE",false,[],[]]]];
  section[1][temp[0][0]][temp[0][1]]=[27,1,[[[],[["CAPTCHALOGUE CARD","11111111",1,4,[]]],"GENERAL STORE",false,[],[]]]];
}
for(i=0;i<5;i++){
  let temp=empty2.splice(Math.floor(Math.random()*empty2.length)-1,1);

  section[0][temp[0][0]][temp[0][1]]=generateBasicTile(28, "CANDY SHOP");
  section[1][temp[0][0]][temp[0][1]]=generateBasicTile(29, "BUTCHER");
}
for(i=0;i<5;i++){
  let temp=empty2.splice(Math.floor(Math.random()*empty2.length)-1,1);

  section[0][temp[0][0]][temp[0][1]]=generateBasicTile(31, "TAILOR");
  section[1][temp[0][0]][temp[0][1]]=generateBasicTile(30, "ARMORY");
}
for(i=0;i<5;i++){
  let temp=empty2.splice(Math.floor(Math.random()*empty2.length)-1,1);

  section[0][temp[0][0]][temp[0][1]]=generateBasicTile(32, "JEWELER");
  section[1][temp[0][0]][temp[0][1]]=generateBasicTile(32, "JEWELER");
}





while(empty2.length>0){
  let temp=empty2.splice(Math.floor(Math.random()*empty2.length)-1,1);

  let ran = Math.floor(Math.random()*6);

  if(ran == 0){
    section[0][temp[0][0]][temp[0][1]]=generateBasicTile(0, "PUBLIC PARK");
    section[1][temp[0][0]][temp[0][1]]=generateBasicTile(0, "ABANDONED BUILDING");
  } else {
  section[0][temp[0][0]][temp[0][1]]=generateBasicTile(45, "APPARTMENT");
  section[1][temp[0][0]][temp[0][1]]=generateBasicTile(45, "SLUMS");
}
}


for(i=0;i<2;i++){
  let temp=empty.splice(Math.floor(Math.random()*empty.length)-1,1);

  section[2][temp[0][0]][temp[0][1]]=generateBasicTile(14, "POLICE STATION");
  section[3][temp[0][0]][temp[0][1]]=generateBasicTile(14, "POLICE STATION");
}
for(i=0;i<1;i++){
  let temp=empty.splice(Math.floor(Math.random()*empty.length)-1,1);

  section[2][temp[0][0]][temp[0][1]]=generateBasicTile(17, "HOSPITAL");
  section[3][temp[0][0]][temp[0][1]]=generateBasicTile(17, "HOSPITAL");
}
for(i=0;i<2;i++){
  let temp=empty.splice(Math.floor(Math.random()*empty.length)-1,1);

  section[2][temp[0][0]][temp[0][1]]=generateBasicTile(19, "POST OFFICE");
  section[3][temp[0][0]][temp[0][1]]=generateBasicTile(19, "POST OFFICE");
}
for(i=0;i<4;i++){
  let tempRan = Math.floor(Math.random()*empty.length)-1;
  let temp=empty.splice(tempRan,1);

  section[2][temp[0][0]][temp[0][1]]=generateBasicTile(1, "DUNGEON ENTRANCE");
  section[3][temp[0][0]][temp[0][1]]=generateBasicTile(1, "DUNGEON ENTRANCE");
  section[4][temp[0][0]][temp[0][1]]=generateBasicTile(1, "DUNGEON EXIT");
  section[7][temp[0][0]][temp[0][1]]=generateBasicTile(1, "DUNGEON EXIT");

  empty3.splice(empty3.findIndex(tile => tile[0] == temp[0][0] && tile[1] == temp[0][1]),1)
}
for(i=0;i<5;i++){
  let temp=empty.splice(Math.floor(Math.random()*empty.length)-1,1);

  section[2][temp[0][0]][temp[0][1]]=generateBasicTile(26, "RESTAURANT");
  section[3][temp[0][0]][temp[0][1]]=generateBasicTile(26, "RESTAURANT");
}
for(i=0;i<5;i++){
  let temp=empty.splice(Math.floor(Math.random()*empty.length)-1,1);

  section[2][temp[0][0]][temp[0][1]]=generateBasicTile(27, "GENERAL STORE");
  section[3][temp[0][0]][temp[0][1]]=generateBasicTile(27, "GENERAL STORE");
}
for(i=0;i<5;i++){
  let temp=empty.splice(Math.floor(Math.random()*empty.length)-1,1);

  section[2][temp[0][0]][temp[0][1]]=generateBasicTile(32, "JEWELER");
  section[3][temp[0][0]][temp[0][1]]=generateBasicTile(32, "JEWELER");
}

for(i=0;i<1;i++){
  let temp=empty.splice(Math.floor(Math.random()*empty.length)-1,1);

  section[2][temp[0][0]][temp[0][1]]=generateBasicTile(33, "TIME MONUMENT");
  section[3][temp[0][0]][temp[0][1]]=generateBasicTile(33, "TIME MONUMENT");
}
for(i=0;i<1;i++){
  let temp=empty.splice(Math.floor(Math.random()*empty.length)-1,1);

  section[2][temp[0][0]][temp[0][1]]=generateBasicTile(34, "SPACE MONUMENT");
  section[3][temp[0][0]][temp[0][1]]=generateBasicTile(34, "SPACE MONUMENT");
}
for(i=0;i<1;i++){
  let temp=empty.splice(Math.floor(Math.random()*empty.length)-1,1);

  section[2][temp[0][0]][temp[0][1]]=generateBasicTile(35, "LIGHT MONUMENT");
  section[3][temp[0][0]][temp[0][1]]=generateBasicTile(35, "LIGHT MONUMENT");
}
for(i=0;i<1;i++){
  let temp=empty.splice(Math.floor(Math.random()*empty.length)-1,1);

  section[2][temp[0][0]][temp[0][1]]=generateBasicTile(36, "VOID MONUMENT");
  section[3][temp[0][0]][temp[0][1]]=generateBasicTile(36, "VOID MONUMENT");
}
for(i=0;i<1;i++){
  let temp=empty.splice(Math.floor(Math.random()*empty.length)-1,1);

  section[2][temp[0][0]][temp[0][1]]=generateBasicTile(37, "LIFE MONUMENT");
  section[3][temp[0][0]][temp[0][1]]=generateBasicTile(37, "LIFE MONUMENT");
}
for(i=0;i<1;i++){
  let temp=empty.splice(Math.floor(Math.random()*empty.length)-1,1);

  section[2][temp[0][0]][temp[0][1]]=generateBasicTile(38, "DOOM MONUMENT");
  section[3][temp[0][0]][temp[0][1]]=generateBasicTile(38, "DOOM MONUMENT");
}
for(i=0;i<1;i++){
  let temp=empty.splice(Math.floor(Math.random()*empty.length)-1,1);

  section[2][temp[0][0]][temp[0][1]]=generateBasicTile(39, "BREATH MONUMENT");
  section[3][temp[0][0]][temp[0][1]]=generateBasicTile(39, "BREATH MONUMENT");
}
for(i=0;i<1;i++){
  let temp=empty.splice(Math.floor(Math.random()*empty.length)-1,1);

  section[2][temp[0][0]][temp[0][1]]=generateBasicTile(40, "BLOOD MONUMENT");
  section[3][temp[0][0]][temp[0][1]]=generateBasicTile(40, "BLOOD MONUMENT");
}
for(i=0;i<1;i++){
  let temp=empty.splice(Math.floor(Math.random()*empty.length)-1,1);

  section[2][temp[0][0]][temp[0][1]]=generateBasicTile(41, "HOPE MONUMENT");
  section[3][temp[0][0]][temp[0][1]]=generateBasicTile(41, "HOPE MONUMENT");
}
for(i=0;i<1;i++){
  let temp=empty.splice(Math.floor(Math.random()*empty.length)-1,1);

  section[2][temp[0][0]][temp[0][1]]=generateBasicTile(42, "RAGE MONUMENT");
  section[3][temp[0][0]][temp[0][1]]=generateBasicTile(42, "RAGE MONUMENT");
}
for(i=0;i<1;i++){
  let temp=empty.splice(Math.floor(Math.random()*empty.length)-1,1);

  section[2][temp[0][0]][temp[0][1]]=generateBasicTile(43, "MIND MONUMENT");
  section[3][temp[0][0]][temp[0][1]]=generateBasicTile(43, "MIND MONUMENT");
}
for(i=0;i<1;i++){
  let temp=empty.splice(Math.floor(Math.random()*empty.length)-1,1);

  section[2][temp[0][0]][temp[0][1]]=generateBasicTile(44, "HEART MONUMENT");
  section[3][temp[0][0]][temp[0][1]]=generateBasicTile(44, "HEART MONUMENT");
}

while(empty.length>0){
  let temp=empty.splice(Math.floor(Math.random()*empty.length)-1,1);

  let ran = Math.floor(Math.random()*6);

  if(ran == 0){
    section[2][temp[0][0]][temp[0][1]]=generateBasicTile(0, "PUBLIC PARK");
    section[3][temp[0][0]][temp[0][1]]=generateBasicTile(0, "ABANDONED BUILDING");
  } else {
  section[2][temp[0][0]][temp[0][1]]=generateBasicTile(45, "APPARTMENT");
  section[3][temp[0][0]][temp[0][1]]=generateBasicTile(45, "SLUMS");
}
}

  for(i=0;i<3;i++){
    let tempRan = Math.floor(Math.random()*empty3.length)-1;
    let temp=empty3.splice(tempRan,1);

    section[4][temp[0][0]][temp[0][1]]=generateBasicTile(46, "DESCENDING STAIRS");
    section[7][temp[0][0]][temp[0][1]]=generateBasicTile(46, "DESCENDING STAIRS");
    section[5][temp[0][0]][temp[0][1]]=generateBasicTile(47, "ASCENDING STAIRS");
    section[8][temp[0][0]][temp[0][1]]=generateBasicTile(47, "ASCENDING STAIRS");

    empty4.splice(empty4.findIndex(tile => tile[0] == temp[0][0] && tile[1] == temp[0][1]),1)
  }

  for(i=0;i<2;i++){
    let tempRan = Math.floor(Math.random()*empty4.length)-1;
    let temp=empty4.splice(tempRan,1);

    section[5][temp[0][0]][temp[0][1]]=generateBasicTile(46, "DOWNSTAIRS ENTRANCE");
    section[8][temp[0][0]][temp[0][1]]=generateBasicTile(46, "DOWNSTAIRS ENTRANCE");
    section[6][temp[0][0]][temp[0][1]]=generateBasicTile(47, "ASCENDING STAIRS");
    section[9][temp[0][0]][temp[0][1]]=generateBasicTile(47, "ASCENDING STAIRS");

    empty5.splice(empty5.findIndex(tile => tile[0] == temp[0][0] && tile[1] == temp[0][1]),1)
  }

//tossing in the sac slabs, stealing the light aspect symbol for now.
  let tempRan = Math.floor(Math.random()*empty4.length)-1;
  let temp=empty4.splice(tempRan,1);
  section[6][temp[0][0]][temp[0][1]]=generateBasicTile(35, "SACRIFICIAL SLAB");
  section[9][temp[0][0]][temp[0][1]]=generateBasicTile(35, "SACRIFICIAL SLAB");
  empty5.splice(empty5.findIndex(tile => tile[0] == temp[0][0] && tile[1] == temp[0][1]),1)

  while(empty3.length>0){
    let temp=empty3.splice(Math.floor(Math.random()*empty3.length)-1,1);
    section[4][temp[0][0]][temp[0][1]]=generateBasicTile(15, "PRISON CELL");
    section[7][temp[0][0]][temp[0][1]]=generateBasicTile(15, "PRISON CELL");
  }
  while(empty4.length>0){
    let temp=empty4.splice(Math.floor(Math.random()*empty4.length)-1,1);
    section[5][temp[0][0]][temp[0][1]]=generateBasicTile(15, "PRISON CELL");
    section[8][temp[0][0]][temp[0][1]]=generateBasicTile(15, "PRISON CELL");
  }
  while(empty5.length>0){
    let temp=empty5.splice(Math.floor(Math.random()*empty5.length)-1,1);
    section[6][temp[0][0]][temp[0][1]]=generateBasicTile(15, "PRISON CELL");
    section[9][temp[0][0]][temp[0][1]]=generateBasicTile(15, "PRISON CELL");
  }

  return section;
}



exports.hackyMoonGen = function(client,castleLocal,towerLocal,message) {
	const PROSPIT = 0;
	const DERSE = 1;
	const PLANETS = [PROSPIT, DERSE];

	const PROSPIT_MOON = 2;
	const DERSE_MOON = 3;
	const MOONS = [PROSPIT_MOON, DERSE_MOON];
	
	const PROSPIT_MAIN = [PROSPIT, PROSPIT_MOON];

	const DUNGEON_1 = 4;
	const DUNGEON_2 = 5;
	const DUNGEON_3 = 6;
	const DUNGEONS = [DUNGEON_1, DUNGEON_2, DUNGEON_3];

	const SLAB_DUNGEON = DUNGEON_3;

  //generates everything needed for both moons.
  let section = [[],[],[],[],[],[],[]];

  // The dungeons are completely identical, and can be created in a truly simultaneous manner.
  for(let i=0; i<PROSPIT_DUNGEONS.length; i++){
    section.push(section[PROSPIT_DUNGEONS[i]]);
  }

/*
  for(i=0;i<11;i++){
	// While the hackiness of these lines can be applied to rooms within a line,
	// it cannot be applied to lines within a map.
	// As a result, we must actually produce each line individually.
	//  (If we really wanted, we could make an exception for lines 2 and 8, as well as 5 in the dungeons.)
	//  (But that's more trouble than it's worth.)
    section[0].push(generateEmptyLineHackily("STREET",10));
    section[1].push(generateEmptyLineHackily("ALLEYWAY",10));
    section[2].push(generateEmptyLineHackily("STREET",10));
    section[3].push(generateEmptyLineHackily("ALLEYWAY",10));
  }
*/

  for(let j=PROSPIT_DUNGEONS[0]; j<PROSPIT_DUNGEONS[PROSPIT_DUNGEONS.length - 1]; j++)
  {
    section[j] = generatePrisonBlockHackily();
  }

  let castle = [,,,,,,,,,,];

  for(i=0;i<11;i++){
    castle[j] = (generateEmptyLine("OUT OF BOUNDS",7));
  }

  let select = [0,1,3,4,6,7,9,10]
  let empty1 = [,,,,,,,];	// Used to identify available space for worldgen on the dream moons
  let empty2 = [,,,,,,,];	// Used to identify available space for worldgen on the dream planets
  let empty3 = [,,,,,,,];	// Used to identify available space for worldgen in the first and second dungeons
  let empty4 = [,,,,,,,];	// Used to identify available space for worldgen in the second and third dungeons

  for(i=0;i<8;i++){
    for(j=0;j<8;j++){
      empty1 = [select[i],select[j]];
      empty2 = [select[i],select[j]];
      empty3 = [select[i],select[j]];
      empty4 = [select[i],select[j]];
    }
  }

  empty1.splice(select.indexOf(towerLocal[0])*8+select.indexOf(towerLocal[1]), 1);
  empty2.splice(select.indexOf(castleLocal[0])*8+select.indexOf(castleLocal[1]),1);

  {
	let chain = generateBasicTile(13, "CHAIN");
	for(let i=0; i<ALL_MAIN.length; i++){
	  section[i][5][5]=chain;
	}
  }

  let transLocal=[5,4];
  //castle generation
  castle[5][5]=[12,1,[[[],[],"CASTLE ENTRANCE",true,[],[]]]];
  castle[4][5]=[10,1,[[[],[],"HALL",true,[],[]]]];
  castle[3][5]=[8,1,[[[],[],"THRONE ROOM",true,[],[]]]];
  castle[5][4]=[19,1,[[[],[],"TRANSPORTALIZER HUB",true,[],[]]]];

  // While these are literally the same castle, everything that distinguishes them from each other comes later.
  // The castles are generated at initialization-time, before transportalizers are added to the hubs.
  // Likewise, there's no actual logic to the castle entrance, as that's based on the mappings of the castles in the medium.
  // Thus, the castles are identical in literally every way at this time.
  // And, more importantly: before ANY changes are made to any part of either castle, these arrays are serialized and stored in the database.
  // Once there, the castles become distinct from each other.
  section.push(castle[0]);
  section.push(castle[0]);
  section.push(transLocal);
  //end castle generation


//Prospit / Derse Main
let station = generateBasicTile(14, "POLICE STATION");
let prison = generateBasicTile(15, "PRISON");
let court = generateBasicTile(16, "COURT");
let hospital = generateBasicTile(17, "HOSPITAL");
let bank=generateBasicTile(18, "BANK");
let postOffice=generateBasicTile(19, "POST OFFICE");
let outpost=generateBasicTile(20, "MILITARY OUTPOST");
let guildHall=generateBasicTile(21, "GUILD HALL");
let theatre=generateBasicTile(22, "THEATRE");

let museum=generateBasicTile(24, "MUSEUM");
let library=generateBasicTile(25, "LIBRARY");
let restaurant=generateBasicTile(26, "RESTAURANT");
let jeweler=generateBasicTile(32, "JEWELER");

// Yes, even this can get duplicated thanks to hackiness.
let generalStore = generateBasicTile(27, "GENERAL STORE");



// First, generate features common to both Prospit and Derse.
let randomPlanetX = [];
let randomPlanetY = [];
for(let i=0; i<42; i++){
	let temp = empty2.splice(Math.random()*empty2.length,1)[0];
	randomPlanetY.push(temp[0]);
	randomPlanetX.push(temp[1]);
}

// One of each of these
{
	section[PROSPIT][randomPlanetY.pop()][randomPlanetX.pop()]=prison;
	section[PROSPIT][randomPlanetY.pop()][randomPlanetX.pop()]=theatre;
	section[PROSPIT][randomPlanetY.pop()][randomPlanetX.pop()]=museum;
	section[PROSPIT][randomPlanetY.pop()][randomPlanetX.pop()]=guildHall;
	section[PROSPIT][randomPlanetY.pop()][randomPlanetX.pop()]=bank;
	section[PROSPIT][randomPlanetY.pop()][randomPlanetX.pop()]=hospital;
	section[PROSPIT][randomPlanetY.pop()][randomPlanetX.pop()]=court;
	section[PROSPIT][randomPlanetY.pop()][randomPlanetX.pop()]=library;
}

// Two of each of these
for(i=0;i<2;i++){
  section[PROSPIT][randomPlanetY.pop()][randomPlanetX.pop()]=station;
  section[PROSPIT][randomPlanetY.pop()][randomPlanetX.pop()]=postOffice;
}

// Four of these
for(i=0;i<4;i++){
  section[PROSPIT][randomPlanetY.pop()][randomPlanetX.pop()]=outpost;
}

// Five of each of these
for(i=0;i<5;i++){
  section[PROSPIT][randomPlanetY.pop()][randomPlanetX.pop()]=restaurant;
  section[PROSPIT][randomPlanetY.pop()][randomPlanetX.pop()]=generalStore;
  section[PROSPIT][randomPlanetY.pop()][randomPlanetX.pop()]=jeweler;
}





// Then, split into distinct planets.
section[DERSE] = createDeepishCopy(section[PROSPIT]);

// Lastly, generate features that are specific to Prospit or Derse.
section[PROSPIT][castleLocal[0]][castleLocal[1]]=[12,1,[[[],[],"PROSPIT CASTLE",true,[],[]]]];
section[DERSE][castleLocal[0]][castleLocal[1]]=[12,1,[[[],[],"DERSE CASTLE",true,[],[]]]];




let bingo = generateBasicTile(23, "BINGO HALL");
let casino = generateBasicTile(23, "CASINO");
let candy = generateBasicTile(28, "CANDY SHOP");
let butcher = generateBasicTile(29, "BUTCHER");
let tailor = generateBasicTile(31, "TAILOR");
let armory = generateBasicTile(30, "ARMORY");

// Only one of each of these
{
  let temp= [randomPlanetY.pop(), randomPlanetX.pop()];
  section[PROSPIT][temp[0]][temp[1]]=bingo;
  section[DERSE][temp[0]][temp[1]]=casino;
}

// Five of each of these
for(i=0;i<5;i++){
  let temp= [randomPlanetY.pop(), randomPlanetX.pop()];
  section[PLANETS[0]][temp[0]][temp[1]]=candy;
  section[PLANETS[1]][temp[0]][temp[1]]=butcher;
  
  temp= [randomPlanetY.pop(), randomPlanetX.pop()];
  section[PLANETS[0]][temp[0]][temp[1]]=tailor;
  section[PLANETS[1]][temp[0]][temp[1]]=armory;
}





while(empty2.length>0){
  let temp=empty2.splice(Math.random()*empty2.length,1);

  let ran = Math.floor(Math.random()*6);

  if(ran == 0){
    section[0][temp[0][0]][temp[0][1]]=generateBasicTile(0, "PUBLIC PARK");
    section[1][temp[0][0]][temp[0][1]]=generateBasicTile(0, "ABANDONED BUILDING");
  } else {
  section[0][temp[0][0]][temp[0][1]]=generateBasicTile(45, "APPARTMENT");
  section[1][temp[0][0]][temp[0][1]]=generateBasicTile(45, "SLUMS");
}
}



// Next, the moons
for(i=0;i<2;i++){
  let temp=empty1.splice(Math.random()*empty1.length,1);
  section[2][temp[0][0]][temp[0][1]]=station
}

for(i=0;i<1;i++){
  let temp=empty1.splice(Math.random()*empty1.length,1);
  section[2][temp[0][0]][temp[0][1]]=hospital
}

for(i=0;i<2;i++){
  let temp=empty1.splice(Math.random()*empty1.length,1);
  section[2][temp[0][0]][temp[0][1]]=postOffice;
}


for(i=0;i<4;i++){
  let tempRan = Math.floor(Math.random()*empty1.length)-1;
  let temp=empty1.splice(tempRan,1);

  section[PROSPIT_MOON][temp[0][0]][temp[0][1]]=generateBasicTile(1, "DUNGEON ENTRANCE");
  section[DUNGEONS[0]][temp[0][0]][temp[0][1]]=generateBasicTile(1, "DUNGEON EXIT");

  empty3.splice(empty3.findIndex(tile => tile[0] == temp[0][0] && tile[1] == temp[0][1]),1)
}

for(i=0;i<5;i++){
  let temp=empty1.splice(Math.random()*empty1.length,1);
  section[PROSPIT_MOON][temp[0][0]][temp[0][1]]=restaurant;
}

for(i=0;i<5;i++){
  let temp=empty1.splice(Math.random()*empty1.length,1);
  section[PROSPIT_MOON][temp[0][0]][temp[0][1]]=generalStore;
}

for(i=0;i<5;i++){
  let temp=empty1.splice(Math.random()*empty1.length,1);
  section[PROSPIT_MOON][temp[0][0]][temp[0][1]]=generateBasicTile(32, "JEWELER");
}

for(let i=0; i<ASPECTS.length; i++){
  let temp=empty1.splice(Math.random()*empty1.length,1)[0];
  section[PROSPIT_MOON][temp[0]][temp[1]]=generateBasicTile(33 + i, `${ASPECTS[i]} MONUMENT`);
}

// Split into two distinct moons
section[DERSE_MOON] = createDeepishCopy(section[PROSPIT_MOON]);
section[PROSPIT_MOON][towerLocal[0]][towerLocal[1]]=generateBasicTile(11,"PROSPIT TOWER BASE",true);
section[DERSE_MOON][towerLocal[0]][towerLocal[1]]=generateBasicTile(11,"DERSE TOWER BASE",true);

while(empty1.length>0){
	let temp=empty1.splice(Math.random()*empty1.length,1)[0];

	if(Math.floor(Math.random()*6) == 0){
		section[PROSPIT_MOON][temp[0]][temp[1]]=generateBasicTile(0, "PUBLIC PARK");
		section[DERSE_MOON][temp[0]][temp[1]]=generateBasicTile(0, "ABANDONED BUILDING");
	} else {
		section[PROSPIT_MOON][temp[0]][temp[1]]=generateBasicTile(45, "APPARTMENT");
		section[DERSE_MOON][temp[0]][temp[1]]=generateBasicTile(45, "SLUMS");
	}
}

  for(i=0;i<3;i++){
    let temp=empty3.splice(Math.random()*empty3.length, 1);

    section[4][temp[0][0]][temp[0][1]]=generateBasicTile(46, "DESCENDING STAIRS");
    section[5][temp[0][0]][temp[0][1]]=generateBasicTile(47, "ASCENDING STAIRS");

    empty4.splice(empty4.findIndex(tile => tile[0] == temp[0][0] && tile[1] == temp[0][1]),1)
  }

  for(i=0;i<2;i++){
    let temp=empty4.splice(Math.floor(Math.random()*empty4.length),1)[0];

    section[5][temp[0]][temp[1]]=generateBasicTile(46, "DOWNSTAIRS ENTRANCE");
    section[6][temp[0]][temp[1]]=generateBasicTile(47, "ASCENDING STAIRS");
  }

//tossing in the sac slabs, stealing the light aspect symbol for now.
  let tempRan = Math.floor(Math.random()*empty4.length)-1;
  let temp=empty4.splice(tempRan,1)[0];
  section[SLAB_DUNGEON][temp[0]][temp[1]]=generateBasicTile(35, "SACRIFICIAL SLAB");
  
  for(let i=0; i<DUNGEONS.length; i++){
	section.push(section[DUNGEONS[i]]);
  }

  return section;
}


// A deep copy is a copy that recursively copies its contents, so that nothing in the result is a pointer to something in the original.
// The goal here is to create a deep-ISH copy, that only goes as deep as it needs to.
function createDeepishCopy(input, depth=1){
	// input.slice() returns a new array that is an exact copy of the exising array, but is still distinct from it.
	// Any pointers IN the array, however, will not be distinct. AKA, a shallow copy.
	if(depth <= 0){
		return input.slice();;
	}
	
	let retVal = [];
	for(let i=0; i<input.length; i++){
		retVal.push(createDeepishCopy(input[i], depth-1));
	}
	return retVal;
}



// Generates a basic "prison block" to be used as the groundwork for all moon dungeons.
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

// As above, but with pointer magics.
function generatePrisonBlockHackily(){
	let sec = [];
	let corridorLine = generateEmptyLineHackily("CORRIDOR", 10);
	let corridor = generateBasicTile(10, "CORRIDOR");
	let cell = generateBasicTile(15, "PRISON CELL");
	for(let i=0; i<11; i++){
		if(i % 3 == 2){
			sec.push(corridorLine);
			continue;
		}
		
		let row = [,,,,,,,,,,];
		for(let j=0; j<11; j++){
			if(j % 3 == 2){
				row[j]=corridor;
			}
			else{
				row[j]=cell;
			}
		}
		sec.push(row);
	}
	return sec;
}

// Returns a line of tiles where every tile is a reference to the exact same tile.
// Useful in situations where you plan on every tile being either replaced, or serialized without any further modification.
function generateEmptyLineHackily(name, tile, explored = false, length = 11){
	let retVal = [];
	let room = generateBasicTile(tile, name, explored);
	for(let i=0; i<length; i++){
		retVal.push(room);
	}
	return retVal;
}

// Returns a line of tiles where every tile is a unique reference.
// Useful if you want to do it the right way, or if you just plan on modifying the contents of those tiles.
function generateEmptyLine(name, tile, explored = false, length = 11){
	let retVal = [];
	for(let i=0; i<length; i++){
		retVal.push(generateBasicTile(tile, name, explored));
	}
	return retVal;
}

function generateBasicTile(icon, name, explored = false){
	return [
		icon,	// The image used to represent this tile. Sometimes carries other information, like the fact that a given tile is a wall.
		1,		// The number of rooms in a tile. This is ALMOST always 1.
		// The actual room array.
		[
			// The one (and only) room within this tile
			[
				[],		    // Shop inventory
				[],		    // An array of strings that represent functions to be called when certain events occur in or to the room. (Currently unusued.)
				name,	    // The name of this room.
				explored,	// Whether this room has already been explored/visited.
				[],		    // List of all creatures in the room
				[]		    // List of all items in the room
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
     case "bf":
     landname = `BATTLEFIELD`;
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
      if(tile!=2&&client.configcall.get(client, message, "FOG")==0&&!input[i][j][2][0][3]&&local[0]!="p"&&local[0]!="d"&&local[0]!="pm"&&local[0]!="dm"&&local[0]!="pc"&&local[0]!="dc"){
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
//message.channel.send(attachment);
return attachment;
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
