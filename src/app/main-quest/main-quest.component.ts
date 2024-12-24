import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {environment} from "../enviroment";

@Component({
  selector: 'app-main-quest',
  templateUrl: './main-quest.component.html',
  standalone: true,
  imports: [HttpClientModule],
  styleUrls: ['./main-quest.component.scss'],
})
export class MainQuestComponent implements OnInit {
  progressMap: { [key: string]: number } = {}; // Map to store progress dynamically

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProgress();
  }

  loadProgress(): void {
    const userId = localStorage.getItem('selectedUserId') || '7';
    const apiUrl = `${environment.apiBaseUrl}/api/main-quests`;


    this.http.get<any[]>(apiUrl, { params: { userId: userId } }).subscribe({
      next: (data) => {
        // Map quest names to their progress values
        data.forEach((quest) => {
          this.progressMap[quest.name] = quest.progress;
        });
      },
      error: (error) => console.error('Error fetching main quests progress:', error),
    });
  }

  selectQuest(route: string): void {
    console.log(`Navigating to route: ${route}`);
    this.router.navigate([route]);
  }

  goBack(): void {
    this.router.navigate(['/quest-selection']);
  }
}
