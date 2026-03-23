import React, { useState } from "react";
import { RiEyeLine } from "react-icons/ri";
import { RiEyeOffLine } from "react-icons/ri";

const Input = ({ value, onChange, label, placeholder, type, floating = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isFloating = floating && (isFocused || value);

  // Floating label variant
  if (floating) {
    return (
      <div className="relative">
        <div className="input-box !mb-3 !pt-5 !pb-2.5">
          <input
            type={type === "password" ? (showPassword ? "text" : "password") : type}
            className="w-full bg-transparent outline-none text-sm peer"
            value={value}
            onChange={(e) => onChange(e)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isFloating ? placeholder : ""}
          />

          {type === "password" && (
            <>
              {showPassword ? (
                <RiEyeLine
                  size={22}
                  className="text-primary cursor-pointer"
                  onClick={() => toggleShowPassword()}
                />
              ) : (
                <RiEyeOffLine
                  size={22}
                  className="text-slate-400 cursor-pointer"
                  onClick={() => toggleShowPassword()}
                />
              )}
            </>
          )}
        </div>

        {/* Floating label */}
        <label
          className={`absolute left-4 transition-all duration-200 ease-out pointer-events-none ${isFloating
              ? "top-2 text-[10px] font-bold text-primary"
              : "top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium"
            }`}
        >
          {label}
        </label>
      </div>
    );
  }

  // Default (non-floating) variant — unchanged behavior
  return (
    <div>
      <label className="text-[13px] text-slate-600 font-semibold ml-1">{label}</label>

      <div className="input-box">
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
          value={value}
          onChange={(e) => onChange(e)}
        />

        {type === "password" && (
          <>
            {showPassword ? (
              <RiEyeLine
                size={22}
                className="text-primary cursor-pointer"
                onClick={() => toggleShowPassword()}
              />
            ) : (
              <RiEyeOffLine
                size={22}
                className="text-slate-400 cursor-pointer"
                onClick={() => toggleShowPassword()}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Input;
