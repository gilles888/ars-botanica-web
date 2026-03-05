import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, TimelineModule],
  template: `
    <div class="pt-20 page-enter">

      <!-- Hero -->
      <section class="relative py-24 bg-primary-green overflow-hidden">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-white blur-3xl"></div>
        </div>
        <div class="container-custom text-center relative z-10">
          <p class="text-green-100 uppercase tracking-widest text-sm font-semibold mb-4">Notre histoire</p>
          <h1 class="font-heading text-5xl lg:text-6xl text-white font-bold mb-6">À propos de<br>Ars Botanica</h1>
          <p class="text-green-100 text-lg max-w-xl mx-auto leading-relaxed">
            Une boutique florale fondée sur la passion, le savoir-faire artisanal et l'amour du beau.
          </p>
        </div>
      </section>

      <!-- Story -->
      <section class="section-padding bg-white">
        <div class="container-custom">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p class="text-rose-accent uppercase tracking-widest text-sm font-semibold mb-4">La fondatrice</p>
              <h2 class="font-heading text-4xl text-charcoal mb-6">Bonjour, je suis <em>Marie</em></h2>
              <p class="text-gray-600 leading-relaxed mb-5">
                J'ai grandi entourée de fleurs dans le jardin de ma grand-mère en Provence. C'est là que j'ai appris à reconnaître chaque plante, à comprendre ses besoins et à percevoir sa beauté unique.
              </p>
              <p class="text-gray-600 leading-relaxed mb-5">
                Après une formation à l'École Nationale Supérieure d'Art Floral de Paris, j'ai parcouru les marchés de Tokyo, Amsterdam et Chelsea pour affiner mon regard et ma technique.
              </p>
              <p class="text-gray-600 leading-relaxed mb-8">
                En 2012, j'ai ouvert Ars Botanica dans le Marais — un espace où les fleurs ne sont pas de simples produits, mais des créations vivantes qui racontent une histoire.
              </p>
              <div class="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&q=80"
                  alt="Marie Lecomte"
                  class="w-16 h-16 rounded-full object-cover shadow-md"
                />
                <div>
                  <p class="font-semibold text-charcoal">Marie Lecomte</p>
                  <p class="text-sm text-gray-500">Fondatrice & Artiste Florale</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=400&q=80"
                alt="Atelier"
                class="rounded-2xl object-cover h-56 w-full shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1490750967868-88df5691cc36?w=400&q=80"
                alt="Fleurs"
                class="rounded-2xl object-cover h-56 w-full shadow-lg mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=400&q=80"
                alt="Création"
                class="rounded-2xl object-cover h-56 w-full shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=400&q=80"
                alt="Bouquet"
                class="rounded-2xl object-cover h-56 w-full shadow-lg mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Values -->
      <section class="section-padding bg-cream">
        <div class="container-custom">
          <div class="text-center mb-14">
            <p class="text-rose-accent uppercase tracking-widest text-sm font-semibold mb-3">Ce qui nous guide</p>
            <h2 class="font-heading text-4xl text-charcoal">Nos valeurs</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div *ngFor="let v of values"
              class="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div class="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
                <i [class]="v.icon + ' text-primary-green text-2xl'"></i>
              </div>
              <h3 class="font-heading text-xl text-charcoal font-semibold mb-3">{{ v.title }}</h3>
              <p class="text-gray-500 text-sm leading-relaxed">{{ v.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Timeline -->
      <section class="section-padding bg-white">
        <div class="container-custom">
          <div class="text-center mb-14">
            <p class="text-primary-green uppercase tracking-widest text-sm font-semibold mb-3">Notre parcours</p>
            <h2 class="font-heading text-4xl text-charcoal">Les grandes étapes</h2>
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
                    <h4 class="font-heading text-lg text-charcoal font-semibold">{{ event.title }}</h4>
                  </div>
                  <p class="text-gray-500 text-sm leading-relaxed">{{ event.description }}</p>
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
            <p class="text-rose-accent uppercase tracking-widest text-sm font-semibold mb-3">L'équipe</p>
            <h2 class="font-heading text-4xl text-charcoal">Des passionnés du végétal</h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div *ngFor="let member of team" class="text-center">
              <img
                [src]="member.photo"
                [alt]="member.name"
                class="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-md"
              />
              <h3 class="font-heading text-xl text-charcoal font-semibold">{{ member.name }}</h3>
              <p class="text-primary-green text-sm font-medium mb-2">{{ member.role }}</p>
              <p class="text-gray-500 text-sm">{{ member.bio }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="py-20 bg-primary-green">
        <div class="container-custom text-center">
          <h2 class="font-heading text-4xl text-white mb-5">Travaillons ensemble</h2>
          <p class="text-green-100 max-w-lg mx-auto mb-10 text-lg">
            Chaque projet floral mérite une attention particulière. Discutons de vos envies.
          </p>
          <a routerLink="/contact">
            <button pButton
              label="Prendre contact"
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
    {
      icon: 'pi pi-leaf',
      title: 'Éco-responsable',
      description: 'Nous privilégions les producteurs locaux et les pratiques durables pour réduire notre impact environnemental.'
    },
    {
      icon: 'pi pi-heart',
      title: 'Fait avec amour',
      description: 'Chaque création est unique et réalisée à la main avec le plus grand soin et attention aux détails.'
    },
    {
      icon: 'pi pi-star',
      title: 'Excellence',
      description: 'Nous ne sélectionnons que les plus belles fleurs de saison, fraîches et de qualité premium.'
    },
    {
      icon: 'pi pi-users',
      title: 'À votre écoute',
      description: 'Chaque client est unique. Nous prenons le temps de comprendre vos envies pour créer la composition parfaite.'
    }
  ];

  timeline = [
    {
      year: '2012',
      title: 'Ouverture de la boutique',
      description: 'Marie ouvre Ars Botanica dans une petite boutique du Marais à Paris.',
      icon: 'pi pi-home'
    },
    {
      year: '2015',
      title: 'Premier mariage',
      description: 'Ars Botanica décore pour la première fois un mariage dans un château de la Loire.',
      icon: 'pi pi-heart'
    },
    {
      year: '2018',
      title: 'Agrandi & rénové',
      description: 'La boutique double de surface pour accueillir un atelier de création ouvert aux stages.',
      icon: 'pi pi-building'
    },
    {
      year: '2021',
      title: 'Label Éco-Fleuriste',
      description: 'Obtention du label national pour notre démarche environnementale exemplaire.',
      icon: 'pi pi-verified'
    },
    {
      year: '2024',
      title: 'Lancement en ligne',
      description: 'Ars Botanica lance son site vitrine pour toucher encore plus de clients partout en France.',
      icon: 'pi pi-globe'
    }
  ];

  team = [
    {
      name: 'Marie Lecomte',
      role: 'Fondatrice & Créatrice',
      bio: 'Artiste florale depuis 12 ans, spécialisée en créations de mariage.',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80'
    },
    {
      name: 'Sophie Arnaud',
      role: 'Artiste Florale',
      bio: 'Passionnée de botanique et de compositions minimalistes.',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&q=80'
    },
    {
      name: 'Léa Martin',
      role: 'Conseil & Événements',
      bio: 'Expert en décoration événementielle et mariages sur mesure.',
      photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop&q=80'
    }
  ];
}
