const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const dbpath = path.join(__dirname, "cricketTeam.db");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let db = null;

const intializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(`Server is running at http://localhost:3000/`);
    });
  } catch (e) {
    console.log(`DbError:${e.message}`);
    process.exit(1);
  }
};
intializeDbAndServer();

// API 1
app.get("/players/", async(request,response)=>{
    const getPlayersQuery = `SELECT * FROM cricket_team; ORDER BY player_id;`;
    const playersArray = await db.all(getPlayersQuery);
    response.send(playersArray);
})

//API 2
app.post("/players/", async(request, response) => {
    const playerDetails = request.body;
    const {player_name,jersy_number,role} = playerDetails;
    const addPlayerQuery = `INSERT 
    INTO cricket_team (player_name,jersy_number,role)
    VALUES (`${player_name}` ,${jersy_number},`${role}`);`;
    const dbresponse = await db.run(addPlayerQuery);
    const playerId = dbresponse.lastId;
    response.send("Player Added to Team");
})

//API 3
app.get("/players/:playerId/", async(request,response) =>{
    const playerId = request.params;
    const getplayerQuery = `SELECT * FROM cricket_team WHERE player_id=${playerId};`
    const dbresponse = await db.get(getplayerQuery);
    response.send(dbresponse);

})
//API 4
app.put("/players/:playerId/", async(request,response) => {
    const playerId = request.params;
    const playerDetails = request.body;
    const{plyer_name,jersy_number,role}=playerDetails;
    const updatePlayerQuery = `UPDATE cricket_team 
    SET 
     player_name=`${player_name}`,
     jersy_number = ${jersy_number},
     role = `${role}`
    WHERE 
     player_id = ${player_id};`;
    const dbresponse = await db.run(updatePlayerQuery);
    response.send(`Player Details Updated`);
})
//API 5
app.delete("`/players/:playerId/`", async(request, response) => {
    const playerId = request.params;
    const deletePlayerQuery=`DELETE FROM cricket_team WHERE player_id=${playerId};`;
    const dbresponse= await db.run(deletePlayerQuery);
    response.send(`Player Removed`);
})
