/*
 * Copyright 2020 Bloomreach
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
// eslint-disable-next-line import/no-extraneous-dependencies
import install from "@layer0/prefetch/window/install";

import "bootstrap/dist/css/bootstrap.css";

import "./index.scss";
import App from "./App";
import { ErrorContextProvider } from "./ErrorContext";
import ScrollToTop from "./ScrollToTop";

install();

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <BrowserRouter>
        <Switch>
          <Route
            path="/(.*)"
            render={() => (
              <ErrorContextProvider>
                <ScrollToTop />
                <App />
              </ErrorContextProvider>
            )}
          />
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
