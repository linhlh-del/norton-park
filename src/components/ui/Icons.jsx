const base = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const PhoneIcon = (p) => (
  <svg viewBox="0 0 24 24" width="22" height="22" strokeWidth="1.6" {...base} {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
  </svg>
);

export const ChatIcon = (p) => (
  <svg viewBox="0 0 24 24" width="22" height="22" strokeWidth="1.6" {...base} {...p}>
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
  </svg>
);

export const MenuIcon = (p) => (
  <svg viewBox="0 0 24 24" width="22" height="22" strokeWidth="1.6" {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CloseIcon = (p) => (
  <svg viewBox="0 0 24 24" width="22" height="22" strokeWidth="1.6" {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const FlowerMark = (p) => (
  <svg viewBox="0 0 40 40" width="40" height="40" strokeWidth="1.2" {...base} {...p}>
    <path d="M20 4c4 6 4 10 0 16-4-6-4-10 0-16zM36 20c-6 4-10 4-16 0 6-4 10-4 16 0zM20 36c-4-6-4-10 0-16 4 6 4 10 0 16zM4 20c6-4 10-4 16 0-6 4-10 4-16 0z" />
  </svg>
);
