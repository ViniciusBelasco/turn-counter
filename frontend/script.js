const API = {
  getAll: "/combat",
  add: "/combat/add",
  next: "/combat/next",
  delete: "/combat",
  updateHealth: "/combat/update/health",
  updateMana: "/combat/update/mana",
}

async function atualizar() {
  const res = await fetch(API.getAll);
  const data = await res.json();

  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  data.participants.forEach((p, i) => {
    const li = document.createElement("li");

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "❌";
    btnDelete.onclick = () => {
      deletar( p );
    };

    const name = document.createElement("span");
    name.textContent = `${p.name}`;
    i === data.turn ? (name.style.fontWeight = "bold") : "";

    const btnMinusHealth = document.createElement("button");
    btnMinusHealth.textContent = "-";
    btnMinusHealth.onclick = () => changeStatus(true, p.health, p.name, true);

    const btnPlusHealth = document.createElement("button");
    btnPlusHealth.textContent = "+";
    btnPlusHealth.onclick = () => changeStatus(false, p.health, p.name, true);

    const hp = document.createElement("span");
    hp.textContent = `HP: ${p.health}`;

    const pm = document.createElement("span");
    pm.textContent = `PM: ${p.mana}`;

    const btnMinusMana = document.createElement("button");
    btnMinusMana.textContent = "-";
    btnMinusMana.onclick = () => changeStatus(true, p.mana, p.name, false);

    const btnPlusMana = document.createElement("button");
    btnPlusMana.textContent = "+";
    btnPlusMana.onclick = () => changeStatus(false, p.mana, p.name, false);

    li.appendChild(name);
    li.appendChild(hp);
    li.appendChild(btnMinusHealth);
    li.appendChild(btnPlusHealth);
    li.appendChild(pm);
    li.appendChild(btnMinusMana);
    li.appendChild(btnPlusMana);
    li.appendChild(btnDelete);
    lista.appendChild(li);
  });
}

async function adicionar() {
  const name = document.getElementById("nome").value;
  const initiative = Number(document.getElementById("iniciativa").value);
  const health = Number(document.getElementById("health").value);
  const mana = Number(document.getElementById("mana").value);

  await fetch(API.add, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, initiative, health, mana }),
  });

  atualizar();
}

function changeStatus(isDamage = true, status, name, isHealth = true) {
  let value = Number( prompt( "Qual valor será " + (isDamage ? "subtraído?" : "adicionado?"), ) );  
  status += isDamage ? -value : value;
  updateStatus(name, status, isHealth);
}

async function updateStatus(name, newStatus, isHealth) {
  await fetch( (isHealth ? API.updateHealth : API.updateMana), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, newStatus }),
  });

  atualizar();
}

async function deletar( p ) {
  const name = p.name

  await fetch(API.delete, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  atualizar();
}

async function proximo() {
  await fetch(API.next, { method: "POST" });
  atualizar();
}

atualizar();