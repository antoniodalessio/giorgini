export type IconsId =
  | "arrow-down"
  | "arrow-dx"
  | "arrow-sx"
  | "chirurgia-orale"
  | "chirurgia"
  | "conservativa"
  | "estetica-sorriso"
  | "facebook"
  | "finanziamento"
  | "formazione"
  | "geoloc"
  | "igiene-orale"
  | "impianti-dentali"
  | "instagram"
  | "logo"
  | "mail"
  | "orario"
  | "ortodonzia-invisibile"
  | "paradontologia"
  | "pododanzia"
  | "tecnologia"
  | "telefono";

export type IconsKey =
  | "ArrowDown"
  | "ArrowDx"
  | "ArrowSx"
  | "ChirurgiaOrale"
  | "Chirurgia"
  | "Conservativa"
  | "EsteticaSorriso"
  | "Facebook"
  | "Finanziamento"
  | "Formazione"
  | "Geoloc"
  | "IgieneOrale"
  | "ImpiantiDentali"
  | "Instagram"
  | "Logo"
  | "Mail"
  | "Orario"
  | "OrtodonziaInvisibile"
  | "Paradontologia"
  | "Pododanzia"
  | "Tecnologia"
  | "Telefono";

export enum Icons {
  ArrowDown = "arrow-down",
  ArrowDx = "arrow-dx",
  ArrowSx = "arrow-sx",
  ChirurgiaOrale = "chirurgia-orale",
  Chirurgia = "chirurgia",
  Conservativa = "conservativa",
  EsteticaSorriso = "estetica-sorriso",
  Facebook = "facebook",
  Finanziamento = "finanziamento",
  Formazione = "formazione",
  Geoloc = "geoloc",
  IgieneOrale = "igiene-orale",
  ImpiantiDentali = "impianti-dentali",
  Instagram = "instagram",
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
  [Icons.Facebook]: "61704",
  [Icons.Finanziamento]: "61705",
  [Icons.Formazione]: "61706",
  [Icons.Geoloc]: "61707",
  [Icons.IgieneOrale]: "61708",
  [Icons.ImpiantiDentali]: "61709",
  [Icons.Instagram]: "61710",
  [Icons.Logo]: "61711",
  [Icons.Mail]: "61712",
  [Icons.Orario]: "61713",
  [Icons.OrtodonziaInvisibile]: "61714",
  [Icons.Paradontologia]: "61715",
  [Icons.Pododanzia]: "61716",
  [Icons.Tecnologia]: "61717",
  [Icons.Telefono]: "61718",
};
