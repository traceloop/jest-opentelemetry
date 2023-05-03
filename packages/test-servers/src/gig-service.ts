import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { initializeDbIfNeeded, postgresDb } from './postgres';
import { sendEmail } from './email-service';

export const gigsService = express();
gigsService.use(express.json());

// required body params:
// - user_name
// - title
gigsService.post('/gigs/create', async (req, res) => {
  await initializeDbIfNeeded();

  const gigId = uuidv4();
  console.log(
    `Creating gig ${gigId} with title ${req.body.title} for user ${req.body.user_name}`,
  );

  try {
    // check user exists
    const userRes = await postgresDb.query(
      `SELECT * FROM users WHERE name = '${req.body.user_name}'`,
    );
    if (!userRes?.length) {
      throw new Error(`User ${req.body.user_name} not found`);
    }
    const userId = userRes[0].id;

    // check gig doesn't already exist with the same title
    const existingGigs = await postgresDb.query(
      `SELECT * FROM gigs WHERE user_id = '${userId}' AND title = '${req.body.title}'`,
    );
    if (existingGigs?.length) {
      throw new Error(
        `A gig with the title "${req.body.title}" already exists for user ${req.body.user_name}`,
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
      user: req.body.user_name,
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
