import { Router } from 'express';
import healthCheck from './health-check.js';
import integratedAiRouter from './integrated-ai.js';
import ragRouter from './rag.js';
import analyticsRouter from './analytics.js';
import webhooksRouter from './webhooks.js';
import leadsRouter from './leads.js';
import emailRouter from './email.js';
import sendEmailRouter from './send-email.js';
import chatRouter from './chat.js';
import testEmailRouter from './test-email.js';
import emailMetricsRouter from './email-metrics.js';
import requestFormRouter from './request-form.js';

const router = Router();

export default () => {
    router.get('/health', healthCheck);
    router.use('/integrated-ai', integratedAiRouter);
    router.use('/rag', ragRouter);
    router.use('/analytics', analyticsRouter);
    router.use('/webhooks', webhooksRouter);
    router.use('/leads', leadsRouter);
    router.use('/email', emailRouter);
    router.use('/send-email', sendEmailRouter);
    router.use('/chat', chatRouter);
    router.use('/test-email', testEmailRouter);
    router.use('/email-metrics', emailMetricsRouter);
    router.use('/send-request-form', requestFormRouter);

    return router;
};