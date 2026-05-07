import { Router } from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = Router();

// GET /rag/services - Fetch all services
router.get('/services', async (req, res) => {
  logger.info('Fetching all services from serviceInquiries collection');
  
  const services = await pb.collection('serviceInquiries').getFullList();
  
  const formattedServices = services.map(service => ({
    serviceId: service.id,
    serviceName: service.serviceName,
    description: service.description,
    benefits: service.benefits,
    pricing: service.pricing,
    implementationTime: service.implementationTime,
  }));
  
  res.json(formattedServices);
});

// GET /rag/service/:serviceId - Fetch single service by ID
router.get('/service/:serviceId', async (req, res) => {
  const { serviceId } = req.params;
  
  logger.info(`Fetching service with ID: ${serviceId}`);
  
  const service = await pb.collection('serviceInquiries').getFirstListItem(`serviceId="${serviceId}"`);
  
  res.json(service);
});

// GET /rag/faqs - Fetch all FAQs from all services
router.get('/faqs', async (req, res) => {
  logger.info('Fetching all FAQs from serviceInquiries collection');
  
  const services = await pb.collection('serviceInquiries').getFullList();
  
  const allFaqs = services.flatMap(service => 
    (service.faqs && Array.isArray(service.faqs)) ? service.faqs : []
  );
  
  res.json(allFaqs);
});

// GET /rag/pricing - Fetch all services with pricing information
router.get('/pricing', async (req, res) => {
  logger.info('Fetching pricing information from serviceInquiries collection');
  
  const services = await pb.collection('serviceInquiries').getFullList();
  
  const pricingData = services.map(service => ({
    serviceName: service.serviceName,
    pricing: service.pricing,
  }));
  
  res.json(pricingData);
});

export default router;