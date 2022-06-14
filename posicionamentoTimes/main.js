var _allTeams = {
  "Argentina": Argentina, "Bolivia": Bolivia, "Brasil": Brasil,
  "Chile": Chile, "Colombia": Colombia, "Equador": Equador,
  "Paraguai": Paraguai, "Peru": Peru, "Uruguai": Uruguai, "Venezuela": Venezuela
};
var _selectedTeam = "";

function LoadForm() {
  const selectTime = document.getElementById("selectTime");
  const selectFormacao = document.getElementById("selectFormacao");

  for (let value in _allTeams) {
    const newOption = new Option(value);
    newOption.setAttribute('data-thumbnail', 'assets/flags/brazil.svg')
    selectTime.append(newOption);
  }

  for (let value in posicoesConfig.Posicoes) {
    selectFormacao.append(new Option(posicoesConfig.Posicoes[value].NomePosicao));
  }

  setPosicaoJogadores("");
  if (_selectedTeam != null) {
    setJogadoresImage();
  }
}

LoadForm();

function setJogadoresImage() {
  let listJogadores = document.getElementById('listJogadores');
  listJogadores.innerHTML = "";

  if (_selectedTeam == null || _selectedTeam == "") {
    for (i = 1; i < 12; i++) {
      document.getElementById('b' + i).style.backgroundImage = "url('./assets/default.png')";
    }
    return;
  }
  var count = 1;
  _allTeams[_selectedTeam].Jogadores.map(jogador => {

    document.getElementById('b' + count).style.backgroundImage = jogador.Imagem;

    let linha = document.createElement('tr');
    linha.addEventListener('click', function () {
      selectJogador(jogador.Numero);
    });

    let col1 = document.createElement('td');
    col1.innerText = jogador.Numero;

    let col2 = document.createElement('td');
    col2.innerText = jogador.Nome;

    let col3 = document.createElement('td');
    col3.innerText = GetPosicaoJogador(jogador.Posicao);

    linha.append(col1, col2, col3)
    listJogadores.appendChild(linha);
    count++;
  })
}

function setPosicaoJogadores(value) {
  if (value == "null" || value == "") {
    for (i = 1; i < 12; i++) {
      document.getElementById('b' + i).style.display = "none";
    }
    return;
  }
  posicoesConfig.Posicoes.map(posicao => {
    if (posicao.NomePosicao == value) {
      posicao.Config.map(config => {
        var jogador = document.getElementById(config.Id);
        jogador.style.display = "block";
        jogador.style.left = config.Left;
        jogador.style.top = config.Top;
        jogador.style.position = "absolute";
      });
      return;
    }
  });
}

function GetNome(idValue, positionValue) {
  if (_selectedTeam == null || _selectedTeam == "") {
    document.getElementById(idValue).title = "?";
    return ('?');
  }

  document.getElementById(idValue).title = (
    _allTeams[_selectedTeam].Jogadores[positionValue].Nome
    + ", "
    + GetPosicaoJogador(_allTeams[_selectedTeam].Jogadores[positionValue].Posicao));
  return (_allTeams[_selectedTeam].Jogadores[positionValue].Nome);
}

function GetPosicaoJogador(value) {
  switch (value) {
    case "gol":
      return "Goleiro";
    case "lat":
      return "Lateral";
    case "zag":
      return "Zagueiro";
    case "mei":
      return "Meio-Campo";
    case "ata":
      return "Atacante";
    case "vol":
      return "Volante";
    case "cen":
      return "Centro-Avante";
  }
}

function onClickJogador(idValue, positionValue) {
  var nomeJogador = this.GetNome(idValue, positionValue).replace(" ", "+");
  if(nomeJogador == "?")
  {
      this.openModal("dv-modal");
      return;
  }

  var posicaoJogador = this.GetPosicaoJogador(_allTeams[_selectedTeam].Jogadores[positionValue].Posicao);
  window.open(
    'https://www.google.com/search?q=' + nomeJogador + "+" + posicaoJogador + "+seleção+" + _selectedTeam,
    "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,width=900,height=500");
}

function onChangeValueSelect(selectedValue) {
  _selectedTeam = selectedValue.value;
  document.getElementById("nomeTime").innerText = _selectedTeam;
  if (_selectedTeam == null || _selectedTeam == "") {
    document.getElementById("divTime").src = "assets/default.jpg";
    document.getElementById("divBrasao").src = "assets/default.jpg";
  } else {
    document.getElementById("divTime").src = _allTeams[_selectedTeam].ImagemTime;
    document.getElementById("divBrasao").src = _allTeams[_selectedTeam].BrasaoTime;
  }
  setJogadoresImage();
}

function onChangeValueSelectFormacao(selectedValue) {
  document.getElementById("posicao").innerText = selectedValue.value;
  setPosicaoJogadores(selectedValue.value);
}

function selectJogador(count) {
  for (let i = 1; i < 11; i++) {
    document.getElementById('b' + i).classList.remove("focus");
  }

  document.getElementById('b' + count).classList.add("focus");
}

function openModal(mn) {
  let modal = document.getElementById(mn);

  if (typeof modal == 'undefined' || modal === null)
      return;

  modal.style.display = 'Block';
  document.body.style.overflow = 'hidden';
}

function closeModal(mn) {
  let modal = document.getElementById(mn);

  if (typeof modal == 'undefined' || modal === null)
      return;

  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}