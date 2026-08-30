import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ---------- Design tokens ----------
// bg: #0B0F14 (ink), panel: #131922, accent burn: #FF5A3C, accent progress: #C4F135
// text: #F2F1EC, muted: #8A93A3

// ---------- Frases motivacionales ----------
const MOTIVATIONAL_QUOTES = [
  "No hace falta ser perfecta, alcanza con no rendirte.",
  "Cada pequeño paso de hoy es una decisión menos que tomar mañana.",
  "Estás criando sola y aun así te hacés tiempo para vos. Eso ya es fuerza.",
  "No compares tu semana 1 con la semana 20 de otra. Andá a tu ritmo.",
  "El cuerpo cambia, pero primero cambia el hábito. Vas bien.",
  "15 minutos de hoy valen más que la rutina perfecta que nunca hacés.",
  "Tu constancia le enseña algo a tus hijos, aunque no lo notes.",
  "Un día difícil no borra todo lo que ya lograste.",
  "No se trata de tener tiempo, se trata de encontrar 15 minutos para vos.",
  "Cada semana que te registrás es una semana que elegiste cuidarte.",
  "El progreso real no siempre se ve en la balanza.",
  "Estás construyendo algo sostenible, no una carrera de 100 metros.",
];

function getDailyQuote() {
  const day = Math.floor(Date.now() / 86400000);
  return MOTIVATIONAL_QUOTES[day % MOTIVATIONAL_QUOTES.length];
}

// ---------- Tips nutricionales ----------
const NUTRITION_TIPS = [
  "Tomar un vaso de agua antes de comer ayuda a comer con más conciencia.",
  "Las proteínas en cada comida ayudan a sentirte satisfecha por más tiempo.",
  "No hace falta cocinar distinto para toda la familia: ajustá las porciones, no el menú.",
  "Comer despacio, sin pantallas, ayuda a reconocer cuándo estás satisfecha.",
  "Un desayuno con proteína sostiene mejor la energía que uno solo de harinas.",
  "Cocinar el doble y congelar la mitad te ahorra tiempo en tu semana más ocupada.",
  "No existen alimentos 'prohibidos', existen porciones y frecuencias.",
  "Las verduras congeladas conservan nutrientes y son más rápidas de cocinar.",
  "Un puñado de frutos secos es mejor merienda que nada, si el tiempo apremia.",
  "Planificar el menú de la semana reduce el estrés de pensar '¿qué cocino hoy?'.",
];

function getDailyTip() {
  const day = Math.floor(Date.now() / 86400000);
  return NUTRITION_TIPS[(day + 3) % NUTRITION_TIPS.length];
}

// ---------- Modo mamá sin tiempo: rutinas exprés de 15 minutos ----------
const EXPRESS_WORKOUTS = [
  { title: "Exprés full body", items: ["Sentadillas 40s", "Flexiones 40s", "Plancha 30s", "Zancadas 40s", "Descanso 20s — repetir 3 vueltas"] },
  { title: "Exprés quema grasa", items: ["Jumping jacks 40s", "Sentadilla con salto 40s", "Escalador (mountain climber) 40s", "Descanso 20s — repetir 3 vueltas"] },
  { title: "Exprés tonificación", items: ["Puente de glúteo 40s", "Flexiones de rodillas 40s", "Plancha lateral 20s por lado", "Descanso 20s — repetir 3 vueltas"] },
];

function getExpressWorkout() {
  const day = Math.floor(Date.now() / 86400000);
  return EXPRESS_WORKOUTS[day % EXPRESS_WORKOUTS.length];
}

// ---------- Logros por hitos ----------
const WEIGHT_MILESTONES = [1, 3, 5, 10, 15];
const STREAK_MILESTONES = [2, 4, 8, 12];
const DAILY_STREAK_MILESTONES = [3, 7, 14, 30];

// ---------- Precalentamiento (antes de cada rutina) ----------
const WARMUP = [
  { text: "Marcha en el lugar", secs: 45 },
  { text: "Rotación de brazos (adelante y atrás)", secs: 30 },
  { text: "Rotación de cadera", secs: 30 },
  { text: "Sentadillas suaves sin peso", secs: 40 },
  { text: "Zancadas suaves alternando", secs: 40 },
  { text: "Rotación de tobillos", secs: 20 },
  { text: "Saltos suaves o jumping jacks", secs: 30 },
];

// ---------- Estiramiento final (al terminar cada rutina) ----------
const COOLDOWN = [
  { text: "Estiramiento de cuádriceps (parada, talón a glúteo)", secs: 30 },
  { text: "Estiramiento de isquiotibiales (pierna extendida)", secs: 30 },
  { text: "Estiramiento de gemelos contra la pared", secs: 30 },
  { text: "Estiramiento de hombros (brazo cruzado al pecho)", secs: 30 },
  { text: "Estiramiento de espalda (gato-camello o abrazo de rodillas)", secs: 30 },
  { text: "Respiración profunda y relajación", secs: 40 },
];

// ---------- Guía visual de ejercicios (ícono + tip de técnica) ----------
const EXERCISE_LIBRARY = [
  { key: "squat", match: ["sentadilla"], tip: "Pies al ancho de hombros, bajá como si te sentaras en una silla, rodillas en línea con los pies, espalda recta." },
  { key: "lunge", match: ["zancada", "búlgara", "bulgara"], tip: "Paso largo hacia adelante, bajá hasta formar 90° en ambas rodillas, tronco erguido." },
  { key: "pushup", match: ["flexion", "flexión", "flexiones"], tip: "Manos un poco más anchas que los hombros, cuerpo recto de la cabeza a los pies, bajá el pecho cerca del piso." },
  { key: "plank", match: ["plancha"], tip: "Antebrazos apoyados, cuerpo alineado sin subir ni bajar la cadera, abdomen contraído." },
  { key: "row", match: ["remo"], tip: "Espalda recta, tirá el peso hacia la cintura apretando los omóplatos, sin balancear el cuerpo." },
  { key: "press", match: ["press"], tip: "Empujá el peso hacia arriba sin arquear la espalda, controlá la bajada." },
  { key: "curl", match: ["curl"], tip: "Codos pegados al torso, subí el peso sin balancear el cuerpo, bajá controlado." },
  { key: "hipthrust", match: ["puente de glúteo", "puente de gluteo", "hip thrust"], tip: "Apoyá la espalda alta en una silla o el piso, empujá la cadera hacia arriba apretando glúteos." },
  { key: "deadlift", match: ["peso muerto"], tip: "Espalda siempre recta, empujá con las caderas hacia atrás, bajá el peso cerca de las piernas." },
  { key: "lateral", match: ["elevaciones laterales", "pájaros", "pajaros", "face pull"], tip: "Movimiento controlado, sin usar impulso, subí hasta la altura del hombro." },
  { key: "core", match: ["abdominales", "bicicleta", "russian twist", "elevación de piernas", "elevacion de piernas", "core"], tip: "Movimientos lentos y controlados, evitá tirar del cuello con las manos." },
  { key: "cardio", match: ["caminata", "hiit", "burpees", "cuerda", "salto", "cardio", "baile", "escalera", "soga"], tip: "Mantené un ritmo sostenido; si te falta el aire para hablar, bajá la intensidad." },
  { key: "dips", match: ["fondos"], tip: "Manos apoyadas en el borde de la silla, bajá flexionando los codos hacia atrás, sin hundir los hombros." },
  { key: "calf", match: ["gemelos"], tip: "Subí en punta de pie lo más alto posible, bajá controlado sin rebotar." },
  { key: "shrug", match: ["encogimientos"], tip: "Subí los hombros hacia las orejas sin usar los brazos, mantené 1 segundo arriba." },
  { key: "burpee", match: ["burpee"], tip: "Sentadilla, apoyo de manos, extendé el cuerpo hacia atrás y volvé a subir de un salto." },
  { key: "generic", match: [], tip: "Movimiento controlado, sin dolor articular. Si algo molesta, bajá el peso o el ritmo." },
];

function getExerciseInfo(itemText) {
  const lower = itemText.toLowerCase();
  const found = EXERCISE_LIBRARY.find((e) => e.match.some((m) => lower.includes(m)));
  return found || EXERCISE_LIBRARY[EXERCISE_LIBRARY.length - 1];
}

function ExerciseIcon({ type, size = 30 }) {
  const stroke = "#FF5A3C";
  const common = { fill: "none", stroke, strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    squat: <><circle cx="16" cy="6" r="3" style={common} /><path d="M16 9 L16 16 M11 22 L14 16 L18 16 L21 22 M11 14 L21 14" style={common} /></>,
    lunge: <><circle cx="14" cy="5" r="3" style={common} /><path d="M14 8 L15 15 M15 15 L10 24 M15 15 L21 12 L23 6 M10 10 L18 10" style={common} /></>,
    pushup: <><circle cx="7" cy="14" r="3" style={common} /><path d="M10 15 L26 19 M10 15 L6 22 M26 19 L29 24" style={common} /></>,
    plank: <><circle cx="6" cy="13" r="3" style={common} /><path d="M9 14 L27 18 M6 16 L4 23 M27 18 L29 12" style={common} /></>,
    row: <><circle cx="16" cy="6" r="3" style={common} /><path d="M16 9 L16 19 M11 24 L16 19 L21 24 M16 12 L9 15 M16 12 L23 15" style={common} /></>,
    press: <><circle cx="16" cy="6" r="3" style={common} /><path d="M16 9 L16 19 M11 24 L16 19 L21 24 M16 12 L9 4 M16 12 L23 4" style={common} /></>,
    curl: <><circle cx="16" cy="6" r="3" style={common} /><path d="M16 9 L16 19 M11 24 L16 19 L21 24 M16 12 L8 15 L10 8 M16 12 L24 15 L22 8" style={common} /></>,
    hipthrust: <><circle cx="8" cy="18" r="3" style={common} /><path d="M8 21 L20 21 M20 21 L26 15 M8 21 L6 27 M20 21 L24 27" style={common} /></>,
    deadlift: <><circle cx="10" cy="8" r="3" style={common} /><path d="M10 11 L14 20 M14 20 L10 27 M14 20 L20 24 M6 24 L24 24" style={common} /></>,
    lateral: <><circle cx="16" cy="6" r="3" style={common} /><path d="M16 9 L16 19 M11 24 L16 19 L21 24 M16 12 L6 10 M16 12 L26 10" style={common} /></>,
    core: <><circle cx="8" cy="22" r="3" style={common} /><path d="M8 19 L17 15 L26 20 M17 15 L15 9" style={common} /></>,
    cardio: <><circle cx="14" cy="5" r="3" style={common} /><path d="M14 8 L13 16 M13 16 L8 12 M13 16 L20 22 M13 16 L9 26" style={common} /></>,
    dips: <><circle cx="16" cy="6" r="3" style={common} /><path d="M16 9 L16 18 M10 12 L16 18 L22 12 M13 27 L16 18 L19 27" style={common} /></>,
    calf: <><circle cx="16" cy="6" r="3" style={common} /><path d="M16 9 L16 20 M16 20 L12 27 M16 20 L20 27 M12 27 L14 27 M18 27 L20 27" style={common} /></>,
    shrug: <><circle cx="16" cy="7" r="3" style={common} /><path d="M16 10 L16 19 M11 24 L16 19 L21 24 M9 12 L16 10 L23 12" style={common} /></>,
    burpee: <><circle cx="16" cy="7" r="3" style={common} /><path d="M16 10 L16 17 M8 22 L16 17 L24 22 M13 27 L16 17 L19 27" style={common} /></>,
    generic: <><circle cx="16" cy="6" r="3" style={common} /><path d="M16 9 L16 19 M11 24 L16 19 L21 24 M16 12 L9 15 M16 12 L23 15" style={common} /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
      {paths[type] || paths.generic}
    </svg>
  );
}

function WarmupBlock({ theme, innerCard }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ ...innerCard, border: `1px solid #5AC8FA44`, marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => setOpen((o) => !o)}>
        <div className="display" style={{ fontSize: 13, color: "#5AC8FA" }}>🔥 Precalentamiento (5 min)</div>
        <div style={{ fontSize: 12, color: theme.muted }}>{open ? "Ocultar" : "Ver"}</div>
      </div>
      {open && (
        <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
          {WARMUP.map((w, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: theme.text }}>
              <span>{w.text}</span>
              <span style={{ color: theme.muted, fontSize: 11.5 }}>{w.secs}s</span>
            </div>
          ))}
          <div style={{ fontSize: 11, color: theme.muted, marginTop: 4 }}>Hacé estos movimientos antes de empezar, para llegar sin lesiones a la rutina.</div>
        </div>
      )}
    </div>
  );
}

function StretchBlock({ theme, innerCard }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ ...innerCard, border: `1px solid #C4F13544`, marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => setOpen((o) => !o)}>
        <div className="display" style={{ fontSize: 13, color: "#C4F135" }}>🧘‍♀️ Estiramiento final (3-4 min)</div>
        <div style={{ fontSize: 12, color: theme.muted }}>{open ? "Ocultar" : "Ver"}</div>
      </div>
      {open && (
        <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
          {COOLDOWN.map((w, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: theme.text }}>
              <span>{w.text}</span>
              <span style={{ color: theme.muted, fontSize: 11.5 }}>{w.secs}s</span>
            </div>
          ))}
          <div style={{ fontSize: 11, color: theme.muted, marginTop: 4 }}>Estirar al final ayuda a recuperar más rápido y evitar dolores al otro día.</div>
        </div>
      )}
    </div>
  );
}

// ---------- Rutinas 100% en casa (peso corporal, mancuernas o botellas de agua) ----------
const WORKOUTS = {
  perder: {
    label: "Perder grasa",
    principiante: {
      3: [
        { day: "Día 1", focus: "Full body + cardio suave", items: ["Sentadillas 3x12", "Flexiones (rodillas si hace falta) 3x10", "Remo con mochila o botellas 3x12", "Plancha 3x20s", "Caminata rápida o baile 15 min"] },
        { day: "Día 2", focus: "Descanso activo", items: ["Caminata 30 min", "Estiramientos 10 min"] },
        { day: "Día 3", focus: "Full body + cardio", items: ["Zancadas 3x10 por pierna", "Press de hombro con botellas 3x12", "Puente de glúteo 3x15", "Abdominales bicicleta 3x15", "Saltos o cuerda 10 min"] },
      ],
    },
    intermedio: {
      4: [
        { day: "Día 1", focus: "Piernas + HIIT", items: ["Sentadilla 4x12", "Peso muerto con mancuernas 4x10", "Zancadas caminando 3x12", "HIIT en casa 15 min (30s on/30s off)"] },
        { day: "Día 2", focus: "Tren superior", items: ["Flexiones 4x10", "Remo con mancuerna o mochila 4x10", "Press militar con botellas 3x12", "Curl + fondos en silla 3x12"] },
        { day: "Día 3", focus: "Cardio + core", items: ["Cardio en casa 30 min (baile, escalera, soga)", "Plancha con toques 3x30s", "Elevación de piernas 3x15"] },
        { day: "Día 4", focus: "Full body + HIIT", items: ["Burpees 4x10", "Sentadilla goblet con mancuerna 4x12", "Remo con banda 4x12", "HIIT 15 min"] },
      ],
    },
    avanzado: {
      5: [
        { day: "Día 1", focus: "Piernas + HIIT intenso", items: ["Sentadilla con salto 5x12", "Peso muerto con mancuernas 5x10", "Zancadas con salto 4x12", "HIIT 20 min (40s on/20s off)"] },
        { day: "Día 2", focus: "Tren superior + core", items: ["Flexiones (pies elevados) 5x12", "Remo con mancuerna 5x10", "Press militar 4x12", "Plancha con toques 4x40s"] },
        { day: "Día 3", focus: "Cardio metabólico", items: ["Circuito: burpees, sentadilla salto, escalador, soga", "5 vueltas, 40s trabajo / 20s descanso"] },
        { day: "Día 4", focus: "Full body fuerza", items: ["Sentadilla goblet 5x12", "Peso muerto rumano 5x10", "Fondos en silla 4x15", "Curl + press combinado 4x12"] },
        { day: "Día 5", focus: "Core + cardio final", items: ["Russian twist 4x25", "Elevación de piernas 4x15", "Plancha lateral 3x30s por lado", "Cardio en casa 25 min"] },
      ],
    },
  },
  tonificar: {
    label: "Tonificar",
    principiante: {
      3: [
        { day: "Día 1", focus: "Tren inferior", items: ["Sentadilla 3x15", "Puente de glúteo 3x15", "Zancadas 3x12", "Plancha 3x20s"] },
        { day: "Día 2", focus: "Tren superior", items: ["Flexiones 3x10", "Remo con banda o mochila 3x15", "Press hombro con botellas 3x12", "Curl bíceps con mancuernas 3x12"] },
        { day: "Día 3", focus: "Full body suave", items: ["Circuito: sentadilla, flexión, remo, plancha", "3 vueltas, descanso 1 min"] },
      ],
    },
    intermedio: {
      4: [
        { day: "Día 1", focus: "Piernas y glúteos", items: ["Sentadilla búlgara (silla) 4x10", "Hip thrust 4x12", "Peso muerto con mancuernas 4x10", "Abductores con banda 3x15"] },
        { day: "Día 2", focus: "Espalda y bíceps", items: ["Remo con mancuerna 4x10", "Remo con banda en puerta 4x10", "Curl bíceps 3x12", "Face pull con banda 3x15"] },
        { day: "Día 3", focus: "Pecho, hombro y tríceps", items: ["Flexiones 4x10", "Press militar con mancuernas 4x10", "Fondos en silla 3x12", "Elevaciones laterales 3x15"] },
        { day: "Día 4", focus: "Core y cardio ligero", items: ["Plancha 3x40s", "Russian twist 3x20", "Bicicleta 3x20", "Cardio suave en casa 15 min"] },
      ],
    },
    avanzado: {
      5: [
        { day: "Día 1", focus: "Piernas y glúteos", items: ["Sentadilla búlgara 5x12", "Hip thrust 5x15", "Peso muerto rumano 5x10", "Zancadas con salto 4x12"] },
        { day: "Día 2", focus: "Espalda y bíceps", items: ["Remo con mancuerna 5x12", "Remo invertido con toalla 4x10", "Curl bíceps 4x12", "Face pull con banda 4x15"] },
        { day: "Día 3", focus: "Pecho, hombro y tríceps", items: ["Flexiones (pies elevados) 5x12", "Press militar 5x10", "Fondos en silla 4x15", "Elevaciones laterales 4x15"] },
        { day: "Día 4", focus: "Piernas + core", items: ["Sentadilla con salto 4x15", "Puente de glúteo a una pierna 4x12", "Plancha con toques 4x40s", "Russian twist 4x20"] },
        { day: "Día 5", focus: "Full body tonificación", items: ["Circuito completo con mancuernas", "5 vueltas, descanso 45s", "Cardio suave en casa 15 min"] },
      ],
    },
  },
  ganar: {
    label: "Ganar músculo",
    principiante: {
      3: [
        { day: "Día 1", focus: "Full body — fuerza base", items: ["Sentadilla 4x8", "Flexiones (con mochila si podés) 4x8", "Remo con mancuerna o mochila 4x8", "Plancha 3x30s"] },
        { day: "Día 2", focus: "Descanso / movilidad", items: ["Movilidad de cadera y hombro 15 min", "Caminata suave"] },
        { day: "Día 3", focus: "Full body — volumen", items: ["Peso muerto con mancuernas 4x8", "Press militar con mancuernas 4x8", "Remo con banda en puerta 4x8", "Curl + tríceps con mancuernas 3x12"] },
      ],
    },
    intermedio: {
      5: [
        { day: "Día 1", focus: "Pecho y tríceps", items: ["Flexiones (pies elevados) 5x8-10", "Press con mancuernas en el piso 4x10", "Fondos en silla 3x12", "Extensión tríceps con mancuerna 3x12"] },
        { day: "Día 2", focus: "Espalda y bíceps", items: ["Peso muerto con mancuernas 5x8", "Remo invertido con toalla en puerta 4x8", "Remo con mancuerna 4x10", "Curl con mancuernas 3x12"] },
        { day: "Día 3", focus: "Piernas", items: ["Sentadilla con mancuernas 5x8", "Zancadas búlgaras (silla) 4x10", "Peso muerto rumano con mancuernas 4x8", "Gemelos 4x15"] },
        { day: "Día 4", focus: "Hombros", items: ["Press militar con mancuernas 5x8", "Elevaciones laterales 4x12", "Pájaros con mancuernas 3x15", "Encogimientos con mancuernas 3x12"] },
        { day: "Día 5", focus: "Full body — accesorios", items: ["Circuito de core", "Trabajo de brazos con mancuernas", "Cardio ligero en casa 15 min"] },
      ],
    },
    avanzado: {
      6: [
        { day: "Día 1", focus: "Pecho y tríceps", items: ["Flexiones lastradas (mochila) 6x10", "Press con mancuernas en el piso 5x10", "Fondos en silla con peso 4x12", "Extensión tríceps con mancuerna 4x12"] },
        { day: "Día 2", focus: "Espalda y bíceps", items: ["Peso muerto con mancuernas 6x8", "Remo invertido con toalla 5x10", "Remo con mancuerna a un brazo 4x10", "Curl con mancuernas 4x12"] },
        { day: "Día 3", focus: "Piernas", items: ["Sentadilla con mancuernas 6x8", "Zancadas búlgaras con peso 5x10", "Peso muerto rumano 5x10", "Gemelos 5x15"] },
        { day: "Día 4", focus: "Hombros", items: ["Press militar con mancuernas 6x8", "Elevaciones laterales 5x12", "Pájaros con mancuernas 4x15", "Encogimientos con mancuernas 4x12"] },
        { day: "Día 5", focus: "Full body — volumen", items: ["Circuito de piernas y espalda con mancuernas", "5 vueltas, descanso 45s"] },
        { day: "Día 6", focus: "Brazos y core", items: ["Curl + tríceps combinado 5x12", "Plancha con peso 4x40s", "Russian twist con peso 4x20"] },
      ],
    },
  },
};

// ---------- Comidas con ingredientes (para armar lista de compras) ----------
const MEALS_BY_GOAL = {
  perder: {
    desayuno: [
      { food: "Yogur natural + avena + frutos rojos", ingredients: ["Yogur natural", "Avena", "Frutos rojos"] },
      { food: "2 huevos revueltos + tostada integral", ingredients: ["Huevos", "Pan integral"] },
      { food: "Licuado de banana con leche descremada y avena", ingredients: ["Banana", "Leche descremada", "Avena"] },
      { food: "Tostadas de ricota descremada y tomate", ingredients: ["Pan integral", "Ricota descremada", "Tomate"] },
    ],
    almuerzo: [
      { food: "Pechuga de pollo grillada + ensalada verde + batata al horno", ingredients: ["Pechuga de pollo", "Lechuga", "Batata"] },
      { food: "Merluza al horno + vegetales salteados", ingredients: ["Merluza", "Zapallito", "Zanahoria", "Cebolla"] },
      { food: "Ensalada de atún, huevo, lechuga y tomate", ingredients: ["Atún en lata", "Huevos", "Lechuga", "Tomate"] },
      { food: "Wok de vegetales con pollo", ingredients: ["Pechuga de pollo", "Morrón", "Cebolla", "Brotes de soja"] },
    ],
    merienda: [
      { food: "Fruta + puñado de almendras", ingredients: ["Fruta de estación", "Almendras"] },
      { food: "Yogur descremado + semillas de chía", ingredients: ["Yogur descremado", "Semillas de chía"] },
      { food: "Tostada integral con palta", ingredients: ["Pan integral", "Palta"] },
    ],
    cena: [
      { food: "Omelette de vegetales + ensalada", ingredients: ["Huevos", "Espinaca", "Tomate", "Lechuga"] },
      { food: "Sopa de vegetales + huevo duro", ingredients: ["Zapallo", "Zanahoria", "Apio", "Huevos"] },
      { food: "Pescado al horno + vegetales al vapor", ingredients: ["Filet de pescado", "Brócoli", "Zanahoria"] },
      { food: "Ensalada completa con garbanzos", ingredients: ["Garbanzos", "Lechuga", "Tomate", "Cebolla"] },
    ],
  },
  tonificar: {
    desayuno: [
      { food: "Avena con leche, banana y miel", ingredients: ["Avena", "Leche", "Banana", "Miel"] },
      { food: "Tostadas integrales con huevo y palta", ingredients: ["Pan integral", "Huevos", "Palta"] },
      { food: "Yogur con granola casera y frutas", ingredients: ["Yogur", "Granola", "Fruta de estación"] },
    ],
    almuerzo: [
      { food: "Arroz integral + pollo grillado + vegetales", ingredients: ["Arroz integral", "Pechuga de pollo", "Zapallito", "Zanahoria"] },
      { food: "Lentejas con vegetales salteados", ingredients: ["Lentejas", "Morrón", "Cebolla", "Zanahoria"] },
      { food: "Pasta integral con salsa de tomate y atún", ingredients: ["Pasta integral", "Salsa de tomate", "Atún en lata"] },
      { food: "Carne magra + puré de calabaza + ensalada", ingredients: ["Carne magra", "Calabaza", "Lechuga", "Tomate"] },
    ],
    merienda: [
      { food: "Batido de leche con fruta", ingredients: ["Leche", "Fruta de estación"] },
      { food: "Frutos secos + fruta", ingredients: ["Frutos secos", "Fruta de estación"] },
      { food: "Tostada con queso untable y mermelada casera", ingredients: ["Pan integral", "Queso untable", "Mermelada"] },
    ],
    cena: [
      { food: "Pollo o pescado + vegetales al horno", ingredients: ["Pechuga de pollo", "Zapallito", "Batata"] },
      { food: "Tortilla de vegetales + ensalada", ingredients: ["Huevos", "Papa", "Cebolla", "Lechuga"] },
      { food: "Guiso liviano de legumbres", ingredients: ["Lentejas o garbanzos", "Zanahoria", "Cebolla", "Morrón"] },
    ],
  },
  ganar: {
    desayuno: [
      { food: "Avena con leche entera, banana, miel y frutos secos", ingredients: ["Avena", "Leche entera", "Banana", "Miel", "Frutos secos"] },
      { food: "4 huevos + tostadas integrales + palta", ingredients: ["Huevos", "Pan integral", "Palta"] },
      { food: "Licuado con leche, avena y manteca de maní", ingredients: ["Leche", "Avena", "Manteca de maní", "Banana"] },
    ],
    almuerzo: [
      { food: "Arroz + carne + porción extra de legumbres", ingredients: ["Arroz", "Carne magra", "Lentejas o garbanzos"] },
      { food: "Pasta con salsa boloñesa y queso", ingredients: ["Pasta", "Carne picada", "Salsa de tomate", "Queso"] },
      { food: "Pollo con papas al horno y ensalada abundante", ingredients: ["Pechuga de pollo", "Papa", "Lechuga", "Tomate"] },
      { food: "Milanesa al horno + puré + ensalada", ingredients: ["Carne o pollo para milanesa", "Papa", "Lechuga"] },
    ],
    merienda: [
      { food: "Batido con banana y avena", ingredients: ["Leche", "Banana", "Avena"] },
      { food: "Sándwich de pan integral con fiambre magro y queso", ingredients: ["Pan integral", "Fiambre magro", "Queso"] },
      { food: "Yogur entero + granola + frutos secos", ingredients: ["Yogur entero", "Granola", "Frutos secos"] },
    ],
    cena: [
      { food: "Carne o pollo + arroz o papa + vegetales", ingredients: ["Carne o pollo", "Arroz o papa", "Zapallito"] },
      { food: "Tortilla de papa con ensalada", ingredients: ["Papa", "Huevos", "Cebolla", "Lechuga"] },
      { food: "Pasta rellena + ensalada", ingredients: ["Pasta rellena", "Lechuga", "Tomate"] },
    ],
  },
};
const DAYS_OF_WEEK = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const MEAL_SPLIT = [
  { key: "desayuno", label: "Desayuno", pct: 0.25 },
  { key: "almuerzo", label: "Almuerzo", pct: 0.35 },
  { key: "merienda", label: "Merienda", pct: 0.15 },
  { key: "cena", label: "Cena", pct: 0.25 },
];

function buildMealPlan(objetivoKey, targetKcal) {
  const goalKey = objetivoKey === "mantener" ? "tonificar" : objetivoKey;
  const options = MEALS_BY_GOAL[goalKey] || MEALS_BY_GOAL.tonificar;
  return DAYS_OF_WEEK.map((day, i) => ({
    day,
    meals: MEAL_SPLIT.map((m) => {
      const item = options[m.key][i % options[m.key].length];
      return { label: m.label, kcal: Math.round(targetKcal * m.pct), food: item.food, ingredients: item.ingredients };
    }),
  }));
}

function buildShoppingList(mealPlan) {
  const counts = {};
  mealPlan.forEach((day) => {
    day.meals.forEach((m) => {
      m.ingredients.forEach((ing) => {
        counts[ing] = (counts[ing] || 0) + 1;
      });
    });
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, count }));
}

function calcBMR({ sexo, peso, altura, edad }) {
  const base = 10 * peso + 6.25 * altura - 5 * edad;
  return sexo === "mujer" ? base - 161 : base + 5;
}

const ACTIVITY = {
  sedentario: { label: "Sedentario (poco o nada de ejercicio)", mult: 1.2 },
  ligero: { label: "Ligero (1-3 días/semana)", mult: 1.375 },
  moderado: { label: "Moderado (3-5 días/semana)", mult: 1.55 },
  activo: { label: "Activo (6-7 días/semana)", mult: 1.725 },
};

const GOALS = {
  perder: { label: "Perder grasa", pct: -0.2 },
  mantener: { label: "Mantener peso", pct: 0 },
  ganar: { label: "Ganar músculo", pct: 0.12 },
};

const DEFICIT_LEVELS = {
  moderado: { label: "Moderado", pct: -0.15, desc: "Más lento, más fácil de sostener" },
  estandar: { label: "Estándar", pct: -0.2, desc: "El más recomendado para la mayoría" },
  agresivo: { label: "Más agresivo", pct: -0.25, desc: "Resultados más rápidos, exige más disciplina" },
};

const WATER_GOAL_GLASSES = 8;

// ---------- Sustituciones de alimentos ----------
const SUBSTITUTIONS = [
  { match: ["pechuga de pollo", "pollo"], alt: ["Pavo", "Pescado blanco", "Tofu firme"] },
  { match: ["carne magra", "carne picada", "carne o pollo", "carne"], alt: ["Pollo", "Pavo", "Lentejas (opción vegetariana)"] },
  { match: ["atún"], alt: ["Pollo desmenuzado", "Huevo duro", "Sardinas"] },
  { match: ["merluza", "filet de pescado", "pescado"], alt: ["Pollo grillado", "Atún en lata", "Tofu"] },
  { match: ["huevos", "huevo"], alt: ["Claras de huevo (más light)", "Tofu revuelto", "Ricota"] },
  { match: ["palta"], alt: ["Queso untable light", "Hummus", "Ricota descremada"] },
  { match: ["batata"], alt: ["Papa", "Calabaza", "Zanahoria al horno"] },
  { match: ["arroz integral", "arroz"], alt: ["Quinoa", "Arroz blanco (porción algo menor)", "Fideos integrales"] },
  { match: ["pasta integral", "pasta"], alt: ["Fideos de arroz", "Zapallitos en tiras (zoodles)", "Pasta común"] },
  { match: ["lentejas", "garbanzos", "porotos"], alt: ["Garbanzos", "Porotos", "Lentejas"] },
  { match: ["avena"], alt: ["Salvado de trigo", "Granola sin azúcar", "Chía remojada"] },
  { match: ["yogur natural", "yogur descremado", "yogur entero", "yogur"], alt: ["Yogur vegetal (soja/almendra)", "Leche descremada con limón", "Queso cottage"] },
  { match: ["leche descremada", "leche entera", "leche"], alt: ["Leche vegetal (avena, almendra, soja)", "Leche deslactosada"] },
  { match: ["ricota descremada", "ricota"], alt: ["Queso untable light", "Queso cottage", "Yogur griego"] },
  { match: ["pan integral"], alt: ["Tostadas de arroz", "Pan de centeno", "Wrap integral"] },
  { match: ["queso"], alt: ["Queso light", "Queso vegano", "Menos cantidad de queso común"] },
  { match: ["banana"], alt: ["Manzana", "Pera", "Frutos rojos"] },
  { match: ["almendras", "frutos secos"], alt: ["Nueces", "Semillas de girasol", "Maní sin sal"] },
  { match: ["morrón", "zapallito", "zanahoria", "brócoli", "espinaca", "cebolla", "apio", "tomate", "lechuga"], alt: ["Cualquier vegetal de estación que tengas en casa"] },
];

function getSubstitutes(ingredients) {
  const results = [];
  ingredients.forEach((ing) => {
    const lower = ing.toLowerCase();
    const found = SUBSTITUTIONS.find((s) => s.match.some((m) => lower.includes(m)));
    if (found) results.push({ original: ing, alt: found.alt });
  });
  return results;
}

function Ring({ pct, color, size = 176, stroke = 14 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, pct));
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#1E2530" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - clamped)}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let curY = y;
  words.forEach((word) => {
    const testLine = line + word + " ";
    if (ctx.measureText(testLine).width > maxWidth && line !== "") {
      ctx.fillText(line, x, curY);
      line = word + " ";
      curY += lineHeight;
    } else {
      line = testLine;
    }
  });
  ctx.fillText(line, x, curY);
}

function resizeImageFile(file, maxWidth = 260, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const PROFILE_KEY = "profile:main";
const WEIGHTLOG_KEY = "weightlog:entries";
const WATER_KEY = "water:byday";
const STEPS_KEY = "steps:byday";
const SLEEP_KEY = "sleep:byday";
const PHOTOS_KEY = "photos:bydate";
const ONBOARD_KEY = "onboarding:seen";
const WORKOUTS_DONE_KEY = "workouts:done";
const MEALS_DONE_KEY = "meals:done";

function getWeekKey(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay(); // 0=domingo
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);
  return monday.toISOString().slice(0, 10);
}

// ---------- Días de la semana asignados a la rutina ----------
const WEEKDAY_LABELS = ["D", "L", "M", "M", "J", "V", "S"];
const WEEKDAY_FULL = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// Distribución razonable por defecto según cantidad de días de entrenamiento
function defaultWeekdays(n) {
  const patterns = {
    1: [1],
    2: [1, 4],
    3: [1, 3, 5],
    4: [1, 2, 4, 5],
    5: [1, 2, 3, 4, 5],
    6: [1, 2, 3, 4, 5, 6],
  };
  return patterns[n] || [1, 2, 3, 4, 5, 6].slice(0, n);
}

// ---------- Sonido y vibración ----------
function vibrateDevice(pattern) {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch (e) {}
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {}
}

// ---------- Parseo de duración para el timer ----------
function parseDuration(text) {
  const match = text.match(/(\d+)\s*(min|s)\b/i);
  if (!match) return null;
  const n = Number(match[1]);
  return match[2].toLowerCase() === "min" ? n * 60 : n;
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function ExerciseTimer({ seconds, theme, soundOn = true }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (soundOn) {
              playBeep();
              vibrateDevice([200, 100, 200]);
            }
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const toggle = () => {
    if (remaining === 0) setRemaining(seconds);
    setRunning((r) => !r);
  };
  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setRemaining(seconds);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
      <button onClick={toggle} style={{ background: "#5AC8FA22", border: "1px solid #5AC8FA55", color: "#5AC8FA", borderRadius: 8, padding: "3px 9px", fontSize: 11, cursor: "pointer" }}>
        {running ? "⏸ Pausar" : remaining === 0 ? "🔁 Repetir" : "▶ Timer"}
      </button>
      {(running || remaining !== seconds) && (
        <>
          <span style={{ fontSize: 12, color: theme.muted, fontVariantNumeric: "tabular-nums" }}>{formatTime(remaining)}</span>
          <button onClick={reset} style={{ background: "none", border: "none", color: theme.muted, fontSize: 11, cursor: "pointer" }}>✕</button>
        </>
      )}
    </div>
  );
}

function QuickRestTimer({ theme, innerCard, soundOn }) {
  const [active, setActive] = useState(null); // seconds seleccionados, o null
  return (
    <div style={{ ...innerCard, marginBottom: 12 }}>
      <div className="display" style={{ fontSize: 13, color: "#5AC8FA", marginBottom: 8 }}>⏱ Timer de descanso rápido</div>
      <div style={{ display: "flex", gap: 8 }}>
        {[30, 60, 90].map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            style={{
              flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
              border: active === s ? "1px solid #5AC8FA" : `1px solid ${theme.border}`,
              background: active === s ? "#5AC8FA22" : theme.bg,
              color: active === s ? "#5AC8FA" : theme.muted,
            }}
          >
            {s}s
          </button>
        ))}
      </div>
      {active !== null && (
        <div style={{ marginTop: 10 }}>
          <ExerciseTimer key={active} seconds={active} theme={theme} soundOn={soundOn} />
        </div>
      )}
      <div style={{ fontSize: 11, color: theme.muted, marginTop: 8 }}>Usalo entre series o ejercicios, cuando lo necesites.</div>
    </div>
  );
}

// ---------- Confetti de celebración ----------
const CONFETTI_COLORS = ["#C4F135", "#FF5A3C", "#5AC8FA", "#F2F1EC"];

function Confetti({ show }) {
  const particles = useMemo(() => {
    if (!show) return [];
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: Math.random() * 0.4,
      duration: 1.8 + Math.random() * 1.2,
      size: 6 + Math.random() * 6,
      rotate: Math.random() * 360,
    }));
  }, [show]);

  if (!show) return null;

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 70, overflow: "hidden" }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            top: -20,
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.4,
            background: p.color,
            borderRadius: 2,
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

// ---------- Preguntas frecuentes ----------
const FAQS = [
  { q: "¿Necesito equipo o gimnasio?", a: "No. Todas las rutinas están pensadas para hacer en casa, con tu propio peso corporal, mancuernas o botellas de agua como reemplazo." },
  { q: "¿Mis datos se guardan si cierro la app?", a: "Sí, todo queda guardado automáticamente. Si cambiás de celular o navegador, podés hacer una copia de seguridad desde 'Datos personales' → 'Exportar datos' y restaurarla después." },
  { q: "¿Puedo cambiar mi objetivo o nivel después?", a: "Sí, en cualquier momento desde 'Datos personales'. Tus registros anteriores no se pierden." },
  { q: "¿Con qué frecuencia debo cargar mi peso?", a: "Lo ideal es una vez por semana, siempre el mismo día, para que el seguimiento sea más preciso." },
  { q: "¿Las calorías reemplazan a un nutricionista?", a: "No. Son una estimación general basada en fórmulas validadas, pero no reemplazan una evaluación profesional, sobre todo si tenés alguna condición de salud." },
  { q: "¿Puedo usarla si estoy amamantando o embarazada?", a: "Te recomendamos consultar con tu médico antes de seguir cualquier plan de calorías o entrenamiento en esas etapas." },
];

const DARK = { bg: "#0B0F14", panel: "#131922", border: "#1E2530", text: "#F2F1EC", muted: "#8A93A3", inputBg: "#0B0F14" };
const LIGHT = { bg: "#F6F4EE", panel: "#FFFFFF", border: "#E3DFD3", text: "#1A1D22", muted: "#6B7280", inputBg: "#FFFFFF" };

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const theme = darkMode ? DARK : LIGHT;
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardChecked, setOnboardChecked] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    document.title = "Criando Sola Fit";
  }, []);

  const [form, setForm] = useState({
    nombre: "",
    sexo: "mujer",
    edad: 30,
    peso: 70,
    altura: 165,
    actividad: "ligero",
    objetivo: "perder",
    dias: 3,
    nivel: "principiante",
    pesoObjetivo: 62,
    intensidadDeficit: "estandar",
    metaAgua: 8,
    sonidoActivo: true,
    metaPasos: 8000,
    metaSueno: 7,
    diasSemana: [],
    targetOverride: null, // ajuste manual aplicado por la sugerencia automática
  });
  const [showPlan, setShowPlan] = useState(false);
  const [showMeals, setShowMeals] = useState(false);
  const [showShopping, setShowShopping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState("idle");
  const [weightLog, setWeightLog] = useState([]);
  const [newEntry, setNewEntry] = useState({ fecha: "", peso: "", cintura: "", cadera: "", brazo: "", nota: "" });
  const [showMeasureFields, setShowMeasureFields] = useState(false);
  const [logError, setLogError] = useState("");
  const [waterByDay, setWaterByDay] = useState({});
  const [stepsByDay, setStepsByDay] = useState({});
  const [sleepByDay, setSleepByDay] = useState({});
  const [photosByDate, setPhotosByDate] = useState({});
  const [photoError, setPhotoError] = useState("");
  const [workoutsDone, setWorkoutsDone] = useState({});
  const [mealsDone, setMealsDone] = useState({});
  const [uploadingPhotoFor, setUploadingPhotoFor] = useState(null);
  const [showExpress, setShowExpress] = useState(false);
  const [showMonthly, setShowMonthly] = useState(false);
  const [expandedSubs, setExpandedSubs] = useState({});
  const [showHistory, setShowHistory] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [viewingPhoto, setViewingPhoto] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [celebrate, setCelebrate] = useState(false);
  const prevAchievementsRef = useRef(0);
  const celebratedWeekRef = useRef(null);
  const fileInputRef = useRef(null);
  const shareCanvasRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await window.storage.get(PROFILE_KEY, false);
        if (!cancelled && r && r.value) setForm((f) => ({ ...f, ...JSON.parse(r.value) }));
      } catch (e) {}
      try {
        const r = await window.storage.get(WEIGHTLOG_KEY, false);
        if (!cancelled && r && r.value) setWeightLog(JSON.parse(r.value));
      } catch (e) {}
      try {
        const r = await window.storage.get(WATER_KEY, false);
        if (!cancelled && r && r.value) setWaterByDay(JSON.parse(r.value));
      } catch (e) {}
      try {
        const r = await window.storage.get(STEPS_KEY, false);
        if (!cancelled && r && r.value) setStepsByDay(JSON.parse(r.value));
      } catch (e) {}
      try {
        const r = await window.storage.get(SLEEP_KEY, false);
        if (!cancelled && r && r.value) setSleepByDay(JSON.parse(r.value));
      } catch (e) {}
      try {
        const r = await window.storage.get(PHOTOS_KEY, false);
        if (!cancelled && r && r.value) setPhotosByDate(JSON.parse(r.value));
      } catch (e) {}
      try {
        const r = await window.storage.get(WORKOUTS_DONE_KEY, false);
        if (!cancelled && r && r.value) setWorkoutsDone(JSON.parse(r.value));
      } catch (e) {}
      try {
        const r = await window.storage.get(MEALS_DONE_KEY, false);
        if (!cancelled && r && r.value) setMealsDone(JSON.parse(r.value));
      } catch (e) {}
      let seenOnboarding = false;
      try {
        const r = await window.storage.get(ONBOARD_KEY, false);
        if (r && r.value === "true") seenOnboarding = true;
      } catch (e) {}
      if (!cancelled) {
        setShowOnboarding(!seenOnboarding);
        setOnboardChecked(true);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const set = (k) => (e) => {
    const v = e.target ? e.target.value : e;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const [saveErrorDetail, setSaveErrorDetail] = useState("");

  const saveProfile = useCallback(async (overrideForm) => {
    setSaveState("saving");
    setSaveErrorDetail("");
    try {
      const result = await window.storage.set(PROFILE_KEY, JSON.stringify(overrideForm || form), false);
      setSaveState(result ? "saved" : "error");
      if (!result) setSaveErrorDetail("La app no encontró el sistema de guardado (window.storage no respondió).");
      if (result) setTimeout(() => setSaveState("idle"), 3000);
    } catch (e) {
      setSaveState("error");
      setSaveErrorDetail(e && e.message ? e.message : String(e));
    }
  }, [form]);

  const persistLog = useCallback(async (log) => {
    try {
      await window.storage.set(WEIGHTLOG_KEY, JSON.stringify(log), false);
    } catch (e) {
      setLogError("No se pudo guardar el registro. Probá de nuevo.");
    }
  }, []);

  const persistWater = useCallback(async (data) => {
    try {
      await window.storage.set(WATER_KEY, JSON.stringify(data), false);
    } catch (e) {}
  }, []);

  const persistPhotos = useCallback(async (data) => {
    try {
      await window.storage.set(PHOTOS_KEY, JSON.stringify(data), false);
    } catch (e) {
      setPhotoError("No se pudo guardar la foto. Probá con una imagen más liviana.");
    }
  }, []);

  const shareRoutineDay = (dayPlan) => {
    const lines = [
      `💪 Mi rutina de hoy — ${dayPlan.day} (${dayPlan.focus})`,
      "",
      ...dayPlan.items.map((it) => `• ${it}`),
      "",
      "Armado con Criando Sola Fit 🔥",
    ];
    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const toggleWorkoutDone = async (dayLabel) => {
    const key = `${getWeekKey()}|${dayLabel}`;
    const nowDone = !workoutsDone[key];
    const updated = { ...workoutsDone, [key]: nowDone };
    setWorkoutsDone(updated);
    if (nowDone && form.sonidoActivo) {
      playBeep();
      vibrateDevice([100, 60, 100, 60, 150]);
    }
    try {
      await window.storage.set(WORKOUTS_DONE_KEY, JSON.stringify(updated), false);
    } catch (e) {}
  };

  const toggleMealDone = async (dayLabel, mealLabel) => {
    const key = `${weekKey}|${dayLabel}|${mealLabel}`;
    const updated = { ...mealsDone, [key]: !mealsDone[key] };
    setMealsDone(updated);
    try {
      await window.storage.set(MEALS_DONE_KEY, JSON.stringify(updated), false);
    } catch (e) {}
  };

  const dismissOnboarding = async () => {
    setShowOnboarding(false);
    try {
      await window.storage.set(ONBOARD_KEY, "true", false);
    } catch (e) {}
  };

  const [backupMsg, setBackupMsg] = useState("");
  const importInputRef = useRef(null);

  const exportData = () => {
    const backup = {
      app: "Criando Sola Fit",
      exportedAt: new Date().toISOString(),
      profile: form,
      weightLog,
      waterByDay,
      stepsByDay,
      sleepByDay,
      photosByDate,
      workoutsDone,
      mealsDone,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `criando-sola-fit-backup-${todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupMsg("✓ Copia descargada");
    setTimeout(() => setBackupMsg(""), 3000);
  };

  const importData = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data.profile || !Array.isArray(data.weightLog)) {
        setBackupMsg("El archivo no parece ser una copia válida.");
        return;
      }
      setForm((f) => ({ ...f, ...data.profile }));
      setWeightLog(data.weightLog || []);
      setWaterByDay(data.waterByDay || {});
      setStepsByDay(data.stepsByDay || {});
      setSleepByDay(data.sleepByDay || {});
      setPhotosByDate(data.photosByDate || {});
      setWorkoutsDone(data.workoutsDone || {});
      setMealsDone(data.mealsDone || {});

      await Promise.all([
        window.storage.set(PROFILE_KEY, JSON.stringify({ ...form, ...data.profile }), false),
        window.storage.set(WEIGHTLOG_KEY, JSON.stringify(data.weightLog || []), false),
        window.storage.set(WATER_KEY, JSON.stringify(data.waterByDay || {}), false),
        window.storage.set(STEPS_KEY, JSON.stringify(data.stepsByDay || {}), false),
        window.storage.set(SLEEP_KEY, JSON.stringify(data.sleepByDay || {}), false),
        window.storage.set(PHOTOS_KEY, JSON.stringify(data.photosByDate || {}), false),
        window.storage.set(WORKOUTS_DONE_KEY, JSON.stringify(data.workoutsDone || {}), false),
        window.storage.set(MEALS_DONE_KEY, JSON.stringify(data.mealsDone || {}), false),
      ]);
      setBackupMsg("✓ Datos restaurados");
    } catch (err) {
      setBackupMsg("No se pudo leer el archivo. Verificá que sea una copia de Criando Sola Fit.");
    }
    setTimeout(() => setBackupMsg(""), 4000);
  };

  const addEntry = async () => {
    setLogError("");
    if (!newEntry.fecha || !newEntry.peso) {
      setLogError("Completá la fecha y el peso.");
      return;
    }
    const pesoNum = Number(newEntry.peso);
    if (Number.isNaN(pesoNum) || pesoNum <= 0) {
      setLogError("Ingresá un peso válido.");
      return;
    }
    const entry = { fecha: newEntry.fecha, peso: pesoNum };
    if (newEntry.cintura) entry.cintura = Number(newEntry.cintura);
    if (newEntry.cadera) entry.cadera = Number(newEntry.cadera);
    if (newEntry.brazo) entry.brazo = Number(newEntry.brazo);
    if (newEntry.nota) entry.nota = newEntry.nota;

    let updated;
    if (editingIndex !== null) {
      updated = weightLog.map((e, i) => (i === editingIndex ? entry : e)).sort((a, b) => a.fecha.localeCompare(b.fecha));
    } else {
      updated = [...weightLog, entry].sort((a, b) => a.fecha.localeCompare(b.fecha));
    }
    setWeightLog(updated);
    setNewEntry({ fecha: "", peso: "", cintura: "", cadera: "", brazo: "", nota: "" });
    setEditingIndex(null);
    await persistLog(updated);
  };

  const startEdit = (idx) => {
    const e = weightLog[idx];
    setNewEntry({
      fecha: e.fecha,
      peso: String(e.peso),
      cintura: e.cintura ? String(e.cintura) : "",
      cadera: e.cadera ? String(e.cadera) : "",
      brazo: e.brazo ? String(e.brazo) : "",
      nota: e.nota || "",
    });
    setEditingIndex(idx);
    setShowMeasureFields(true);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setNewEntry({ fecha: "", peso: "", cintura: "", cadera: "", brazo: "", nota: "" });
  };

  const removeEntry = async (idx) => {
    const updated = weightLog.filter((_, i) => i !== idx);
    setWeightLog(updated);
    if (editingIndex === idx) cancelEdit();
    await persistLog(updated);
  };

  const resetLog = async () => {
    setWeightLog([]);
    try {
      await window.storage.delete(WEIGHTLOG_KEY, false);
    } catch (e) {}
  };

  const changeWater = async (delta) => {
    const day = todayStr();
    const current = waterByDay[day] || 0;
    const updated = { ...waterByDay, [day]: Math.max(0, current + delta) };
    setWaterByDay(updated);
    await persistWater(updated);
  };

  const changeSteps = async (delta) => {
    const day = todayStr();
    const current = stepsByDay[day] || 0;
    const updated = { ...stepsByDay, [day]: Math.max(0, current + delta) };
    setStepsByDay(updated);
    try {
      await window.storage.set(STEPS_KEY, JSON.stringify(updated), false);
    } catch (e) {}
  };

  const setSleepToday = async (hours) => {
    const day = todayStr();
    const updated = { ...sleepByDay, [day]: hours };
    setSleepByDay(updated);
    try {
      await window.storage.set(SLEEP_KEY, JSON.stringify(updated), false);
    } catch (e) {}
  };

  const openPhotoPicker = (fecha) => {
    setUploadingPhotoFor(fecha);
    setPhotoError("");
    fileInputRef.current?.click();
  };

  const handlePhotoSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !uploadingPhotoFor) return;
    try {
      const dataUrl = await resizeImageFile(file);
      const updated = { ...photosByDate, [uploadingPhotoFor]: dataUrl };
      setPhotosByDate(updated);
      await persistPhotos(updated);
    } catch (err) {
      setPhotoError("No se pudo procesar la foto.");
    }
    setUploadingPhotoFor(null);
  };

  const results = useMemo(() => {
    const edad = Number(form.edad) || 0;
    const peso = Number(form.peso) || 0;
    const altura = Number(form.altura) || 0;
    const bmr = calcBMR({ sexo: form.sexo, peso, altura, edad });
    const tdee = bmr * ACTIVITY[form.actividad].mult;
    const pct = form.objetivo === "perder" ? DEFICIT_LEVELS[form.intensidadDeficit].pct : GOALS[form.objetivo].pct;
    const baseTarget = tdee * (1 + pct);
    const target = form.targetOverride ? Number(form.targetOverride) : baseTarget;
    const proteinG = Math.round(peso * (form.objetivo === "ganar" ? 2.0 : 1.8));
    const fatG = Math.round((target * 0.27) / 9);
    const carbsG = Math.round((target - proteinG * 4 - fatG * 9) / 4);
    const alturaM = altura / 100;
    const imc = alturaM > 0 ? peso / (alturaM * alturaM) : 0;
    let imcCategoria = "";
    let imcColor = "#8A93A3";
    if (imc > 0) {
      if (imc < 18.5) { imcCategoria = "Bajo peso"; imcColor = "#5AC8FA"; }
      else if (imc < 25) { imcCategoria = "Peso normal"; imcColor = "#C4F135"; }
      else if (imc < 30) { imcCategoria = "Sobrepeso"; imcColor = "#FFB84D"; }
      else { imcCategoria = "Obesidad"; imcColor = "#FF5A3C"; }
    }
    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      baseTarget: Math.round(baseTarget),
      target: Math.round(target),
      proteinG,
      fatG,
      carbsG: Math.max(carbsG, 0),
      imc: Math.round(imc * 10) / 10,
      imcCategoria,
      imcColor,
    };
  }, [form]);

  // ---- Ajuste automático: mira las últimas 3 semanas cargadas ----
  const adjustmentSuggestion = useMemo(() => {
    if (weightLog.length < 3) return null;
    const last3 = weightLog.slice(-3);
    const change = last3[2].peso - last3[0].peso;
    const stalled = Math.abs(change) < 0.3;
    if (!stalled) return null;
    if (form.objetivo === "perder") {
      return { newTarget: results.target - 150, msg: "Tu peso no bajó en las últimas semanas. Podés bajar ~150 kcal/día para reactivar el descenso." };
    }
    if (form.objetivo === "ganar") {
      return { newTarget: results.target + 150, msg: "Tu peso no subió en las últimas semanas. Podés sumar ~150 kcal/día para seguir ganando." };
    }
    return null;
  }, [weightLog, form.objetivo, results.target]);

  const applyAdjustment = async () => {
    if (!adjustmentSuggestion) return;
    const updatedForm = { ...form, targetOverride: adjustmentSuggestion.newTarget };
    setForm(updatedForm);
    await saveProfile(updatedForm);
  };

  const availableDaysOptions = useMemo(() => {
    const table = WORKOUTS[form.objetivo][form.nivel] || WORKOUTS[form.objetivo]["principiante"];
    return Object.keys(table).map(Number);
  }, [form.objetivo, form.nivel]);

  const plan = useMemo(() => {
    const table = WORKOUTS[form.objetivo][form.nivel];
    if (!table) return null;
    const days = availableDaysOptions.includes(Number(form.dias)) ? Number(form.dias) : availableDaysOptions[0];
    return table[days];
  }, [form.objetivo, form.nivel, form.dias, availableDaysOptions]);

  const weekKey = useMemo(() => getWeekKey(), []);
  const completedThisWeek = useMemo(() => {
    if (!plan) return 0;
    return plan.filter((d) => workoutsDone[`${weekKey}|${d.day}`]).length;
  }, [plan, workoutsDone, weekKey]);

  // ---- Días de la semana asignados a cada día de la rutina ----
  const assignedWeekdays = useMemo(() => {
    if (!plan) return [];
    if (form.diasSemana && form.diasSemana.length === plan.length) return form.diasSemana;
    return defaultWeekdays(plan.length);
  }, [plan, form.diasSemana]);

  const todayWeekday = new Date().getDay();
  const todayPlanIndex = assignedWeekdays.indexOf(todayWeekday);
  const todayPlanDay = todayPlanIndex >= 0 && plan ? plan[todayPlanIndex] : null;
  const todayPlanDone = todayPlanDay ? workoutsDone[`${weekKey}|${todayPlanDay.day}`] : false;

  // ---- Historial de semanas anteriores ----
  const weeklyHistory = useMemo(() => {
    const totals = {};
    Object.entries(workoutsDone).forEach(([key, done]) => {
      if (!done) return;
      const [wk] = key.split("|");
      totals[wk] = (totals[wk] || 0) + 1;
    });
    return Object.entries(totals)
      .filter(([wk]) => wk !== weekKey)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 8)
      .map(([wk, count]) => {
        const d = new Date(wk);
        const label = d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
        return { wk, label, count };
      });
  }, [workoutsDone, weekKey]);

  const mealPlan = useMemo(() => buildMealPlan(form.objetivo, results.target), [form.objetivo, results.target]);
  const shoppingList = useMemo(() => buildShoppingList(mealPlan), [mealPlan]);
  const mealsCompletedCount = useMemo(() => {
    let count = 0;
    mealPlan.forEach((d) => d.meals.forEach((m) => { if (mealsDone[`${weekKey}|${d.day}|${m.label}`]) count++; }));
    return count;
  }, [mealPlan, mealsDone, weekKey]);
  const mealsTotalCount = mealPlan.length * (mealPlan[0]?.meals.length || 4);

  // ---- Calorías consumidas hoy (según comidas marcadas del día real) ----
  const todayMealDayName = todayWeekday === 0 ? "Domingo" : DAYS_OF_WEEK[todayWeekday - 1];
  const todayMealDay = mealPlan.find((d) => d.day === todayMealDayName);
  const todayKcalConsumed = todayMealDay
    ? todayMealDay.meals.reduce((sum, m) => (mealsDone[`${weekKey}|${todayMealDay.day}|${m.label}`] ? sum + m.kcal : sum), 0)
    : 0;

  const startWeight = weightLog.length ? weightLog[0].peso : Number(form.peso);
  const currentWeight = weightLog.length ? weightLog[weightLog.length - 1].peso : Number(form.peso);
  const goalWeight = Number(form.pesoObjetivo) || currentWeight;
  const totalToLose = startWeight - goalWeight;
  const lostSoFar = startWeight - currentWeight;
  const progressPct = totalToLose !== 0 ? Math.max(0, Math.min(1, lostSoFar / totalToLose)) : 0;
  const remaining = Math.max(0, currentWeight - goalWeight);
  const chartData = weightLog.map((e) => ({ fecha: e.fecha.slice(5), peso: e.peso }));
  const todayWater = waterByDay[todayStr()] || 0;
  const todaySteps = stepsByDay[todayStr()] || 0;
  const todaySleep = sleepByDay[todayStr()] || 0;

  // ---- Racha semanal: cuenta registros consecutivos con ~7 días de diferencia ----
  const streak = useMemo(() => {
    if (weightLog.length === 0) return 0;
    let count = 1;
    for (let i = weightLog.length - 1; i > 0; i--) {
      const diffDays = (new Date(weightLog[i].fecha) - new Date(weightLog[i - 1].fecha)) / 86400000;
      if (diffDays >= 5 && diffDays <= 10) count++;
      else break;
    }
    return count;
  }, [weightLog]);

  // ---- Recordatorio: pasaron más de 7 días desde el último registro ----
  const daysSinceLastEntry = weightLog.length ? Math.floor((new Date(todayStr()) - new Date(weightLog[weightLog.length - 1].fecha)) / 86400000) : null;
  const showReminder = weightLog.length === 0 || (daysSinceLastEntry !== null && daysSinceLastEntry >= 7);

  // ---- Racha diaria de hábitos: días seguidos con agua, pasos o sueño cargados ----
  const dailyStreak = useMemo(() => {
    const hasActivity = (ds) => (waterByDay[ds] > 0) || (stepsByDay[ds] > 0) || (sleepByDay[ds] > 0);
    let count = 0;
    const d = new Date();
    if (!hasActivity(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
    while (hasActivity(d.toISOString().slice(0, 10))) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }, [waterByDay, stepsByDay, sleepByDay]);

  // ---- Logros desbloqueados ----
  const achievements = useMemo(() => {
    const list = [];
    const totalLost = Math.max(0, startWeight - currentWeight);
    WEIGHT_MILESTONES.forEach((kg) => {
      if (totalLost >= kg) list.push({ label: `-${kg} kg`, icon: "🏅" });
    });
    STREAK_MILESTONES.forEach((w) => {
      if (streak >= w) list.push({ label: `${w} semanas seguidas`, icon: "🔥" });
    });
    DAILY_STREAK_MILESTONES.forEach((d) => {
      if (dailyStreak >= d) list.push({ label: `${d} días activos`, icon: "⭐" });
    });
    return list;
  }, [startWeight, currentWeight, streak, dailyStreak]);

  // ---- Disparadores de celebración (confetti) ----
  useEffect(() => {
    if (achievements.length > prevAchievementsRef.current) {
      setCelebrate(true);
      const t = setTimeout(() => setCelebrate(false), 2500);
      prevAchievementsRef.current = achievements.length;
      return () => clearTimeout(t);
    }
    prevAchievementsRef.current = achievements.length;
  }, [achievements.length]);

  useEffect(() => {
    if (plan && plan.length > 0 && completedThisWeek === plan.length && celebratedWeekRef.current !== weekKey) {
      setCelebrate(true);
      celebratedWeekRef.current = weekKey;
      const t = setTimeout(() => setCelebrate(false), 2500);
      return () => clearTimeout(t);
    }
  }, [completedThisWeek, plan, weekKey]);

  const dailyQuote = useMemo(() => getDailyQuote(), []);
  const dailyTip = useMemo(() => getDailyTip(), []);
  const expressWorkout = useMemo(() => getExpressWorkout(), []);

  // ---- Comparador antes/después: primera y última foto cargadas ----
  const comparePhotos = useMemo(() => {
    const withPhoto = weightLog.filter((e) => photosByDate[e.fecha]);
    if (withPhoto.length < 2) return null;
    const first = withPhoto[0];
    const last = withPhoto[withPhoto.length - 1];
    return { first: { ...first, photo: photosByDate[first.fecha] }, last: { ...last, photo: photosByDate[last.fecha] } };
  }, [weightLog, photosByDate]);

  const photoGallery = useMemo(() => {
    return weightLog.filter((e) => photosByDate[e.fecha]).map((e) => ({ fecha: e.fecha, peso: e.peso, photo: photosByDate[e.fecha] }));
  }, [weightLog, photosByDate]);

  // ---- Resumen mensual: promedio de peso por mes ----
  const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const monthlySummary = useMemo(() => {
    if (weightLog.length === 0) return [];
    const groups = {};
    weightLog.forEach((e) => {
      const key = e.fecha.slice(0, 7); // YYYY-MM
      if (!groups[key]) groups[key] = [];
      groups[key].push(e.peso);
    });
    return Object.entries(groups)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, pesos]) => {
        const [y, m] = key.split("-");
        const avg = pesos.reduce((s, p) => s + p, 0) / pesos.length;
        return { key, label: `${MONTH_NAMES[Number(m) - 1]} ${y}`, avg: Math.round(avg * 10) / 10, count: pesos.length };
      });
  }, [weightLog]);

  const shareProgress = useCallback(() => {
    const canvas = shareCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 600, H = 750;
    canvas.width = W;
    canvas.height = H;
    ctx.fillStyle = "#0B0F14";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#FF5A3C";
    ctx.font = "bold 16px Inter, sans-serif";
    ctx.fillText("CRIANDO SOLA FIT", 40, 60);
    ctx.fillStyle = "#F2F1EC";
    ctx.font = "bold 34px Inter, sans-serif";
    ctx.fillText("Mi resumen semanal", 40, 110);

    ctx.fillStyle = "#131922";
    ctx.fillRect(40, 150, W - 80, 220);
    ctx.fillStyle = "#8A93A3";
    ctx.font = "13px Inter, sans-serif";
    ctx.fillText("PESO ACTUAL", 70, 195);
    ctx.fillStyle = "#C4F135";
    ctx.font = "bold 48px Inter, sans-serif";
    ctx.fillText(`${currentWeight} kg`, 70, 245);
    ctx.fillStyle = "#8A93A3";
    ctx.font = "13px Inter, sans-serif";
    ctx.fillText(`Bajaste ${Math.max(0, startWeight - currentWeight).toFixed(1)} kg desde el inicio`, 70, 280);
    ctx.fillText(`Te faltan ${remaining.toFixed(1)} kg para tu objetivo de ${goalWeight} kg`, 70, 305);
    ctx.fillText(`🔥 Racha: ${streak} semana${streak === 1 ? "" : "s"} seguida${streak === 1 ? "" : "s"}`, 70, 335);

    ctx.fillStyle = "#1E2530";
    ctx.fillRect(40, 400, W - 80, 12);
    ctx.fillStyle = "#C4F135";
    ctx.fillRect(40, 400, (W - 80) * Math.max(0, Math.min(1, progressPct)), 12);
    ctx.fillStyle = "#8A93A3";
    ctx.font = "13px Inter, sans-serif";
    ctx.fillText(`${Math.round(progressPct * 100)}% del camino a tu objetivo`, 40, 435);

    ctx.fillStyle = "#D8DAE0";
    ctx.font = "italic 16px Inter, sans-serif";
    wrapText(ctx, `"${dailyQuote}"`, 40, 500, W - 80, 24);

    ctx.fillStyle = "#5B6472";
    ctx.font = "12px Inter, sans-serif";
    ctx.fillText("Criando Sola Fit — entrenar y comer bien, sin gimnasio.", 40, H - 30);

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "mi-progreso-criando-sola-fit.png";
    a.click();
  }, [currentWeight, startWeight, remaining, goalWeight, streak, progressPct, dailyQuote]);

  if (loading) {
    return (
      <div style={{ background: theme.bg, minHeight: "100vh", display: "grid", placeItems: "center", color: theme.muted, fontFamily: "Inter, sans-serif" }}>
        Cargando tus datos…
      </div>
    );
  }

  const cardStyle = { background: theme.panel, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 24 };
  const innerCard = { background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 16 };
  const inputStyle = { borderRadius: 10, padding: "10px 12px", fontSize: 14, width: "100%", background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` };

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", color: theme.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;800&display=swap');
        .display { font-family: 'Archivo Black', 'Inter', sans-serif; }
        .num-input { background:${theme.inputBg}; border:1px solid ${theme.border}; color:${theme.text}; }
        .num-input:focus { outline: 2px solid #C4F135; border-color:#C4F135; }
        .pill { transition: all .15s ease; }
        button:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid #C4F135; outline-offset: 1px; }
        @keyframes confetti-fall {
          0% { top: -20px; opacity: 1; }
          100% { top: 100vh; opacity: 0.2; }
        }
      `}</style>

      <Confetti show={celebrate} />

      {showOnboarding && onboardChecked && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 50, display: "grid", placeItems: "center", padding: 20 }}>
          <div style={{ background: theme.panel, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 28, maxWidth: 400 }}>
            <div style={{ fontSize: 12, letterSpacing: 3, color: "#FF5A3C", fontWeight: 700, marginBottom: 10 }}>BIENVENIDA</div>
            <div className="display" style={{ fontSize: 24, marginBottom: 12, color: theme.text }}>Criando Sola Fit</div>
            <div style={{ fontSize: 13.5, color: theme.muted, lineHeight: 1.6 }}>
              Acá vas a calcular tus calorías, generar tu rutina para hacer en casa, tu plan de comidas y anotar tu progreso semana a semana.
              <br /><br />
              Para arrancar: completá tus datos, guardalos, y después cargá tu primer peso — ese va a ser tu punto de partida.
            </div>
            <button onClick={dismissOnboarding} style={{ ...primaryBtn, marginTop: 20 }}>Empezar</button>
          </div>
        </div>
      )}

      {viewingPhoto && (
        <div
          onClick={() => setViewingPhoto(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 60, display: "grid", placeItems: "center", padding: 20 }}
        >
          <div style={{ maxWidth: 420, width: "100%" }} onClick={(e) => e.stopPropagation()}>
            <img src={viewingPhoto.photo} alt={viewingPhoto.fecha} style={{ width: "100%", borderRadius: 16 }} />
            <div style={{ textAlign: "center", marginTop: 12, color: "#F2F1EC" }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{viewingPhoto.fecha}</div>
              <div style={{ fontSize: 13, color: "#8A93A3" }}>{viewingPhoto.peso} kg</div>
            </div>
            <button onClick={() => setViewingPhoto(null)} style={{ ...secondaryBtn, marginTop: 16 }}>Cerrar</button>
          </div>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoSelected} />
      <input ref={importInputRef} type="file" accept="application/json" style={{ display: "none" }} onChange={importData} />

      <header style={{ padding: "56px 20px 32px", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ fontSize: 12, letterSpacing: 3, color: "#FF5A3C", fontWeight: 700, marginBottom: 10 }}>
            COMBUSTIÓN · TU PLAN EN CASA
          </div>
          <button
            onClick={() => setDarkMode((d) => !d)}
            style={{ background: theme.panel, border: `1px solid ${theme.border}`, borderRadius: 999, width: 38, height: 38, fontSize: 16, cursor: "pointer", flexShrink: 0 }}
            title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
        <h1 className="display" style={{ fontSize: "clamp(32px,7vw,48px)", lineHeight: 1.05, margin: 0 }}>
          {form.nombre ? `Hola, ${form.nombre}.` : "Entrená en casa,"}<br />comé con <span style={{ color: "#C4F135" }}>un plan</span>.
        </h1>
        <p style={{ color: theme.muted, marginTop: 14, fontSize: 15, maxWidth: 480 }}>
          Pensada para quien no tiene tiempo de ir al gimnasio: calorías, rutinas en casa, comidas, lista de compras y tu progreso, todo en un lugar.
        </p>
        <div style={{ marginTop: 20, borderLeft: "3px solid #C4F135", paddingLeft: 14, fontStyle: "italic", color: theme.text, fontSize: 14, maxWidth: 480 }}>
          "{dailyQuote}"
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "0 20px 80px", display: "grid", gap: 20 }}>
        {todayPlanDay && !todayPlanDone && (
          <section style={{ ...cardStyle, border: "1px solid #FF5A3C55", background: "#1A1310", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ fontSize: 20 }}>🏋️</div>
            <div style={{ fontSize: 13.5, color: "#D8DAE0" }}>
              Hoy te toca entrenar: <strong>{todayPlanDay.day} — {todayPlanDay.focus}</strong>. Bajá a "Rutina para hacer en casa" para verla.
            </div>
          </section>
        )}
        {todayPlanDay && todayPlanDone && (
          <section style={{ ...cardStyle, border: "1px solid #C4F13555", background: "#141a12", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ fontSize: 20 }}>✓</div>
            <div style={{ fontSize: 13.5, color: "#D8DAE0" }}>Ya completaste tu entrenamiento de hoy. ¡Bien ahí!</div>
          </section>
        )}

        {showReminder && (
          <section style={{ ...cardStyle, border: "1px solid #C4F13544", background: "#141a12", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ fontSize: 20 }}>⏰</div>
            <div style={{ fontSize: 13.5, color: "#D8DAE0" }}>
              {weightLog.length === 0
                ? "Todavía no cargaste tu primer registro. Empezá anotando tu peso de hoy en \"Seguimiento semanal\"."
                : `Pasaron ${daysSinceLastEntry} días desde tu último registro. Es un buen momento para anotar tu peso de esta semana.`}
            </div>
          </section>
        )}

        {(todayWater > 0 || todaySteps > 0 || todaySleep > 0 || completedThisWeek > 0 || todayKcalConsumed > 0) && (
          <section style={cardStyle}>
            <div className="display" style={{ fontSize: 15, marginBottom: 12 }}>📋 Resumen de hoy</div>
            {todayKcalConsumed > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: theme.muted }}>
                  <span>🔥 Calorías de hoy</span>
                  <span style={{ fontWeight: 700, color: theme.text }}>{todayKcalConsumed} / {results.target} kcal</span>
                </div>
                <div style={{ marginTop: 6, background: theme.border, borderRadius: 999, height: 10, overflow: "hidden" }}>
                  <div style={{ width: `${Math.min(100, (todayKcalConsumed / results.target) * 100)}%`, height: "100%", background: todayKcalConsumed > results.target ? "#FF5A3C" : "#C4F135", transition: "width .3s ease" }} />
                </div>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              <div style={{ ...innerCard, padding: "10px 14px" }}>
                <div style={{ fontSize: 11, color: theme.muted }}>💧 Agua</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{todayWater}/{form.metaAgua}</div>
              </div>
              <div style={{ ...innerCard, padding: "10px 14px" }}>
                <div style={{ fontSize: 11, color: theme.muted }}>👣 Pasos</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{todaySteps.toLocaleString("es-AR")}</div>
              </div>
              <div style={{ ...innerCard, padding: "10px 14px" }}>
                <div style={{ fontSize: 11, color: theme.muted }}>😴 Sueño</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{todaySleep > 0 ? `${todaySleep}hs` : "—"}</div>
              </div>
              <div style={{ ...innerCard, padding: "10px 14px" }}>
                <div style={{ fontSize: 11, color: theme.muted }}>🏋️ Entren. semana</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{completedThisWeek}{plan ? `/${plan.length}` : ""}</div>
              </div>
            </div>
            {dailyStreak > 0 && (
              <div style={{ marginTop: 10, fontSize: 12, color: "#F2C94C", display: "flex", alignItems: "center", gap: 6 }}>
                <span>⭐</span><span>{dailyStreak} día{dailyStreak === 1 ? "" : "s"} activa seguidos en la app</span>
              </div>
            )}
          </section>
        )}

        {/* Datos personales */}
        <section style={cardStyle}>
          <Field label="Tu nombre (opcional)" style={{ marginBottom: 14 }}>
            <input className="num-input" type="text" placeholder="Ej: Vale" value={form.nombre} onChange={set("nombre")} style={inputStyle} maxLength={20} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Sexo">
              <Segmented value={form.sexo} onChange={set("sexo")} options={[{ v: "mujer", l: "Mujer" }, { v: "hombre", l: "Hombre" }]} />
            </Field>
            <Field label="Edad">
              <input className="num-input" type="number" min="14" max="90" value={form.edad} onChange={set("edad")} style={inputStyle} />
            </Field>
            <Field label="Peso actual (kg)">
              <input className="num-input" type="number" min="30" max="250" value={form.peso} onChange={set("peso")} style={inputStyle} />
            </Field>
            <Field label="Peso objetivo (kg)">
              <input className="num-input" type="number" min="30" max="250" value={form.pesoObjetivo} onChange={set("pesoObjetivo")} style={inputStyle} />
            </Field>
            <Field label="Altura (cm)">
              <input className="num-input" type="number" min="120" max="220" value={form.altura} onChange={set("altura")} style={inputStyle} />
            </Field>
          </div>

          <Field label="Nivel de actividad diaria" style={{ marginTop: 14 }}>
            <select className="num-input" value={form.actividad} onChange={set("actividad")} style={{ ...inputStyle, width: "100%" }}>
              {Object.entries(ACTIVITY).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Objetivo" style={{ marginTop: 14 }}>
            <Segmented
              value={form.objetivo}
              onChange={(v) => setForm((f) => {
                const table = WORKOUTS[v][f.nivel] || WORKOUTS[v]["principiante"];
                const firstDays = table ? Number(Object.keys(table)[0]) : 3;
                return { ...f, objetivo: v, dias: firstDays, targetOverride: null };
              })}
              options={Object.entries(GOALS).map(([k, v]) => ({ v: k, l: v.label }))}
            />
          </Field>

          {form.objetivo === "perder" && (
            <Field label="Intensidad del déficit" style={{ marginTop: 14 }}>
              <Segmented
                value={form.intensidadDeficit}
                onChange={(v) => setForm((f) => ({ ...f, intensidadDeficit: v, targetOverride: null }))}
                options={Object.entries(DEFICIT_LEVELS).map(([k, v]) => ({ v: k, l: v.label }))}
              />
              <div style={{ fontSize: 11.5, color: theme.muted, marginTop: 8 }}>
                {DEFICIT_LEVELS[form.intensidadDeficit].desc}
              </div>
            </Field>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 14, borderTop: `1px solid ${theme.border}` }}>
            <span style={{ fontSize: 13, color: theme.text }}>🔔 Sonido y vibración</span>
            <button
              onClick={() => setForm((f) => ({ ...f, sonidoActivo: !f.sonidoActivo }))}
              style={{
                width: 44, height: 26, borderRadius: 999, border: "none", cursor: "pointer", position: "relative",
                background: form.sonidoActivo ? "#C4F135" : theme.border,
              }}
            >
              <div style={{ position: "absolute", top: 3, left: form.sonidoActivo ? 21 : 3, width: 20, height: 20, borderRadius: "50%", background: form.sonidoActivo ? "#0B0F14" : "#8A93A3", transition: "left .15s ease" }} />
            </button>
          </div>

          <button className="pill" onClick={() => saveProfile()} style={secondaryBtn}>
            {saveState === "saving" ? "Guardando…" : saveState === "saved" ? "✓ Guardado" : saveState === "error" ? "Error al guardar" : "Guardar mis datos"}
          </button>
          {saveState === "error" && saveErrorDetail && (
            <div style={{ color: "#FF5A3C", fontSize: 11.5, marginTop: 6 }}>{saveErrorDetail}</div>
          )}

          <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${theme.border}` }}>
            <div style={{ fontSize: 12, color: theme.muted, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>COPIA DE SEGURIDAD</div>
            <div style={{ fontSize: 11.5, color: theme.muted, marginBottom: 10 }}>
              Descargá un archivo con todo tu progreso, o restauralo si cambiás de celular o navegador.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={exportData} style={{ flex: 1, background: "transparent", border: `1px solid ${theme.border}`, color: theme.text, borderRadius: 10, padding: "10px 0", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                ⬇ Exportar datos
              </button>
              <button onClick={() => importInputRef.current?.click()} style={{ flex: 1, background: "transparent", border: `1px solid ${theme.border}`, color: theme.text, borderRadius: 10, padding: "10px 0", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                ⬆ Importar datos
              </button>
            </div>
            {backupMsg && <div style={{ fontSize: 11.5, color: backupMsg.startsWith("✓") ? "#C4F135" : "#FF5A3C", marginTop: 8 }}>{backupMsg}</div>}
          </div>
        </section>

        {/* Resultados + ajuste automático */}
        <section style={{ ...cardStyle, display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "center" }}>
          <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
            <Ring pct={results.target / (results.tdee * 1.3)} color={form.objetivo === "perder" ? "#FF5A3C" : "#C4F135"} />
            <div style={{ position: "absolute", textAlign: "center" }}>
              <div className="display" style={{ fontSize: 30 }}>{results.target}</div>
              <div style={{ fontSize: 11, color: "#8A93A3", letterSpacing: 1 }}>KCAL / DÍA</div>
            </div>
          </div>
          <div>
            <Row label="Metabolismo basal (BMR)" value={`${results.bmr} kcal`} />
            <Row label="Gasto total diario (TDEE)" value={`${results.tdee} kcal`} />
            <Row label="Proteína" value={`${results.proteinG} g`} accent="#C4F135" />
            <Row label="Grasas" value={`${results.fatG} g`} />
            <Row label="Carbohidratos" value={`${results.carbsG} g`} />
            <Row label="IMC" value={`${results.imc} · ${results.imcCategoria}`} accent={results.imcColor} />
          </div>
        </section>

        {adjustmentSuggestion && (
          <section style={{ ...cardStyle, border: "1px solid #FF5A3C33", background: "#1A1310" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ fontSize: 20 }}>⚡</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Ajuste automático sugerido</div>
                <div style={{ fontSize: 13, color: "#B8BFC9", marginTop: 4 }}>{adjustmentSuggestion.msg}</div>
                <button onClick={applyAdjustment} style={{ ...secondaryBtn, marginTop: 12, display: "inline-block", width: "auto", padding: "8px 16px" }}>
                  Aplicar {adjustmentSuggestion.newTarget} kcal/día
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Registro de agua */}
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div className="display" style={{ fontSize: 18 }}>Agua de hoy</div>
              <div style={{ color: theme.muted, fontSize: 13, marginTop: 2 }}>Meta: {form.metaAgua} vasos (~{(form.metaAgua * 0.25).toFixed(1)} litros)</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: theme.muted }}>Meta diaria:</span>
              <button onClick={() => setForm((f) => ({ ...f, metaAgua: Math.max(4, f.metaAgua - 1) }))} style={{ ...waterBtn, width: 28, height: 28, fontSize: 14 }}>–</button>
              <span style={{ fontSize: 13, fontWeight: 700, minWidth: 18, textAlign: "center" }}>{form.metaAgua}</span>
              <button onClick={() => setForm((f) => ({ ...f, metaAgua: Math.min(16, f.metaAgua + 1) }))} style={{ ...waterBtn, width: 28, height: 28, fontSize: 14 }}>+</button>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16 }}>
            <button onClick={() => changeWater(-1)} style={waterBtn}>–</button>
            <div style={{ textAlign: "center", minWidth: 70 }}>
              <div className="display" style={{ fontSize: 26, color: "#5AC8FA" }}>{todayWater}</div>
              <div style={{ fontSize: 11, color: theme.muted }}>vasos</div>
            </div>
            <button onClick={() => changeWater(1)} style={{ ...waterBtn, background: "#5AC8FA22", color: "#5AC8FA", borderColor: "#5AC8FA55" }}>+</button>
            <div style={{ flex: 1, display: "flex", gap: 4 }}>
              {Array.from({ length: form.metaAgua }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 20, borderRadius: 4, background: i < todayWater ? "#5AC8FA" : theme.border }} />
              ))}
            </div>
          </div>
        </section>

        {/* Registro de pasos */}
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div className="display" style={{ fontSize: 18 }}>Pasos de hoy</div>
              <div style={{ color: theme.muted, fontSize: 13, marginTop: 2 }}>Meta: {form.metaPasos.toLocaleString("es-AR")} pasos</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: theme.muted }}>Meta diaria:</span>
              <button onClick={() => setForm((f) => ({ ...f, metaPasos: Math.max(2000, f.metaPasos - 1000) }))} style={{ ...waterBtn, width: 28, height: 28, fontSize: 14 }}>–</button>
              <span style={{ fontSize: 12, fontWeight: 700, minWidth: 40, textAlign: "center" }}>{(form.metaPasos / 1000).toFixed(0)}k</span>
              <button onClick={() => setForm((f) => ({ ...f, metaPasos: Math.min(20000, f.metaPasos + 1000) }))} style={{ ...waterBtn, width: 28, height: 28, fontSize: 14 }}>+</button>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16 }}>
            <button onClick={() => changeSteps(-500)} style={waterBtn}>–</button>
            <div style={{ textAlign: "center", minWidth: 80 }}>
              <div className="display" style={{ fontSize: 22, color: "#C4F135" }}>{todaySteps.toLocaleString("es-AR")}</div>
              <div style={{ fontSize: 11, color: theme.muted }}>pasos</div>
            </div>
            <button onClick={() => changeSteps(500)} style={{ ...waterBtn, background: "#C4F13522", color: "#C4F135", borderColor: "#C4F13555" }}>+</button>
            <div style={{ flex: 1 }}>
              <div style={{ background: theme.border, borderRadius: 999, height: 12, overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, (todaySteps / form.metaPasos) * 100)}%`, height: "100%", background: "#C4F135", transition: "width .3s ease" }} />
              </div>
            </div>
          </div>
        </section>

        {/* Registro de sueño */}
        <section style={cardStyle}>
          <div className="display" style={{ fontSize: 18 }}>Sueño de anoche</div>
          <div style={{ color: theme.muted, fontSize: 13, marginTop: 2 }}>Meta: {form.metaSueno}hs — dormir bien ayuda a recuperar y a no comer de más por cansancio</div>
          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
            {[4, 5, 6, 6.5, 7, 7.5, 8, 9].map((h) => (
              <button
                key={h}
                onClick={() => setSleepToday(h)}
                style={{
                  padding: "9px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  border: todaySleep === h ? "1px solid #5AC8FA" : `1px solid ${theme.border}`,
                  background: todaySleep === h ? "#5AC8FA22" : theme.bg,
                  color: todaySleep === h ? "#5AC8FA" : theme.muted,
                }}
              >
                {h}hs
              </button>
            ))}
          </div>
          {todaySleep > 0 && (
            <div style={{ marginTop: 12, fontSize: 12, color: todaySleep >= form.metaSueno ? "#C4F135" : "#FF5A3C" }}>
              {todaySleep >= form.metaSueno ? "✓ Dormiste lo suficiente hoy" : `Te faltaron ${(form.metaSueno - todaySleep).toFixed(1)}hs para tu meta`}
            </div>
          )}
        </section>

        {/* Plan de entrenamiento */}
        <section style={cardStyle}>
          <div className="display" style={{ fontSize: 18 }}>Rutina para hacer en casa</div>
          <div style={{ color: "#8A93A3", fontSize: 13, marginTop: 2 }}>Sin gimnasio: peso corporal, mancuernas o botellas de agua</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
            <Field label="Nivel">
              <Segmented
                value={form.nivel}
                onChange={(v) => setForm((f) => {
                  const table = WORKOUTS[f.objetivo][v];
                  const firstDays = table ? Number(Object.keys(table)[0]) : f.dias;
                  return { ...f, nivel: v, dias: firstDays };
                })}
                options={[{ v: "principiante", l: "Principiante" }, { v: "intermedio", l: "Intermedio" }, { v: "avanzado", l: "Avanzado" }]}
              />
            </Field>
            <Field label="Días por semana">
              <Segmented value={String(form.dias)} onChange={(v) => setForm((f) => ({ ...f, dias: Number(v) }))} options={availableDaysOptions.map((d) => ({ v: String(d), l: `${d} días` }))} />
            </Field>
          </div>

          <button className="pill" onClick={() => setShowPlan((s) => !s)} style={primaryBtn}>
            {showPlan ? "Ocultar rutina" : "Generar mi rutina"}
          </button>

          {showPlan && plan && (
            <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", ...innerCard, padding: "10px 14px", border: "1px solid #C4F13544" }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>✅ {completedThisWeek}/{plan.length} días completados esta semana</div>
                <div style={{ flex: 1, marginLeft: 14, background: theme.border, borderRadius: 999, height: 8, overflow: "hidden" }}>
                  <div style={{ width: `${(completedThisWeek / plan.length) * 100}%`, height: "100%", background: "#C4F135", transition: "width .3s ease" }} />
                </div>
              </div>

              {weeklyHistory.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowHistory((s) => !s)}
                    style={{ background: "none", border: "none", color: theme.muted, fontSize: 12, cursor: "pointer", textDecoration: "underline", padding: 0 }}
                  >
                    {showHistory ? "Ocultar historial de semanas" : "Ver historial de semanas anteriores"}
                  </button>
                  {showHistory && (
                    <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
                      {weeklyHistory.map((w) => (
                        <div key={w.wk} style={{ display: "flex", justifyContent: "space-between", ...innerCard, padding: "8px 14px" }}>
                          <span style={{ fontSize: 12.5, color: theme.text }}>Semana del {w.label}</span>
                          <span style={{ fontSize: 12.5, fontWeight: 700, color: "#C4F135" }}>{w.count} día{w.count === 1 ? "" : "s"}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <QuickRestTimer theme={theme} innerCard={innerCard} soundOn={form.sonidoActivo} />
              <WarmupBlock theme={theme} innerCard={innerCard} />
              {plan.map((d, i) => {
                const done = workoutsDone[`${weekKey}|${d.day}`];
                const isWalkDay = d.items.every((it) => getExerciseInfo(it).key === "cardio");
                return (
                <div key={i} style={{ ...innerCard, border: done ? "1px solid #C4F135" : innerCard.border }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div className="display" style={{ fontSize: 14, color: "#C4F135" }}>{d.day}</div>
                    <div style={{ fontSize: 12, color: "#8A93A3" }}>{d.focus}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                    <span style={{ fontSize: 10.5, color: theme.muted }}>Asignar a:</span>
                    {[1, 2, 3, 4, 5, 6, 0].map((wd) => {
                      const takenByOther = assignedWeekdays[i] !== wd && assignedWeekdays.includes(wd);
                      const selected = assignedWeekdays[i] === wd;
                      return (
                        <button
                          key={wd}
                          disabled={takenByOther}
                          onClick={() => {
                            const updated = [...assignedWeekdays];
                            updated[i] = wd;
                            setForm((f) => ({ ...f, diasSemana: updated }));
                          }}
                          style={{
                            width: 22, height: 22, borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: takenByOther ? "not-allowed" : "pointer",
                            border: selected ? "1px solid #C4F135" : `1px solid ${theme.border}`,
                            background: selected ? "#C4F135" : "transparent",
                            color: selected ? "#0B0F14" : takenByOther ? theme.border : theme.muted,
                            padding: 0,
                          }}
                        >
                          {WEEKDAY_LABELS[wd]}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                    {d.items.map((it, j) => {
                      const info = getExerciseInfo(it);
                      const dur = parseDuration(it);
                      return (
                        <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <div style={{ background: "#131922", borderRadius: 8, padding: 4 }}>
                            <ExerciseIcon type={info.key} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13.5, color: "#D8DAE0", fontWeight: 600 }}>{it}</div>
                            <div style={{ fontSize: 11.5, color: "#8A93A3", marginTop: 2, lineHeight: 1.4 }}>{info.tip}</div>
                            {dur && <ExerciseTimer seconds={dur} theme={theme} soundOn={form.sonidoActivo} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {isWalkDay && (
                    <div style={{ marginTop: 12, background: "#5AC8FA15", border: "1px solid #5AC8FA44", borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: "#5AC8FA", fontWeight: 700 }}>🚶 Día de caminata — contá tus pasos acá</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                        <button onClick={() => changeSteps(-500)} style={{ ...waterBtn, width: 30, height: 30, fontSize: 14 }}>–</button>
                        <span style={{ fontSize: 15, fontWeight: 700, minWidth: 60, textAlign: "center" }}>{todaySteps.toLocaleString("es-AR")}</span>
                        <button onClick={() => changeSteps(500)} style={{ ...waterBtn, width: 30, height: 30, fontSize: 14, background: "#5AC8FA22", color: "#5AC8FA", borderColor: "#5AC8FA55" }}>+</button>
                        <span style={{ fontSize: 11, color: theme.muted }}>de {form.metaPasos.toLocaleString("es-AR")}</span>
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    <button
                      onClick={() => toggleWorkoutDone(d.day)}
                      style={{
                        flex: 1, padding: "9px 0", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
                        background: done ? "#C4F135" : "transparent",
                        color: done ? "#0B0F14" : "#C4F135",
                        border: done ? "none" : "1px solid #C4F13566",
                      }}
                    >
                      {done ? "✓ Hecho" : isWalkDay ? "Marcar caminata como hecha" : "Marcar como hecho"}
                    </button>
                    <button
                      onClick={() => shareRoutineDay(d)}
                      title="Compartir por WhatsApp"
                      style={{ width: 42, borderRadius: 10, border: "1px solid #25D36655", background: "#25D36622", color: "#25D366", fontSize: 16, cursor: "pointer" }}
                    >
                      📲
                    </button>
                  </div>
                </div>
                );
              })}
              <StretchBlock theme={theme} innerCard={innerCard} />
            </div>
          )}
        </section>

        {/* Modo mamá sin tiempo */}
        <section style={{ ...cardStyle, border: "1px solid #C4F13544" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div className="display" style={{ fontSize: 18 }}>⚡ Modo mamá sin tiempo</div>
              <div style={{ color: "#8A93A3", fontSize: 13, marginTop: 2 }}>Solo 15 minutos, sin excusas, para los días imposibles</div>
            </div>
            <button className="pill" onClick={() => setShowExpress((s) => !s)} style={{ ...secondaryBtn, margin: 0, width: "auto", padding: "10px 18px" }}>
              {showExpress ? "Ocultar" : "Ver rutina de hoy"}
            </button>
          </div>

          {showExpress && (
            <div style={{ marginTop: 18 }}>
              <WarmupBlock theme={theme} innerCard={innerCard} />
              <div style={innerCard}>
                <div className="display" style={{ fontSize: 14, color: "#C4F135", marginBottom: 8 }}>{expressWorkout.title}</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {expressWorkout.items.map((it, j) => {
                    const dur = parseDuration(it);
                    return (
                      <div key={j}>
                        <div style={{ fontSize: 13.5, color: "#D8DAE0", display: "flex", gap: 8 }}>
                          <span style={{ color: "#C4F135" }}>—</span>{it}
                        </div>
                        {dur && <div style={{ marginLeft: 16 }}><ExerciseTimer seconds={dur} theme={theme} soundOn={form.sonidoActivo} /></div>}
                      </div>
                    );
                  })}
                </div>
                <div style={{ fontSize: 11.5, color: "#8A93A3", marginTop: 10 }}>Sin equipo, sin excusas. 15 minutos alcanzan para no perder el hábito.</div>
              </div>
              <StretchBlock theme={theme} innerCard={innerCard} />
            </div>
          )}
        </section>

        {/* Plan de comidas + lista de compras */}
        <section style={cardStyle}>
          <div className="display" style={{ fontSize: 18 }}>Plan de comidas semanal</div>
          <div style={{ color: "#8A93A3", fontSize: 13, marginTop: 2 }}>Distribuido en {results.target} kcal/día</div>
          <div style={{ marginTop: 10, fontSize: 12, color: "#5AC8FA", display: "flex", gap: 6 }}>
            <span>💡</span><span style={{ color: theme.muted }}>{dailyTip}</span>
          </div>
          {mealsCompletedCount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, ...innerCard, padding: "10px 14px" }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>🍽️ {mealsCompletedCount}/{mealsTotalCount} comidas de la semana</div>
              <div style={{ flex: 1, marginLeft: 14, background: theme.border, borderRadius: 999, height: 8, overflow: "hidden" }}>
                <div style={{ width: `${(mealsCompletedCount / mealsTotalCount) * 100}%`, height: "100%", background: "#C4F135", transition: "width .3s ease" }} />
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            <button className="pill" onClick={() => setShowMeals((s) => !s)} style={{ ...primaryBtn, marginTop: 0, flex: "1 1 200px" }}>
              {showMeals ? "Ocultar plan de comidas" : "Generar plan de comidas"}
            </button>
            <button className="pill" onClick={() => setShowShopping((s) => !s)} style={{ ...secondaryBtn, marginTop: 0, flex: "1 1 200px", width: "auto" }}>
              {showShopping ? "Ocultar lista de compras" : "Ver lista de compras"}
            </button>
          </div>

          {showShopping && (
            <div style={{ marginTop: 18, ...innerCard }}>
              <div style={{ fontSize: 12, color: "#8A93A3", marginBottom: 10 }}>Ingredientes de la semana, de más a menos usados</div>
              <div style={{ display: "grid", gap: 6 }}>
                {shoppingList.map((it) => (
                  <label key={it.name} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "#D8DAE0" }}>
                    <input type="checkbox" style={{ accentColor: "#C4F135" }} />
                    {it.name} <span style={{ color: "#5B6472", fontSize: 11 }}>x{it.count}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {showMeals && (
            <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
              {mealPlan.map((d, i) => (
                <div key={i} style={innerCard}>
                  <div className="display" style={{ fontSize: 14, color: "#C4F135", marginBottom: 8 }}>{d.day}</div>
                  <div style={{ display: "grid", gap: 8 }}>
                    {d.meals.map((m, j) => {
                      const subKey = `${i}-${j}`;
                      const subs = getSubstitutes(m.ingredients || []);
                      const expanded = expandedSubs[subKey];
                      const mealKey = `${weekKey}|${d.day}|${m.label}`;
                      const eaten = mealsDone[mealKey];
                      return (
                        <div key={j}>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", flex: 1 }}>
                              <button
                                onClick={() => toggleMealDone(d.day, m.label)}
                                style={{
                                  marginTop: 2, width: 16, height: 16, borderRadius: 4, flexShrink: 0, cursor: "pointer",
                                  border: eaten ? "none" : `1px solid ${theme.border}`,
                                  background: eaten ? "#C4F135" : "transparent",
                                  color: "#0B0F14", fontSize: 10, lineHeight: "16px", padding: 0,
                                }}
                                title="Marcar como comida"
                              >
                                {eaten ? "✓" : ""}
                              </button>
                              <div style={{ fontSize: 13.5, color: eaten ? theme.muted : theme.text, textDecoration: eaten ? "line-through" : "none" }}>
                                <span style={{ color: theme.muted, fontWeight: 700 }}>{m.label}: </span>{m.food}
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                              <div style={{ fontSize: 12, color: "#5B6472", whiteSpace: "nowrap" }}>~{m.kcal} kcal</div>
                              {subs.length > 0 && (
                                <button
                                  onClick={() => setExpandedSubs((s) => ({ ...s, [subKey]: !s[subKey] }))}
                                  style={{ background: "none", border: "none", color: "#5AC8FA", fontSize: 11, cursor: "pointer", padding: 0 }}
                                  title="Ver sustituciones"
                                >
                                  🔄
                                </button>
                              )}
                            </div>
                          </div>
                          {expanded && subs.length > 0 && (
                            <div style={{ marginTop: 6, paddingLeft: 24, display: "grid", gap: 3 }}>
                              {subs.map((s, k) => (
                                <div key={k} style={{ fontSize: 11.5, color: theme.muted }}>
                                  <span style={{ color: "#5AC8FA" }}>{s.original}</span> → {s.alt.join(", ")}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Seguimiento de peso + fotos */}
        <section style={cardStyle}>
          <div className="display" style={{ fontSize: 18 }}>Seguimiento semanal</div>
          <div style={{ color: theme.muted, fontSize: 13, marginTop: 2 }}>
            {editingIndex !== null
              ? "Editando un registro existente."
              : weightLog.length === 0
              ? "Este es tu punto de partida: cargá tu peso, y si querés, tu foto y medidas de inicio."
              : `Anotá tu peso cada semana para ver tu progreso hacia ${goalWeight} kg`}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, marginTop: 16, alignItems: "end" }}>
            <Field label="Fecha">
              <input className="num-input" type="date" value={newEntry.fecha} onChange={(e) => setNewEntry((n) => ({ ...n, fecha: e.target.value }))} style={inputStyle} />
            </Field>
            <Field label="Peso (kg)">
              <input className="num-input" type="number" step="0.1" value={newEntry.peso} onChange={(e) => setNewEntry((n) => ({ ...n, peso: e.target.value }))} style={inputStyle} />
            </Field>
            <button className="pill" onClick={addEntry} style={{ ...primaryBtn, margin: 0, padding: "10px 18px", width: "auto" }}>
              {editingIndex !== null ? "Guardar cambios" : "Agregar"}
            </button>
          </div>
          {editingIndex !== null && (
            <button onClick={cancelEdit} style={{ marginTop: 8, background: "none", border: "none", color: theme.muted, fontSize: 12, cursor: "pointer", textDecoration: "underline", padding: 0 }}>
              Cancelar edición
            </button>
          )}

          <button
            onClick={() => setShowMeasureFields((s) => !s)}
            style={{ marginTop: 10, background: "none", border: "none", color: theme.muted, fontSize: 12, cursor: "pointer", textDecoration: "underline", padding: 0 }}
          >
            {showMeasureFields ? "Ocultar medidas corporales" : "+ Agregar medidas corporales (opcional)"}
          </button>

          {showMeasureFields && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 10 }}>
              <Field label="Cintura (cm)">
                <input className="num-input" type="number" step="0.5" value={newEntry.cintura} onChange={(e) => setNewEntry((n) => ({ ...n, cintura: e.target.value }))} style={inputStyle} />
              </Field>
              <Field label="Cadera (cm)">
                <input className="num-input" type="number" step="0.5" value={newEntry.cadera} onChange={(e) => setNewEntry((n) => ({ ...n, cadera: e.target.value }))} style={inputStyle} />
              </Field>
              <Field label="Brazo (cm)">
                <input className="num-input" type="number" step="0.5" value={newEntry.brazo} onChange={(e) => setNewEntry((n) => ({ ...n, brazo: e.target.value }))} style={inputStyle} />
              </Field>
            </div>
          )}

          <Field label="Nota de la semana (opcional)" style={{ marginTop: 10 }}>
            <textarea
              className="num-input"
              value={newEntry.nota}
              onChange={(e) => setNewEntry((n) => ({ ...n, nota: e.target.value }))}
              placeholder="Ej: esta semana me costó por..."
              style={{ ...inputStyle, minHeight: 60, resize: "vertical", fontFamily: "inherit" }}
            />
          </Field>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, fontSize: 12, color: "#5B6472" }}>
            <span>📷</span>
            <span>La foto se agrega tocando el ícono de cámara junto a cada fecha, más abajo en tu historial.</span>
          </div>

          {logError && <div style={{ color: "#FF5A3C", fontSize: 12, marginTop: 8 }}>{logError}</div>}
          {photoError && <div style={{ color: "#FF5A3C", fontSize: 12, marginTop: 8 }}>{photoError}</div>}

          {weightLog.length > 0 && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 22 }}>
                <Stat label="Peso inicial" value={`${startWeight} kg`} />
                <Stat label="Peso actual" value={`${currentWeight} kg`} accent="#C4F135" />
                <Stat label="Faltan" value={`${remaining.toFixed(1)} kg`} accent="#FF5A3C" />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, ...innerCard, padding: "12px 14px" }}>
                <div style={{ fontSize: 22 }}>🔥</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{streak} semana{streak === 1 ? "" : "s"} seguida{streak === 1 ? "" : "s"}</div>
                  <div style={{ fontSize: 11.5, color: "#8A93A3" }}>registrando tu progreso</div>
                </div>
              </div>

              {achievements.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                  {achievements.map((a, i) => (
                    <div key={i} style={{ background: "#0B0F14", border: "1px solid #232B37", borderRadius: 999, padding: "6px 12px", fontSize: 12, color: "#F2F1EC", display: "flex", alignItems: "center", gap: 6 }}>
                      <span>{a.icon}</span>{a.label}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 16, background: "#1E2530", borderRadius: 999, height: 10, overflow: "hidden" }}>
                <div style={{ width: `${Math.round(progressPct * 100)}%`, height: "100%", background: "#C4F135", transition: "width .5s ease" }} />
              </div>
              <div style={{ fontSize: 12, color: "#8A93A3", marginTop: 6 }}>{Math.round(progressPct * 100)}% del camino a tu objetivo</div>

              {comparePhotos && (
                <div style={{ marginTop: 18 }}>
                  <div style={{ fontSize: 12, color: theme.muted, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>TU EVOLUCIÓN</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div style={{ textAlign: "center" }}>
                      <img src={comparePhotos.first.photo} alt="Antes" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 14, border: `1px solid ${theme.border}` }} />
                      <div style={{ fontSize: 12, color: theme.muted, marginTop: 6 }}>Antes · {comparePhotos.first.fecha}</div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{comparePhotos.first.peso} kg</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <img src={comparePhotos.last.photo} alt="Ahora" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 14, border: "1px solid #C4F135" }} />
                      <div style={{ fontSize: 12, color: "#C4F135", marginTop: 6 }}>Ahora · {comparePhotos.last.fecha}</div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{comparePhotos.last.peso} kg</div>
                    </div>
                  </div>
                </div>
              )}

              {photoGallery.length > 0 && (
                <div style={{ marginTop: 18 }}>
                  <button
                    onClick={() => setShowGallery((s) => !s)}
                    style={{ background: "none", border: "none", color: theme.muted, fontSize: 12, cursor: "pointer", textDecoration: "underline", padding: 0 }}
                  >
                    {showGallery ? "Ocultar galería de fotos" : `Ver galería de fotos (${photoGallery.length})`}
                  </button>
                  {showGallery && (
                    <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                      {photoGallery.map((p, i) => (
                        <button
                          key={i}
                          onClick={() => setViewingPhoto(p)}
                          style={{ padding: 0, border: `1px solid ${theme.border}`, borderRadius: 10, overflow: "hidden", cursor: "pointer", background: "none" }}
                        >
                          <img src={p.photo} alt={p.fecha} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {monthlySummary.length > 1 && (
                <div style={{ marginTop: 18 }}>
                  <button
                    onClick={() => setShowMonthly((s) => !s)}
                    style={{ background: "none", border: "none", color: theme.muted, fontSize: 12, cursor: "pointer", textDecoration: "underline", padding: 0 }}
                  >
                    {showMonthly ? "Ocultar resumen mensual" : "Ver resumen mensual"}
                  </button>
                  {showMonthly && (
                    <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
                      {monthlySummary.map((m, i) => {
                        const prev = monthlySummary[i - 1];
                        const diff = prev ? Math.round((m.avg - prev.avg) * 10) / 10 : null;
                        return (
                          <div key={m.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", ...innerCard, padding: "10px 14px" }}>
                            <span style={{ fontSize: 13, color: theme.text }}>{m.label}</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: 13, fontWeight: 700 }}>{m.avg} kg prom.</span>
                              {diff !== null && (
                                <span style={{ fontSize: 12, color: diff < 0 ? "#C4F135" : diff > 0 ? "#FF5A3C" : theme.muted }}>
                                  {diff === 0 ? "=" : diff < 0 ? `↓ ${Math.abs(diff)} kg` : `↑ ${diff} kg`}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <button onClick={shareProgress} style={{ ...secondaryBtn, marginTop: 16 }}>
                📤 Compartir mi progreso
              </button>
              <canvas ref={shareCanvasRef} style={{ display: "none" }} />

              <div style={{ marginTop: 20, height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="#1E2530" vertical={false} />
                    <XAxis dataKey="fecha" tick={{ fill: "#8A93A3", fontSize: 11 }} axisLine={{ stroke: "#1E2530" }} tickLine={false} />
                    <YAxis tick={{ fill: "#8A93A3", fontSize: 11 }} axisLine={false} tickLine={false} domain={["dataMin - 2", "dataMax + 2"]} />
                    <Tooltip contentStyle={{ background: "#0B0F14", border: "1px solid #232B37", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "#8A93A3" }} />
                    <Line type="monotone" dataKey="peso" stroke="#C4F135" strokeWidth={2.5} dot={{ r: 3, fill: "#C4F135" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={{ marginTop: 16, display: "grid", gap: 6 }}>
                {[...weightLog].reverse().map((e, i) => {
                  const realIdx = weightLog.length - 1 - i;
                  const photo = photosByDate[e.fecha];
                  const hasMeasures = e.cintura || e.cadera || e.brazo;
                  return (
                    <div key={realIdx} style={{ padding: "8px 10px", background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {photo ? (
                            <img src={photo} alt={`Progreso ${e.fecha}`} style={{ width: 34, height: 34, borderRadius: 8, objectFit: "cover" }} />
                          ) : (
                            <button onClick={() => openPhotoPicker(e.fecha)} style={photoAddBtn} title="Agregar foto">📷</button>
                          )}
                          <span style={{ fontSize: 13, color: theme.text }}>{e.fecha}</span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{e.peso} kg</span>
                        <div style={{ display: "flex", gap: 10 }}>
                          <button onClick={() => startEdit(realIdx)} style={{ background: "none", border: "none", color: "#C4F135", cursor: "pointer", fontSize: 12 }}>Editar</button>
                          <button onClick={() => removeEntry(realIdx)} style={{ background: "none", border: "none", color: "#5B6472", cursor: "pointer", fontSize: 12 }}>Eliminar</button>
                        </div>
                      </div>
                      {hasMeasures && (
                        <div style={{ display: "flex", gap: 12, marginTop: 6, paddingLeft: 44, fontSize: 11.5, color: theme.muted }}>
                          {e.cintura && <span>Cintura: {e.cintura} cm</span>}
                          {e.cadera && <span>Cadera: {e.cadera} cm</span>}
                          {e.brazo && <span>Brazo: {e.brazo} cm</span>}
                        </div>
                      )}
                      {e.nota && (
                        <div style={{ marginTop: 6, paddingLeft: 44, fontSize: 11.5, color: theme.muted, fontStyle: "italic" }}>
                          "{e.nota}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button onClick={resetLog} style={{ marginTop: 16, background: "none", border: "1px solid #232B37", color: "#8A93A3", borderRadius: 10, padding: "8px 14px", fontSize: 12, cursor: "pointer" }}>
                Reiniciar registro de peso
              </button>
            </>
          )}

          {weightLog.length === 0 && (
            <div style={{ marginTop: 18, fontSize: 13, color: "#5B6472" }}>
              Todavía no cargaste ningún peso. Agregá tu primer registro para empezar a ver tu progreso.
            </div>
          )}
        </section>

        {/* Preguntas frecuentes */}
        <section style={cardStyle}>
          <div className="display" style={{ fontSize: 18 }}>❓ Preguntas frecuentes</div>
          <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
            {FAQS.map((f, i) => (
              <div key={i} style={innerCard}>
                <div
                  onClick={() => setOpenFaq((o) => (o === i ? null : i))}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                >
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: theme.text }}>{f.q}</span>
                  <span style={{ color: theme.muted, fontSize: 14 }}>{openFaq === i ? "−" : "+"}</span>
                </div>
                {openFaq === i && (
                  <div style={{ fontSize: 12.5, color: theme.muted, marginTop: 8, lineHeight: 1.5 }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        <p style={{ fontSize: 12, color: "#5B6472", lineHeight: 1.5 }}>
          Los cálculos son estimaciones generales (fórmula Mifflin-St Jeor) y no reemplazan la evaluación de un profesional de la salud o un entrenador certificado. Tus datos y fotos se guardan solo en tu cuenta.
        </p>
      </main>
    </div>
  );
}

function Field({ label, children, style }) {
  return (
    <div style={style}>
      <div style={{ fontSize: 11, letterSpacing: 1, color: "#8A93A3", marginBottom: 6, fontWeight: 700 }}>{label.toUpperCase()}</div>
      {children}
    </div>
  );
}

function Row({ label, value, accent }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #1E2530" }}>
      <span style={{ fontSize: 13, color: "#8A93A3" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: accent || "#F2F1EC" }}>{value}</span>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div style={{ background: "#0B0F14", border: "1px solid #1E2530", borderRadius: 12, padding: "12px 14px" }}>
      <div style={{ fontSize: 10, letterSpacing: 1, color: "#8A93A3", fontWeight: 700 }}>{label.toUpperCase()}</div>
      <div className="display" style={{ fontSize: 18, marginTop: 4, color: accent || "#F2F1EC" }}>{value}</div>
    </div>
  );
}

function Segmented({ value, onChange, options }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {options.map((o) => {
        const active = value === o.v;
        return (
          <button
            key={o.v}
            className="pill"
            onClick={() => onChange(o.v)}
            style={{
              padding: "9px 14px",
              borderRadius: 10,
              border: active ? "1px solid #C4F135" : "1px solid #232B37",
              background: active ? "rgba(196,241,53,0.12)" : "#0B0F14",
              color: active ? "#C4F135" : "#8A93A3",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {o.l}
          </button>
        );
      })}
    </div>
  );
}

const inputStyle = { borderRadius: 10, padding: "10px 12px", fontSize: 14, width: "100%" };
const cardStyle = { background: "#131922", border: "1px solid #1E2530", borderRadius: 20, padding: 24 };
const innerCard = { background: "#0B0F14", border: "1px solid #1E2530", borderRadius: 14, padding: 16 };
const primaryBtn = { marginTop: 18, width: "100%", background: "#FF5A3C", color: "#0B0F14", border: "none", borderRadius: 12, padding: "14px 0", fontWeight: 800, fontSize: 15, cursor: "pointer" };
const secondaryBtn = { marginTop: 16, width: "100%", background: "transparent", border: "1px solid #232B37", color: "#C4F135", borderRadius: 12, padding: "14px 0", fontWeight: 800, fontSize: 15, cursor: "pointer" };
const waterBtn = { width: 40, height: 40, borderRadius: 10, border: "1px solid #232B37", background: "#0B0F14", color: "#8A93A3", fontSize: 20, cursor: "pointer" };
const photoAddBtn = { width: 34, height: 34, borderRadius: 8, border: "1px dashed #232B37", background: "#0B0F14", cursor: "pointer", fontSize: 14 };
