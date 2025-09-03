import React from 'react';
import { Encounter, Party } from '../types';

interface EncounterStatsProps {
  encounter: Encounter;
  party: Party;
}

interface OrganizationStats {
  [key: string]: {
    creatureCount: number;
    organizationCount: number;
    creaturesPerHero: number;
    organizationsPerHero: number;
    recommended: {
      minOrgs: number;
      maxOrgs: number;
      minCreaturesPerOrg: number;
      maxCreaturesPerOrg: number;
      description: string;
    };
  };
}

interface RoleStats {
  [key: string]: number;
}

export const EncounterStats: React.FC<EncounterStatsProps> = ({ encounter, party }) => {
  const getRecommendedPerHero = (organization: string) => {
    switch (organization) {
      case 'minion':
        return { 
          minOrgs: 0.5, 
          maxOrgs: 2, 
          minCreaturesPerOrg: 4, 
          maxCreaturesPerOrg: 8,
          description: '≈1-2 minion groups per hero (4-8 minions per group)' 
        };
      case 'horde':
        return { 
          minOrgs: 0.5, 
          maxOrgs: 1, 
          minCreaturesPerOrg: 2, 
          maxCreaturesPerOrg: 2,
          description: '≈1 horde per hero (2 creatures per horde)' 
        };
      case 'platoon':
        return { 
          minOrgs: 0.5, 
          maxOrgs: 1, 
          minCreaturesPerOrg: 1, 
          maxCreaturesPerOrg: 1,
          description: '≈1 platoon per hero (1 creature per platoon)' 
        };
      case 'elite':
        return { 
          minOrgs: 0.25, 
          maxOrgs: 0.5, 
          minCreaturesPerOrg: 1, 
          maxCreaturesPerOrg: 1,
          description: '≈0.5 elite per hero (1 creature per elite)' 
        };
      case 'leader':
        return { 
          minOrgs: 0.25, 
          maxOrgs: 0.5, 
          minCreaturesPerOrg: 1, 
          maxCreaturesPerOrg: 1,
          description: '≈0.5 leader per hero (1 creature per leader)' 
        };
      case 'solo':
        return { 
          minOrgs: 0.17, 
          maxOrgs: 0.25, 
          minCreaturesPerOrg: 1, 
          maxCreaturesPerOrg: 1,
          description: '≈0.25 solo per hero (1 creature per solo)' 
        };
      default:
        return { 
          minOrgs: 0, 
          maxOrgs: 1, 
          minCreaturesPerOrg: 1, 
          maxCreaturesPerOrg: 1,
          description: 'Varies by organization' 
        };
    }
  };

  // Calculate organization statistics
  const organizationStats: OrganizationStats = {};
  const roleStats: RoleStats = {};
  
  encounter.creatures.forEach(creature => {
    const org = creature.monster.organization;
    const role = creature.monster.role;
    
    // Organization stats
    if (!organizationStats[org]) {
      organizationStats[org] = {
        creatureCount: 0,
        organizationCount: 0,
        creaturesPerHero: 0,
        organizationsPerHero: 0,
        recommended: getRecommendedPerHero(org)
      };
    }
    organizationStats[org].creatureCount += creature.quantity;
    
    // Role stats
    if (!roleStats[role]) {
      roleStats[role] = 0;
    }
    roleStats[role] += creature.quantity;
  });
  
  // Calculate organizations per hero and creatures per organization
  Object.keys(organizationStats).forEach(org => {
    const stats = organizationStats[org];
    stats.creaturesPerHero = stats.creatureCount / party.heroCount;
    
    // Calculate how many organizations we have based on creature count and organization type
    if (org === 'minion') {
      // Minions come in groups of 4, so divide by 4 to get number of minion groups
      stats.organizationCount = Math.ceil(stats.creatureCount / 4);
    } else if (org === 'horde') {
      // Hordes typically have 2 creatures
      stats.organizationCount = Math.ceil(stats.creatureCount / 2);
    } else {
      // Other organizations (platoon, elite, leader, solo) are 1 creature per organization
      stats.organizationCount = stats.creatureCount;
    }
    
    stats.organizationsPerHero = stats.organizationCount / party.heroCount;
  });

  const getStatusColor = (current: number, recommended: { minOrgs: number; maxOrgs: number }) => {
    if (current < recommended.minOrgs) return 'text-yellow-400'; // Too few
    if (current > recommended.maxOrgs) return 'text-red-400'; // Too many
    return 'text-green-400'; // Good
  };

  const getStatusText = (current: number, recommended: { minOrgs: number; maxOrgs: number }) => {
    if (current < recommended.minOrgs) return 'Too Few';
    if (current > recommended.maxOrgs) return 'Too Many';
    return 'Good';
  };

  const totalCreatures = encounter.creatures.reduce((sum, c) => sum + c.quantity, 0);
  const totalOrganizations = Object.values(organizationStats).reduce((sum, stats) => sum + stats.organizationCount, 0);

  return (
    <div className="bg-gray-700 p-4 rounded-md">
      <h3 className="text-white font-semibold mb-4">Encounter Analysis</h3>
      
      {/* Basic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
        <div className="bg-gray-600 p-3 rounded">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Party ES:</span>
            <span className="text-white font-medium">{party.encounterStrength}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Encounter EV:</span>
            <span className="text-white font-medium">{encounter.totalEV}</span>
          </div>
        </div>
        <div className="bg-gray-600 p-3 rounded">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">EV/ES Ratio:</span>
            <span className="text-white font-medium">{(encounter.totalEV / party.encounterStrength).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Difficulty:</span>
            <span className="text-white font-medium capitalize">{encounter.difficulty}</span>
          </div>
        </div>
        <div className="bg-gray-600 p-3 rounded">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Creatures:</span>
            <span className="text-white font-medium">{totalCreatures}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Organizations:</span>
            <span className="text-white font-medium">{totalOrganizations}</span>
          </div>
        </div>
      </div>

      {/* Organization Analysis */}
      <div className="mb-6">
        <h4 className="text-white font-medium mb-3">Organization Analysis</h4>
        <div className="space-y-3">
          {Object.entries(organizationStats).map(([org, stats]) => (
            <div key={org} className="bg-gray-600 p-3 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium capitalize">{org}</span>
                <span className={`text-sm font-medium ${getStatusColor(stats.organizationsPerHero, stats.recommended)}`}>
                  {getStatusText(stats.organizationsPerHero, stats.recommended)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-gray-300 text-sm">
                <div>
                  <div className="flex justify-between">
                    <span>Creatures:</span>
                    <span className="text-white">{stats.creatureCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Per Hero:</span>
                    <span className="text-white">{stats.creaturesPerHero.toFixed(1)}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between">
                    <span>Groups:</span>
                    <span className="text-white">{stats.organizationCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Per Hero:</span>
                    <span className="text-white">{stats.organizationsPerHero.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-2">Recommended: {stats.recommended.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Organization Distribution Chart */}
      <div className="mb-6">
        <h4 className="text-white font-medium mb-3">Organization Distribution</h4>
        <div className="text-gray-300 text-sm mb-3">Total Organizations: {totalOrganizations}</div>
        <div className="space-y-2">
          {Object.entries(organizationStats).map(([org, stats]) => {
            const percentage = (stats.organizationCount / totalOrganizations) * 100;
            return (
              <div key={org} className="flex items-center gap-3">
                <div className="w-16 text-gray-300 text-xs capitalize">{org}</div>
                <div className="flex-1 bg-gray-600 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="w-8 text-gray-300 text-xs text-right">{stats.organizationCount}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role Distribution Chart */}
      <div className="mb-6">
        <h4 className="text-white font-medium mb-3">Role Distribution</h4>
        <div className="space-y-2">
          {Object.entries(roleStats).map(([role, count]) => {
            const percentage = (count / totalCreatures) * 100;
            return (
              <div key={role} className="flex items-center gap-3">
                <div className="w-16 text-gray-300 text-xs capitalize">{role}</div>
                <div className="flex-1 bg-gray-600 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="w-8 text-gray-300 text-xs text-right">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gray-600 p-3 rounded">
        <h4 className="text-white font-medium mb-2">Recommendations</h4>
        <ul className="text-gray-300 text-sm space-y-1">
          {Object.entries(organizationStats).map(([org, stats]) => {
            const status = getStatusText(stats.organizationsPerHero, stats.recommended);
            if (status !== 'Good') {
              return (
                <li key={org} className="flex items-center gap-2">
                  <span className="text-red-400">•</span>
                  <span className="capitalize">{org}</span>: {status.toLowerCase()} - {stats.recommended.description}
                </li>
              );
            }
            return null;
          })}
          {Object.entries(organizationStats).every(([, stats]) => 
            getStatusText(stats.organizationsPerHero, stats.recommended) === 'Good'
          ) && (
            <li className="flex items-center gap-2">
              <span className="text-green-400">•</span>
              Organization balance looks good!
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}; 