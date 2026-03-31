import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, HelpCircle, Camera, UploadCloud, Sparkles } from 'lucide-react';
import type { Urgency, Incident } from '../utils/types';
import { useStore } from '../utils/store';

const ReportDetails = () => {
  const navigate = useNavigate();
  const { setIncidents } = useStore();
  
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<Urgency>('Medium Urgency');
  const [plate, setPlate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiUses, setAiUses] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [hasInsurance, setHasInsurance] = useState(false);
  const [mediaCount, setMediaCount] = useState(0);

  const handleAiOptimize = () => {
    if (!description || aiUses >= 3 || isOptimizing) return;
    setIsOptimizing(true);
    setTimeout(() => {
      setDescription(prev => prev + " (Refined by CARAPP AI)");
      setAiUses(prev => prev + 1);
      setIsOptimizing(false);
    }, 1200);
  };

  const sendReport = () => {
    if (!plate || !description) return;
    setIsSubmitting(true);
    
    const newIncident: Incident = {
      id: Date.now().toString(),
      plate: plate,
      incidentType: 'TRAFFIC',
      description: description,
      urgency: urgency,
      date: new Date().toISOString(),
      status: 'reported',
      location: 'Current Location',
      reporterId: 'user1',
    };

    setTimeout(() => {
      setIncidents((prev: Incident[]) => [newIncident, ...prev]);
      setIsSubmitting(false);
      navigate('/success');
    }, 1500);
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#F8FAFC] to-[#EEF3F8] pb-32 items-center relative overflow-y-auto scrollbar-hide pt-10 px-6">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-blue-400/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 -ml-20 h-64 w-64 rounded-full bg-indigo-400/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="w-full flex items-center justify-between mb-8 z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-[0_4px_12px_rgba(0,0,0,0.05)] active:scale-90 transition-all hover:bg-white"
        >
          <ChevronLeft size={18} className="text-[#0F172A]" />
        </button>
        <h1 className="text-[15px] font-black tracking-[0.2em] text-[#0F172A] uppercase">
          REPORT DETAILS
        </h1>
        <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-[0_4px_12px_rgba(0,0,0,0.05)] active:scale-90 transition-all hover:bg-white">
          <HelpCircle size={18} className="text-[#94A3B8]" />
        </button>
      </header>

      {/* Main Content Area */}
      <div className="w-full flex flex-col gap-7 z-10">
        
        {/* Licence Plate Section */}
        <section className="group">
          <label className="text-[10.5px] font-black uppercase tracking-[0.16em] text-slate-700 mb-2.5 block ml-1 transition-colors group-focus-within:text-blue-600">
            LICENCE PLATE
          </label>
          <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/40 p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 group-hover:shadow-lg group-hover:border-white focus-within:ring-2 focus-within:ring-blue-100/50">
            <input
              type="text"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              className="w-full text-[16px] font-black text-[#0F172A] placeholder:text-slate-300 focus:outline-none bg-transparent"
              placeholder="ABC 1234"
            />
          </div>
        </section>

        {/* Urgency Section */}
        <section>
          <label className="text-[10.5px] font-black uppercase tracking-[0.16em] text-slate-700 mb-2.5 block ml-1">
            URGENCY LEVEL
          </label>
          <div className="flex bg-slate-200/50 backdrop-blur-sm rounded-[28px] p-1.5 gap-1 shadow-inner border border-white/20">
            {(['Urgent', 'Medium Urgency', 'Not Urgent'] as Urgency[]).map((level) => (
              <button
                key={level}
                onClick={() => setUrgency(level)}
                className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all duration-300 rounded-[22px] ${
                  urgency === level 
                    ? 'bg-gradient-to-r from-[#FF9F0A] to-[#FFB340] text-white shadow-[0_4px_12px_rgba(255,159,10,0.3)] scale-[1.02]' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-white/20'
                }`}
              >
                {level.replace(' Urgency', '')}
              </button>
            ))}
          </div>
        </section>

        {/* Description Section */}
        <section className="group">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <label className="text-[10.5px] font-black uppercase tracking-[0.16em] text-slate-700 transition-colors group-focus-within:text-blue-600">
              INCIDENT DESCRIPTION
            </label>
            <button
              onClick={handleAiOptimize}
              disabled={!description || aiUses >= 3 || isOptimizing}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#2B61E5] text-white text-[8px] font-black uppercase tracking-widest shadow-[0_8px_20px_rgba(43,97,229,0.3)] active:scale-95 transition-all duration-300 disabled:opacity-30 disabled:grayscale ${
                !isOptimizing && description && aiUses < 3 ? 'animate-[pulse_3s_infinite]' : ''
              }`}
            >
              <Sparkles size={10} className={isOptimizing ? 'animate-spin' : ''} />
              {isOptimizing ? 'OPTIMIZING...' : aiUses > 0 ? `REGENERATE (${3 - aiUses})` : 'OPTIMIZE WITH AI'}
            </button>
          </div>
          <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/40 p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-h-[140px] transition-all duration-300 group-hover:shadow-lg group-hover:border-white focus-within:ring-2 focus-within:ring-blue-100/50">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm font-bold text-[#0F172A] leading-relaxed focus:outline-none resize-none bg-transparent placeholder:text-slate-300"
              rows={4}
              placeholder="Please describe what happened..."
            />
          </div>
        </section>

        {/* Media Grid */}
        <div className="grid grid-cols-2 gap-4">
          <UploadCard 
            label="ADD PHOTOS" 
            icon={<Camera size={22} />} 
            active={mediaCount > 0} 
            onClick={() => setMediaCount(1)}
          />
          <UploadCard 
            label="INSURANCE (OPT)" 
            icon={<UploadCloud size={22} />} 
            active={hasInsurance}
            onClick={() => setHasInsurance(true)}
          />
        </div>

        {/* Submit Button */}
        <div className="mt-4 px-1">
          <button
            onClick={sendReport}
            disabled={!plate || !description || isSubmitting}
            className="group relative w-full h-[68px] bg-gradient-to-r from-[#2B61E5] to-[#1D4ED8] text-white rounded-[28px] text-[16px] font-black shadow-[0_12px_28px_-8px_rgba(43,97,229,0.5)] hover:shadow-[0_16px_32px_-8px_rgba(43,97,229,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 uppercase tracking-[0.1em] overflow-hidden"
          >
            {/* Subtle Shine Effect */}
            <div className="absolute top-0 -left-[100%] h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-1000 group-hover:left-[100%]" />
            
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Sending Request...</span>
              </>
            ) : (
              <span>Send Report</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const UploadCard = ({ label, icon, active, onClick }: { label: string, icon: any, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center justify-center p-10 rounded-[32px] border-2 shadow-sm gap-4 active:scale-95 transition-all duration-300 hover:scale-[1.02] outline-none ${
      active 
        ? 'bg-blue-50/80 border-blue-200 text-[#2B61E5] shadow-[0_4px_15px_rgba(43,97,229,0.1)]' 
        : 'bg-white/60 backdrop-blur-sm border-slate-100 border-dashed text-[#94A3B8] hover:border-blue-200 hover:bg-white/90'
    }`}
  >
    <div className={`p-4 rounded-full transition-transform duration-500 ease-out ${
      active ? 'bg-blue-100/80 text-[#2B61E5] scale-110 shadow-inner' : 'bg-slate-100/50 text-[#94A3B8]'
    }`}>
      {icon}
    </div>
    <span className={`text-[10.5px] font-black tracking-[0.16em] uppercase transition-colors ${active ? 'text-[#0F172A]' : 'text-slate-700'}`}>
      {label}
    </span>
  </button>
);

export default ReportDetails;

