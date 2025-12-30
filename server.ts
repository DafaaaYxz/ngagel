
/**
 * BACKEND SERVER (Node.js/Express/MongoDB)
 * Setup:
 * 1. npm install express mongodb cors dotenv
 * 2. node server.js
 */
import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
const port = 5000;

const uri = "mongodb+srv://braynofficial66_db_user:Oh2ivMc2GGP0SbJF@cluster0.zi2ra3a.mongodb.net/website_db?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

// Use type casting to bypass overload resolution issues where app.use expects a path string
app.use(cors() as any);
app.use(express.json() as any);

async function run() {
  try {
    await client.connect();
    const db = client.db("website_db");
    const projectsCol = db.collection("projects");
    const adminsCol = db.collection("admins");

    console.log("------------------------------------------");
    console.log("MATRIX CORE ONLINE: MongoDB Cluster Connected");
    console.log(`Server endpoint: http://localhost:${port}`);
    console.log("------------------------------------------");

    // PROJECTS API
    // Using 'any' for request and response parameters to resolve errors where standard Express methods were not found
    app.get('/api/projects', async (req: any, res: any) => {
      try {
        const projects = await projectsCol.find({}).sort({ createdAt: -1 }).toArray();
        res.json(projects);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch projects" });
      }
    });

    app.post('/api/projects', async (req: any, res: any) => {
      try {
        const project = req.body;
        const result = await projectsCol.insertOne(project);
        res.status(201).json({ ...project, _id: result.insertedId });
      } catch (err) {
        res.status(500).json({ error: "Failed to deploy project" });
      }
    });

    app.delete('/api/projects/:id', async (req: any, res: any) => {
      try {
        await projectsCol.deleteOne({ id: req.params.id });
        res.status(200).send("De-materialized");
      } catch (err) {
        res.status(500).send("Error");
      }
    });

    app.post('/api/projects/:id/like', async (req: any, res: any) => {
      try {
        await projectsCol.updateOne({ id: req.params.id }, { $inc: { likes: 1 } });
        res.sendStatus(200);
      } catch (err) {
        res.sendStatus(500);
      }
    });

    // ADMINS API
    app.put('/api/admins/:id', async (req: any, res: any) => {
      try {
        const { _id, ...updates } = req.body;
        await adminsCol.updateOne({ id: req.params.id }, { $set: updates });
        res.sendStatus(200);
      } catch (err) {
        res.status(500).send("Failed to update identity");
      }
    });

    app.listen(port, () => {
      console.log(`Back-end hub listening on port ${port}`);
    });
  } catch (err) {
    console.error("CRITICAL ERROR: Failed to establish MongoDB uplink", err);
  }
}

run().catch(console.dir);
