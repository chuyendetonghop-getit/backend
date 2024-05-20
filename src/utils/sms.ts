import axios from "axios";
import config from "config";
import logger from "./logger";

export async function sendSMS(phoneNumber: string, message: string) {
  const url = "https://www.cloud.smschef.com/api/send/sms";
  message = `GET-IT Project | ${message}`;

  // transform phone number from 0xxx to +84xxx
  if (phoneNumber.startsWith("0")) {
    phoneNumber = `+84${phoneNumber.slice(1)}`;
  }

  const queryParam = new URLSearchParams({
    secret: config.get("smsChefSecret"),
    mode: config.get("smsChefMode"),
    device: config.get("smsChefDeviceId"),
    sim: config.get("smsChefSIM"),
    phone: phoneNumber,
    message,
  });

  try {
    const response = await axios.get(url, {
      params: queryParam,
    });
    logger.warn(response?.data?.message);
    return response;
  } catch (error) {
    console.error("Error sending SMS:", error);
    return error;
  }
  // const url = "https://sms-gateway-server.onrender.com/send-sms";
  // message = `GET-IT Project | ${message}`;

  // try {
  //   const response = await axios.post(
  //     url,
  //     {
  //       phoneNumber,
  //       message,
  //     },
  //     {
  //       headers: {
  //         "x-api-key": "this_is_a_secret_key",
  //       },
  //     }
  //   );
  //   logger.info(response?.data?.message);
  //   return response;
  // } catch (error) {
  //   console.error("Error sending SMS:", error);
  //   return error;
  // }
}
