import React from 'react';

// --- Tipos ---
export interface Character {
    id: string;
    name: string;
    color: 'yellow' | 'cyan' | 'purple' | 'green';
    Component: React.FC<{ className?: string }>;
}

export interface GiftItem {
    id: string;
    name: string;
    vowel: string;
    icon: string; 
}


// --- Personajes Galácticos (Componentes de Imagen) ---

// Componente para Rocky usando imagen de Blobby
const Rocky: React.FC<{ className?: string }> = ({ className }) => (
    React.createElement('img', { 
        src: "/img/blobby.png",
        alt: "Rocky",
        className: className,
        style: { objectFit: 'contain', width: '100%', height: '100%' }
    })
);

// Sparky (Amarillo) - Usa imagen PNG
const Sparky: React.FC<{ className?: string }> = ({ className }) => (
    React.createElement('img', { 
        src: "/img/sparky.png",
        alt: "Sparky",
        className: className,
        style: { objectFit: 'contain', width: '100%', height: '100%' }
    })
);

// --- Lista de Personajes ---
export const characters: Character[] = [
    { id: 'sparky', name: 'Sparky', color: 'yellow', Component: Sparky },
    { id: 'rocky', name: 'Rocky', color: 'purple', Component: Rocky },
];

// --- Objetos de Regalo (Nivel 2) ---
export const giftItems: GiftItem[] = [
    // A
    { id: 'anillo', name: 'Anillo', vowel: 'a', icon: '💍' },
    { id: 'avion', name: 'Avión', vowel: 'a', icon: '✈️' },
    { id: 'astronauta', name: 'Astronauta', vowel: 'a', icon: '🧑‍🚀' },
    // E
    { id: 'escalera', name: 'Escalera', vowel: 'e', icon: '🪜' },
    { id: 'esponja', name: 'Esponja', vowel: 'e', icon: '🧽' },
    { id: 'estrella', name: 'Estrella', vowel: 'e', icon: '⭐' },
    // I
    { id: 'iglu', name: 'Iglú', vowel: 'i', icon: '🧊' },
    { id: 'insecto', name: 'Insecto', vowel: 'i', icon: '🐜' },
    { id: 'iman', name: 'Imán', vowel: 'i', icon: '🧲' },
    // O
    { id: 'oso', name: 'Oso', vowel: 'o', icon: '🐻' },
    { id: 'ojo', name: 'Ojo', vowel: 'o', icon: '👁️' },
    { id: 'oveja', name: 'Oveja', vowel: 'o', icon: '🐑' },
    // U
    { id: 'uva', name: 'Uva', vowel: 'u', icon: '🍇' },
    { id: 'unicornio', name: 'Unicornio', vowel: 'u', icon: '🦄' },
    { id: 'uno', name: 'Uno', vowel: 'u', icon: '1️⃣' },
];