import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import json_parser from "../json_parser.js";

const router = express.Router();
router.use(express.json());
router.use(cors());

const __dirname = import.meta.dirname;

router.post("/download_file", (req, res) => {
  const { date } = req.body;
  const parser = new json_parser();
  try {
    const result = parser.create_csv_document(date)
    res.status(200).json(result);
  }
  catch (error) {
    res.status(404).send(error);
    console.log(error);
  }
});

router.get("/:filename", (req, res) => {
    const filepath = path.join(__dirname, "../EVENTS", req.params.filename);
    res.status(200).sendFile(filepath);
  
    setTimeout(() => {
      fs.unlink(filepath, (err) => {
        if (err) {
          console.log("Error with file");
        }
  
        console.log(`File: ${filepath} was removed`)
  
      });
    }, 10000)
  
});

export default router;