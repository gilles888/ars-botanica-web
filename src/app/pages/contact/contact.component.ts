import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonModule, InputTextModule, InputTextareaModule,
    DropdownModule, ToastModule, TranslateModule
  ],
  providers: [MessageService],
  template: `
    <p-toast position="bottom-right"></p-toast>
    <div class="pt-20 min-h-screen bg-cream page-enter">

      <!-- Hero -->
      <section class="bg-white border-b border-gray-100 py-16">
        <div class="container-custom text-center">
          <p class="text-rose-accent uppercase tracking-widest text-sm font-semibold mb-4">{{ 'contact.eyebrow' | translate }}</p>
          <h1 class="font-heading text-5xl text-charcoal font-bold mb-4">{{ 'contact.title' | translate }}</h1>
          <p class="text-gray-500 text-lg max-w-lg mx-auto">{{ 'contact.subtitle' | translate }}</p>
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
                <h3 class="font-semibold text-charcoal mb-1">{{ info.titleKey | translate }}</h3>
                <p class="text-gray-500 text-sm leading-relaxed" [innerHTML]="info.contentKey | translate"></p>
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
              <h2 class="font-heading text-2xl text-charcoal mb-6">{{ 'contact.form_title' | translate }}</h2>

              <form (ngSubmit)="sendMessage()" class="space-y-5">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-charcoal">{{ 'contact.form_firstname' | translate }}</label>
                    <input pInputText type="text" [(ngModel)]="form.firstName" name="firstName" placeholder="Marie" required class="rounded-xl" />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-charcoal">{{ 'contact.form_lastname' | translate }}</label>
                    <input pInputText type="text" [(ngModel)]="form.lastName" name="lastName" placeholder="Dupont" required class="rounded-xl" />
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-charcoal">{{ 'contact.form_email' | translate }}</label>
                  <input pInputText type="email" [(ngModel)]="form.email" name="email" placeholder="marie@exemple.fr" required class="rounded-xl" />
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-charcoal">{{ 'contact.form_subject' | translate }}</label>
                  <p-dropdown
                    [options]="subjectOptions"
                    [(ngModel)]="form.subject"
                    name="subject"
                    optionLabel="label"
                    optionValue="value"
                    [placeholder]="'contact.form_subject_placeholder' | translate"
                    styleClass="w-full rounded-xl"
                  ></p-dropdown>
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-charcoal">{{ 'contact.form_message' | translate }}</label>
                  <textarea
                    pInputTextarea
                    [(ngModel)]="form.message"
                    name="message"
                    [placeholder]="'contact.form_message_placeholder' | translate"
                    rows="5"
                    required
                    class="rounded-xl w-full resize-none"
                    style="border: 1px solid #e2e8f0; padding: 0.75rem 1rem; font-family: inherit; font-size: 0.95rem;"
                  ></textarea>
                </div>

                <!-- Event details -->
                <div *ngIf="form.subject === 'mariage' || form.subject === 'evenement'"
                  class="bg-green-50 rounded-xl p-5">
                  <p class="text-sm font-medium text-primary-green mb-3">{{ 'contact.form_event_details' | translate }}</p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="flex flex-col gap-1">
                      <label class="text-xs text-gray-500">{{ 'contact.form_event_date' | translate }}</label>
                      <input pInputText type="date" [(ngModel)]="form.eventDate" name="eventDate" class="rounded-lg text-sm" />
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-xs text-gray-500">{{ 'contact.form_budget' | translate }}</label>
                      <input pInputText type="text" [(ngModel)]="form.budget" name="budget" placeholder="ex: 500–1000€" class="rounded-lg text-sm" />
                    </div>
                  </div>
                </div>

                <button
                  pButton
                  type="submit"
                  [label]="'contact.form_submit' | translate"
                  icon="pi pi-send"
                  iconPos="right"
                  [loading]="sending"
                  class="w-full"
                  style="background: #5a8a4a; border: none; border-radius: 2rem; padding: 0.9rem; font-size: 1rem;">
                </button>

                <p class="text-xs text-gray-400 text-center">{{ 'contact.form_privacy' | translate }}</p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ -->
      <section class="section-padding bg-white">
        <div class="container-custom max-w-3xl">
          <div class="text-center mb-12">
            <h2 class="font-heading text-4xl text-charcoal mb-3">{{ 'contact.faq_title' | translate }}</h2>
          </div>
          <div class="space-y-4">
            <div *ngFor="let faq of faqs"
              class="bg-cream rounded-2xl p-6 cursor-pointer hover:bg-green-50 transition-colors"
              (click)="faq.open = !faq.open">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-charcoal">{{ faq.questionKey | translate }}</h3>
                <i class="pi text-primary-green transition-transform"
                  [class.pi-chevron-down]="!faq.open"
                  [class.pi-chevron-up]="faq.open"></i>
              </div>
              <p *ngIf="faq.open" class="text-gray-600 text-sm mt-3 leading-relaxed">{{ faq.answerKey | translate }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class ContactComponent implements OnInit, OnDestroy {
  sending = false;

  form = {
    firstName: '', lastName: '', email: '', subject: '',
    message: '', eventDate: '', budget: ''
  };

  contactInfo = [
    { icon: 'pi pi-map-marker', titleKey: 'contact.info_address_title', contentKey: 'contact.info_address_content' },
    { icon: 'pi pi-phone', titleKey: 'contact.info_phone_title', contentKey: 'contact.info_phone_content' },
    { icon: 'pi pi-envelope', titleKey: 'contact.info_email_title', contentKey: 'contact.info_email_content' },
    { icon: 'pi pi-clock', titleKey: 'contact.info_hours_title', contentKey: 'contact.info_hours_content' },
  ];

  subjectOptions: { label: string; value: string }[] = [];

  faqs = [
    { questionKey: 'contact.faq1_q', answerKey: 'contact.faq1_a', open: false },
    { questionKey: 'contact.faq2_q', answerKey: 'contact.faq2_a', open: false },
    { questionKey: 'contact.faq3_q', answerKey: 'contact.faq3_a', open: false },
    { questionKey: 'contact.faq4_q', answerKey: 'contact.faq4_a', open: false },
  ];

  private langSub = new Subscription();

  constructor(
    private messageService: MessageService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.buildSubjectOptions();
    this.langSub.add(this.translate.onLangChange.subscribe(() => this.buildSubjectOptions()));
  }

  ngOnDestroy() {
    this.langSub.unsubscribe();
  }

  buildSubjectOptions() {
    this.subjectOptions = [
      { label: this.translate.instant('contact.subject_bouquet'), value: 'bouquet' },
      { label: this.translate.instant('contact.subject_wedding'), value: 'mariage' },
      { label: this.translate.instant('contact.subject_event'), value: 'evenement' },
      { label: this.translate.instant('contact.subject_subscription'), value: 'abonnement' },
      { label: this.translate.instant('contact.subject_general'), value: 'general' },
      { label: this.translate.instant('contact.subject_other'), value: 'autre' },
    ];
  }

  sendMessage() {
    if (!this.form.firstName || !this.form.email || !this.form.message) {
      this.messageService.add({
        severity: 'warn',
        summary: this.translate.instant('contact.toast_required'),
        detail: this.translate.instant('contact.toast_required_detail')
      });
      return;
    }
    this.sending = true;
    setTimeout(() => {
      this.sending = false;
      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('contact.toast_sent'),
        detail: this.translate.instant('contact.toast_sent_detail')
      });
      this.form = { firstName: '', lastName: '', email: '', subject: '', message: '', eventDate: '', budget: '' };
    }, 1500);
  }
}
