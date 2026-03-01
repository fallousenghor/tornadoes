# 🏢 Aevum Enterprise Dashboard

Dashboard React complet avec 10+ types de graphiques.

## Stack
- React 18
- Recharts (graphiques)
- Vite (bundler)

## Installation & Démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en développement
npm run dev

# 3. Ouvrir dans le navigateur
# http://localhost:3000
```

## Build Production

```bash
npm run build
npm run preview
```

## Graphiques inclus

| Type | Description |
|------|-------------|
| Area Chart | Performance financière annuelle |
| Pie Chart | Ventes par région |
| Composed Chart | Barres + Ligne + Zone |
| Funnel Chart | Entonnoir commercial |
| Radar Chart | Performance équipes |
| Scatter Chart | Durée vs Valeur deals |
| Treemap | Répartition revenus |
| Heatmap SVG | Activité horaire |
| Gauge SVG | Objectifs annuels |
| Stacked Bar | Sources de CA |
| Bar Chart | Trafic hebdomadaire |
| Sparklines | Mini-tendances KPI |

## Structure

```
aevum-dashboard/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx          # Point d'entrée React
    └── Dashboard.jsx     # Composant principal
```
