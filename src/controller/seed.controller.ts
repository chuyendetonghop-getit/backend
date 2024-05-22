// seed.controller.ts

import { faker } from "@faker-js/faker/locale/vi";
import { Request, Response } from "express";

import { getRandomTransformHanoiDistricts } from "../seed/data";
import { category } from "../utils/category";
import { statusPost } from "../utils/statusPost";

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
        avatar: "https://source.unsplash.com/random/200×200/?avatar",
        // avatar: faker.image.avatar(),
        geoLocation: {
          location: getRandomTransformHanoiDistricts(),
          radius: 5,
        },
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
      });
      await post.save();
    }

    return res.send(`Seed ${number} post successfully`);
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
}
