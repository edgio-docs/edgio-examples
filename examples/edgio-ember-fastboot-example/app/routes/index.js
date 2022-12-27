import Route from "@ember/routing/route";

export default class IndexRoute extends Route {
  model() {
    return {
      message:
        "This is a simple example of a Ember Fastboot app deployed on Edgio.",
    };
  }
}
