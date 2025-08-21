// src/components/ui/Button.js
export default function Button({ as: As = "button", className = "", ...props }) {
  const cls = "btn btn-primary " + className;
  return <As className={cls} {...props} />;
}
