import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { Product, getStartingPrice } from '../../core/models/product.model';
import { environment } from '../../../environments/environment';

interface ProductForm {
  id?: number;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  /** Prix de la variante PETIT (optionnel) */
  prixPetit: number | null;
  /** Prix de la variante MOYEN (optionnel) */
  prixMoyen: number | null;
  /** Prix de la variante GRAND (optionnel) */
  prixGrand: number | null;
  category: string;
  imagesRaw: string;
  tagsRaw: string;
  inStock: boolean;
  isNew: boolean;
  isFeatured: boolean;
  isSeasonal: boolean;
  // Champs de traduction EN / NL
  nameEn: string;
  nameNl: string;
  shortDescriptionEn: string;
  shortDescriptionNl: string;
  descriptionEn: string;
  descriptionNl: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    ButtonModule, TableModule, DialogModule, ConfirmDialogModule,
    InputTextModule, InputTextareaModule, DropdownModule, CheckboxModule,
    ToastModule, TagModule, DividerModule, ProgressSpinnerModule, TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast position="bottom-right"></p-toast>
    <p-confirmDialog
      header="Confirmer la suppression"
      icon="pi pi-exclamation-triangle"
      acceptLabel="Supprimer"
      rejectLabel="Annuler"
      acceptButtonStyleClass="p-button-danger"
    ></p-confirmDialog>

    <div class="pt-20 min-h-screen bg-cream page-enter">

      <!-- Header -->
      <div class="bg-primary-green text-white py-10">
        <div class="container-custom flex items-center justify-between flex-wrap gap-4">
          <div>
            <p class="text-green-100 text-sm uppercase tracking-widest mb-1">Tableau de bord</p>
            <h1 class="font-heading text-4xl font-bold">Administration</h1>
            <p class="text-green-100 mt-1">Bonjour, {{ adminName }}</p>
          </div>
          <div class="flex items-center gap-3">
            <a routerLink="/boutique">
              <button pButton label="Voir la boutique" icon="pi pi-external-link"
                class="p-button-outlined p-button-sm"
                style="border-color: white; color: white; border-radius: 2rem;">
              </button>
            </a>
            <button pButton label="Ajouter un produit" icon="pi pi-plus"
              (click)="openAdd()"
              style="background: white; color: #5a8a4a; border: none; border-radius: 2rem; font-weight: 600;">
            </button>
          </div>
        </div>
      </div>

      <!-- Nav admin -->
      <div class="bg-white border-b border-gray-100">
        <div class="container-custom flex gap-1 py-3">
          <a routerLink="/admin"
            class="px-5 py-2 rounded-full text-sm font-medium bg-primary-green text-white">
            Produits
          </a>
          <a routerLink="/admin/ventes"
            class="px-5 py-2 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
            Ventes
          </a>
        </div>
      </div>

      <!-- Stats bar -->
      <div class="bg-white border-b border-gray-100">
        <div class="container-custom py-5 flex flex-wrap gap-8">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <i class="pi pi-box text-primary-green"></i>
            </div>
            <div>
              <p class="text-xs text-gray-400 uppercase tracking-wide">Produits</p>
              <p class="text-xl font-bold text-charcoal">{{ products.length }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <i class="pi pi-check-circle text-primary-green"></i>
            </div>
            <div>
              <p class="text-xs text-gray-400 uppercase tracking-wide">En stock</p>
              <p class="text-xl font-bold text-charcoal">{{ inStockCount }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <i class="pi pi-times-circle text-red-400"></i>
            </div>
            <div>
              <p class="text-xs text-gray-400 uppercase tracking-wide">Rupture</p>
              <p class="text-xl font-bold text-charcoal">{{ products.length - inStockCount }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
              <i class="pi pi-star text-rose-400"></i>
            </div>
            <div>
              <p class="text-xs text-gray-400 uppercase tracking-wide">Mis en avant</p>
              <p class="text-xl font-bold text-charcoal">{{ featuredCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="container-custom py-10">
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 class="font-heading text-xl text-charcoal font-semibold">Catalogue produits</h2>
            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-400">{{ products.length }} produit(s)</span>
              <button pButton label="Ajouter un produit" icon="pi pi-plus"
                (click)="openAdd()"
                class="p-button-sm"
                style="background: #5a8a4a; border: none; border-radius: 2rem; font-weight: 600;">
              </button>
            </div>
          </div>

          <p-table
            [value]="products"
            [loading]="loading"
            [paginator]="true"
            [rows]="10"
            [rowsPerPageOptions]="[10, 25, 50]"
            styleClass="p-datatable-sm"
            responsiveLayout="scroll"
          >
            <ng-template pTemplate="header">
              <tr>
                <th style="width: 60px">Image</th>
                <th pSortableColumn="name">Nom <p-sortIcon field="name"></p-sortIcon></th>
                <th>Catégorie</th>
                <th pSortableColumn="price">Prix <p-sortIcon field="price"></p-sortIcon></th>
                <th>Stock</th>
                <th>Nouveau</th>
                <th>Mis en avant</th>
                <th style="width: 120px">Actions</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-product>
              <tr>
                <!-- Image -->
                <td>
                  <img *ngIf="product.images?.[0]" [src]="product.images[0]" [alt]="product.name"
                    class="w-10 h-10 rounded-lg object-cover" />
                  <div *ngIf="!product.images?.[0]"
                    class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <i class="pi pi-image text-gray-300"></i>
                  </div>
                </td>
                <!-- Nom -->
                <td>
                  <p class="font-medium text-charcoal text-sm">{{ product.name }}</p>
                  <p class="text-xs text-gray-400">{{ product.slug }}</p>
                </td>
                <!-- Catégorie -->
                <td>
                  <p-tag [value]="product.category" severity="info"
                    styleClass="text-xs"></p-tag>
                </td>
                <!-- Prix -->
                <td>
                  <span class="font-semibold text-charcoal">à partir de {{ getStartingPrice(product) }}€</span>
                </td>
                <!-- Stock -->
                <td>
                  <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                    [class.bg-green-100]="product.inStock"
                    [class.text-green-700]="product.inStock"
                    [class.bg-red-100]="!product.inStock"
                    [class.text-red-600]="!product.inStock">
                    <i class="pi text-xs" [class.pi-check]="product.inStock" [class.pi-times]="!product.inStock"></i>
                    {{ product.inStock ? 'En stock' : 'Rupture' }}
                  </span>
                </td>
                <!-- Nouveau -->
                <td>
                  <i class="pi text-sm" [class.pi-check-circle]="product.isNew"
                    [class.text-primary-green]="product.isNew"
                    [class.pi-minus]="!product.isNew"
                    [class.text-gray-300]="!product.isNew"></i>
                </td>
                <!-- Mis en avant -->
                <td>
                  <i class="pi text-sm" [class.pi-star-fill]="product.isFeatured"
                    [class.text-yellow-500]="product.isFeatured"
                    [class.pi-star]="!product.isFeatured"
                    [class.text-gray-300]="!product.isFeatured"></i>
                </td>
                <!-- Actions -->
                <td>
                  <div class="flex items-center gap-2">
                    <button pButton icon="pi pi-pencil"
                      class="p-button-rounded p-button-text p-button-sm"
                      style="color: #5a8a4a;"
                      pTooltip="Modifier"
                      (click)="openEdit(product)">
                    </button>
                    <button pButton icon="pi pi-trash"
                      class="p-button-rounded p-button-text p-button-sm p-button-danger"
                      pTooltip="Supprimer"
                      (click)="confirmDelete(product)">
                    </button>
                  </div>
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="8" class="text-center py-12 text-gray-400">
                  <i class="pi pi-box text-4xl block mb-3"></i>
                  Aucun produit trouvé
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </div>

    <!-- ── Dialog Ajouter / Modifier ──────────────────────────── -->
    <p-dialog
      [(visible)]="dialogVisible"
      [header]="editMode ? 'Modifier le produit' : 'Ajouter un produit'"
      [modal]="true"
      [style]="{ width: '680px' }"
      [draggable]="false"
      [resizable]="false"
    >
      <div class="space-y-5 py-2">

        <!-- Nom + Slug -->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-charcoal">Nom *</label>
            <input pInputText [(ngModel)]="form.name" (ngModelChange)="autoSlug()"
              placeholder="Bouquet de roses" class="rounded-xl w-full" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-charcoal">Slug *</label>
            <input pInputText [(ngModel)]="form.slug" placeholder="bouquet-de-roses"
              class="rounded-xl w-full" />
          </div>
        </div>

        <!-- Description courte -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-charcoal">Description courte *</label>
          <input pInputText [(ngModel)]="form.shortDescription"
            placeholder="Résumé en 1 ligne" class="rounded-xl w-full" />
        </div>

        <!-- Description longue -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-charcoal">Description complète</label>
          <textarea pInputTextarea [(ngModel)]="form.description" rows="3"
            placeholder="Description détaillée du produit..." class="rounded-xl w-full"></textarea>
        </div>

        <!-- Variantes de prix -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-charcoal">Prix par taille <span class="text-red-500">*</span> <span class="text-xs text-gray-400">(au moins une taille)</span></label>
          <div class="grid grid-cols-3 gap-3">
            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-500">🌿 Petit</label>
              <input pInputText type="number" [(ngModel)]="form.prixPetit" placeholder="ex: 25.00" class="rounded-xl w-full" min="0" step="0.01" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-500">🌺 Moyen</label>
              <input pInputText type="number" [(ngModel)]="form.prixMoyen" placeholder="ex: 45.00" class="rounded-xl w-full" min="0" step="0.01" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-500">💐 Grand</label>
              <input pInputText type="number" [(ngModel)]="form.prixGrand" placeholder="ex: 75.00" class="rounded-xl w-full" min="0" step="0.01" />
            </div>
          </div>
        </div>

        <!-- Catégorie -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-charcoal">Catégorie *</label>
          <p-dropdown
            [(ngModel)]="form.category"
            [options]="categories"
            optionLabel="label"
            optionValue="value"
            placeholder="Sélectionner une catégorie"
            styleClass="w-full rounded-xl">
          </p-dropdown>
        </div>

        <!-- ── Section Images ──────────────────────────────────── -->
        <div class="flex flex-col gap-3">
          <label class="text-sm font-medium text-charcoal">Images</label>

          <!-- Miniatures de la liste courante -->
          <div *ngIf="imagesList.length > 0"
            class="flex flex-wrap gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div *ngFor="let imgUrl of imagesList; let i = index"
              class="relative group w-20 h-20 flex-shrink-0">
              <img [src]="imgUrl" [alt]="'Image ' + (i + 1)"
                class="w-20 h-20 rounded-lg object-cover border border-gray-200"
                (error)="onImageError($event)" />
              <!-- Bouton suppression affiché au survol -->
              <button
                type="button"
                (click)="removeImage(i)"
                pTooltip="Supprimer cette image"
                class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white
                       flex items-center justify-center opacity-0 group-hover:opacity-100
                       transition-opacity shadow-md hover:bg-red-600 focus:outline-none"
                style="font-size: 10px; line-height: 1; cursor: pointer;">
                <i class="pi pi-times" style="font-size: 10px;"></i>
              </button>
              <!-- Badge numéro d'ordre -->
              <span *ngIf="imagesList.length > 1"
                class="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white
                       rounded text-xs px-1 leading-tight">
                {{ i + 1 }}
              </span>
            </div>
          </div>

          <!-- Message si aucune image -->
          <div *ngIf="imagesList.length === 0"
            class="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-400 text-sm">
            <i class="pi pi-image"></i>
            <span>Aucune image — uploadez un fichier ou collez une URL ci-dessous</span>
          </div>

          <!-- Option A : upload de fichier -->
          <div class="flex items-center gap-3">
            <!-- Input file caché, déclenché par le bouton -->
            <input
              #fileInput
              type="file"
              accept="image/*"
              class="hidden"
              (change)="onFileSelected($event)" />

            <button pButton
              type="button"
              icon="pi pi-upload"
              label="Choisir une image"
              class="p-button-outlined p-button-sm"
              style="border-color: #5a8a4a; color: #5a8a4a; border-radius: 2rem;"
              [disabled]="uploadingImage"
              (click)="fileInput.click()">
            </button>

            <!-- Spinner pendant l'upload -->
            <div *ngIf="uploadingImage" class="flex items-center gap-2 text-sm text-gray-500">
              <p-progressSpinner
                strokeWidth="4"
                styleClass="w-5 h-5"
                animationDuration=".8s">
              </p-progressSpinner>
              <span>Upload en cours...</span>
            </div>
          </div>

          <!-- Option B : saisie d'URL manuelle -->
          <div class="flex gap-2">
            <input pInputText
              [(ngModel)]="urlInputValue"
              placeholder="https://example.com/image.jpg"
              class="rounded-xl flex-1"
              (keydown.enter)="addUrlFromInput()" />
            <button pButton
              type="button"
              icon="pi pi-plus"
              label="Ajouter"
              class="p-button-outlined p-button-sm"
              style="border-color: #5a8a4a; color: #5a8a4a; border-radius: 2rem; white-space: nowrap;"
              (click)="addUrlFromInput()">
            </button>
          </div>
          <p class="text-xs text-gray-400 -mt-1">
            Vous pouvez aussi coller plusieurs URLs séparées par des virgules, puis cliquer "Ajouter".
          </p>
        </div>
        <!-- ── Fin section Images ─────────────────────────────── -->

        <!-- Tags -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-charcoal">Tags (séparés par des virgules)</label>
          <input pInputText [(ngModel)]="form.tagsRaw"
            placeholder="roses, anniversaire, romantique"
            class="rounded-xl w-full" />
        </div>

        <!-- Traductions -->
        <div class="flex flex-col gap-2">
          <button type="button" (click)="showTranslations = !showTranslations"
            class="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-charcoal transition-colors w-fit">
            <i class="pi" [class.pi-chevron-right]="!showTranslations" [class.pi-chevron-down]="showTranslations"></i>
            Traductions (EN / NL)
          </button>
          <div *ngIf="showTranslations" class="space-y-4 pt-2 border-l-2 border-gray-100 pl-4">
            <!-- EN -->
            <div class="flex flex-col gap-3">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">🇬🇧 English</p>
              <input pInputText [(ngModel)]="form.nameEn" placeholder="Product name (EN)" class="rounded-xl w-full" />
              <input pInputText [(ngModel)]="form.shortDescriptionEn" placeholder="Short description (EN)" class="rounded-xl w-full" />
              <textarea pInputTextarea [(ngModel)]="form.descriptionEn" rows="2" placeholder="Full description (EN)" class="rounded-xl w-full"></textarea>
            </div>
            <!-- NL -->
            <div class="flex flex-col gap-3">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">🇳🇱 Nederlands</p>
              <input pInputText [(ngModel)]="form.nameNl" placeholder="Productnaam (NL)" class="rounded-xl w-full" />
              <input pInputText [(ngModel)]="form.shortDescriptionNl" placeholder="Korte beschrijving (NL)" class="rounded-xl w-full" />
              <textarea pInputTextarea [(ngModel)]="form.descriptionNl" rows="2" placeholder="Volledige beschrijving (NL)" class="rounded-xl w-full"></textarea>
            </div>
          </div>
        </div>

        <p-divider></p-divider>

        <!-- Checkboxes -->
        <div class="flex flex-wrap gap-6">
          <div class="flex items-center gap-2">
            <p-checkbox [(ngModel)]="form.inStock" [binary]="true" inputId="inStock"></p-checkbox>
            <label for="inStock" class="text-sm text-charcoal cursor-pointer">En stock</label>
          </div>
          <div class="flex items-center gap-2">
            <p-checkbox [(ngModel)]="form.isNew" [binary]="true" inputId="isNew"></p-checkbox>
            <label for="isNew" class="text-sm text-charcoal cursor-pointer">Nouveau</label>
          </div>
          <div class="flex items-center gap-2">
            <p-checkbox [(ngModel)]="form.isFeatured" [binary]="true" inputId="isFeatured"></p-checkbox>
            <label for="isFeatured" class="text-sm text-charcoal cursor-pointer">Mis en avant</label>
          </div>
          <div class="flex items-center gap-2">
            <p-checkbox [(ngModel)]="form.isSeasonal" [binary]="true" inputId="isSeasonal"></p-checkbox>
            <label for="isSeasonal" class="text-sm text-charcoal cursor-pointer">Saisonnier</label>
          </div>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <button pButton label="Annuler" icon="pi pi-times"
          class="p-button-text" style="color: #5a8a4a;"
          (click)="dialogVisible = false">
        </button>
        <button pButton
          [label]="editMode ? 'Mettre à jour' : 'Ajouter'"
          [icon]="editMode ? 'pi pi-check' : 'pi pi-plus'"
          [loading]="saving"
          (click)="saveProduct()"
          style="background: #5a8a4a; border: none; border-radius: 2rem;">
        </button>
      </ng-template>
    </p-dialog>
  `
})
export class AdminComponent implements OnInit {
  readonly getStartingPrice = getStartingPrice;
  // Contrôle l'affichage du panneau de traductions dans le dialog
  showTranslations = false;

  products: Product[] = [];
  loading = false;
  saving = false;
  dialogVisible = false;
  editMode = false;
  adminName = '';

  /** Liste des URLs d'images en cours d'édition */
  imagesList: string[] = [];

  /** Valeur du champ de saisie manuelle d'URL */
  urlInputValue = '';

  /** Indicateur d'upload en cours */
  uploadingImage = false;

  form: ProductForm = this.emptyForm();

  categories = [
    { label: 'Bouquets', value: 'bouquets' },
    { label: 'Compositions', value: 'compositions' },
    { label: 'Plantes', value: 'plantes' },
    { label: 'Mariages', value: 'mariages' },
    { label: 'Deuil', value: 'deuil' },
    { label: 'Saisonnier', value: 'seasonal' },
  ];

  get inStockCount() { return this.products.filter(p => p.inStock).length; }
  get featuredCount() { return this.products.filter(p => p.isFeatured).length; }

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    const user = this.authService.currentUser$.value;
    this.adminName = user ? `${user.firstName} ${user.lastName}` : '';
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.http.get<Product[]>(`${environment.apiUrl}/products`).subscribe({
      next: (data) => { this.products = data; this.loading = false; },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger les produits.' });
      }
    });
  }

  openAdd() {
    this.editMode = false;
    this.form = this.emptyForm();
    this.imagesList = [];
    this.urlInputValue = '';
    this.dialogVisible = true;
  }

  openEdit(product: Product) {
    this.editMode = true;
    this.imagesList = [...(product.images || [])];
    this.urlInputValue = '';
    this.form = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      description: product.description,
      // Peuplement des variantes depuis le tableau product.variants
      prixPetit: product.variants?.find(v => v.size === 'PETIT')?.price ?? null,
      prixMoyen: product.variants?.find(v => v.size === 'MOYEN')?.price ?? null,
      prixGrand: product.variants?.find(v => v.size === 'GRAND')?.price ?? null,
      category: product.category,
      imagesRaw: (product.images || []).join(', '),
      tagsRaw: (product.tags || []).join(', '),
      inStock: product.inStock,
      isNew: product.isNew,
      isFeatured: product.isFeatured,
      isSeasonal: product.isSeasonal,
      // Peuplement des champs de traduction depuis le produit
      nameEn: (product as any).nameEn || '',
      nameNl: (product as any).nameNl || '',
      shortDescriptionEn: (product as any).shortDescriptionEn || '',
      shortDescriptionNl: (product as any).shortDescriptionNl || '',
      descriptionEn: (product as any).descriptionEn || '',
      descriptionNl: (product as any).descriptionNl || '',
    };
    this.dialogVisible = true;
  }

  autoSlug() {
    this.form.slug = this.form.name
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }

  /**
   * Déclenché quand l'utilisateur sélectionne un fichier via l'input caché.
   * Envoie le fichier en multipart/form-data vers POST /api/products/upload-image
   * et ajoute l'URL retournée à imagesList.
   */
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) { return; }

    const file = input.files[0];

    // Réinitialise la valeur de l'input pour permettre de re-sélectionner le même fichier
    input.value = '';

    const formData = new FormData();
    formData.append('file', file);

    this.uploadingImage = true;

    this.http.post<{ url: string }>(`${environment.apiUrl}/products/upload-image`, formData).subscribe({
      next: (response) => {
        this.uploadingImage = false;
        if (response?.url) {
          this.imagesList = [...this.imagesList, response.url];
          this.messageService.add({
            severity: 'success',
            summary: 'Image uploadée',
            detail: 'L\'image a été ajoutée avec succès.'
          });
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Réponse inattendue',
            detail: 'L\'upload a réussi mais aucune URL n\'a été retournée.'
          });
        }
      },
      error: () => {
        this.uploadingImage = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur d\'upload',
          detail: 'Impossible d\'uploader l\'image. Vérifiez le format et réessayez.'
        });
      }
    });
  }

  /**
   * Ajoute une ou plusieurs URLs saisies manuellement dans le champ texte.
   * Supporte plusieurs URLs séparées par des virgules.
   */
  addUrlFromInput() {
    const urls = this.urlInputValue
      .split(',')
      .map(u => u.trim())
      .filter(u => u.length > 0);

    if (urls.length === 0) { return; }

    // Filtre les doublons
    const nouvelles = urls.filter(u => !this.imagesList.includes(u));
    if (nouvelles.length > 0) {
      this.imagesList = [...this.imagesList, ...nouvelles];
    }
    this.urlInputValue = '';
  }

  /**
   * Supprime une image de la liste par son index.
   */
  removeImage(index: number) {
    this.imagesList = this.imagesList.filter((_, i) => i !== index);
  }

  /**
   * Gère les erreurs de chargement des miniatures (image introuvable).
   */
  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  saveProduct() {
    // Validation : au moins une variante de prix doit être renseignée
    const hasVariant = (this.form.prixPetit ?? 0) > 0 || (this.form.prixMoyen ?? 0) > 0 || (this.form.prixGrand ?? 0) > 0;
    if (!this.form.name || !this.form.slug || !hasVariant || !this.form.category || !this.form.shortDescription) {
      if (!hasVariant) {
        this.messageService.add({ severity: 'warn', summary: 'Prix requis', detail: 'Au moins une variante de prix est requise.' });
      } else {
        this.messageService.add({ severity: 'warn', summary: 'Champs requis', detail: 'Veuillez remplir tous les champs obligatoires.' });
      }
      return;
    }
    this.saving = true;

    // Construction du tableau variants avec uniquement les tailles ayant un prix valide
    const variants = [
      { size: 'PETIT', price: this.form.prixPetit },
      { size: 'MOYEN', price: this.form.prixMoyen },
      { size: 'GRAND', price: this.form.prixGrand },
    ].filter(v => v.price !== null && v.price > 0);

    const payload = {
      name: this.form.name,
      slug: this.form.slug,
      shortDescription: this.form.shortDescription,
      description: this.form.description,
      category: this.form.category,
      images: this.imagesList,
      tags: this.form.tagsRaw.split(',').map(s => s.trim()).filter(Boolean),
      inStock: this.form.inStock,
      isNew: this.form.isNew,
      isFeatured: this.form.isFeatured,
      isSeasonal: this.form.isSeasonal,
      variants,
      // Champs de traduction EN / NL
      nameEn: this.form.nameEn || null,
      nameNl: this.form.nameNl || null,
      shortDescriptionEn: this.form.shortDescriptionEn || null,
      shortDescriptionNl: this.form.shortDescriptionNl || null,
      descriptionEn: this.form.descriptionEn || null,
      descriptionNl: this.form.descriptionNl || null,
    };

    const req = this.editMode
      ? this.http.put<Product>(`${environment.apiUrl}/products/${this.form.id}`, payload)
      : this.http.post<Product>(`${environment.apiUrl}/products`, payload);

    req.subscribe({
      next: (saved) => {
        this.saving = false;
        this.dialogVisible = false;
        if (this.editMode) {
          const idx = this.products.findIndex(p => p.id === saved.id);
          if (idx !== -1) this.products[idx] = saved;
          this.products = [...this.products];
          this.messageService.add({ severity: 'success', summary: 'Modifié', detail: `"${saved.name}" mis à jour.` });
        } else {
          this.products = [...this.products, saved];
          this.messageService.add({ severity: 'success', summary: 'Ajouté', detail: `"${saved.name}" ajouté au catalogue.` });
        }
      },
      error: () => {
        this.saving = false;
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de sauvegarder le produit.' });
      }
    });
  }

  confirmDelete(product: Product) {
    this.confirmationService.confirm({
      message: `Supprimer "${product.name}" définitivement ?`,
      accept: () => this.deleteProduct(product)
    });
  }

  deleteProduct(product: Product) {
    this.http.delete(`${environment.apiUrl}/products/${product.id}`).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== product.id);
        this.messageService.add({ severity: 'success', summary: 'Supprimé', detail: `"${product.name}" retiré du catalogue.` });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de supprimer le produit.' });
      }
    });
  }

  private emptyForm(): ProductForm {
    return {
      name: '', slug: '', shortDescription: '', description: '',
      // Initialisation des 3 variantes de prix à null
      prixPetit: null, prixMoyen: null, prixGrand: null,
      category: '',
      imagesRaw: '', tagsRaw: '',
      inStock: true, isNew: false, isFeatured: false, isSeasonal: false,
      // Initialisation des champs de traduction
      nameEn: '', nameNl: '',
      shortDescriptionEn: '', shortDescriptionNl: '',
      descriptionEn: '', descriptionNl: '',
    };
  }
}
