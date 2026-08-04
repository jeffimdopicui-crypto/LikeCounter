const axios = require("axios");

require("dotenv").config();


// =================================
// CLIENTE HTTP LEVE
// =================================

const youtubeAPI = axios.create({

    baseURL:
    "https://www.googleapis.com/youtube/v3",

    timeout:5000

});



const API_KEY =
process.env.YOUTUBE_API_KEY;



if(!API_KEY){

    console.log(
        "ERRO: YOUTUBE_API_KEY não encontrada no .env"
    );

}




// =================================
// BUSCA DADOS INICIAIS
// USA SOMENTE AO CRIAR CONTADOR
// =================================

async function buscarDados(videoId){


    if(!API_KEY)
        return null;



    try{


        const resposta =
        await youtubeAPI.get("/videos",{


            params:{


                part:
                "snippet,statistics",


                id:
                videoId,


                key:
                API_KEY


            }


        });



        const video =
        resposta.data.items?.[0];



        if(!video){

            console.log(
                "Vídeo não encontrado:",
                videoId
            );

            return null;

        }




        return {


            id:
            video.id,


            titulo:
            video.snippet?.title || "",


            likes:
            Number(
                video.statistics?.likeCount || 0
            )


        };



    }catch(e){


        console.log(
            "Erro dados YouTube:",
            e.response?.data || e.message
        );


        return null;


    }


}








// =================================
// ATUALIZA LIKES EM LOTE
// CHAMAR A CADA 10 SEGUNDOS
// RECEBE UM ARRAY DE videoIds
// (até 50 por chamada)
// =================================

async function buscarLikesEmLote(videoIds){


    if(!API_KEY)
        return {};


    if(!videoIds || videoIds.length === 0)
        return {};



    // GARANTE MÁXIMO DE 50 IDs
    // (LIMITE DA API)

    const lote =
    videoIds.slice(0, 50);



    try{


        const resposta =
        await youtubeAPI.get("/videos",{


            params:{


                part:
                "statistics",


                id:
                lote.join(","),


                key:
                API_KEY


            }


        });



        const itens =
        resposta.data.items || [];



        // TRANSFORMA EM UM OBJETO
        // { videoId: likes }
        // PRA FICAR FÁCIL DE CONSULTAR

        const resultado = {};


        itens.forEach(video => {


            resultado[video.id] =
            Number(
                video.statistics?.likeCount || 0
            );


        });



        return resultado;



    }catch(e){


        console.log(

            "Erro buscando likes em lote:",

            e.response?.data || e.message

        );


        return {};


    }


}






// =================================
// DIVIDE UM ARRAY GRANDE DE IDs
// EM LOTES DE 50
// USE SE TIVER MAIS DE 50 LIVES
// AO MESMO TEMPO
// =================================

function dividirEmLotes(array, tamanho = 50){


    const lotes = [];


    for(let i = 0; i < array.length; i += tamanho){

        lotes.push(
            array.slice(i, i + tamanho)
        );

    }


    return lotes;


}






module.exports = {


    buscarDados,


    buscarLikesEmLote,


    dividirEmLotes


};