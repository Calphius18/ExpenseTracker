import React, { useMemo } from "react";

const PasswordStrengthIndicator = ({ password }) => {
    const strength = useMemo(() => {
        if (!password) return { score: 0, label: "", color: "" };

        let score = 0;

        // Length checks
        if (password.length >= 6) score += 1;
        if (password.length >= 10) score += 1;

        // Character variety checks
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^a-zA-Z0-9]/.test(password)) score += 1;

        // Map score to levels
        if (score <= 2) return { score: 1, label: "Weak", color: "bg-rose-500" };
        if (score <= 3) return { score: 2, label: "Fair", color: "bg-orange-400" };
        if (score <= 4) return { score: 3, label: "Good", color: "bg-amber-400" };
        return { score: 4, label: "Strong", color: "bg-emerald-500" };
    }, [password]);

    if (!password) return null;

    const labelColorMap = {
        1: "text-rose-500",
        2: "text-orange-400",
        3: "text-amber-500",
        4: "text-emerald-500",
    };

    return (
        <div className="mt-1 mb-3 animate-fade-in-up">
            {/* Segmented bar */}
            <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((level) => (
                    <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ease-out ${level <= strength.score
                                ? strength.color
                                : "bg-slate-100"
                            }`}
                    />
                ))}
            </div>

            {/* Label */}
            <p
                className={`text-[11px] font-semibold mt-1.5 transition-colors duration-300 ${labelColorMap[strength.score] || "text-slate-400"
                    }`}
            >
                {strength.label}
            </p>
        </div>
    );
};

export default PasswordStrengthIndicator;
