import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import json_parser from "../json_parser.js";

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
    
const __dirname = dirname(fileURLToPath(import.meta.url));

const router = express.Router();
router.use(express.json());
router.use(cors());

router.post("/download_file", (req, res) => {
  const { date, option, events } = req.body;
  const parser = new json_parser();
  try {
    const result = parser.create_csv_document(date, option, events)
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