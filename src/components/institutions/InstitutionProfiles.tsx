import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Institution } from '../../types';
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FolderArchive,
  ExternalLink,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

export const InstitutionProfiles: React.FC = () => {
  const { institutions, applications, documents, setActiveTab, setSelectedApplicationId } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');

  const filteredInstitutions = institutions.filter((inst) => {
    if (selectedRegion !== 'ALL' && inst.region !== selectedRegion) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        inst.name.toLowerCase().includes(q) ||
        inst.code.toLowerCase().includes(q) ||
        inst.city.toLowerCase().includes(q) ||
        inst.principalName.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Approved Technical Institutions Registry
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Profiles of AICTE-approved engineering, management, pharmacy, architecture, and polytechnic institutes
          </p>
        </div>

        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
          {institutions.length} Registered Institutes
        </span>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Institution Name, AICTE Permanent Code, City, or Principal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
          >
            <option value="ALL">All Regional Directorates</option>
            <option value="WESTERN">Western Region</option>
            <option value="NORTHERN">Northern Region</option>
            <option value="SOUTHERN">Southern Region</option>
            <option value="EASTERN">Eastern Region</option>
            <option value="CENTRAL">Central Region</option>
            <option value="NORTH_WESTERN">North-Western Region</option>
          </select>
        </div>
      </div>

      {/* Institution Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInstitutions.map((inst) => {
          const instApps = applications.filter((a) => a.institutionId === inst.id);
          const instDocs = documents.filter((d) => d.institutionId === inst.id);

          return (
            <div
              key={inst.id}
              className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{inst.name}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      AICTE Permanent ID: {inst.code} · {inst.type.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Compliance Index
                  </span>
                  <span className="text-sm font-bold font-mono text-emerald-700">
                    {inst.complianceScore}%
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{inst.address}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50 rounded-lg text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Established</span>
                  <span className="font-semibold text-slate-800 font-mono">{inst.establishedYear}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Programs</span>
                  <span className="font-semibold text-slate-800 font-mono">{inst.totalPrograms}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Intake</span>
                  <span className="font-semibold text-slate-800 font-mono">{inst.sanctionedIntake}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-slate-500">
                  <span>{instApps.length} active case(s)</span>
                  <span> · </span>
                  <span>{instDocs.length} vault document(s)</span>
                </div>

                <button
                  onClick={() => setActiveTab('documents')}
                  className="text-blue-600 hover:underline font-semibold flex items-center gap-1"
                >
                  <FolderArchive className="w-3.5 h-3.5" />
                  Open Digital Vault
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
