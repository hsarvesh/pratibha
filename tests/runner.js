#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const suites = [
  {
    name: 'AI Algorithms & Parameterized Evaluation Engine',
    file: path.join(__dirname, 'unit', 'aiEngine.test.js'),
    description: 'JD scoring heuristics, STAR dual evaluation, candidate fit scoring, resume optimizer, career pathing'
  },
  {
    name: 'PostgreSQL Database & Schema Operations E2E',
    file: path.join(__dirname, 'e2e', 'database.test.js'),
    description: 'PostgreSQL connection, tables DDL, constraints, triggers, users/jobs/applications/interviews persistence'
  },
  {
    name: 'HTTP REST API Integration E2E',
    file: path.join(__dirname, 'e2e', 'api.test.js'),
    description: 'Express endpoints: jobs search/filter, ATS pipeline, profile editing, skill endorsements, analytics'
  }
];

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  dim: '\x1b[2m'
};

async function runSuite(suite, index, total) {
  return new Promise((resolve) => {
    console.log(`\n${colors.cyan}[${index + 1}/${total}] RUNNING SUITE:${colors.reset} ${colors.bright}${suite.name}${colors.reset}`);
    console.log(`${colors.dim}    Target: ${path.relative(process.cwd(), suite.file)}${colors.reset}`);
    console.log(`${colors.dim}    Scope:  ${suite.description}${colors.reset}\n`);

    const start = Date.now();
    const child = spawn('node', ['--test', suite.file], {
      stdio: 'inherit',
      env: process.env
    });

    child.on('close', (code) => {
      const duration = ((Date.now() - start) / 1000).toFixed(2);
      if (code === 0) {
        console.log(`\n${colors.green}✔ ${suite.name} PASSED (${duration}s)${colors.reset}`);
        resolve({ ...suite, passed: true, duration });
      } else {
        console.error(`\n${colors.red}✖ ${suite.name} FAILED with exit code ${code} (${duration}s)${colors.reset}`);
        resolve({ ...suite, passed: false, duration, exitCode: code });
      }
    });

    child.on('error', (err) => {
      console.error(`\n${colors.red}✖ Execution error in ${suite.name}: ${err.message}${colors.reset}`);
      resolve({ ...suite, passed: false, error: err.message });
    });
  });
}

async function runAll() {
  console.log(`\n${colors.bright}${colors.blue}================================================================${colors.reset}`);
  console.log(`${colors.bright}          PRATIBHA COMPLETE END-TO-END TEST RUNNER              ${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}================================================================${colors.reset}`);
  console.log(`${colors.dim}Database: PostgreSQL 18 (Local) | Node: ${process.version}${colors.reset}\n`);

  const results = [];
  for (let i = 0; i < suites.length; i++) {
    const res = await runSuite(suites[i], i, suites.length);
    results.push(res);
  }

  console.log(`\n${colors.bright}${colors.blue}================================================================${colors.reset}`);
  console.log(`${colors.bright}                   TEST EXECUTION SUMMARY                       ${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}================================================================${colors.reset}\n`);

  let allPassed = true;
  results.forEach((r, idx) => {
    const status = r.passed
      ? `${colors.green}✔ PASSED${colors.reset}`
      : `${colors.red}✖ FAILED${colors.reset}`;
    console.log(`  ${idx + 1}. [${status}] ${colors.bright}${r.name}${colors.reset} (${r.duration}s)`);
  });

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.length - passedCount;

  console.log(`\n${colors.bright}Total Suites: ${results.length} | Passed: ${colors.green}${passedCount}${colors.reset} | Failed: ${failedCount > 0 ? colors.red : colors.green}${failedCount}${colors.reset}\n`);

  if (failedCount > 0) {
    console.error(`${colors.red}Some test suites failed.${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`${colors.green}${colors.bright}All end-to-end functionality tests completed successfully!${colors.reset}\n`);
    process.exit(0);
  }
}

runAll();
