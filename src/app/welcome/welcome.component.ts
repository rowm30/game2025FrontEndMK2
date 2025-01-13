import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  standalone: true,
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  username: string = ''; // User's name
  gameProgress: number = 0; // Initial progress percentage

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.loadUserData();
    this.loadGameProgressFromAPI();
  }

  loadUserData(): void {
    // Retrieve user data from router state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { user: any };

    if (state?.user) {
      this.username = state.user.username;
    } else {
      const storedUser = localStorage.getItem('selectedUser');
      if (storedUser) {
        this.username = JSON.parse(storedUser).username;
      }
    }
  }

  loadGameProgressFromAPI(): void {
    const userId = 7;  // Assuming user ID is static, modify as necessary
    this.http.get<number>(`http://localhost:8080/api/quests/user/${userId}/overall-completion`, {
      headers: {
        Accept: 'application/json'
      }
    }).subscribe({
      next: (progress: number) => {
        this.gameProgress = progress;
      },
      error: (error) => {
        console.error('Error fetching game progress:', error);
        this.gameProgress = 0;  // Set to 0 or any fallback logic
      }
    });
  }

  goToQuestSelection(): void {
    // Navigate to the quest selection screen
    this.router.navigate(['/quest-selection']);
  }
}
