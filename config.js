/* =====================  CONFIGURACIÓN (edita aquí)  ===================== */

// 1) Canción: pon el mp3 en la MISMA carpeta que index.html y escribe su nombre exacto.
const CANCION = "Salvia(mp3j.cc).mp3";

// 2) Letra sincronizada
//    t    = segundo en que se ilumina el verso
//    text = el verso que se muestra dentro del contenedor
//    Agrega o quita líneas como necesites (una línea por verso).
//    Para ver el segundo actual mientras suena: pulsa la tecla T
//    o abre la página con #tiempo al final de la dirección.
const LETRA = [
  { t: 0.0, text: ":33" },
  { t: 9.5, text: "Entre tanta gente mirar" },
  { t: 14.0, text: "Si es que estas tu" },
  { t: 18.5, text: "si volveras" },
  { t: 23.0, text: "Quedarme afuera y huir" },
  { t: 28.0, text: "A dónde vas" },
  { t: 32.5, text: "Déjame entrar" },
  { t: 37.0, text: "Y si es verdad que no puedes dormir aquí" },
  { t: 41.5, text: "Vayámonos muy lejos" },
  { t: 46.5, text: "A dónde no nos quiebren" },
  { t: 50.5, text: "Sin pensar eres mis sueños más profundos" },
  { t: 59.0, text: "Aquello que no puedo ocultar" },
  { t: 67.0, text: "Aunque quiera" },
  { t: 68.0, text: "Y sé que aunque pueda, no quiero ocupar mi mente en nadie más" },
  { t: 84.5, text: "Entre tanta gente te vi" },
  { t: 89.0, text: "No quise más" },
  { t: 92.5, text: "Ya sé que estoy viviendo" },
  { t: 98.0, text: "Y si es verdad que no puedes dormir aquí" },
  { t: 102.0, text: "Vayámonos muy lejos" },
  { t: 106.0, text: "A dónde no nos quiebren" },
  { t: 110.5, text: "Sin pensar eres mis sueños más profundos" },
  { t: 120.0, text: "Aquello que no puedo ocultar" },
  { t: 124.5, text: "Aunque quiera" },
  { t: 126.5, text: "Y sé que aunque pueda, no quiero ocupar mi mente en nadie más" },
  { t: 137.5, text: "te amo tanto mi calabacita " },

];
const ADELANTO = 0;         // segundos para adelantar (+) o atrasar (-) TODA la letra
const LETRA_ARRIBA = false; // true = letra arriba del texto, false = abajo

// 3) Texto que se escribe solo
const TEXTO = "No te desprendas nunca de mí.\nPermanece en mi interior,\nfusiona tu alma con la mía\nhasta que seamos solo uno.\nIncluso si eso significa estar equivocado.\nNo me dejes sola.\nVive para mí.\nE incluso en el último suspiro de tu vida,\npiensa solo en mí.\nSin importar lo egoísta que sea,\nsé mío.\nPorque para mí,\nentre todas las sombras de este mundo,\nno hay nadie tan dolorosamente hermoso como tú.";
const TEXTO_INICIA = 2;     // segundos después de tocar para que empiece a escribirse
const VELOCIDAD = 55;       // milisegundos por letra
