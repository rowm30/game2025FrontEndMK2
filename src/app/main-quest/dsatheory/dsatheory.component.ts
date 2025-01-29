import {Component, ElementRef, HostListener, QueryList, ViewChildren} from '@angular/core';
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../enviroment";


interface Topic {
  id: number;
  name: string;
  description: string;
  completed: boolean;
}

interface DailyConquest {
  goalCount: number;
  completedCount: number;
  achieved: boolean;
}

@Component({
    selector: 'app-dsatheory',
    imports: [
        DecimalPipe,
        FormsModule,
        NgForOf,
        NgIf
    ],
    templateUrl: './dsatheory.component.html',
    styleUrl: './dsatheory.component.scss'
})
export class DsatheoryComponent {
  topics: Topic[] = [];
  progress: number = 0;
  subQuestCompletion: number = 0;
  mainQuestCompletion: number = 0;
  sideQuestCompletion: number = 0;
  overallCompletion: number = 0;
  dailyGoal: number = 0; // Stores the daily goal set by the user
  dailyProgress: number = 0; // Tracks the daily progress towards the goal
  userId: number = 7;
  showUncompletedOnly: boolean = true;
  filteredTopics: Topic[] = [];
  questType: string = 'Main';
  questSubtype: string = 'Java';
  dailyConquest: DailyConquest | null = null;


  @ViewChildren('checkbox') checkboxes!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTopics();
    this.fetchDailyConquest();
    // You might want to load this from a service or local storage
  }


  fetchDailyConquest(): void {
    const url = `${environment.apiBaseUrl}/api/daily-conquest/today?userId=${this.userId}&questType=${this.questType}&questSubtype=${this.questSubtype}`;
    this.http.get<DailyConquest>(url).subscribe({
      next: (data) => {
        this.dailyConquest = data;
        this.dailyGoal = data.goalCount;
        this.dailyProgress = data.completedCount;
      },
      error: (error) => console.error('Failed to fetch daily conquest data:', error)
    });
  }

  incrementDailyProgress(): void {
    const apiUrl = `${environment.apiBaseUrl}/api/daily-conquest/increment`;
    this.http.patch(apiUrl, {
      userId: this.userId,
      questSubtype: 'Java'
    }).subscribe({
      next: (response) => {
        console.log('Incremented daily progress successfully', response);
        this.dailyProgress++;
      },
      error: (err) => console.error('Error incrementing daily progress:', err)
    });
  }


  loadTopics(): void {
    const userId = localStorage.getItem('selectedUserId') || '7';
    const apiUrl = `${environment.apiBaseUrl}/api/quests/user/${userId}`;

    this.http.get<any>(apiUrl, {
      params: { questType: 'Main', questSubtype: 'DSA Theory' },
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

  updateFilteredTopics(): void {
    if (this.showUncompletedOnly) {
      this.filteredTopics = this.topics.filter(topic => !topic.completed);
    } else {
      this.filteredTopics = this.topics;
    }
  }

  toggleShowUncompletedOnly(): void {
    this.showUncompletedOnly = !this.showUncompletedOnly;
    this.updateFilteredTopics();
  }


  toggleTopicCompletion(index: number): void {
    const topic = this.topics[index];
    topic.completed = !topic.completed;
    const previouslyCompleted = topic.completed;
    this.calculateProgress();

    if (previouslyCompleted && topic.completed) {
      this.incrementDailyProgress();
    }
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

  setDailyGoal(): void {
    if (this.dailyGoal < 1) {
      alert('Please set a valid goal.');
      return;
    }

    const apiUrl = `${environment.apiBaseUrl}/api/daily-conquest/create`;  // Adjust this URL based on your actual environment configuration
    const payload = {
      userId: this.userId,               // Assuming this.userId is already defined and holds the current user's ID
      questSubtype: 'Java',              // This could be dynamic based on the context of your application
      goalCount: this.dailyGoal,         // The daily goal input by the user
      questType: 'Main'                  // Static or dynamic based on your application's needs
    };

    // Headers are set automatically by Angular HttpClient, including Content-Type as application/json
    this.http.post(apiUrl, payload, {headers: {'Accept': 'application/json'}}).subscribe({
      next: (response) => {
        console.log('Daily goal set successfully', response);
        this.dailyProgress = 0;  // Reset progress when goal is set
        // Optionally, refresh or update other parts of the component or application state here
      },
      error: (err) => {
        console.error('Error setting daily goal:', err);
        alert('Failed to set daily goal. Please try again.');
      }
    });
  }
}
