import React, { useState } from 'react';
import { Monster } from '../types';

interface MonsterSearchProps {
  monsters: Monster[];
  onAddMonster: (monster: Monster) => void;
}

interface Filters {
  searchTerm: string;
  selectedType: string;
  selectedOrganization: string;
  selectedLevel: string;
  selectedRole: string;
}

export const MonsterSearch: React.FC<MonsterSearchProps> = ({ monsters, onAddMonster }) => {
  const [filters, setFilters] = useState<Filters>({
    searchTerm: '',
    selectedType: 'all',
    selectedOrganization: 'all',
    selectedLevel: 'all',
    selectedRole: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredMonsters = monsters.filter(monster => {
    const matchesSearch = monster.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         monster.types.some(type => type.toLowerCase().includes(filters.searchTerm.toLowerCase()));
    const matchesType = filters.selectedType === 'all' || monster.types.includes(filters.selectedType);
    const matchesOrganization = filters.selectedOrganization === 'all' || monster.organization === filters.selectedOrganization;
    const matchesLevel = filters.selectedLevel === 'all' || monster.level.toString() === filters.selectedLevel;
    const matchesRole = filters.selectedRole === 'all' || monster.role === filters.selectedRole;
    
    return matchesSearch && matchesType && matchesOrganization && matchesLevel && matchesRole;
  });

  const uniqueTypes = ['all', ...Array.from(new Set(monsters.flatMap(m => m.types)))];
  const uniqueOrganizations = ['all', ...Array.from(new Set(monsters.map(m => m.organization)))];
  const uniqueLevels = ['all', ...Array.from(new Set(monsters.map(m => m.level.toString())))];
  const uniqueRoles = ['all', ...Array.from(new Set(monsters.map(m => m.role)))];

  const handleFilterChange = (filterType: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      selectedType: 'all',
      selectedOrganization: 'all',
      selectedLevel: 'all',
      selectedRole: 'all'
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== '' && value !== 'all').length;

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Add Monsters</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Search Monsters
          </label>
          <input
            type="text"
            placeholder="Search by name or type..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:w-48">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Filter by Type
          </label>
          <select
            value={filters.selectedType}
            onChange={(e) => handleFilterChange('selectedType', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {uniqueTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-700 p-4 rounded-md mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">Advanced Filters</h3>
            <button
              onClick={clearFilters}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Organization
              </label>
              <select
                value={filters.selectedOrganization}
                onChange={(e) => handleFilterChange('selectedOrganization', e.target.value)}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {uniqueOrganizations.map(org => (
                  <option key={org} value={org}>
                    {org === 'all' ? 'All Organizations' : org}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Level
              </label>
              <select
                value={filters.selectedLevel}
                onChange={(e) => handleFilterChange('selectedLevel', e.target.value)}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {uniqueLevels.map(level => (
                  <option key={level} value={level}>
                    {level === 'all' ? 'All Levels' : `Level ${level}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Role
              </label>
              <select
                value={filters.selectedRole}
                onChange={(e) => handleFilterChange('selectedRole', e.target.value)}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>
                    {role === 'all' ? 'All Roles' : role}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="max-h-64 overflow-y-auto">
        {filteredMonsters.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No monsters found</p>
        ) : (
          <div className="space-y-2">
            {filteredMonsters.map(monster => (
              <div
                key={monster.id}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="text-white font-medium">{monster.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {monster.types.join(', ')} • Level {monster.level} • EV {monster.encounterValue}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {monster.organization} • {monster.role}
                    {monster.organization === 'minion' && (
                      <span className="text-blue-400 ml-2">(Adds 4)</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => onAddMonster(monster)}
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {monster.organization === 'minion' ? 'Add 4' : 'Add'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 