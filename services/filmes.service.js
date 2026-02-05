const axios = require("axios");

async function buscarFilmesPython() {
  if (!process.env.FILMES_URL) {
    throw new Error("FILMES_URL não configurada");
  }

  const response = await axios.get(process.env.FILMES_URL, {
    timeout: 5000,
  });

  if (!Array.isArray(response.data)) {
    throw new Error("Resposta do Python não é um array");
  }

  return response.data;
}

module.exports = { buscarFilmesPython };
