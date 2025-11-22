export interface Character {
  id: string;
  name: string;
  vocation: string;
  level: number | string; // nível vem como string hoje; pode normalizar depois
  userId?: string;
}
