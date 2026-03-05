import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonModule, InputTextModule, InputTextareaModule,
    DropdownModule, ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast position="bottom-right"></p-toast>
    <div class="pt-20 min-h-screen bg-cream page-enter">

      <!-- Hero -->
      <section class="bg-white border-b border-gray-100 py-16">
        <div class="container-custom text-center">
          <p class="text-rose-accent uppercase tracking-widest text-sm font-semibold mb-4">Nous écrire</p>
          <h1 class="font-heading text-5xl text-charcoal font-bold mb-4">Contactez-nous</h1>
          <p class="text-gray-500 text-lg max-w-lg mx-auto">
            Une question, un projet floral, un devis ? Nous vous répondons sous 24h.
          </p>
        </div>
      </section>

      <div class="container-custom py-16">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">

          <!-- Contact Info -->
          <div class="lg:col-span-1 space-y-6">
            <div *ngFor="let info of contactInfo"
              class="bg-white rounded-2xl p-6 shadow-sm flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <i [class]="info.icon + ' text-primary-green text-lg'"></i>
              </div>
              <div>
                <h3 class="font-semibold text-charcoal mb-1">{{ info.title }}</h3>
                <p class="text-gray-500 text-sm leading-relaxed" [innerHTML]="info.content"></p>
              </div>
            </div>

            <!-- Map placeholder -->
            <div class="bg-white rounded-2xl overflow-hidden shadow-sm aspect-video relative">
              <img
                src="https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=500&q=80"
                alt="Paris Marais"
                class="w-full h-full object-cover opacity-60"
              />
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="bg-white rounded-xl shadow-lg p-4 text-center">
                  <i class="pi pi-map-marker text-primary-green text-2xl mb-2"></i>
                  <p class="font-semibold text-charcoal text-sm">12 Rue des Fleurs</p>
                  <p class="text-gray-500 text-xs">75004 Paris — Le Marais</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Form -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-2xl p-8 shadow-sm">
              <h2 class="font-heading text-2xl text-charcoal mb-6">Envoyez-nous un message</h2>

              <form (ngSubmit)="sendMessage()" class="space-y-5">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-charcoal">Prénom *</label>
                    <input
                      pInputText
                      type="text"
                      [(ngModel)]="form.firstName"
                      name="firstName"
                      placeholder="Marie"
                      required
                      class="rounded-xl"
                    />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-charcoal">Nom *</label>
                    <input
                      pInputText
                      type="text"
                      [(ngModel)]="form.lastName"
                      name="lastName"
                      placeholder="Dupont"
                      required
                      class="rounded-xl"
                    />
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-charcoal">Email *</label>
                  <input
                    pInputText
                    type="email"
                    [(ngModel)]="form.email"
                    name="email"
                    placeholder="marie@exemple.fr"
                    required
                    class="rounded-xl"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-charcoal">Sujet</label>
                  <p-dropdown
                    [options]="subjectOptions"
                    [(ngModel)]="form.subject"
                    name="subject"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Sélectionnez un sujet"
                    styleClass="w-full rounded-xl"
                  ></p-dropdown>
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-charcoal">Message *</label>
                  <textarea
                    pInputTextarea
                    [(ngModel)]="form.message"
                    name="message"
                    placeholder="Décrivez votre projet ou posez votre question..."
                    rows="5"
                    required
                    class="rounded-xl w-full resize-none"
                    style="border: 1px solid #e2e8f0; padding: 0.75rem 1rem; font-family: inherit; font-size: 0.95rem;"
                  ></textarea>
                </div>

                <!-- Event details (if wedding/event selected) -->
                <div *ngIf="form.subject === 'mariage' || form.subject === 'evenement'"
                  class="bg-green-50 rounded-xl p-5">
                  <p class="text-sm font-medium text-primary-green mb-3">Détails de l'événement</p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="flex flex-col gap-1">
                      <label class="text-xs text-gray-500">Date envisagée</label>
                      <input pInputText type="date" [(ngModel)]="form.eventDate" name="eventDate" class="rounded-lg text-sm" />
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-xs text-gray-500">Budget approximatif</label>
                      <input pInputText type="text" [(ngModel)]="form.budget" name="budget" placeholder="ex: 500–1000€" class="rounded-lg text-sm" />
                    </div>
                  </div>
                </div>

                <button
                  pButton
                  type="submit"
                  label="Envoyer le message"
                  icon="pi pi-send"
                  iconPos="right"
                  [loading]="sending"
                  class="w-full"
                  style="background: #5a8a4a; border: none; border-radius: 2rem; padding: 0.9rem; font-size: 1rem;">
                </button>

                <p class="text-xs text-gray-400 text-center">
                  Nous vous répondrons sous 24h ouvrées. Vos données restent confidentielles.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ -->
      <section class="section-padding bg-white">
        <div class="container-custom max-w-3xl">
          <div class="text-center mb-12">
            <h2 class="font-heading text-4xl text-charcoal mb-3">Questions fréquentes</h2>
          </div>
          <div class="space-y-4">
            <div *ngFor="let faq of faqs"
              class="bg-cream rounded-2xl p-6 cursor-pointer hover:bg-green-50 transition-colors"
              (click)="faq.open = !faq.open">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-charcoal">{{ faq.question }}</h3>
                <i class="pi text-primary-green transition-transform"
                  [class.pi-chevron-down]="!faq.open"
                  [class.pi-chevron-up]="faq.open"></i>
              </div>
              <p *ngIf="faq.open" class="text-gray-600 text-sm mt-3 leading-relaxed">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class ContactComponent {
  sending = false;

  form = {
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
    eventDate: '',
    budget: ''
  };

  contactInfo = [
    {
      icon: 'pi pi-map-marker',
      title: 'Adresse',
      content: '12 Rue des Fleurs<br>75004 Paris — Le Marais'
    },
    {
      icon: 'pi pi-phone',
      title: 'Téléphone',
      content: '+33 1 42 00 00 00<br><span class="text-xs">Mar–Sam : 9h–19h</span>'
    },
    {
      icon: 'pi pi-envelope',
      title: 'Email',
      content: 'bonjour@ars-botanica.fr'
    },
    {
      icon: 'pi pi-clock',
      title: 'Horaires',
      content: 'Mardi–Samedi : 9h–19h<br>Dimanche : 9h–13h<br>Lundi : Fermé'
    }
  ];

  subjectOptions = [
    { label: 'Commande bouquet', value: 'bouquet' },
    { label: 'Fleurs de mariage', value: 'mariage' },
    { label: 'Décoration événement', value: 'evenement' },
    { label: 'Abonnement floral', value: 'abonnement' },
    { label: 'Renseignement général', value: 'general' },
    { label: 'Autre', value: 'autre' },
  ];

  faqs = [
    {
      question: 'Combien de temps à l\'avance dois-je commander ?',
      answer: 'Pour les bouquets standards, 48h suffisent. Pour les mariages et événements, nous recommandons 3 à 6 mois à l\'avance pour s\'assurer de la disponibilité.',
      open: false
    },
    {
      question: 'Livrez-vous à domicile ?',
      answer: 'Oui, nous livrons dans tout Paris et la petite couronne. La livraison est offerte pour toute commande supérieure à 80€. Pour les grandes distances, nous étudions chaque demande au cas par cas.',
      open: false
    },
    {
      question: 'Proposez-vous des créations sur mesure ?',
      answer: 'Absolument ! C\'est même notre spécialité. Contactez-nous avec vos couleurs, l\'occasion et votre budget, et nous créerons quelque chose d\'unique rien que pour vous.',
      open: false
    },
    {
      question: 'Proposez-vous des ateliers floraux ?',
      answer: 'Oui, nous organisons des ateliers en boutique les samedis matin. Consultez notre page Instagram pour les prochaines dates ou écrivez-nous pour une session privée.',
      open: false
    }
  ];

  constructor(private messageService: MessageService) {}

  sendMessage() {
    if (!this.form.firstName || !this.form.email || !this.form.message) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Champs requis',
        detail: 'Veuillez remplir tous les champs obligatoires.'
      });
      return;
    }

    this.sending = true;
    setTimeout(() => {
      this.sending = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Message envoyé !',
        detail: 'Merci ! Nous vous répondrons dans les 24h.'
      });
      this.form = { firstName: '', lastName: '', email: '', subject: '', message: '', eventDate: '', budget: '' };
    }, 1500);
  }
}
