const fs = require("fs");
const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const os = require("os");
const hostname = os.hostname();

const Goal = require("./models/goal");

const app = express();

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "logs", "access.log"),
    { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.get("/goals", async (req, res) => {
    console.log("Hello ssss " + hostname);
    try {
        const goals = await Goal.find();
        res.status(200).json({
            hostname: hostname,
            goals: goals.map((goal) => ({
                id: goal.id,
                text: goal.text,
                version: "version???!!!",
            })),
        });
        console.log("FETCHED GOALS");
    } catch (err) {
        console.error("ERROR FETCHING GOALS");
        console.error(err.message);
        res.status(500).json({
            hostname: hostname,
            message: "Failed to load goals.",
        });
    }
});

app.post("/goals", async (req, res) => {
    console.log("TRYING TO STORE GOAL");
    const goalText = req.body.text;

    if (!goalText || goalText.trim().length === 0) {
        console.log("INVALID INPUT - NO TEXT");
        return res
            .status(422)
            .json({ hostname: hostname, message: "Invalid goal text." });
    }

    const goal = new Goal({
        text: goalText,
    });

    try {
        await goal.save();
        res.status(201).json({
            hostname: hostname,
            message: "Goal saved",
            goal: { id: goal.id, text: goalText },
        });
        console.log("STORED NEW GOAL");
    } catch (err) {
        console.error("ERROR FETCHING GOALS");
        console.error(err.message);
        res.status(500).json({
            hostname: hostname,
            message: "Failed to save goal.",
        });
    }
});

app.delete("/goals/:id", async (req, res) => {
    console.log("TRYING TO DELETE GOAL");
    try {
        await Goal.deleteOne({ _id: req.params.id });
        res.status(200).json({ hostname: hostname, message: "Deleted goal!" });
        console.log("DELETED GOAL");
    } catch (err) {
        console.error("ERROR FETCHING GOALS");
        console.error(err.message);
        res.status(500).json({
            hostname: hostname,
            message: "Failed to delete goal.",
        });
    }
});

mongoose.connect(
    // `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@mongodb:27017/course-goals?authSource=admin`,
    process.env.MONGO_CONNECTION_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {
        if (err) {
            console.error("FAILED TO CONNECT TO MONGODBB!!!");
            console.error(err);
        } else {
            console.log(
                "CONNECTED TO MONGODB!!!",
                process.env.MONGO_CONNECTION_STRING
            );
            console.log("Running on !!!", process.env.LISTENING_PORT);
            app.listen(process.env.LISTENING_PORT);
        }
    }
);
