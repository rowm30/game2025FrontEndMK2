import {Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../enviroment";
import {DecimalPipe, NgForOf} from "@angular/common"; // Ensure this import points to the correct file

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
  imports: [
    DecimalPipe,
    NgForOf
  ],
  styleUrls: ['./java.component.scss']
})
export class JavaComponent implements OnInit {
  topics: Topic[] = [];
  progress: number = 0;
  subQuestCompletion: number = 0;
  mainQuestCompletion: number = 0;
  sideQuestCompletion: number = 0;
  overallCompletion: number = 0;

  @ViewChildren('checkbox') checkboxes!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTopics();
  }

  loadTopics(): void {
    const userId = localStorage.getItem('selectedUserId') || '7';
    const apiUrl = `${environment.apiBaseUrl}/api/quests/user/${userId}`;

    this.http.get<any>(apiUrl, {
      params: { questType: 'Main', questSubtype: 'Java' },
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

  toggleCard(index: number): void {
    this.checkboxes.toArray()[index].nativeElement.click(); // Programmatically click the checkbox
  }



  toggleTopicCompletion(index: number): void {
    const topic = this.topics[index];
    topic.completed = !topic.completed;
    this.calculateProgress();
    // Optionally, you could also update this change on the server here
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
    this.progress = this.topics.length ? (completedTopics / this.topics.length) * 100 : 0;

  }

  goBack(): void {
    this.router.navigate(['/main-quest']);
  }

  isMobile(): boolean {
    return window.innerWidth <= 767; // Adjust breakpoint as needed
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Optional: You could recalculate some layout related variables here if needed on resize
  }
}
