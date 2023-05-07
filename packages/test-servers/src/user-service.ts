import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { initializeDbIfNeeded, postgresDb } from './postgres';
import { sendEmail } from './email-service';
import { sendBiEvent } from './bi-grpc-service';

export const usersService = express();
usersService.use(express.json());

usersService.get('/users/:userId', async (req, res) => {
  await initializeDbIfNeeded();

  const userId = req.params.userId;
  console.log(`Getting user ${userId}`);

  try {
    const userRes = await postgresDb.query(
      `SELECT * FROM users WHERE id = '${userId}'`,
    );
    if (!userRes?.length) {
      throw new Error(`User ${userId} not found`);
    }

    res.status(200);
    res.send(userRes[0]);
  } catch (err) {
    console.error('Error getting user', err);
    res.status(500);
    res.send({ error: 'Error getting user', message: err.message });
  }
});

usersService.delete('/users/:userId', async (req, res) => {
  await initializeDbIfNeeded();

  const userId = req.params.userId;
  console.log(`Deleting user ${userId}`);

  try {
    const userRes = await postgresDb.query(
      `SELECT * FROM users WHERE id = '${userId}'`,
    );
    if (!userRes?.length) {
      throw new Error(`User ${userId} not found`);
    }

    await postgresDb.query(`DELETE FROM users WHERE id = '${userId}'`);

    res.status(200);
    res.send({ message: `User ${userId} deleted` });
  } catch (err) {
    console.error('Error deleting user', err);
    res.status(500);
    res.send({ error: 'Error deleting user', message: err.message });
  }
});

// required body params:
// - name
usersService.post('/users/create', async (req, res) => {
  await initializeDbIfNeeded();

  const userId = uuidv4();
  console.log(`Creating user ${userId} with name ${req.body.name}`);

  try {
    // check if user exists
    const userRes = await postgresDb.query(
      `SELECT * FROM users WHERE name = '${req.body.name}'`,
    );
    if (userRes?.length) {
      throw new Error(`User ${req.body.name} already exists.`);
    }

    // create user
    await postgresDb.query(
      `INSERT INTO users (id, name) VALUES ('${userId}', '${req.body.name}')`,
    );

    sendEmail({
      message: 'User created!',
      name: req.body.name,
      id: userId,
    });

    sendBiEvent('user_created', userId);

    res.status(201);
    res.send({ userId });
  } catch (err) {
    console.error('Error creating user', err);

    res.status(500);
    res.send({ error: 'Error creating user', message: err.message });
  }
});
