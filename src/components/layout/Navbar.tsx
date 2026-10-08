import React from 'react';
import {
  Activity,
  FileText,
  Menu,
  Moon,
  Plus,
  Search,
  ShieldCheck,
  Sun,
} from 'lucide-react';interface Props {
  onNewInvestigation: () => void;
  onOpenBrief: () => void;
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
  onToggleTheme: () => void;
    onToggleTheme: () => void;
theme: 'light' | 'dark' | 'system';
currentView: string;
  onSelectView: (view: string) => void;
}

export const Navbar: React.FC<Props> = ({
  onNewInvestigation,
  onOpenBrief,
  onOpenSearch,
  onOpenMobileMenu,
onToggleTheme,
theme,
}) => (
  <header className="relative top-0 h-16 shrink-0 bg-[var(--popu-surface)] border-b border-[var(--popu-border)] text-[var(--popu-text)] flex items-center px-3 sm:px-5 gap-3 sm:gap-5 z-30">

    {/* Mobile menu */}
    <button
      onClick={onOpenMobileMenu}
      className="md:hidden w-9 h-9 rounded-lg border border-[var(--popu-border)] bg-[var(--popu-muted)] flex items-center justify-center text-[var(--popu-text)] hover:bg-[var(--popu-surface)] transition-colors"
      aria-label="Open navigation"
    >
      <Menu size={19} />
    </button>

    {/* Brand */}
    <div className="flex items-center gap-2 sm:gap-3 min-w-0 md:min-w-[232px]">
      <div className="w-9 h-9 rounded-xl bg-[var(--popu-navy)] text-[var(--popu-surface)] flex items-center justify-center shrink-0">
        <Activity size={19} />
      </div>

      <div>
        <div className="font-black tracking-tight text-lg leading-none text-[var(--popu-text)]">
          POPU
        </div>

        <div className="hidden sm:block text-[9px] uppercase tracking-[.16em] text-[var(--popu-sub)] mt-1">
          Epidemiological Intelligence
        </div>
      </div>
    </div>

    {/* Desktop search */}
    <button
      onClick={onOpenSearch}
      className="hidden md:flex flex-1 max-w-xl items-center gap-2 h-10 px-3 rounded-lg bg-[var(--popu-muted)] border border-[var(--popu-border)] text-[var(--popu-sub)] text-left hover:bg-[var(--popu-surface)] transition-colors"
    >
      <Search size={16} />

      <span className="text-sm">
        Search investigations, signals, diseases...
      </span>

      <span className="ml-auto text-[10px] font-mono border border-[var(--popu-border)] rounded px-1.5 py-0.5">
        /
      </span>
    </button>

    {/* Mobile search */}
    <button
      onClick={onOpenSearch}
      className="md:hidden w-9 h-9 rounded-lg border border-[var(--popu-border)] bg-[var(--popu-muted)] text-[var(--popu-sub)] flex items-center justify-center hover:bg-[var(--popu-surface)] transition-colors"
      aria-label="Search"
    >
      <Search size={17} />
    </button>

    {/* Actions */}
    <div className="ml-auto flex items-center gap-2">

      {/* Synthetic demo status */}
      <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[var(--popu-muted)] text-[var(--popu-warning)] border border-[var(--popu-border)] text-[10px] font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--popu-warning)]" />
        SYNTHETIC DEMO
      </span>

      {/* Human review status */}
      <span className="hidden lg:flex items-center gap-1.5 text-[10px] font-semibold text-[var(--popu-teal)] px-2.5">
        <ShieldCheck size={14} />
        Human review enabled
      </span>

     {/* Theme toggle */}
<button
  onClick={onToggleTheme}
  className="w-9 h-9 rounded-lg border border-[var(--popu-border)] bg-[var(--popu-muted)] text-[var(--popu-text)] flex items-center justify-center hover:bg-[var(--popu-surface)] transition-colors"
  aria-label="Toggle light and dark appearance"
  title="Toggle light and dark appearance"
>
  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
</button>

{/* Brief */}
<button
  onClick={onOpenBrief}
  className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--popu-border)] bg-[var(--popu-surface)] text-[var(--popu-text)] text-xs font-semibold hover:bg-[var(--popu-muted)] transition-colors"
>
  <FileText size={15} />
  Brief
</button>

      {/* New investigation */}
      <button
        onClick={onNewInvestigation}
        className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-lg bg-[var(--popu-teal)] hover:bg-[var(--popu-teal-dark)] text-white text-xs font-bold whitespace-nowrap transition-colors"
      >
        <Plus size={15} />

        <span className="hidden sm:inline">
          New investigation
        </span>

        <span className="sm:hidden">
          New
        </span>
      </button>

    </div>
  </header>
);
