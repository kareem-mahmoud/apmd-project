import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {

  footerText = signal(`© ${new Date().getFullYear()} APMD. All rights reserved.`)

}
