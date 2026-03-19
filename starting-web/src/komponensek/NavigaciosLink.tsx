import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';

import { belsoUtvonalE, navigalj } from '@/segedek/navigacio';

type NavigaciosLinkTulajdonsagok = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  children: ReactNode;
  replace?: boolean;
};

function ujLaponNyit(event: MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

export function NavigaciosLink({ href, onClick, target, replace = false, children, ...tulajdonsagok }: NavigaciosLinkTulajdonsagok) {
  const belso = belsoUtvonalE(href);

  const kezeliKattintast = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || !belso || target === '_blank' || ujLaponNyit(event)) {
      return;
    }

    event.preventDefault();
    navigalj(href, { replace });
  };

  return (
    <a {...tulajdonsagok} href={href} target={target} onClick={kezeliKattintast}>
      {children}
    </a>
  );
}
