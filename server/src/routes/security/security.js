const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');

// Import the models
const Log = require('../../models/logs');
const IncidentResponse = require('../../models/incident-reponse');

// Middleware to authenticate requests
const passport = require('passport');
const authMiddleware = passport.authenticate('jwt', { session: false });

// Security routes
router.post('/scan', (req, res) => {
  const { url } = req.body;
  
  // Use the 'sslyze' command-line tool to scan the provided URL for SSL/TLS vulnerabilities
  const sslyze = spawn('sslyze', ['-regular', url]);

  let scanResult = '';
  let error = '';

  // Capture the output of the 'sslyze' command-line tool
  sslyze.stdout.on('data', (data) => {
    scanResult += data.toString();
  });

  // Capture any errors from the 'sslyze' command-line tool
  sslyze.stderr.on('data', (data) => {
    error += data.toString();
  });

  // Handle the 'close' event of the 'sslyze' command-line tool
  sslyze.on('close', (code) => {
    if (code !== 0) {
      // If the 'sslyze' command-line tool returns a non-zero exit code, there was an error
      res.status(500).json({ error: `SSL scan failed: ${error}` });
    } else {
      // Otherwise, return the scan results
      res.json({ scanResult });
    }
  });
});

router.get('/report', (req, res) => {
    // Retrieve scan reports from MongoDB and send response to client
});

// Firewall Management Route
router.post('/firewall', authMiddleware, (req, res) => {
  // Assuming we have a firewall management library imported
  // We can perform firewall management actions here
  // Example:
  const { action, ip } = req.body;
  try {
    firewallManagement.setAction(action, ip);
    res.status(200).json({ message: 'Firewall management action successful' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Threat Intelligence Route
router.get('/threat-intelligence/:ipAddress', (req, res) => {
  const { ipAddress } = req.params;
  const threatIntelUrl = `https://api.abuseipdb.com/api/v2/check?ipAddress=${ipAddress}&maxAgeInDays=90`;
  const options = {
    url: threatIntelUrl,
    headers: {
      'Key': process.env.THREAT_INTEL_API_KEY, // API Key for accessing the threat intelligence API
      'Accept': 'application/json'
    }
  };

  request.get(options, (error, response, body) => {
    if (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({ error: 'Error fetching threat intelligence information' });
    }
    const threatIntelInfo = JSON.parse(body);
    return res.json(threatIntelInfo);
  });
});

// POST request to create a log entry
router.post('/logs', (req, res) => {
  const { message, level, source } = req.body;

  const log = new Log({
    message,
    level,
    source
  });

  log.save((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error saving log entry');
    }
    return res.status(200).send('Log entry saved successfully');
  });
});

// GET request to retrieve logs based on filters
router.get('/logs', (req, res) => {
  const { fromDate, toDate, level, source } = req.query;

  const filters = {};
  if (fromDate && toDate) {
    filters.timestamp = {
      $gte: new Date(fromDate),
      $lte: new Date(toDate)
    };
  }
  if (level) {
    filters.level = level;
  }
  if (source) {
    filters.source = source;
  }

  Log.find(filters, (err, logs) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving logs');
    }
    return res.status(200).send(logs);
  });
});

// Route to create a new incident response entry
router.post('/incident-response', async (req, res) => {
  try {
    const incident = new IncidentResponse(req.body);
    await incident.save();
    res.status(201).send(incident);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Route to get all incident response entries
router.get('/incident-response', async (req, res) => {
  try {
    const incidents = await IncidentResponse.find({});
    res.status(200).send(incidents);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route to get a specific incident response entry by ID
router.get('/incident-response/:id', async (req, res) => {
  try {
    const incident = await IncidentResponse.findById(req.params.id);
    if (!incident) {
      return res.status(404).send();
    }
    res.status(200).send(incident);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route to update an incident response entry
router.patch('/incident-response/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'stepsTaken', 'status'];
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({ error: 'Invalid update(s)!' });
  }

  try {
    const incident = await IncidentResponse.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!incident) {
      return res.status(404).send();
    }
    res.status(200).send(incident);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Route to delete an incident response entry
router.delete('/incident-response/:id', async (req, res) => {
  try {
    const incident = await IncidentResponse.findByIdAndDelete(req.params.id);
    if (!incident) {
      return res.status(404).send();
    }
    res.status(200).send(incident);
  } catch (error) {
    res.status(500).send(error);
  }
});


module.exports = router;