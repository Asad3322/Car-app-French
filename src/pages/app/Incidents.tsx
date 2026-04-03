import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../utils/store';
import {
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

  const groupedIncidents = incidents.filter((i) => {
    if (activeGroup === 'sent') return i.reporterId === user.id;
    return vehicles.some((v) => v.plate === i.plate);
  });

  const filtered =
    activeFilter === 'all'
      ? groupedIncidents
      : groupedIncidents.filter((i) => i.status === activeFilter);

  const getStatusStyle = (status: Status) => {
    switch (status) {
      case 'reported':
        return 'bg-silicon-cyan/10 text-silicon-cyan border-silicon-cyan/20';
      case 'seen':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'resolved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-white/5 text-white/40 border-white/10';
    }
  };

  return (
    <div className="flex h-full flex-col bg-charcoal px-6 pt-10 pb-10 overflow-y-auto scrollbar-hide">
      <header className="mb-8">
        <h1 className="text-[20px] font-black text-white uppercase">
          INCIDENT REPORTS
        </h1>
      </header>

      <div className="mb-8 flex rounded-[32px] border border-white/5 bg-[#11161D] p-1">
        {(['sent', 'received'] as const).map((group) => (
          <button
            key={group}
            onClick={() => {
              setActiveGroup(group);
              setActiveFilter('all');
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[28px] py-4 text-[11px] font-black uppercase ${
              activeGroup === group
                ? 'bg-[#62D8FF] text-black'
                : 'text-white/30'
            }`}
          >
            {group === 'sent' ? <Navigation size={14} /> : <FileText size={14} />}
            {group}
          </button>
        ))}
      </div>

      {activeGroup === 'sent' && (
        <div className="mb-8 flex gap-3 overflow-x-auto">
          {['all', 'reported', 'seen', 'resolved'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as Status | 'all')}
              className={`rounded-full border px-5 py-2 text-[10px] font-black uppercase ${
                activeFilter === filter
                  ? 'bg-[#62D8FF] text-black'
                  : 'border-white/10 bg-white/5 text-white/40'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-6 pb-24">
        {filtered.length === 0 ? (
          <div className="mt-10 text-center text-white/40">
            No {activeGroup} reports
          </div>
        ) : (
          filtered.map((incident) => (
            <div
              key={incident.id}
              onClick={() => navigate(`/app/incidents/${incident.id}`)}
              className="rounded-[28px] border border-white/10 bg-white/5 p-6 active:scale-[0.98]"
            >
              <div className="mb-4 flex justify-between">
                <span className="text-sm text-white/60">{incident.plate}</span>

                {activeGroup === 'sent' && (
                  <span
                    className={`rounded-full border px-3 py-1 text-xs ${getStatusStyle(
                      incident.status
                    )}`}
                  >
                    {incident.status}
                  </span>
                )}
              </div>

              <h3 className="mb-2 font-bold text-white">
                {incident.description.split('.')[0]}
              </h3>

              <p className="mb-4 text-sm text-white/50">
                {incident.description}
              </p>

              <div className="flex items-center justify-between">
                {activeGroup === 'received' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400"
                    >
                      Thank you
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="rounded-lg bg-red-500/10 px-3 py-1 text-xs text-red-400"
                    >
                      Bad report
                    </button>
                  </div>
                ) : null}

                <div className="text-xs text-white/40">
                  {new Date(incident.date).toLocaleDateString()}
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