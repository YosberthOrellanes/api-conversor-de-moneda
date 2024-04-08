const input = document.querySelector('.input');
const select = document.querySelector('.select');
const button = document.querySelector('.buscar');
const span = document.querySelector('.resultado');
const canvas = document.querySelector('.grafico');


const url = "https://mindicador.cl/api";

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return ` ${day}/${month}/${year}`
}


let myChart = null;


function renderGrafico(data) {
    console.log(data)
    const config = {
        type: "line",
        data: {
            labels: data.map((elemento) =>
                formatDate(new Date(elemento.fecha))
            ),
            datasets: [{
                label: "Historial últimos tres días",
                backgroundColor: "red",
                data: data.map((elemento) =>
                    elemento.valor
                ),
            }]
        }
    }
    canvas.style.backgroundColor = "white";
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(canvas, config);
}

async function buscarCotizacion() {
    try {
        const cantidad = input.value
        const moneda = select.value;
        const fetching = await fetch(`${url}/${moneda}`);
        const data = await fetching.json();
        return data;
    } catch (error) {
        console.log(error);
        span.innerHTML = "Ocurrio un error";
    }
}


button.addEventListener('click', async () => {
    try {
        const result = await buscarCotizacion()
        const serie = result.serie;
        const lastValue = serie[0].valor;
        const data = serie.slice(0, 10).reverse();

        span.innerHTML = `
    Resultado: $${lastValue}
    `;
        renderGrafico(data);
    } catch (error) {
        console.error('Ocurrió un error:', error);
    }
});

