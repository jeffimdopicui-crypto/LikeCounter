const express = require("express");
const youtube = require("./youtube");
const goals = require("./goals");
const path = require("path");
const fs = require("fs");

require("dotenv").config();


const app = express();


app.use(express.json());


app.use(
    express.static(
        path.join(__dirname,"public")
    )
);



// ===============================
// HOME
// ===============================

app.get("/",(req,res)=>{

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "painel.html"
        )
    );

});


// ===============================
// LIMPEZA AUTOMÁTICA DE CONFIGS
// REMOVE ARQUIVOS COM MAIS DE 20 HORAS
// ===============================

function limparConfigsAntigos(){


    const pasta =
    path.join(
        __dirname,
        "configs"
    );


    if(!fs.existsSync(pasta)){

        return;

    }



    const agora =
    Date.now();



    const limite =
    20 * 60 * 60 * 1000; // 20 horas



    fs.readdirSync(pasta)
    .forEach(arquivo=>{


        if(!arquivo.endsWith(".json")){

            return;

        }



        const caminho =
        path.join(
            pasta,
            arquivo
        );



        let stats;

        try{

            stats =
            fs.statSync(
                caminho
            );

        }catch(e){

            return;

        }



        const idade =
        agora - stats.mtimeMs;



        if(idade > limite){


            fs.unlinkSync(
                caminho
            );


            console.log(
                "Config removida por expiração:",
                arquivo
            );


        }


    });


}


// executa ao iniciar

limparConfigsAntigos();


// verifica a cada 1 hora

setInterval(
    limparConfigsAntigos,
    60 * 60 * 1000
);


// ===============================
// OVERLAY
// ===============================

app.get("/overlay.html",(req,res)=>{

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "overlay.html"
        )
    );

});




// ===============================
// BANCO TEMPORÁRIO
// ID = ID DA LIVE YOUTUBE
// ===============================

const contadores = {};



// ===============================
// EXTRAI ID YOUTUBE
// ===============================

function extrairVideoId(url){


    const regex =
    /(?:youtube\.com\/(?:watch\?v=|live\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;


    const match =
    url.match(regex);


    return match ? match[1] : null;

}



// ===============================
// CRIAR CONTADOR
// ===============================

app.post("/video", async(req,res)=>{


    const videoId =
    extrairVideoId(
        req.body.url
    );



    if(!videoId){


        return res.status(400).json({

            erro:"Link inválido"

        });


    }




    // O ID DO CONTADOR É A PRÓPRIA LIVE

    const contadorId = videoId;




    // ===================================
    // NÃO SOBRESCREVE CONTADOR EXISTENTE
    // ===================================

    if(!contadores[contadorId]){


        contadores[contadorId]={


            videoId,


            dados:{


                online:false,

                id:videoId,

                titulo:"",

                thumb:"",

                likes:0,

                viewers:0,

                views:0,

                meta:10,

                progresso:0

            }


        };



        console.log(
            "Novo contador criado:",
            contadorId
        );


    }else{


        console.log(
            "Contador já existe:",
            contadorId
        );


    }






    await atualizarDados(contadorId);





    res.json({

        ok: true,

        video: videoId,

        titulo: contadores[contadorId].dados.titulo,

        id: contadorId,

        overlay:
            `${req.protocol}://${req.get("host")}/overlay.html?id=${contadorId}`

    });



});








async function atualizarDados(contadorId){


    const contador =
    contadores[contadorId];


    if(!contador)

        return;



    try{


        const dados =
        await youtube.buscarDados(
            contador.videoId
        );



        if(!dados){

            console.log(
                "YouTube não retornou dados:",
                contadorId
            );

            return;

        }




        const meta =
        goals.calcularMeta(
            dados.likes
        );



        const progresso =
        goals.calcularProgresso(
            dados.likes,
            meta
        );





        contador.dados={


            ...contador.dados,

            ...dados,


            online:true,


            meta,


            progresso


        };





        console.log(

            "CONTADOR:",
            contadorId,

            "| TITULO:",
            dados.titulo,

            "| LIKES:",
            dados.likes

        );



    }catch(e){


        console.log(
            "Erro atualizar contador:",
            e.message
        );


    }


}








// ===============================
// ATUALIZA TODOS OS CONTADORES
// ===============================

setInterval(()=>{


    Object.keys(contadores)
    .forEach(id=>{


        atualizarDados(id);


    });


},7000);









// ===============================
// ENVIA DADOS PARA OVERLAY
// ===============================

app.get("/dados/:id",(req,res)=>{


    res.setHeader(
        "Cache-Control",
        "no-store"
    );



    const contador =
    contadores[
        req.params.id
    ];



    if(!contador){


        return res.json({


            online:false,


            likes:0,


            meta:10,


            progresso:0


        });


    }




    res.json(
        contador.dados
    );


});









// ===============================
// FECHAR CONTADOR
// ===============================

app.post("/fechar/:id",(req,res)=>{


    delete contadores[
        req.params.id
    ];



    console.log(
        "Contador removido:",
        req.params.id
    );



    res.json({

        ok:true

    });


});




// ===============================
// SALVAR CONFIG DA OVERLAY
// ===============================

app.post("/config/:id",(req,res)=>{

    const pasta =
    path.join(__dirname,"configs");

    if(!fs.existsSync(pasta)){

        fs.mkdirSync(pasta);

    }

    fs.writeFileSync(

        path.join(
            pasta,
            req.params.id + ".json"
        ),

        JSON.stringify(
            req.body,
            null,
            4
        )

    );

    res.json({

        ok:true

    });

});




// ===============================
// CARREGAR CONFIG DA OVERLAY
// ===============================

app.get("/config/:id",(req,res)=>{

    const arquivo =
    path.join(

        __dirname,

        "configs",

        req.params.id + ".json"

    );



    if(!fs.existsSync(arquivo)){

        return res.json(null);

    }



    res.json(

        JSON.parse(

            fs.readFileSync(

                arquivo,

                "utf8"

            )

        )

    );

});




const PORT =
process.env.PORT || 3000;



app.listen(PORT,()=>{


    console.log(
        "Servidor rodando:"
    );


    console.log(
        `http://localhost:${PORT}`
    );


});