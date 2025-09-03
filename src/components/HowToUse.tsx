import React, { useState } from 'react';

export const HowToUse: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-800 rounded-lg mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-3">
          <span className="text-blue-400 text-xl">ℹ️</span>
          <h2 className="text-lg font-semibold text-white">Information</h2>
        </div>
        <span className={`text-gray-400 text-xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">1. Set Party Information</h3>
                <p className="text-gray-300 text-sm mb-2">
                  Configure your party details in the "Party Information" section:
                </p>
                <ul className="text-gray-400 text-sm space-y-1 ml-4">
                  <li><strong>Number of Heroes:</strong> Include retainers in the count</li>
                  <li><strong>Hero Level:</strong> The level of your player characters</li>
                  <li><strong>Victories:</strong> Previous encounters won (affects encounter strength)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">2. Search and Add Monsters</h3>
                <p className="text-gray-300 text-sm mb-2">
                  Use the "Add Monsters" section to build your encounter:
                </p>
                <ul className="text-gray-400 text-sm space-y-1 ml-4">
                  <li>Search by name or creature type</li>
                  <li>Use filters for organization, level, and role</li>
                  <li>Click "Add" to include monsters in your encounter</li>
                  <li>Minions are automatically added in groups of 4</li>
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">3. Understanding the Analysis</h3>
                <p className="text-gray-300 text-sm mb-2">
                  The encounter analysis shows:
                </p>
                <ul className="text-gray-400 text-sm space-y-1 ml-4">
                  <li><strong>Total EV:</strong> Combined Encounter Value of all monsters</li>
                  <li><strong>Difficulty:</strong> How challenging the encounter will be</li>
                  <li><strong>⚠️ High Level Warning:</strong> Monsters 2+ levels above party</li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">4. Roles & Organizations</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-300 font-medium mb-1">Organizations:</p>
                    <ul className="text-gray-400 text-xs space-y-1 ml-2">
                      <li><strong>Minion:</strong> Weak creatures, fight in groups of 4+</li>
                      <li><strong>Horde:</strong> Hardier than minions, fight 2-to-1 vs heroes</li>
                      <li><strong>Platoon:</strong> Well-organized, self-sufficient armies</li>
                      <li><strong>Elite:</strong> Hardy creatures, can face 2 heroes each</li>
                      <li><strong>Leader:</strong> Powerful monsters with villain actions</li>
                      <li><strong>Solo:</strong> Boss monsters that face entire parties alone</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium mb-1">Combat Roles:</p>
                    <ul className="text-gray-400 text-xs space-y-1 ml-2">
                      <li><strong>Ambusher:</strong> Hide and strike from stealth</li>
                      <li><strong>Artillery:</strong> Ranged damage dealers, stay at distance</li>
                      <li><strong>Brute:</strong> High damage melee fighters, high stamina</li>
                      <li><strong>Controller:</strong> Battlefield manipulation, area effects</li>
                      <li><strong>Defender:</strong> High defense, protects allies</li>
                      <li><strong>Harrier:</strong> Mobile, dynamic battlefield movement</li>
                      <li><strong>Hexer:</strong> Debuffs enemies, hampers heroes</li>
                      <li><strong>Mount:</strong> Carries other creatures, increases mobility</li>
                      <li><strong>Skirmisher:</strong> Mobile hit-and-run specialists</li>
                      <li><strong>Support:</strong> Heals and buffs allies, debuffs enemies</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
