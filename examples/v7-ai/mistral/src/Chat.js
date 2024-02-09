import { doChatStream } from "./util.js"

export function Chat() {
    return (
      <div className="container">
          <h1 className="title has-text-centered">
          Web Stream Example
          </h1>
          <div className="field">
          <label className="label" htmlFor="apiKey">
              API Key
          </label>
          <div className="control">
              <input className="input" type="text" id="apiKey" name="apiKey" placeholder="API Key"/>
          </div>
          </div>
          <div id="output" className="message is-info"></div>
          <div className="field">
          <label className="label" htmlFor="question">
              Question
          </label>
          <div className="control">
              <input className="input" type="text" id="chat" name="question" placeholder="Enter your question"/>
          </div>
          </div>
          <div className="field">
          <div className="control">
              <button className="button is-primary" onClick={doChatStream}>
              Submit
              </button>
          </div>
          </div>
          <div id="error" className="message is-danger"></div>
      </div>
    )
  }