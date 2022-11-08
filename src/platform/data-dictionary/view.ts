/*
 Copyright (c) 42Crunch Ltd. All rights reserved.
 Licensed under the GNU Affero General Public License version 3. See LICENSE.txt in the project root for license information.
*/

import * as vscode from "vscode";
import { Webapp } from "@xliic/common/webapp/data-dictionary";
import { DataDictionaryRequest } from "@xliic/common/messages/data-dictionary";
import { WebView } from "../../web-view";

export class DataDictionaryWebView extends WebView<Webapp> {
  responseHandlers = {
    noop: () => Promise.resolve(),
  };

  constructor(extensionPath: string) {
    super(extensionPath, "data-dictionary", "Data Dictionary Browser", vscode.ViewColumn.One);
  }

  async sendShowDictionaries(payload: DataDictionaryRequest["payload"]) {
    return this.sendRequest({ command: "showDictionary", payload });
  }
}
