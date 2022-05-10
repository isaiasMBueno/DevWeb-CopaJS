var _listTimes = {"Brasil":Brasil, "Argentina":Argentina};

var _time = "";   

function LoadForm() {

    var selectTime = document.getElementById("selectTime");
    
    for(let value in _listTimes)
    {
        selectTime.append(new Option(value))
    }

    var selectFormacao = document.getElementById("selectFormacao");
    for(let value in posicoesConfig.Posicoes)
    {
        selectFormacao.append(new Option(posicoesConfig.Posicoes[value].NomePosicao));
    }

    this.SetPosicaoJogadores(""); 
    if(_time != null)
    {
        this.SetJogadoresImage();
    }
}

LoadForm();

function SetJogadoresImage(){
    if(_time == null || _time == "")
    {
        for(i = 1; i < 12; i++)
        {
            document.getElementById('b' + i).style.backgroundImage= "url('./assets/default.png')";
        }
        return;        
    }
    var count = 1;
    _listTimes[_time].Jogadores.map(jogador => {
    document.getElementById('b' + count).style.backgroundImage = jogador.Imagem;
    count++;
    })
}

function SetPosicaoJogadores(value){
    if(value == "null" || value == "")
    {
        for(i = 1; i < 12; i++)
        {
            document.getElementById('b' + i).style.display = "none";
        }
        return;  
    }
    posicoesConfig.Posicoes.map(posicao => {
        if(posicao.NomePosicao == value)
        {
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

function GetNome(idValue, positionValue){
    
    if(_time == null || _time == "")
    {
        document.getElementById(idValue).title="?";
        return('?');
    }

    document.getElementById(idValue).title=(
        _listTimes[_time].Jogadores[positionValue].Nome
        + ", " 
        + GetPosicaoJogador(_listTimes[_time].Jogadores[positionValue].Posicao));
    return(_listTimes[_time].Jogadores[positionValue].Nome);
}

function GetPosicaoJogador(value){
    switch(value)
    {
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

function onClickJogador(idValue, positionValue){
    var nomeJogador = this.GetNome(idValue, positionValue).replace(" ", "+");
    var posicaoJogador = this.GetPosicaoJogador(_listTimes[_time].Jogadores[positionValue].Posicao);
    window.open(
        'https://www.google.com/search?q='+ nomeJogador + "+" + posicaoJogador + "+seleção+" + _time,
        "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,width=900,height=500");
}

function onChangeValueSelect(selectedValue){
    _time = selectedValue.value;
    document.getElementById("nomeTime").innerText= _time;
    var elementDiv = document.getElementById("divTime");
    if(_time == null || _time == "")
    {
        elementDiv.style.backgroundImage= "url('./assets/default.jpg')";
    }else
    {
        elementDiv.style.backgroundImage= _listTimes[_time].ImagemTime;
    }
    this.SetJogadoresImage();
}

function onChangeValueSelectFormacao(selectedValue){

    this.SetPosicaoJogadores(selectedValue.value);
}