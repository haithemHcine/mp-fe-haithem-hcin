import { Component, OnInit, ViewChild } from '@angular/core';
import { Produit } from '../model/produit';
import { NgForm } from '@angular/forms';
import { ProduitsService } from '../services/produits.service';
import { CategoriesService } from '../services/categories.service';
import { Categorie } from '../model/categorie';


import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {



  produits: any;
  // produits: Array<Produit> = [];
  produitCourant: Produit = new Produit();
  afficherFormulaireEdition = false;
  categories: Categorie[] = [];

  // Variables pour les filtres
  enPromotionFiltre: string | undefined;
  seuilPrixInf: number | undefined;
  seuilPrixSup: number | undefined;
  categorieFiltre: string | undefined;
  // dateFiltre: Date | undefined;
  anneeFiltre: number | undefined;





  columns: string[] = ['id', 'code', 'designation', 'prix', 'quantite', 'dateAchat', 'enPromotion', 'categorie'];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private produitsService: ProduitsService,
    private categoriesService: CategoriesService
  ) { }
  ngOnInit(): void {

    // this.produits.filterPredicate = (data: any, filter: string) => true;

    this.consulterProduits();

    this.categoriesService.getCategories()
      .subscribe({
        next: categories => {
          this.categories = categories;
        },
        error: err => {
          console.log("Erreur lors de la récupération des catégories", err);
        }
      });

  }

  private consulterProduits(): void {
    console.log("Récupération de la liste des produits");
    this.produitsService.getProduits()
      .subscribe(
        (data: Produit[]) => {
          this.produits = new MatTableDataSource<any>(data);
          this.produits.paginator = this.paginator;
          // Ajoutez un console.log ici pour vérifier si le paginator est correctement attaché à la MatTableDataSource
          console.log('MatTableDataSource Paginator:', this.produits.paginator);

          this.produits.sort = this.sort;
        }
        // {next: data => {console.log("Succès GET"); this.produits = data;},
        // error: err => {console.log("Erreur GET", err);}}
      );
  }

  supprimerProduit(produit: Produit): void {
    const reponse: boolean = confirm("Voulez-vous supprimer le produit :" + produit.designation + " ?");
    if (reponse) {
      this.supprimerProduitHttp(produit);
    } else {
      console.log("Suppression annulée...");
    }
  }

  private supprimerProduitHttp(produit: Produit): void {
    this.produitsService.deleteProduit(produit.id)
      .subscribe({
        next: () => {
          console.log("Succès DELETE");
          this.supprimerProduitLocal(produit);
        },
        error: err => {
          console.log("Erreur DELETE", err);
        }
      });
  }

  private supprimerProduitLocal(produit: Produit): void {
    const index: number = this.produits.indexOf(produit);
    if (index !== -1) {
      this.produits.splice(index, 1);
    }
  }

  editerProduit(produit: Produit): void {
    this.afficherFormulaireEdition = true; // Afficher le formulaire lors de l'édition
    this.produitCourant = { ...produit };
    // Faire défiler la page vers le haut
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });

  }

  validerFormulaire(form: NgForm): void {
    console.log(form.value);
    this.metreAJourProduit(form.value, this.produitCourant);
    this.afficherFormulaireEdition = false;
    //window.location.reload(); // Rechargement de la page pour mettre à jour l'affichage
  }

  private metreAJourProduit(nouveau: Produit, ancien: Produit): void {
    const reponse: boolean = confirm("Produit existant. Confirmez-vous la mise à jour de :" + ancien.designation + " ?");
    if (reponse) {
      this.produitsService.updateProduit(nouveau.id, nouveau)
        .subscribe({
          next: updatedProduit => {
            console.log("Succès PUT");


            this.metreAJourProduitLocal(ancien, updatedProduit);
          },
          error: err => {
            console.log("Erreur PUT", err);
          }
        });
    } else {
      console.log("Mise à jour annulée");
    }
  }

  // private metreAJourProduitLocal(ancien: Produit, updatedProduit: Produit): void {
  //   const index: number = this.produits.indexOf(ancien);
  //   if (index !== -1) {
  //     this.produits[index] = updatedProduit;
  //   }
  // }
  private metreAJourProduitLocal(ancien: Produit, updatedProduit: Produit): void {
    // Mettre à jour le tableau des produits
    const index: number = this.produits.data.indexOf(ancien);
    if (index !== -1) {
      this.produits.data[index] = updatedProduit;
      // Mettre à jour la source de données
      this.produits._updateChangeSubscription();
    }
  }




  annulerEdition() {
    this.afficherFormulaireEdition = false;
  }


  filter(event: Event) {
    const filter = (event.target as HTMLInputElement).value;
    this.produits.filter = filter.trim().toLowerCase();
  }

  // Nouvelle fonction de filtre avec les filtres supplémentaires
  appliquerFiltres() {
    const filtres: ((data: any, filter: string) => boolean)[] = [];

    if (this.categorieFiltre !== undefined && this.categorieFiltre !== "" && this.categorieFiltre !== "Toutes") {
      filtres.push((data: any, filter: string) => data.categorie?.libelle === this.categorieFiltre);
      console.log("filtre categorie", this.produits);
    }

    if (this.anneeFiltre !== undefined) {
      filtres.push((data: any, filter: string) => {
        const dateAchat = new Date(data.dateAchat);
        return dateAchat.getFullYear() === this.anneeFiltre;
      });
      console.log("Filtre par année", this.produits);
    }

    if (this.enPromotionFiltre !== undefined && this.enPromotionFiltre !== "tous") {
      filtres.push((data: any, filter: string) => {
        if (this.enPromotionFiltre == 'oui') {
          return data.enPromotion === true;
        } else {
          return data.enPromotion === false;
        }
      });
      console.log("filtre promo", this.produits);
    }

    if (this.seuilPrixInf !== undefined && this.seuilPrixInf !== null) {
      filtres.push((data: any, filter: string) => data.prix >= this.seuilPrixInf!);
      console.log("filtre prix inf", this.produits);
    }

    if (this.seuilPrixSup !== undefined && this.seuilPrixSup !== null) {
      filtres.push((data: any, filter: string) => data.prix <= this.seuilPrixSup!);
      console.log("filtre prix sup", this.produits);
      console.log("filtre prix sup", this.seuilPrixSup);
    }

    if (filtres.length > 0) {
      // Appliquer les filtres
      this.produits.filterPredicate = (data: any, filter: string) => {
        return filtres.every((filtre) => filtre(data, filter));
      };

      this.produits.filter = Math.random().toString(); // Forcer l'actualisation du filtre
      console.log("filtre total", this.produits);
    } else {
      // Aucun champ de filtre renseigné, peut-être afficher un message ou ne rien faire
      console.log("Aucun filtre renseigné.");
      this.afficherTout();
    }
  }

  afficherTout() {
    window.location.reload();
  }

}
