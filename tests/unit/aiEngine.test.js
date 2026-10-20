import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateJobDescription,
  calculateCandidateFit,
  generateJDInterviewQuestions,
  evaluateInterviewResponse,
  optimizeResumeBullet,
  generateCareerPathing,
  DEFAULT_LLM_CONFIG,
  getActiveLLMConfig
} from '../../server/services/aiEngine.js';

test('AI & Evaluation Engine Test Suite', async (t) => {

  await t.test('1. Parameterized Job Description Evaluation', async (t2) => {
    await t2.test('Evaluates complete high-quality job description with A+ rating', () => {
      const highQualityJob = {
        title: 'Principal Cloud Architect',
        responsibilities: [
          'Architect and scale multi-tenant microservices across distributed cloud environments.',
          'Lead and mentor senior engineering pods across high-throughput services.',
          'Design resilient database partitioning and caching layers with Redis and PostgreSQL.',
          'Optimize end-to-end latency and maintain 99.99% system availability SLAs.'
        ],
        salaryMin: 3000000,
        salaryMax: 4500000,
        mustHaveSkills: ['Node.js', 'PostgreSQL', 'AWS', 'System Design'],
        niceToHaveSkills: ['Docker', 'Kubernetes'],
        experienceLevel: '5+ years',
        minExpYears: 5,
        maxExpYears: 8,
        cultureMission: {
          mission: 'Empowering millions with resilient cloud infrastructure.',
          values: ['Excellence', 'Transparency', 'Customer Obsession']
        },
        deiStatement: 'We are committed to building an inclusive and diverse engineering organization.',
        interviewProcess: [
          { stage: 1, title: 'Screening', duration: '30 mins' },
          { stage: 2, title: 'System Architecture', duration: '60 mins' },
          { stage: 3, title: 'Culture Alignment', duration: '45 mins' }
        ]
      };

      const result = evaluateJobDescription(highQualityJob);
      assert.ok(result.score >= 90, `Expected score >= 90, got ${result.score}`);
      assert.ok(result.qualityRating.includes('A+'), `Expected quality rating A+, got ${result.qualityRating}`);
      assert.equal(result.breakdown.compensationTransparency, 20);
      assert.ok(result.breakdown.responsibilitiesClarity >= 18);
      assert.ok(result.breakdown.qualificationsDistinction >= 18);
      assert.ok(result.breakdown.cultureAndMission >= 12);
      assert.ok(result.breakdown.deiCommitment >= 8);
      assert.ok(result.breakdown.processTransparency >= 10);
    });

    await t2.test('Flags gaps in vague job descriptions (missing salary, no action verbs)', () => {
      const vagueJob = {
        title: 'Developer',
        responsibilities: ['Do coding tasks'],
        mustHaveSkills: ['Coding'],
        salaryMin: null,
        salaryMax: null
      };

      const result = evaluateJobDescription(vagueJob);
      assert.ok(result.score < 60, `Expected low score < 60, got ${result.score}`);
      assert.ok(result.feedbackTips.length > 0, 'Expected actionable feedback tips');
      assert.ok(
        result.feedbackTips.some(tip => tip.toLowerCase().includes('salary') || tip.toLowerCase().includes('compensation')),
        'Expected compensation feedback tip'
      );
      assert.ok(
        result.feedbackTips.some(tip => tip.toLowerCase().includes('verb') || tip.toLowerCase().includes('responsibility')),
        'Expected responsibilities feedback tip'
      );
    });
  });

  await t.test('2. Precision Candidate-to-Job Fit & Gap Analysis', async (t2) => {
    const sampleJob = {
      id: 'job_test',
      title: 'Senior Full Stack Engineer',
      domain: 'Software & Technology',
      minExpYears: 4,
      maxExpYears: 7,
      mustHaveSkills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
      niceToHaveSkills: ['AWS', 'Docker']
    };

    await t2.test('High match score for candidates possessing all must-have skills', () => {
      const strongCandidate = {
        id: 'cand_strong',
        yearsOfExperience: 5,
        currentRole: 'Software Engineer in Technology',
        skills: [
          { name: 'React', level: 'Expert' },
          { name: 'Node.js', level: 'Expert' },
          { name: 'PostgreSQL', level: 'Intermediate' },
          { name: 'TypeScript', level: 'Expert' },
          { name: 'AWS', level: 'Intermediate' }
        ]
      };

      const fit = calculateCandidateFit(sampleJob, strongCandidate);
      assert.ok(fit.matchScore >= 80, `Expected matchScore >= 80, got ${fit.matchScore}`);
      assert.ok(fit.statusLabel.includes('Fit') || fit.statusLabel.includes('Match'));
      assert.equal(fit.missingMustHaves.length, 0);
      assert.ok(fit.matchedSkills.includes('react'));
      assert.ok(fit.matchedSkills.includes('node.js'));
    });

    await t2.test('Identifies missing core competencies and experience delta', () => {
      const juniorCandidate = {
        id: 'cand_junior',
        yearsOfExperience: 1,
        currentRole: 'Junior Frontend Developer',
        skills: [
          { name: 'React', level: 'Beginner' }
        ]
      };

      const fit = calculateCandidateFit(sampleJob, juniorCandidate);
      assert.ok(fit.matchScore < 60, `Expected low matchScore for junior, got ${fit.matchScore}`);
      assert.ok(fit.missingMustHaves.includes('node.js'));
      assert.ok(fit.missingMustHaves.includes('postgresql'));
      assert.ok(fit.missingMustHaves.includes('typescript'));
      assert.ok(fit.candExperience.includes('1 yrs'));
    });
  });

  await t.test('3. Dynamic JD Interview Question Generator', () => {
    const job = {
      title: 'Full Stack Engineer',
      mustHaveSkills: ['React', 'Node.js', 'PostgreSQL'],
      responsibilities: ['Architect microservices and optimize PostgreSQL queries']
    };
    const candidate = {
      name: 'Aarav Sharma',
      skills: [{ name: 'React' }, { name: 'Node.js' }]
    };

    const questions = generateJDInterviewQuestions(job, candidate);
    assert.ok(Array.isArray(questions), 'Expected array of questions');
    assert.ok(questions.length >= 3, `Expected at least 3 questions, got ${questions.length}`);
    
    // Validate question schema
    questions.forEach((q, idx) => {
      assert.ok(q.id, `Question ${idx} missing id`);
      assert.ok(q.question, `Question ${idx} missing text`);
      assert.ok(q.category, `Question ${idx} missing category`);
      assert.ok(q.evalCriteria, `Question ${idx} missing evalCriteria`);
    });
  });

  await t.test('4. Dual Evaluator for Interview Responses', async () => {
    const questionObj = {
      id: 'q1',
      question: 'How do you optimize slow database queries in high-throughput PostgreSQL applications?',
      skillTag: 'PostgreSQL'
    };
    const job = { title: 'Backend Architect' };

    // Test brief/incomplete answer
    const briefResult = await evaluateInterviewResponse(questionObj, 'I use indexes.', job);
    assert.ok(briefResult.score <= 45, 'Expected low score for terse answer');
    assert.equal(briefResult.performanceTier, 'Incomplete');
    assert.ok(briefResult.candidateFeedback.actionableTip, 'Expected actionable tip');
    assert.ok(briefResult.panelFeedback.suggestedFollowUp, 'Expected interviewer follow-up prompt');

    // Test comprehensive STAR answer
    const comprehensiveAnswer = `In my previous role at NexaTech, I analyzed slow query execution plans using EXPLAIN ANALYZE on our critical payment service. 
    I identified sequential scans on a 25M row transaction ledger table caused by missing composite indexes on tenant_id and created_at. 
    I created a covering BRIN and B-Tree index, tuned work_mem, and introduced a Redis read-through cache for frequent queries. 
    This dropped our p99 query latency by 68% and eliminated PostgreSQL connection pool timeouts during flash sales.`;

    const strongResult = await evaluateInterviewResponse(questionObj, comprehensiveAnswer, job);
    assert.ok(strongResult.score >= 80, `Expected high score >= 80, got ${strongResult.score}`);
    assert.ok(['Strong Fit', 'Exemplary / Hire Recommendation'].includes(strongResult.performanceTier));
    assert.ok(strongResult.candidateFeedback.strengths, 'Expected strengths assessment');
  });

  await t.test('5. AI Resume Bullet Optimizer', async () => {
    const rawBullet = 'Worked on backend API and made it faster';
    const targetRole = 'Senior Backend Engineer';

    const optimized = await optimizeResumeBullet(rawBullet, targetRole);
    assert.ok(optimized, 'Expected non-null response');
    assert.ok(optimized.suggestedEnhancement, 'Expected suggestedEnhancement');
    assert.ok(optimized.atsScoreImpact, 'Expected atsScoreImpact');
    assert.ok(optimized.powerVerbsAdded.length > 0, 'Expected powerVerbsAdded list');
  });

  await t.test('6. Dynamic Career Pathing & Salary Benchmarks', () => {
    const candidateSkills = [
      { name: 'React', level: 'Expert' },
      { name: 'Node.js', level: 'Expert' },
      { name: 'PostgreSQL', level: 'Intermediate' }
    ];
    const currentRole = 'Senior Software Engineer';

    const pathing = generateCareerPathing(candidateSkills, currentRole);
    assert.ok(pathing.nextMilestoneRole, 'Expected next role milestone');
    assert.ok(pathing.marketSalaryRange, 'Expected marketSalaryRange band');
    assert.ok(Array.isArray(pathing.growthSteps), 'Expected career growthSteps');
    assert.ok(Array.isArray(pathing.skillGapsToBridge), 'Expected skillGapsToBridge list');
  });

  await t.test('7. LLM Modular Configuration Defaults', () => {
    const config = getActiveLLMConfig();
    assert.ok(config.provider, 'Expected default provider');
    assert.ok(config.endpointUrl, 'Expected default endpoint URL');
    assert.ok(config.modelName, 'Expected default model name');
  });
});
