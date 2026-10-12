export const CONFIG = {
    filas: 5, // Unidad: filas
    columnas: 5, // Unidad: columnas
    erroresMaximos: 3, // Unidad: errores permitidos
    erroresIniciales: 0, // Unidad: errores
    indiceInicial: 0, // Unidad: índices
    paso: 1, // Unidad: posiciones por avance
} as const;

export type EstadoCelda = "sin_resolver" | "pintada" | "tachada";
export type Direccion = "arriba" | "abajo" | "izquierda" | "derecha";
export type ResultadoPartida = "en_curso" | "victoria" | "derrota";

export interface EstadoJuego {
    tablero: EstadoCelda[][];
    errores: number;
    filaSeleccionada: number;
    columnaSeleccionada: number;
    resultado: ResultadoPartida;
}

export interface Pistas {
    filas: number[][];
    columnas: number[][];
}

const SOLUCION: readonly (readonly boolean[])[] = [
    [false, true, false, true, false],
    [true, true, true, true, true],
    [true, true, true, true, true],
    [false, true, true, true, false],
    [false, false, true, false, false],
];

export function crearEstadoInicial(): EstadoJuego {
    return {
        tablero: Array.from(
            { length: CONFIG.filas },
            () => Array.from({ length: CONFIG.columnas }, () => "sin_resolver"),
        ),
        errores: CONFIG.erroresIniciales,
        filaSeleccionada: CONFIG.indiceInicial,
        columnaSeleccionada: CONFIG.indiceInicial,
        resultado: "en_curso",
    };
}

export function obtenerPistas(): Pistas {
    const filas = SOLUCION.map((fila) => calcularPistasDeLinea(fila));
    const columnas = Array.from({ length: CONFIG.columnas }, (_, columna) =>
        calcularPistasDeLinea(
            SOLUCION.map((fila) => fila[columna]),
        ),
    );

    return { filas, columnas };
}

export function moverCursor(estado: EstadoJuego, direccion: Direccion): boolean {
    if (estado.resultado !== "en_curso") {
        return false;
    }

    let fila = estado.filaSeleccionada;
    let columna = estado.columnaSeleccionada;

    switch (direccion) {
        case "arriba":
            fila -= CONFIG.paso;
            break;
        case "abajo":
            fila += CONFIG.paso;
            break;
        case "izquierda":
            columna -= CONFIG.paso;
            break;
        case "derecha":
            columna += CONFIG.paso;
            break;
    }

    if (!coordenadasValidas(fila, columna)) {
        return false;
    }

    estado.filaSeleccionada = fila;
    estado.columnaSeleccionada = columna;
    return true;
}

export function interactuarCelda(
    estado: EstadoJuego,
    fila: number,
    columna: number,
): boolean {
    if (estado.resultado !== "en_curso" || !coordenadasValidas(fila, columna)) {
        return false;
    }

    const estadoActual = estado.tablero[fila][columna];

    if (estadoActual === "sin_resolver") {
        estado.tablero[fila][columna] = "pintada";
        if (!SOLUCION[fila][columna]) {
            estado.errores += CONFIG.paso;
            if (estado.errores > CONFIG.erroresMaximos) {
                estado.resultado = "derrota";
            }
        }
    } else if (estadoActual === "pintada") {
        estado.tablero[fila][columna] = "tachada";
    } else {
        estado.tablero[fila][columna] = "sin_resolver";
    }

    return true;
}

export function accionarCeldaSeleccionada(estado: EstadoJuego): boolean {
    return interactuarCelda(
        estado,
        estado.filaSeleccionada,
        estado.columnaSeleccionada,
    );
}

export function comprobarResultado(estado: EstadoJuego): boolean {
    if (estado.resultado !== "en_curso") {
        return false;
    }

    const tableroCompletoYCorrecto = estado.tablero.every((fila, indiceFila) =>
        fila.every((celda, indiceColumna) =>
            celda !== "sin_resolver" &&
            (celda === "pintada") === SOLUCION[indiceFila][indiceColumna],
        ),
    );

    if (tableroCompletoYCorrecto) {
        estado.resultado = "victoria";
    }

    return true;
}

function calcularPistasDeLinea(linea: readonly boolean[]): number[] {
    const pistas: number[] = [];
    let cantidadPintada = CONFIG.indiceInicial;

    for (const pintada of linea) {
        if (pintada) {
            cantidadPintada += CONFIG.paso;
        } else if (cantidadPintada > CONFIG.indiceInicial) {
            pistas.push(cantidadPintada);
            cantidadPintada = CONFIG.indiceInicial;
        }
    }

    if (cantidadPintada > CONFIG.indiceInicial) {
        pistas.push(cantidadPintada);
    }

    return pistas;
}

function coordenadasValidas(fila: number, columna: number): boolean {
    return (
        fila >= CONFIG.indiceInicial &&
        fila < CONFIG.filas &&
        columna >= CONFIG.indiceInicial &&
        columna < CONFIG.columnas
    );
}