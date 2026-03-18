import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, TimelineModule, TranslateModule],
  template: `
    <div class="pt-20 page-enter">

      <!-- Hero -->
      <section class="relative py-24 bg-primary-green overflow-hidden">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-white blur-3xl"></div>
        </div>
        <div class="container-custom text-center relative z-10">
          <p class="text-green-100 uppercase tracking-widest text-sm font-semibold mb-4">{{ 'about.eyebrow' | translate }}</p>
          <h1 class="font-heading text-5xl lg:text-6xl text-white font-bold mb-6">{{ 'about.title' | translate }}</h1>
          <p class="text-green-100 text-lg max-w-xl mx-auto leading-relaxed">{{ 'about.subtitle' | translate }}</p>
        </div>
      </section>

      <!-- Story -->
      <section class="section-padding bg-white">
        <div class="container-custom">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p class="text-rose-accent uppercase tracking-widest text-sm font-semibold mb-4">{{ 'about.founder_eyebrow' | translate }}</p>
              <h2 class="font-heading text-4xl text-charcoal mb-6">{{ 'about.founder_title' | translate }}</h2>
              <p class="text-gray-600 leading-relaxed mb-5">{{ 'about.founder_p1' | translate }}</p>
              <p class="text-gray-600 leading-relaxed mb-5">{{ 'about.founder_p2' | translate }}</p>
              <p class="text-gray-600 leading-relaxed mb-8">{{ 'about.founder_p3' | translate }}</p>
              <div class="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&q=80"
                  alt="Marie Lecomte"
                  class="w-16 h-16 rounded-full object-cover shadow-md"
                />
                <div>
                  <p class="font-semibold text-charcoal">{{ 'about.founder_name' | translate }}</p>
                  <p class="text-sm text-gray-500">{{ 'about.founder_role' | translate }}</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=400&q=80" alt="Atelier"
                class="rounded-2xl object-cover h-56 w-full shadow-lg" />
              <img src="https://images.unsplash.com/photo-1490750967868-88df5691cc36?w=400&q=80" alt="Fleurs"
                class="rounded-2xl object-cover h-56 w-full shadow-lg mt-8" />
              <img src="https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=400&q=80" alt="Création"
                class="rounded-2xl object-cover h-56 w-full shadow-lg" />
              <img src="https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=400&q=80" alt="Bouquet"
                class="rounded-2xl object-cover h-56 w-full shadow-lg mt-8" />
            </div>
          </div>
        </div>
      </section>

      <!-- Values -->
      <section class="section-padding bg-cream">
        <div class="container-custom">
          <div class="text-center mb-14">
            <p class="text-rose-accent uppercase tracking-widest text-sm font-semibold mb-3">{{ 'about.values_eyebrow' | translate }}</p>
            <h2 class="font-heading text-4xl text-charcoal">{{ 'about.values_title' | translate }}</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div *ngFor="let v of values"
              class="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div class="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
                <i [class]="v.icon + ' text-primary-green text-2xl'"></i>
              </div>
              <h3 class="font-heading text-xl text-charcoal font-semibold mb-3">{{ v.titleKey | translate }}</h3>
              <p class="text-gray-500 text-sm leading-relaxed">{{ v.descKey | translate }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Timeline -->
      <section class="section-padding bg-white">
        <div class="container-custom">
          <div class="text-center mb-14">
            <p class="text-primary-green uppercase tracking-widest text-sm font-semibold mb-3">{{ 'about.timeline_eyebrow' | translate }}</p>
            <h2 class="font-heading text-4xl text-charcoal">{{ 'about.timeline_title' | translate }}</h2>
          </div>

          <div class="max-w-2xl mx-auto">
            <p-timeline [value]="timeline" styleClass="customized-timeline">
              <ng-template pTemplate="marker" let-event>
                <div class="w-10 h-10 rounded-full bg-primary-green flex items-center justify-center shadow-md">
                  <i [class]="event.icon + ' text-white text-sm'"></i>
                </div>
              </ng-template>
              <ng-template pTemplate="content" let-event>
                <div class="bg-white rounded-2xl p-5 shadow-sm mb-6 ml-4">
                  <div class="flex items-center gap-3 mb-2">
                    <span class="font-bold text-primary-green text-lg">{{ event.year }}</span>
                    <h4 class="font-heading text-lg text-charcoal font-semibold">{{ event.titleKey | translate }}</h4>
                  </div>
                  <p class="text-gray-500 text-sm leading-relaxed">{{ event.descKey | translate }}</p>
                </div>
              </ng-template>
            </p-timeline>
          </div>
        </div>
      </section>

      <!-- Team -->
      <section class="section-padding bg-cream">
        <div class="container-custom">
          <div class="text-center mb-14">
            <p class="text-rose-accent uppercase tracking-widest text-sm font-semibold mb-3">{{ 'about.team_eyebrow' | translate }}</p>
            <h2 class="font-heading text-4xl text-charcoal">{{ 'about.team_title' | translate }}</h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div *ngFor="let member of team" class="text-center">
              <img [src]="member.photo" [alt]="member.name"
                class="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-md" />
              <h3 class="font-heading text-xl text-charcoal font-semibold">{{ member.name }}</h3>
              <p class="text-primary-green text-sm font-medium mb-2">{{ member.roleKey | translate }}</p>
              <p class="text-gray-500 text-sm">{{ member.bioKey | translate }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="py-20 bg-primary-green">
        <div class="container-custom text-center">
          <h2 class="font-heading text-4xl text-white mb-5">{{ 'about.cta_title' | translate }}</h2>
          <p class="text-green-100 max-w-lg mx-auto mb-10 text-lg">{{ 'about.cta_desc' | translate }}</p>
          <a routerLink="/contact">
            <button pButton
              [label]="'about.cta_btn' | translate"
              icon="pi pi-envelope"
              style="background: white; color: #5a8a4a; border: none; border-radius: 2rem; padding: 0.85rem 2.5rem; font-size: 1rem;">
            </button>
          </a>
        </div>
      </section>
    </div>
  `
})
export class AboutComponent {
  values = [
    { icon: 'pi pi-leaf', titleKey: 'about.value_eco_title', descKey: 'about.value_eco_desc' },
    { icon: 'pi pi-heart', titleKey: 'about.value_love_title', descKey: 'about.value_love_desc' },
    { icon: 'pi pi-star', titleKey: 'about.value_excellence_title', descKey: 'about.value_excellence_desc' },
    { icon: 'pi pi-users', titleKey: 'about.value_listen_title', descKey: 'about.value_listen_desc' },
  ];

  timeline = [
    { year: '2012', titleKey: 'about.tl_2012_title', descKey: 'about.tl_2012_desc', icon: 'pi pi-home' },
    { year: '2015', titleKey: 'about.tl_2015_title', descKey: 'about.tl_2015_desc', icon: 'pi pi-heart' },
    { year: '2018', titleKey: 'about.tl_2018_title', descKey: 'about.tl_2018_desc', icon: 'pi pi-building' },
    { year: '2021', titleKey: 'about.tl_2021_title', descKey: 'about.tl_2021_desc', icon: 'pi pi-verified' },
    { year: '2024', titleKey: 'about.tl_2024_title', descKey: 'about.tl_2024_desc', icon: 'pi pi-globe' },
  ];

  team = [
    {
      name: 'Marie Lecomte',
      roleKey: 'about.member1_role',
      bioKey: 'about.member1_bio',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80'
    },
    {
      name: 'Sophie Arnaud',
      roleKey: 'about.member2_role',
      bioKey: 'about.member2_bio',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&q=80'
    },
    {
      name: 'Léa Martin',
      roleKey: 'about.member3_role',
      bioKey: 'about.member3_bio',
      photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop&q=80'
    }
  ];
}
