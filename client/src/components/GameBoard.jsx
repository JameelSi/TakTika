import React, { useEffect, useState } from 'react';
import { useGameStore } from '../game/state/gameStore';
import GameControls from './GameControls';
import GameInfo from './GameInfo';
import EventWheel from './EventWheel';
import CombatResolver from './CombatResolver';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import mapData from '../game/data/maps/standard.json'; 

const GameBoard = () => {
  const { players, currentTurn, timeOfDay } = useGameStore();
  const [territories, setTerritories] = useState([]);
  const [continents, setContinents] = useState([]);
  const [showEventWheel, setShowEventWheel] = useState(false);
  const [showCombat, setShowCombat] = useState(false);
  const [combatData, setCombatData] = useState(null);

useEffect(() => {
  const rawTerritories = mapData.continents.flatMap((continent) =>
    continent.territories.map((territory) => ({
      ...territory,
      continent: continent.id,
      color: continent.color,
      ownerId: null,
      value: Math.floor(Math.random() * 6) + 1,
    }))
  );

  const rawContinents = mapData.continents.map((continent) => ({
    id: continent.id,
    name: continent.name,
    coords: continent.coords,
    color: continent.color ?? "#ccc", // Optional fallback color
  }));

  setTerritories(rawTerritories);
  setContinents(rawContinents);
}, []);

  const handleTerritoryClick = (territory) => {
    if (!territory) return;

    if (Math.random() > 0.7) {
      setCombatData({
        attackerId: Object.keys(players)[0],
        defenderId: Object.keys(players)[1],
        territoryId: territory.id,
      });
      setShowCombat(true);
    }
  };

  const getFillColor = (name) => {
    if(name?.includes("Continent"))
      return "None"
    // return '#D3D3D3'

    if(name.includes("8"))
      return "#a6b697"
    if(name.includes("7"))
      return "#7a876f"
    if(name.includes("6"))
      return "#88a78e"
    if(name.includes("5"))
      return "#c2cea7"
    if(name.includes("4"))
      return "#88a376"
    if(name.includes("3"))
      return "#8fb6ab"
    if(name.includes("2"))
      return "#afd69b"
    return "#8ca19e"


    const owner = territory.ownerId ? players[territory.ownerId] : null;
    return owner ? owner.color : territory.color || '#D3D3D3';
  };

  const iceChunks = [
    '/assets/chunks/chunk1.png',
    '/assets/chunks/chunk2.png',
    '/assets/chunks/chunk3.png',
  ];

  return (  
    <div className={`h-screen w-screen bg-gradient-to-b from-blue-200 to-blue-500 overflow-hidden` }>
      {[...Array(100)].map((_, i) => (
        <img
          key={i}
          src={iceChunks[i % iceChunks.length]}
          className="floating-chunks absolute w-12"
          style={{
            top: `${Math.random() * 95}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${5 + Math.random() * 10}s`,
          }}
        />
      ))}
      <TransformWrapper
        minScale={1.0}
        maxScale={5}
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent  >
          <svg viewBox="190 240 1760 720" className="w-screen">
            {/* Render contin.ent outlines first (bottom layer) */}
            {continents.map((continent) => (
              <polygon className="w-screen floating-ice" 

                key={continent.id}
                points={continent.coords.map(([x, y]) => `${x},${y}`).join(" ")}
                fill={getFillColor(continent.name)}
                stroke="gray"
                strokeOpacity={0.3}
                strokeWidth={15}
                strokeDasharray="18,1"
              />
            ))}

            {/* Render territories (top layer) */}
            {territories.map((territory) => {
              const centroid = territory.points.reduce(
                (acc, [x, y]) => [acc[0] + x, acc[1] + y],
                [0, 0]
              ).map((val) => val / territory.points.length);

              return (
                <g key={territory.id}
                  className="floating-territory "
                  style={{
                      animationDuration: `${3 + Math.random() * 10}s`,
                    }}
                >
                  <polygon
                  
                    points={territory.points.map(([x, y]) => `${x},${y}`).join(" ")}
                    onClick={() => handleTerritoryClick(territory)}
                    fill={getFillColor(territory.name)}
                    stroke="white"
                    strokeWidth={2}
                    style={{ cursor: "pointer" }}
                  />
                  <text
                    x={centroid[0]}
                    y={centroid[1]}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="black"
                    fontSize="14"
                    pointerEvents="none"
                  >
                    {/* {territory.name} */}
                  </text>
                </g>
              );
            })}
          </svg>

        </TransformComponent>
      </TransformWrapper>
      <GameInfo/>
      <GameControls onSpinWheel={() => setShowEventWheel(true)} />
      {showEventWheel && <EventWheel onClose={() => setShowEventWheel(false)} />} 
      {showCombat && combatData && (
        <CombatResolver 
          data={combatData} 
          onClose={() => setShowCombat(false)} 
        />
      )}
    </div>
  );
};

export default GameBoard;
