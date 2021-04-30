 /*
 * 2C = Two of Clubs
 * 2D = Two of Diamonds
 * 2H = Two of Hearts
 * 2S = Two of Spades
 */

(()=>{

    'use strict'
    // Globales
    let deck = [];
    const basicCards = ['A',2,3,4,5,6,7,8,9,10,'J','Q','K'],
          basicDeck  = ['C','D','H','S'];
    
    let puntosJugadores = [];
    let jugadorPerdio = false,
           turnoJugador = true;

    // Referencias del html
    const btnPedir         = document.querySelector('#btnPedir'),
          btnHold          = document.querySelector('#btnHold'),
          btnNuevo         = document.querySelector('#btnNuevo'),
          disPuntos        = document.querySelectorAll('small'),
          divCartasJugadores = document.querySelectorAll('.divCartas');
     
    // Funcion para inicializar el juego
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];

        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }

        disPuntos.forEach(elem => elem.innerText = 0);
        divCartasJugadores.forEach(elem => elem.innerHTML = '');
    
        jugadorPerdio = false;
    
        btnPedir.disabled = false;
        btnHold.disabled = false;
    };
          
    // funcion para crear un deck no ordenado
     const crearDeck = ()=> {

        deck = [];

        for (let i = 0; i < basicCards.length; i++) {
            const card = basicCards[i];
            for (let j = 0; j < basicDeck.length; j++) {
                const cardDeck = card + basicDeck[j];
                deck.push(cardDeck);
            }
        }
        return _.shuffle(deck);
     };
    

    // Funcion que permite pedir una carta jugador
    const pedirCarta = () => {

        return (deck.length>0) ? deck.shift() : 'No hay cartas en el deck';
    
    };

    // Funcion que permite darle un valor a cada carta
    const valorCarta = (jugador,carta) => {
        
        const cartaValor = carta.substring(0, carta.length - 1);
        const puntosJugador = puntosJugadores[jugador];
        const puntosComputadora = puntosJugadores[puntosJugadores.length - 1];
    
        return isNaN(cartaValor) && cartaValor === 'A' ? ((turnoJugador && puntosJugador + 11 > 21) || puntosComputadora + 11 > 21) ? 1
            :11
            :(isNaN(cartaValor)) ? 10
            : cartaValor*1;
    
    };

    // Funcion para acumular los puntos. jugador: 0 = jugador 1, 1 = jugador 2, etc... el ultimo sera la computadora
    const acumularPuntos = (jugador,carta) => {

        puntosJugadores[jugador] += valorCarta(jugador, carta);
        disPuntos[jugador].innerText = puntosJugadores[jugador];
        return puntosJugadores[jugador];

    }

    const crearCarta = (jugador, carta) => {

        const imgCarta = document.createElement('img');
            imgCarta.classList.add('carta');
            imgCarta.alt = 'Carta Computadora';
            imgCarta.src = `assets/img/${carta}.png`;
    
            divCartasJugadores[jugador].append(imgCarta);
        
    }
    
    // Turno de la computadora
    const turnoComputadora = (puntosJugador) => {
    
        let puntosComputadora = 0;
        do {

            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(puntosJugadores.length - 1,carta);
            crearCarta(divCartasJugadores.length - 1,carta);
    
        } while (puntosComputadora < puntosJugador && !jugadorPerdio );

        determinarGanador();
        
    };

    // Funcion que determina quien gana
    const determinarGanador = () => {

        const [puntosJugador, puntosComputadora] = puntosJugadores;

        setTimeout(() => {
            
            if (jugadorPerdio) {
                alert('Perdiste');
            } else if (puntosComputadora > 21) {
                alert('Ganaste');
            } else if (puntosJugador > puntosComputadora) {
                alert('Ganaste');
            } else if (puntosJugador === puntosComputadora) {
                alert('Empate');
            } else {
                alert('Perdiste');
            }
            
        }, 30);

    }
    
    // ------- Eventos --------
    
    btnPedir.addEventListener('click', () => {
    
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(0, carta);
    
        // insertar carta
        crearCarta(0, carta);
    
        // Logica de ganar o perder
    
        if (puntosJugador > 21) {
            console.warn('Lo siento, perdiste');
            btnPedir.disabled = true;
            btnHold.disabled = true;
            jugadorPerdio = true;
            turnoComputadora(puntosJugador);
        } else if (puntosJugador === 21) {
            console.warn('21, genial!!');
            btnPedir.disabled = true;
            btnHold.disabled = true;
            turnoJugador = false;
            turnoComputadora(puntosJugador);
        }
    
        // console.log({carta, puntosJugador});
    });
    
    btnHold.addEventListener('click', () => {
    
        btnPedir.disabled = true;
        btnHold.disabled = true;
        turnoJugador = false;
        turnoComputadora(puntosJugadores[0]);
    
    });
    
    btnNuevo.addEventListener('click', () => {
    
        inicializarJuego();
        
    });

})();

 
