import { Categorie } from "./categorie";
import { Stock } from "./stock";

export class Produit {
    id: number | undefined;
    code: string | undefined;
    designation: string | undefined;
    prix: number | undefined;
    quantite: number | undefined;
    dateAchat: Date = new Date();
    enPromotion: boolean = false;
    categorie: Categorie | undefined;
    stocks: Stock[] = [];
}

