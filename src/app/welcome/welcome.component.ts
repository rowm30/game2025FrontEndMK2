import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  standalone: true,
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  username: string = ''; // User's name
  gameProgress: number = 0; // Initial progress percentage

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadUserData();
    this.loadGameProgress();
  }

  loadUserData(): void {
    // Retrieve user data from router state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { user: any };

    if (state?.user) {
      this.username = state.user.username; // Fetch from router state
    } else {
      // Fallback to LocalStorage if router state is unavailable
      const storedUser = localStorage.getItem('selectedUser');
      if (storedUser) {
        this.username = JSON.parse(storedUser).username;
      }
    }
  }

  loadGameProgress(): void {
    // Mock progress load (replace with actual logic, e.g., API call or local storage)
    this.gameProgress = 45; // Example: 45% progress
  }

  goToQuestSelection(): void {
    // Navigate to the quest selection screen
    this.router.navigate(['/quest-selection']);
  }
}
