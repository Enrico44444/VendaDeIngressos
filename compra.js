const select = document.getElementById("tipoIngresso");
const lista = document.getElementById("listaIngressos");
const precoEl = document.getElementById("preco");
const mensagem = document.getElementById("mensagem");
const quantidadeInput = document.getElementById("quantidade");

let ingressos = {};

// Carrega os tipos de ingresso e atualiza preço
db.ref("ingressos").on("value", (snapshot) => {
  select.innerHTML = "";
  lista.innerHTML = "";
  ingressos = {};

  snapshot.forEach(child => {
    const ing = child.val();
    ingressos[child.key] = ing;

    if (ing.quantidade > 0) {
      const opt = document.createElement("option");
      opt.value = child.key;
      opt.textContent = ing.nome;
      select.appendChild(opt);
    }

    const li = document.createElement("li");
    li.innerHTML = `<strong>${ing.nome}</strong><br>${ing.quantidade} disponíveis<br>R$${ing.preco}`;
    lista.appendChild(li);
  });

  atualizarPreco();
});

select.addEventListener("change", atualizarPreco);
quantidadeInput.addEventListener("input", atualizarPreco);

function atualizarPreco() {
  const tipo = select.value;
  const quantidade = parseInt(quantidadeInput.value) || 0;
  const precoUnitario = ingressos[tipo]?.preco || 0;
  precoEl.textContent = `R$${(precoUnitario * quantidade).toFixed(2)}`;
}

document.getElementById("btnComprar").addEventListener("click", () => {
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const tipo = select.value;
  const quantidade = parseInt(quantidadeInput.value);

  if (!nome || !email || !tipo || isNaN(quantidade) || quantidade <= 0) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  const ingressoRef = db.ref("ingressos/" + tipo);
  ingressoRef.once("value").then(snapshot => {
    const ing = snapshot.val();

    if (!ing || ing.quantidade < quantidade) {
      mensagem.textContent = "Ingressos insuficientes.";
      return;
    }

    ingressoRef.update({ quantidade: ing.quantidade - quantidade });
    db.ref("compras").push().set({ nome, email, tipo, quantidade });
    mensagem.textContent = "Compra realizada com sucesso!";
  });
});
