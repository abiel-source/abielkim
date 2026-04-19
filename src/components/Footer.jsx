export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <span className="font-mono text-xs text-white/20">
          &copy; {new Date().getFullYear()} Abiel Kim
        </span>
        <span className="font-mono text-[10px] tracking-wider text-white/15">
          Programmed in NEXT JS
        </span>
      </div>
    </footer>
  );
}
