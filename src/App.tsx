import React, { useState, useEffect } from 'react';
import { Party, Encounter, EncounterCreature, Monster } from './types';
import { calculateEncounterStrength, determineEncounterDifficulty } from './utils/encounterCalculations';
import { monsters } from './data/monsters';
import { PartyInput } from './components/PartyInput';
import { MonsterSearch } from './components/MonsterSearch';
import { EncounterDisplay } from './components/EncounterDisplay';
import { EncounterStats } from './components/EncounterStats';
import { Footer } from './components/Footer';
import './App.css';

function App() {
  const [party, setParty] = useState<Party>({
    heroCount: 4,
    heroLevel: 3,
    victories: 0,
    encounterStrength: 0
  });

  const [encounter, setEncounter] = useState<Encounter>({
    creatures: [],
    totalEV: 0,
    difficulty: 'trivial'
  });

  // Calculate encounter strength whenever party changes
  useEffect(() => {
    const newES = calculateEncounterStrength(party);
    setParty(prev => ({ ...prev, encounterStrength: newES }));
  }, [party]);

  // Calculate encounter difficulty whenever encounter changes
  useEffect(() => {
    const newDifficulty = determineEncounterDifficulty(party.encounterStrength, encounter.totalEV, party.heroLevel);
    setEncounter(prev => ({ ...prev, difficulty: newDifficulty }));
  }, [encounter.totalEV, party.encounterStrength, party.heroLevel]);

  const handleAddMonster = (monster: Monster) => {
    setEncounter(prev => {
      const existingIndex = prev.creatures.findIndex(c => c.monster.id === monster.id);
      
      if (existingIndex >= 0) {
        // Update quantity of existing monster
        const updatedCreatures = [...prev.creatures];
        const quantityToAdd = monster.organization === 'minion' ? 4 : 1;
        updatedCreatures[existingIndex] = {
          ...updatedCreatures[existingIndex],
          quantity: updatedCreatures[existingIndex].quantity + quantityToAdd
        };
        
        const newTotalEV = updatedCreatures.reduce((sum, c) => {
          if (c.monster.organization === 'minion') {
            // For minions, EV is per group of 4, so divide by 4
            return sum + (c.monster.encounterValue * Math.ceil(c.quantity / 4));
          } else {
            // For non-minions, EV is per individual creature
            return sum + (c.monster.encounterValue * c.quantity);
          }
        }, 0);
        
        return {
          ...prev,
          creatures: updatedCreatures,
          totalEV: newTotalEV
        };
      } else {
        // Add new monster
        const quantityToAdd = monster.organization === 'minion' ? 4 : 1;
        const newCreature: EncounterCreature = {
          monster,
          quantity: quantityToAdd
        };
        
        let newTotalEV = prev.totalEV;
        if (monster.organization === 'minion') {
          // For minions, EV is per group of 4
          newTotalEV += monster.encounterValue;
        } else {
          // For non-minions, EV is per individual creature
          newTotalEV += monster.encounterValue * quantityToAdd;
        }
        
        return {
          ...prev,
          creatures: [...prev.creatures, newCreature],
          totalEV: newTotalEV
        };
      }
    });
  };

  const handleRemoveCreature = (index: number) => {
    setEncounter(prev => {
      const creature = prev.creatures[index];
      let creatureEV = 0;
      
      if (creature.monster.organization === 'minion') {
        // For minions, EV is per group of 4
        creatureEV = creature.monster.encounterValue * Math.ceil(creature.quantity / 4);
      } else {
        // For non-minions, EV is per individual creature
        creatureEV = creature.monster.encounterValue * creature.quantity;
      }
      
      const newTotalEV = prev.totalEV - creatureEV;
      const newCreatures = prev.creatures.filter((_, i) => i !== index);
      
      return {
        ...prev,
        creatures: newCreatures,
        totalEV: newTotalEV
      };
    });
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    setEncounter(prev => {
      const updatedCreatures = [...prev.creatures];
      const creature = updatedCreatures[index];
      
      // Enforce minimum quantity for minions
      const minQuantity = creature.monster.organization === 'minion' ? 4 : 1;
      const finalQuantity = Math.max(quantity, minQuantity);
      
      let oldTotal = 0;
      let newTotal = 0;
      
      if (creature.monster.organization === 'minion') {
        // For minions, EV is per group of 4
        oldTotal = creature.monster.encounterValue * Math.ceil(creature.quantity / 4);
        newTotal = creature.monster.encounterValue * Math.ceil(finalQuantity / 4);
      } else {
        // For non-minions, EV is per individual creature
        oldTotal = creature.monster.encounterValue * creature.quantity;
        newTotal = creature.monster.encounterValue * finalQuantity;
      }
      
      updatedCreatures[index] = {
        ...creature,
        quantity: finalQuantity
      };
      
      const newTotalEV = prev.totalEV - oldTotal + newTotal;
      
      return {
        ...prev,
        creatures: updatedCreatures,
        totalEV: newTotalEV
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Draw Steel Encounter Builder</h1>
          <p className="text-gray-400">Build balanced encounters for your Draw Steel games</p>
        </header>

        <div className="max-w-6xl mx-auto">
          <PartyInput party={party} onPartyChange={setParty} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-start">
            <MonsterSearch monsters={monsters} onAddMonster={handleAddMonster} />
            <EncounterDisplay
              encounter={encounter}
              party={party}
              onRemoveCreature={handleRemoveCreature}
              onUpdateQuantity={handleUpdateQuantity}
            />
          </div>

          <EncounterStats encounter={encounter} party={party} />
        </div>
        
        <Footer />
      </div>
    </div>
  );
}

export default App;
