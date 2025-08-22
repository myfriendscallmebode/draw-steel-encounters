import React from 'react';
import { Encounter, Party } from '../types';
import { getDifficultyColor } from '../utils/encounterCalculations';

interface EncounterDisplayProps {
  encounter: Encounter;
  party: Party;
  onRemoveCreature: (index: number) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
}

export const EncounterDisplay: React.FC<EncounterDisplayProps> = ({
  encounter,
  party,
  onRemoveCreature,
  onUpdateQuantity
}) => {
  const difficultyColor = getDifficultyColor(encounter.difficulty);

  // Check for creatures that are too high level
  const highLevelCreatures = encounter.creatures.filter(creature => 
    creature.monster.level > party.heroLevel + 2
  );

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Current Encounter</h2>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-gray-300 text-sm">Total EV</p>
            <p className="text-white font-bold">{encounter.totalEV}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-300 text-sm">Difficulty</p>
            <p 
              className="font-bold capitalize"
              style={{ color: difficultyColor }}
            >
              {encounter.difficulty}
            </p>
          </div>
        </div>
      </div>

      {/* High Level Warning */}
      {highLevelCreatures.length > 0 && (
        <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded-md">
          <h3 className="text-red-200 font-semibold mb-2">⚠️ High Level Warning</h3>
          <p className="text-red-300 text-sm mb-2">
            The following creatures are more than 2 levels above your party (Level {party.heroLevel}):
          </p>
          <ul className="text-red-300 text-sm space-y-1">
            {highLevelCreatures.map((creature, index) => (
              <li key={`${creature.monster.id}-${index}`}>
                • {creature.monster.name} (Level {creature.monster.level}) - {creature.quantity}x
              </li>
            ))}
          </ul>
          <p className="text-red-200 text-xs mt-2">
            These creatures may deal devastating damage and be nearly impossible to resist. Consider removing them or increasing party level.
          </p>
        </div>
      )}

      <div className="max-h-68 overflow-y-auto">
        {encounter.creatures.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No creatures added to encounter</p>
        ) : (
          <div className="space-y-3">
            {encounter.creatures.map((creature, index) => {
              const isHighLevel = creature.monster.level > party.heroLevel + 2;
              return (
                <div
                  key={`${creature.monster.id}-${index}`}
                  className={`flex items-center justify-between p-3 rounded-md ${
                    isHighLevel ? 'bg-red-900 border border-red-700' : 'bg-gray-700'
                  }`}
                >
                  <div className="flex-1">
                    <h3 className="text-white font-medium">
                      {creature.monster.name}
                      {isHighLevel && (
                        <span className="ml-2 text-red-400 text-sm">⚠️ Level {creature.monster.level}</span>
                      )}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {creature.monster.types.join(', ')} • Level {creature.monster.level} • EV {creature.monster.encounterValue}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {creature.monster.organization} • {creature.monster.role}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-gray-300 text-sm">Qty:</label>
                      <input
                        type="number"
                        min={creature.monster.organization === 'minion' ? 4 : 1}
                        value={creature.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || (creature.monster.organization === 'minion' ? 4 : 1);
                          const minQuantity = creature.monster.organization === 'minion' ? 4 : 1;
                          onUpdateQuantity(index, Math.max(newQuantity, minQuantity));
                        }}
                        className="w-16 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                      />
                      {creature.monster.organization === 'minion' && (
                        <span className="text-blue-400 text-xs">(min 4)</span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-gray-300 text-sm">Total EV</p>
                      <p className="text-white font-bold">
                        {creature.monster.organization === 'minion' 
                          ? creature.monster.encounterValue * Math.ceil(creature.quantity / 4)
                          : creature.monster.encounterValue * creature.quantity
                        }
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveCreature(index)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}; 