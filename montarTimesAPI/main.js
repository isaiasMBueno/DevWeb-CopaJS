var _allTeams = [];
var _allPlayers = [];
var _selectedTeam = "";
var count = 1;
function LoadForm() {

  for (let value in posicoesConfig.Posicoes) {
    selectFormacao.append(new Option(posicoesConfig.Posicoes[value].NomePosicao));
  }
  setPosicaoJogadores("");

  const selectTime = document.getElementById("selectTime");

  $.ajax({
    url: "https://soccer.sportmonks.com/api/v2.0/countries?api_token=wJVutxYKJdFCVYEG7zw6mTUhpFdzksYeUE4SkUWdyfouuxGX4TMwXi0flBXh",
  }).then(function (data) {
    $(data.data)
      .each(function () {
        _allTeams.push(this);
        if (this.extra != null) {
          selectTime.append(new Option(this.name + " - " + this.extra.iso2, this.id));
        }
      });
  });
}

LoadForm();


function setPosicaoJogadores(value) {
  console.log(value);
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
}

function GetPosicaoJogador(value) {
  switch (value) {
    case 1:
      return "Goleiro";
    case 2:
      return "Zagueiro";
    case 3:
      return "Meio-Campo";
    case 4:
      return "Atacante";
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
  // var nomeJogador = this.GetNome(idValue, positionValue).replace(" ", "+");
  // var posicaoJogador = this.GetPosicaoJogador(_allTeams[_selectedTeam].Jogadores[positionValue].Posicao);
  // window.open(
  //   'https://www.google.com/search?q=' + nomeJogador + "+" + posicaoJogador + "+seleção+" + _selectedTeam,
  //   "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,width=900,height=500");
}

function onChangeValueSelect(selectedValue) {
  document.getElementById("divTime").innerHTML = "";
  _selectedTeam = _allTeams.find(x => x.id == selectedValue.value);
  let listJogadores = document.getElementById('listJogadores');
  listJogadores.innerHTML = "";


  const bd = document.createElement("svg");

  bd.innerHTML = _selectedTeam.extra.flag;



  bd.setAttribute("widht", "150px");
  bd.setAttribute("heigth", "94px");

  if (_selectedTeam == null || _selectedTeam == "" || _selectedTeam.extra == null) {
  } else {
    document.getElementById("divTime").appendChild(bd);
  }
  count = 1;

  $.ajax({
    url: "https://soccer.sportmonks.com/api/v2.0/countries/" + selectedValue.value + "/players?api_token=wJVutxYKJdFCVYEG7zw6mTUhpFdzksYeUE4SkUWdyfouuxGX4TMwXi0flBXh",
  }).then(function (data) {
    $(data.data)
      .each(function () {
        _allPlayers.push(this);

        if (count < 12) {
          document.getElementById('b' + count).style.backgroundImage = "url(" + this.image_path + ")";
        }

          let linha = document.createElement('tr');
          linha.addEventListener('click', function () {
            selectJogador(count);
          });

          let col1 = document.createElement('td');
          col1.innerText = count;

          let col2 = document.createElement('td');
          col2.innerText = this.display_name;

          let col3 = document.createElement('td');
          col3.innerText = GetPosicaoJogador(this.position_id);

          linha.append(col1, col2, col3)
          listJogadores.appendChild(linha);
        count++;
      });

  });



}

function onChangeValueSelectFormacao(selectedValue) {
  document.getElementById("posicao").innerText = selectedValue.value;
  setPosicaoJogadores(selectedValue.value);
}