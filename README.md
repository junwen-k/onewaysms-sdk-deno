# OneWaySMS SDK for Deno

A non official OneWaySMS SDK written for Deno runtime. Based on the latest [v1.3](http://smsd2.onewaysms.sg/api.pdf) OneWaySMS API documentation.

## Installing

1. Import the SDK by using an URL.

```ts
import {
  OneWay,
  OneWayError,
} from "https://raw.githubusercontent.com/junwen-k/onewaysms/master/mod.ts";
```

1. Initializing a new client.

```ts
const svc = new OneWay({
  baseURL: "API_BASE_URL",
  apiUsername: "API_USERNAME",
  apiPassword: "API_PASSWORD",
  senderID: "SENDER_ID",
});
```

## Usage and Getting Started

1. **Send SMS** - Send SMS by calling OneWaySMS API gateway, returning mobile terminating ID(s) if request is successful.

```ts
try {
  const data = await svc.sendSMS({
    message: "Hello, 世界",
    mobileNo: ["60123456789", "60129876543"],
  });
  // mtIDs - Mobile terminating IDs
  console.log(data.mtIDs);
} catch (err) {
  if (err instanceof OneWayError) {
    switch (err.code) {
      case OneWayErrorType.RequestFailure:
      // Handle RequestFailure
      case OneWayErrorType.InvalidCredentials:
      // Handle InvalidCredentials
      case OneWayErrorType.InvalidSenderID:
      // Handle InvalidSenderID
      case OneWayErrorType.InvalidMobileNo:
      // Handle InvalidMobileNo
      case OneWayErrorType.InvalidLanguageType:
      // Handle InvalidLanguageType
      case OneWayErrorType.InvalidMessageCharacters:
      // Handle InvalidMessageCharacters
      case OneWayErrorType.InsufficientCreditBalance:
      // Handle InsufficientCreditBalance
      case OneWayErrorType.UnknownError:
      // Handle UnknownError
      default:
    }
  } else {
    // Handle Generic Error
  }
}
```

1. **Check MT Transaction Status** - Check mobile terminating transaction status based on mobile terminating ID provided. Mobile terminating ID can be obtained by calling send SMS API.

```ts
try {
  const data = await svc.checkTransactionStatus({ mtID: MT_ID });
  switch (data.status) {
    case MTTransactionStatus.Success:
    // Handle success status
    case MTTransactionStatus.TelcoDelivered:
    // Handle telco delivered status
    default:
  }
} catch (err) {
  if (err instanceof OneWayError) {
    switch (err.code) {
      case OneWayErrorType.MTInvalidNotFound:
      // Handle MTInvalidNotFound
      case OneWayErrorType.MessageDeliveryFailure:
      // Handle MessageDeliveryFailure
      case OneWayErrorType.UnknownError:
      // Handle UnknownError
      default:
    }
  } else {
    // Handle Generic Error
  }
}
```

1. **Check Credit Balance**. Check remaining credit balance for the account in the client's config.

```ts
try {
  const data = await svc.checkCreditBalance();
  // creditBalance - Remaining credit balance for this account
  console.log(data.creditBalance);
} catch (err) {
  if (err instanceof OneWayError) {
    switch (err.code) {
      case OneWayErrorType.InvalidCredentials:
      // Handle InvalidCredentials
      case OneWayErrorType.UnknownError:
      // Handle UnknownError
      default:
    }
  } else {
    // Handle Generic Error
  }
}
```

## License

This SDK is distributed under the MIT License, see LICENSE.txt for more information.
