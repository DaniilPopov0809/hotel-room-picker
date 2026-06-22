import { clampNumber } from "@/components/shared/lib/common";
import { Minus, Plus } from "lucide-react";

interface StepperProps {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  value: number;
  icon?: React.ReactNode;
};

export function Stepper({ label, max, min, onChange, value, icon }: StepperProps) {
  const decrease = () => onChange(clampNumber(value - 1, min, max));
  const increase = () => onChange(clampNumber(value + 1, min, max));

  return (
    <div className="grid min-w-0 gap-0.5">
      <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
        {icon}
        {label}
      </span>
      <div className="grid grid-cols-[34px_1fr_34px] items-center rounded-md border border-slate-200 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
        <button
          aria-label={`Decrease ${label.toLowerCase()}`}
          className="ml-1 flex size-6 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:text-slate-300"
          disabled={value <= min}
          type="button"
          onClick={decrease}
        >
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <span className="min-w-0 text-center text-sm font-semibold tabular-nums text-slate-950">
          {value}
        </span>
        <button
          aria-label={`Increase ${label.toLowerCase()}`}
          className="mr-1 flex size-6 items-center justify-center rounded-md text-slate-500 transition hover:bg-brand-soft hover:text-brand disabled:text-slate-300"
          disabled={value >= max}
          type="button"
          onClick={increase}
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
