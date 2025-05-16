import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from "../layouts/home/home.component";

@Component({
  selector: 'app-about',
  imports: [CommonModule, HomeComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
}
