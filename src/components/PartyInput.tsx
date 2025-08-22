import React from 'react';
import { Party } from '../types';

interface PartyInputProps {
  party: Party;
  onPartyChange: (party: Party) => void;
}

export const PartyInput: React.FC<PartyInputProps> = ({ party, onPartyChange }) => {
  const handleChange = (field: keyof Party, value: number) => {
    onPartyChange({
      ...party,
      [field]: value
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-6">
      <h2 className="text-xl font-bold text-white mb-4">Party Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Number of Heroes (+ Retainers)
          </label>
          <input
            type="number"
            min="1"
            value={party.heroCount}
            onChange={(e) => handleChange('heroCount', parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Hero Level
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={party.heroLevel}
            onChange={(e) => handleChange('heroLevel', parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Victories (per hero)
          </label>
          <input
            type="number"
            min="0"
            value={party.victories}
            onChange={(e) => handleChange('victories', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="mt-4 p-3 bg-gray-700 rounded-md">
        <p className="text-white">
          <span className="font-semibold">Encounter Strength:</span> {party.encounterStrength}
        </p>
      </div>
    </div>
  );
}; 