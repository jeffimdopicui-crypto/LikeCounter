const config = require("./config.json");


// =================================
// CALCULA PRÓXIMA META
// =================================
function calcularMeta(likes){


    if(likes < 10)
        return 10;


    if(likes < 20)
        return 20;


    if(likes < 40)
        return 40;


    if(likes < 60)
        return 60;


    if(likes < 100)
        return 100;


    if(likes < 150)
        return 150;


    if(likes < 200)
        return 200;


    if(likes < 300)
        return 300;


    if(likes < 400)
        return 400;


    if(likes < 500)
        return 500;



    if(likes < 1000)

        return Math.ceil(likes / 100) * 100 + 100;



    if(likes < 5000)

        return Math.ceil(likes / 500) * 500 + 500;



    if(likes < 10000)

        return Math.ceil(likes / 1000) * 1000 + 1000;



    if(likes < 30000)

        return Math.ceil(likes / 5000) * 5000 + 5000;



    return Math.ceil(likes / 10000) * 10000 + 10000;


}




// =================================
// CALCULA PROGRESSO DA BARRA
// =================================
function calcularProgresso(likes, meta){


    let inicio = 0;



    if(meta >= 1000){


        if(meta <= 5000)

            inicio = meta - 500;



        else if(meta <= 10000)

            inicio = meta - 1000;



        else

            inicio = meta - 5000;



    }else{


        inicio =
        meta - config.incremento;


    }



    let valor =
    likes - inicio;



    let total =
    meta - inicio;



    let porcentagem =
    (valor / total) * 100;



    if(porcentagem < 0)

        porcentagem = 0;



    if(porcentagem > 100)

        porcentagem = 100;



    return Math.floor(porcentagem);


}




module.exports = {


    calcularMeta,

    calcularProgresso


};