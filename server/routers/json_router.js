import express from "express";
import cors from "cors";
import json_parser from "../json_parser.js"

const router = express.Router();
router.use(express.json());
router.use(cors());

router.post("/fetch_events", async (req, res) => {
  const { date } = req.body;
  const parser = new json_parser();
  try {
    const calendar = await parser.fetch_calendar(date);
    res.status(200).json(calendar);
  }
  catch (error) {
    res.status(404).send(error);
    console.log(error);
  }
});

router.post("/fetch_events_with_errors", async (req, res) => {
  const { date } = req.body;
  const parser = new json_parser();
  try {
    const events = await parser.fetch_calendar(date);
    res.status(200).json(parser.generate_json(events));
  }
  catch (error) {
    res.status(404).send(error);
    console.log(error);
  }
});

export default router;