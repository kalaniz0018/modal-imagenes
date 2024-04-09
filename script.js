document.addEventListener("DOMContentLoaded", function () {
    const verFotoButton = document.getElementById("ver-foto-button");
    const modal = document.getElementById("myModal");
    const modalContent = document.getElementById("modal-content");
    const leyendaText = document.getElementById("leyenda-text");
    const anteriorButton = document.getElementById("anterior-button");
    const siguienteButton = document.getElementById("siguiente-button");
    const contadorIndice = document.getElementById("contador-indice"); 

    let images = [];
    let legends = [];
    let legendIndex = 0;
    let totalLegends = 0; 


    verFotoButton.addEventListener("click", function () {
        console.log("Botón 'Ver Foto' presionado");
        fetch("datos.json")
            .then(response => response.json())
            .then(data => {
                console.log("Datos recibidos:", data);
                if (data.data && data.data.legend && Array.isArray(data.data.legend)) {
                    images = data.data.imagenes;
                    legends = data.data.legend;
                    totalLegends = data.data.count;
                    legendIndex = 0;
                    mostrarLeyenda();
                    modal.style.display = "block";
                } else {
                    console.error("Error: Estructura de JSON incorrecta");
                }
            })
            .catch(error => console.error("Error al cargar el JSON:", error));
    });

/*     function mostrarLeyenda() {
        modalContent.innerHTML = `<img src="${images[legendIndex]}" alt="Imagen" style="max-width: 800px important!; max-height: 600px important!;">`;
        leyendaText.textContent = legends[legendIndex];
        contadorIndice.textContent = `${legendIndex + 1}/${totalLegends}`; 
    }
 */
    function mostrarLeyenda() {
        const imagenContainer = document.querySelector('.imagen-container');
        const leyendaContainer = document.querySelector('.leyenda-container');
    
        imagenContainer.innerHTML = `<img src="${images[legendIndex]}" alt="Imagen" class="imagen">`;
        leyendaContainer.innerHTML = `
            <p class="leyenda">${legends[legendIndex]}</p>
            <div id="contador-indice">${legendIndex + 1}/${totalLegends}</div>
        `;
    }
    
    anteriorButton.addEventListener("click", function () {
        if (legendIndex > 0) {
            legendIndex--;
            mostrarLeyenda();
        }
    });

    siguienteButton.addEventListener("click", function () {
        legendIndex = (legendIndex + 1) % totalLegends;
        mostrarLeyenda();
    });

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});