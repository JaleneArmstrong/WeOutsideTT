import cors from "cors";
import express from "express";
import pkgPostgres from "pg";
const { Pool } = pkgPostgres;

import PrismaClientPkg from "@prisma/client";
const { PrismaClient } = PrismaClientPkg;

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();
app.use(cors());
app.use(express.json());

// --- AUTH ROUTES ---
app.post("/register", async (req, res) => {
  const { email, password, name, company } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const promoter = await prisma.promoter.create({
      data: {
        email,
        password: hashedPassword,
        name,
        company,
      },
    });

    res.json({ message: "Account created!", id: promoter.id });
  } catch (error) {
    console.error("Register Error:", error);
    if (error.code === "P2002") {
      res.status(400).json({ error: "That email is already registered." });
    } else {
      res.status(500).json({ error: "Could not create account." });
    }
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const promoter = await prisma.promoter.findUnique({
      where: { email: email },
    });

    if (!promoter) {
      return res.status(401).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, promoter.password);

    if (isMatch) {
      res.json({
        id: promoter.id,
        name: promoter.name,
        email: promoter.email,
        company: promoter.company,
      });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// --- EVENT ROUTES ---

app.get("/events", async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: { promoter: true },
      orderBy: { startDate: "asc" },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.post("/events", async (req, res) => {
  const {
    title,
    latitude,
    longitude,
    locationName,
    startDate,
    endDate,
    startTime,
    endTime,
    tags,
    description,
    image,
    promoterId,
  } = req.body;

  try {
    let finalPromoterId = parseInt(promoterId);

    if (isNaN(finalPromoterId)) {
      console.log("⚠️ Warning: received NaN promoterId. Auto-fixing...");
      const fallbackUser = await prisma.promoter.findFirst();
      if (fallbackUser) {
        finalPromoterId = fallbackUser.id;
        console.log(
          `✅ Assigned to fallback user: ${fallbackUser.name} (ID: ${finalPromoterId})`,
        );
      } else {
        return res
          .status(400)
          .json({ error: "No users exist in DB to assign event to." });
      }
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        locationName,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : new Date(startDate),
        startTime,
        endTime,
        tags,
        description,
        image,
        promoterId: finalPromoterId,
      },
    });
    res.json(newEvent);
  } catch (error) {
    console.error("Create Event Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- SERVER START ---
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 WeOutside! Server running at http://0.0.0.0:${PORT}`);
});
