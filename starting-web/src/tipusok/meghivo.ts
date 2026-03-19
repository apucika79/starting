export type MeghivoAdat = {
  id: string;
  email: string;
  szerepkor: 'szuperadmin' | 'ceg_admin' | 'terulet_vezeto' | 'dolgozo';
  cegId: string;
  cegNev: string;
  lejarat: string;
};
