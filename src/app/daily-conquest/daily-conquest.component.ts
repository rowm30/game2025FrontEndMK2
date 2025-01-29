import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// @ts-ignore
import {environment} from "../enviroment";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-daily-conquest',
    templateUrl: './daily-conquest.component.html',
    imports: [
        NgIf,
        FormsModule
    ],
    styleUrls: ['./daily-conquest.component.scss']
})
export class DailyConquestComponent implements OnInit {
  userId: number = 7;    // or get from localStorage
  questSubtype: string = 'Java'; // or dynamic
  goalCount: number = 0;
  dailyProgress: number = 0; // how many completed so far
  achieved: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Optionally load existing daily conquest for this date
    // Example: GET /api/daily-conquest/today?userId=7&questSubtype=Java
    // Then pre-fill goalCount, dailyProgress, achieved, etc.
  }

  setDailyGoal() {
    const url = `${environment.apiBaseUrl}/api/daily-conquest/create`;
    const body = {
      userId: this.userId,
      questSubtype: this.questSubtype,
      goalCount: this.goalCount
    };

    this.http.post<any>(url, body).subscribe({
      next: (data) => {
        // data will be the updated DailyConquest
        console.log('Daily conquest created/updated', data);
      },
      error: (err) => console.error('Error creating daily conquest', err)
    });
  }

  incrementProgress() {
    const url = `${environment.apiBaseUrl}/api/daily-conquest/increment`;
    const body = {
      userId: this.userId,
      questSubtype: this.questSubtype
    };

    this.http.patch<any>(url, body).subscribe({
      next: (updated) => {
        this.dailyProgress = updated.completedCount;
        this.achieved = updated.achieved;
        console.log('Daily progress incremented', updated);
      },
      error: (err) => console.error('Error incrementing daily progress', err)
    });
  }
}
