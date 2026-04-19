export function Heading({ children }) {
  return (
    <h2 className="mb-3 font-mono text-lg font-medium tracking-tight text-white/85">
      {children}
    </h2>
  );
}

export function Subheading({ children }) {
  return (
    <h3 className="mb-2 font-mono text-sm font-medium tracking-wide text-white/55">
      {children}
    </h3>
  );
}

export function TextBlock({ children }) {
  return (
    <div className="text-sm leading-[1.9] text-white/45 md:text-base whitespace-pre-line">
      {children}
    </div>
  );
}

export function VideoBlock({ src, placeholder }) {
  if (src && (src.includes("youtube.com") || src.includes("youtu.be"))) {
    const id = src.includes("youtu.be")
      ? src.split("/").pop().split("?")[0]
      : new URL(src).searchParams.get("v");

    return (
      <div className="overflow-hidden rounded-lg border border-white/[0.04]">
        <iframe
          className="aspect-video w-full"
          src={`https://www.youtube.com/embed/${id}`}
          title="Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (src) {
    return (
      <div className="overflow-hidden rounded-lg border border-white/[0.04]">
        <video
          className="aspect-video w-full bg-black"
          src={src}
          controls
          playsInline
          preload="metadata"
        />
      </div>
    );
  }

  return (
    <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-white/[0.06] bg-white/[0.01]">
      <div className="px-6 text-center">
        <div className="mb-2 font-mono text-xs text-white/20">
          &#9654; VIDEO PLACEHOLDER
        </div>
        <p className="max-w-md font-mono text-xs leading-relaxed text-white/15">
          {placeholder}
        </p>
      </div>
    </div>
  );
}

export function ImageBlock({ images, captions, columns = 3 }) {
  if (!images) return null;

  return (
    <div
      className={`grid gap-3 ${
        columns === 1
          ? "grid-cols-1"
          : columns === 2
          ? "sm:grid-cols-2"
          : "sm:grid-cols-3"
      }`}
    >
      {images.map((src, i) => (
        <div key={i}>
          <img
            src={src}
            alt={captions[i]}
            className="w-full rounded-lg border border-white/[0.04] object-cover opacity-50"
            loading="lazy"
          />
          <p className="mt-1.5 font-mono text-[10px] leading-relaxed text-white/50">
            {captions[i]}
          </p>
        </div>
      ))}
    </div>
  );
}

export function CodeBlock({ language, code, children }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/[0.04]">
      {language && (
        <div className="border-b border-white/[0.04] bg-white/[0.025] px-4 py-1.5">
          <span className="font-mono text-[10px] tracking-wider text-white/25">
            {language}
          </span>
        </div>
      )}
      <pre className="overflow-x-auto bg-white/[0.015] p-5 font-mono text-sm leading-relaxed text-white/55">
        <code>{code || children}</code>
      </pre>
    </div>
  );
}

export function TableBlock({ headers, rows }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/[0.04]">
      <table className="w-full min-w-max border-collapse font-mono text-sm">
        <thead>
          <tr className="border-b border-white/[0.04] bg-white/[0.025]">
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-2.5 text-left text-[10px] tracking-wider text-white/40 font-medium uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.015] transition-colors"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-4 py-2.5 text-xs leading-relaxed text-white/45"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GraphBlock({ placeholder }) {
  return (
    <div className="flex aspect-[2/1] items-center justify-center rounded-lg border border-dashed border-white/[0.06] bg-white/[0.01]">
      <div className="px-6 text-center">
        <div className="mb-2 font-mono text-xs text-white/20">
          &#9632; GRAPH PLACEHOLDER
        </div>
        <p className="max-w-md font-mono text-xs leading-relaxed text-white/15">
          {placeholder}
        </p>
      </div>
    </div>
  );
}
