import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-gestion-produits';
  actions: Array<any> = [
    { titre: "Accueil", route: "/accueil", icon: "house-door" },
    { titre: "Liste des produits", route: "/produits", icon: "list" },
    { titre: "Ajouter Produit", route: "/ajouterProduit", icon: "plus" }
  ];

  actionCourant: any;

  setActionCourant(a: any) {
    this.actionCourant = a;
  }
}
