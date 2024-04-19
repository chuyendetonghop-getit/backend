import axios from "axios";
import config from "config";
import logger from "./logger";

export async function sendSMS(phoneNumber: string, message: string) {
  const url = "https://sms-gateway-server.onrender.com/send-sms";
  message = `GET-IT Project | ${message}`;

  try {
    const response = await axios.post(
      url,
      {
        phoneNumber,
        message,
      },
      {
        headers: {
          "x-api-key": "this_is_a_secret_key",
        },
      }
    );
    logger.info(response?.data?.message);
    return response;
  } catch (error) {
    console.error("Error sending SMS:", error);
    return error;
  }
}
