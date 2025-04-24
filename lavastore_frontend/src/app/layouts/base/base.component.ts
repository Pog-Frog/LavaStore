import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { BannerComponent } from '../../banner/banner.component';

@Component({
  selector: 'app-base',
  imports: [HeaderComponent, BannerComponent],
  templateUrl: './base.component.html',
  styleUrl: './base.component.css'
})
export class BaseComponent {

}
