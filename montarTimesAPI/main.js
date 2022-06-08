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




  const bd = document.createElement("svg");

  bd.innerHTML = _selectedTeam.extra.flag;



  bd.setAttribute("widht", "150px");
  bd.setAttribute("heigth", "94px");

  if (_selectedTeam == null || _selectedTeam == "" || _selectedTeam.extra == null) {
  } else {
    document.getElementById("divTime").appendChild(bd);
  }

  $.ajax({
    url: "https://soccer.sportmonks.com/api/v2.0/countries/" + selectedValue.value + "/players?api_token=wJVutxYKJdFCVYEG7zw6mTUhpFdzksYeUE4SkUWdyfouuxGX4TMwXi0flBXh",
  }).then(function (data) {
    $(data.data)
      .each(function () {
        _allPlayers.push(this);
        if(_allPlayers.length == 100){
          pushTablePlayers(_allPlayers);
        }
      });
  });

  // pushTablePlayers();


}

function pushTablePlayers(value){
  let listJogadores = document.getElementById('listJogadores');
  listJogadores.innerHTML = "";

  value = value.sort((a, b) => { return a.position_id - b.position_id;});

  console.log(value);

  for(let i = 1; i < value.length; i++)
  {

    if (i < 12) {
      document.getElementById('b' + i).style.backgroundImage = "url(" + value[i].image_path + ")";
    }

    let linha = document.createElement('tr');
    linha.addEventListener('click', function () {
      selectJogador(i);
    });

    let col1 = document.createElement('td');
    col1.innerText = i;

    let col2 = document.createElement('td');
    col2.innerText = value[i].display_name;

    let col3 = document.createElement('td');
    col3.innerText = GetPosicaoJogador(value[i].position_id);

    let col4 = document.createElement('td');
    col4.innerText = value[i].weight;

    let col5 = document.createElement('td');
    col5.innerText = value[i].height;

    let col6 = document.createElement('td');
    col6.innerText = value[i].birthdate;

    let col7 = document.createElement('td');
    col7.innerHTML = "<div class='jogador' style='background-image: url("+value[i].image_path+"')></div>";
    
    linha.append(col1, col2, col3, col4, col5, col6, col7)
    listJogadores.appendChild(linha);
  }
}

function onChangeValueSelectFormacao(selectedValue) {
  document.getElementById("posicao").innerText = selectedValue.value;
  setPosicaoJogadores(selectedValue.value);
}