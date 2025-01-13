import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-quest-selection',
  templateUrl: './quest-selection.component.html',
  imports: [
    RouterLink
  ],
  standalone: true,
  styleUrls: ['./quest-selection.component.scss']
})
export class QuestSelectionComponent implements OnInit {
  mainQuestProgress: number = 0; // Progress for Main Quest
  sideQuestProgress: number = 0; // Progress for Side Quest

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch or calculate progress for each quest
    this.loadQuestProgress();

  }

  loadQuestProgress(): void {

    const userId = 7;  // Assuming user ID is static, modify as necessary
    this.http.get<number>(`http://localhost:8080/api/quests/user/${userId}/overall-completion`, {
      headers: {
        Accept: 'application/json'
      }
    }).subscribe({
      next: (progress: number) => {
        this.mainQuestProgress = progress;
      },
      error: (error) => {
        console.error('Error fetching game progress:', error);
        this.mainQuestProgress = 0;  // Set to 0 or any fallback logic
      }
    });
    // Mock data: Replace with actual logic to fetch progress (e.g., API or local storage)
    this.mainQuestProgress = 70; // Example: Main Quest is 70% completed
    this.sideQuestProgress = 40; // Example: Side Quest is 40% completed
  }
}
