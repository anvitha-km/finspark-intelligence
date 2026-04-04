import express from 'express';
import cors from 'cors';
import { initDB } from './db.js';
import eventsRouter     from './routes/events.js';
import analyticsRouter  from './routes/analytics.js';
import governanceRouter from './routes/governance.js';
import syncRouter       from './routes/sync.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use('/api/events',     eventsRouter);
app.use('/api/analytics',  analyticsRouter);
app.use('/api/governance', governanceRouter);
app.use('/api/sync',       syncRouter);

app.get('/health', (_, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

const PORT = 4000;
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 FinSpark Intelligence Server running on http://localhost:${PORT}`);
    console.log(`   Health:       http://localhost:${PORT}/health`);
    console.log(`   Heatmap:      http://localhost:${PORT}/api/analytics/heatmap`);
    console.log(`   Funnel:       http://localhost:${PORT}/api/analytics/funnel/loan-origination`);
    console.log(`   Licenses:     http://localhost:${PORT}/api/analytics/license-usage`);
    console.log(`   Sync ingest:  http://localhost:${PORT}/api/sync/aggregate`);
  });
});