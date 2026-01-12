# Ret.ai — Retail Layout Decision Tool (Case Study)

**Ret.ai** is a lightweight internal tool concept for designing and evaluating physical retail layouts. It helps teams visually organize shelves and sections inside a store and understand how layout decisions impact operational and commercial metrics.

> **Note:** This project is not a production product. It is a portfolio case study focused on interaction design, complex front-end state management, and decision-support tooling.

## Problem

In physical retail environments (supermarkets, department stores, convenience stores), layout decisions are often made using intuition, static diagrams, or spreadsheets. These approaches make it hard to:

- Reason about spatial relationships between sections
- Experiment with alternative layouts quickly
- Visualize tradeoffs such as exposure, congestion, or cross-sell potential

## Solution

Ret.ai provides a visual, interactive canvas where users can:

- **Place, move, resize, and rotate** store sections (shelves, promo areas, etc.)
- **Inspect and edit** section properties (name, color, orientation)
- **Immediately see** updated layout metrics as changes are made
- **Export** the resulting layout as structured data (JSON)

The tool is designed as a **decision-support system**: AI and metrics suggest improvements, but the user remains in control.

## Key Features (MVP)

### Canvas-based editor
- Drag-and-drop shelves/sections
- Visual grid for spatial orientation
- Selection and transformation handles

### Property panel
- Edit selected section's name, color, and orientation
- Simple, form-driven UI (no canvas-drawn controls)

### Live layout metrics (heuristic)
- Exposure score
- Cross-sell proximity
- Congestion risk
- Checkout/impulse positioning indicators

### AI-assisted suggestions
- Convert high-level goals or constraints into layout recommendations
- AI acts as an assistant, not an automated optimizer

### Export
- Layout can be exported as JSON for further analysis or integration

## Design Philosophy

- **Internal-tool mindset**: pragmatic, functional, and fast to iterate
- **Human-in-the-loop AI**: AI proposes; humans decide
- **Abstract units**: spatial relationships matter more than real-world measurements
- **Fast + ugly first**: MVP prioritizes behavior and interaction over polish

## What This Project Demonstrates

- Advanced non-CRUD front-end work (canvas, interactions, transformations)
- Clear separation between domain models, UI state, and rendering
- Product thinking applied to real-world, constraint-heavy problems
- Practical use of AI inside a real application context
- Ability to design and implement internal decision-support tools

## Technical Stack

- **Angular 20** with standalone components and signal-based reactivity
- **Konva.js** for canvas rendering and shape manipulation
- **TypeScript** for type-safe domain modeling
- **SCSS** for styling

## Development server

To start a local development server, run:

```bash
npm install
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`.

## Building

To build the project:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory.
