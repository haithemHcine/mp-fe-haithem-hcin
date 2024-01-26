import { Produit } from "./produit";

export class Categorie {
    id: number | undefined;
    code: string | undefined;
    libelle: string | undefined;
    produits: Produit[] = [];
  }
  