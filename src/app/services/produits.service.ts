import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Produit } from '../model/produit';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProduitsService {

  // Url du service web de gestion de produits
  urlHote = "http://localhost:3333/produits/";

  constructor(private http: HttpClient) { }

  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.urlHote);
  }

  deleteProduit(idP: number | undefined): Observable<void> {
    return this.http.delete<void>(this.urlHote + idP);
  }

  addProduit(nouveau: Produit): Observable<Produit> {
    return this.http.post<Produit>(this.urlHote, nouveau);
  }

  updateProduit(idP: number | undefined, nouveau: Produit): Observable<Produit> {
    // return this.http.put<Produit>(this.urlHote + idP, nouveau);
    return this.http.put<Produit>(this.urlHote, nouveau);
  }
}
