async function atualizar() {
  const res = await fetch("/combat");
  const data = await res.json();

  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  data.participants.forEach((p, i) => {
    const li = document.createElement("li");
    li.textContent =
      (i === data.turn ? "➡ " : "") + `${p.name} (${p.initiative})`;
    lista.appendChild(li);
  });
}

async function adicionar() {
  const name = document.getElementById("nome").value;
  const initiative = Number(document.getElementById("iniciativa").value);

  await fetch("/combat/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, initiative })
  });

  atualizar();
}

async function deletar() {
  const name = document.getElementById("morto").value;

  await fetch("/combat", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  })

  atualizar();
}

async function proximo() {
  await fetch("/combat/next", { method: "POST" });
  atualizar();
}

atualizar();