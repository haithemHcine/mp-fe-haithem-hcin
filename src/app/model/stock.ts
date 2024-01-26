import { Produit } from "./produit";

export class Stock {
    id: number | undefined;
    code: string | undefined;
    adresse: string | undefined;
    produits: Produit[] = [];
    //responsable: Responsable | undefined;
  }
