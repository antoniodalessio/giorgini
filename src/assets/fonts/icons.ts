export enum Icons {
  ArrowDown = "arrow-down",
  ArrowDx = "arrow-dx",
  ArrowSx = "arrow-sx",
  ChirurgiaOrale = "chirurgia-orale",
  Chirurgia = "chirurgia",
  Conservativa = "conservativa",
  EsteticaSorriso = "estetica-sorriso",
  Finanziamento = "finanziamento",
  Formazione = "formazione",
  Geoloc = "geoloc",
  IgieneOrale = "igiene-orale",
  ImpiantiDentali = "impianti-dentali",
  Logo = "logo",
  Mail = "mail",
  Orario = "orario",
  OrtodonziaInvisibile = "ortodonzia-invisibile",
  Paradontologia = "paradontologia",
  Pododanzia = "pododanzia",
  Tecnologia = "tecnologia",
  Telefono = "telefono",
}

export const ICONS_CODEPOINTS: { [key in Icons]: string } = {
  [Icons.ArrowDown]: "61697",
  [Icons.ArrowDx]: "61698",
  [Icons.ArrowSx]: "61699",
  [Icons.ChirurgiaOrale]: "61700",
  [Icons.Chirurgia]: "61701",
  [Icons.Conservativa]: "61702",
  [Icons.EsteticaSorriso]: "61703",
  [Icons.Finanziamento]: "61704",
  [Icons.Formazione]: "61705",
  [Icons.Geoloc]: "61706",
  [Icons.IgieneOrale]: "61707",
  [Icons.ImpiantiDentali]: "61708",
  [Icons.Logo]: "61709",
  [Icons.Mail]: "61710",
  [Icons.Orario]: "61711",
  [Icons.OrtodonziaInvisibile]: "61712",
  [Icons.Paradontologia]: "61713",
  [Icons.Pododanzia]: "61714",
  [Icons.Tecnologia]: "61715",
  [Icons.Telefono]: "61716",
};

export type IconsId =
  | "arrow-down"
  | "arrow-dx"
  | "arrow-sx"
  | "chirurgia-orale"
  | "chirurgia"
  | "conservativa"
  | "estetica-sorriso"
  | "finanziamento"
  | "formazione"
  | "geoloc"
  | "igiene-orale"
  | "impianti-dentali"
  | "logo"
  | "mail"
  | "orario"
  | "ortodonzia-invisibile"
  | "paradontologia"
  | "pododanzia"
  | "tecnologia"
  | "telefono";
