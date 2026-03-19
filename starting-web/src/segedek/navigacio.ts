const NAVIGACIO_ESEMENY = 'popstate';

type NavigacioBeallitasok = {
  replace?: boolean;
};

export function belsoUtvonalE(href: string) {
  return href.startsWith('/');
}

export function navigalj(href: string, beallitasok: NavigacioBeallitasok = {}) {
  const cel = new URL(href, window.location.origin);
  const ujUtvonal = `${cel.pathname}${cel.search}${cel.hash}`;
  const aktualisUtvonal = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (aktualisUtvonal === ujUtvonal) {
    return;
  }

  if (beallitasok.replace) {
    window.history.replaceState({}, document.title, ujUtvonal);
  } else {
    window.history.pushState({}, document.title, ujUtvonal);
  }

  window.dispatchEvent(new PopStateEvent(NAVIGACIO_ESEMENY));
}
