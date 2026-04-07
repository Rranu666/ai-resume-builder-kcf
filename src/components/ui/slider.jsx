import React from "react";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef(({ 
  className, 
  value, 
  onValueChange, 
  min = 0, 
  max = 100, 
  step = 1, 
  ...props 
}, ref) => {
  const handleChange = (event) => {
    if (onValueChange) {
      onValueChange([Number(event.target.value)]);
    }
  };

  return (
    <input
      ref={ref}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value?.[0] || 0}
      onChange={handleChange}
      className={cn(
        "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer",
        "slider-thumb:appearance-none slider-thumb:w-4 slider-thumb:h-4 slider-thumb:rounded-full slider-thumb:bg-blue-500",
        className
      )}
      {...props}
    />
  );
});

Slider.displayName = "Slider";

export { Slider };