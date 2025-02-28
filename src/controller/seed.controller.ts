// seed.controller.ts

import { faker } from "@faker-js/faker/locale/vi";
import { Request, Response } from "express";

import { getRandomTransformHanoiDistricts } from "../seed/data";
import { category } from "../utils/category";
import { statusPost } from "../utils/statusPost";
import moment from "moment";

// Utils function

// get random category
const getRandomCategory = () => {
  const randomIndex = Math.floor(Math.random() * category.length);
  return category[randomIndex];
};

// get random status post
const getRandomStatusPost = () => {
  const randomIndex = Math.floor(Math.random() * statusPost.length);
  return statusPost[randomIndex];
};

// Hàm để tạo ra ngày ngẫu nhiên trong phạm vi từ đầu năm hiện tại đến ngày hiện tại
function getRandomPastDateInCurrentYear() {
  const startOfYear = moment().startOf("year"); // Đầu năm hiện tại
  const currentDate = moment(); // Ngày hiện tại
  const daysInYear = currentDate.diff(startOfYear, "days"); // Số ngày từ đầu năm đến hiện tại

  // Tạo số ngày ngẫu nhiên từ 1 đến số ngày từ đầu năm đến hiện tại
  const randomDaysAgo = Math.floor(Math.random() * daysInYear) + 1;

  // Tạo ngày ngẫu nhiên bằng cách trừ đi số ngày ngẫu nhiên từ ngày hiện tại
  const randomDate = currentDate.subtract(randomDaysAgo, "days").toDate();

  return randomDate;
}

//   ----------------

export async function seedUserHandler(req: Request, res: Response) {
  try {
    const number = parseInt(req.params.number);

    const User = require("../models/user.model").default;

    for (let i = 0; i < number; i++) {
      const user = new User({
        name: faker.person.fullName(),
        phone: faker.phone.number("0#########"),
        password: "123123",
        // password:
        //   "$2b$10$.KtyZL.Euh.0C/uAstJc7u4.6Q.KfGBd89pflwzOALPcW2IMKqSri",
        verify: true,
        role: "user",
        avatar:
          "https://res.cloudinary.com/anhkieu303252/image/upload/v1718519688/default_avatar_eyua30.jpg",
        // avatar: faker.image.avatar(),
        geoLocation: {
          location: getRandomTransformHanoiDistricts(),
          radius: 5,
        },
        // random createdAt and updatedAt in current year
        createdAt: getRandomPastDateInCurrentYear(),
        updatedAt: new Date(),
      });
      await user.save();
    }

    return res.send(`Seed ${number} user successfully`);
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
}

export async function seedPostHandler(req: Request, res: Response) {
  try {
    const number = parseInt(req.params.number);

    const User = require("../models/user.model").default;
    const Post = require("../models/post.model").default;

    // Get all user
    const users = await User.find({ role: "user" });

    for (let i = 0; i < number; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      //   console.log("user", user._id, user.geoLocation.location);

      const randomCategory = getRandomCategory();
      const randomStatusPost = getRandomStatusPost();

      const post = new Post({
        userId: user._id,
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        images: [faker.image.url()],
        price: faker.number.int({ min: 20000, max: 500000 }),
        phone: user.phone,
        category: randomCategory,
        status: randomStatusPost,
        location: {
          type: "Point",
          coordinates: user.geoLocation.location.coordinates,
          lat: user.geoLocation.location.lat,
          lon: user.geoLocation.location.lon,
          displayName: user.geoLocation.location.displayName,
        },
        // random createdAt and updatedAt in current year
        createdAt: getRandomPastDateInCurrentYear(),
        updatedAt: new Date(),
      });
      await post.save();
    }

    return res.send(`Seed ${number} post successfully`);
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
}
