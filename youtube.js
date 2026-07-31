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
// ATUALIZA APENAS LIKE
// CHAMAR A CADA 10 SEGUNDOS
// =================================

async function buscarLikes(videoId){


    if(!API_KEY)
        return null;



    try{


        const resposta =
        await youtubeAPI.get("/videos",{


            params:{


                part:
                "statistics",


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
                "Nenhum vídeo retornado:",
                videoId
            );


            return null;

        }



        return {


            likes:
            Number(
                video.statistics?.likeCount || 0
            )


        };



    }catch(e){


        console.log(

            "Erro buscando likes:",

            e.response?.data || e.message

        );


        return null;


    }


}






module.exports = {


    buscarDados,


    buscarLikes


};