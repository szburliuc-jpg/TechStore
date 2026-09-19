import { Component, signal } from '@angular/core';
import { Produs } from '../../core/models/produs';

@Component({
  imports: [],
  selector: 'app-products',
  styleUrl: './products.scss',
  templateUrl: './products.html',
})
export class Products {
  protected readonly produse = signal<Produs[]>([
    {
      id: 1,
      nume: 'Căști Wireless',
      descriere: 'Sunet de calitate și confort pentru fiecare zi.',
      pret: 899,
      imagine: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
      alt: 'Căști wireless',
    },
    {
      id: 2,
      nume: 'Smartwatch',
      descriere: 'Monitorizează-ți activitatea și rămâi conectat.',
      pret: 1299,
      imagine: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80',
      alt: 'Smartwatch',
    },
    {
      id: 3,
      nume: 'Laptop',
      descriere: 'Performanță bună pentru studii și lucru.',
      pret: 14999,
      imagine: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80',
      alt: 'Laptop',
    },
  ]);
}