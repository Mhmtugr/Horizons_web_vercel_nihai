import { Router } from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = Router();

// POST /leads - Create a new lead
router.post('/', async (req, res) => {
  const { name, email, phone, company, service, message, created_at, status } = req.body;

  // Validate required fields
  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }

  logger.info(`Creating new lead: ${name} (${email})`);

  const leadData = {
    name,
    email,
    phone: phone || '',
    company: company || '',
    service: service || '',
    message: message || '',
    created_at: created_at || new Date().toISOString(),
    status: status || 'new',
  };

  const record = await pb.collection('leads').create(leadData);

  logger.info(`Lead created successfully with ID: ${record.id}`);

  res.status(201).json({ id: record.id, success: true });
});

// GET /leads - Fetch all leads
router.get('/', async (req, res) => {
  logger.info('Fetching all leads');

  const leads = await pb.collection('leads').getFullList({
    sort: '-created',
  });

  res.json(leads);
});

// GET /leads/:leadId - Fetch single lead by ID
router.get('/:leadId', async (req, res) => {
  const { leadId } = req.params;

  logger.info(`Fetching lead with ID: ${leadId}`);

  const lead = await pb.collection('leads').getOne(leadId);

  res.json(lead);
});

// PUT /leads/:leadId - Update lead
router.put('/:leadId', async (req, res) => {
  const { leadId } = req.params;
  const { name, email, phone, company, service, message, status } = req.body;

  logger.info(`Updating lead with ID: ${leadId}`);

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (phone !== undefined) updateData.phone = phone;
  if (company !== undefined) updateData.company = company;
  if (service !== undefined) updateData.service = service;
  if (message !== undefined) updateData.message = message;
  if (status !== undefined) updateData.status = status;

  const record = await pb.collection('leads').update(leadId, updateData);

  logger.info(`Lead updated successfully with ID: ${leadId}`);

  res.json(record);
});

export default router;