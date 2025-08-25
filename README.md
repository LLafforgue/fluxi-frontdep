# Fluxi Front

Fluxi est une application **CRM/ERP** spécialement conçue pour répondre aux besoins des entreprises du secteur **agroalimentaire**.  
Son objectif est d’optimiser la **gestion commerciale**, **logistique** et **administrative** grâce à un outil complet, intuitif et moderne.

---

## ✨ Fonctionnalités principales

- **Gestion commerciale** : clients, commandes, productions.  
- **Suivi logistique** : stocks, livraisons.  
- **Interface utilisateur** : moderne, responsive et ergonomique.  

---

## 🛠 Technologies utilisées

- **React / Next.js**
- **Tailwind CSS**
- **Font Awesome**
- **Redux / Redux Persist**
- **Leaflet**
- **Ant Design**
- **FullCalendar**

---

## 🚀 Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/LMR13/fluxi-front.git
   cd fluxi-front
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Lancer l’application**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

---

## 📂 Structure du projet

```
fluxi-front/
├── components/
│   ├── calendar.jsx
│   ├── CientMap.jsx
│   ├── CustomerList.jsx
│   ├── MapComponents.jsx
│   ├── ProductionTable.jsx
│   ├── SearchTable.jsx
│   ├── Sidebar.jsx
│   ├── SupplierList.jsx
│   ├── UserMenu.jsx
├── pages/
│   ├── _app.jsx
│   ├── _dashboard.jsx
│   ├── customers/
│   │   ├── [id]/
│   │   │   ├── edit.jsx
│   │   │   ├── index.jsx
│   │   ├── index.jsx
│   │   ├── new.jsx
│   ├── index.jsx
│   ├── login.jsx
│   ├── logout.jsx
│   ├── orders/
│   │   ├── [id].jsx
│   │   ├── index.jsx
│   │   ├── new.jsx
│   ├── production/
│   │   ├── index.jsx
│   ├── settings.jsx
│   ├── stock/
│   │   ├── [id]/
│   │   │   ├── index.jsx
│   │   ├── index.jsx
│   │   ├── new.jsx
│   ├── suppliers/
│   │   ├── [id]/
│   │   │   ├── edit.jsx
│   │   │   ├── index.jsx
│   │   ├── index.jsx
│   │   ├── new.jsx
│   └── ...
├── public/
│   ├── image/
│   │   ├── logo.svg
├── reducers/
│   ├── user.js
├── utils/
│   ├── apiFetch.jsx
│   ├── Protected.jsx
├── package.json
└── README.md
```

---

## 🧪 Tests

Pour lancer les tests unitaires :
```bash
npm test
# ou
yarn test
```

---

## 👥 Auteurs

- **Lucas Meyer**  
- **Ludovic Lafforgue**  
- **Mattis Bueno**

---

## 📄 Licence

Ce projet est **privé** et non destiné à un usage public.
# fluxi-frontdep
