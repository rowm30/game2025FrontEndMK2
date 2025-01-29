import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DecimalPipe, NgForOf } from '@angular/common';
// @ts-ignore
import { Topic } from '../../models/topic';
import {environment} from "../../enviroment"; // Ensure this path is correct

@Component({
    selector: 'app-sql',
    templateUrl: './sql.component.html',
    imports: [NgForOf, DecimalPipe, HttpClientModule],
    styleUrls: ['./sql.component.scss']
})
export class SqlComponent implements OnInit {
  topics: Topic[] = [];
  progress: number = 0;

  subQuestCompletion: number = 0;
  mainQuestCompletion: number = 0;
  sideQuestCompletion: number = 0;
  overallCompletion: number = 0;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTopics();
  }

  loadTopics(): void {
    const userId = localStorage.getItem('selectedUserId') || '7';
    const apiUrl = `${environment.apiBaseUrl}/api/quests/user/${userId}`;

    this.http.get<any>(apiUrl, {
      params: { questType: 'Main', questSubtype: 'SQL' },
    }).subscribe({
      next: (response) => {
        this.topics = response.topics || [];
        this.subQuestCompletion = response.subQuestCompletion || 0;
        this.mainQuestCompletion = response.mainQuestCompletion || 0;
        this.sideQuestCompletion = response.sideQuestCompletion || 0;
        this.overallCompletion = response.overallCompletion || 0;
        this.calculateProgress();
      },
      error: (err) => console.error('Error fetching topics:', err),
    });
  }

  toggleTopicCompletion(index: number): void {
    this.topics[index].completed = !this.topics[index].completed;

    const userId = localStorage.getItem('selectedUserId') || '7';
    const updateUrl = `${environment.apiBaseUrl}/api/user-progress/update`;

    this.http.post(updateUrl, {
      userId: userId,
      topicId: this.topics[index].id,
      completed: this.topics[index].completed,
    }).subscribe({
      next: () => {
        console.log('Progress updated successfully');
        this.calculateProgress();
      },
      error: (err) => console.error('Error updating progress:', err),
    });
  }

  calculateProgress(): void {
    const completedTopics = this.topics.filter(topic => topic.completed).length;
    this.progress = this.topics.length
      ? (completedTopics / this.topics.length) * 100
      : 0;
  }

  goBack(): void {
    this.router.navigate(['/main-quest']);
  }
}
