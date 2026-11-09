// Tiny Python-ish highlighter for the decorative code cards. Not a real parser, just enough colour.
const TOKEN =
  /(#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(@\w+)|\b(def|class|return|async|await|import|from|for|in|if|else|with|as|self|True|False|None)\b|\b(\d+(?:\.\d+)?)\b/g;

const CLASSES = [
  "italic text-ink-muted",
  "text-emerald-600 dark:text-emerald-300",
  "text-fuchsia-600 dark:text-fuchsia-300",
  "text-accent",
  "text-amber-600 dark:text-amber-300",
];

function highlight(line) {
  const parts = [];
  let last = 0;
  for (const match of line.matchAll(TOKEN)) {
    if (match.index > last) parts.push(line.slice(last, match.index));
    const group = match.slice(1).findIndex(Boolean);
    parts.push(
      <span key={match.index} className={CLASSES[group]}>
        {match[0]}
      </span>
    );
    last = match.index + match[0].length;
  }
  if (last < line.length) parts.push(line.slice(last));
  return parts;
}

function CodeBlock({ code, className = "" }) {
  return (
    <pre className={`overflow-x-auto font-mono leading-relaxed text-ink-soft ${className}`}>
      <code>
        {code.split("\n").map((line, index) => (
          <span key={index} className="block min-h-[1em]">
            {highlight(line)}
          </span>
        ))}
      </code>
    </pre>
  );
}

// Window chrome around a code block: traffic lights and a filename.
export function CodeWindow({ filename, children, className = "" }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-line bg-surface/85 shadow-2xl shadow-black/20 backdrop-blur-md ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-[10px] text-ink-muted">{filename}</span>
      </div>
      {children}
    </div>
  );
}

export default CodeBlock;
