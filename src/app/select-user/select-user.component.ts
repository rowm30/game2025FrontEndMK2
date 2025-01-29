import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import {Router} from "@angular/router";
import {environment} from "../enviroment";

@Component({
    selector: 'app-select-user',
    templateUrl: './select-user.component.html', // Standalone component declaration
    imports: [
        HttpClientModule, // Required for HttpClient to work
        FormsModule,
        NgForOf
    ],
    styleUrls: ['./select-user.component.scss']
})
export class SelectUserComponent implements OnInit {
  users: any[] = []; // List of existing users
  newUsername: string = ''; // For creating a new user

  constructor(private http: HttpClient,  private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.http.get<any[]>('http://localhost:8080/user/getAll').subscribe(
      data => {
        this.users = data;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
  }

  selectUser(userId: number): void {
    console.log('Selected User ID:', userId);
    const selectedUser = this.users.find(user => user.id === userId);

    if (selectedUser) {
      // Save user data in localStorage for persistence
      localStorage.setItem('selectedUser', JSON.stringify(selectedUser));

      // Navigate to WelcomeComponent with state
      this.router.navigateByUrl('/welcome', { state: { user: selectedUser } });
    }
  }

  createUser(): void {
    if (this.newUsername.trim()) {
      const newUser = { username: this.newUsername, overallProgress: 0 };
      this.http.post('http://localhost:8080/user/create', newUser).subscribe(
        () => {
          this.newUsername = ''; // Clear the input field
          this.fetchUsers(); // Refresh the user list
        },
        error => {
          console.error('Error creating user:', error);
        }
      );
    } else {
      alert('Username cannot be empty!');
    }
  }
}
