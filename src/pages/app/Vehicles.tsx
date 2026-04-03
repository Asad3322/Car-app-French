import { useNavigate } from 'react-router-dom';
import { useStore } from '../../utils/store';
import { Plus, CarFront, ChevronRight, AlertCircle } from 'lucide-react';
import type { Vehicle } from '../../utils/types';

const Vehicles = () => {
  const navigate = useNavigate();
  const { vehicles } = useStore();

  return (
    <div className="relative flex h-full flex-col bg-transparent px-6 pb-10 pt-10">
      {/* Glow Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-[#00C2FF]/10 blur-3xl" />
        <div className="absolute -left-16 top-28 h-[220px] w-[220px] rounded-full bg-[#2563EB]/10 blur-3xl" />
        <div className="absolute bottom-24 right-[-50px] h-[220px] w-[220px] rounded-full bg-[#06B6D4]/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 mb-8">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/35">
              Garage
            </p>
            <h1 className="mt-1 text-[28px] font-black tracking-tight text-white">
              My Vehicles
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/app/vehicles/add')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 shadow-[0_10px_28px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all hover:border-cyan-300/25 hover:text-[#62D8FF] active:scale-95"
            >
              <Plus size={20} strokeWidth={3} />
            </button>

            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white/60 backdrop-blur-xl">
              {vehicles.length} Total
            </div>
          </div>
        </div>

        <p className="text-sm font-bold text-white/55">
          Manage your cars and received alerts.
        </p>
      </header>

      {/* Vehicle List */}
      <div className="scrollbar-hide relative z-10 flex-1 overflow-y-auto pb-10">
        {vehicles.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-[40px] border border-white/10 bg-white/[0.06] p-12 text-center shadow-[0_12px_34px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[32px] border border-white/10 bg-white/5 text-white/25 shadow-[0_10px_24px_rgba(0,0,0,0.16)]">
              <CarFront size={36} />
            </div>

            <h2 className="text-lg font-black text-white">
              No vehicles registered
            </h2>

            <p className="mt-2 text-sm font-bold leading-relaxed text-white/55">
              Add your vehicle to start receiving
              <br />
              real-time alerts from the community.
            </p>

            <button
              onClick={() => navigate('/app/vehicles/add')}
              className="mt-6 inline-flex items-center justify-center rounded-[20px] bg-gradient-to-r from-[#00C2FF] via-[#14B8FF] to-[#008FEA] px-5 py-3 text-[12px] font-black uppercase tracking-[0.18em] text-white shadow-[0_16px_40px_rgba(0,194,255,0.28)] transition-all hover:scale-[1.02] active:scale-[0.98]"
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
    className="group flex cursor-pointer flex-col gap-4 rounded-[32px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_12px_34px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all hover:border-cyan-300/20 hover:bg-white/[0.08] active:scale-[0.98]"
  >
    <div className="flex items-center gap-4">
      <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-white/5 shadow-inner transition-transform group-hover:scale-[1.03]">
        <img
          src={
            vehicle.image ||
            'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=400'
          }
          className="h-full w-full object-cover"
          alt="Vehicle"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-lg font-black tracking-tight text-white">
            {vehicle.name}
          </h3>

          {vehicle.reportsCount > 0 && (
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
          )}
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="inline-block rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/60">
            {vehicle.plate}
          </span>
        </div>
      </div>

      <div className="text-white/25 transition-colors group-hover:text-[#62D8FF]">
        <ChevronRight size={20} strokeWidth={3} />
      </div>
    </div>

    <div className="flex items-center gap-2 border-t border-white/10 pt-4">
      <div
        className={`rounded-lg p-1.5 ${
          vehicle.reportsCount > 0
            ? 'bg-red-400/12 text-red-300'
            : 'bg-emerald-400/12 text-emerald-300'
        }`}
      >
        <AlertCircle size={14} />
      </div>

      <p className="text-[11px] font-bold text-white/55">
        {vehicle.reportsCount > 0
          ? `${vehicle.reportsCount} active community alerts`
          : 'No incidents reported recently'}
      </p>
    </div>
  </div>
);

export default Vehicles;