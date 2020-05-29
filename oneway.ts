// Copyright 2020 KwanJunWen. All rights reserved. MIT license.
import {
  CheckCreditBalanceOutput,
  CheckTransactionStatusInput,
  CheckTransactionStatusOutput,
  LanguageType,
  MTTransactionStatus,
  OneWayClient,
  OneWayClientConfig,
  SendSMSInput,
  SendSMSOutput,
} from "./types.ts";
import {
  OneWayError,
  OneWayErrorType,
} from "./error.ts";

// Based on specifications found in http://smsd2.onewaysms.sg/api.pdf.
export class OneWay implements OneWayClient {
  private readonly config: OneWayClientConfig;

  constructor(config: OneWayClientConfig) {
    this.config = config;
  }

  /**
   * Convert message into hexadecimal value.
   * Automatically pad each character to 4 values with "0".
   */
  private messageToHex(message: string): string {
    const buf = [];
    for (let n = 0, l = message.length; n < l; n++) {
      buf.push(Number(message.charCodeAt(n)).toString(16).padStart(4, "0"));
    }
    return buf.join("");
  }

  /**
   * Get language type based on the message provided.
   * Checking is done based on byte length of each character.
   */
  private getLanguageType(message: string): LanguageType {
    const encoder = new TextEncoder();
    for (let n = 0, l = message.length; n < l; n++) {
      if (encoder.encode(message.charAt(n)).byteLength > 1) {
        return "2";
      }
    }
    return "1";
  }

  /**
   * Builds request URL to send mobile terminating message based on SMS provided.
   */
  private buildSendSMSRequestURL(input: SendSMSInput): string {
    const { baseURL, apiUsername, apiPassword, senderID } = this.config;

    const urlParams = new URLSearchParams();

    if (!input.languageType) {
      input.languageType = this.getLanguageType(input.message);
    }

    urlParams.set("apiusername", apiUsername);
    urlParams.set("apipassword", apiPassword);
    urlParams.set("senderid", senderID);
    urlParams.set("mobileno", input.mobileNo.toString());
    urlParams.set("languagetype", input.languageType);
    urlParams.set(
      "message",
      input.languageType === "2"
        ? this.messageToHex(input.message)
        : input.message,
    );

    return `${baseURL}/api.aspx?${urlParams.toString()}`;
  }

  /**
   * Builds request URL to check transaction status based on mobile terminating ID provided.
   */
  private buildCheckTransactionStatusRequestURL(
    input: CheckTransactionStatusInput,
  ): string {
    const { baseURL } = this.config;

    const urlParams = new URLSearchParams();

    urlParams.set("mtid", input.mtID.toString());

    return `${baseURL}/bulktrx.aspx?${urlParams.toString()}`;
  }

  /**
   * Builds request URL to check remaining credit balance based on API Username and API Password
   * from client's config.
   */
  private buildCheckCreditBalanceRequestURL(): string {
    const { baseURL, apiUsername, apiPassword } = this.config;

    const urlParams = new URLSearchParams();

    urlParams.set("apiusername", apiUsername);
    urlParams.set("apipassword", apiPassword);

    return `${baseURL}/bulkcredit.aspx?${urlParams.toString()}`;
  }

  /**
   * Initiate send SMS request. SMS's language type will be automatically set unless it is
   * defined in the SMS request structure.
   *
   *    const svc = new OneWay({
   *      baseURL: "API_BASE_URL",
   *      apiUsername: "API_USERNAME",
   *      apiPassword: "API_PASSWORD",
   *      senderID: "SENDER_ID",
   *    });
   *    try {
   *      const data = await svc.sendSMS({
   *        message: "Hello, 世界",
   *        mobileNo: ["60123456789", "60129876543"],
   *      });
   *      // mtIDs - Mobile terminating IDs
   *      console.log(data.mtIDs);
   *    } catch (err) {
   *      if (err instanceof OneWayError) {
   *        switch (err.code) {
   *          case OneWayErrorType.RequestFailure:
   *            // Handle RequestFailure
   *          case OneWayErrorType.InvalidCredentials:
   *            // Handle InvalidCredentials
   *          case OneWayErrorType.InvalidSenderID:
   *            // Handle InvalidSenderID
   *          case OneWayErrorType.InvalidMobileNo:
   *            // Handle InvalidMobileNo
   *          case OneWayErrorType.InvalidLanguageType:
   *            // Handle InvalidLanguageType
   *          case OneWayErrorType.InvalidMessageCharacters:
   *            // Handle InvalidMessageCharacters
   *          case OneWayErrorType.InsufficientCreditBalance:
   *            // Handle InsufficientCreditBalance
   *          case OneWayErrorType.UnknownError:
   *            // Handle UnknownError
   *          default:
   *        }
   *      } else {
   *        // Handle Generic Error
   *      }
   *    }
   */
  async sendSMS(
    input: SendSMSInput,
  ): Promise<SendSMSOutput> {
    const requestURL = this.buildSendSMSRequestURL(input);
    return Promise.resolve(
      new Promise((res, rej) => {
        fetch(requestURL).then((resp) => {
          if (!resp.ok) {
            rej(
              new OneWayError(
                "request failure",
                OneWayErrorType.RequestFailure,
                resp.status,
              ),
            );
          }
          return resp.text();
        }).then((respText: string): void => {
          const mtIDs = respText.split(",").map((t: string) => parseInt(t));
          if (mtIDs.length > 0) {
            if (mtIDs[0] > 0) {
              res({ mtIDs });
              return;
            }
            switch (mtIDs[0]) {
              case -100:
                rej(
                  new OneWayError(
                    "apiusername or apipassword is invalid",
                    OneWayErrorType.InvalidCredentials,
                  ),
                );
                return;
              case -200:
                rej(
                  new OneWayError(
                    "senderid parameter is invalid",
                    OneWayErrorType.InvalidSenderID,
                  ),
                );
                return;
              case -300:
                rej(
                  new OneWayError(
                    "mobileno parameter is invalid",
                    OneWayErrorType.InvalidMobileNo,
                  ),
                );
                return;
              case -400:
                rej(
                  new OneWayError(
                    "languagetype is invalid",
                    OneWayErrorType.InvalidLanguageType,
                  ),
                );
                return;
              case -500:
                rej(
                  new OneWayError(
                    "characters in message are invalid",
                    OneWayErrorType.InvalidMessageCharacters,
                  ),
                );
                return;
              case -600:
                rej(
                  new OneWayError(
                    "insufficient credit balance",
                    OneWayErrorType.InsufficientCreditBalance,
                  ),
                );
                return;
              default:
                rej(
                  new OneWayError(
                    "unknown error",
                    OneWayErrorType.UnknownError,
                  ),
                );
                return;
            }
          }
        })
          .catch(rej);
      }),
    );
  }

  /**
   * Check transaction status based on mobile terminating ID provided.
   *
   *    const svc = new OneWay({
   *      url: "API_BASE_URL",
   *      apiUsername: "API_USERNAME",
   *      apiPassword: "API_PASSWORD",
   *      senderID: "SENDER_ID",
   *    });
   *    try {
   *      const data = await svc.checkTransactionStatus({ mtID: MT_ID });
   *      switch (data.status) {
   *        case MTTransactionStatus.Success:
   *          // Handle success status
   *        case MTTransactionStatus.TelcoDelivered:
   *          // Handle telco delivered status
   *        default:
   *      }
   *    } catch (err) {
   *      if (err instanceof OneWayError) {
   *        switch (err.code) {
   *          case OneWayErrorType.MTInvalidNotFound:
   *            // Handle MTInvalidNotFound
   *          case OneWayErrorType.MessageDeliveryFailure:
   *            // Handle MessageDeliveryFailure
   *          case OneWayErrorType.UnknownError:
   *            // Handle UnknownError
   *          default:
   *        }
   *      } else {
   *        // Handle Generic Error
   *      }
   *    }
   */
  async checkTransactionStatus(
    input: CheckTransactionStatusInput,
  ): Promise<CheckTransactionStatusOutput> {
    const requestURL = this.buildCheckTransactionStatusRequestURL(input);
    return Promise.resolve(
      new Promise((res, rej) => {
        fetch(requestURL)
          .then((resp) => resp.text())
          .then((respText: string): void => {
            const status = parseInt(respText);
            switch (status) {
              case 0:
                res({ status: MTTransactionStatus.Success });
                return;
              case 100:
                res({ status: MTTransactionStatus.TelcoDelivered });
                return;
              case -100:
                rej(
                  new OneWayError(
                    "mtid is invalid or not found",
                    OneWayErrorType.MTInvalidNotFound,
                  ),
                );
                return;
              case -200:
                rej(
                  new OneWayError(
                    "message delivery failed",
                    OneWayErrorType.MessageDeliveryFailure,
                  ),
                );
                return;
              default:
                rej(
                  new OneWayError(
                    "unknown error",
                    OneWayErrorType.UnknownError,
                  ),
                );
                return;
            }
          })
          .catch(rej);
      }),
    );
  }

  /**
   * Check remaining credit balance based on API Username and Password from client's config.
   *
   *    const svc = new OneWay({
   *      baseURL: "API_BASE_URL",
   *      apiUsername: "API_USERNAME",
   *      apiPassword: "API_PASSWORD",
   *      senderID: "SENDER_ID",
   *    });
   *    try {
   *      const data = await svc.checkCreditBalance();
   *      // creditBalance - Remaining credit balance for this account
   *      console.log(data.creditBalance);
   *    } catch (err) {
   *      if (err instanceof OneWayError) {
   *        switch (err.code) {
   *          case OneWayErrorType.InvalidCredentials:
   *            // Handle InvalidCredentials
   *          case OneWayErrorType.UnknownError:
   *            // Handle UnknownError
   *          default:
   *        }
   *      } else {
   *        // Handle Generic Error
   *      }
   *    }
   */
  async checkCreditBalance(): Promise<CheckCreditBalanceOutput> {
    const requestURL = this.buildCheckCreditBalanceRequestURL();
    return Promise.resolve(
      new Promise((res, rej) => {
        fetch(requestURL)
          .then((resp) => resp.text())
          .then((respText: string): void => {
            const creditBalance = parseInt(respText);
            if (creditBalance >= 0) {
              res({ creditBalance });
              return;
            }
            switch (creditBalance) {
              case -100:
                rej(
                  new OneWayError(
                    "apiusername or apipassword is invalid",
                    OneWayErrorType.InvalidCredentials,
                  ),
                );
                return;
              default:
                rej(
                  new OneWayError(
                    "unknown error",
                    OneWayErrorType.UnknownError,
                  ),
                );
                return;
            }
          })
          .catch(rej);
      }),
    );
  }
}
