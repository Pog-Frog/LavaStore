import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { BannerComponent } from '../../banner/banner.component';
import { HomeContentComponent } from '../../home-content/home-content.component';
import { FooterComponent } from "../../footer/footer.component";

@Component({
  selector: 'app-base',
  imports: [HeaderComponent, BannerComponent, HomeContentComponent, FooterComponent],
  templateUrl: './base.component.html',
  styleUrl: './base.component.css'
})
export class BaseComponent {

}
