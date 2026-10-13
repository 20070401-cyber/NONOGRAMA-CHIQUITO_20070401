(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={filas:5,columnas:5,erroresMaximos:3,erroresIniciales:0,indiceInicial:0,paso:1,segundosPorMinuto:60,milisegundosPorSegundo:1e3},t=[[!1,!0,!1,!0,!1],[!0,!0,!0,!0,!0],[!0,!0,!0,!0,!0],[!1,!0,!0,!0,!1],[!1,!1,!0,!1,!1]];function n(){return{tablero:Array.from({length:e.filas},()=>Array.from({length:e.columnas},()=>`sin_resolver`)),errores:e.erroresIniciales,filaSeleccionada:e.indiceInicial,columnaSeleccionada:e.indiceInicial,modoCelda:`pintar`,resultado:`en_curso`}}function r(){return{filas:t.map(e=>l(e)),columnas:Array.from({length:e.columnas},(e,n)=>l(t.map(e=>e[n])))}}function i(t,n){if(t.resultado!==`en_curso`)return!1;let r=t.filaSeleccionada,i=t.columnaSeleccionada;switch(n){case`arriba`:r-=e.paso;break;case`abajo`:r+=e.paso;break;case`izquierda`:i-=e.paso;break;case`derecha`:i+=e.paso}return u(r,i)?(t.filaSeleccionada=r,t.columnaSeleccionada=i,!0):!1}function a(e,t){return e.resultado===`en_curso`&&(e.modoCelda=t,!0)}function o(n,r,i){if(n.resultado!==`en_curso`||!u(r,i))return!1;let a=n.tablero[r][i];return n.modoCelda===`pintar`?a===`pintada`?n.tablero[r][i]=`sin_resolver`:(n.tablero[r][i]=`pintada`,t[r][i]||(n.errores+=e.paso,n.errores>e.erroresMaximos&&(n.resultado=`derrota`))):n.tablero[r][i]=a===`tachada`?`sin_resolver`:`tachada`,!0}function s(e){return o(e,e.filaSeleccionada,e.columnaSeleccionada)}function c(e){return e.resultado===`en_curso`&&(e.tablero.every((e,n)=>e.every((e,r)=>e!==`sin_resolver`&&e===`pintada`===t[n][r]))&&(e.resultado=`victoria`),!0)}function l(t){let n=[],r=e.indiceInicial;for(let i of t)i?r+=e.paso:r>e.indiceInicial&&(n.push(r),r=e.indiceInicial);return r>e.indiceInicial&&n.push(r),n}function u(t,n){return t>=e.indiceInicial&&t<e.filas&&n>=e.indiceInicial&&n<e.columnas}var d=document.querySelector(`#app`);if(!d)throw Error(`No se encontró el contenedor de la aplicación.`);var f=null,p=!0,m=0,h=0,g=null;function _(t){let n=Math.floor(t/e.segundosPorMinuto),r=t%e.segundosPorMinuto;return`${String(n).padStart(2,`0`)}:${String(r).padStart(2,`0`)}`}function v(){g!==null&&(window.clearInterval(g),g=null)}function y(){v(),m=Date.now(),h=0,g=window.setInterval(()=>{h=Math.floor((Date.now()-m)/e.milisegundosPorSegundo);let t=document.querySelector(`#tiempo-partida`);t&&(t.textContent=_(h))},e.milisegundosPorSegundo)}function b(){f&&f.resultado!==`en_curso`&&v()}function x(){f&&(c(f),b(),S())}function S(){d&&(p||!f?d.innerHTML=`
            <main class="marco">
                <header class="encabezado">
                    <div class="marca" aria-label="Nonograma Chiquito">
                        <span class="marca-pixel" aria-hidden="true"></span>
                        <span>NONOGRAMA CHIQUITO</span>
                    </div>
                    <span class="etiqueta-nivel">TABLERO ${e.filas} × ${e.columnas}</span>
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
                    <p class="nota-inicio">${e.filas} filas · ${e.columnas} columnas · ${e.erroresMaximos} errores permitidos</p>
                </section>
                <footer class="pie">PIENSA EN CUADRÍCULA</footer>
            </main>
        `:f.resultado===`en_curso`?C(f):w(f))}function C(t){if(!d)return;let n=r(),i=n.columnas.map(e=>`
        <div class="pista-columna" aria-label="Pista de columna ${n.columnas.indexOf(e)+1}">
            ${e.map(e=>`<span>${e}</span>`).join(``)}
        </div>
    `).join(``),a=t.tablero.map((e,r)=>`
        <div class="fila-tablero">
            <div class="pista-fila" aria-label="Pista de fila ${r+1}">
                ${n.filas[r].map(e=>`<span>${e}</span>`).join(``)}
            </div>
            ${e.map((e,n)=>{let i=t.filaSeleccionada===r&&t.columnaSeleccionada===n,a=e===`pintada`?`pintada`:e===`tachada`?`tachada`:`sin resolver`;return`
                    <button
                        class="celda ${e} ${i?`seleccionada`:``}"
                        type="button"
                        data-accion="celda"
                        data-fila="${r}"
                        data-columna="${n}"
                        aria-label="Fila ${r+1}, columna ${n+1}: ${a}"
                        aria-pressed="${e!==`sin_resolver`}"
                    >${e===`tachada`?`×`:``}</button>
                `}).join(``)}
        </div>
    `).join(``);d.innerHTML=`
        <main class="marco marco-partida">
            <header class="encabezado">
                <div class="marca">
                    <span class="marca-pixel" aria-hidden="true"></span>
                    <span>NONOGRAMA CHIQUITO</span>
                </div>
                <div class="datos-cabecera">
                    <span class="etiqueta-nivel">${e.filas} × ${e.columnas}</span>
                    <span class="temporizador">Tiempo: <strong id="tiempo-partida">${_(h)}</strong></span>
                </div>
            </header>
            <section class="pantalla juego" aria-labelledby="titulo-juego">
                <div class="titulo-juego">
                    <div>
                        <p class="sobrelinea">RESUELVE EL TABLERO</p>
                        <h1 id="titulo-juego">¿Qué figura es?</h1>
                    </div>
                    <div class="contador-errores ${t.errores>0?`con-error`:``}" aria-live="polite">
                        <span>ERRORES</span>
                        <strong>${t.errores}<span> / ${e.erroresMaximos}</span></strong>
                    </div>
                </div>
                <div class="tablero-contenedor">
                    <div class="tablero" role="group" aria-label="Tablero de nonograma">
                        <div class="cabecera-pistas">
                            <span class="esquina-pistas" aria-hidden="true">↓</span>
                            ${i}
                        </div>
                        ${a}
                    </div>
                </div>
                <div class="leyenda" aria-label="Estados de casilla">
                    <span><i class="muestra vacia" aria-hidden="true"></i>Sin resolver</span>
                    <span><i class="muestra llena" aria-hidden="true"></i>Pintada</span>
                    <span><i class="muestra cruz" aria-hidden="true">×</i>Descartada</span>
                </div>
                <div class="modos-celda" role="group" aria-label="Modo de celda">
                    <button class="modo-celda ${t.modoCelda===`pintar`?`activo`:``}" type="button" data-accion="modo" data-modo="pintar" aria-pressed="${t.modoCelda===`pintar`}">Pintar</button>
                    <button class="modo-celda ${t.modoCelda===`tachar`?`activo`:``}" type="button" data-accion="modo" data-modo="tachar" aria-pressed="${t.modoCelda===`tachar`}">Marcar X</button>
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
    `}function w(t){if(!d)return;let n=t.resultado===`victoria`,r=t.tablero.map((e,t)=>`
        <div class="fila-final">
            ${e.map((e,n)=>`
                <span
                    class="celda-final ${e}"
                    aria-label="Fila ${t+1}, columna ${n+1}: ${e}"
                >${e===`tachada`?`×`:``}</span>
            `).join(``)}
        </div>
    `).join(``);d.innerHTML=`
        <main class="marco">
            <header class="encabezado">
                <div class="marca">
                    <span class="marca-pixel" aria-hidden="true"></span>
                    <span>NONOGRAMA CHIQUITO</span>
                </div>
                <div class="datos-cabecera">
                    <span class="etiqueta-nivel">PARTIDA FINALIZADA</span>
                    <span class="temporizador">Tiempo: <strong>${_(h)}</strong></span>
                </div>
            </header>
            <section class="pantalla final ${n?`final-victoria`:`final-derrota`}" aria-labelledby="titulo-final">
                <p class="sobrelinea">${n?`FIGURA DESCUBIERTA`:`TABLERO DETENIDO`}</p>
                <h1 id="titulo-final">${n?`¡Lo resolviste!`:`Se acabaron los intentos.`}</h1>
                <p class="texto-intro">${n?`Completaste el nonograma correctamente.`:`Llegaste al límite de errores. Probá otra vez.`}</p>
                <div class="figura-final" role="img" aria-label="Figura final del tablero">${r}</div>
                <p class="resumen-final">Errores: ${t.errores} / ${e.erroresMaximos}</p>
                <button class="boton boton-principal" type="button" data-accion="reiniciar">
                    Jugar de nuevo <span aria-hidden="true">↻</span>
                </button>
            </section>
            <footer class="pie">NONOGRAMA 5 × 5</footer>
        </main>
    `}d.addEventListener(`click`,e=>{let t=e.target;if(!(t instanceof HTMLElement))return;let r=t.closest(`button[data-accion]`);if(!r)return;let i=r.dataset.accion;if(i===`empezar`||i===`reiniciar`)f=n(),p=!1,y();else if(i===`celda`&&f)o(f,Number(r.dataset.fila),Number(r.dataset.columna)),b();else if(i===`modo`&&f&&r.dataset.modo)a(f,r.dataset.modo);else if(i===`comprobar`&&f){x();return}S()}),document.addEventListener(`keydown`,e=>{if(!f||p||f.resultado!==`en_curso`)return;let t=e.key.toLowerCase();if(e.key===`Enter`||t===`c`){e.repeat||(e.preventDefault(),x());return}if(e.repeat)return;let n={ArrowUp:`arriba`,ArrowDown:`abajo`,ArrowLeft:`izquierda`,ArrowRight:`derecha`};e.key in n?(e.preventDefault(),i(f,n[e.key])&&S()):e.code===`Space`?(e.preventDefault(),s(f)&&(b(),S())):t===`x`&&(e.preventDefault(),a(f,`tachar`)&&S())}),S();