export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <label className="mb-2.5 block text-[14.5px] font-semibold text-ink">{label}</label>
      {children}
      {hint && <span className="mt-1.5 block text-[13px] text-ink-muted">{hint}</span>}
    </div>
  );
}

export function OptionGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">{children}</div>;
}

const TICK = (
  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
    <path d="M1 4.5L4 7.5L10 1" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function OptionCard({
  type = "radio",
  name,
  value,
  checked,
  onChange,
  children,
  wide,
}: {
  type?: "radio" | "checkbox";
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={`option-card ${wide ? "max-w-md" : ""}`}>
      <input type={type} name={name} value={value} checked={checked} onChange={onChange} />
      <span className="tick">{TICK}</span>
      {children}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-line bg-bg-2 px-3.5 py-3 text-[15px] text-ink placeholder:text-ink-faint transition focus:border-accent focus:outline-none"
    />
  );
}
