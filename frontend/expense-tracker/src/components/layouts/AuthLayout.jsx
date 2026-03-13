import React from "react";
import CARD_EXP from "../../assets/images/card_exp.png";
import { TrendingUp, PieChart, ShieldCheck } from "lucide-react";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 font-display overflow-hidden">
      {/* Left Column: Form Section */}
      <div className="w-full md:w-[55%] flex flex-col p-6 md:p-12 lg:p-16 relative z-10 bg-white">
        {/* Subtle Decorative Elements (Left Side) */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] overflow-hidden z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 border-[40px] border-primary rounded-full" />
          <div className="absolute top-1/2 -right-24 w-64 h-64 border-[30px] border-slate-900 rounded-full" />
        </div>

        <div className="flex items-center gap-2.5 mb-8 md:mb-12 animate-fade-in-up relative z-10">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <TrendingUp className="text-white w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">AccionMfb IT Tracker</h2>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full animate-fade-in-up relative z-10" style={{ animationDelay: '0.1s' }}>
          {children}
        </div>

        <div className="mt-6 text-slate-400 text-[10px] animate-fade-in-up relative z-10" style={{ animationDelay: '0.2s' }}>
          &copy; {new Date().getFullYear()} Accion Microfinance Bank IT Department.
        </div>
      </div>

      {/* Right Column: Visual Inspiration Section */}
      <div className="hidden md:flex md:w-[45%] bg-gradient-to-br from-orange-400 to-amber-500 relative overflow-hidden items-center justify-center p-10 lg:p-16">
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-orange-300/10 rounded-full blur-[100px]" />

        <div className="relative z-10 w-full max-w-lg space-y-6 lg:space-y-8">
          <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              Master Your <span className="text-amber-100 italic">Financial</span> Workflow.
            </h2>
            <p className="text-orange-50/90 text-base lg:text-lg font-medium leading-relaxed">
              The most intuitive way to manage IT expenses and budgets in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <StatsInfoCard
              icon={<PieChart className="w-5 h-5 text-emerald-400" />}
              label="Real-time Analytics"
              desc="Deep dive into your spending patterns."
            />
            <StatsInfoCard
              icon={<ShieldCheck className="w-5 h-5 text-blue-400" />}
              label="Enterprise Security"
              desc="Your data is encrypted and secure."
            />
          </div>

          <div className="pt-4 lg:pt-8 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <img
                src={CARD_EXP}
                alt="Dashboard Preview"
                className="relative w-full rounded-2xl shadow-2xl border border-white/5 transition duration-500 group-hover:scale-[1.01]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

const StatsInfoCard = ({ icon, label, desc }) => {
  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/[0.08] transition-colors group">
      <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 group-hover:border-primary/50 transition-colors">
        {icon}
      </div>
      <div>
        <h6 className="text-sm font-bold text-white mb-0.5">{label}</h6>
        <p className="text-xs text-orange-100/80 leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
};
