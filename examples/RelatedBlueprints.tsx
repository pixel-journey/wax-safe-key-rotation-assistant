export function RelatedBlueprints() {
  const links = [
    {
      href: "https://github.com/pixel-journey/wax-permission-visualizer-and-editor",
      label: "Permission visualizer",
      why: "Inspect tree before rotating",
    },
    {
      href: "https://github.com/pixel-journey/wax-account-permission-auditor",
      label: "Permission auditor",
      why: "Batch risk scores",
    },
    {
      href: "https://github.com/pixel-journey/wax-social-recovery-and-key-backup-tools",
      label: "Social recovery",
      why: "Owner multi-party design",
    },
    {
      href: "https://github.com/pixel-journey/wax-hardware-wallet-integration-patterns",
      label: "Hardware wallet patterns",
      why: "Keep owner cold",
    },
  ];

  return (
    <section className="mt-12 border-t border-white/10 pt-6 text-xs">
      <p className="mb-3 tracking-widest text-[10px] uppercase opacity-60">
        Related blueprints
      </p>
      <ul className="space-y-3 max-w-xl">
        {links.map((l) => (
          <li key={l.href}>
            <a
              className="text-emerald-400 underline font-mono"
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {l.label}
            </a>
            <p className="text-white/50 mt-0.5">{l.why}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
