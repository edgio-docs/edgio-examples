import { Component, OnInit, Inject } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { PLATFORM_ID } from '@angular/core'
import install from '@edgio/prefetch/window/install'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isBrowser: boolean
  title = 'edgio-spartacus-example'

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId)
  }

  ngOnInit() {
    setTimeout(() => {
      if (this.isBrowser) {
        install({
          includeCacheMisses: true,
        })
      }
    })
  }
}
