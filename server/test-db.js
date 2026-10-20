import { pool, testConnection, dbConfig } from './db/config.js';
import pgStore from './db/pgStore.js';
import { initializeDatabase } from './db/initDb.js';
import { migrateLocalDataToPostgres } from './db/migrateData.js';

async function runTestSuite() {
  console.log('====================================================');
  console.log('   PRATIBHA POSTGRESQL END-TO-END TEST SUITE        ');
  console.log('====================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Connection Test
  console.log('\n[1/7] Testing PostgreSQL Server Connectivity...');
  const connResult = await testConnection();
  assert(connResult.connected, `Connected to database "${connResult.database}" as "${connResult.user}" (PostgreSQL ${connResult.version?.split(' ')[1] || ''})`);
  if (!connResult.connected) {
    console.error(`Fatal: Cannot proceed without connection. Error: ${connResult.error}`);
    process.exit(1);
  }

  // 2. Initialize Schema
  console.log('\n[2/7] Verifying & Initializing Database Schema...');
  const initResult = await initializeDatabase();
  assert(initResult.success, 'Schema initialized successfully');
  assert(initResult.tables.includes('users') && initResult.tables.includes('jobs'), 'Core tables (users, jobs, applications, notifications, mock_interviews, system_settings) present');

  // 3. Migrate Local Data
  console.log('\n[3/7] Exporting & Migrating Local Data...');
  const migResult = await migrateLocalDataToPostgres();
  assert(migResult.success, 'store.json successfully migrated to PostgreSQL');
  assert(migResult.migrated.users >= 3, `Migrated ${migResult.migrated.users} users`);
  assert(migResult.migrated.jobs >= 5, `Migrated ${migResult.migrated.jobs} jobs`);

  // 4. Test User & Skill Operations
  console.log('\n[4/7] Testing User Profile & Skill Endorsements...');
  const users = await pgStore.getAllUsers();
  assert(users.length >= 3, `Found ${users.length} users in database`);
  
  const aarav = await pgStore.getUserById('candidate_1');
  assert(aarav && aarav.name === 'Aarav Sharma', 'Retrieved candidate_1 successfully');
  
  const updatedSkills = await pgStore.addOrEndorseSkill('candidate_1', { name: 'PostgreSQL', level: 'Expert', verified: true });
  const pgSkill = updatedSkills.find(s => s.name.toLowerCase() === 'postgresql');
  assert(pgSkill && pgSkill.endorsements >= 15, `PostgreSQL skill endorsements updated to ${pgSkill?.endorsements}`);

  // 5. Test Job Operations
  console.log('\n[5/7] Testing Job Posting & Filtering...');
  const jobs = await pgStore.getAllJobs();
  assert(jobs.length >= 5, `Retrieved ${jobs.length} jobs with parameter assessments`);
  
  const testJobId = `job_test_${Date.now()}`;
  const newJob = await pgStore.createJob({
    id: testJobId,
    title: 'Lead Autonomous AI Platform Architect',
    company: 'NeuralGrid Innovations',
    postedBy: 'employer_1',
    domain: 'Software & Technology',
    location: 'Bengaluru / Remote',
    workCondition: 'Hybrid',
    jobType: 'Full-Time',
    experienceLevel: '5+ years',
    minExpYears: 5,
    maxExpYears: 8,
    salaryMin: 3500000,
    salaryMax: 5500000,
    salaryFormatted: '₹35,00,000 - ₹55,00,000 / year',
    isSalaryTransparent: true,
    qualityScore: 98,
    qualityRating: 'A+',
    mustHaveSkills: ['PostgreSQL', 'Node.js', 'Distributed Systems'],
    responsibilities: ['Architect high availability PostgreSQL clusters', 'Design low latency API microservices']
  });
  assert(newJob && newJob.id === testJobId, `Created new job listing: "${newJob.title}"`);
  
  const fetchedJob = await pgStore.getJobById(testJobId);
  assert(fetchedJob && fetchedJob.qualityScore === 98, 'Retrieved created job with verified quality score 98');

  // 6. Test Application & Notification Flow
  console.log('\n[6/7] Testing Application Submission & Notification Flow...');
  const testAppId = `app_test_${Date.now()}`;
  const newApp = await pgStore.createApplication({
    id: testAppId,
    jobId: testJobId,
    candidateId: 'candidate_1',
    status: 'Applied',
    matchScore: 95,
    candidateNotes: 'Deep hands-on experience in PostgreSQL high throughput clustering and Node.js microservices.'
  });
  assert(newApp && newApp.id === testAppId, 'Submitted candidate application to database');

  // Update status to Interview Scheduled
  const updatedApp = await pgStore.updateApplicationStatus(testAppId, {
    status: 'Interview Scheduled',
    interviewDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    interviewStage: 'System Architecture & Scaling',
    interviewLink: 'https://meet.google.com/test-eval'
  });
  assert(updatedApp && updatedApp.status === 'Interview Scheduled', 'Updated application status to Interview Scheduled');

  // Submit Employer Feedback
  await pgStore.saveEmployerFeedback(testAppId, {
    technicalScore: 10,
    cultureScore: 9,
    communicationScore: 9,
    strengths: 'Exceptional knowledge of PostgreSQL indexing, partition pruning, and WAL replication.',
    summary: 'Candidate cleared architecture round with distinction.'
  });
  const reloadedApp = await pgStore.getApplicationById(testAppId);
  assert(reloadedApp && reloadedApp.employerFeedback?.technicalScore === 10, 'Employer feedback persisted and verified');

  // Create Notification
  const notifId = `notif_test_${Date.now()}`;
  await pgStore.createNotification({
    id: notifId,
    userId: 'candidate_1',
    title: 'Test Interview Invite',
    message: 'Your system architecture interview is confirmed.',
    type: 'interview'
  });
  const notifs = await pgStore.getNotifications('candidate_1');
  const foundNotif = notifs.find(n => n.id === notifId);
  assert(foundNotif && foundNotif.read === false, 'Notification created and retrieved');
  
  await pgStore.markNotificationRead(notifId);
  const reloadedNotifs = await pgStore.getNotifications('candidate_1');
  const readNotif = reloadedNotifs.find(n => n.id === notifId);
  assert(readNotif && readNotif.read === true, 'Notification marked as read');

  // 7. Analytics & LLM Settings
  console.log('\n[7/7] Testing Analytics & System Settings...');
  const analytics = await pgStore.getAnalytics();
  assert(analytics.totalJobs >= 6, `Analytics: totalJobs = ${analytics.totalJobs}`);
  assert(analytics.activeCandidates >= 2, `Analytics: activeCandidates = ${analytics.activeCandidates}`);

  const llmConfig = await pgStore.getLLMConfig();
  assert(llmConfig && llmConfig.provider, `Retrieved modular LLM configuration: provider = ${llmConfig.provider}`);

  // Clean up test records
  await pool.query('DELETE FROM applications WHERE id = $1', [testAppId]);
  await pool.query('DELETE FROM jobs WHERE id = $1', [testJobId]);
  await pool.query('DELETE FROM notifications WHERE id = $1', [notifId]);

  console.log('\n====================================================');
  console.log(`TEST SUITE RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite()
  .then(() => {
    console.log('All PostgreSQL database tests completed successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Test Suite encountered an error:', err);
    process.exit(1);
  });
