const axios = require("axios");
require("dotenv").config();


const API_KEY = process.env.YOUTUBE_API_KEY;

    if(!API_KEY){

    console.log(
        "ERRO: YOUTUBE_API_KEY não encontrada no .env"
    );

}



async function buscarDados(videoId) {


    try {


        const { data } = await axios.get(

            "https://www.googleapis.com/youtube/v3/videos",

            {

                params: {

                    part:
                    "snippet,statistics,liveStreamingDetails",

                    id:
                    videoId,

                    key:
                    API_KEY

                }

            }

        );



        if (!data.items || data.items.length === 0)

            return null;




        const video = data.items[0];

        console.log("RESPOSTA YOUTUBE:");
        console.log(video.statistics);
        console.log(video.liveStreamingDetails);



        return {


            id:
            video.id,



            titulo:
            video.snippet.title,



            canal:
            video.snippet.channelTitle,



            thumb:
            video.snippet.thumbnails?.high?.url || "",



            likes:
            Number(
                video.statistics.likeCount || 0
            ),



            views:
            Number(
                video.statistics.viewCount || 0
            ),



            viewers:
            Number(
                video.liveStreamingDetails?.concurrentViewers || 0
            )


        };



    } catch (e) {


        console.log(

            "Erro YouTube API:",

            e.response?.data || e.message

        );


        return null;


    }


}



module.exports = {

    buscarDados

};