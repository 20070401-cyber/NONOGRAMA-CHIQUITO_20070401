import { describe, expect, it } from "vitest";
import {
    accionarCeldaSeleccionada,
    comprobarResultado,
    crearEstadoInicial,
    interactuarCelda,
    moverCursor,
    seleccionarModo,
} from "../src/logica";

const SOLUCION = [
    [false, true, false, true, false],
    [true, true, true, true, true],
    [true, true, true, true, true],
    [false, true, true, true, false],
    [false, false, true, false, false],
];

describe("reglas del nonograma", () => {
    it("arma el tablero inicial vacío y ubica el cursor al comienzo", () => {
        const estado = crearEstadoInicial();

        expect(estado.tablero).toHaveLength(5);
        expect(estado.tablero.every((fila) => fila.length === 5)).toBe(true);
        expect(estado.tablero.flat().every((celda) => celda === "sin_resolver")).toBe(true);
        expect(estado.errores).toBe(0);
        expect(estado.filaSeleccionada).toBe(0);
        expect(estado.columnaSeleccionada).toBe(0);
        expect(estado.modoCelda).toBe("pintar");
        expect(estado.resultado).toBe("en_curso");
    });

    it("mueve el cursor cuando el destino existe y rechaza salir del tablero", () => {
        const estado = crearEstadoInicial();

        expect(moverCursor(estado, "derecha")).toBe(true);
        expect(estado.columnaSeleccionada).toBe(1);
        expect(moverCursor(estado, "arriba")).toBe(false);
        expect(estado.filaSeleccionada).toBe(0);
        expect(moverCursor(estado, "abajo")).toBe(true);
        expect(estado.filaSeleccionada).toBe(1);
    });

    it("pinta o marca X según el modo y rechaza coordenadas inválidas", () => {
        const estado = crearEstadoInicial();

        expect(interactuarCelda(estado, 0, 1)).toBe(true);
        expect(estado.tablero[0][1]).toBe("pintada");
        expect(estado.errores).toBe(0);
        expect(interactuarCelda(estado, 0, 1)).toBe(true);
        expect(estado.tablero[0][1]).toBe("sin_resolver");
        expect(seleccionarModo(estado, "tachar")).toBe(true);
        expect(interactuarCelda(estado, 0, 1)).toBe(true);
        expect(estado.tablero[0][1]).toBe("tachada");
        expect(estado.errores).toBe(0);
        expect(interactuarCelda(estado, 0, 1)).toBe(true);
        expect(estado.tablero[0][1]).toBe("sin_resolver");
        expect(interactuarCelda(estado, -1, 0)).toBe(false);
        expect(interactuarCelda(estado, 5, 0)).toBe(false);
        expect(interactuarCelda(estado, 0, 5)).toBe(false);
    });

    it("acciona la celda seleccionada y comprueba resultados válidos e inválidos", () => {
        const estado = crearEstadoInicial();

        expect(accionarCeldaSeleccionada(estado)).toBe(true);
        expect(estado.tablero[0][0]).toBe("pintada");
        expect(estado.errores).toBe(1);
        expect(comprobarResultado(estado)).toBe(true);
        expect(estado.resultado).toBe("en_curso");

        estado.resultado = "derrota";
        expect(accionarCeldaSeleccionada(estado)).toBe(false);
        expect(comprobarResultado(estado)).toBe(false);
        expect(moverCursor(estado, "derecha")).toBe(false);
        expect(interactuarCelda(estado, 0, 1)).toBe(false);
        expect(seleccionarModo(estado, "tachar")).toBe(false);
    });

    it("permite completar el recorrido de principio a fin y alcanzar la victoria", () => {
        const estado = crearEstadoInicial();

        for (let fila = 0; fila < SOLUCION.length; fila += 1) {
            for (let columna = 0; columna < SOLUCION[fila].length; columna += 1) {
                expect(seleccionarModo(estado, SOLUCION[fila][columna] ? "pintar" : "tachar")).toBe(true);
                expect(interactuarCelda(estado, fila, columna)).toBe(true);
            }
        }

        expect(estado.errores).toBe(0);
        expect(comprobarResultado(estado)).toBe(true);
        expect(estado.resultado).toBe("victoria");
    });

    it("gana con el tablero completo correcto y pierde al superar tres errores", () => {
        const estadoGanador = crearEstadoInicial();
        estadoGanador.tablero = SOLUCION.map((fila) =>
            fila.map((pintada) => pintada ? "pintada" : "tachada"),
        );

        expect(comprobarResultado(estadoGanador)).toBe(true);
        expect(estadoGanador.resultado).toBe("victoria");

        const estadoPerdedor = crearEstadoInicial();
        const celdasIncorrectas = [[0, 0], [0, 2], [0, 4], [3, 0]];
        for (const [fila, columna] of celdasIncorrectas) {
            expect(interactuarCelda(estadoPerdedor, fila, columna)).toBe(true);
        }

        expect(estadoPerdedor.errores).toBe(4);
        expect(estadoPerdedor.resultado).toBe("derrota");
        expect(comprobarResultado(estadoPerdedor)).toBe(false);
    });
});