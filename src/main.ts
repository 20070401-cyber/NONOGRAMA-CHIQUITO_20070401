import "./estilo.css";
import {
    CONFIG,
    accionarCeldaSeleccionada,
    comprobarResultado,
    crearEstadoInicial,
    interactuarCelda,
    moverCursor,
    obtenerPistas,
    seleccionarModo,
    type Direccion,
    type EstadoJuego,
    type ModoCelda,
} from "./logica";

const aplicacion = document.querySelector<HTMLDivElement>("#app");

if (!aplicacion) {
    throw new Error("No se encontró el contenedor de la aplicación.");
}

let estado: EstadoJuego | null = null;
let pantallaInicial = true;
let instanteInicio = 0;
let segundosTranscurridos = 0;
let temporizador: number | null = null;

function formatoTiempo(segundosTotales: number): string {
    const minutos = Math.floor(segundosTotales / CONFIG.segundosPorMinuto);
    const segundos = segundosTotales % CONFIG.segundosPorMinuto;
    return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
}

function detenerCronometro(): void {
    if (temporizador !== null) {
        window.clearInterval(temporizador);
        temporizador = null;
    }
}

function iniciarCronometro(): void {
    detenerCronometro();
    instanteInicio = Date.now();
    segundosTranscurridos = 0;
    temporizador = window.setInterval(() => {
        segundosTranscurridos = Math.floor(
            (Date.now() - instanteInicio) / CONFIG.milisegundosPorSegundo,
        );
        const reloj = document.querySelector<HTMLElement>("#tiempo-partida");
        if (reloj) {
            reloj.textContent = formatoTiempo(segundosTranscurridos);
        }
    }, CONFIG.milisegundosPorSegundo);
}

function detenerSiFinalizada(): void {
    if (estado && estado.resultado !== "en_curso") {
        detenerCronometro();
    }
}

function comprobarPartida(): void {
    if (!estado) {
        return;
    }

    comprobarResultado(estado);
    detenerSiFinalizada();
    dibujar();
}

function dibujar(): void {
    if (!aplicacion) {
        return;
    }

    if (pantallaInicial || !estado) {
        aplicacion.innerHTML = `
            <main class="marco">
                <header class="encabezado">
                    <div class="marca" aria-label="Nonograma Chiquito">
                        <span class="marca-pixel" aria-hidden="true"></span>
                        <span>NONOGRAMA CHIQUITO</span>
                    </div>
                    <span class="etiqueta-nivel">TABLERO ${CONFIG.filas} × ${CONFIG.columnas}</span>
                </header>
                <section class="pantalla inicio" aria-labelledby="titulo-inicio">
                    <p class="sobrelinea">UN RETO DE LÓGICA RÁPIDA</p>
                    <h1 id="titulo-inicio">Descubre<br>el pixel art.</h1>
                    <p class="texto-intro">Usá las pistas de filas y columnas para revelar la figura oculta.</p>
                    <div class="muestra-pixel" aria-hidden="true">
                        <span></span><span class="activo"></span><span></span><span class="activo"></span><span></span>
                        <span class="activo"></span><span class="activo"></span><span class="activo"></span><span class="activo"></span><span class="activo"></span>
                        <span class="activo"></span><span class="activo"></span><span class="activo"></span><span class="activo"></span><span class="activo"></span>
                        <span></span><span class="activo"></span><span class="activo"></span><span class="activo"></span><span></span>
                        <span></span><span></span><span class="activo"></span><span></span><span></span>
                    </div>
                    <button class="boton boton-principal" type="button" data-accion="empezar">
                        Empezar partida <span aria-hidden="true">→</span>
                    </button>
                    <p class="nota-inicio">${CONFIG.filas} filas · ${CONFIG.columnas} columnas · ${CONFIG.erroresMaximos} errores permitidos</p>
                </section>
                <footer class="pie">PIENSA EN CUADRÍCULA</footer>
            </main>
        `;
        return;
    }

    if (estado.resultado !== "en_curso") {
        dibujarFinal(estado);
        return;
    }

    dibujarPartida(estado);
}

function dibujarPartida(estadoActual: EstadoJuego): void {
    if (!aplicacion) {
        return;
    }

    const pistas = obtenerPistas();
    const cabeceraColumnas = pistas.columnas.map((pista) => `
        <div class="pista-columna" aria-label="Pista de columna ${pistas.columnas.indexOf(pista) + 1}">
            ${pista.map((numero) => `<span>${numero}</span>`).join("")}
        </div>
    `).join("");

    const filas = estadoActual.tablero.map((fila, indiceFila) => `
        <div class="fila-tablero">
            <div class="pista-fila" aria-label="Pista de fila ${indiceFila + 1}">
                ${pistas.filas[indiceFila].map((numero) => `<span>${numero}</span>`).join("")}
            </div>
            ${fila.map((celda, indiceColumna) => {
                const seleccionada =
                    estadoActual.filaSeleccionada === indiceFila &&
                    estadoActual.columnaSeleccionada === indiceColumna;
                const textoCelda = celda === "pintada" ? "pintada" : celda === "tachada" ? "tachada" : "sin resolver";

                return `
                    <button
                        class="celda ${celda} ${seleccionada ? "seleccionada" : ""}"
                        type="button"
                        data-accion="celda"
                        data-fila="${indiceFila}"
                        data-columna="${indiceColumna}"
                        aria-label="Fila ${indiceFila + 1}, columna ${indiceColumna + 1}: ${textoCelda}"
                        aria-pressed="${celda !== "sin_resolver"}"
                    >${celda === "tachada" ? "×" : ""}</button>
                `;
            }).join("")}
        </div>
    `).join("");

    aplicacion.innerHTML = `
        <main class="marco marco-partida">
            <header class="encabezado">
                <div class="marca">
                    <span class="marca-pixel" aria-hidden="true"></span>
                    <span>NONOGRAMA CHIQUITO</span>
                </div>
                <div class="datos-cabecera">
                    <span class="etiqueta-nivel">${CONFIG.filas} × ${CONFIG.columnas}</span>
                    <span class="temporizador">Tiempo: <strong id="tiempo-partida">${formatoTiempo(segundosTranscurridos)}</strong></span>
                </div>
            </header>
            <section class="pantalla juego" aria-labelledby="titulo-juego">
                <div class="titulo-juego">
                    <div>
                        <p class="sobrelinea">RESUELVE EL TABLERO</p>
                        <h1 id="titulo-juego">¿Qué figura es?</h1>
                    </div>
                    <div class="contador-errores ${estadoActual.errores > 0 ? "con-error" : ""}" aria-live="polite">
                        <span>ERRORES</span>
                        <strong>${estadoActual.errores}<span> / ${CONFIG.erroresMaximos}</span></strong>
                    </div>
                </div>
                <div class="tablero-contenedor">
                    <div class="tablero" role="group" aria-label="Tablero de nonograma">
                        <div class="cabecera-pistas">
                            <span class="esquina-pistas" aria-hidden="true">↓</span>
                            ${cabeceraColumnas}
                        </div>
                        ${filas}
                    </div>
                </div>
                <div class="leyenda" aria-label="Estados de casilla">
                    <span><i class="muestra vacia" aria-hidden="true"></i>Sin resolver</span>
                    <span><i class="muestra llena" aria-hidden="true"></i>Pintada</span>
                    <span><i class="muestra cruz" aria-hidden="true">×</i>Descartada</span>
                </div>
                <div class="modos-celda" role="group" aria-label="Modo de celda">
                    <button class="modo-celda ${estadoActual.modoCelda === "pintar" ? "activo" : ""}" type="button" data-accion="modo" data-modo="pintar" aria-pressed="${estadoActual.modoCelda === "pintar"}">Pintar</button>
                    <button class="modo-celda ${estadoActual.modoCelda === "tachar" ? "activo" : ""}" type="button" data-accion="modo" data-modo="tachar" aria-pressed="${estadoActual.modoCelda === "tachar"}">Marcar X</button>
                </div>
                <div class="ayuda-teclado">
                    <span>Flechas para moverte</span>
                    <span class="separador" aria-hidden="true">·</span>
                    <span>Espacio para usar el modo · X para marcar</span>
                    <span class="separador" aria-hidden="true">·</span>
                    <span>Enter o C para comprobar</span>
                </div>
                <button class="boton boton-comprobar" type="button" data-accion="comprobar" aria-keyshortcuts="Enter C">
                    Comprobar dibujo <span aria-hidden="true">↗</span>
                </button>
            </section>
            <footer class="pie">TOCA UNA CELDA PARA CAMBIARLA</footer>
        </main>
    `;
}

function dibujarFinal(estadoActual: EstadoJuego): void {
    if (!aplicacion) {
        return;
    }

    const gano = estadoActual.resultado === "victoria";
    const filas = estadoActual.tablero.map((fila, indiceFila) => `
        <div class="fila-final">
            ${fila.map((celda, indiceColumna) => `
                <span
                    class="celda-final ${celda}"
                    aria-label="Fila ${indiceFila + 1}, columna ${indiceColumna + 1}: ${celda}"
                >${celda === "tachada" ? "×" : ""}</span>
            `).join("")}
        </div>
    `).join("");

    aplicacion.innerHTML = `
        <main class="marco">
            <header class="encabezado">
                <div class="marca">
                    <span class="marca-pixel" aria-hidden="true"></span>
                    <span>NONOGRAMA CHIQUITO</span>
                </div>
                <div class="datos-cabecera">
                    <span class="etiqueta-nivel">PARTIDA FINALIZADA</span>
                    <span class="temporizador">Tiempo: <strong>${formatoTiempo(segundosTranscurridos)}</strong></span>
                </div>
            </header>
            <section class="pantalla final ${gano ? "final-victoria" : "final-derrota"}" aria-labelledby="titulo-final">
                <p class="sobrelinea">${gano ? "FIGURA DESCUBIERTA" : "TABLERO DETENIDO"}</p>
                <h1 id="titulo-final">${gano ? "¡Lo resolviste!" : "Se acabaron los intentos."}</h1>
                <p class="texto-intro">${gano ? "Completaste el nonograma correctamente." : "Llegaste al límite de errores. Probá otra vez."}</p>
                <div class="figura-final" role="img" aria-label="Figura final del tablero">${filas}</div>
                <p class="resumen-final">Errores: ${estadoActual.errores} / ${CONFIG.erroresMaximos}</p>
                <button class="boton boton-principal" type="button" data-accion="reiniciar">
                    Jugar de nuevo <span aria-hidden="true">↻</span>
                </button>
            </section>
            <footer class="pie">NONOGRAMA 5 × 5</footer>
        </main>
    `;
}

aplicacion.addEventListener("click", (evento: MouseEvent) => {
    const objetivo = evento.target;
    if (!(objetivo instanceof HTMLElement)) {
        return;
    }

    const boton = objetivo.closest<HTMLButtonElement>("button[data-accion]");
    if (!boton) {
        return;
    }

    const accion = boton.dataset.accion;
    if (accion === "empezar" || accion === "reiniciar") {
        estado = crearEstadoInicial();
        pantallaInicial = false;
        iniciarCronometro();
    } else if (accion === "celda" && estado) {
        interactuarCelda(estado, Number(boton.dataset.fila), Number(boton.dataset.columna));
        detenerSiFinalizada();
    } else if (accion === "modo" && estado && boton.dataset.modo) {
        seleccionarModo(estado, boton.dataset.modo as ModoCelda);
    } else if (accion === "comprobar" && estado) {
        comprobarPartida();
        return;
    }

    dibujar();
});

document.addEventListener("keydown", (evento: KeyboardEvent) => {
    if (!estado || pantallaInicial || estado.resultado !== "en_curso") {
        return;
    }

    const tecla = evento.key.toLowerCase();
    if (evento.key === "Enter" || tecla === "c") {
        if (!evento.repeat) {
            evento.preventDefault();
            comprobarPartida();
        }
        return;
    }

    if (evento.repeat) {
        return;
    }

    const direcciones: Record<string, Direccion> = {
        ArrowUp: "arriba",
        ArrowDown: "abajo",
        ArrowLeft: "izquierda",
        ArrowRight: "derecha",
    };

    if (evento.key in direcciones) {
        evento.preventDefault();
        if (moverCursor(estado, direcciones[evento.key])) {
            dibujar();
        }
    } else if (evento.code === "Space") {
        evento.preventDefault();
        if (accionarCeldaSeleccionada(estado)) {
            detenerSiFinalizada();
            dibujar();
        }
    } else if (tecla === "x") {
        evento.preventDefault();
        if (seleccionarModo(estado, "tachar")) {
            dibujar();
        }
    }
});

dibujar();