// Copyright 2020 KwanJunWen. All rights reserved. MIT license.
import { Status, assertEquals, assert } from "./deps.ts";
import { OneWay } from "./oneway.ts";
import {
  OneWayError,
  OneWayErrorType,
} from "./error.ts";
import { MTTransactionStatus } from "./types.ts";
import { HOSTNAME, PORT } from "./_mock_config.ts";

Deno.test("OneWay:sendSMS -> With valid values", async () => {
  const svc = new OneWay({
    baseURL: `http://${HOSTNAME}:${PORT}`,
    apiUsername: "Username",
    apiPassword: "Password",
    senderID: "SenderID",
  });
  try {
    const data = await svc.sendSMS({
      message: "Hello World",
      mobileNo: "60123456789",
    });
    assertEquals(data.mtIDs, [145712468]);
  } catch (err) {
    assert(!err);
  }
});

Deno.test("OneWay:sendSMS -> With multiple mobileNo", async () => {
  const svc = new OneWay({
    baseURL: `http://${HOSTNAME}:${PORT}`,
    apiUsername: "Username",
    apiPassword: "Password",
    senderID: "SenderID",
  });
  try {
    const data = await svc.sendSMS({
      message: "Hello World",
      mobileNo: ["60123456789", "60129876543"],
    });
    assertEquals(data.mtIDs, [145712468, 145712469]);
  } catch (err) {
    assert(!err);
  }
});

Deno.test("OneWay:sendSMS -> With request failure", async () => {
  const svc = new OneWay({
    baseURL: `http://${HOSTNAME}:${PORT}`,
    apiUsername: "Username",
    apiPassword: "Password",
    senderID: "SenderID",
  });
  try {
    const data = await svc.sendSMS({
      message: "request failure",
      mobileNo: "60123456789",
    });
    assert(!data.mtIDs);
  } catch (err) {
    assertEquals(
      err,
      new OneWayError(
        "request failure",
        OneWayErrorType.RequestFailure,
        Status.InternalServerError,
      ),
    );
  }
});

Deno.test("OneWay:sendSMS -> With invalid user credentials", async () => {
  const svc = new OneWay({
    baseURL: `http://${HOSTNAME}:${PORT}`,
    apiUsername: "invalid",
    apiPassword: "invalid",
    senderID: "SenderID",
  });
  try {
    const data = await svc.sendSMS({
      message: "Hello World",
      mobileNo: "60123456789",
    });
    assert(!data.mtIDs);
  } catch (err) {
    assertEquals(
      err,
      new OneWayError(
        "apiusername or apipassword is invalid",
        OneWayErrorType.InvalidCredentials,
      ),
    );
  }
});

Deno.test("OneWay:sendSMS -> With invalid senderID", async () => {
  const svc = new OneWay({
    baseURL: `http://${HOSTNAME}:${PORT}`,
    apiUsername: "Username",
    apiPassword: "Password",
    senderID: "invalid",
  });
  try {
    const data = await svc.sendSMS({
      message: "Hello World",
      mobileNo: "60123456789",
    });
    assert(!data.mtIDs);
  } catch (err) {
    assertEquals(
      err,
      new OneWayError(
        "senderid parameter is invalid",
        OneWayErrorType.InvalidSenderID,
      ),
    );
  }
});

Deno.test("OneWay:sendSMS -> With invalid mobileNo", async () => {
  const svc = new OneWay({
    baseURL: `http://${HOSTNAME}:${PORT}`,
    apiUsername: "Username",
    apiPassword: "Password",
    senderID: "SenderID",
  });
  try {
    const data = await svc.sendSMS({
      message: "Hello World",
      mobileNo: "invalid",
    });
    assert(!data.mtIDs);
  } catch (err) {
    assertEquals(
      err,
      new OneWayError(
        "mobileno parameter is invalid",
        OneWayErrorType.InvalidMobileNo,
      ),
    );
  }
});

Deno.test("OneWay:sendSMS -> With invalid languageType", async () => {
  const svc = new OneWay({
    baseURL: `http://${HOSTNAME}:${PORT}`,
    apiUsername: "Username",
    apiPassword: "Password",
    senderID: "SenderID",
  });
  try {
    const data = await svc.sendSMS({
      message: "Hello World",
      mobileNo: "60123456789",
      languageType: "2", // Invalid language type in mock server
    });
    assert(!data.mtIDs);
  } catch (err) {
    assertEquals(
      err,
      new OneWayError(
        "languagetype is invalid",
        OneWayErrorType.InvalidLanguageType,
      ),
    );
  }
});

Deno.test("OneWay:sendSMS -> With invalid message", async () => {
  const svc = new OneWay({
    baseURL: `http://${HOSTNAME}:${PORT}`,
    apiUsername: "Username",
    apiPassword: "Password",
    senderID: "SenderID",
  });
  try {
    const data = await svc.sendSMS({
      message: "invalid",
      mobileNo: "60123456789",
    });
    assert(!data.mtIDs);
  } catch (err) {
    assertEquals(
      err,
      new OneWayError(
        "characters in message are invalid",
        OneWayErrorType.InvalidMessageCharacters,
      ),
    );
  }
});

Deno.test("OneWay:sendSMS -> With insufficient credit balance", async () => {
  const svc = new OneWay({
    baseURL: `http://${HOSTNAME}:${PORT}`,
    apiUsername: "Username",
    apiPassword: "Password",
    senderID: "SenderID",
  });
  try {
    const data = await svc.sendSMS({
      message: "insufficient credit balance",
      mobileNo: "60123456789",
    });
    assert(!data.mtIDs);
  } catch (err) {
    assertEquals(
      err,
      new OneWayError(
        "insufficient credit balance",
        OneWayErrorType.InsufficientCreditBalance,
      ),
    );
  }
});

Deno.test("OneWay:sendSMS -> With unknown error", async () => {
  const svc = new OneWay({
    baseURL: `http://${HOSTNAME}:${PORT}`,
    apiUsername: "Username",
    apiPassword: "Password",
    senderID: "SenderID",
  });
  try {
    const data = await svc.sendSMS({
      message: "unknown error",
      mobileNo: "60123456789",
    });
    assert(!data.mtIDs);
  } catch (err) {
    assertEquals(
      err,
      new OneWayError(
        "unknown error",
        OneWayErrorType.UnknownError,
      ),
    );
  }
});

Deno.test("OneWay:checkTransactionStatus -> With success status", async () => {
  const svc = new OneWay({
    baseURL: `http://${HOSTNAME}:${PORT}`,
    apiUsername: "Username",
    apiPassword: "Password",
    senderID: "SenderID",
  });
  try {
    const data = await svc.checkTransactionStatus({ mtID: 145712470 });
    assertEquals(data.status, MTTransactionStatus.Success);
  } catch (err) {
    assert(!err);
  }
});

Deno.test("OneWay:checkTransactionStatus -> With telco_delivered status", async () => {
  const svc = new OneWay({
    baseURL: `http://${HOSTNAME}:${PORT}`,
    apiUsername: "Username",
    apiPassword: "Password",
    senderID: "SenderID",
  });
  try {
    const data = await svc.checkTransactionStatus({ mtID: 145712471 });
    assertEquals(data.status, MTTransactionStatus.TelcoDelivered);
  } catch (err) {
    assert(!err);
  }
});

Deno.test("OneWay:checkTransactionStatus -> With invalid mtID", async () => {
  const svc = new OneWay({
    baseURL: `http://${HOSTNAME}:${PORT}`,
    apiUsername: "Username",
    apiPassword: "Password",
    senderID: "SenderID",
  });
  try {
    const data = await svc.checkTransactionStatus({ mtID: 1 });
    assert(!data.status);
  } catch (err) {
    assertEquals(
      err,
      new OneWayError(
        "mtid is invalid or not found",
        OneWayErrorType.MTInvalidNotFound,
      ),
    );
  }
});

Deno.test("OneWay:checkTransactionStatus -> With failed mtID", async () => {
  const svc = new OneWay({
    baseURL: `http://${HOSTNAME}:${PORT}`,
    apiUsername: "Username",
    apiPassword: "Password",
    senderID: "SenderID",
  });
  try {
    const data = await svc.checkTransactionStatus({ mtID: 2 });
    assert(!data.status);
  } catch (err) {
    assertEquals(
      err,
      new OneWayError(
        "message delivery failed",
        OneWayErrorType.MessageDeliveryFailure,
      ),
    );
  }
});

Deno.test("OneWay:checkTransactionStatus -> With unknown error", async () => {
  const svc = new OneWay({
    baseURL: `http://${HOSTNAME}:${PORT}`,
    apiUsername: "Username",
    apiPassword: "Password",
    senderID: "SenderID",
  });
  try {
    const data = await svc.checkTransactionStatus({ mtID: 3 });
    assert(!data.status);
  } catch (err) {
    assertEquals(
      err,
      new OneWayError(
        "unknown error",
        OneWayErrorType.UnknownError,
      ),
    );
  }
});

Deno.test("OneWay:checkCreditBalance -> With valid values", async () => {
  const svc = new OneWay({
    baseURL: `http://${HOSTNAME}:${PORT}`,
    apiUsername: "Username",
    apiPassword: "Password",
    senderID: "SenderID",
  });
  try {
    const data = await svc.checkCreditBalance();
    assertEquals(data.creditBalance, 6500);
  } catch (err) {
    assert(!err);
  }
});

Deno.test("OneWay:checkCreditBalance -> With invalid user credentials", async () => {
  const svc = new OneWay({
    baseURL: `http://${HOSTNAME}:${PORT}`,
    apiUsername: "invalid",
    apiPassword: "invalid",
    senderID: "SenderID",
  });
  try {
    const data = await svc.checkCreditBalance();
    assert(!data.creditBalance);
  } catch (err) {
    assertEquals(
      err,
      new OneWayError(
        "apiusername or apipassword is invalid",
        OneWayErrorType.InvalidCredentials,
      ),
    );
  }
});

Deno.test("OneWay:checkCreditBalance -> With unknown error", async () => {
  const svc = new OneWay({
    baseURL: `http://${HOSTNAME}:${PORT}`,
    apiUsername: "unknown error",
    apiPassword: "unknown error",
    senderID: "SenderID",
  });
  try {
    const data = await svc.checkCreditBalance();
    assert(!data.creditBalance);
  } catch (err) {
    assertEquals(
      err,
      new OneWayError(
        "unknown error",
        OneWayErrorType.UnknownError,
      ),
    );
  }
});
