/*
 Copyright (c) 42Crunch Ltd. All rights reserved.
 Licensed under the GNU Affero General Public License version 3. See LICENSE.txt in the project root for license information.
*/

import * as vscode from "vscode";

import { OasWithOperation } from "@xliic/common/messages/tryit";
import { NamedEnvironment } from "@xliic/common/messages/env";
import { Preferences } from "@xliic/common/messages/prefs";

import { Webapp } from "@xliic/common/webapp/tryit";

import { WebView, WebViewResponseHandler } from "../web-view";
import { executeHttpRequest } from "./http-handler";
import { executeCreateSchemaRequest } from "./create-schema-handler";
import { Cache } from "../cache";
import { EnvStore } from "../envstore";

export class TryItWebView extends WebView<Webapp> {
  private document?: vscode.TextDocument;
  responseHandlers: WebViewResponseHandler<Webapp> = {
    sendRequest: executeHttpRequest,
    createSchema: async (response: any) => {
      executeCreateSchemaRequest(this.document!, this.cache, response);
    },
    saveConfig: async (config: any) => {
      vscode.workspace
        .getConfiguration("openapi")
        .update("tryit.insecureSslHostnames", config.insecureSslHostnames);
    },
    saveEnv: async (env: NamedEnvironment) => {
      this.envStore.save(env);
    },
    savePrefs: async (prefs: Preferences) => {
      this.prefs[this.document!.uri.toString()] = prefs;
    },
  };

  constructor(
    extensionPath: string,
    private cache: Cache,
    private envStore: EnvStore,
    private prefs: Record<string, Preferences>
  ) {
    super(extensionPath, "tryit", "Try It", vscode.ViewColumn.Two);
    envStore.onEnvironmentDidChange((env) => {
      if (this.isActive()) {
        this.sendRequest({
          command: "loadEnv",
          payload: { default: undefined, secrets: undefined, [env.name]: env.environment },
        });
      }
    });
  }

  async sendTryOperation(document: vscode.TextDocument, payload: OasWithOperation) {
    this.document = document;
    this.sendRequest({ command: "loadEnv", payload: await this.envStore.all() });
    const prefs = this.prefs[this.document.uri.toString()];
    if (prefs) {
      this.sendRequest({ command: "loadPrefs", payload: prefs });
    }
    return this.sendRequest({ command: "tryOperation", payload });
  }
}
