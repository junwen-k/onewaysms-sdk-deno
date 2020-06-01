// Copyright 2020 KwanJunWen. All rights reserved. MIT license.
import {
  Status,
  STATUS_TEXT,
} from "./deps.ts";
/**
 * OneWay specific error. Switch based on code to handle specific error
 * when using OneWayClient.
 *
 *    try {
 *      ...
 *    } catch (err) {
 *      if (err instanceof OneWayError) {
 *        switch (err.code) {
 *          case OneWayErrorType.RequestFailure:
 *            // Handle RequestFailure
 *          ...
 *          default:
 *        }
 *      } else {
 *        // Handle Generic Error
 *      }
 *    }
 */
export class OneWayError extends Error {
  readonly code: OneWayErrorType;
  readonly statusCode: Status;

  constructor(message: string, code: OneWayErrorType, statusCode?: Status) {
    const _statusCode = statusCode || Status.OK;
    super(`${statusCode} (${STATUS_TEXT.get(_statusCode)}): ${message}`);
    this.statusCode = _statusCode;
    this.name = "OneWayError";
    this.code = code;
  }
}

export enum OneWayErrorType {
  /**
   * Request Failure error. Error is thrown when response status is not OK.
   */
  RequestFailure = "RequestFailure",
  /**
   * Invalid Credentials error. Error is thrown when API Username or API Password
   * is invalid.
   */
  InvalidCredentials = "InvalidCredentials",
  /**
   * Invalid Sender ID error. Error is thrown when Sender ID is not valid.
   */
  InvalidSenderID = "InvalidSenderID",
  /**
   * Invalid Mobile Number error. Error is thrown when Mobile No is not valid.
   */
  InvalidMobileNo = "InvalidMobileNo",
  /**
   * Invalid LanguageType error. Error is thrown when Language type is not valid.
   */
  InvalidLanguageType = "InvalidLanguageType",
  /**
   * Invalid Message Characters error. Error is thrown when there are invalid characters
   * in the request message.
   */
  InvalidMessageCharacters = "InvalidMessageCharacters",
  /**
   * InsufficientCreditBalance error. Error is thrown when the user does not have
   * sufficient credit balance to perform certain tasks.
   */
  InsufficientCreditBalance = "InsufficientCreditBalance",
  /**
   * Mobile terminating ID invalid or not found error. Error is thrown when Mobile Terminating
   * ID is not a valid ID or not found.
   */
  MTInvalidNotFound = "MTInvalidNotFound",
  /**
   * Message delivery failure error. Error is thrown when Message has been failed to deliver
   * when calling check transaction status API.
   */
  MessageDeliveryFailure = "MessageDeliveryFailure",
  /**
   * Unknown error. Unknown Response returned from OneWay API Gateway.
   */
  UnknownError = "UnknownError",
}
