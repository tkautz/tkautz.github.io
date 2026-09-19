export function Authors({ text }: { text: string }) {
  return <>{text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => part.startsWith("**")
    ? <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong> : part)}</>;
}
