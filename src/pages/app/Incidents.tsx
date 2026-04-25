import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../utils/store';
import { Navigation, FileText, ChevronRight } from 'lucide-react';
import type { Status } from '../../utils/types';

const API_BASE_URL = import.meta.env.VITE_API_URL;

type BackendIncident = {
  id: string;
  licence_plate?: string;
  description?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  reporter_id?: string;
  receiver_id?: string;
};

type UiIncident = {
  id: string;
  plate: string;
  description: string;
  status: Status;
  date: string;
  reporterId: string;
  receiverId: string;
};

const normalizePlate = (value: string = '') =>
  String(value).replace(/\s+/g, '').trim().toUpperCase();

const normalizeStatus = (status?: string): Status => {
  const value = String(status || '').toLowerCase();

  if (value === 'reported' || value === 'submitted' || value === 'delivered') {
    return 'reported';
  }

  if (value === 'seen') {
    return 'seen';
  }

  if (value === 'resolved' || value === 'closed' || value === 'acknowledged') {
    return 'resolved';
  }

  return 'reported';
};

const mapBackendIncident = (incident: BackendIncident): UiIncident => {
  return {
    id: incident.id,
    plate: normalizePlate(incident.licence_plate || ''),
    description: incident.description || '',
    status: normalizeStatus(incident.status),
    date: incident.created_at || incident.updated_at || '',
    reporterId: incident.reporter_id || '',
    receiverId: incident.receiver_id || '',
  };
};

const Incidents = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, vehicles } = useStore();

  const [incidents, setIncidents] = useState<UiIncident[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeGroup, setActiveGroup] = useState<'sent' | 'received'>(
    (location.state as { filter?: 'sent' | 'received' } | null)?.filter || 'received'
  );

  const [activeFilter, setActiveFilter] = useState<Status | 'all'>('all');

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/api/reports`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const result = await response.json();

        console.log('Incidents fetch response:', result);

        if (!response.ok) {
          console.error('Incidents fetch failed:', result);
          setIncidents([]);
          return;
        }

        const mapped = Array.isArray(result?.data)
          ? result.data.map(mapBackendIncident)
          : [];

        setIncidents(mapped);
      } catch (error) {
        console.error('Incidents fetch error:', error);
        setIncidents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  const groupedIncidents = incidents.filter((incident) => {
    if (activeGroup === 'sent') {
      return incident.reporterId === user.id;
    }

    return vehicles.some(
      (vehicle) => normalizePlate(vehicle.plate) === normalizePlate(incident.plate)
    );
  });

  const filtered =
    activeFilter === 'all'
      ? groupedIncidents
      : groupedIncidents.filter((incident) => incident.status === activeFilter);

  const getStatusStyle = (status: Status) => {
    switch (status) {
      case 'reported':
        return 'border-sky-200 bg-sky-50 text-sky-600';
      case 'seen':
        return 'border-violet-200 bg-violet-50 text-violet-600';
      case 'resolved':
        return 'border-emerald-200 bg-emerald-50 text-emerald-600';
      default:
        return 'border-slate-200 bg-slate-50 text-slate-500';
    }
  };

  return (
    <div className="relative flex h-full flex-col bg-transparent px-5 pt-10 pb-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[220px] w-[220px] -translate-x-1/2 rounded-full bg-white/35 blur-3xl" />
        <div className="absolute right-[-40px] top-28 h-[180px] w-[180px] rounded-full bg-[#D8EAFF]/35 blur-3xl" />
      </div>

      <header className="relative z-10 mb-8">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#94A3B8]">
          Activity
        </p>
        <h1 className="mt-2 text-[28px] font-black tracking-tight text-[#0F172A]">
          Incident Reports
        </h1>
        <p className="mt-1 text-[13px] font-medium text-[#64748B]">
          Review sent reports and alerts received for your vehicles.
        </p>
      </header>

      <div className="relative z-10 mb-6 flex rounded-[24px] border border-[#DCE6F2] bg-white/80 p-1 shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        {(['sent', 'received'] as const).map((group) => (
          <button
            key={group}
            onClick={() => {
              setActiveGroup(group);
              setActiveFilter('all');
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[20px] py-3 text-[11px] font-black uppercase tracking-[0.14em] transition-all ${
              activeGroup === group
                ? 'bg-[#2563EB] text-white shadow-[0_10px_20px_rgba(37,99,235,0.20)]'
                : 'text-[#64748B]'
            }`}
          >
            {group === 'sent' ? <Navigation size={14} /> : <FileText size={14} />}
            {group}
          </button>
        ))}
      </div>

      {activeGroup === 'sent' && (
        <div className="scrollbar-hide relative z-10 mb-6 flex gap-2 overflow-x-auto pb-1">
          {(['all', 'reported', 'seen', 'resolved'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] transition-all ${
                activeFilter === filter
                  ? 'border-[#2563EB] bg-[#2563EB] text-white'
                  : 'border-[#DCE6F2] bg-white text-[#64748B]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      <div className="scrollbar-hide relative z-10 flex-1 overflow-y-auto pb-32">
        {loading ? (
          <div className="mt-10 rounded-[28px] border border-[#DCE6F2] bg-white/85 p-10 text-center shadow-[0_12px_28px_rgba(15,23,42,0.06)] backdrop-blur-xl">
            <h3 className="text-[18px] font-black text-[#0F172A]">
              Loading reports...
            </h3>
            <p className="mt-2 text-[14px] font-medium text-[#64748B]">
              Please wait while we fetch your activity.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-10 rounded-[28px] border border-[#DCE6F2] bg-white/85 p-10 text-center shadow-[0_12px_28px_rgba(15,23,42,0.06)] backdrop-blur-xl">
            <h3 className="text-[18px] font-black text-[#0F172A]">
              No {activeGroup} reports
            </h3>
            <p className="mt-2 text-[14px] font-medium text-[#64748B]">
              Reports will appear here when activity is available.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((incident) => (
              <div
                key={incident.id}
                onClick={() => navigate(`/app/incidents/${incident.id}`)}
                className="group cursor-pointer rounded-[28px] border border-[#DCE6F2] bg-white/90 p-5 shadow-[0_12px_28px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all hover:-translate-y-[1px] hover:shadow-[0_16px_34px_rgba(15,23,42,0.10)] active:scale-[0.985]"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#94A3B8]">
                      Vehicle Plate
                    </p>
                    <span className="mt-1 inline-flex rounded-xl border border-[#D9E4F1] bg-[#F8FBFF] px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#64748B]">
                      {incident.plate}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeGroup === 'sent' && (
                      <span
                        className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${getStatusStyle(
                          incident.status
                        )}`}
                      >
                        {incident.status}
                      </span>
                    )}

                    <ChevronRight
                      size={18}
                      className="text-[#A3AFBF] transition-colors group-hover:text-[#2563EB]"
                    />
                  </div>
                </div>

                <h3 className="mb-2 line-clamp-1 text-[17px] font-black tracking-tight text-[#0F172A]">
                  {incident.description?.split('.')?.[0] ?? ''}
                </h3>

                <p className="mb-4 line-clamp-2 text-[14px] font-medium leading-relaxed text-[#64748B]">
                  {incident.description ?? ''}
                </p>

                <div className="flex items-center justify-between gap-3 border-t border-[#E6EDF5] pt-4">
                  {activeGroup === 'received' ? (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-black text-emerald-600 transition-all active:scale-95"
                      >
                        Thank you
                      </button>

                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-black text-red-500 transition-all active:scale-95"
                      >
                        Bad report
                      </button>
                    </div>
                  ) : (
                    <div />
                  )}

                  <div className="shrink-0 text-[11px] font-semibold text-[#94A3B8]">
                    {incident.date
                      ? new Date(incident.date).toLocaleDateString()
                      : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Incidents;