window.addEventListener("DOMContentLoaded", () => {
  const db = firebase.database();
  const container = document.getElementById("ingressos-container");

  function criarCompradorHTML(comprador, precoIngresso) {
    const total = precoIngresso * comprador.quantidade;
    return `
      <div class="comprador">
        <strong>Nome:</strong> ${comprador.nome}<br>
        <strong>Email:</strong> ${comprador.email}<br>
        <strong>Quantidade:</strong> ${comprador.quantidade}<br>
        <strong>Valor gasto:</strong> R$${total.toFixed(2)}
      </div>
    `;
  }

  function criarIngressoHTML(ingresso, compradoresHTML, totalArrecadado) {
    return `
      <div class="ingresso">
        <h3>${ingresso.nome}</h3>
        <p><strong>Quantidade disponível:</strong> ${ingresso.quantidade}</p>
        <p><strong>Preço:</strong> R$${ingresso.preco.toFixed(2)}</p>
        <p><strong>Total arrecadado:</strong> R$${totalArrecadado.toFixed(2)}</p>
        <div class="compradores-lista">
          <h4>Compradores:</h4>
          ${compradoresHTML || "<p>Nenhum comprador ainda.</p>"}
        </div>
      </div>
    `;
  }

  db.ref("ingressos").on("value", async (snapshot) => {
    container.innerHTML = "";

    const ingressos = snapshot.val();
    if (!ingressos) {
      container.innerHTML = "<p>Nenhum ingresso cadastrado.</p>";
      return;
    }

    for (const key in ingressos) {
      if (ingressos.hasOwnProperty(key)) {
        const ingresso = ingressos[key];

        const comprasSnapshot = await db.ref("compras")
          .orderByChild("tipo")
          .equalTo(ingresso.nome)
          .once("value");
        const compras = comprasSnapshot.val();

        let compradoresHTML = "";
        let totalArrecadado = 0;

        if (compras) {
          for (const ckey in compras) {
            const comprador = compras[ckey];
            const totalComprador = comprador.quantidade * ingresso.preco;
            totalArrecadado += totalComprador;
            compradoresHTML += criarCompradorHTML(comprador, ingresso.preco);
          }
        }

        container.innerHTML += criarIngressoHTML(ingresso, compradoresHTML, totalArrecadado);
      }
    }
  });
});
