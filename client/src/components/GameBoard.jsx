import React, { useEffect, useState } from 'react';
import { Stage, Container, Sprite, Graphics, Text } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { useGame } from '../contexts/GameContext';
import GameControls from './GameControls';
import GameInfo from './GameInfo';
import EventWheel from './EventWheel';
import CombatResolver from './CombatResolver';

const GameBoard = () => {
  const { map, players, territories, currentTurn, timeOfDay } = useGame();
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [showEventWheel, setShowEventWheel] = useState(false);
  const [showCombat, setShowCombat] = useState(false);
  const [combatData, setCombatData] = useState(null);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Render the map territories
  const renderTerritories = () => {
    return territories.map((territory) => {
      const owner = territory.ownerId ? players[territory.ownerId] : null;
      const fillColor = owner ? owner.color : 0xCCCCCC;
      
      return (
        <Graphics
          key={territory.id}
          draw={(g) => {
            g.clear();
            g.beginFill(fillColor, 0.7);
            g.lineStyle(2, 0x000000, 1);
            g.drawRect(
              territory.x, 
              territory.y, 
              territory.width || 100, 
              territory.height || 100
            );
            g.endFill();
          }}
          interactive={true}
          pointerdown={() => handleTerritoryClick(territory)}
        />
      );
    });
  };
  
  // Handle territory click
  const handleTerritoryClick = (territory) => {
    console.log('Territory clicked:', territory);
    
    if (Math.random() > 0.7) {
      setCombatData({
        attackerId: Object.keys(players)[0],
        defenderId: Object.keys(players)[1],
        territoryId: territory.id
      });
      setShowCombat(true);
    }
  };
  
  // Apply day/night overlay
  const getDayNightOverlay = () => {
    if (timeOfDay === 'night') {
      return (
        <Graphics
          draw={(g) => {
            g.clear();
            g.beginFill(0x191970, 0.3);
            g.drawRect(0, 0, dimensions.width, dimensions.height);
            g.endFill();
          }}
        />
      );
    }
    return null;
  };
  
  return (
    <div className="game-container relative">
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        options={{ 
          backgroundColor: 0xf5f5dc,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true
        }}
      >
        <Container>
          <Graphics
            draw={(g) => {
              g.clear();
              g.beginFill(0xe4e4b8);
              g.drawRect(0, 0, dimensions.width, dimensions.height);
              g.endFill();
            }}
          />
          {renderTerritories()}
          {getDayNightOverlay()}
        </Container>
      </Stage>
      
      <GameInfo />
      <GameControls onSpinWheel={() => setShowEventWheel(true)} />
      
      {showEventWheel && (
        <EventWheel 
          onClose={() => setShowEventWheel(false)} 
          onEventSelected={(event) => {
            console.log('Event selected:', event);
            setShowEventWheel(false);
          }} 
        />
      )}
      
      {showCombat && combatData && (
        <CombatResolver 
          data={combatData}
          onClose={() => setShowCombat(false)}
          onCombatResolved={(result) => {
            console.log('Combat resolved:', result);
            setShowCombat(false);
          }}
        />
      )}
    </div>
  );
};

export default GameBoard;