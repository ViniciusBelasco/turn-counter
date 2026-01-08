const express = require("express");
const cors = require("cors");
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("../frontend"));
app.use(cors()); 

function readFile() {

    try {
        const file = fs.readFileSync('combat.json')
        return JSON.parse(file)
    } catch (error) {
        console.error(error)
        return null;
    }
}

function writeFile(combat) {
    const savefile = fs.writeFileSync('combat.json', JSON.stringify(combat, null, 4) )
}

let combat = readFile() || {
  turn: 0,
  participants: []
};

app.get("/combat", (req, res) => {
  res.json(combat);
});

app.post("/combat/add", (req, res) => {
  const { name, initiative } = req.body;
  combat.participants.push({ name, initiative });
  console.log('Recebido informações do jogador!', combat)
  combat.participants.sort((a, b) => b.initiative - a.initiative);
  writeFile(combat);
  res.json(combat);
});

app.post("/combat/next", (req, res) => {
  combat.turn = (combat.turn + 1) % combat.participants.length;
  writeFile(combat)
  res.json(combat);
});

app.delete("/combat", (req, res) => {
    combat.participants = combat.participants.filter((participant) => participant.name !== req.body.name);
    writeFile(combat)
    res.json(combat)
} )

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});