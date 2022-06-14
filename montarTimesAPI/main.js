var _allTeams = [];
var _allPlayers = [];
var _selectedTeam = "";
var _selectedPlayers = [];
var _count = 1;
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
  let nome= "";
  if (_selectedPlayers.length < 11) {
    switch(idValue) {
      case 'b1':
        nome = 'Goleiro';
        break;
      case 'b2':
        nome = 'Zagueiro 1';
        break;
      case 'b3':
        nome = 'Zagueiro 2';
        break;
      case 'b4':
        nome = 'Zagueiro 3';
        break;
      case 'b5':
        nome = 'Zagueiro 4';
        break;
      case 'b6':
        nome = 'Meio-Campo 1';
        break;
      case 'b7':
        nome = 'Meio-Campo 2';
        break;
      case 'b8':
        nome = 'Meio-Campo 3';
        break;        
      case 'b9':
        nome = 'Atacante 1';
        break;
      case 'b10':
        nome = 'Atacante 2';
        break;
      case 'b11':
        nome = 'Atacante 3';
        break;             
    }
  }else{
    nome = _selectedPlayers[positionValue].display_name;
  }

  document.getElementById(idValue).title = nome;
  return (nome);
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


function onChangeValueSelect(selectedValue) {
  document.getElementById("divTime").innerHTML = "";
  _allPlayers = [];
  _selectedPlayers = [];
  _count = 1;

  if(!selectedValue.value){
    document.getElementById("nomeTime").innerText = "";
    pushTablePlayers(null);
    return;
  }

  _selectedTeam = _allTeams.find(x => x.id == selectedValue.value);
  
  document.getElementById("nomeTime").innerText = _selectedTeam.name;



  const bd = document.createElement("svg");

  bd.innerHTML = _selectedTeam.extra.flag;


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
}

function pushTablePlayers(value){
  let listJogadores = document.getElementById('listJogadores');
  listJogadores.innerHTML = "";

  if(!value){
    return;
  }

  value = value.sort((a, b) => { return a.position_id - b.position_id;});

  for(let i = 1; i < value.length; i++)
  {
    let linha = document.createElement('tr');
    linha.addEventListener('click', function () {
      document.getElementById('b' + _count).classList.add("focus");
      selectJogador(value[i].player_id);
    });

    let col1 = document.createElement('td');
    col1.innerText = value[i].player_id;

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

function selectJogador(value){
  if(_count == 12){
    _count = 1;
  }

  if(window.confirm("Deseja substituir o " + GetNome('b'+_count, _count) + "?")){
    let jogador = document.getElementById('b'+_count);
    
    let dadosJogador = _allPlayers.find(x => x.player_id == value);
    _selectedPlayers.push(dadosJogador);
    jogador.style.backgroundImage = "url("+dadosJogador.image_path+")";
    jogador.title = jogador.display_name;
    document.getElementById('b' + _count).classList.remove("focus");
    _count++;
  }
}

function onClickJogador(idValue, positionValue) {
  var nomeJogador = this.GetNome(idValue, positionValue);
  window.open(
    'https://www.google.com/search?q=' + nomeJogador + "+seleção+" + _selectedTeam.name,
    "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,width=900,height=500");
}