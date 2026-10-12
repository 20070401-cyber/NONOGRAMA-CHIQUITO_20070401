(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={filas:5,columnas:5,erroresMaximos:3,erroresIniciales:0,indiceInicial:0,paso:1},t=[[!1,!0,!1,!0,!1],[!0,!0,!0,!0,!0],[!0,!0,!0,!0,!0],[!1,!0,!0,!0,!1],[!1,!1,!0,!1,!1]];function n(){return{tablero:Array.from({length:e.filas},()=>Array.from({length:e.columnas},()=>`sin_resolver`)),errores:e.erroresIniciales,filaSeleccionada:e.indiceInicial,columnaSeleccionada:e.indiceInicial,resultado:`en_curso`}}function r(){return{filas:t.map(e=>c(e)),columnas:Array.from({length:e.columnas},(e,n)=>c(t.map(e=>e[n])))}}function i(t,n){if(t.resultado!==`en_curso`)return!1;let r=t.filaSeleccionada,i=t.columnaSeleccionada;switch(n){case`arriba`:r-=e.paso;break;case`abajo`:r+=e.paso;break;case`izquierda`:i-=e.paso;break;case`derecha`:i+=e.paso}return l(r,i)?(t.filaSeleccionada=r,t.columnaSeleccionada=i,!0):!1}function a(n,r,i){if(n.resultado!==`en_curso`||!l(r,i))return!1;let a=n.tablero[r][i];return a===`sin_resolver`?(n.tablero[r][i]=`pintada`,t[r][i]||(n.errores+=e.paso,n.errores>e.erroresMaximos&&(n.resultado=`derrota`))):a===`pintada`?n.tablero[r][i]=`tachada`:n.tablero[r][i]=`sin_resolver`,!0}function o(e){return a(e,e.filaSeleccionada,e.columnaSeleccionada)}function s(e){return e.resultado===`en_curso`&&(e.tablero.every((e,n)=>e.every((e,r)=>e!==`sin_resolver`&&e===`pintada`===t[n][r]))&&(e.resultado=`victoria`),!0)}function c(t){let n=[],r=e.indiceInicial;for(let i of t)i?r+=e.paso:r>e.indiceInicial&&(n.push(r),r=e.indiceInicial);return r>e.indiceInicial&&n.push(r),n}function l(t,n){return t>=e.indiceInicial&&t<e.filas&&n>=e.indiceInicial&&n<e.columnas}var u=document.querySelector(`#app`);if(!u)throw Error(`No se encontró el contenedor de la aplicación.`);var d=null,f=!0;function p(){u&&(f||!d?u.innerHTML=`
            <main class="marco">
                <header class="encabezado">
                    <div class="marca" aria-label="Nonograma Chiquito">
                        <span class="marca-pixel" aria-hidden="true"></span>
                        <span>NONOGRAMA CHIQUITO</span>
                    </div>
                    <span class="etiqueta-nivel">TABLERO 5 × 5</span>
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
                    <p class="nota-inicio">5 filas · 5 columnas · 3 errores permitidos</p>
                </section>
                <footer class="pie">PIENSA EN CUADRÍCULA</footer>
            </main>
        `:d.resultado===`en_curso`?m(d):h(d))}function m(e){if(!u)return;let t=r(),n=t.columnas.map(e=>`
        <div class="pista-columna" aria-label="Pista de columna ${t.columnas.indexOf(e)+1}">
            ${e.map(e=>`<span>${e}</span>`).join(``)}
        </div>
    `).join(``),i=e.tablero.map((n,r)=>`
        <div class="fila-tablero">
            <div class="pista-fila" aria-label="Pista de fila ${r+1}">
                ${t.filas[r].map(e=>`<span>${e}</span>`).join(``)}
            </div>
            ${n.map((t,n)=>{let i=e.filaSeleccionada===r&&e.columnaSeleccionada===n,a=t===`pintada`?`pintada`:t===`tachada`?`tachada`:`sin resolver`;return`
                    <button
                        class="celda ${t} ${i?`seleccionada`:``}"
                        type="button"
                        data-accion="celda"
                        data-fila="${r}"
                        data-columna="${n}"
                        aria-label="Fila ${r+1}, columna ${n+1}: ${a}"
                        aria-pressed="${t!==`sin_resolver`}"
                    >${t===`tachada`?`×`:``}</button>
                `}).join(``)}
        </div>
    `).join(``);u.innerHTML=`
        <main class="marco marco-partida">
            <header class="encabezado">
                <div class="marca">
                    <span class="marca-pixel" aria-hidden="true"></span>
                    <span>NONOGRAMA CHIQUITO</span>
                </div>
                <span class="etiqueta-nivel">5 × 5</span>
            </header>
            <section class="pantalla juego" aria-labelledby="titulo-juego">
                <div class="titulo-juego">
                    <div>
                        <p class="sobrelinea">RESUELVE EL TABLERO</p>
                        <h1 id="titulo-juego">¿Qué figura es?</h1>
                    </div>
                    <div class="contador-errores ${e.errores>0?`con-error`:``}" aria-live="polite">
                        <span>ERRORES</span>
                        <strong>${e.errores}<span> / 3</span></strong>
                    </div>
                </div>
                <div class="tablero-contenedor">
                    <div class="tablero" role="group" aria-label="Tablero de nonograma">
                        <div class="cabecera-pistas">
                            <span class="esquina-pistas" aria-hidden="true">↓</span>
                            ${n}
                        </div>
                        ${i}
                    </div>
                </div>
                <div class="leyenda" aria-label="Estados de casilla">
                    <span><i class="muestra vacia" aria-hidden="true"></i>Sin resolver</span>
                    <span><i class="muestra llena" aria-hidden="true"></i>Pintada</span>
                    <span><i class="muestra cruz" aria-hidden="true">×</i>Descartada</span>
                </div>
                <div class="ayuda-teclado">
                    <span>Flechas para moverte</span>
                    <span class="separador" aria-hidden="true">·</span>
                    <span>Espacio para cambiar</span>
                </div>
                <button class="boton boton-comprobar" type="button" data-accion="comprobar">
                    Comprobar dibujo <span aria-hidden="true">↗</span>
                </button>
            </section>
            <footer class="pie">TOCA UNA CELDA PARA CAMBIARLA</footer>
        </main>
    `}function h(e){if(!u)return;let t=e.resultado===`victoria`,n=e.tablero.map((e,t)=>`
        <div class="fila-final">
            ${e.map((e,n)=>`
                <span
                    class="celda-final ${e}"
                    aria-label="Fila ${t+1}, columna ${n+1}: ${e}"
                >${e===`tachada`?`×`:``}</span>
            `).join(``)}
        </div>
    `).join(``);u.innerHTML=`
        <main class="marco">
            <header class="encabezado">
                <div class="marca">
                    <span class="marca-pixel" aria-hidden="true"></span>
                    <span>NONOGRAMA CHIQUITO</span>
                </div>
                <span class="etiqueta-nivel">PARTIDA FINALIZADA</span>
            </header>
            <section class="pantalla final ${t?`final-victoria`:`final-derrota`}" aria-labelledby="titulo-final">
                <p class="sobrelinea">${t?`FIGURA DESCUBIERTA`:`TABLERO DETENIDO`}</p>
                <h1 id="titulo-final">${t?`¡Lo resolviste!`:`Se acabaron los intentos.`}</h1>
                <p class="texto-intro">${t?`Completaste el nonograma correctamente.`:`Llegaste al límite de errores. Probá otra vez.`}</p>
                <div class="figura-final" role="img" aria-label="Figura final del tablero">${n}</div>
                <p class="resumen-final">Errores: ${e.errores} / 3</p>
                <button class="boton boton-principal" type="button" data-accion="reiniciar">
                    Jugar de nuevo <span aria-hidden="true">↻</span>
                </button>
            </section>
            <footer class="pie">NONOGRAMA 5 × 5</footer>
        </main>
    `}u.addEventListener(`click`,e=>{let t=e.target;if(!(t instanceof HTMLElement))return;let r=t.closest(`button[data-accion]`);if(!r)return;let i=r.dataset.accion;i===`empezar`||i===`reiniciar`?(d=n(),f=!1):i===`celda`&&d?a(d,Number(r.dataset.fila),Number(r.dataset.columna)):i===`comprobar`&&d&&s(d),p()}),document.addEventListener(`keydown`,e=>{if(!d||f||d.resultado!==`en_curso`||e.repeat)return;let t={ArrowUp:`arriba`,ArrowDown:`abajo`,ArrowLeft:`izquierda`,ArrowRight:`derecha`};e.key in t?(e.preventDefault(),i(d,t[e.key])&&p()):e.code===`Space`&&(e.preventDefault(),o(d)&&p())}),p();