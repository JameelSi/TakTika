import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { useGameStore } from '../game/state/gameStore';
import GameControls from './GameControls';
import GameInfo from './GameInfo';
import EventWheel from './EventWheel';
import CombatResolver from './CombatResolver';

import geoMap from '../game/data/maps/gearhall.json';

const GameBoard = () => {
  const { players, currentTurn, timeOfDay } = useGameStore();
  const [territories, setTerritories] = useState([]);
  const [showEventWheel, setShowEventWheel] = useState(false);
  const [showCombat, setShowCombat] = useState(false);
  const [combatData, setCombatData] = useState(null);

  useEffect(() => {
    const rawTerritories = geoMap.features.map((feature) => ({
      id: feature.properties.id,
      name: feature.properties.name,
      center: feature.properties.center,
      connections: feature.properties.connections,
      continent: feature.properties.continent,
      ownerId: null,
      value: Math.floor(Math.random() * 6) + 1,
      color: feature.properties.color,
    }));
    setTerritories(rawTerritories);
  }, []);

  const handleTerritoryClick = (geo) => {
    const territory = territories.find(t => t.id === geo.properties.id);
    if (!territory) return;

    if (Math.random() > 0.7) {
      setCombatData({
        attackerId: Object.keys(players)[0],
        defenderId: Object.keys(players)[1],
        territoryId: territory.id
      });
      setShowCombat(true);
    }
  };

  const getFillColor = (territory) => {
    const owner = territory.ownerId ? players[territory.ownerId] : null;
    return owner ? owner.color : territory.color || '#CCC';
  };

  return (
    <div className={`bg-day-theme`}>
      <ComposableMap projection="geoEqualEarth">
        <Geographies geography={geoMap}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const territory = territories.find(t => t.id === geo.properties.id);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleTerritoryClick(geo)}
                  style={{
                    default: {
                      fill: getFillColor(territory),
                      stroke: "#000",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    hover: {
                      fill: "#FFD700",
                      outline: "none"
                    },
                    pressed: {
                      fill: "#FF6347",
                      outline: "none"
                    }
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <GameInfo />
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
