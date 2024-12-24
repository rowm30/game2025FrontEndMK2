import { Component, OnInit } from '@angular/core';
import {RouterLink} from "@angular/router";

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

  ngOnInit(): void {
    // Fetch or calculate progress for each quest
    this.loadQuestProgress();
  }

  loadQuestProgress(): void {
    // Mock data: Replace with actual logic to fetch progress (e.g., API or local storage)
    this.mainQuestProgress = 70; // Example: Main Quest is 70% completed
    this.sideQuestProgress = 40; // Example: Side Quest is 40% completed
  }
}
