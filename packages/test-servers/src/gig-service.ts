import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { initializeDbIfNeeded, postgresDb } from './postgres';
import { sendEmail } from './email-service';

export const gigsService = express();
gigsService.use(express.json());

gigsService.get('/gigs:gigId', async (req, res) => {
  await initializeDbIfNeeded();

  const gigId = req.params.gigId;
  console.log(`Getting gig ${gigId}`);

  try {
    const gigRes = await postgresDb.query(
      `SELECT * FROM gigs WHERE id = '${gigId}'`,
    );
    if (!gigRes?.length) {
      throw new Error(`Gig ${gigId} not found`);
    }

    res.status(200);
    res.send(gigRes[0]);
  } catch (err) {
    console.error('Error getting gig', err);
    res.status(500);
    res.send({ error: 'Error getting gig', message: err.message });
  }
});

gigsService.delete('/gigs/:gigId', async (req, res) => {
  await initializeDbIfNeeded();

  const gigId = req.params.gigId;
  console.log(`Deleting gig ${gigId}`);

  try {
    const gigRes = await postgresDb.query(
      `SELECT * FROM gigs WHERE id = '${gigId}'`,
    );
    if (!gigRes?.length) {
      throw new Error(`Gig ${gigId} not found`);
    }

    await postgresDb.query(`DELETE FROM gigs WHERE id = '${gigId}'`);

    res.status(200);
    res.send({ message: `Gig ${gigId} deleted` });
  } catch (err) {
    console.error('Error deleting gig', err);
    res.status(500);
    res.send({ error: 'Error deleting gig', message: err.message });
  }
});

// required body params:
// - user_id
// - title
gigsService.post('/gigs/create', async (req, res) => {
  await initializeDbIfNeeded();

  const gigId = uuidv4();
  console.log(
    `Creating gig ${gigId} with title ${req.body.title} for user ${req.body.user_id}`,
  );

  try {
    // check user exists
    const userRes = await postgresDb.query(
      `SELECT * FROM users WHERE id = '${req.body.user_id}'`,
    );
    if (!userRes?.length) {
      throw new Error(`User ${req.body.user_id} not found`);
    }
    const userId = userRes[0].id;

    // check gig doesn't already exist with the same title
    const existingGigs = await postgresDb.query(
      `SELECT * FROM gigs WHERE user_id = '${userId}' AND title = '${req.body.title}'`,
    );
    if (existingGigs?.length) {
      throw new Error(
        `A gig with the title "${req.body.title}" already exists for user ${req.body.user_id}`,
      );
    }

    // create gig
    await postgresDb.query(
      `INSERT INTO gigs (id, title, user_id) VALUES ('${gigId}', '${req.body.title}', '${userId}')`,
    );

    // send email
    sendEmail({
      message: 'Gig created!',
      title: req.body.title,
      user: req.body.user_id,
      id: gigId,
    });

    res.status(201);
    res.send({ gigId });
  } catch (err) {
    console.error('Error creating gig', err);

    res.status(500);
    res.send({ error: 'Error creating gig', message: err.message });
  }
});
