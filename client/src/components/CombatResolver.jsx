import React, { useState, useEffect } from 'react';
import { useGameStore } from '../game/state/gameStore';

const Coin = ({ value, flipped, result }) => {
  return (
    <div className={`w-16 h-16 rounded-full border-4 bg-yellow-400 border-yellow-600 flex items-center justify-center ${
      flipped ? 'flip active' : 'flip'
    }`}>
      <div className="front absolute inset-0 flex items-center justify-center text-2xl font-bold">
        ?
      </div>
      <div className="back absolute inset-0 flex items-center justify-center text-2xl font-bold transform rotate-180">
        {result !== null ? result : value}
      </div>
    </div>
  );
};

const CombatResolver = ({ data, onClose, onCombatResolved }) => {
  const { players, resolveTerritoryCombat } = useGameStore();
  const [coins, setCoins] = useState([
    { value: 1, flipped: false, result: null },
    { value: 2, flipped: false, result: null },
    { value: 3, flipped: false, result: null }
  ]);
  const [result, setResult] = useState(null);
  const [flipping, setFlipping] = useState(false);
  
  const attacker = players[data.attackerId];
  const defender = players[data.defenderId];
  
  const flipCoins = () => {
    if (flipping) return;
    setFlipping(true);
    
    // Flip coins one by one with a delay
    setTimeout(() => {
      setCoins(prev => {
        const updated = [...prev];
        updated[0].flipped = true;
        updated[0].result = Math.random() > 0.5 ? 1 : 0;
        return updated;
      });
      
      setTimeout(() => {
        setCoins(prev => {
          const updated = [...prev];
          updated[1].flipped = true;
          updated[1].result = Math.random() > 0.5 ? 1 : 0;
          return updated;
        });
        
        setTimeout(() => {
          setCoins(prev => {
            const updated = [...prev];
            updated[2].flipped = true;
            updated[2].result = Math.random() > 0.5 ? 1 : 0;
            return updated;
          });
          
          // Calculate result after all coins are flipped
          setTimeout(() => {
            const results = coins.map(c => c.result);
            const totalHeads = results.filter(r => r === 1).length;
            
            // Attacker wins with 2 or more heads
            const attackerWins = totalHeads >= 2;
            setResult({
              winner: attackerWins ? data.attackerId : data.defenderId,
              totalHeads,
              message: attackerWins 
                ? `${attacker.name} wins with ${totalHeads} heads!` 
                : `${defender.name} defends with ${3 - totalHeads} tails!`
            });
            
            // Resolve the territory combat in the game state
            resolveTerritoryCombat(data.territoryId, attackerWins ? data.attackerId : data.defenderId);
            
            if (onCombatResolved) {
              setTimeout(() => {
                onCombatResolved({
                  winner: attackerWins ? data.attackerId : data.defenderId,
                  territoryId: data.territoryId
                });
              }, 2000);
            }
          }, 500);
        }, 500);
      }, 500);
    }, 500);
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Combat Resolution</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: attacker?.color + '33' }}>
            <h3 className="font-bold">Attacker</h3>
            <p>{attacker?.name}</p>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: defender?.color + '33' }}>
            <h3 className="font-bold">Defender</h3>
            <p>{defender?.name}</p>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4 my-8">
          {coins.map((coin, index) => (
            <Coin 
              key={index} 
              value={coin.value} 
              flipped={coin.flipped} 
              result={coin.result} 
            />
          ))}
        </div>
        
        {result ? (
          <div className="text-center p-4 bg-gray-100 rounded-lg mb-6">
            <p className="font-bold text-lg">{result.message}</p>
          </div>
        ) : (
          <p className="text-center text-gray-600 mb-6">
            Flip the coins to resolve combat. Attacker wins with 2 or more heads.
          </p>
        )}
        
        <div className="flex justify-between">
          <button 
            className="btn btn-primary"
            onClick={onClose}
            disabled={flipping && !result}
          >
            {result ? 'Close' : 'Cancel'}
          </button>
          
          {!result && (
            <button 
              className={`btn ${flipping ? 'btn-disabled' : 'btn-accent'}`}
              onClick={flipCoins}
              disabled={flipping}
            >
              {flipping ? 'Flipping...' : 'Flip Coins'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CombatResolver;