import { useNavigate } from 'react-router-dom';
import { useStore } from '../../utils/store';
import { Plus, CarFront, ChevronRight, AlertCircle } from 'lucide-react';
import type { Vehicle } from '../../utils/types';

const Vehicles = () => {
  const navigate = useNavigate();
  const { vehicles } = useStore();

  return (
    <div className="relative flex h-full flex-col bg-transparent px-5 pt-10 pb-12">
      {/* Soft background atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[220px] w-[220px] -translate-x-1/2 rounded-full bg-white/35 blur-3xl" />
        <div className="absolute right-[-40px] top-24 h-[180px] w-[180px] rounded-full bg-[#D8EAFF]/35 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 mb-8">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#94A3B8]">
              Garage
            </p>

            <h1 className="mt-2 text-[28px] font-black tracking-tight text-[#0F172A]">
              My Vehicles
            </h1>

            <p className="mt-1 text-[13px] font-medium text-[#64748B]">
              Manage your cars and receive alerts.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 pt-1">
            <button
              onClick={() => navigate('/app/vehicles/add')}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D8E3F0] bg-white text-[#7E8CA3] shadow-[0_12px_26px_rgba(15,23,42,0.12)] transition-all hover:scale-[1.03] hover:text-[#3B82F6] active:scale-95"
              aria-label="Add vehicle"
            >
              <Plus size={19} strokeWidth={3} />
            </button>

            <div className="rounded-full border border-[#D8E3F0] bg-white px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#8A98AE] shadow-[0_10px_20px_rgba(15,23,42,0.08)]">
              {vehicles.length} Total
            </div>
          </div>
        </div>
      </header>

      {/* Vehicle List */}
      <div className="scrollbar-hide relative z-10 flex-1 overflow-y-auto pb-36">
        {vehicles.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-[32px] border border-white/70 bg-white/85 p-12 text-center shadow-[0_14px_34px_rgba(15,23,42,0.10)] backdrop-blur-xl">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[26px] bg-[#EEF4FA] text-[#94A3B8] shadow-inner">
              <CarFront size={34} />
            </div>

            <h2 className="text-lg font-black text-[#0F172A]">
              No vehicles yet
            </h2>

            <p className="mt-2 text-sm font-medium leading-relaxed text-[#64748B]">
              Add your vehicle to start receiving
              <br />
              real-time community alerts.
            </p>

            <button
              onClick={() => navigate('/app/vehicles/add')}
              className="mt-6 inline-flex items-center justify-center rounded-[18px] bg-[#111827] px-5 py-3 text-[12px] font-black uppercase tracking-[0.16em] text-white shadow-[0_16px_34px_rgba(15,23,42,0.18)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Add Vehicle
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onClick={() => navigate(`/app/vehicles/${vehicle.id}/edit`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const VehicleCard = ({
  vehicle,
  onClick,
}: {
  vehicle: Vehicle;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="group flex cursor-pointer flex-col gap-4 rounded-[28px] border border-[#DCE6F2] bg-[#F7FAFD]/96 p-5 shadow-[0_14px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_18px_36px_rgba(15,23,42,0.12)] active:scale-[0.985]"
  >
    <div className="flex items-center gap-4">
      <div className="flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-[#E5EDF6] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
        <img
          src={
            vehicle.image ||
            'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=400'
          }
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          alt="Vehicle"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-[18px] font-black tracking-tight text-[#0F172A]">
            {vehicle.name}
          </h3>

          {vehicle.reportsCount > 0 && (
            <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-400" />
          )}
        </div>

        <div className="mt-2">
          <span className="inline-flex rounded-lg border border-[#D9E4F1] bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#64748B] shadow-sm">
            {vehicle.plate}
          </span>
        </div>
      </div>

      <div className="text-[#A3AFBF] transition-colors group-hover:text-[#3B82F6]">
        <ChevronRight size={19} strokeWidth={2.5} />
      </div>
    </div>

    <div className="flex items-center gap-2 border-t border-[#E6EDF5] pt-4">
      <div
        className={`rounded-lg p-1.5 ${
          vehicle.reportsCount > 0
            ? 'bg-red-50 text-red-400'
            : 'bg-emerald-50 text-emerald-500'
        }`}
      >
        <AlertCircle size={14} />
      </div>

      <p className="text-[11px] font-semibold text-[#64748B]">
        {vehicle.reportsCount > 0
          ? `${vehicle.reportsCount} active alerts`
          : 'No recent incidents'}
      </p>
    </div>
  </div>
);

export default Vehicles;