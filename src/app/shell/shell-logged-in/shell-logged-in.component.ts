import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ShellLoggedInSidebarComponent } from './components/shell-logged-in-sidebar/shell-logged-in-sidebar.component';
import { EventsService } from '../../services/events-service/events.service';

@Component({
  selector: 'app-shell-logged-in',
  imports: [ CommonModule, RouterOutlet, ShellLoggedInSidebarComponent ],
  templateUrl: './shell-logged-in.component.html',
  styleUrl: './shell-logged-in.component.css',
  providers: [
    EventsService,
  ],
})
export class ShellLoggedInComponent {
}
