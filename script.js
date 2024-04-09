document.addEventListener("DOMContentLoaded", function () {
    const verFotoButton = document.getElementById("ver-foto-button");
    const modal = document.getElementById("myModal");
    const modalContent = document.getElementById("modal-content");
    const leyendaText = document.getElementById("leyenda-text");
    const anteriorButton = document.getElementById("anterior-button");
    const siguienteButton = document.getElementById("siguiente-button");
    const contadorIndice = document.getElementById("contador-indice");

    let dragStartX = 0; 
    let dragStartY = 0; 
    let isDragging = false; // Indicador de si se está arrastrando la imagen


    let images = [];
    let legends = [];
    let legendIndex = 0;
    let totalLegends = 0;

    let zoomLevel = 1;

      // Evento de inicio de arrastre (clic del mouse)
      function startDrag(event) {
        isDragging = true;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
    }

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



        // Evento de arrastre (movimiento del mouse)
        function drag(event) {
            if (isDragging) {
                const deltaX = event.clientX - dragStartX;
                const deltaY = event.clientY - dragStartY;
    
                // Mover la imagen según la cantidad de desplazamiento
                moveImage(deltaX, deltaY);
    
                // Actualizar las coordenadas de inicio del arrastre
                dragStartX = event.clientX;
                dragStartY = event.clientY;
            }
        }



      // Evento de finalización de arrastre (soltar el clic del mouse)
      function endDrag() {
        isDragging = false;
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

    // Función para aumentar el zoom
    function zoomIn() {
        zoomLevel += 0.1;
        applyZoom();
    }
    // Función para disminuir el zoom
    function zoomOut() {
        zoomLevel -= 0.1;
        if (zoomLevel < 0.1) {
            zoomLevel = 0.1; // Establecer el zoom mínimo
        }
        applyZoom();
    }
    // Evento de click para aumentar el zoom
    document.getElementById("zoom-in-button").addEventListener("click", zoomIn);

    // Evento de click para disminuir el zoom
    document.getElementById("zoom-out-button").addEventListener("click", zoomOut);



    function mostrarLeyenda() {
        const imagenContainer = document.querySelector('.imagen-container');
        const leyendaContainer = document.querySelector('.leyenda-container');

        // Crear un nuevo elemento de imagen
        const imagen = new Image();
        imagen.src = images[legendIndex]; // Establecer la fuente de la imagen

        // Limpiar el contenedor de imagen
        imagenContainer.innerHTML = '';

        // Agregar un evento de carga a la imagen
        imagen.onload = function () {
            // Agregar la imagen al contenedor
            imagenContainer.appendChild(imagen);

            // Agregar la leyenda al contenedor
            leyendaContainer.innerHTML = `
                <p class="leyenda">${legends[legendIndex]}</p>
                <div id="contador-indice">${legendIndex + 1}/${totalLegends}</div>
            `;

            // Llamar a applyZoom después de que la imagen se haya cargado
            applyZoom();

              // Agregar eventos de arrastre a la imagen
        imagenContainer.addEventListener('mousedown', startDrag);
        imagenContainer.addEventListener('mouseup', endDrag);
        imagenContainer.addEventListener('mouseleave', endDrag);
        imagenContainer.addEventListener('mousemove', drag);
        };

    }
    function applyZoom() {
        const imagenContainer = document.querySelector('.imagen-container');
        const imagen = imagenContainer.querySelector('img');

        if (imagen) {
            imagen.style.transform = `scale(${zoomLevel})`;
        } else {
            console.error("No se encontró ningún elemento de imagen dentro del contenedor.");
        }
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