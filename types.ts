// Copyright 2020 KwanJunWen. All rights reserved. MIT license.
export interface OneWayClient {
  sendSMS(input: SendSMSInput): Promise<SendSMSOutput>;
  checkTransactionStatus(
    input: CheckTransactionStatusInput,
  ): Promise<CheckTransactionStatusOutput>;
  checkCreditBalance(): Promise<CheckCreditBalanceOutput>;
}

/**
 * URL path to access OneWaySMS API.
 * "api.aspx" - MT URL path.
 * "bulktrx.aspx" - Check MT transaction URL path.
 * "bulkcredit.aspx" - Check credit balance URL path.
 */
export type OneWayURLPath = "api.aspx" | "bulktrx.aspx" | "bulkcredit.aspx";

/**
 * OneWaySMS API request URL parameters.
 */
export type OneWayURLParams = Record<
  | "apiusername"
  | "apipassword"
  | "senderid"
  | "mobileno"
  | "languagetype"
  | "message"
  | "mtid",
  string
>;

export interface OneWayClientConfig
  extends OneWayUserCredentials, OneWaySenderID {
  /**
   * BaseURL to onewaysms gateway exluding trailing "/".
   * For example: http://gatewayd2.onewaysms.sg:10002
   */
  baseURL: string;
}

export interface OneWayUserCredentials {
  /**
   * Username for your API. (can be obtain under API section once you have log into your account).
   */
  apiUsername: string;
  /**
   * Password for your API. (can be obtain under API section once you have log into your account).
   */
  apiPassword: string;
}

export interface OneWaySenderID {
  /**
   * Refer to sender. Field can take up to 11 alphanumeric characters.
   */
  senderID: string;
}

/**
 * Language Type of the SMS. Indicating the type of sms sent.
 * "1" - Normal Text message (160 characters as 1 MT)
 * "2" - Unicode Text message (70 characters as 1 MT)
 */
export type LanguageType = "1" | "2";

export type SendSMSURLParams = Pick<
  OneWayURLParams,
  | "apiusername"
  | "apipassword"
  | "senderid"
  | "mobileno"
  | "languagetype"
  | "message"
>;

export interface SendSMSInput extends Partial<OneWaySenderID> {
  /**
   * Language Type of the SMS. Refer to LanguageType for details.
   */
  languageType?: LanguageType;
  /**
   * Content of the SMS.
   *
   * Example, if languagetype set to 1, and message
   * has content with length 200, 2 SMS will be sent.
   *
   * SMS can be combined. 7 characters will be used to combine.
   * Below are the character count:
   *
   * 1 SMS = 160 characters
   * 2 SMS = 306 characters (14 characters for joining)
   * 3 SMS = 459 characters (21 characters for joining)
   *
   * We recommend sending up to maximum up to 3 SMS.
   */
  message: string;
  /**
   * Phone number of recipient. Phone number must include country code.
   * For example: 6581234567.
   */
  mobileNo: string | string[];
}

export interface SendSMSOutput {
  /**
   * Mobile terminating ID(s) from the send SMS result.
   */
  mtIDs: number[];
}

export type CheckTransactionStatusURLParams = Pick<OneWayURLParams, "mtid">;

export interface CheckTransactionStatusInput {
  /**
   * Mobile terminating ID returned from the send SMS result.
   */
  mtID: number;
}

export interface CheckTransactionStatusOutput {
  /**
   * Status of the mobile terminating transaction.
   * Refer to MTTransactionStatus for more details.
   */
  status: MTTransactionStatus;
}

export type CheckCreditBalanceURLParams = Pick<
  OneWayURLParams,
  "apiusername" | "apipassword"
>;

export interface CheckCreditBalanceOutput {
  /**
   * Remaining credit balance for the account of this client's config.
   */
  creditBalance: number;
}

export enum MTTransactionStatus {
  /**
   * Successfully sent message.
   */
  Success = "success",
  /**
   * Message has been delivered to Telco.
   */
  TelcoDelivered = "telco_delivered",
}
