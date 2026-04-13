const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("../frontend"));
app.use(cors());

function readFile() {
  try {
    const file = fs.readFileSync("combat.json");
    return JSON.parse(file);
  } catch (error) {
    console.error(error);
    return null;
  }
}

function writeFile(combat) {
  fs.writeFileSync("combat.json", JSON.stringify(combat, null, 4));
}

function updateStatus(isHealth, req, res) {
  const { name, newStatus } = req.body;
  const participant = combat.participants.find((p) => p.name === name);
  if (participant) {
    if (isHealth) {
      participant.health = newStatus;
    } else {
      participant.mana = newStatus;
    }
    writeFile(combat);
    res.json(combat);
  } else {
    res.status(404).json({ error: "Jogador não encontrado" });
  }
}

let combat = readFile() || {
  turn: 0,
  participants: [],
};

app.get("/combat", (req, res) => {
  res.json(combat);
});

app.post("/combat/add", (req, res) => {
  const { name, initiative, health, mana } = req.body;
  combat.participants.push({ name, initiative, health, mana });
  console.log("Recebido informações do jogador!", combat);
  combat.participants.sort((a, b) => b.initiative - a.initiative);
  writeFile(combat);
  res.json(combat);
});

app.patch("/combat/update/health", (req, res) => {
  updateStatus(true, req, res);
});

app.patch("/combat/update/mana", (req, res) => {
  updateStatus(false, req, res);
});

app.post("/combat/next", (req, res) => {
  combat.turn = (combat.turn + 1) % combat.participants.length;
  writeFile(combat);
  res.json(combat);
});

app.delete("/combat", (req, res) => {
  combat.participants = combat.participants.filter(
    (participant) => participant.name !== req.body.name,
  );
  writeFile(combat);
  res.json(combat);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});