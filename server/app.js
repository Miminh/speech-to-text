const express = require("express");
const cors = require("cors");
const multer = require("multer");
const app = express();
const { createClient } = require("@deepgram/sdk");
const fs = require("fs");
const path = require("path");

const filename = "test.ogg";

app.use(cors());

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, "test.ogg");
  },
  destination: function (req, file, cb) {
    cb(null, "./file");
  },
});

const deepgram = createClient("1fe737dd44d5bb4bd805dcf2b4833d47dac1aa72");

// Detects speech in the audio file
const requestTranscription = async () => {
  try {
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      fs.readFileSync(path.join(__dirname, "file", filename)),
      {
        model: "nova-2",
        smart_format: true,
      }
    );

    if (error) throw error;
    if (!error) {
      const channels = result.results.channels;
      console.log(channels);
      const paragraphs = channels.map((channel) =>
        channel.alternatives.reduce(
          (initial, current) =>
            initial +
            current.words.reduce(
              (initial, current) =>
                initial + (current.punctuated_word || current.word),
              ""
            ),
          ""
        )
      );
      return paragraphs;
    }
  } catch (err) {
    throw new Error(err);
  }
};

const uploader = multer({ storage });

app.post("/transcribe", uploader.single("audio"), async (req, res, next) => {
  try {
    const paragraph = await requestTranscription();
    res.status(200).json({ message: "successfull", transcription: paragraph });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server side error" });
  }
});

app.listen(5000, () => {
  console.log("listening at port 5000");
});
