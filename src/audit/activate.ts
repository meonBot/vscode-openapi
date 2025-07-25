/*
 Copyright (c) 42Crunch Ltd. All rights reserved.
 Licensed under the GNU Affero General Public License version 3. See LICENSE.txt in the project root for license information.
*/

import * as vscode from "vscode";
import {
  registerSecurityAudit,
  registerFocusSecurityAudit,
  registerFocusSecurityAuditById,
  registerSingleOperationAudit,
  registerOutlineSingleOperationAudit,
  registerExportAuditReport,
} from "./commands";
import { AuditWebView } from "./view";
import { AuditContext, PendingAudits } from "../types";
import { registerQuickfixes } from "./quickfix";
import { Cache } from "../cache";
import { setDecorations } from "./decoration";
import { PlatformStore } from "../platform/stores/platform-store";
import { AuditCodelensProvider } from "./lens";
import { Configuration } from "../configuration";
import { SignUpWebView } from "../webapps/signup/view";
import { clearAuditReportTempDirectories } from "./util";
import { registerSecurityGqlAudit } from "./gql";
import { Logger } from "../platform/types";

export function activate(
  context: vscode.ExtensionContext,
  auditContext: AuditContext,
  cache: Cache,
  logger: Logger,
  configuration: Configuration,
  signUpWebView: SignUpWebView,
  reportWebView: AuditWebView,
  store: PlatformStore
): vscode.Disposable {
  let disposables: vscode.Disposable[] = [];
  const pendingAudits: PendingAudits = {};

  function update(editor: vscode.TextEditor | undefined) {
    if (editor) {
      setDecorations(editor, auditContext);
      const uri = editor.document.uri.toString();
      if (auditContext.auditsByMainDocument[uri]) {
        reportWebView.showIfVisible(auditContext.auditsByMainDocument[uri]);
      } else {
        let subdocument = false;
        for (const audit of Object.values(auditContext.auditsByMainDocument)) {
          if (audit.summary.subdocumentUris.includes(uri)) {
            subdocument = true;
          }
        }
        // display no report only if the current document is not a
        // part of any multi-document run
        if (!subdocument) {
          reportWebView.showNoReport();
        }
      }
    }
  }

  const selectors = [
    { scheme: "file", language: "json" },
    { scheme: "file", language: "jsonc" },
    { scheme: "file", language: "yaml" },
  ];

  const auditCodelensProvider = new AuditCodelensProvider(cache);

  function activateLens(enabled: boolean) {
    disposables.forEach((disposable) => disposable.dispose());
    if (enabled) {
      disposables.push(vscode.languages.registerCodeLensProvider(selectors, auditCodelensProvider));
    } else {
      disposables = [];
    }
  }

  configuration.onDidChange(async (e: vscode.ConfigurationChangeEvent) => {
    if (configuration.changed(e, "codeLens")) {
      activateLens(configuration.get("codeLens"));
    }
  });

  activateLens(configuration.get("codeLens"));

  vscode.window.onDidChangeActiveTextEditor((editor) => update(editor));

  registerSecurityGqlAudit(
    context,
    cache,
    auditContext,
    pendingAudits,
    reportWebView,
    store,
    signUpWebView
  );

  registerSecurityAudit(
    context,
    cache,
    logger,
    auditContext,
    pendingAudits,
    reportWebView,
    store,
    signUpWebView
  );

  registerSingleOperationAudit(
    context,
    cache,
    logger,
    auditContext,
    pendingAudits,
    reportWebView,
    store,
    signUpWebView
  );

  registerOutlineSingleOperationAudit(
    context,
    cache,
    logger,
    auditContext,
    pendingAudits,
    reportWebView,
    store,
    signUpWebView
  );
  registerFocusSecurityAudit(context, cache, auditContext, reportWebView);
  registerFocusSecurityAuditById(context, auditContext, reportWebView);
  registerQuickfixes(context, cache, auditContext, store, reportWebView);
  registerExportAuditReport(context, auditContext);

  return new vscode.Disposable(() => disposables.forEach((disposable) => disposable.dispose()));
}

export async function deactivate(auditContext: AuditContext) {
  await clearAuditReportTempDirectories(auditContext);
}
