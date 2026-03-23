import React from "react";
import { Check } from "lucide-react";

const StepIndicator = ({ currentStep, totalSteps, labels = [] }) => {
    return (
        <div className="flex items-center justify-center w-full mb-8">
            {Array.from({ length: totalSteps }, (_, i) => {
                const step = i + 1;
                const isCompleted = step < currentStep;
                const isActive = step === currentStep;

                return (
                    <React.Fragment key={step}>
                        {/* Step circle */}
                        <div className="flex flex-col items-center relative">
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-400 ease-out ${isCompleted
                                    ? "bg-emerald-500 text-white scale-100 shadow-lg shadow-emerald-500/25"
                                    : isActive
                                        ? "bg-primary text-white scale-110 shadow-lg shadow-primary/30 animate-scale-in"
                                        : "bg-slate-100 text-slate-400 scale-100"
                                    }`}
                            >
                                {isCompleted ? (
                                    <Check className="w-4 h-4" strokeWidth={3} />
                                ) : (
                                    step
                                )}
                            </div>
                            {/* Label */}
                            {labels[i] && (
                                <span
                                    className={`absolute -bottom-5 text-[10px] font-semibold whitespace-nowrap transition-colors duration-300 ${isCompleted
                                        ? "text-emerald-500"
                                        : isActive
                                            ? "text-primary"
                                            : "text-slate-300"
                                        }`}
                                >
                                    {labels[i]}
                                </span>
                            )}
                        </div>

                        {/* Connector line */}
                        {step < totalSteps && (
                            <div className="w-16 h-0.5 mx-2 rounded-full overflow-hidden bg-slate-100">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ease-out ${isCompleted ? "w-full bg-emerald-500" : "w-0 bg-primary"
                                        }`}
                                />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default StepIndicator;
