/*
 Copyright (c) 42Crunch Ltd. All rights reserved.
 Licensed under the GNU Affero General Public License version 3. See LICENSE.txt in the project root for license information.
*/

import * as path from "path";
import * as vscode from "vscode";
import { readFileSync } from "fs";

export class ScanReportWebView {
  private panel?: vscode.WebviewPanel;
  private style: string;
  private script: vscode.Uri;

  constructor(extensionPath: string) {
    this.script = vscode.Uri.file(
      path.join(extensionPath, "webview", "generated", "scan", "index.js")
    );

    this.style = readFileSync(
      path.join(extensionPath, "webview", "generated", "scan", "style.css"),
      { encoding: "utf-8" }
    );
  }

  public show(report: any) {
    if (!this.panel) {
      this.panel = this.createPanel();
    }
    this.panel.webview.postMessage({ command: "show", report: sample });
  }

  private createPanel(): vscode.WebviewPanel {
    const panel = vscode.window.createWebviewPanel(
      "conformance-scan-report",
      "Conformance Scan Report",
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
      panel.webview.asWebviewUri(this.script),
      this.style
    );

    panel.onDidDispose(() => (this.panel = undefined));

    panel.webview.onDidReceiveMessage((message: any) => {
      switch (message.command) {
        case "curl":
          console.log("run curl", message.curl);
          vscode.commands.executeCommand("openapi.platform.runCurl", message.curl);
          break;
      }
    });

    return panel;
  }

  private getHtml(cspSource: string, script: vscode.Uri, style: string): string {
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
    <script src="${script}"></script>
    <script>
    window.addEventListener("DOMContentLoaded", (event) => {
      console.log('content loaded');
      const vscode = acquireVsCodeApi();
      window.addEventListener('message', event => {
        console.log('got message', event);
        const message = event.data;
              switch (message.command) {
                  case 'show':
                      window.renderScanReport(vscode, message.report);
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

const sample = {
  indexed: false,
  scanVersion: "1.14.0",
  scanReportVersion: "2.2.0",
  commit: "b492d97f1953fc5735973cde5855ad90cd95e51d-N",
  host: "http://127.0.0.1:4010",
  errorsOnly: false,
  summary: {
    startDate: "2021-12-07T23:38:38.853021237+01:00",
    endDate: "2021-12-07T23:38:38.980902746+01:00",
    openapiId: "",
    state: "finished",
    exitCode: 0,
    processingError: "",
    estimatedTotalRequest: 47,
    totalRequest: 36,
    criticality: 3,
    issues: 5,
    criticalIssues: 0,
    highIssues: 0,
    mediumIssues: 5,
    lowIssues: 0,
    infoIssues: 0,
  },
  paths: {
    "/pets": {
      delete: {
        checked: true,
        estimatedTotalRequest: 1,
        totalRequest: 1,
        totalExpected: 1,
        totalUnexpected: 0,
        totalFailure: 0,
        issues: [
          {
            id: "5ef5ca8b-887a-424d-a6c5-c9108cd5849c",
            injectionKey: "path-item-method-not-allowed-scan",
            injectionDescription:
              "The request is generated with the verb ‘delete’ that is not defined in the OpenAPI definition of the API",
            curl: "curl -X 'DELETE' -H 'Content-Type: application/json' -H 'X-Scan-Transactionid: 5ef5ca8b-887a-424d-a6c5-c9108cd5849c' 'http://127.0.0.1:4010/pets'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/paths/~1pets",
          },
        ],
      },
      get: {
        checked: false,
        reason: "operation-skipped",
        estimatedTotalRequest: 5,
        totalRequest: 0,
        totalExpected: 0,
        totalUnexpected: 0,
        totalFailure: 0,
      },
      head: {
        checked: true,
        estimatedTotalRequest: 1,
        totalRequest: 1,
        totalExpected: 1,
        totalUnexpected: 0,
        totalFailure: 0,
        issues: [
          {
            id: "cf011ed0-6d78-4115-b95b-20458698de8a",
            injectionKey: "path-item-method-not-allowed-scan",
            injectionDescription:
              "The request is generated with the verb ‘head’ that is not defined in the OpenAPI definition of the API",
            curl: "curl -X 'HEAD' -H 'Content-Type: application/json' -H 'X-Scan-Transactionid: cf011ed0-6d78-4115-b95b-20458698de8a' 'http://127.0.0.1:4010/pets'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/paths/~1pets",
          },
        ],
      },
      options: {
        checked: true,
        estimatedTotalRequest: 1,
        totalRequest: 1,
        totalExpected: 1,
        totalUnexpected: 0,
        totalFailure: 0,
        issues: [
          {
            id: "c7cd6a3f-fda5-477f-aec0-27e31782fefa",
            injectionKey: "path-item-method-not-allowed-scan",
            injectionDescription:
              "The request is generated with the verb ‘options’ that is not defined in the OpenAPI definition of the API",
            curl: "curl -X 'OPTIONS' -H 'Content-Type: application/json' -H 'X-Scan-Transactionid: c7cd6a3f-fda5-477f-aec0-27e31782fefa' 'http://127.0.0.1:4010/pets'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/paths/~1pets",
          },
        ],
      },
      patch: {
        checked: true,
        estimatedTotalRequest: 1,
        totalRequest: 1,
        totalExpected: 0,
        totalUnexpected: 1,
        totalFailure: 0,
        issues: [
          {
            id: "46726e8a-72a2-4757-9697-7b8e6252be81",
            injectionKey: "path-item-method-not-allowed-scan",
            injectionDescription:
              "The request is generated with the verb ‘patch’ that is not defined in the OpenAPI definition of the API",
            apiResponseAnalysis: [
              {
                responseKey: "response-error-unexpected-scan",
                responseDescription:
                  "The response received from the API does not match what is expected for the sent test request and raises an error",
              },
            ],
            owaspMapping: 8,
            criticality: 3,
            requestDate: "2021-12-07T23:38:38+01:00",
            requestContentType: "application/json",
            requestBodyLength: 0,
            url: "http://127.0.0.1:4010/pets",
            curl: "curl -X 'PATCH' -H 'Content-Type: application/json' -H 'X-Scan-Transactionid: 46726e8a-72a2-4757-9697-7b8e6252be81' 'http://127.0.0.1:4010/pets'",
            responseTime: 0,
            responseHttpStatusCode: 400,
            responseContentType: "application/json; charset=utf-8",
            responseBodyLength: 58,
            responseBody:
              "eyJlcnJvciI6eyJjb2RlIjoiaW52YWxpZF9qc29uIiwibWVzc2FnZSI6IkludmFsaWQgSlNPTiJ9fQ==",
            responseHttp:
              "SFRUUC8xLjEgNDAwIEJhZCBSZXF1ZXN0DQpDb250ZW50LUxlbmd0aDogNTgNCkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzOiB0cnVlDQpBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzOiAqDQpBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW46ICoNCkFjY2Vzcy1Db250cm9sLUV4cG9zZS1IZWFkZXJzOiAqDQpDb25uZWN0aW9uOiBrZWVwLWFsaXZlDQpDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgNCkRhdGU6IFR1ZSwgMDcgRGVjIDIwMjEgMjI6Mzg6MzggR01UDQpLZWVwLUFsaXZlOiB0aW1lb3V0PTUNCg0KeyJlcnJvciI6eyJjb2RlIjoiaW52YWxpZF9qc29uIiwibWVzc2FnZSI6IkludmFsaWQgSlNPTiJ9fQ==",
            jsonPointer: "/paths/~1pets",
          },
        ],
      },
      post: {
        checked: true,
        curlHappyPath:
          "curl -X 'POST' -d '{\"name\":\"thsbzrjxawnwekrbemfdzdcekxbakjqz\",\"tag\":\"lcttmttcoanatyyinkarekjyixjrscct\"}' -H 'Content-Type: application/json' 'http://127.0.0.1:4010/pets'",
        happyPath: {
          key: "happy-path-success",
          excessiveDataExposure: false,
          curl: "curl -X 'POST' -d '{\"name\":\"thsbzrjxawnwekrbemfdzdcekxbakjqz\",\"tag\":\"lcttmttcoanatyyinkarekjyixjrscct\"}' -H 'Content-Type: application/json' 'http://127.0.0.1:4010/pets'",
          curlBodySkipped: false,
          responseHttpStatusCode: 200,
          responseContentType: "application/json",
          responseBodyLength: 42,
          responseHttp:
            "SFRUUC8xLjEgMjAwIE9LDQpDb250ZW50LUxlbmd0aDogNDINCkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzOiB0cnVlDQpBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzOiAqDQpBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW46ICoNCkFjY2Vzcy1Db250cm9sLUV4cG9zZS1IZWFkZXJzOiAqDQpDb25uZWN0aW9uOiBrZWVwLWFsaXZlDQpDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24NCkRhdGU6IFR1ZSwgMDcgRGVjIDIwMjEgMjI6Mzg6MzggR01UDQpLZWVwLUFsaXZlOiB0aW1lb3V0PTUNCg0KeyJuYW1lIjoic3RyaW5nIiwidGFnIjoic3RyaW5nIiwiaWQiOjEwMDB9",
        },
        estimatedTotalRequest: 18,
        totalRequest: 18,
        totalExpected: 17,
        totalUnexpected: 0,
        totalFailure: 1,
        issues: [
          {
            id: "b198eecc-18e8-4e6e-bfce-b748b514310f",
            injectionKey: "parameter-header-contenttype-wrong-scan",
            injectionDescription:
              "The header ‘Content-Type’ has a value ‘application/random+content+type’ and it is not consistent with the body which has a content type ‘application/json’",
            curl: "curl -X 'POST' -d '{\"name\":\"thsbzrjxawnwekrbemfdzdcekxbakjqz\",\"tag\":\"lcttmttcoanatyyinkarekjyixjrscct\"}' -H 'Content-Type: application/random+content+type' -H 'X-Scan-Transactionid: b198eecc-18e8-4e6e-bfce-b748b514310f' 'http://127.0.0.1:4010/pets'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/paths/~1pets/post",
          },
          {
            id: "b561abe9-6ba0-4621-885a-3d44015652e3",
            injectionKey: "schema-type-wrong-number-scan",
            injectionDescription:
              "The generated value is of the type number instead of the type ‘object’",
            curl: "curl -X 'POST' -d '3.14' -H 'Content-Type: application/json' -H 'X-Scan-Transactionid: b561abe9-6ba0-4621-885a-3d44015652e3' 'http://127.0.0.1:4010/pets'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/definitions/NewPet",
          },
          {
            id: "e0f56b7d-1f64-4a13-a4ff-5800c86592dd",
            injectionKey: "schema-type-wrong-array-scan",
            injectionDescription:
              "The generated value is of the type array instead of the type ‘object’",
            curl: "curl -X 'POST' -d '[\"Hello\",\"World\",\"!\"]' -H 'Content-Type: application/json' -H 'X-Scan-Transactionid: e0f56b7d-1f64-4a13-a4ff-5800c86592dd' 'http://127.0.0.1:4010/pets'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/definitions/NewPet",
          },
          {
            id: "5213f3d4-b09b-4ce2-9750-2c11537312f0",
            injectionKey: "schema-type-wrong-bool-scan",
            injectionDescription:
              "The generated value is of the type boolean instead of the type ‘object’",
            curl: "curl -X 'POST' -d 'true' -H 'Content-Type: application/json' -H 'X-Scan-Transactionid: 5213f3d4-b09b-4ce2-9750-2c11537312f0' 'http://127.0.0.1:4010/pets'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/definitions/NewPet",
          },
          {
            id: "01960b78-d057-49ae-bec0-11c00d679006",
            injectionKey: "schema-type-wrong-string-scan",
            injectionDescription:
              "The generated value is of the type string instead of the type ‘object’",
            curl: "curl -X 'POST' -d '\"HelloWorld\"' -H 'Content-Type: application/json' -H 'X-Scan-Transactionid: 01960b78-d057-49ae-bec0-11c00d679006' 'http://127.0.0.1:4010/pets'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/definitions/NewPet",
          },
          {
            id: "0a6b1f4c-4591-4f75-99ba-5ecaa782a1a7",
            injectionKey: "schema-type-wrong-integer-scan",
            injectionDescription:
              "The generated value is of the type integer instead of the type ‘object’",
            curl: "curl -X 'POST' -d '1' -H 'Content-Type: application/json' -H 'X-Scan-Transactionid: 0a6b1f4c-4591-4f75-99ba-5ecaa782a1a7' 'http://127.0.0.1:4010/pets'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/definitions/NewPet",
          },
          {
            id: "a88f02c4-c41b-4c51-b31b-219b85afa3d9",
            injectionKey: "schema-required-scan",
            injectionDescription: "The required property ‘name’ is missing in the generated object",
            curl: "curl -X 'POST' -d '{\"tag\":\"lcttmttcoanatyyinkarekjyixjrscct\"}' -H 'Content-Type: application/json' -H 'X-Scan-Transactionid: a88f02c4-c41b-4c51-b31b-219b85afa3d9' 'http://127.0.0.1:4010/pets'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/definitions/NewPet",
          },
          {
            id: "8ebf080c-20c8-4702-b00f-784d4a9df3f3",
            injectionKey: "schema-additionalproperties-scan",
            injectionDescription: "Additional properties are generated with the schema object",
            apiResponseAnalysis: [
              {
                responseKey: "response-successful-scan",
                responseDescription: "The API handles a faulty request without raising an error",
              },
            ],
            owaspMapping: 5,
            criticality: 3,
            requestDate: "2021-12-07T23:38:38+01:00",
            requestContentType: "application/json",
            requestBodyLength: 124,
            url: "http://127.0.0.1:4010/pets",
            curl: 'curl -X \'POST\' -d \'{"additionalPropertiesScan":"HelloWorld","name":"thsbzrjxawnwekrbemfdzdcekxbakjqz","tag":"lcttmttcoanatyyinkarekjyixjrscct"}\' -H \'Content-Type: application/json\' -H \'X-Scan-Transactionid: 8ebf080c-20c8-4702-b00f-784d4a9df3f3\' \'http://127.0.0.1:4010/pets\'',
            responseTime: 4,
            responseHttpStatusCode: 200,
            responseContentType: "application/json",
            responseBodyLength: 42,
            responseBody: "eyJuYW1lIjoic3RyaW5nIiwidGFnIjoic3RyaW5nIiwiaWQiOjEwMDB9",
            responseHttp:
              "SFRUUC8xLjEgMjAwIE9LDQpDb250ZW50LUxlbmd0aDogNDINCkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzOiB0cnVlDQpBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzOiAqDQpBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW46ICoNCkFjY2Vzcy1Db250cm9sLUV4cG9zZS1IZWFkZXJzOiAqDQpDb25uZWN0aW9uOiBrZWVwLWFsaXZlDQpDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24NCkRhdGU6IFR1ZSwgMDcgRGVjIDIwMjEgMjI6Mzg6MzggR01UDQpLZWVwLUFsaXZlOiB0aW1lb3V0PTUNCg0KeyJuYW1lIjoic3RyaW5nIiwidGFnIjoic3RyaW5nIiwiaWQiOjEwMDB9",
            jsonPointer: "/definitions/NewPet",
          },
          {
            id: "4b5cb25d-0b55-4ac0-87a9-1dc817586d4f",
            injectionKey: "schema-type-wrong-bool-scan",
            injectionDescription:
              "The generated value is of the type boolean instead of the type ‘string’",
            curl: "curl -X 'POST' -d '{\"name\":\"thsbzrjxawnwekrbemfdzdcekxbakjqz\",\"tag\":true}' -H 'Content-Type: application/json' -H 'X-Scan-Transactionid: 4b5cb25d-0b55-4ac0-87a9-1dc817586d4f' 'http://127.0.0.1:4010/pets'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/definitions/NewPet/properties/tag",
          },
          {
            id: "4f041a02-ece2-4ef4-a29c-7dc41b4480ed",
            injectionKey: "schema-type-wrong-integer-scan",
            injectionDescription:
              "The generated value is of the type integer instead of the type ‘string’",
            curl: "curl -X 'POST' -d '{\"name\":\"thsbzrjxawnwekrbemfdzdcekxbakjqz\",\"tag\":1}' -H 'Content-Type: application/json' -H 'X-Scan-Transactionid: 4f041a02-ece2-4ef4-a29c-7dc41b4480ed' 'http://127.0.0.1:4010/pets'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/definitions/NewPet/properties/tag",
          },
          {
            id: "23ef4737-31ad-42ac-88a7-cc26caa95036",
            injectionKey: "schema-type-wrong-number-scan",
            injectionDescription:
              "The generated value is of the type number instead of the type ‘string’",
            curl: "curl -X 'POST' -d '{\"name\":\"thsbzrjxawnwekrbemfdzdcekxbakjqz\",\"tag\":3.14}' -H 'Content-Type: application/json' -H 'X-Scan-Transactionid: 23ef4737-31ad-42ac-88a7-cc26caa95036' 'http://127.0.0.1:4010/pets'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/definitions/NewPet/properties/tag",
          },
          {
            id: "4afcb591-1fcb-4cb4-a154-d9c6e2d12d27",
            injectionKey: "schema-type-wrong-array-scan",
            injectionDescription:
              "The generated value is of the type array instead of the type ‘string’",
            curl: 'curl -X \'POST\' -d \'{"name":"thsbzrjxawnwekrbemfdzdcekxbakjqz","tag":["Hello","World","!"]}\' -H \'Content-Type: application/json\' -H \'X-Scan-Transactionid: 4afcb591-1fcb-4cb4-a154-d9c6e2d12d27\' \'http://127.0.0.1:4010/pets\'',
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/definitions/NewPet/properties/tag",
          },
          {
            id: "985eb341-10bd-479c-b087-017d084f8923",
            injectionKey: "schema-type-wrong-object-scan",
            injectionDescription:
              "The generated value is of the type object instead of the type ‘string’",
            curl: 'curl -X \'POST\' -d \'{"name":"thsbzrjxawnwekrbemfdzdcekxbakjqz","tag":{"!":"...","Hello":"World"}}\' -H \'Content-Type: application/json\' -H \'X-Scan-Transactionid: 985eb341-10bd-479c-b087-017d084f8923\' \'http://127.0.0.1:4010/pets\'',
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/definitions/NewPet/properties/tag",
          },
          {
            id: "ed995ed5-b537-4b4c-83a4-1c99e6be38b3",
            injectionKey: "schema-type-wrong-bool-scan",
            injectionDescription:
              "The generated value is of the type boolean instead of the type ‘string’",
            curl: "curl -X 'POST' -d '{\"name\":true,\"tag\":\"lcttmttcoanatyyinkarekjyixjrscct\"}' -H 'Content-Type: application/json' -H 'X-Scan-Transactionid: ed995ed5-b537-4b4c-83a4-1c99e6be38b3' 'http://127.0.0.1:4010/pets'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/definitions/NewPet/properties/name",
          },
          {
            id: "3a075146-e702-43b8-8a92-3d0731b2d7eb",
            injectionKey: "schema-type-wrong-integer-scan",
            injectionDescription:
              "The generated value is of the type integer instead of the type ‘string’",
            curl: "curl -X 'POST' -d '{\"name\":1,\"tag\":\"lcttmttcoanatyyinkarekjyixjrscct\"}' -H 'Content-Type: application/json' -H 'X-Scan-Transactionid: 3a075146-e702-43b8-8a92-3d0731b2d7eb' 'http://127.0.0.1:4010/pets'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/definitions/NewPet/properties/name",
          },
          {
            id: "5acbe3eb-4a07-4b2e-8adb-a3f62fc8e013",
            injectionKey: "schema-type-wrong-number-scan",
            injectionDescription:
              "The generated value is of the type number instead of the type ‘string’",
            curl: "curl -X 'POST' -d '{\"name\":3.14,\"tag\":\"lcttmttcoanatyyinkarekjyixjrscct\"}' -H 'Content-Type: application/json' -H 'X-Scan-Transactionid: 5acbe3eb-4a07-4b2e-8adb-a3f62fc8e013' 'http://127.0.0.1:4010/pets'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/definitions/NewPet/properties/name",
          },
          {
            id: "8777db2d-66a2-4920-b9b9-49e14439f168",
            injectionKey: "schema-type-wrong-array-scan",
            injectionDescription:
              "The generated value is of the type array instead of the type ‘string’",
            curl: 'curl -X \'POST\' -d \'{"name":["Hello","World","!"],"tag":"lcttmttcoanatyyinkarekjyixjrscct"}\' -H \'Content-Type: application/json\' -H \'X-Scan-Transactionid: 8777db2d-66a2-4920-b9b9-49e14439f168\' \'http://127.0.0.1:4010/pets\'',
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/definitions/NewPet/properties/name",
          },
          {
            id: "6c31406d-0d86-4b7d-8ca1-0a47c6730a4b",
            injectionKey: "schema-type-wrong-object-scan",
            injectionDescription:
              "The generated value is of the type object instead of the type ‘string’",
            curl: 'curl -X \'POST\' -d \'{"name":{"!":"...","Hello":"World"},"tag":"lcttmttcoanatyyinkarekjyixjrscct"}\' -H \'Content-Type: application/json\' -H \'X-Scan-Transactionid: 6c31406d-0d86-4b7d-8ca1-0a47c6730a4b\' \'http://127.0.0.1:4010/pets\'',
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/definitions/NewPet/properties/name",
          },
        ],
      },
      put: {
        checked: true,
        estimatedTotalRequest: 1,
        totalRequest: 1,
        totalExpected: 0,
        totalUnexpected: 1,
        totalFailure: 0,
        issues: [
          {
            id: "481694b4-c7c3-4a7e-9a67-9cd115560672",
            injectionKey: "path-item-method-not-allowed-scan",
            injectionDescription:
              "The request is generated with the verb ‘put’ that is not defined in the OpenAPI definition of the API",
            apiResponseAnalysis: [
              {
                responseKey: "response-error-unexpected-scan",
                responseDescription:
                  "The response received from the API does not match what is expected for the sent test request and raises an error",
              },
            ],
            owaspMapping: 8,
            criticality: 3,
            requestDate: "2021-12-07T23:38:38+01:00",
            requestContentType: "application/json",
            requestBodyLength: 0,
            url: "http://127.0.0.1:4010/pets",
            curl: "curl -X 'PUT' -H 'Content-Type: application/json' -H 'X-Scan-Transactionid: 481694b4-c7c3-4a7e-9a67-9cd115560672' 'http://127.0.0.1:4010/pets'",
            responseTime: 1,
            responseHttpStatusCode: 400,
            responseContentType: "application/json; charset=utf-8",
            responseBodyLength: 58,
            responseBody:
              "eyJlcnJvciI6eyJjb2RlIjoiaW52YWxpZF9qc29uIiwibWVzc2FnZSI6IkludmFsaWQgSlNPTiJ9fQ==",
            responseHttp:
              "SFRUUC8xLjEgNDAwIEJhZCBSZXF1ZXN0DQpDb250ZW50LUxlbmd0aDogNTgNCkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzOiB0cnVlDQpBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzOiAqDQpBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW46ICoNCkFjY2Vzcy1Db250cm9sLUV4cG9zZS1IZWFkZXJzOiAqDQpDb25uZWN0aW9uOiBrZWVwLWFsaXZlDQpDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgNCkRhdGU6IFR1ZSwgMDcgRGVjIDIwMjEgMjI6Mzg6MzggR01UDQpLZWVwLUFsaXZlOiB0aW1lb3V0PTUNCg0KeyJlcnJvciI6eyJjb2RlIjoiaW52YWxpZF9qc29uIiwibWVzc2FnZSI6IkludmFsaWQgSlNPTiJ9fQ==",
            jsonPointer: "/paths/~1pets",
          },
        ],
      },
      trace: {
        checked: true,
        estimatedTotalRequest: 1,
        totalRequest: 1,
        totalExpected: 1,
        totalUnexpected: 0,
        totalFailure: 0,
        issues: [
          {
            id: "5a64d25e-0af9-4940-b3f7-2732d215a3a2",
            injectionKey: "path-item-method-not-allowed-scan",
            injectionDescription:
              "The request is generated with the verb ‘trace’ that is not defined in the OpenAPI definition of the API",
            curl: "curl -X 'TRACE' -H 'Content-Type: application/json' -H 'X-Scan-Transactionid: 5a64d25e-0af9-4940-b3f7-2732d215a3a2' 'http://127.0.0.1:4010/pets'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/paths/~1pets",
          },
        ],
      },
    },
    "/pets/{id}": {
      delete: {
        checked: true,
        curlHappyPath: "curl -X 'DELETE' 'http://127.0.0.1:4010/pets/0'",
        happyPath: {
          key: "happy-path-success",
          excessiveDataExposure: false,
          curl: "curl -X 'DELETE' 'http://127.0.0.1:4010/pets/0'",
          curlBodySkipped: false,
          responseHttpStatusCode: 204,
          responseContentType: "application/json",
          responseBodyLength: 0,
          responseHttp:
            "SFRUUC8xLjEgMjA0IE5vIENvbnRlbnQNCkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzOiB0cnVlDQpBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzOiAqDQpBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW46ICoNCkFjY2Vzcy1Db250cm9sLUV4cG9zZS1IZWFkZXJzOiAqDQpDb25uZWN0aW9uOiBrZWVwLWFsaXZlDQpDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24NCkRhdGU6IFR1ZSwgMDcgRGVjIDIwMjEgMjI6Mzg6MzggR01UDQpLZWVwLUFsaXZlOiB0aW1lb3V0PTUNCg0K",
        },
        estimatedTotalRequest: 6,
        totalRequest: 6,
        totalExpected: 4,
        totalUnexpected: 0,
        totalFailure: 2,
        issues: [
          {
            id: "42473f6f-0937-406c-b4ef-be42cf8255ba",
            injectionKey: "parameter-required-scan",
            injectionDescription:
              "The parameter ‘id’ is required by the OpenAPI definition of the API, but it is not included in the request",
            curl: "curl -X 'DELETE' -H 'X-Scan-Transactionid: 42473f6f-0937-406c-b4ef-be42cf8255ba' 'http://127.0.0.1:4010/pets/'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/paths/~1pets~1{id}/delete/parameters/0",
          },
          {
            id: "cd812afa-13e4-485f-9991-a8f044825088",
            injectionKey: "schema-type-wrong-bool-scan",
            injectionDescription:
              "The generated value is of the type boolean instead of the type ‘integer’",
            curl: "curl -X 'DELETE' -H 'X-Scan-Transactionid: cd812afa-13e4-485f-9991-a8f044825088' 'http://127.0.0.1:4010/pets/true'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/paths/~1pets~1{id}/delete/parameters/0",
          },
          {
            id: "77a78ba2-2404-4f5c-b670-e76e635789db",
            injectionKey: "schema-type-wrong-string-scan",
            injectionDescription:
              "The generated value is of the type string instead of the type ‘integer’",
            curl: "curl -X 'DELETE' -H 'X-Scan-Transactionid: 77a78ba2-2404-4f5c-b670-e76e635789db' 'http://127.0.0.1:4010/pets/HelloWorld'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/paths/~1pets~1{id}/delete/parameters/0",
          },
          {
            id: "0d64af4a-8b87-4940-b3db-e1eedda746c0",
            injectionKey: "schema-type-wrong-array-scan",
            injectionDescription:
              "The generated value is of the type array instead of the type ‘integer’",
            curl: "curl -X 'DELETE' -H 'X-Scan-Transactionid: 0d64af4a-8b87-4940-b3db-e1eedda746c0' 'http://127.0.0.1:4010/pets/0,0,0'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/paths/~1pets~1{id}/delete/parameters/0",
          },
          {
            id: "c7510675-5eb8-4a4f-bbe1-41c21bc0faf3",
            injectionKey: "schema-minimum-scan",
            injectionDescription:
              "The generated value does not follow the property minimum for integers and numbers",
            apiResponseAnalysis: [
              {
                responseKey: "response-successful-scan",
                responseDescription: "The API handles a faulty request without raising an error",
              },
            ],
            owaspMapping: 0,
            criticality: 3,
            requestDate: "2021-12-07T23:38:38+01:00",
            requestContentType: "",
            requestBodyLength: 0,
            url: "http://127.0.0.1:4010/pets/-9223372036854775809",
            curl: "curl -X 'DELETE' -H 'X-Scan-Transactionid: c7510675-5eb8-4a4f-bbe1-41c21bc0faf3' 'http://127.0.0.1:4010/pets/-9223372036854775809'",
            responseTime: 2,
            responseHttpStatusCode: 204,
            responseContentType: "application/json",
            responseBodyLength: 0,
            responseBody: "",
            responseHttp:
              "SFRUUC8xLjEgMjA0IE5vIENvbnRlbnQNCkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzOiB0cnVlDQpBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzOiAqDQpBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW46ICoNCkFjY2Vzcy1Db250cm9sLUV4cG9zZS1IZWFkZXJzOiAqDQpDb25uZWN0aW9uOiBrZWVwLWFsaXZlDQpDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24NCkRhdGU6IFR1ZSwgMDcgRGVjIDIwMjEgMjI6Mzg6MzggR01UDQpLZWVwLUFsaXZlOiB0aW1lb3V0PTUNCg0K",
            jsonPointer: "/paths/~1pets~1{id}/delete/parameters/0",
          },
          {
            id: "78a96891-e769-484f-95a0-336ed9534211",
            injectionKey: "schema-maximum-scan",
            injectionDescription:
              "The generated value does not follow the property maximum for integers and numbers",
            apiResponseAnalysis: [
              {
                responseKey: "response-successful-scan",
                responseDescription: "The API handles a faulty request without raising an error",
              },
            ],
            owaspMapping: 8,
            criticality: 3,
            requestDate: "2021-12-07T23:38:38+01:00",
            requestContentType: "",
            requestBodyLength: 0,
            url: "http://127.0.0.1:4010/pets/9223372036854775808",
            curl: "curl -X 'DELETE' -H 'X-Scan-Transactionid: 78a96891-e769-484f-95a0-336ed9534211' 'http://127.0.0.1:4010/pets/9223372036854775808'",
            responseTime: 2,
            responseHttpStatusCode: 204,
            responseContentType: "application/json",
            responseBodyLength: 0,
            responseBody: "",
            responseHttp:
              "SFRUUC8xLjEgMjA0IE5vIENvbnRlbnQNCkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzOiB0cnVlDQpBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzOiAqDQpBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW46ICoNCkFjY2Vzcy1Db250cm9sLUV4cG9zZS1IZWFkZXJzOiAqDQpDb25uZWN0aW9uOiBrZWVwLWFsaXZlDQpDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24NCkRhdGU6IFR1ZSwgMDcgRGVjIDIwMjEgMjI6Mzg6MzggR01UDQpLZWVwLUFsaXZlOiB0aW1lb3V0PTUNCg0K",
            jsonPointer: "/paths/~1pets~1{id}/delete/parameters/0",
          },
        ],
      },
      get: {
        checked: false,
        reason: "operation-skipped",
        estimatedTotalRequest: 6,
        totalRequest: 0,
        totalExpected: 0,
        totalUnexpected: 0,
        totalFailure: 0,
      },
      head: {
        checked: true,
        estimatedTotalRequest: 1,
        totalRequest: 1,
        totalExpected: 1,
        totalUnexpected: 0,
        totalFailure: 0,
        issues: [
          {
            id: "dc165e7a-6b65-43c3-8744-fde3fa222dd8",
            injectionKey: "path-item-method-not-allowed-scan",
            injectionDescription:
              "The request is generated with the verb ‘head’ that is not defined in the OpenAPI definition of the API",
            curl: "curl -X 'HEAD' -H 'X-Scan-Transactionid: dc165e7a-6b65-43c3-8744-fde3fa222dd8' 'http://127.0.0.1:4010/pets/0'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/paths/~1pets~1{id}",
          },
        ],
      },
      options: {
        checked: true,
        estimatedTotalRequest: 1,
        totalRequest: 1,
        totalExpected: 1,
        totalUnexpected: 0,
        totalFailure: 0,
        issues: [
          {
            id: "16f3f2ce-fc0c-4d66-97c1-ce8e659eb544",
            injectionKey: "path-item-method-not-allowed-scan",
            injectionDescription:
              "The request is generated with the verb ‘options’ that is not defined in the OpenAPI definition of the API",
            curl: "curl -X 'OPTIONS' -H 'X-Scan-Transactionid: 16f3f2ce-fc0c-4d66-97c1-ce8e659eb544' 'http://127.0.0.1:4010/pets/0'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/paths/~1pets~1{id}",
          },
        ],
      },
      patch: {
        checked: true,
        estimatedTotalRequest: 1,
        totalRequest: 1,
        totalExpected: 1,
        totalUnexpected: 0,
        totalFailure: 0,
        issues: [
          {
            id: "182639ac-17ab-459c-93b1-f9ce6fc044be",
            injectionKey: "path-item-method-not-allowed-scan",
            injectionDescription:
              "The request is generated with the verb ‘patch’ that is not defined in the OpenAPI definition of the API",
            curl: "curl -X 'PATCH' -H 'X-Scan-Transactionid: 182639ac-17ab-459c-93b1-f9ce6fc044be' 'http://127.0.0.1:4010/pets/0'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/paths/~1pets~1{id}",
          },
        ],
      },
      post: {
        checked: true,
        estimatedTotalRequest: 1,
        totalRequest: 1,
        totalExpected: 1,
        totalUnexpected: 0,
        totalFailure: 0,
        issues: [
          {
            id: "e05eedaa-ab18-4b2d-9cf4-934954764db0",
            injectionKey: "path-item-method-not-allowed-scan",
            injectionDescription:
              "The request is generated with the verb ‘post’ that is not defined in the OpenAPI definition of the API",
            curl: "curl -X 'POST' -H 'X-Scan-Transactionid: e05eedaa-ab18-4b2d-9cf4-934954764db0' 'http://127.0.0.1:4010/pets/0'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/paths/~1pets~1{id}",
          },
        ],
      },
      put: {
        checked: true,
        estimatedTotalRequest: 1,
        totalRequest: 1,
        totalExpected: 1,
        totalUnexpected: 0,
        totalFailure: 0,
        issues: [
          {
            id: "6fb6fd08-a916-4313-b20d-7185e6b05a2a",
            injectionKey: "path-item-method-not-allowed-scan",
            injectionDescription:
              "The request is generated with the verb ‘put’ that is not defined in the OpenAPI definition of the API",
            curl: "curl -X 'PUT' -H 'X-Scan-Transactionid: 6fb6fd08-a916-4313-b20d-7185e6b05a2a' 'http://127.0.0.1:4010/pets/0'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/paths/~1pets~1{id}",
          },
        ],
      },
      trace: {
        checked: true,
        estimatedTotalRequest: 1,
        totalRequest: 1,
        totalExpected: 1,
        totalUnexpected: 0,
        totalFailure: 0,
        issues: [
          {
            id: "f07c5033-2ac1-426d-b5ca-6de52295d2f9",
            injectionKey: "path-item-method-not-allowed-scan",
            injectionDescription:
              "The request is generated with the verb ‘trace’ that is not defined in the OpenAPI definition of the API",
            curl: "curl -X 'TRACE' -H 'X-Scan-Transactionid: f07c5033-2ac1-426d-b5ca-6de52295d2f9' 'http://127.0.0.1:4010/pets/0'",
            apiResponseAnalysis: [
              {
                responseKey: "response-expected-scan",
                responseDescription:
                  "The response received from the API matches what is expected for the sent test request",
              },
            ],
            jsonPointer: "/paths/~1pets~1{id}",
          },
        ],
      },
    },
  },
};
