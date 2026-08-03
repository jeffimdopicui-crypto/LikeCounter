let likes = 0;
let ultimoLike = -1;


const txtLikes =
document.getElementById("likes");


const txtMeta =
document.getElementById("meta");


const barra =
document.getElementById("barra");





// =================================
// CALCULA A PRÓXIMA META INTELIGENTE
// =================================
function calcularMeta(valorLikes){


    if(valorLikes < 10)
        return 10;


    if(valorLikes < 20)
        return 20;


    if(valorLikes < 40)
        return 40;


    if(valorLikes < 60)
        return 60;


    if(valorLikes < 100)
        return 100;


    if(valorLikes < 150)
        return 150;


    if(valorLikes < 200)
        return 200;


    if(valorLikes < 300)
        return 300;


    if(valorLikes < 400)
        return 400;


    if(valorLikes < 500)
        return 500;



    if(valorLikes < 1000)
        return Math.ceil(valorLikes / 100) * 100 + 200;



    if(valorLikes < 5000)
        return Math.ceil(valorLikes / 500) * 500 + 500;



    if(valorLikes < 10000)
        return Math.ceil(valorLikes / 1000) * 1000 + 1000;



    if(valorLikes < 30000)
        return Math.ceil(valorLikes / 5000) * 5000 + 5000;



    return Math.ceil(valorLikes / 10000) * 10000 + 10000;


}







// =================================
// CALCULA PROGRESSO DA BARRA
// =================================
function calcularProgresso(likes, meta){


    if(meta <= 0)

        return 0;



    let porcentagem =

    (likes / meta) * 100;



    if(porcentagem < 0)

        porcentagem = 0;



    if(porcentagem > 100)

        porcentagem = 100;



    return porcentagem;


}







// =================================
// EFEITO META BATIDA
// =================================
function animarMeta(){


    if(!barra)
        return;



    barra.classList.add(
        "metaHit"
    );



    setTimeout(()=>{


        barra.classList.remove(
            "metaHit"
        );


    },1000);


}







// =================================
// ATUALIZA CONTADOR
// =================================
async function atualizar(){


    try{


        if(!window.CONTADOR_ID){


            console.log(
                "Nenhum ID de contador encontrado"
            );


            return;


        }




        const resposta =

        await fetch(

            "/dados/" +

            window.CONTADOR_ID +

            "?cache=" +

            Date.now()

        );




        const dados =

        await resposta.json();





        if(!dados)

            return;





        likes =

        dados.likes || 0;





        const metaAtual =

        calcularMeta(likes);





        const progresso =

        calcularProgresso(

            likes,

            metaAtual

        );







        console.log(

            "CONTADOR:",

            window.CONTADOR_ID,

            "| LIKES:",

            likes,

            "| META:",

            metaAtual

        );







        if(likes !== ultimoLike){

            txtLikes.classList.remove("pop");

            void txtLikes.offsetWidth;


            txtLikes.innerText =
            likes.toLocaleString("pt-BR");


            ajustarTamanhoLikes(likes);


            txtLikes.classList.add("pop");

            ultimoLike = likes;

        }







        txtMeta.innerText =

        metaAtual.toLocaleString(
            "pt-BR"
        );







        if(barra){



            barra.style.width =

            progresso + "%";





            if(progresso >= 100){


                animarMeta();


            }


        }




    }catch(e){


        console.log(
            "Erro:",
            e
        );


    }


}



// =================================
// PEGA ID PELO HASH DA URL
// =================================

function carregarIDHash(){


    const hash =
    window.location.hash;


    if(hash.includes("id=")){


        const params =
        new URLSearchParams(
            hash.substring(1)
        );


        window.CONTADOR_ID =
        params.get("id");


        console.log(
            "ID PELO HASH:",
            window.CONTADOR_ID
        );


    }


}



// =================================
// AJUSTA TAMANHO DO LIKE AUTOMÁTICO
// =================================
function ajustarTamanhoLikes(valor){

    let escala = 1;


    if(valor >= 10000)
        escala = 0.85;


    if(valor >= 100000)
        escala = 0.70;


    if(valor >= 1000000)
        escala = 0.55;


    txtLikes.style.transform =
    `scale(${escala})`;

}



// =================================
// INICIALIZA
// =================================

carregarIDHash();


atualizar();



setInterval(

    atualizar,

    CONFIG.intervalo

);