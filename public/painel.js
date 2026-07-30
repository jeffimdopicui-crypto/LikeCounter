async function iniciar(){

    const url =
    document.getElementById("link").value;


    if(!url){

        alert(
            "Cole o link da live"
        );

        return;

    }


    const resposta =
    await fetch(
        "/video",
        {

            method:"POST",

            headers:{

                "Content-Type":
                "application/json"

            },

            body:
            JSON.stringify({

                url:url

            })

        }
    );


    const dados =
    await resposta.json();


    console.log(
        "RESPOSTA DO SERVIDOR:",
        dados
    );


    if(dados.ok){

        const overlayURL =
        dados.overlay;


        document.getElementById("status")
        .innerHTML =

        `

        <div class="status-ok">

        ✅ Live conectada

        </div>

        <br>

        🎥 ID DA LIVE:

        <b>
        ${dados.video}
        </b>


        <br><br>


        🔐 ID DO CONTADOR:

        <b style="color:#00eaff">

        ${dados.id}

        </b>


        <br><br>


        📺 <b>URL PARA O OBS:</b>


        <input

        id="urlOverlay"

        value="${overlayURL}"

        readonly

        style="

        width:100%;

        padding:10px;

        margin-top:10px;

        background:#111;

        color:#00eaff;

        border:1px solid #333;

        border-radius:8px;

        "

        >


        <button

        onclick="copiarOverlay()"

        style="margin-top:10px"

        >

        📋 Copiar URL OBS

        </button>


        `;


    }else{


        document.getElementById("status")
        .innerHTML =


        `

        ❌ Erro:

        ${dados.erro}

        `;


    }


}



function copiarOverlay(){


    const campo =
    document.getElementById(
        "urlOverlay"
    );


    campo.select();


    navigator.clipboard.writeText(
        campo.value
    );


    alert(
        "URL do OBS copiada!"
    );


}


// ==============================
// EDITOR DE OVERLAY
// ==============================


let overlayConfig = {


    // ==============================
    // LIKE TEXTO
    // ==============================

    likeColor:"#00d8ff",

    likeTextGlow1:"#00d8ff",

    likeTextGlow2:"#008cff",

    likeSize:75,



    // ==============================
    // PNG LIKE
    // ==============================

    likeImg:"like.png",

    likeGlow1:"#00d8ff",

    likeGlow2:"#008cff",




    // ==============================
    // AVATAR
    // ==============================

    avatarSize:85,

    avatarImg:"avatar.png",


    // borda do círculo

    avatarBorder:"#00eaff",


    // neon atrás do avatar

    avatarGlow1:"#00eaff",

    avatarGlow2:"#006eff",





    // ==============================
    // CARD
    // ==============================


    // cor principal da borda

    bordaColor:"#ff0000",



    // neon externo 2 cores

    cardGlow1:"#006eff",

    cardGlow2:"#0026ff",





    // compatibilidade com versão antiga

    bordaGlow:"#006eff",






    // ==============================
    // FUNDO CARD
    // ==============================


    fundoOverlay:

`
linear-gradient(
180deg,
rgba(38,42,50,.98),
rgba(12,14,19,.98)
)
`,



    fundoInterno:

`
linear-gradient(
135deg,
rgba(20,24,40,.96),
rgba(5,8,18,.95)
)
`,






    // ==============================
    // BARRA
    // ==============================


    barraColor:

`
linear-gradient(
90deg,
#004cff,
#008cff,
#00eaff,
#008cff,
#004cff
)
`,



    barraGlow:"#00eaff",

    barraGlow2:"#006eff",





    // ==============================
    // FONTE
    // ==============================

    fonte:"Arial"


};


// ==============================
// ENVIA CONFIG PARA OVERLAY
// ==============================


function atualizarOverlay(){


    const frame =
    document.getElementById(
        "previewFrame"
    );


    if(!frame){

        return;

    }



 frame.contentWindow.postMessage({

    tipo:"config",

    config:{

        ...overlayConfig,


        cardGlow1:
        overlayConfig.cardGlow1,


        cardGlow2:
        overlayConfig.cardGlow2,


        avatarGlow1:
        overlayConfig.avatarGlow1,


        avatarGlow2:
        overlayConfig.avatarGlow2,


        avatarBorder:
        overlayConfig.avatarBorder

    }

},"*");



    localStorage.setItem(

        "overlayConfig",

        JSON.stringify(
            overlayConfig
        )

    );


}





// ==============================
// SALVAR MANUAL
// ==============================


async function salvarConfig(){


    const id =
    new URLSearchParams(
        window.location.search
    ).get("id");



    if(!id){

        alert(
            "ID do contador não encontrado"
        );

        return;

    }



    const resposta =
    await fetch(
        "/salvar-config",
        {

            method:"POST",

            headers:{

                "Content-Type":
                "application/json"

            },


            body:JSON.stringify({

                id:id,

                config:overlayConfig

            })


        }
    );



    const dados =
    await resposta.json();



    console.log(
        "CONFIG SALVA:",
        dados
    );



    localStorage.setItem(
        "overlayConfig",
        JSON.stringify(
            overlayConfig
        )
    );



    atualizarOverlay();



    alert(
        "✅ Overlay salva no servidor!"
    );


}



// ==============================
// CARREGAR CONFIG
// ==============================


function carregarConfig(){


    const salvo =
    localStorage.getItem(
        "overlayConfig"
    );


    if(salvo){


        overlayConfig =
        {

            ...overlayConfig,

            ...JSON.parse(
                salvo
            )

        };


    }




    // ==============================
    // LIKE TEXTO
    // ==============================


    const likeColor =
    document.getElementById(
        "likeColor"
    );


    if(likeColor)

    likeColor.value =
    overlayConfig.likeColor;




    const likeSize =
    document.getElementById(
        "likeSize"
    );


    if(likeSize)

    likeSize.value =
    overlayConfig.likeSize;




    // ==============================
    // NEON PNG LIKE
    // ==============================


    const likeGlow1 =
    document.getElementById(
        "likeGlow1"
    );


    if(likeGlow1)

    likeGlow1.value =
    overlayConfig.likeGlow1;




    const likeGlow2 =
    document.getElementById(
        "likeGlow2"
    );


    if(likeGlow2)

    likeGlow2.value =
    overlayConfig.likeGlow2;






    // ==============================
    // BORDA CARD
    // ==============================


    const bordaColor =
    document.getElementById(
        "bordaColor"
    );


    if(bordaColor)

    bordaColor.value =
    overlayConfig.bordaColor;




    const cardGlow1 =
    document.getElementById(
        "cardGlow1"
    );


    if(cardGlow1)

    cardGlow1.value =
    overlayConfig.cardGlow1;




    const cardGlow2 =
    document.getElementById(
        "cardGlow2"
    );


    if(cardGlow2)

    cardGlow2.value =
    overlayConfig.cardGlow2;






    // ==============================
    // AVATAR
    // ==============================


    const avatarSize =
    document.getElementById(
        "avatarSize"
    );


    if(avatarSize)

    avatarSize.value =
    overlayConfig.avatarSize;




    const avatarBorder =
    document.getElementById(
        "avatarBorder"
    );


    if(avatarBorder)

    avatarBorder.value =
    overlayConfig.avatarBorder;




    const avatarGlow1 =
    document.getElementById(
        "avatarGlow1"
    );


    if(avatarGlow1)

    avatarGlow1.value =
    overlayConfig.avatarGlow1;




    const avatarGlow2 =
    document.getElementById(
        "avatarGlow2"
    );


    if(avatarGlow2)

    avatarGlow2.value =
    overlayConfig.avatarGlow2;






    // ==============================
    // BARRA
    // ==============================


    const barraColor =
    document.getElementById(
        "barraColor"
    );


    if(barraColor){


        const cor =
        overlayConfig.barraColor.match(
            /#[0-9a-fA-F]{6}/
        );


        if(cor)

        barraColor.value =
        cor[0];


    }





    const barraGlow =
    document.getElementById(
        "barraGlow"
    );


    if(barraGlow)

    barraGlow.value =
    overlayConfig.barraGlow;








    // ==============================
    // TEXTO LIKE NEON
    // ==============================


    const likeTextGlow =
    document.getElementById(
        "likeTextGlow"
    );


    if(likeTextGlow)

    likeTextGlow.value =
    overlayConfig.likeTextGlow1;








    // ==============================
    // FUNDO CARD
    // ==============================


    const fundoCard =
    document.getElementById(
        "fundoCard"
    );


    if(fundoCard){


        const cor =
        overlayConfig.fundoOverlay.match(
            /#[0-9a-fA-F]{6}/
        );


        if(cor)

        fundoCard.value =
        cor[0];


    }








    // ==============================
    // FONTE
    // ==============================


    const fonte =
    document.getElementById(
        "fonte"
    );


    if(fonte)

    fonte.value =
    overlayConfig.fonte;








    // ==============================
    // ATUALIZA PREVIEW
    // ==============================


    const frame =
    document.getElementById(
        "previewFrame"
    );



    if(frame){


        frame.onload=function(){


            atualizarOverlay();


        };



        if(frame.contentWindow){


            atualizarOverlay();


        }


    }



}


// ==============================
// RESTAURAR
// ==============================


function restaurarConfig(){


    localStorage.removeItem(
        "overlayConfig"
    );


    location.reload();


}



// ==============================
// LIGA INPUTS AO CONFIG
// ==============================


function ligarInput(id, callback){

    const elemento =
    document.getElementById(id);


    if(!elemento){

        return;

    }


    elemento.addEventListener(
        "input",
        function(){

            callback(this.value);

        }
    );

}



// ==============================
// LIKE TEXTO
// ==============================


ligarInput(
"likeColor",
function(valor){

    overlayConfig.likeColor = valor;

    atualizarOverlay();

});





// ==============================
// PNG LIKE NEON
// ==============================


ligarInput(
"likeGlow1",
function(valor){

    overlayConfig.likeGlow1 = valor;

    atualizarOverlay();

});



ligarInput(
"likeGlow2",
function(valor){

    overlayConfig.likeGlow2 = valor;

    atualizarOverlay();

});






// ==============================
// BARRA
// ==============================


ligarInput(
"barraColor",
function(valor){


    overlayConfig.barraColor =

`
linear-gradient(
90deg,
${valor},
${valor},
#ffffff,
${valor},
${valor}
)
`;



    atualizarOverlay();


});






// ==============================
// BORDA DO PERFIL
// ==============================


ligarInput(
"bordaColor",
function(valor){

    overlayConfig.bordaColor = valor;

    atualizarOverlay();

});






// ==============================
// TAMANHO AVATAR
// ==============================


ligarInput(
"avatarSize",
function(valor){

    overlayConfig.avatarSize = valor;

    atualizarOverlay();

});






// ==============================
// TAMANHO LIKE
// ==============================


ligarInput(
"likeSize",
function(valor){

    overlayConfig.likeSize = valor;

    atualizarOverlay();

});







// ==============================
// FUNDO CARD
// ==============================


ligarInput(
"fundoCard",
function(valor){


    overlayConfig.fundoOverlay =

`
linear-gradient(
180deg,
${valor},
#050812
)
`;


    atualizarOverlay();


});


// ==============================
// CARD NEON BORDA
// ==============================

ligarInput(
"cardGlow1",
function(valor){

    overlayConfig.cardGlow1 = valor;

    atualizarOverlay();

});


ligarInput(
"cardGlow2",
function(valor){

    overlayConfig.cardGlow2 = valor;

    atualizarOverlay();

});




// ==============================
// AVATAR NEON
// ==============================

ligarInput(
"avatarGlow1",
function(valor){

    overlayConfig.avatarGlow1 = valor;

    atualizarOverlay();

});


ligarInput(
"avatarGlow2",
function(valor){

    overlayConfig.avatarGlow2 = valor;

    atualizarOverlay();

});

// ==============================
// TEXTO LIKE NEON
// ==============================


ligarInput(
"likeTextGlow",
function(valor){


    overlayConfig.likeTextGlow1 = valor;

    overlayConfig.likeTextGlow2 = valor;


    atualizarOverlay();


});







// ==============================
// BARRA NEON
// ==============================


ligarInput(
"barraGlow",
function(valor){


    overlayConfig.barraGlow = valor;

    overlayConfig.barraGlow2 = valor;


    atualizarOverlay();


});








// ==============================
// UPLOAD PNG LIKE
// ==============================


const likeImg =
document.getElementById(
"likeImg"
);


if(likeImg){


likeImg.addEventListener(
"change",
function(){


    const arquivo=this.files[0];


    if(!arquivo)
    return;



    const reader =
    new FileReader();



    reader.onload=function(e){


        overlayConfig.likeImg =
        e.target.result;


        atualizarOverlay();


    };



    reader.readAsDataURL(
        arquivo
    );


});


}








// ==============================
// UPLOAD PNG AVATAR
// ==============================


const avatarImg =
document.getElementById(
"avatarImg"
);


if(avatarImg){


avatarImg.addEventListener(
"change",
function(){


    const arquivo=this.files[0];


    if(!arquivo)
    return;



    const reader =
    new FileReader();



    reader.onload=function(e){


        overlayConfig.avatarImg =
        e.target.result;


        atualizarOverlay();


    };



    reader.readAsDataURL(
        arquivo
    );


});


}








// ==============================
// RECEBE AVISO IFRAME
// ==============================


window.addEventListener(
"message",
function(event){


    if(
        event.data &&
        event.data.tipo === "ready"
    ){


        atualizarOverlay();


    }


});


function aplicarPreviewInicial(){


    const frame =
    document.getElementById(
        "previewFrame"
    );


    if(frame && frame.contentWindow){


        frame.contentWindow.postMessage({

            tipo:"config",

            config:overlayConfig


        },"*");


    }

}


// ==============================
// CARREGA CONFIG
// ==============================


window.addEventListener(
"load",
function(){

    carregarConfig();

    setTimeout(
        aplicarPreviewInicial,
        500
    );

});