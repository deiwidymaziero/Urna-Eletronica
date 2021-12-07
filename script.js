// Global variables
let seuVotoPara = document.querySelector('.d-1-1 span');
let cargo = document.querySelector('.d-1-2 span');
let descricao = document.querySelector('.d-1-4');
let aviso = document.querySelector('.d-2');
let lateral = document.querySelector('.d-1-right');
let numeros = document.querySelector('.d-1-3');
let etapaAtual = 0;
let numero = '';
let votoBranco = false;
let votoNulo = false;
let votos = [];

document.addEventListener("keydown", function (event) {
    console.log("key --", event.key);
    console.log("key --", event.code);

    if (isNaN(event.key)) {

        console.log(event.key);
        if (event.key == 'Enter') {
            confirma()
        }

        if (event.key == 'Backspace') {
            corrige()
            console.log("here");
        }

    } else {
        insert(event.key);
    }

});
function comecarEtapa() {
    let etapa = etapas[etapaAtual];

    let numeroHTML = '';
    numero = '';
    votoBranco = false;
    votoNulo = false;

    for (let i = 0; i < etapa.numeros; i++) {
        if (i === 0) {
            numeroHTML += '<div class="numero pisca"></div>';
        } else {
            numeroHTML += '<div class="numero"></div>';
        }
    }


    seuVotoPara.style.display = 'none';
    cargo.innerHTML = etapa.titulo;
    descricao.innerHTML = '';
    aviso.style.display = 'none';
    lateral.innerHTML = '';
    numeros.innerHTML = numeroHTML;

}
function insert(n) {

    let music = document.getElementById("numeros-audio");
    music.play();


    let elNumero = document.querySelector('.numero.pisca');
    if (elNumero !== null) {
        elNumero.innerHTML = n;
        numero = numero + n;

        // faz com que o campo de número pisque e após preenchido passe para o proximo campo
        elNumero.classList.remove('pisca');
        if (elNumero.nextElementSibling !== null) {
            elNumero.nextElementSibling.classList.add('pisca');
        } else {
            atualizaInterface();
        }
    }
}

function atualizaInterface() {
    let candidatoIndex = etapas[etapaAtual].candidatos.findIndex((item) => {
        return item.numero === numero
    });

    if (candidatoIndex >= 0) {
        let candidatoData = etapas[etapaAtual].candidatos[candidatoIndex];
        seuVotoPara.style.display = 'block';
        aviso.style.display = 'block';
        descricao.innerHTML = 'Nome: ' + candidatoData.nome + '<br/>' + 'Partido: ' + candidatoData.partido;

        let fotosHTML = '';
        for (let i in candidatoData.fotos) {
            if (candidatoData.fotos[i].small) {
                fotosHTML += '<div class="d-1-image small"> <img src="Images/' + candidatoData.fotos[i].url + '" alt="" />' + candidatoData.fotos[i].legenda + '</div>';
            } else {
                fotosHTML += '<div class="d-1-image"> <img src="Images/' + candidatoData.fotos[i].url + '" alt="" />' + candidatoData.fotos[i].legenda + '</div>';
            }

        }

        lateral.innerHTML = fotosHTML;
    } else {
        seuVotoPara.style.display = 'block';
        aviso.style.display = 'block';
        descricao.innerHTML = '<div class="aviso--grande pisca">VOTO NULO</div>';
        votoNulo = true;

    }
}

function branco() {
    numero === ''
    votoBranco = true;
    seuVotoPara.style.display = 'block';
    aviso.style.display = 'block';
    numeros.innerHTML = '';
    descricao.innerHTML = '<div class="aviso--grande pisca">VOTO EM BRANCO</div>';
    lateral.innerHTML = '';
}


function corrige() {
    document.getElementById("corrige-audio").play();
    comecarEtapa();
}

function confirma() {

    if (votoBranco === true) {

        let totalBranco = parseInt(localStorage.getItem("votoBranco"));
        if (!totalBranco){
            totalBranco = 0;
        }

        totalBranco += 1;
        localStorage.setItem("votoBranco",totalBranco.toString());

        this.confirmVote();

        return;
    }

    if (numero.length !== etapas[etapaAtual].numeros) {
        return;
    }


    if (votoNulo) {
        let totalNulo = parseInt(localStorage.getItem("votosNulos"));
        if (!totalNulo) {
            totalNulo = 0;
        }
        totalNulo += 1;
        localStorage.setItem("votosNulos",totalNulo.toString());

        this.confirmVote();
    }

    let candidatoIndex = etapas[etapaAtual].candidatos.findIndex((item) => {
        return item.numero === numero
    });

    if (candidatoIndex >= 0) {
        console.log(localStorage.getItem(etapas[etapaAtual].candidatos[candidatoIndex].numero));
        // localStorage.key()

        let totalVotos = parseInt(localStorage.getItem(etapas[etapaAtual].candidatos[candidatoIndex].numero));


        if (!totalVotos) {
            totalVotos = 0;
        }

        totalVotos = totalVotos + 1;
        localStorage.setItem(etapas[etapaAtual].candidatos[candidatoIndex].numero.toString(), totalVotos.toString());

        this.confirmVote();
    }
}
function confirmVote() {
    if (etapaAtual == 5) {
        etapaAtual = 0;
        comecarEtapa();
    }

    let somConfirma = document.getElementById("confirma-audio");
    somConfirma.play();

    let candidatoIndex = etapas[etapaAtual].candidatos.findIndex((item) => {
        return item.numero === numero
    });

    if (candidatoIndex >= 0) {
        alert("Confirmado voto no candidato "+etapas[etapaAtual].candidatos[candidatoIndex].numero);
    } else {
        alert("Confirmado voto nulo");
    }

    etapaAtual = etapaAtual + 1;
    comecarEtapa();

}
function resultado() {

    let resultado = document.getElementById("resultado");

    etapas.forEach(etapa => {
        resultado.innerHTML += "<h2>"+etapa.titulo+"</h2>";
        resultado.innerHTML += "<div class='spacer'></div>";
        etapa.candidatos.forEach(candidato => {
            let votes = localStorage.getItem(candidato.numero);
            if (!votes) {
                votes = 0;
            }
            resultado.innerHTML += "<div class='resultLine'> <h4>"+candidato.nome+"</h4> <h4>"+votes+"</h4></div>"
        })

    });

    resultado.innerHTML += "<h2>VOTOS NULOS</h2>";
    resultado.innerHTML += "<div class='spacer'></div>";

    let votosnulo = localStorage.getItem('votosNulos');

    if (!votosnulo){
        votosnulo = 0;
    }

    let votoBranco = localStorage.getItem('votoBranco');
    if (!votoBranco){
        votoBranco = 0;
    }

    resultado.innerHTML += "<div class='resultLine'> <h4>Votos Nulos</h4> <h4>"+votosnulo+"</h4></div>"
    resultado.innerHTML += "<h2>Votos Brancos</h2>";
    resultado.innerHTML += "<div class='resultLine'> <h4>Votos Brancos</h4> <h4>"+votoBranco+"</h4></div>"

}







