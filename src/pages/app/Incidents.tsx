import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../utils/store';
import {
  ShieldAlert,
  ChevronRight,
  Clock,
  CheckCircle2,
  Eye,
  Navigation,
  FileText
} from 'lucide-react';
import type { Status } from '../../utils/types';

const Incidents = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { incidents, user, vehicles } = useStore();

  const [activeGroup, setActiveGroup] = useState<'sent' | 'received'>(
    (location.state as any)?.filter || 'received'
  );
  const [activeFilter, setActiveFilter] = useState<Status | 'all'>('all');

  const groupedIncidents = incidents.filter(i => {
    if (activeGroup === 'sent') return i.reporterId === user.id;
    return vehicles.some(v => v.plate === i.plate);
  });

  const filtered = activeFilter === 'all' 
    ? groupedIncidents 
    : groupedIncidents.filter(i => i.status === activeFilter);

  const getStatusStyle = (status: Status) => {
    switch (status) {
      case 'reported': return 'bg-blue-50 text-blue-500 border-blue-100';
      case 'seen': return 'bg-indigo-50 text-indigo-500 border-indigo-100';
      case 'resolved': return 'bg-emerald-50 text-emerald-500 border-emerald-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#F8FAFC] px-6 pt-10 pb-10 overflow-y-auto scrollbar-hide">
      <header className="mb-6">
        <h1 className="text-[22px] font-black tracking-tight text-appText uppercase">
          INCIDENT REPORTS
        </h1>
      </header>

      {/* Segmented Toggle */}
      <div className="mb-8 flex p-1.5 bg-[#EEF2F6] rounded-[32px]">
        {(['sent', 'received'] as const).map((group) => (
          <button
            key={group}
            onClick={() => {
              setActiveGroup(group);
              setActiveFilter('all');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-[28px] text-[11px] font-black uppercase tracking-widest transition-all ${
              activeGroup === group 
                ? 'bg-white text-appText shadow-sm' 
                : 'text-appTextSecondary/40'
            }`}
          >
            {group === 'sent' ? <Navigation size={14} className={activeGroup === 'sent' ? 'text-appText' : 'text-appTextSecondary/40'} /> : <FileText size={14} className={activeGroup === 'received' ? 'text-appText' : 'text-appTextSecondary/40'} />}
            {group}
          </button>
        ))}
      </div>

      {/* Filter Pills - Only for Sent Tab */}
      {activeGroup === 'sent' && (
        <div className="mb-8 flex gap-3 overflow-x-auto scrollbar-hide">
          {['all', 'reported', 'seen', 'resolved'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as Status | 'all')}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                activeFilter === filter
                  ? 'bg-[#1A1C1E] text-white border-[#1A1C1E] shadow-md'
                  : 'bg-white text-appTextSecondary/60 border-slate-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      {/* Results List */}
      <div className="flex flex-col gap-6 pb-24">
        {filtered.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center p-12 text-center rounded-[40px] border-2 border-dashed border-appBorder bg-slate-50/50">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[32px] bg-white border border-appBorder shadow-sm text-appTextSecondary/20">
              <ShieldAlert size={36} />
            </div>
            <h2 className="text-lg font-black text-appText">No {activeGroup} reports</h2>
            <p className="mt-2 text-sm font-bold text-appTextSecondary/60 leading-relaxed">
              {activeGroup === 'sent' 
                ? "You haven't reported any incidents yet." 
                : "None of your vehicles have received reports."}
            </p>
          </div>
        ) : (
          filtered.map((incident) => (
            <div
              key={incident.id}
              onClick={() => navigate(`/app/incidents/${incident.id}`)}
              className="group rounded-[32px] bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-slate-50 transition-all hover:shadow-lg cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="bg-[#F1F5F9] px-3.5 py-1.5 rounded-lg border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 tracking-wider">
                    {incident.plate.replace('-', ' ')}
                  </span>
                </div>
                
                {activeGroup === 'sent' && (
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(incident.status)}`}>
                    {incident.status === 'seen' && <Eye size={12} strokeWidth={3} />}
                    {incident.status === 'reported' && <Clock size={12} strokeWidth={3} />}
                    {incident.status === 'resolved' && <CheckCircle2 size={12} strokeWidth={3} />}
                    {incident.status}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                    {incident.incidentType}
                  </span>
                </div>
                <h3 className="text-[15px] font-black text-appText leading-snug mb-1">
                  {incident.description.split('.')[0]}
                </h3>
                <p className="text-[12px] font-medium text-slate-400 line-clamp-2 leading-relaxed">
                  {incident.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                {activeGroup === 'received' && (
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                      Thank you
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-[9px] font-black uppercase tracking-widest border border-red-100">
                      Bad report
                    </button>
                  </div>
                )}
                
                <div className="flex items-center gap-1 text-[10px] font-black text-slate-400">
                  <span className="uppercase tracking-widest">
                    {new Date(incident.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Incidents;