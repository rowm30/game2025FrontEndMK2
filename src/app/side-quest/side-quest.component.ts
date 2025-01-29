import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { NgForOf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {environment} from "../enviroment";

interface QuestProgress {
  name: string;
  progress: number;
  route: string;
}

@Component({
    selector: 'app-side-quest',
    templateUrl: './side-quest.component.html',
    imports: [
        NgForOf,
        HttpClientModule
    ],
    styleUrls: ['./side-quest.component.scss']
})
export class SideQuestComponent implements OnInit {
  sideQuests: QuestProgress[] = [];
  isBrowser: boolean = false;

  constructor(private router: Router, private http: HttpClient, @Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loadProgress();
  }

  loadProgress(): void {
    // Only attempt to access localStorage if we're in the browser
    const userId = this.isBrowser ? localStorage.getItem('selectedUserId') || '7' : '7';
    const apiUrl = `${environment.apiBaseUrl}/api/side-quests`;

    this.http.get<QuestProgress[]>(apiUrl, { params: { userId: userId } }).subscribe({
      next: (data) => {
        this.sideQuests = data;
      },
      error: (error) => console.error('Error fetching side quests progress:', error)
    });
  }

  selectQuest(quest: QuestProgress): void {
    console.log(`Selected Quest: ${quest.name}`);
    this.router.navigate([quest.route]);
  }

  goBack(): void {
    this.router.navigate(['/quest-selection']);
  }
}
