import test from 'node:test';
import assert from 'node:assert/strict';
import { pool, testConnection, query } from '../../server/db/config.js';
import pgStore from '../../server/db/pgStore.js';
import { initializeDatabase } from '../../server/db/initDb.js';

test('PostgreSQL Database Operations & Schema Integrity E2E Test Suite', async (t) => {
  // Ensure connection & schema
  await t.test('1. Database Connection & Schema Health', async () => {
    const conn = await testConnection();
    assert.equal(conn.connected, true, 'Database should be connected');
    assert.equal(conn.database, 'pratibha', 'Connected database should be pratibha');
    assert.equal(conn.user, 'pratibha_user', 'Connected user should be pratibha_user');

    const init = await initializeDatabase();
    assert.equal(init.success, true);
    const requiredTables = ['users', 'jobs', 'applications', 'notifications', 'mock_interviews', 'system_settings'];
    requiredTables.forEach(table => {
      assert.ok(init.tables.includes(table), `Expected table "${table}" to exist`);
    });
  });

  await t.test('2. Users & Skills CRUD Operations', async () => {
    const testUserId = `test_cand_${Date.now()}`;
    
    // Create new test user directly via SQL
    await query(`
      INSERT INTO users (id, role, name, email, headline, location, preferred_remote, years_of_experience, "current_role", bio, skills)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [
      testUserId,
      'candidate',
      'Test Candidate Alpha',
      `cand_${Date.now()}@test.io`,
      'Staff Cloud Systems Engineer',
      'Bengaluru, India',
      'Remote',
      6,
      'Senior Cloud Architect',
      'Testing PostgreSQL user persistence',
      JSON.stringify([{ name: 'PostgreSQL', level: 'Expert', verified: true, endorsements: 10 }])
    ]);

    // Retrieve user via pgStore
    const user = await pgStore.getUserById(testUserId);
    assert.ok(user, 'User should be retrieved');
    assert.equal(user.name, 'Test Candidate Alpha');
    assert.equal(user.preferredRemote, 'Remote');
    assert.equal(user.yearsOfExperience, 6);
    assert.equal(user.skills.length, 1);

    // Endorse existing skill
    const updatedSkills1 = await pgStore.addOrEndorseSkill(testUserId, { name: 'PostgreSQL' });
    const pgSkill = updatedSkills1.find(s => s.name === 'PostgreSQL');
    assert.equal(pgSkill.endorsements, 11, 'Endorsements should increment from 10 to 11');

    // Add brand new skill
    const updatedSkills2 = await pgStore.addOrEndorseSkill(testUserId, { name: 'Redis', level: 'Intermediate', verified: false });
    assert.equal(updatedSkills2.length, 2, 'Should now have 2 skills');
    const redisSkill = updatedSkills2.find(s => s.name === 'Redis');
    assert.equal(redisSkill.endorsements, 1, 'New skill should start with 1 endorsement');

    // Update user profile fields
    const updatedProfile = await pgStore.updateUser(testUserId, {
      headline: 'Principal Distributed Systems Architect',
      targetSalary: '₹40,00,000 - ₹50,00,000 / year'
    });
    assert.equal(updatedProfile.headline, 'Principal Distributed Systems Architect');
    assert.equal(updatedProfile.targetSalary, '₹40,00,000 - ₹50,00,000 / year');

    // Clean up
    await query('DELETE FROM users WHERE id = $1', [testUserId]);
  });

  await t.test('3. Jobs Posting, Quality Breakdown & Querying', async () => {
    const testJobId = `test_job_${Date.now()}`;

    const createdJob = await pgStore.createJob({
      id: testJobId,
      title: 'Principal Distributed Cloud Architect',
      company: 'Test Scale Global',
      postedBy: 'employer_1',
      domain: 'Software & Technology',
      location: 'Bengaluru / Remote',
      workCondition: 'Hybrid',
      jobType: 'Full-Time',
      experienceLevel: '5-8 years',
      minExpYears: 5,
      maxExpYears: 8,
      salaryMin: 3200000,
      salaryMax: 4800000,
      salaryFormatted: '₹32,00,000 - ₹48,00,000 / year',
      isSalaryTransparent: true,
      qualityScore: 96,
      qualityRating: 'A+',
      qualityBreakdown: { responsibilitiesClarity: 20, compensationTransparency: 20 },
      mustHaveSkills: ['PostgreSQL', 'Node.js', 'System Design'],
      niceToHaveSkills: ['Docker', 'Kafka'],
      responsibilities: ['Design and scale PostgreSQL clustering for multi-tenant microservices.']
    });

    assert.ok(createdJob, 'Job should be created successfully');
    assert.equal(createdJob.id, testJobId);
    assert.equal(createdJob.qualityScore, 96);
    assert.equal(createdJob.salaryMin, 3200000);

    const fetchedJob = await pgStore.getJobById(testJobId);
    assert.equal(fetchedJob.title, 'Principal Distributed Cloud Architect');
    assert.ok(fetchedJob.mustHaveSkills.includes('PostgreSQL'));
    assert.equal(fetchedJob.qualityBreakdown.compensationTransparency, 20);

    // Clean up
    await query('DELETE FROM jobs WHERE id = $1', [testJobId]);
  });

  await t.test('4. Applications ATS Workflow & Constraints', async () => {
    const testJobId = `job_app_test_${Date.now()}`;
    const testCandId = `cand_app_test_${Date.now()}`;
    const testAppId = `app_test_${Date.now()}`;

    // Create prerequisite test job and candidate
    await query(`
      INSERT INTO jobs (id, title, company, domain, location, work_condition, job_type)
      VALUES ($1, 'Staff Backend Engineer', 'InnoTech Labs', 'Software & Technology', 'Remote', 'Remote', 'Full-Time')
    `, [testJobId]);

    await query(`
      INSERT INTO users (id, role, name, email)
      VALUES ($1, 'candidate', 'Priya Application Tester', $2)
    `, [testCandId, `tester_${Date.now()}@test.io`]);

    // 1. Create Application
    const newApp = await pgStore.createApplication({
      id: testAppId,
      jobId: testJobId,
      candidateId: testCandId,
      status: 'Applied',
      candidateNotes: 'Deep hands-on experience in PostgreSQL and Node.js microservices.',
      matchScore: 92
    });

    assert.ok(newApp, 'Application should be created');
    assert.equal(newApp.status, 'Applied');
    assert.equal(newApp.matchScore, 92);

    // 2. Test Unique Constraint: Candidate cannot apply twice to the same job
    await assert.rejects(
      async () => {
        await pgStore.createApplication({
          id: `app_dup_${Date.now()}`,
          jobId: testJobId,
          candidateId: testCandId,
          status: 'Applied'
        });
      },
      (err) => {
        assert.equal(err.code, '23505', 'Expected duplicate key violation (23505)');
        return true;
      }
    );

    // 3. Update status to Interview Scheduled
    const interviewTime = new Date(Date.now() + 86400000 * 2).toISOString();
    const updatedApp = await pgStore.updateApplicationStatus(testAppId, {
      status: 'Interview Scheduled',
      interviewDate: interviewTime,
      interviewStage: 'System Design Deep-Dive',
      interviewLink: 'https://meet.google.com/test-live'
    });

    assert.equal(updatedApp.status, 'Interview Scheduled');
    assert.equal(updatedApp.interviewStage, 'System Design Deep-Dive');
    assert.equal(updatedApp.interviewLink, 'https://meet.google.com/test-live');

    // 4. Save Employer Feedback
    const feedback = {
      technicalScore: 9,
      cultureScore: 9,
      communicationScore: 8,
      strengths: 'Excellent grasp of database indexing, connection pooling, and ACID guarantees.',
      areasOfImprovement: 'Can further explore streaming event queues like Kafka.',
      summary: 'Candidate demonstrated impressive depth during technical evaluation.'
    };

    const savedApp = await pgStore.saveEmployerFeedback(testAppId, feedback);
    assert.equal(savedApp.employerFeedback.technicalScore, 9);
    assert.equal(savedApp.employerFeedback.strengths, feedback.strengths);

    const reloaded = await pgStore.getApplicationById(testAppId);
    assert.equal(reloaded.employerFeedback.technicalScore, 9);

    // Clean up
    await query('DELETE FROM applications WHERE id = $1', [testAppId]);
    await query('DELETE FROM jobs WHERE id = $1', [testJobId]);
    await query('DELETE FROM users WHERE id = $1', [testCandId]);
  });

  await t.test('5. Notifications Creation & Read Status Flow', async () => {
    const testNotifId = `notif_test_${Date.now()}`;
    const testUserId = 'candidate_1';

    const notif = await pgStore.createNotification({
      id: testNotifId,
      userId: testUserId,
      title: 'Interview Scheduled for Technical Deep Dive',
      message: 'CloudScale Technologies confirmed your interview.',
      type: 'interview',
      actionUrl: '/applications'
    });

    assert.ok(notif, 'Notification created');
    assert.equal(notif.read, false, 'Notification should be unread initially');

    const notifs = await pgStore.getNotifications(testUserId);
    const found = notifs.find(n => n.id === testNotifId);
    assert.ok(found, 'Notification should be listed in user notifications');

    const readNotif = await pgStore.markNotificationRead(testNotifId);
    assert.equal(readNotif.read, true, 'Notification should now be marked as read');

    // Clean up
    await query('DELETE FROM notifications WHERE id = $1', [testNotifId]);
  });

  await t.test('6. Mock Interview Persistence & Transcript History', async () => {
    const testMockId = `mock_e2e_${Date.now()}`;

    const session = await pgStore.saveMockInterview({
      id: testMockId,
      candidateId: 'candidate_1',
      jobId: 'job_1',
      jobTitle: 'Senior Full-Stack Cloud Architect',
      overallScore: 91,
      status: 'Completed',
      questions: [
        {
          id: 'q1',
          question: 'How do you safeguard distributed transactions across microservices?',
          userAnswer: 'I implement Saga orchestration patterns with compensating transactions and outbox pattern with Debezium.',
          score: 94,
          strengths: 'Accurately articulated Saga orchestration and Transactional Outbox pattern.'
        }
      ]
    });

    assert.ok(session, 'Mock interview session saved');
    assert.equal(session.overallScore, 91);
    assert.equal(session.questions.length, 1);

    const history = await pgStore.getMockInterviewHistory('candidate_1');
    const found = history.find(m => m.id === testMockId);
    assert.ok(found, 'Found mock interview session in history');
    assert.equal(found.questions[0].score, 94);

    // Clean up
    await query('DELETE FROM mock_interviews WHERE id = $1', [testMockId]);
  });

  await t.test('7. System Settings & Modular LLM Configuration', async () => {
    const initialConfig = await pgStore.getLLMConfig();
    assert.ok(initialConfig, 'LLM config should be retrieved');

    const customConfig = {
      provider: 'ollama',
      endpointUrl: 'http://127.0.0.1:11434',
      modelName: 'llama3:8b',
      enabled: true,
      parameters: JSON.stringify({ temperature: 0.4, max_tokens: 300 })
    };

    const saved = await pgStore.updateLLMConfig(customConfig);
    assert.equal(saved.provider, 'ollama');
    assert.equal(saved.modelName, 'llama3:8b');

    const reloaded = await pgStore.getLLMConfig();
    assert.equal(reloaded.provider, 'ollama');

    // Restore to initial or default
    await pgStore.updateLLMConfig(initialConfig);
  });

  await t.test('8. Platform Aggregation Analytics', async () => {
    const analytics = await pgStore.getAnalytics();
    assert.ok(analytics.totalJobs >= 5, `Expected >= 5 jobs, got ${analytics.totalJobs}`);
    assert.ok(analytics.activeCandidates >= 2, `Expected >= 2 candidates, got ${analytics.activeCandidates}`);
    assert.ok(analytics.totalApplications >= 2, `Expected >= 2 applications, got ${analytics.totalApplications}`);
    assert.ok(analytics.avgJdQualityScore >= 80, `Expected avg quality >= 80, got ${analytics.avgJdQualityScore}`);
    assert.ok(analytics.avgApplicantMatchRate.includes('%'));
  });

  await t.test('9. Transactional Rollback Safety', async () => {
    const client = await pool.connect();
    const dummyId = `rollback_test_${Date.now()}`;
    try {
      await client.query('BEGIN');
      await client.query(`
        INSERT INTO users (id, role, name, email)
        VALUES ($1, 'candidate', 'Rollback User', 'rollback@test.io')
      `, [dummyId]);

      // Intentionally cause failure: insert invalid role
      await assert.rejects(async () => {
        await client.query(`
          INSERT INTO users (id, role, name, email)
          VALUES ('dummy_invalid', 'invalid_role_value', 'Invalid User', 'invalid@test.io')
        `);
      });

      await client.query('ROLLBACK');
    } finally {
      client.release();
    }

    // Verify dummyId was NOT committed
    const check = await query('SELECT 1 FROM users WHERE id = $1', [dummyId]);
    assert.equal(check.rowCount, 0, 'Transaction rollback should ensure uncommitted rows do not persist');
  });

  await t.test('99. Teardown Database Pool', async () => {
    await pool.end();
  });
});
