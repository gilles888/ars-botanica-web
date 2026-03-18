import { Product } from './product.model';
import { ProductVariant } from './product.model';

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}
