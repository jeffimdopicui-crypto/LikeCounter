const express = require("express");
const youtube = require("./youtube");
const goals = require("./goals");

require("dotenv").config();


const app = express();


app.use(express.json());

app.use(express.static("public"));



// ===============================
// ABRE PAINEL COMO HOME
// ===============================

app.get("/", (req,res)=>{

    res.sendFile(
        __dirname + "/public/painel.html"
    );

});





let videoAtual = null;



let dadosAtuais = {

    online:false,

    id:"",

    titulo:"",

    thumb:"",

    likes:0,

    viewers:0,

    views:0,

    meta:10,

    progresso:0

};





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
// RECEBE LIVE
// ===============================

app.post("/video", async(req,res)=>{


    const id =
    extrairVideoId(req.body.url);



    if(!id){


        return res.status(400).json({

            erro:"Link inválido"

        });


    }




    videoAtual = id;



    console.log(
        "Monitorando:",
        id
    );



    await atualizarDados();




    res.json({

        ok:true,

        video:id,


        overlay:
        `${req.protocol}://${req.get("host")}/overlay.html`


    });



});







// ===============================
// BUSCA DADOS YOUTUBE
// ===============================

async function atualizarDados(){


    if(!videoAtual)
        return;



    const dados =
    await youtube.buscarDados(videoAtual);



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




    dadosAtuais = {


        ...dados,


        online:true,


        meta,


        progresso


    };




    console.log(

        `LIKES ${dados.likes} | META ${meta} | ${progresso.toFixed(1)}%`

    );


}





// atualiza automaticamente

setInterval(

    atualizarDados,

    15000

);







// ===============================
// DADOS PARA OVERLAY
// ===============================

app.get("/dados",(req,res)=>{


    res.json(

        dadosAtuais

    );


});








// ===============================
// FECHAR LIVE
// ===============================

app.post("/fechar",(req,res)=>{


    videoAtual=null;



    dadosAtuais={


        online:false,


        id:"",


        titulo:"",


        thumb:"",


        likes:0,


        viewers:0,


        views:0,


        meta:10,


        progresso:0


    };



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