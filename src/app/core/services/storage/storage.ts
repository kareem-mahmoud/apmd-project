import { Inject, Injectable, PLATFORM_ID, signal, effect, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService { // Renamed from Storage to StorageService
  private readonly FAVORITES_KEY = 'favorites';
  private readonly CART_KEY = 'cart';

  readonly favoriteIds = signal<number[]>([]);
  readonly cartItemIds = signal<number[]>([]);

  readonly favoritesCount = computed(() => this.favoriteIds().length);
  readonly cartCount = computed(() => this.cartItemIds().length);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.favoriteIds.set(this.getItems(this.FAVORITES_KEY));
      this.cartItemIds.set(this.getItems(this.CART_KEY));

      effect(() => this.setItems(this.FAVORITES_KEY, this.favoriteIds()));
      effect(() => this.setItems(this.CART_KEY, this.cartItemIds()));
    }
  }

  private getItems(key: string): number[] {
    if (!isPlatformBrowser(this.platformId)) { return []; }
    try {
      const items = localStorage.getItem(key);
      return items ? JSON.parse(items) : [];
    } catch (e) {
      console.error(`Error reading from localStorage key "${key}"`, e);
      return [];
    }
  }

  private setItems(key: string, items: number[]): void {
    if (!isPlatformBrowser(this.platformId)) { return; }
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (e) {
      console.error(`Error writing to localStorage key "${key}"`, e);
    }
  }

  isFavorite(productId: number): boolean {
    return this.favoriteIds().includes(productId);
  }

  addFavorite(productId: number): void {
    this.favoriteIds.update(ids => {
      if (ids.includes(productId)) { return ids; }
      return [...ids, productId];
    });
  }

  removeFavorite(productId: number): void {
    this.favoriteIds.update(ids => ids.filter(id => id !== productId));
  }

  isInCart(productId: number): boolean {
    return this.cartItemIds().includes(productId);
  }

  addToCart(productId: number): void {
    this.cartItemIds.update(ids => {
      if (ids.includes(productId)) { return ids; }
      return [...ids, productId];
    });
  }

  removeFromCart(productId: number): void {
    this.cartItemIds.update(ids => ids.filter(id => id !== productId));
  }
}