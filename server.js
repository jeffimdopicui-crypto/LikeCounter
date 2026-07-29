const express = require("express");
const youtube = require("./youtube");
const goals = require("./goals");
const path = require("path");

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


        ok:true,


        video:videoId,


        id:contadorId,



        overlay:


        `${req.protocol}://${req.get("host")}/overlay.html?id=${contadorId}`



    });



});








// ===============================
// ATUALIZA UM CONTADOR
// ===============================

async function atualizarDados(contadorId){



    const contador =
    contadores[contadorId];



    if(!contador)

        return;




    const dados =
    await youtube.buscarDados(
        contador.videoId
    );



    if(!dados)

        return;





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


        ...dados,


        online:true,


        meta,


        progresso


    };





    console.log(

        "CONTADOR:",
        contadorId,

        "| LIKES:",
        dados.likes

    );



}









// ===============================
// ATUALIZA TODOS OS CONTADORES
// ===============================

setInterval(()=>{


    Object.keys(contadores)
    .forEach(id=>{


        atualizarDados(id);


    });


},15000);









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