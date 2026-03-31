import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  ShieldCheck, 
  Clock, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Sparkles, 
  AlertTriangle,
  CameraOff,
  Calendar,
  Info
} from 'lucide-react';
import { useStore } from '../../utils/store';

const IncidentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { incidents, vehicles } = useStore();
  const incident = incidents.find((i) => i.id === id);
  const isReceived = incident && vehicles.some(v => v.plate === incident.plate);
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleSayThanks = () => {
    setFeedbackSent(true);
    setTimeout(() => setFeedbackSent(false), 3000);
  };

  const handleReportBad = () => {
    alert("Reported to support team for manual review.");
  };

  if (!incident) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="p-4 bg-red-50 text-red-500 rounded-full mb-4">
          <Info size={32} />
        </div>
        <h2 className="text-xl font-black text-appText">Report Not Found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-primary font-bold underline">Go back</button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white relative">
      {/* Dynamic Success Toast */}
      {feedbackSent && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
           <ShieldCheck size={18} />
           <span className="text-xs font-black uppercase tracking-widest">Thanks sent to the reporter!</span>
        </div>
      )}

      {/* Modern Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-appBorder px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 active:scale-95 transition-all"
        >
          <ChevronLeft size={20} className="text-appText" />
        </button>
        <h1 className="text-sm font-black text-appText uppercase tracking-widest">
          Report Details
        </h1>
        <div className="w-10" />
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
         {/* Media Section - Focus on the Image */}
         <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
            {incident.image ? (
              <img 
                src={incident.image} 
                alt="Reported car evidence" 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-appTextSecondary/20">
                <div className="h-20 w-20 rounded-[32px] bg-white border border-appBorder shadow-sm flex items-center justify-center">
                  <CameraOff size={40} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">No car image available</span>
              </div>
            )}
            
            {/* Status Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 ${
                    incident.urgency === 'Urgent' ? 'bg-red-600 text-white' : 'bg-white text-appText'
                }`}>
                   {incident.urgency === 'Urgent' ? <AlertTriangle size={14} /> : <Clock size={14} />}
                   {incident.urgency}
                </div>
                {!isReceived && (
                  <div className="bg-emerald-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      {incident.status}
                  </div>
                )}
            </div>
         </div>

         <div className="px-6 py-8 flex flex-col gap-8">
          {/* Info Card */}
          <section className="bg-slate-50 rounded-[32px] p-6 border border-appBorder">
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-white px-5 py-3 rounded-2xl border-2 border-appText shadow-sm">
                        <span className="text-lg font-mono font-black tracking-widest text-appText">
                            {incident.plate}
                        </span>
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <Sparkles size={10} className="text-blue-500" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600">{incident.incidentType}</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-appTextSecondary/60">Licence Plate</p>
                        <p className="text-xs font-black text-appText">Registered Vehicle</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {/* Location Hidden */}
                    <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-appBorder">
                        <div className="text-primary">
                            <Calendar size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-widest text-appTextSecondary/60">Date & Time</p>
                            <p className="text-xs font-black text-appText truncate">
                                {new Date(incident.date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
          </section>

          {/* Description Section */}
          <section>
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-appTextSecondary/60 ml-2 mb-3 block">Reporter Notes</label>
            <div className="p-6 rounded-[32px] bg-white border border-appBorder shadow-sm">
                <p className="text-sm font-bold text-appText leading-relaxed">
                    {incident.description}
                </p>
            </div>
          </section>

          {/* Assistant Tip */}
          <section className="p-6 rounded-[32px] bg-primary text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 h-40 w-40 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={18} />
                <h3 className="text-xs font-black uppercase tracking-widest">Assistant Tip</h3>
              </div>
              <p className="text-sm font-bold leading-relaxed opacity-90">
                This report was verified by our community. You can thank the person who reported this to encourage safe parking!
              </p>
              
              <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Helpful info?</span>
                <div className="flex gap-2">
                    <button 
                      onClick={() => setIsHelpful(true)}
                      className={`h-8 px-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                        isHelpful === true ? 'bg-white text-primary' : 'bg-white/10 text-white'
                      }`}
                    >
                      <ThumbsUp size={12} /> Yes
                    </button>
                    <button 
                      onClick={() => setIsHelpful(false)}
                      className={`h-8 px-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                        isHelpful === false ? 'bg-red-500 text-white' : 'bg-white/10 text-white'
                      }`}
                    >
                      <ThumbsDown size={12} /> No
                    </button>
                </div>
              </div>
            </div>
          </section>
          
          {/* Action Footer */}
          <section className="flex flex-col gap-4">
            <button 
              onClick={handleSayThanks}
              className="waze-btn-primary h-14 rounded-2xl text-sm flex items-center justify-center gap-2"
            >
               <MessageSquare size={18} />
               <span>Thank you</span>
            </button>
            <button 
              onClick={handleReportBad}
              className="text-[10px] font-black text-red-500 uppercase tracking-widest text-center hover:opacity-70 transition-all py-2"
            >
               Bad report
            </button>
          </section>
         </div>
      </div>
    </div>
  );
};

export default IncidentDetails;
