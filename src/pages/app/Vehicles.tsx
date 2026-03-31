import { useNavigate } from 'react-router-dom';
import { useStore } from '../../utils/store';
import { Plus, CarFront, ChevronRight, AlertCircle } from 'lucide-react';
import type { Vehicle } from '../../utils/types';

const Vehicles = () => {
  const navigate = useNavigate();
  const { vehicles } = useStore();

  return (
    <div className="flex h-full flex-col bg-appBg px-6 pt-10 pb-10 relative">
      {/* Header */}
      <header className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <h1 className="text-[28px] font-black tracking-tight text-appText">
            My Vehicles
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/app/vehicles/add')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-appBg border border-appBorder text-appTextSecondary shadow-waze transition-all active:scale-95"
            >
              <Plus size={20} strokeWidth={3} />
            </button>

            <div className="rounded-full bg-appSurface px-3 py-1 text-[11px] font-black uppercase tracking-widest text-appTextSecondary border border-appBorder">
              {vehicles.length} Total
            </div>
          </div>
        </div>

        <p className="text-sm font-bold text-appTextSecondary opacity-60">
          Manage your cars and received alerts.
        </p>
      </header>

      {/* Vehicle List */}
      <div className="scrollbar-hide flex-1 overflow-y-auto pb-10">
        {vehicles.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-appBorder bg-appSurface/50 p-12 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[32px] border border-appBorder bg-appSurface text-appTextSecondary/20 shadow-waze">
              <CarFront size={36} />
            </div>

            <h2 className="text-lg font-black text-appText">
              No vehicles registered
            </h2>

            <p className="mt-2 text-sm font-bold leading-relaxed text-appTextSecondary">
              Add your vehicle to start receiving <br /> real-time alerts from the community.
            </p>
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
    className="group flex cursor-pointer flex-col gap-4 rounded-[32px] border border-appBorder bg-appSurface p-6 shadow-waze transition-all hover:shadow-md active:scale-[0.98]"
  >
    <div className="flex items-center gap-4">
      <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[24px] border border-appBorder bg-appBg shadow-inner transition-transform group-hover:scale-105">
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
          <h3 className="truncate text-lg font-black tracking-tight text-appText">
            {vehicle.name}
          </h3>

          {vehicle.reportsCount > 0 && (
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
          )}
        </div>

        <div className="mt-1 flex items-center gap-2">
          <span className="inline-block rounded-lg bg-appBg px-3 py-1 text-[10px] font-black uppercase tracking-widest text-appTextSecondary">
            {vehicle.plate}
          </span>
        </div>
      </div>

      <div className="text-appTextSecondary/30">
        <ChevronRight size={20} strokeWidth={3} />
      </div>
    </div>

    {/* Quick Stats / Info */}
    <div className="flex items-center gap-2 border-t border-appBorder pt-4">
      <div
        className={`rounded-lg p-1.5 ${
          vehicle.reportsCount > 0
            ? 'bg-red-50 text-red-500'
            : 'bg-emerald-50 text-emerald-500'
        }`}
      >
        <AlertCircle size={14} />
      </div>

      <p className="text-[11px] font-bold text-appTextSecondary">
        {vehicle.reportsCount > 0
          ? `${vehicle.reportsCount} active community alerts`
          : 'No incidents reported recently'}
      </p>
    </div>
  </div>
);

export default Vehicles;