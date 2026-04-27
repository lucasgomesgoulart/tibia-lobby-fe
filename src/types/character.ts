export interface Character {
  id: string;
  name: string;
  serverType: "GLOBAL" | "OTSERVER";
  vocation: string;
  level: number | string | null; // nível vem como string hoje; pode normalizar depois
  userId?: string;
  world?: {
    id?: string;
    name: string;
    isGlobal?: boolean;
  };
  otServer?: {
    id?: string;
    name: string;
    worlds?: { id?: string; name: string }[];
  };
}
