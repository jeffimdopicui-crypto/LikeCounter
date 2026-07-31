const axios = require("axios");
require("dotenv").config();


const API_KEY = process.env.YOUTUBE_API_KEY;


if(!API_KEY){

    console.log(
        "ERRO: YOUTUBE_API_KEY não encontrada no .env"
    );

}



// =================================
// PEGA DADOS COMPLETOS (SÓ NO INÍCIO)
// =================================

async function buscarDados(videoId){


    try{


        const {data} = await axios.get(

            "https://www.googleapis.com/youtube/v3/videos",

            {

                params:{

                    part:
                    "snippet,statistics",

                    id:
                    videoId,

                    key:
                    API_KEY

                }

            }

        );



        if(!data.items || data.items.length === 0)

            return null;



        const video =
        data.items[0];



        return {


            id:
            video.id,


            titulo:
            video.snippet.title,


            likes:
            Number(
                video.statistics.likeCount || 0
            )


        };



    }catch(e){


        console.log(
            "Erro YouTube API:",
            e.response?.data || e.message
        );


        return null;


    }


}





// =================================
// ATUALIZA SOMENTE LIKES
// =================================

async function buscarLikes(videoId){


    try{


        const {data} = await axios.get(

            "https://www.googleapis.com/youtube/v3/videos",

            {

                params:{

                    part:"statistics",

                    id:videoId,

                    key:API_KEY

                }

            }

        );



        if(!data.items || data.items.length === 0)

            return null;



        const video =
        data.items[0];



        return {

            likes:
            Number(
                video.statistics.likeCount || 0
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