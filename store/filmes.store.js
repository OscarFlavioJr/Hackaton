let filmes = [];

function setFilmes(novosFilmes) {
  filmes = novosFilmes;
}

function getFilmes() {
  return filmes;
}

module.exports = {
  setFilmes,
  getFilmes,
};
