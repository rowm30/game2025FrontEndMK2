import { Routes } from '@angular/router';
import {WelcomeComponent} from "./welcome/welcome.component";
import {SelectUserComponent} from "./select-user/select-user.component";
import {QuestSelectionComponent} from "./quest-selection/quest-selection.component";
import {MainQuestComponent} from "./main-quest/main-quest.component";
import {SqlComponent} from "./main-quest/sql/sql.component";
import {JavaComponent} from "./main-quest/java/java.component";
import {DsaComponent} from "./main-quest/dsa/dsa.component";
import {SpringBootComponent} from "./main-quest/spring-boot/spring-boot.component";
import {SideQuestComponent} from "./side-quest/side-quest.component";
import {DailyConquestComponent} from "./daily-conquest/daily-conquest.component";

export const routes: Routes = [
  { path: '', redirectTo: 'app-select-user', pathMatch: 'full' },
  { path: 'app-select-user', component: SelectUserComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'main-quest', component: MainQuestComponent },
  { path: 'main-quest/java', component: JavaComponent },
  { path: 'main-quest/dsa', component: DsaComponent },
  { path: 'main-quest/spring-boot', component: SpringBootComponent },
  { path: 'main-quest/sql', component: SqlComponent },
  { path: 'side-quest', component: SideQuestComponent },
  { path: 'quest-selection', component: QuestSelectionComponent },
  { path: 'daily-conquest', component: DailyConquestComponent },
];
