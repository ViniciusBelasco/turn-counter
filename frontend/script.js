async function atualizar() {
  const res = await fetch("/combat");
  const data = await res.json();

  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  data.participants.forEach((p, i) => {
    const li = document.createElement("li");

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "❌";
    btnDelete.onclick = () => {
      deletar();
    };

    const name = document.createElement("span");
    name.textContent = `${p.name}`;
    i === data.turn ? (name.style.fontWeight = "bold") : "";

    const btnMinus = document.createElement("button");
    btnMinus.textContent = "-";
    btnMinus.onclick = () => {
      p.health--;
      atualizar();
    };

    const btnPlus = document.createElement("button");
    btnPlus.textContent = "+";
    btnPlus.onclick = () => {
      p.health++;
      atualizar();
    };

    const hp = document.createElement("span");
    hp.textContent = `HP: ${p.health}`;

    // li.textContent =
    //   (i === data.turn ? "➡ " : "") + `${name.textContent} (${p.initiative}) HP:${p.health} PM: ${p.mana}`;

    li.appendChild(name);
    li.appendChild(hp);
    li.appendChild(btnMinus);
    li.appendChild(btnPlus);
    li.appendChild(btnDelete);
    lista.appendChild(li);
  });
}

async function adicionar() {
  const name = document.getElementById("nome").value;
  const initiative = Number(document.getElementById("iniciativa").value);
  const health = Number(document.getElementById("health").value);
  const mana = Number(document.getElementById("mana").value);

  await fetch("/combat/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, initiative, health, mana }),
  });

  atualizar();
}

async function deletar() {
  const name = document.getElementById("nome").value;

  await fetch("/combat", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  atualizar();
}

async function proximo() {
  await fetch("/combat/next", { method: "POST" });
  atualizar();
}

atualizar();
