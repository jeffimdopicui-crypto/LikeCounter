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


        // ==============================
        // ALTERA A ROTA DO SITE
        // ==============================

        window.location.hash =
        "id=" + dados.id;



        // ==============================
        // SALVA ID GLOBAL
        // ==============================

        window.CONTADOR_ID =
        dados.id;


        // ==============================
        // ATUALIZA PREVIEW
        // ==============================

        const frame =
        document.getElementById(
            "previewFrame"
        );


        if(frame){


            frame.src =
            "/overlay.html?id=" + dados.id;



            frame.onload=function(){


                atualizarOverlay();


            };


        }




        const overlayURL =
        window.location.origin +
        "/overlay.html?id=" +
        dados.id;



        document.getElementById("status")
        .innerHTML =


        `

        <div class="status-ok">

            ✅ <b>Live conectada com sucesso!</b>

        </div>

        <br>

        🎬 <b>Título da Live</b>

        <div style="
            margin-top:10px;
            padding:14px;
            background:rgba(0,234,255,.08);
            border:1px solid rgba(0,234,255,.25);
            border-left:4px solid #00eaff;
            border-radius:12px;
            color:#ffffff;
            font-weight:700;
            line-height:1.6;
            word-break:break-word;
        ">

            ${dados.titulo}

        </div>

        <br>

        🔐 <b>ID do Contador</b>

        <br>

        <span style="
        display:inline-block;
        margin-top:8px;
        padding:8px 12px;
        background:#111;
        border:1px solid #333;
        border-radius:8px;
        color:#00eaff;
        font-family:Consolas, monospace;
        font-size:14px;
        ">

        ${dados.id}

        </span>

        <br><br>

        📺 <b>URL para o OBS</b>

        <input

        id="urlOverlay"

        value="${overlayURL}"

        readonly

        style="
        width:100%;
        padding:12px;
        margin-top:10px;
        background:#111;
        color:#00eaff;
        border:1px solid #333;
        border-radius:10px;
        font-family:Consolas, monospace;
        "

        >

        <button

        onclick="copiarOverlay()"

        style="margin-top:12px"

        >

        📋 Copiar URL do Overlay

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

// ==============================
// CARREGA CONTADOR PELA ROTA
// ==============================

function carregarContadorPorRota(){


    const hash =
    window.location.hash;



    if(!hash.startsWith("#id=")){

        return;

    }



    const id =
    hash.replace("#id=","");



    console.log(
        "CONTADOR PELA ROTA:",
        id
    );



    // salva globalmente

    window.CONTADOR_ID = id;



    const frame =
    document.getElementById(
        "previewFrame"
    );



    if(frame){

        frame.src =
        "/overlay.html?id=" + id;


        frame.onload = function(){

            atualizarOverlay();

        };

    }



}

function mostrarBanner(mensagem){

    let banner = document.getElementById("bannerAviso");

    if(!banner){

        banner = document.createElement("div");

        banner.id = "bannerAviso";

        document.body.appendChild(banner);

    }

    banner.innerHTML = mensagem;

    banner.classList.add("show");

    clearTimeout(banner.timer);

    banner.timer = setTimeout(()=>{

        banner.classList.remove("show");

    },4500);

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


    mostrarBanner(
        "📋 <b>URL copiada com sucesso!</b><br>Agora basta colar a URL na fonte <b>Navegador</b> do OBS."
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

    likeSize:65,



    // ==============================
    // PNG LIKE
    // ==============================

    likeImg:"like.png",

    likeGlow1:"#00d8ff",

    likeGlow2:"#008cff",




    // ==============================
    // AVATAR
    // ==============================

    avatarSize:65,

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

    // Verifica se o contador foi iniciado
    if(!window.CONTADOR_ID){

        mostrarBanner(
            "⚠️ Por favor, insira o link da sua live e clique em <b>🚀 Iniciar Contador</b> antes de usar a opção <b>💾 Salvar</b>."
        );

        return;
    }

    try{

        await fetch(

            "/config/" +

            window.CONTADOR_ID,

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify(
                    overlayConfig
                )

            }

        );

        console.log(
            "Configuração salva no servidor"
        );

        localStorage.setItem(

            "overlayConfig",

            JSON.stringify(
                overlayConfig
            )

        );

        atualizarOverlay();

        mostrarBanner(
            "✨ <b>Arte salva com sucesso!</b><br>Todas as alterações foram aplicadas e já estão disponíveis no Overlay."
        );

    }catch(e){

        console.log(
            "Erro ao salvar:",
            e
        );

        mostrarBanner(
            "❌ <b>Não foi possível salvar sua arte.</b><br>Verifique sua conexão e tente novamente."
        );

    }

}



// ==============================
// CARREGAR CONFIG
// ==============================


async function carregarConfig(){


    // ==============================
    // CARREGA DO SERVIDOR
    // ==============================

    if(window.CONTADOR_ID){

        try{

            const resposta =

            await fetch(

                "/config/" +

                window.CONTADOR_ID +

                "?cache=" +

                Date.now()

            );



            const configServidor =

            await resposta.json();



            if(configServidor){

                overlayConfig = {

                    ...overlayConfig,

                    ...configServidor

                };

            }

        }catch(e){

            console.log(

                "Erro carregando config:",

                e

            );

        }

    }



    // ==============================
    // FALLBACK LOCAL
    // ==============================

    else{

        const salvo =

        localStorage.getItem(

            "overlayConfig"

        );



        if(salvo){

            overlayConfig = {

                ...overlayConfig,

                ...JSON.parse(salvo)

            };

        }

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

function abrirModalRestaurar(){

    document
        .getElementById("modalRestaurar")
        .classList.add("show");

}

function fecharModalRestaurar(){

    document
        .getElementById("modalRestaurar")
        .classList.remove("show");

}

function confirmarRestauracao(){

    fecharModalRestaurar();

    localStorage.removeItem("overlayConfig");

    mostrarBanner(
        "🔄 <b>Arte restaurada!</b><br>O modelo original foi carregado com sucesso."
    );

    setTimeout(()=>{

        location.reload();

    },1200);

}


// ==============================
// RESTAURAR
// ==============================


function restaurarConfig(){

    abrirModalRestaurar();

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
async function(){

    // primeiro descobre qual é o ID da live
    carregarContadorPorRota();

    // agora já existe window.CONTADOR_ID
    await carregarConfig();

    setTimeout(()=>{

        aplicarPreviewInicial();

        atualizarOverlay();

    },500);

});