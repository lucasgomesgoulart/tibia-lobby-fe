import React from "react";

interface LevelSectionProps {
  minLevel: number;
  maxLevel: number;
}

export const LevelSection = ({ minLevel, maxLevel }: LevelSectionProps) => {
  return (
    <div className="flex justify-around items-center bg-white/20 dark:bg-black/40 p-2 rounded-md mx-2">
      <div className="text-center">
        <p className="text-xs text-white/80">Nível Mínimo</p>
        <p className="font-bold text-sm">{minLevel}</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-white/80">Nível Máximo</p>
        <p className="font-bold text-sm">{maxLevel}</p>
      </div>
    </div>
  );
};