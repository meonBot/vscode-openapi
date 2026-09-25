import { expect, test, assert } from "vitest";

import { serialize } from "../src/index";

import oas from "./pixi/pixi.json";
import scanconf from "./pixi/scanconf.json";
import { parseScenario } from "./util";

test("parse and serialize", async () => {
  const file = parseScenario(oas, scanconf as any);

  const [serialized, serializeError] = serialize(file);

  if (serializeError !== undefined) {
    assert.fail("Error serializing config");
  }

  expect(JSON.parse(JSON.stringify(serialized))).toEqual(scanconf);
});

test("parse and serialize securityProfile", async () => {
  const securityProfile = {
    clientCertificate: "cert",
    clientCertificatePassword: "secret",
    caServerCertificate: "ca",
  };
  const withProfile = { ...(scanconf as any), securityProfile };

  const file = parseScenario(oas, withProfile);
  expect(file.securityProfile).toEqual(securityProfile);

  const [serialized, serializeError] = serialize(file);
  if (serializeError !== undefined) {
    assert.fail("Error serializing config");
  }

  expect(JSON.parse(JSON.stringify(serialized))).toEqual(withProfile);
});

function withExpectedResponse(expectedResponse: string | string[] | undefined) {
  const clone = JSON.parse(JSON.stringify(scanconf));
  const stage = clone.operations.edituserinfo.scenarios[0].requests[0];
  if (expectedResponse === undefined) {
    delete stage.expectedResponse;
  } else {
    stage.expectedResponse = expectedResponse;
  }
  return clone;
}

function parsedExpectedResponse(scenario: any) {
  const file = parseScenario(oas, scenario);
  return (file.operations["edituserinfo"].scenarios[0].requests[0] as any).expectedResponse;
}

function serializedExpectedResponse(scenario: any) {
  const [serialized, serializeError] = serialize(parseScenario(oas, scenario));
  if (serializeError !== undefined) {
    assert.fail("Error serializing config");
  }
  const operation = (serialized as any).operations["edituserinfo"];
  return operation.scenarios[0].requests[0].expectedResponse;
}

test("parse expectedResponse", async () => {
  // a single string is normalized to an array, an empty array to 'undefined'
  expect(parsedExpectedResponse(withExpectedResponse("403"))).toEqual(["403"]);
  expect(parsedExpectedResponse(withExpectedResponse(["403", "404"]))).toEqual(["403", "404"]);
  expect(parsedExpectedResponse(withExpectedResponse([]))).toBeUndefined();
  expect(parsedExpectedResponse(withExpectedResponse(undefined))).toBeUndefined();
});

test("serialize expectedResponse", async () => {
  // expectedResponse is always serialized as an array, including a single value
  // parsed from the legacy string form
  expect(serializedExpectedResponse(withExpectedResponse("403"))).toEqual(["403"]);
  expect(serializedExpectedResponse(withExpectedResponse(["403"]))).toEqual(["403"]);
  expect(serializedExpectedResponse(withExpectedResponse(["403", "404"]))).toEqual(["403", "404"]);
  expect(serializedExpectedResponse(withExpectedResponse(undefined))).toBeUndefined();
});
