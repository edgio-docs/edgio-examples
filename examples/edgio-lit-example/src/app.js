import { html, css, LitElement } from 'lit'

import MyApp from './components/MyApp'

export class App extends LitElement {
  constructor() {
    super()
    window.css = css
    window.html = html
    window.LitElement = LitElement
  }

  render() {
    return MyApp(this.pageData)
  }
}

customElements.define('app-html', App)
