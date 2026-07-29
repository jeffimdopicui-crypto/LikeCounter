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




    if(dados.ok){



        const overlayURL =
        dados.overlay ||
        window.location.origin + "/overlay.html";




        document.getElementById("status")
        .innerHTML =


        `

        <div class="status-ok">

        ✅ Live conectada

        </div>


        <br>


        🎥 ID:

        <b>
        ${dados.video}
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