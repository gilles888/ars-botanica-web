import { Injectable, computed, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Product, ProductVariant } from '../models/product.model';

const STORAGE_KEY = 'bloom_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = new BehaviorSubject<CartItem[]>(this.loadFromStorage());

  readonly items$ = this._items.asObservable();

  // Signals for reactive use in templates
  private _itemsSignal = signal<CartItem[]>(this.loadFromStorage());

  readonly cartCount = computed(() =>
    this._itemsSignal().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly cartTotal = computed(() =>
    this._itemsSignal().reduce((sum, item) => sum + (item.variant?.price ?? 0) * item.quantity, 0)
  );

  readonly cartItems = this._itemsSignal.asReadonly();

  addItem(product: Product, variant: ProductVariant, quantity = 1): void {
    const current = this._items.value;
    const existing = current.find(
      i => i.product.id === product.id && i.variant.id === variant.id
    );

    let updated: CartItem[];
    if (existing) {
      updated = current.map(i =>
        i.product.id === product.id && i.variant.id === variant.id
          ? { ...i, quantity: i.quantity + quantity }
          : i
      );
    } else {
      updated = [...current, { product, variant, quantity }];
    }
    this.setState(updated);
  }

  removeItem(productId: number, variantId: number): void {
    this.setState(
      this._items.value.filter(
        i => !(i.product.id === productId && i.variant.id === variantId)
      )
    );
  }

  updateQuantity(productId: number, variantId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId, variantId);
      return;
    }
    this.setState(
      this._items.value.map(i =>
        i.product.id === productId && i.variant.id === variantId
          ? { ...i, quantity }
          : i
      )
    );
  }

  clearCart(): void {
    this.setState([]);
  }

  getSubtotal(): number {
    return this.cartTotal();
  }

  getShipping(): number {
    return this.cartTotal() >= 80 ? 0 : 6.9;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShipping();
  }

  private setState(items: CartItem[]): void {
    this._items.next(items);
    this._itemsSignal.set(items);
    this.saveToStorage(items);
  }

  private saveToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch { /* ignore */ }
  }

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const items: CartItem[] = raw ? JSON.parse(raw) : [];
      return items.filter(i => i?.product && i?.variant?.price != null);
    } catch {
      return [];
    }
  }
}
