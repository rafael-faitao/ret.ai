import { Component, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { PropertyBarService } from '../../services/property-bar.service';

interface Metric {
  key: string;
  title: string;
  info: string;
  value?: number;
}

@Component({
  selector: 'app-analytics-bar',
  standalone: true,
  templateUrl: './analytics-bar.component.html',
  styleUrl: './analytics-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsBarComponent {
  private propertyBarService = inject(PropertyBarService);

  protected shelfSignal = this.propertyBarService.selectedShelf;
  protected layoutSignal = this.propertyBarService.activeLayout;

  protected metrics: Metric[] = [
    {
      key: 'exposure',
      title: 'Exposure Score',
      info: 'How visible a shelf is based on proximity to entrance, checkout, and main flow areas.'
    },
    {
      key: 'impulse',
      title: 'Impulse Potential',
      info: 'Likelihood of unplanned purchases near checkout and high-traffic paths, weighted by average ticket.'
    },
    {
      key: 'crossSell',
      title: 'Cross-Sell Proximity',
      info: 'How close complementary categories are (e.g., snacks ↔ beverages), using a simple affinity matrix.'
    },
    {
      key: 'flowInterception',
      title: 'Flow Interception',
      info: 'How many shelves a customer is likely to pass before reaching checkout.'
    },
    {
      key: 'congestionPenalty',
      title: 'Congestion Penalty',
      info: 'Negative score for overcrowded or high-traffic bottlenecks that reduce browsing time.'
    }
  ];

  protected suggestions: string[] = [];

  constructor() {
    // Update metric values when selected shelf changes (mock heuristic)
    effect(() => {
      const shelf = this.shelfSignal();
      if (!shelf) {
        this.metrics.forEach(m => (m.value = undefined));
        return;
      }
      // Simple random values between 0 and 100 for each metric
      this.metrics.forEach(m => {
        m.value = Math.round(Math.random() * 100);
      });
    });
  }

  protected analyzeNow(): void {
    // Populate mock suggestions and hide the button
    this.suggestions = [
      'Move Electronics closer to main entrance to increase exposure.',
      'Relocate Snacks near Beverages to improve cross-sell opportunities.',
      'Reduce congestion by spacing shelves along the main flow path.'
    ];
  }
}
