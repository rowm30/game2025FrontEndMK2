import {Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {DecimalPipe, NgForOf, NgIf} from '@angular/common';
// @ts-ignore
import { Topic } from '../../models/topic';
import {environment} from "../../enviroment"; // Ensure this matches the correct path

@Component({
    selector: 'app-dsa',
    templateUrl: './dsa.component.html',
    imports: [NgForOf, DecimalPipe, HttpClientModule, NgIf],
    styleUrls: ['./dsa.component.scss']
})
export class DsaComponent implements OnInit {
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
      params: { questType: 'Main', questSubtype: 'DSA' },
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
  @ViewChildren('checkbox') checkboxes!: QueryList<ElementRef<HTMLInputElement>>;
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
  toggleCard(index: number): void {
    this.checkboxes.toArray()[index].nativeElement.click(); // Programmatically trigger the checkbox
  }




  goBack(): void {
    this.router.navigate(['/main-quest']);
  }
}
