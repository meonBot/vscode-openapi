/*
 Copyright (c) 42Crunch Ltd. All rights reserved.
 Licensed under the GNU Affero General Public License version 3. See LICENSE.txt in the project root for license information.
*/

import * as path from "path";
import * as vscode from "vscode";
import { Audit } from "../types";
import { readFileSync } from "fs";

export class AuditReportWebView {
  private panel?: vscode.WebviewPanel;
  private style: string;
  private script: vscode.Uri;

  constructor(extensionPath: string) {
    this.script = vscode.Uri.file(
      path.join(extensionPath, "webview", "generated", "audit", "index.js")
    );

    this.style = readFileSync(
      path.join(extensionPath, "webview", "generated", "audit", "style.css"),
      { encoding: "utf-8" }
    );
  }

  public show(extensionPath: string, kdb: any, audit: Audit) {
    if (!this.panel) {
      this.panel = this.createPanel(kdb);
    }
    this.panel.webview.postMessage({ command: "show", audit });
  }

  public showIds(extensionPath: string, kdb: any, audit: Audit, uri: string, ids: any[]) {
    if (!this.panel) {
      this.panel = this.createPanel(kdb);
    }
    this.panel.webview.postMessage({ command: "showIds", audit, uri, ids });
  }

  public showIfVisible(audit: Audit) {}

  public showNoReport(context: vscode.ExtensionContext) {}

  public dispose() {}

  private createPanel(kdb: any): vscode.WebviewPanel {
    const panel = vscode.window.createWebviewPanel(
      "security-audit-report",
      "Security Audit Report",
      {
        viewColumn: vscode.ViewColumn.Two,
        preserveFocus: true,
      },
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    panel.webview.html = this.getHtml(
      panel.webview.cspSource,
      kdb,
      panel.webview.asWebviewUri(this.script),
      this.style
    );

    panel.onDidDispose(() => (this.panel = undefined));

    return panel;
  }

  private getHtml(cspSource: string, kdb: any, script: vscode.Uri, style: string): string {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="Content-Security-Policy"  content="default-src 'none';  img-src ${cspSource} https: data:; script-src ${cspSource} 'unsafe-inline'; style-src ${cspSource}  'unsafe-inline'; connect-src http: https:">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${style}</style>
      <style>
        body {
        background-color: #FEFEFE;
        }
      </style>
    </head>
    <body>
    <div id="root"></div>
    <script type="application/json" id="kdb">${JSON.stringify(kdb)}</script>
  
    <script src="${script}"></script>
    <script>
    window.addEventListener("DOMContentLoaded", (event) => {
      console.log('content loaded');
      const kdb = JSON.parse(document.getElementById("kdb").textContent);
      window.addEventListener('message', event => {
        console.log('got message', event);
        const message = event.data;
              switch (message.command) {
                  case 'show':
                      window.renderAuditReport(kdb, message.audit, null, null);
                      break;
                  case 'showIds':
                      console.log("show ids", message.ids, message.uri);
                      window.renderAuditReport(kdb, message.audit, message.uri, message.ids);
                      break;
              }
      });
      console.log("all done");
    });
    </script>
    </body>
    </html>`;
  }
}
