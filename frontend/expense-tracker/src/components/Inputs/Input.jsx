import React, { useState } from "react";
import { RiEyeLine } from "react-icons/ri";
import { RiEyeOffLine } from "react-icons/ri";

const Input = ({value, onChange, label, placeholder, type}) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

  return (
    <div>
      <label className="text-[13px] text-slate-400 font-bold">{label}</label>  
      
        <div className="input-box">
            <input 
            type={type == "password" ? showPassword ? "text" : "password" : type}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none"
            value={value}
            onChange={(e) => onChange(e)}
             />

             {
                type === "password" && (
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
                )
             }
        </div>

    </div>
    
  )
};

export default Input;
 