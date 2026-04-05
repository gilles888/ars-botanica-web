import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

interface OrderItem {
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Order {
  id: number;
  orderNumber: string;
  userEmail: string;
  items: OrderItem[];
  status: string;
  deliveryAddress: string;
  deliveryZip: string;
  deliveryCity: string;
  deliveryMethod: string;
  deliveryNotes: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  createdAt: string;
  trackingNumber?: string;
  carrier?: string;
  fulfillmentNote?: string;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    ButtonModule, TableModule, DialogModule, DropdownModule,
    ToastModule, TagModule, DividerModule, TooltipModule, InputTextareaModule
  ],
  providers: [MessageService],
  template: `
    <p-toast position="bottom-right"></p-toast>

    <div class="pt-20 min-h-screen bg-cream page-enter">

      <!-- Header -->
      <div class="bg-primary-green text-white py-10">
        <div class="container-custom flex items-center justify-between flex-wrap gap-4">
          <div>
            <p class="text-green-100 text-sm uppercase tracking-widest mb-1">Tableau de bord</p>
            <h1 class="font-heading text-4xl font-bold">Suivi des ventes</h1>
            <p class="text-green-100 mt-1">Bonjour, {{ adminName }}</p>
          </div>
          <a routerLink="/boutique">
            <button pButton label="Voir la boutique" icon="pi pi-external-link"
              class="p-button-outlined p-button-sm"
              style="border-color: white; color: white; border-radius: 2rem;">
            </button>
          </a>
        </div>
      </div>

      <!-- Nav admin -->
      <div class="bg-white border-b border-gray-100">
        <div class="container-custom flex gap-1 py-3">
          <a routerLink="/admin"
            class="px-5 py-2 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
            Produits
          </a>
          <a routerLink="/admin/ventes"
            class="px-5 py-2 rounded-full text-sm font-medium bg-primary-green text-white">
            Ventes
          </a>
        </div>
      </div>

      <!-- Stats -->
      <div class="container-custom py-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <div class="bg-white rounded-2xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-3">
              <p class="text-xs text-gray-400 uppercase tracking-wide">Chiffre d'affaires</p>
              <div class="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center">
                <i class="pi pi-euro text-primary-green text-sm"></i>
              </div>
            </div>
            <p class="text-2xl font-bold text-charcoal">{{ totalRevenue | number:'1.2-2' }}€</p>
            <p class="text-xs text-gray-400 mt-1">Commandes livrées</p>
          </div>

          <div class="bg-white rounded-2xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-3">
              <p class="text-xs text-gray-400 uppercase tracking-wide">Commandes</p>
              <div class="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                <i class="pi pi-shopping-bag text-blue-500 text-sm"></i>
              </div>
            </div>
            <p class="text-2xl font-bold text-charcoal">{{ orders.length }}</p>
            <p class="text-xs text-gray-400 mt-1">Total toutes périodes</p>
          </div>

          <div class="bg-white rounded-2xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-3">
              <p class="text-xs text-gray-400 uppercase tracking-wide">Panier moyen</p>
              <div class="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center">
                <i class="pi pi-chart-line text-purple-500 text-sm"></i>
              </div>
            </div>
            <p class="text-2xl font-bold text-charcoal">{{ avgBasket | number:'1.2-2' }}€</p>
            <p class="text-xs text-gray-400 mt-1">Hors annulées</p>
          </div>

          <div class="bg-white rounded-2xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-3">
              <p class="text-xs text-gray-400 uppercase tracking-wide">En attente</p>
              <div class="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center">
                <i class="pi pi-clock text-orange-400 text-sm"></i>
              </div>
            </div>
            <p class="text-2xl font-bold text-charcoal">{{ pendingCount }}</p>
            <p class="text-xs text-gray-400 mt-1">À traiter</p>
          </div>
        </div>

        <!-- Filtres statut -->
        <div class="bg-white rounded-2xl shadow-sm p-6 mb-5">
          <div class="flex flex-wrap gap-2">
            <button
              *ngFor="let f of statusFilters"
              (click)="activeFilter = f.value"
              class="px-4 py-1.5 rounded-full text-xs font-medium transition-all border"
              [class]="activeFilter === f.value ? f.activeClass : 'border-gray-200 text-gray-500 hover:border-gray-300'">
              {{ f.label }}
              <span class="ml-1 font-bold">{{ countByStatus(f.value) }}</span>
            </button>
          </div>
        </div>

        <!-- Tableau -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 class="font-heading text-xl text-charcoal font-semibold">Commandes</h2>
            <span class="text-sm text-gray-400">{{ filteredOrders.length }} résultat(s)</span>
          </div>

          <p-table
            [value]="filteredOrders"
            [loading]="loading"
            [paginator]="true"
            [rows]="15"
            styleClass="p-datatable-sm"
            responsiveLayout="scroll"
          >
            <ng-template pTemplate="header">
              <tr>
                <th pSortableColumn="orderNumber">N° <p-sortIcon field="orderNumber"></p-sortIcon></th>
                <th>Client</th>
                <th pSortableColumn="createdAt">Date <p-sortIcon field="createdAt"></p-sortIcon></th>
                <th>Articles</th>
                <th pSortableColumn="total">Total <p-sortIcon field="total"></p-sortIcon></th>
                <th>Statut</th>
                <th style="width: 120px">Actions</th>
              </tr>
            </ng-template>

            <ng-template pTemplate="body" let-order>
              <tr>
                <!-- N° commande -->
                <td>
                  <span class="font-mono text-sm font-semibold text-charcoal">{{ order.orderNumber }}</span>
                </td>

                <!-- Client -->
                <td>
                  <p class="text-sm text-charcoal">{{ order.userEmail }}</p>
                  <p class="text-xs text-gray-400">{{ order.deliveryCity }}</p>
                </td>

                <!-- Date -->
                <td>
                  <p class="text-sm text-charcoal">{{ order.createdAt | date:'dd/MM/yyyy' }}</p>
                  <p class="text-xs text-gray-400">{{ order.createdAt | date:'HH:mm' }}</p>
                </td>

                <!-- Articles -->
                <td>
                  <div class="flex items-center gap-1">
                    <div *ngFor="let item of order.items.slice(0, 3)"
                      class="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <img *ngIf="item.productImage" [src]="item.productImage"
                        [alt]="item.productName" class="w-full h-full object-cover" />
                      <div *ngIf="!item.productImage" class="w-full h-full flex items-center justify-center">
                        <i class="pi pi-image text-gray-300 text-xs"></i>
                      </div>
                    </div>
                    <span *ngIf="order.items.length > 3" class="text-xs text-gray-400 ml-1">
                      +{{ order.items.length - 3 }}
                    </span>
                    <span class="text-xs text-gray-400 ml-1">
                      ({{ totalItems(order) }} art.)
                    </span>
                  </div>
                </td>

                <!-- Total -->
                <td>
                  <span class="font-bold text-charcoal">{{ order.total | number:'1.2-2' }}€</span>
                </td>

                <!-- Statut + changement -->
                <td>
                  <p-dropdown
                    [options]="statusOptions"
                    [(ngModel)]="order.status"
                    optionLabel="label"
                    optionValue="value"
                    (onChange)="updateStatus(order, $event.value)"
                    styleClass="status-dropdown text-xs"
                    appendTo="body"
                    [style]="getStatusStyle(order.status)">
                    <ng-template pTemplate="selectedItem">
                      <span class="text-xs font-medium">{{ getStatusLabel(order.status) }}</span>
                    </ng-template>
                    <ng-template pTemplate="item" let-opt>
                      <span class="text-xs">{{ opt.label }}</span>
                    </ng-template>
                  </p-dropdown>
                </td>

                <!-- Actions -->
                <td>
                  <button pButton icon="pi pi-eye"
                    class="p-button-rounded p-button-text p-button-sm"
                    style="color: #5a8a4a;"
                    pTooltip="Voir le détail"
                    (click)="openDetail(order)">
                  </button>
                </td>
              </tr>
            </ng-template>

            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="7" class="text-center py-12 text-gray-400">
                  <i class="pi pi-shopping-bag text-4xl block mb-3"></i>
                  Aucune commande
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </div>

    <!-- ── Dialog Détail Commande ─────────────────────────────── -->
    <p-dialog
      [(visible)]="detailVisible"
      [header]="'Commande ' + (selectedOrder?.orderNumber || '')"
      [modal]="true"
      [style]="{ width: '620px' }"
      [draggable]="false"
    >
      <div *ngIf="selectedOrder" class="space-y-5 py-2">

        <!-- Infos client -->
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Client</p>
            <p class="font-medium text-charcoal">{{ selectedOrder.userEmail }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Date</p>
            <p class="font-medium text-charcoal">{{ selectedOrder.createdAt | date:'dd/MM/yyyy à HH:mm' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Adresse</p>
            <p class="font-medium text-charcoal">
              {{ selectedOrder.deliveryAddress }}<br>
              {{ selectedOrder.deliveryZip }} {{ selectedOrder.deliveryCity }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Livraison</p>
            <p class="font-medium text-charcoal capitalize">{{ selectedOrder.deliveryMethod }}</p>
            <p *ngIf="selectedOrder.deliveryNotes" class="text-xs text-gray-400 mt-0.5">
              {{ selectedOrder.deliveryNotes }}
            </p>
          </div>
          <!-- Infos d'expédition / retrait renseignées lors du fulfillment -->
          <div *ngIf="selectedOrder?.trackingNumber || selectedOrder?.carrier || selectedOrder?.fulfillmentNote"
            class="col-span-2">
            <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Expédition / Retrait</p>
            <p *ngIf="selectedOrder?.carrier || selectedOrder?.trackingNumber" class="font-medium text-charcoal">
              {{ selectedOrder?.carrier }} <span *ngIf="selectedOrder?.trackingNumber">— Suivi : {{ selectedOrder?.trackingNumber }}</span>
            </p>
            <p *ngIf="selectedOrder?.fulfillmentNote" class="text-sm text-gray-500 mt-0.5 whitespace-pre-line">{{ selectedOrder?.fulfillmentNote }}</p>
          </div>
        </div>

        <p-divider></p-divider>

        <!-- Articles -->
        <div>
          <p class="text-xs text-gray-400 uppercase tracking-wide mb-3">Articles commandés</p>
          <div class="space-y-3">
            <div *ngFor="let item of selectedOrder.items"
              class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                <img *ngIf="item.productImage" [src]="item.productImage"
                  [alt]="item.productName" class="w-full h-full object-cover" />
                <div *ngIf="!item.productImage" class="w-full h-full flex items-center justify-center">
                  <i class="pi pi-image text-gray-300"></i>
                </div>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-charcoal">{{ item.productName }}</p>
                <p class="text-xs text-gray-400">{{ item.quantity }} × {{ item.unitPrice | number:'1.2-2' }}€</p>
              </div>
              <span class="text-sm font-bold text-charcoal">{{ item.subtotal | number:'1.2-2' }}€</span>
            </div>
          </div>
        </div>

        <p-divider></p-divider>

        <!-- Récap financier -->
        <div class="space-y-2 text-sm">
          <div class="flex justify-between text-gray-500">
            <span>Sous-total</span>
            <span>{{ selectedOrder.subtotal | number:'1.2-2' }}€</span>
          </div>
          <div class="flex justify-between text-gray-500">
            <span>Livraison</span>
            <span *ngIf="selectedOrder.shippingCost > 0">{{ selectedOrder.shippingCost | number:'1.2-2' }}€</span>
            <span *ngIf="selectedOrder.shippingCost === 0" class="text-primary-green font-medium">Offerte</span>
          </div>
          <div class="flex justify-between font-bold text-charcoal pt-2 border-t border-gray-100">
            <span>Total</span>
            <span class="text-lg text-primary-green">{{ selectedOrder.total | number:'1.2-2' }}€</span>
          </div>
        </div>
      </div>
    </p-dialog>

    <!-- ── Dialog Fulfillment ─────────────────────────────── -->
    <p-dialog
      [(visible)]="fulfillmentVisible"
      [header]="fulfillmentPendingStatus === 'CONFIRMED' ? 'Confirmer la commande' : 'Marquer comme expédiée'"
      [modal]="true"
      [style]="{ width: '500px' }"
      [draggable]="false"
      [closable]="false"
    >
      <div *ngIf="fulfillmentOrder" class="space-y-4 py-2">

        <div class="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
          <i class="pi pi-info-circle text-blue-500 mt-0.5 flex-shrink-0"></i>
          <div>
            <p class="text-sm font-medium text-charcoal">Commande {{ fulfillmentOrder.orderNumber }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ fulfillmentOrder.userEmail }} — {{ fulfillmentOrder.deliveryMethod === 'pickup' ? 'Retrait en magasin' : 'Livraison à domicile' }}</p>
          </div>
        </div>

        <!-- Champs expédition (surtout utiles pour SHIPPED) -->
        <div *ngIf="fulfillmentPendingStatus === 'SHIPPED'" class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-charcoal">Transporteur</label>
            <input pInputText [(ngModel)]="fulfillment.carrier"
              placeholder="ex: bpost, DHL, Colissimo"
              class="rounded-xl w-full text-sm" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-charcoal">Numéro de suivi</label>
            <input pInputText [(ngModel)]="fulfillment.trackingNumber"
              placeholder="ex: 123456789BE"
              class="rounded-xl w-full text-sm" />
          </div>
        </div>

        <!-- Note (disponible pour CONFIRMED et SHIPPED) -->
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium text-charcoal">
            {{ fulfillmentPendingStatus === 'CONFIRMED' ? 'Instructions de retrait / informations de livraison' : 'Note pour le client' }}
          </label>
          <textarea pInputTextarea
            [(ngModel)]="fulfillment.fulfillmentNote"
            [placeholder]="fulfillmentPendingStatus === 'CONFIRMED'
              ? 'Ex : Votre commande est prête, venez la retirer du lundi au samedi de 9h à 18h...'
              : 'Ex : Votre colis a été remis à bpost ce jour...'"
            rows="4"
            class="rounded-xl w-full text-sm">
          </textarea>
        </div>

        <p class="text-xs text-gray-400">Ces informations seront visibles par le client dans son historique de commandes.</p>
      </div>

      <ng-template pTemplate="footer">
        <button pButton label="Annuler" icon="pi pi-times"
          class="p-button-text" style="color: #5a8a4a;"
          (click)="cancelFulfillment()">
        </button>
        <button pButton
          [label]="fulfillmentPendingStatus === 'CONFIRMED' ? 'Confirmer la commande' : 'Valider expédition'"
          [icon]="fulfillmentPendingStatus === 'CONFIRMED' ? 'pi pi-check' : 'pi pi-send'"
          (click)="confirmFulfillment()"
          style="background: #5a8a4a; border: none; border-radius: 2rem;">
        </button>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    :host ::ng-deep .status-dropdown .p-dropdown {
      border-radius: 2rem;
      border: none;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
    }
    :host ::ng-deep .status-dropdown .p-dropdown:not(.p-disabled):hover {
      border: none;
    }
  `]
})
export class SalesComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  activeFilter = 'ALL';
  detailVisible = false;
  selectedOrder: Order | null = null;
  adminName = '';

  /* ── Fulfillment dialog ─── */
  fulfillmentVisible = false;
  fulfillmentOrder: Order | null = null;
  fulfillmentPendingStatus = '';
  fulfillment = { trackingNumber: '', carrier: '', fulfillmentNote: '' };

  statusFilters = [
    { label: 'Toutes', value: 'ALL', activeClass: 'border-charcoal bg-charcoal text-white' },
    { label: 'En attente', value: 'PENDING', activeClass: 'border-orange-400 bg-orange-50 text-orange-600' },
    { label: 'Confirmées', value: 'CONFIRMED', activeClass: 'border-blue-400 bg-blue-50 text-blue-600' },
    { label: 'En préparation', value: 'PREPARING', activeClass: 'border-purple-400 bg-purple-50 text-purple-600' },
    { label: 'Expédiées', value: 'SHIPPED', activeClass: 'border-indigo-400 bg-indigo-50 text-indigo-600' },
    { label: 'Livrées', value: 'DELIVERED', activeClass: 'border-green-500 bg-green-50 text-green-700' },
    { label: 'Annulées', value: 'CANCELLED', activeClass: 'border-gray-400 bg-gray-100 text-gray-500' },
  ];

  statusOptions = [
    { label: 'En attente', value: 'PENDING' },
    { label: 'Confirmée', value: 'CONFIRMED' },
    { label: 'En préparation', value: 'PREPARING' },
    { label: 'Expédiée', value: 'SHIPPED' },
    { label: 'Livrée', value: 'DELIVERED' },
    { label: 'Annulée', value: 'CANCELLED' },
  ];

  get filteredOrders(): Order[] {
    if (this.activeFilter === 'ALL') return this.orders;
    return this.orders.filter(o => o.status === this.activeFilter);
  }

  get totalRevenue(): number {
    return this.orders
      .filter(o => o.status === 'DELIVERED')
      .reduce((sum, o) => sum + o.total, 0);
  }

  get avgBasket(): number {
    const active = this.orders.filter(o => o.status !== 'CANCELLED');
    if (!active.length) return 0;
    return active.reduce((sum, o) => sum + o.total, 0) / active.length;
  }

  get pendingCount(): number {
    return this.orders.filter(o => o.status === 'PENDING').length;
  }

  countByStatus(status: string): number {
    if (status === 'ALL') return this.orders.length;
    return this.orders.filter(o => o.status === status).length;
  }

  totalItems(order: Order): number {
    return order.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  getStatusLabel(status: string): string {
    return this.statusOptions.find(s => s.value === status)?.label ?? status;
  }

  getStatusStyle(status: string): Record<string, string> {
    const styles: Record<string, Record<string, string>> = {
      PENDING:    { background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa', borderRadius: '2rem' },
      CONFIRMED:  { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '2rem' },
      PREPARING:  { background: '#faf5ff', color: '#7c3aed', border: '1px solid #e9d5ff', borderRadius: '2rem' },
      SHIPPED:    { background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe', borderRadius: '2rem' },
      DELIVERED:  { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: '2rem' },
      CANCELLED:  { background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb', borderRadius: '2rem' },
    };
    return styles[status] ?? {};
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const user = this.authService.currentUser$.value;
    this.adminName = user ? `${user.firstName} ${user.lastName}` : '';
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.http.get<Order[]>(`${environment.apiUrl}/orders`).subscribe({
      next: (data) => { this.orders = data; this.loading = false; },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger les commandes.' });
      }
    });
  }

  updateStatus(order: Order, newStatus: string) {
    // Pour CONFIRMED et SHIPPED, on ouvre le dialog de fulfillment avant de valider
    if (newStatus === 'CONFIRMED' || newStatus === 'SHIPPED') {
      this.fulfillmentOrder = order;
      this.fulfillmentPendingStatus = newStatus;
      this.fulfillment = { trackingNumber: '', carrier: '', fulfillmentNote: '' };
      this.fulfillmentVisible = true;
      return;
    }
    // Pour les autres statuts, mise à jour directe via l'API
    const params = new HttpParams().set('status', newStatus);
    this.http.patch<Order>(`${environment.apiUrl}/orders/${order.id}/status`, null, { params }).subscribe({
      next: (updated) => {
        order.status = updated.status;
        this.messageService.add({
          severity: 'success',
          summary: 'Statut mis à jour',
          detail: `Commande ${order.orderNumber} → ${this.getStatusLabel(updated.status)}`
        });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de mettre à jour le statut.' });
      }
    });
  }

  // Valide le fulfillment et envoie les données à l'API
  confirmFulfillment() {
    if (!this.fulfillmentOrder) return;
    const order = this.fulfillmentOrder;
    const body = {
      status: this.fulfillmentPendingStatus,
      trackingNumber: this.fulfillment.trackingNumber || null,
      carrier: this.fulfillment.carrier || null,
      fulfillmentNote: this.fulfillment.fulfillmentNote || null
    };
    this.http.patch<Order>(`${environment.apiUrl}/orders/${order.id}/fulfillment`, body).subscribe({
      next: (updated) => {
        // Mise à jour locale de la commande avec les données retournées
        order.status = updated.status;
        order.trackingNumber = updated.trackingNumber;
        order.carrier = updated.carrier;
        order.fulfillmentNote = updated.fulfillmentNote;
        this.fulfillmentVisible = false;
        this.fulfillmentOrder = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Commande mise à jour',
          detail: `${order.orderNumber} → ${this.getStatusLabel(updated.status)}`
        });
      },
      error: () => {
        // Le dropdown reviendra au statut courant lors de la fermeture
        this.fulfillmentVisible = false;
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de mettre à jour la commande.' });
      }
    });
  }

  // Annule le dialog de fulfillment et rétablit l'ancien statut dans le dropdown
  cancelFulfillment() {
    if (this.fulfillmentOrder) {
      // Forcer Angular à détecter le changement en réassignant le statut courant
      const currentStatus = this.fulfillmentOrder.status;
      this.fulfillmentOrder.status = '';
      setTimeout(() => {
        if (this.fulfillmentOrder) {
          this.fulfillmentOrder.status = currentStatus;
        }
      }, 0);
    }
    this.fulfillmentVisible = false;
    this.fulfillmentOrder = null;
  }

  openDetail(order: Order) {
    this.selectedOrder = order;
    this.detailVisible = true;
  }
}
