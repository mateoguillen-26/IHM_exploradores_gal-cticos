
import React from 'react';

interface BatteryProps {
  charge: number; // 0 to 6
  maxCharge?: number;
  className?: string;
}

const Battery: React.FC<BatteryProps> = ({ charge, maxCharge = 6, className }) => {
  // Calcular porcentaje de llenado
  const percentage = Math.min((charge / maxCharge) * 100, 100);
  
  // Determinar color basado en la carga
  let color = "#ef4444"; // Rojo
  if (percentage > 35) color = "#fbbf24"; // Amarillo
  if (percentage > 70) color = "#4ade80"; // Verde

  return (
    <div className={`relative ${className}`} title={`Energía: ${Math.round(percentage)}%`}>
      <svg viewBox="0 0 100 50" className="w-full h-full drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
        {/* Cuerpo de la batería */}
        <rect x="2" y="5" width="88" height="40" rx="4" ry="4" 
              fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
        
        {/* Terminal positivo */}
        <path d="M92 15h4a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-4v-20z" fill="#94a3b8" />

        {/* Carga interior (Líquido de energía) */}
        <defs>
            <linearGradient id="liquidCharge" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={color} stopOpacity="0.6" />
                <stop offset="100%" stopColor={color} stopOpacity="1" />
            </linearGradient>
            <mask id="chargeMask">
                 <rect x="5" y="8" width={82 * (percentage / 100)} height="34" rx="2" ry="2" fill="white" />
            </mask>
        </defs>

        {/* Fondo oscuro del interior */}
        <rect x="5" y="8" width="82" height="34" rx="2" ry="2" fill="#0f172a" />

        {/* Barra de carga animada */}
        <rect x="5" y="8" width="82" height="34" rx="2" ry="2" 
              fill="url(#liquidCharge)" 
              mask="url(#chargeMask)"
              className="transition-all duration-1000 ease-out"
        />
        
        {/* Brillo estilo cristal */}
        <path d="M5 8h82a2 2 0 0 1 2 2v10c0 5-20 5-86 0V10a2 2 0 0 1 2-2z" fill="white" fillOpacity="0.1" />
        
        {/* Rayo icono superpuesto */}
        <path d="M48 12 L40 25 L46 25 L44 38 L56 22 L48 22 Z" fill="white" fillOpacity={charge > 0 ? "0.8" : "0.1"} />
      </svg>
    </div>
  );
};

export default Battery;
