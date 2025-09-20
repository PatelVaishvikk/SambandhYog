import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
import { connectToDatabase } from "../src/lib/mongodb.js";
import User from "../src/models/User.js";
import Post from "../src/models/Post.js";
import Follow from "../src/models/Follow.js";
import { hashPassword } from "../src/utils/encryption.js";

const sampleUsers = [
  {
    name: "Neha Kapoor",
    email: "neha.kapoor@example.com",
    username: "nehak",
    headline: "Growth PM @ Uplift",
    password: "password123",
  },
  {
    name: "Kabir Joshi",
    email: "kabir.joshi@example.com",
    username: "kabirj",
    headline: "Founder | Circle Labs",
    password: "password123",
  },
  {
    name: "Ishita Mehta",
    email: "ishita.mehta@example.com",
    username: "ishitam",
    headline: "Product Designer",
    password: "password123",
  },
];

const samplePosts = [
  {
    authorEmail: "neha.kapoor@example.com",
    title: "Celebrating our mentorship cohort",
    content:
      "We wrapped the third cohort of our mentorship program. 12 mentees landed new roles, and the positivity of this group keeps me energised!",
    tags: ["mentorship", "community"],
    likedBy: ["kabir.joshi@example.com", "ishita.mehta@example.com"],
    comments: [
      {
        authorEmail: "kabir.joshi@example.com",
        content: "Huge congrats Neha! The intent you bring to the sessions is inspiring.",
      },
      {
        authorEmail: "ishita.mehta@example.com",
        content: "Thank you for the templates you shared – helped us reboot our buddy program!",
      },
    ],
  },
  {
    authorEmail: "kabir.joshi@example.com",
    title: "First beta customers on board",
    content:
      "Circle Labs just onboarded our first 20 beta customers. Grateful for the SambandhYog community for early feedback and encouragement.",
    tags: ["startups", "milestone"],
    likedBy: ["neha.kapoor@example.com"],
    comments: [
      {
        authorEmail: "neha.kapoor@example.com",
        content: "So proud of this leap, Kabir! Your transparency keeps us rooting for you.",
      },
    ],
  },
  {
    authorEmail: "ishita.mehta@example.com",
    title: "Designing with empathy",
    content:
      "Sharing a toolkit we use to run empathy mapping workshops with cross-functional teams. Happy to jam with anyone trying to build mindful products.",
    tags: ["design", "toolkit"],
    likedBy: ["neha.kapoor@example.com", "kabir.joshi@example.com"],
    comments: [],
  },
];

async function ensureUser(userData) {
  const email = userData.email.toLowerCase();
  let user = await User.findOne({ email });
  if (user) {
    return user;
  }
  const hashed = await hashPassword(userData.password);
  user = await User.create({
    name: userData.name,
    email,
    username: userData.username,
    password: hashed,
    headline: userData.headline,
    bio: "Always cheering for kinder careers.",
  });
  return user;
}

async function ensureMutualFollows(users) {
  const ids = users.map((user) => user._id.toString());
  for (let i = 0; i < ids.length; i += 1) {
    for (let j = 0; j < ids.length; j += 1) {
      if (i === j) continue;
      const follower = ids[i];
      const following = ids[j];
      const existing = await Follow.findOne({ follower, following });
      if (!existing) {
        await Follow.create({ follower, following });
      }
    }
  }
}

async function ensurePost(postData, usersByEmail) {
  const author = usersByEmail.get(postData.authorEmail.toLowerCase());
  if (!author) {
    return null;
  }
  const existing = await Post.findOne({ author: author._id, title: postData.title });
  if (existing) {
    return existing;
  }

  const comments = await Promise.all(
    (postData.comments ?? []).map(async (comment) => {
      const authorDoc = usersByEmail.get(comment.authorEmail.toLowerCase());
      return {
        author: authorDoc?._id,
        content: comment.content,
      };
    })
  );

  const likedBy = (postData.likedBy ?? [])
    .map((email) => usersByEmail.get(email.toLowerCase())?._id)
    .filter(Boolean);

  const post = await Post.create({
    author: author._id,
    title: postData.title,
    content: postData.content,
    tags: postData.tags ?? [],
    likedBy,
    likes: likedBy.length,
    comments,
  });

  return post;
}

async function main() {
  await connectToDatabase();

  const users = await Promise.all(sampleUsers.map(ensureUser));
  const usersByEmail = new Map(users.map((user) => [user.email.toLowerCase(), user]));

  await ensureMutualFollows(users);

  await Promise.all(samplePosts.map((post) => ensurePost(post, usersByEmail)));

  console.log("Seed data inserted successfully.");
}

main()
  .then(() => mongoose.connection.close())
  .catch((error) => {
    console.error("Failed to seed database", error);
    mongoose.connection.close();
    process.exit(1);
  });
