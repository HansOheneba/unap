"use client";

export type OtpChannel = "email" | "phone";

type Props = {
  value: OtpChannel;
  onChange: (channel: OtpChannel) => void;
  disabled?: boolean;
};

export default function OtpChannelToggle({ value, onChange, disabled }: Props) {
  return (
    <div
      className="grid grid-cols-2 gap-px bg-zinc-200 border border-zinc-200"
      role="group"
      aria-label="Sign in with email or phone"
    >
      {(
        [
          { id: "email", label: "Email" },
          { id: "phone", label: "Phone" },
        ] as const
      ).map((option) => {
        const active = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.id)}
            aria-pressed={active}
            className={`px-4 py-2.5 text-[0.65rem] tracking-widest uppercase transition-colors duration-200 disabled:opacity-50 ${
              active
                ? "bg-zinc-900 text-white"
                : "bg-white text-zinc-500 hover:text-zinc-900"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
