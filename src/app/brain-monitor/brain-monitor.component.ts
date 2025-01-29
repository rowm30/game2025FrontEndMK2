import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../enviroment';
import { NgForOf } from '@angular/common';

// CHART CONFIG: Imports from ng2-charts
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartData, ChartType } from 'chart.js';

interface BrainMonitor {
  id?: number;
  userId: number;
  wakeUpTimestamp: string; // We'll store date-time in a string
}

@Component({
    selector: 'app-brain-monitor',
    // Add NgChartsModule to the imports
    imports: [FormsModule, NgForOf, NgChartsModule],
    templateUrl: './brain-monitor.component.html',
    styleUrls: ['./brain-monitor.component.scss']
})
export class BrainMonitorComponent implements OnInit {
  monitors: BrainMonitor[] = [];
  brainMonitorData: BrainMonitor = {
    userId: 7, // example userId
    wakeUpTimestamp: ''
  };

  // CHART CONFIG: chart options
  public energyChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Hours Since Waking'
        },
        ticks: {
          stepSize: 2
        },
        grid: {
          display: false
        }
      },
      y: {
        title: {
          display: true,
          text: 'Energy Level (%)'
        },
        min: 0,
        max: 100,
        grid: {
          display: true
        }
      }
    },
    plugins: {
      tooltip: {
        // Customize tooltip if desired
        callbacks: {
          label: (context) => {
            const hour = context.parsed.x;
            const energy = context.parsed.y;
            return `Hour: ${hour}, Energy: ${energy}%`;
          }
        }
      },
      legend: {
        display: false
      }
    }
  };

  // CHART CONFIG: chart data
  public energyChartData: ChartData<'line'> = {
    labels: [], // We'll fill these dynamically
    datasets: [
      {
        data: [],
        fill: true,
        tension: 0.3,
        borderColor: '#009688',
        backgroundColor: 'rgba(0, 150, 136, 0.2)',
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  };
  public energyChartType: ChartType = 'line';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.brainMonitorData.wakeUpTimestamp = this.getISTTimestamp();
    this.loadBrainMonitorData();

    // Initialize chart data on component load
    this.generateEnergyChartData();
  }

  /**
   * loadBrainMonitorData retrieves existing data if necessary.
   */
  loadBrainMonitorData(): void {
    const apiUrl = `${environment.apiBaseUrl}/user/getAllBrainMonitors`;
    this.http.get<BrainMonitor[]>(apiUrl).subscribe({
      next: (data) => {
        this.monitors = data;
      },
      error: (error) => {
        console.error('Failed to fetch brain monitors:', error);
      }
    });
  }

  /**
   * saveBrainMonitorData constructs a request body with the local time in IST,
   * then sends a POST request to the server.
   */
  saveBrainMonitorData(): void {
    this.brainMonitorData.wakeUpTimestamp = this.getISTTimestamp();

    const apiUrl = `${environment.apiBaseUrl}/user/createBrainMonitor`;
    this.http.post<BrainMonitor>(apiUrl, this.brainMonitorData).subscribe({
      next: (response) => {
        console.log('Brain monitor data saved successfully', response);
        // Optionally refresh the chart after saving
        this.generateEnergyChartData();
      },
      error: (error) => {
        console.error('Failed to save brain monitor data:', error);
      }
    });
  }

  /**
   * Returns the current time in IST (UTC+05:30) as an ISO8601 string.
   * e.g. '2025-01-29T06:48:00+05:30'
   */
  private getISTTimestamp(): string {
    const now = new Date();
    // IST is UTC +5:30 => 330 minutes
    const istOffset = 330;
    // Convert current time to IST by adding offset
    const istTime = new Date(now.getTime() + istOffset * 60 * 1000);

    // Format it as YYYY-MM-DDTHH:mm:ss+05:30
    const year = istTime.getFullYear();
    const month = String(istTime.getMonth() + 1).padStart(2, '0');
    const day = String(istTime.getDate()).padStart(2, '0');
    const hours = String(istTime.getHours()).padStart(2, '0');
    const minutes = String(istTime.getMinutes()).padStart(2, '0');
    const seconds = String(istTime.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+05:30`;
  }

  /**
   * generateEnergyChartData simulates the energy level from wake-up time = 0h
   * to 24 hours later. 100% at hour 0, linearly drops to 0% at hour 18,
   * and stays at 0% until hour 24.
   */
  private generateEnergyChartData(): void {
    // For demonstration, we assume any wake-up time is "hour 0" for the chart.
    // We just plot from 0..24 hours.
    const hours = Array.from({ length: 25 }, (_, i) => i); // [0..24]
    const data = hours.map((h) => {
      // From hour 0 to hour 18: linear drop from 100% -> 0%
      // After hour 18: remain at 0
      if (h <= 18) {
        const slope = 100 / 18;
        return Math.max(100 - slope * h, 0);
      } else {
        return 0;
      }
    });

    // Update labels and data
    this.energyChartData.labels = hours.map((h) => `${h}h`); // e.g. "0h", "1h", ...
    this.energyChartData.datasets[0].data = data;
  }
}
