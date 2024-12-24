import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../enviroment"; // Ensure this import points to the correct file

interface Topic {
  id: number;
  name: string;
  description: string;
  completed: boolean;
}

@Component({
  selector: 'app-java',
  templateUrl: './java.component.html',
  standalone: true,
  styleUrls: ['./java.component.scss']
})
export class JavaComponent implements OnInit {
  topics: Topic[] = [];
  progress: number = 0;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTopics();
  }

  loadTopics(): void {
    const apiUrl = `${environment.apiBaseUrl}/topics`;
    this.http.get<Topic[]>(apiUrl).subscribe({
      next: (data) => {
        this.topics = data;
        this.calculateProgress();
      },
      error: (err) => console.error('Error fetching topics:', err)
    });
  }

  toggleTopicCompletion(index: number): void {
    const topic = this.topics[index];
    topic.completed = !topic.completed;
    this.calculateProgress();
    // Optionally, you could also update this change on the server here
  }

  calculateProgress(): void {
    const completedTopics = this.topics.filter(topic => topic.completed).length;
    this.progress = this.topics.length ? (completedTopics / this.topics.length) * 100 : 0;
  }

  goBack(): void {
    this.router.navigate(['/main-quest']);
  }
}
