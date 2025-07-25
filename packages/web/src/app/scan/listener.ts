import {
  createListenerMiddleware,
  TypedStartListening,
  UnsubscribeListener,
} from "@reduxjs/toolkit";
import { Webapp } from "@xliic/common/webapp/scan";
import { AppDispatch, RootState } from "./store";
import {
  showScanReport,
  sendCurlRequest,
  showJsonPointer,
  parseChunkCompleted,
  parseChunk,
  started,
  loadHappyPathPage,
  happyPathPageLoaded,
  reportLoaded,
  loadTestsPage,
  testsPageLoaded,
  changeFilter,
  showGeneralError,
} from "./slice";

import { startNavigationListening } from "../../features/router/listener";
import { Routes } from "../../features/router/RouterContext";
import { startListeners } from "../webapp";
import { ReportDb } from "./db/reportdb";
import { ScanReportParser } from "./db/scanreportparser";

const listenerMiddleware = createListenerMiddleware();
type AppStartListening = TypedStartListening<RootState, AppDispatch>;
const startAppListening = listenerMiddleware.startListening as AppStartListening;

export function createListener(host: Webapp["host"], routes: Routes) {
  let reportDb: ReportDb | undefined = undefined;
  let parser: ScanReportParser | undefined = undefined;

  const onShowScanReport = () =>
    startAppListening({
      actionCreator: showScanReport,
      effect: async (action, listenerApi) => {
        const { apiAlias } = action.payload;

        if (reportDb !== undefined) {
          reportDb.stop();
        }

        reportDb = new ReportDb();
        parser = new ScanReportParser(reportDb);
        // not awaiting this, as it will be awaited in the parseChunk effect
        reportDb.start(`scanv2-report-${apiAlias}`);
      },
    });

  const onParseChunk = () =>
    startAppListening({
      actionCreator: parseChunk,
      effect: async (action, listenerApi) => {
        try {
          await reportDb!.started();
          const completed = await parser!.parse(action.payload);
          listenerApi.dispatch(parseChunkCompleted());
          if (completed) {
            listenerApi.dispatch(loadHappyPathPage(0));
            listenerApi.dispatch(loadTestsPage(0));
          }
        } catch (error) {
          listenerApi.dispatch(
            showGeneralError({ message: `Error when processing the report: ${error}` })
          );
        }
      },
    });

  const onLoadHappyPathPage = () =>
    startAppListening({
      actionCreator: loadHappyPathPage,
      effect: async (action, listenerApi) => {
        const happyPaths = await reportDb!.getHappyPaths(action.payload, 100, undefined);
        listenerApi.dispatch(happyPathPageLoaded(happyPaths));
        listenerApi.dispatch(
          reportLoaded({
            scanVersion: parser!.getScanVersion(),
            summary: parser!.getSummary(),
            stats: parser!.getStats(),
            paths: await reportDb!.getStrings("pathIndex"),
            operationIds: await reportDb!.getStrings("operationIdIndex"),
            testKeys: await reportDb!.getStrings("testKeyIndex"),
          })
        );
      },
    });

  const onLoadTestsPage = () =>
    startAppListening({
      actionCreator: loadTestsPage,
      effect: async (action, listenerApi) => {
        const {
          scan: { filter },
        } = listenerApi.getState();
        const tests = await reportDb!.getTests(action.payload, 100, undefined, filter);
        listenerApi.dispatch(testsPageLoaded(tests));
      },
    });

  const onChangeFilter = () =>
    startAppListening({
      actionCreator: changeFilter,
      effect: async (action, listenerApi) => {
        const {
          scan: { filter },
        } = listenerApi.getState();
        const tests = await reportDb!.getTests(0, 100, undefined, filter);
        listenerApi.dispatch(testsPageLoaded(tests));
      },
    });

  const listeners: Record<keyof Webapp["hostHandlers"], () => UnsubscribeListener> = {
    started: () =>
      startAppListening({
        actionCreator: started,
        effect: async (action, listenerApi) => {
          host.postMessage({ command: "started", payload: crypto.randomUUID() });
        },
      }),

    parseChunkCompleted: () =>
      startAppListening({
        actionCreator: parseChunkCompleted,
        effect: async (action, listenerApi) => {
          host.postMessage({ command: "parseChunkCompleted", payload: undefined });
        },
      }),

    sendCurlRequest: () =>
      startAppListening({
        actionCreator: sendCurlRequest,
        effect: async (action, listenerApi) => {
          host.postMessage({
            command: "sendCurlRequest",
            payload: action.payload,
          });
        },
      }),

    showJsonPointer: () =>
      startAppListening({
        actionCreator: showJsonPointer,
        effect: async (action, listenerApi) => {
          host.postMessage({
            command: "showJsonPointer",
            payload: action.payload,
          });
        },
      }),
  };

  startNavigationListening(startAppListening, routes);
  startListeners({
    ...listeners,
    onShowScanReport,
    onParseChunk,
    onLoadHappyPathPage,
    onLoadTestsPage,
    onChangeFilter,
  });

  return listenerMiddleware;
}
