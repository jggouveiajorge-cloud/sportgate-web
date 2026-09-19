import type { Review } from "./types";

export const REVIEWS: Record<string, Review[]> = {
  "op-alps-experience": [
    {
      author: "Laura M.",
      rating: 5,
      text: "Subimos Alpe d'Huez con soporte constante del furgón. El guía adaptó el ritmo a mi nivel real, no al del grupo más fuerte.",
      dims: { guia: 5, itinerario: 5, equipo: 4, precio: 4 },
    },
    {
      author: "Thomas B.",
      rating: 4,
      text: "Muy buena organización. El alojamiento del segundo día fue algo justo de espacio para las bicis.",
      dims: { guia: 5, itinerario: 4, equipo: 4, precio: 4 },
    },
  ],
  "op-mallorca-cycling": [
    {
      author: "Sofía R.",
      rating: 5,
      text: "Sa Calobra con ellos fue perfecta: nos avisaron del tráfico de autobuses turísticos y cambiaron el horario de salida.",
      dims: { guia: 5, itinerario: 5, equipo: 5, precio: 5 },
    },
  ],
  "coach-marc-dupont": [
    {
      author: "Diego P.",
      rating: 5,
      text: "8 semanas de plan y llegué al Mortirolo sin explotar en la primera rampa. Muy metódico con los datos de potencia.",
    },
  ],
  "op-serra-catarinense": [
    {
      author: "Fernanda A.",
      rating: 5,
      text: "Conocen cada curva de la Serra do Rio do Rastro. El transporte desde Florianópolis fue puntual.",
      dims: { guia: 5, itinerario: 5, equipo: 4, precio: 5 },
    },
  ],
  "op-rockies-adventure": [
    {
      author: "Michael T.",
      rating: 4,
      text: "El día de aclimatación antes de subir fue clave — sin eso, la altitud me hubiera arruinado el reto.",
      dims: { guia: 4, itinerario: 5, equipo: 4, precio: 4 },
    },
  ],
};
