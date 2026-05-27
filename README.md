# 🚗 Mahafaly Rent — Application de Location de Voitures Premium

Application web full stack premium pour une entreprise de location de voitures à Madagascar.

## Stack Technique

- **Framework**: Next.js 15 (App Router)
- **Langage**: TypeScript
- **Styling**: TailwindCSS
- **ORM**: Prisma
- **Base de données**: PostgreSQL
- **Auth**: NextAuth.js v5 (Auth.js) + Google OAuth
- **Formulaires**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Icônes**: Lucide React
- **Cartes**: Leaflet + OpenStreetMap (gratuit)

---

## 📁 Structure du Projet

```
mahafaly-rent/
├── prisma/
│   ├── schema.prisma          # Schéma base de données
│   └── seed.ts                # Données de départ (6 voitures)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Layout racine (Navbar, Footer, WhatsApp)
│   │   ├── page.tsx           # Page d'accueil
│   │   ├── globals.css        # Styles globaux
│   │   ├── not-found.tsx      # Page 404
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx       # Page de connexion
│   │   │
│   │   ├── cars/
│   │   │   ├── page.tsx       # Liste des voitures + filtres
│   │   │   └── [id]/
│   │   │       └── page.tsx   # Détail voiture + formulaire réservation
│   │   │
│   │   ├── contact/
│   │   │   └── page.tsx       # Page contact + carte OpenStreetMap
│   │   │
│   │   ├── dashboard/
│   │   │   ├── user/
│   │   │   │   └── page.tsx   # Espace utilisateur
│   │   │   └── admin/
│   │   │       └── page.tsx   # Dashboard admin
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/route.ts
│   │       ├── cars/
│   │       │   └── route.ts
│   │       ├── bookings/
│   │       │   └── route.ts
│   │       └── admin/
│   │           ├── bookings/[id]/route.ts
│   │           └── cars/
│   │               ├── route.ts
│   │               └── [id]/route.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx     # Navbar transparente + scroll
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── providers/
│   │   │   └── SessionProvider.tsx
│   │   │
│   │   ├── ui/
│   │   │   └── WhatsAppButton.tsx  # Bouton flottant WhatsApp
│   │   │
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── FeaturedCars.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── FAQSection.tsx
│   │   │   └── CTASection.tsx
│   │   │
│   │   ├── cars/
│   │   │   ├── CarsGrid.tsx   # Liste avec filtres client-side
│   │   │   └── CarDetail.tsx  # Galerie + specs + formulaire
│   │   │
│   │   ├── booking/
│   │   │   └── BookingForm.tsx  # Formulaire + calcul prix + WhatsApp
│   │   │
│   │   ├── auth/
│   │   │   └── LoginForm.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── UserDashboard.tsx
│   │   │   └── AdminDashboard.tsx
│   │   │
│   │   └── maps/
│   │       ├── ContactPageClient.tsx
│   │       └── LocationMap.tsx   # Leaflet + OpenStreetMap
│   │
│   ├── lib/
│   │   ├── prisma.ts          # Singleton Prisma
│   │   └── utils.ts           # Helpers (prix, WhatsApp, dates...)
│   │
│   └── types/
│       └── index.ts           # Types TypeScript + next-auth
│
├── .env.example
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## ⚡ Installation & Démarrage

### 1. Prérequis

- Node.js 18+
- PostgreSQL
- Compte Google Cloud (pour OAuth)

### 2. Cloner et installer

```bash
git clone <repo-url>
cd mahafaly-rent
npm install
```

### 3. Variables d'environnement

```bash
cp .env.example .env
```

Remplir `.env` :

```env
# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/mahafaly_rent"

# NextAuth (générer avec: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-très-long"

# Google OAuth (console.cloud.google.com)
GOOGLE_CLIENT_ID="xxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxx"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="261340000000"
```

### 4. Base de données

```bash
# Créer la base de données
createdb mahafaly_rent

# Appliquer le schéma
npm run db:push

# Seed (6 voitures premium)
npm run db:seed
```

### 5. Configurer Google OAuth

1. Aller sur [console.cloud.google.com](https://console.cloud.google.com)
2. Créer un projet → APIs & Services → Credentials
3. Créer OAuth 2.0 Client ID
4. Ajouter les URIs autorisés :
   - `http://localhost:3000`
   - `http://localhost:3000/api/auth/callback/google`
5. Copier Client ID et Secret dans `.env`

### 6. Lancer en développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## 🔑 Rôles utilisateurs

| Rôle | Accès |
|------|-------|
| `USER` | Réservation, dashboard personnel |
| `ADMIN` | Tout + dashboard admin + CRUD |

### Passer un utilisateur en ADMIN

```bash
npm run db:studio
# Dans Prisma Studio, modifier le champ `role` de USER à ADMIN
```

Ou via SQL :
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'votre@email.com';
```

---

## 🗄️ Modèle de données

```prisma
User       { id, name, email, image, role }
Car        { id, name, brand, pricePerDay, transmission, type, seats, fuel, images[], features[], available }
Booking    { id, userId, carId, startDate, endDate, totalPrice, status }
```

**Statuts réservation** : `PENDING` → `APPROVED` | `CANCELLED`

---

## 📱 Fonctionnalités

### Utilisateur
- ✅ Connexion Google
- ✅ Parcourir les voitures (filtres : type, transmission, prix)
- ✅ Voir le détail d'un véhicule
- ✅ Réserver (dates + calcul automatique)
- ✅ Message WhatsApp pré-rempli après réservation
- ✅ Dashboard : historique + statuts

### Admin
- ✅ Dashboard avec statistiques
- ✅ Gestion des réservations (approuver / refuser)
- ✅ Gestion de la flotte (activer / désactiver)

### Site
- ✅ Page d'accueil premium (hero, features, testimonials, FAQ)
- ✅ Page contact avec carte OpenStreetMap (Leaflet)
- ✅ Bouton WhatsApp flottant partout
- ✅ Responsive mobile-first
- ✅ SEO optimisé
- ✅ Animations Framer Motion

---

## 🚀 Déploiement (Vercel + Railway)

```bash
# Build de production
npm run build

# Variables d'environnement sur Vercel :
# DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET
# GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
# NEXT_PUBLIC_WHATSAPP_NUMBER
```

Base de données recommandée en production : **Railway** ou **Neon** (PostgreSQL)

---

## 🎨 Design System

| Token | Valeur |
|-------|--------|
| Fond | `#000000` |
| Beige | `#F5F3EF` |
| Or | `#C49A4A` |
| Police display | Cormorant Garamond |
| Police corps | Geist Sans |

Inspiration : **Tesla · Apple · Uber Black · Airbnb**

---

## 📞 Support

WhatsApp : +261 34 00 000 00  
Email : contact@mahafaly-rent.mg
