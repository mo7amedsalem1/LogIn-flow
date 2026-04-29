export default function FormField({
  label,
  hint,
  as = "input",
  children,
  ...props
}) {
  const Component = as;

  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {hint ? <span className="field-hint">{hint}</span> : null}
      <Component {...props}>{children}</Component>
    </label>
  );
}
