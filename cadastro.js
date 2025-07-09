const form = document.getElementById("btnCadastrar");
const nomeInput = document.getElementById("nomeIngresso");
const quantidadeInput = document.getElementById("quantidade");
const precoInput = document.getElementById("preco");
const lista = document.getElementById("listaIngressos");

form.addEventListener("click", () => {
  const nome = nomeInput.value.trim();
  const quantidade = parseInt(quantidadeInput.value);
  const preco = parseFloat(precoInput.value);

  if (!nome || quantidade <= 0 || preco <= 0) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  db.ref("ingressos/" + nome).set({ nome, quantidade, preco });

  nomeInput.value = "";
  quantidadeInput.value = "";
  precoInput.value = "";
});

function carregarIngressos() {
  db.ref("ingressos").on("value", (snapshot) => {
    lista.innerHTML = "";
    snapshot.forEach(child => {
      const i = child.val();
      const li = document.createElement("li");

      const info = document.createElement("div");
      info.className = "ingresso-info";
      info.innerHTML = `<strong>${i.nome}</strong><br>${i.quantidade} restantes<br>R$${i.preco}`;

      const btn = document.createElement("button");
      btn.textContent = "Excluir";
      btn.className = "btn-excluir";
      btn.onclick = () => {
        if (confirm(`Excluir ingresso "${i.nome}"?`)) {
          db.ref("ingressos/" + i.nome).remove();
        }
      };

      li.appendChild(info);
      li.appendChild(btn);
      lista.appendChild(li);
    });
  });
}

carregarIngressos();
