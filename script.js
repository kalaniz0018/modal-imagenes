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

    let zoomLevel = 1;



    // Función para mover la imagen dentro del contenedor
    function moveImage(deltaX, deltaY) {
        const imagenContainer = document.querySelector('.imagen-container');
        const imagen = imagenContainer.querySelector('img');

        if (imagen) {
            // Obtener la posición actual de la imagen
            let currentX = parseFloat(imagen.style.left) || 0;
            let currentY = parseFloat(imagen.style.top) || 0;

            // Ajustar el desplazamiento de acuerdo al nivel de zoom
            const zoomedDeltaX = deltaX / zoomLevel;
            const zoomedDeltaY = deltaY / zoomLevel;

            // Calcular la nueva posición de la imagen
            const newX = currentX + zoomedDeltaX;
            const newY = currentY + zoomedDeltaY;

            // Establecer la nueva posición de la imagen
            imagen.style.left = `${newX}px`;
            imagen.style.top = `${newY}px`;
        }
    }










    verFotoButton.addEventListener("click", function () {

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


    function zoomIn() {
        zoomLevel += 0.1;
        applyZoom();
    }

    function zoomOut() {
        zoomLevel -= 0.1;
        if (zoomLevel < 0.1) {
            zoomLevel = 0.1;
        }
        applyZoom();
    }

    document.getElementById("zoom-in-button").addEventListener("click", zoomIn);
    document.getElementById("zoom-out-button").addEventListener("click", zoomOut);

    function applyZoom() {
        const imagenContainer = document.querySelector('.imagen-container');
        const imagen = imagenContainer.querySelector('img');

        if (imagen) {
            imagen.style.transform = `scale(${zoomLevel})`;
        } else {
            console.error("No se encontró ningún elemento de imagen dentro del contenedor.");
        }
    }

    function mostrarLeyenda() {
        const imagenContainer = document.querySelector('.imagen-container');
        const leyendaContainer = document.querySelector('.leyenda-container');
    
        const imagen = new Image();
        imagen.src = images[legendIndex];
        imagenContainer.innerHTML = '';
        imagen.onload = function () {
            imagenContainer.appendChild(imagen);
            leyendaContainer.innerHTML = `
                <p class="leyenda">${legends[legendIndex]}</p>
                <div id="contador-indice">${legendIndex + 1}/${totalLegends}</div>
                <a id="imagen-url" href="${images[legendIndex]}" target="_blank">Ver foto en otra pestaña</a>
            `;
    
            applyZoom();
        };
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