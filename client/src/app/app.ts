import { Component } from '@angular/core';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { Home } from './features/home/home';
import { Products } from './features/products/products';
import { About } from './features/about/about';
import { Contact } from './features/contact/contact';

@Component({
  imports: [Header, Footer, Home, Products, About, Contact],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = 'techstore';
}