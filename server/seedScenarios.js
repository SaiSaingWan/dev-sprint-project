const { db, FieldValue } = require('./config/firebase');

const scenarios = [
  // ==========================================
  // SCENARIO 1: PAYMENT GATEWAY MELTDOWN
  // ==========================================
  {
    id: "scen_pay_001",
    title: "Payment Gateway Meltdown",
    difficulty: "Intermediate",
    timeLimitMinutes: 15,
    description: "Intermittent 500 API errors during Black Friday traffic spike. Resolve DB row locks, race conditions, and Redis sync timeouts.",
    active: true,
    roles: {
      QA: {
        roleTitle: "QA Engineer",
        focus: "Reproduction, edge-cases, system boundaries",
        questions: [
          {
            questionId: 1,
            actTitle: "ACT 1: Incident Isolation",
            prompt: "Alerts show 12% of checkout attempts failing with HTTP 500. How do you isolate the root cause boundary?",
            options: [
              { text: "A. Inspect APM traces to check if failures correlate with external payment provider response times or internal DB locks.", points: 10, health: "95% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Manually attempt checkouts with different payment methods across staging and production.", points: 6, health: "80% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Immediately request a full rollback of the latest backend deployment without log analysis.", points: 2, health: "50% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 2,
            actTitle: "ACT 1: Reproduction",
            prompt: "Failures occur only when multiple users purchase the same item concurrently. How do you reproduce this edge-case?",
            options: [
              { text: "A. Script a concurrent load test simulating 50 parallel requests targeting identical inventory IDs.", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Rapidly refresh the checkout page on two browser tabs simultaneously.", points: 6, health: "75% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Mark inventory count as 0 to stop further orders while investigating.", points: 2, health: "40% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 3,
            actTitle: "ACT 1: Boundary Boundary Testing",
            prompt: "Concurrency causes inventory to dip into negative values (-1, -2). What contract assertion is missing?",
            options: [
              { text: "A. Assert DB constraint check `stock_quantity >= 0` and atomic decrements.", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Recommend adding frontend validation to block the submit button after one click.", points: 6, health: "70% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Ignore negative counts temporarily if payment authorization succeeds.", points: 2, health: "30% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 4,
            actTitle: "ACT 2: Redis Cache Divergence",
            prompt: "Redis cache reports 15 stock items, while PostgreSQL reports 0. How should QA report this synchronization gap?",
            options: [
              { text: "A. File a P1 defect detailing cache invalidation order and race condition TTL parameters.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Manually flush the Redis cache using CLI without notifying dev team.", points: 6, health: "65% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Disable Redis cache layer permanently in live environment.", points: 2, health: "25% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 5,
            actTitle: "ACT 2: Payment Webhook Retries",
            prompt: "Payment provider sends 3 Duplicate Webhook callbacks due to gateway timeouts. How to verify idempotency?",
            options: [
              { text: "A. Replay identical webhook payloads with duplicate transaction reference IDs and check DB for single record insertion.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Verify if user receives 3 separate confirmation emails.", points: 6, health: "60% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Disable webhook processing endpoint and switch to polling every minute.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 6,
            actTitle: "ACT 2: Network Latency Simulation",
            prompt: "Payment API response latency spikes from 200ms to 8,000ms. How do you test timeout handling?",
            options: [
              { text: "A. Inject 10s latency delay via Toxiproxy/Mock Server and verify frontend gracefully displays retry dialog.", points: 10, health: "80% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Disconnect your Wi-Fi card mid-transaction to see what breaks.", points: 6, health: "55% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Increase backend HTTP client timeout to 60 seconds.", points: 2, health: "15% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 7,
            actTitle: "ACT 3: Verification of Hotfix",
            prompt: "Developers pushed a patch using DB row locks (`SELECT FOR UPDATE`). How do you regression test?",
            options: [
              { text: "A. Execute concurrent test suites while monitoring PostgreSQL active locks (`pg_stat_activity`) for deadlocks.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Run a single smoke test transaction manually.", points: 6, health: "60% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Skip testing and sign off immediately to restore traffic.", points: 2, health: "10% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 8,
            actTitle: "ACT 3: Failure Recovery",
            prompt: "50 transactions failed mid-flight during the outage. How to verify data consistency for affected users?",
            options: [
              { text: "A. Run an automated reconciliation script comparing payment provider logs against database order states.", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Wait for customers to email support regarding missing orders.", points: 6, health: "50% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Bulk credit all users 100% refunds without transaction audit.", points: 2, health: "10% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 9,
            actTitle: "ACT 3: Post-Mortem Metric Verification",
            prompt: "What QA metric best demonstrates that the system has recovered to pre-incident stability?",
            options: [
              { text: "A. Zero unhandled 5xx errors across 10,000 synthetic test transactions under 95th percentile SLA (<400ms).", points: 10, health: "95% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Average CPU load below 90%.", points: 6, health: "70% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. No customer complaints for 10 minutes.", points: 2, health: "30% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 10,
            actTitle: "ACT 3: Preventative Quality Gate",
            prompt: "How do you prevent this high-concurrency payment lock issue from reoccurring in future releases?",
            options: [
              { text: "A. Add automated load tests with race condition scenarios into CI/CD release pipeline quality gates.", points: 10, health: "100% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Schedule manual testing sessions before every major sales event.", points: 6, health: "80% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Restrict peak website user traffic using a queue landing page.", points: 2, health: "40% (CRITICAL)", morale: "PANICKED" }
            ]
          }
        ]
      },
      Tester: {
        roleTitle: "Software Tester",
        focus: "Automated scripts, status codes, assertion checks",
        questions: [
          {
            questionId: 1,
            actTitle: "ACT 1: Automated Script Diagnosis",
            prompt: "Automated API suite is returning `500 Internal Server Error` instead of `200 OK`. What assertion check do you update first?",
            options: [
              { text: "A. Capture raw response body and assert HTTP status is `409 Conflict` or `422 Unprocessable` with clean JSON error details.", points: 10, health: "95% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Change test assertion to expect `500` so test suite turns green.", points: 2, health: "40% (CRITICAL)", morale: "PANICKED" },
              { text: "C. Increase request retry count to 10 in Cypress/Playwright configuration.", points: 6, health: "70% (DEGRADED)", morale: "ANXIOUS" }
            ]
          },
          {
            questionId: 2,
            actTitle: "ACT 1: API Contract Assertions",
            prompt: "Payment payload responses are returning missing `transaction_id` fields under heavy load. How do you catch this in automation?",
            options: [
              { text: "A. Enforce strict JSON Schema validation matching OpenAPI specification for every payment API test.", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Add `console.log()` statements to output responses to terminal.", points: 6, health: "75% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Comment out missing field assertions temporarily.", points: 2, health: "30% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 3,
            actTitle: "ACT 1: Idempotency Assertions",
            prompt: "How do you write a automated Postman/k6 test script to verify idempotency on `/api/v1/checkout`?",
            options: [
              { text: "A. Send POST request twice with same `Idempotency-Key` header; assert 1st returns `201 Created` and 2nd returns `200 OK` with identical payload.", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Send 2 requests with different keys and verify both succeed.", points: 6, health: "70% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Assert database query length equals total HTTP requests sent.", points: 2, health: "35% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 4,
            actTitle: "ACT 2: k6 Load Test Scripting",
            prompt: "You need to automate 500 virtual users (VUs) hitting payment endpoints. How do you configure the k6 load script?",
            options: [
              { text: "A. Define ramp-up stages: 50 VUs for 1 min, ramp to 500 VUs for 3 mins, asserting p95 response time < 500ms.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Launch 500 VUs instantly with 0ms think-time delay.", points: 6, health: "60% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Run load test script directly against the production DB without rate limiting.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 5,
            actTitle: "ACT 2: Mock Server Assertions",
            prompt: "The third-party Payment Gateway sandbox is timing out during test execution. How do you keep automated tests running?",
            options: [
              { text: "A. Switch test environment to wiremock/MSW mock server simulating 200ms success, 500ms delay, and 500 failure responses.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Hardcode test script to sleep for 30 seconds before asserting.", points: 6, health: "65% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Disable payment integration automated suite.", points: 2, health: "15% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 6,
            actTitle: "ACT 2: DB State Verification Assertion",
            prompt: "After running an automated order test, how do you verify backend database integrity via automation?",
            options: [
              { text: "A. Execute an automated SQL query checking `orders.status = 'PAID'` and `inventory.stock` decremented by exact item count.", points: 10, health: "80% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Assert frontend success message string 'Order Placed Successful' appears in DOM.", points: 6, health: "60% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Check if order ID counter incremented by 1.", points: 2, health: "25% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 7,
            actTitle: "ACT 3: Smoke Test Suite Execution",
            prompt: "Developer deployed hotfix branch `fix/db-row-lock`. How quickly do you validate build readiness?",
            options: [
              { text: "A. Run automated headless CI smoke suite covering critical checkout paths within 3 minutes.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Run complete 4-hour end-to-end regression suite before giving feedback.", points: 6, health: "65% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Manually click checkout button twice in staging UI.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 8,
            actTitle: "ACT 3: Flaky Test Triage",
            prompt: "One payment test fails randomly 1 out of 10 times due to async processing delays. How to fix script flakiness?",
            options: [
              { text: "A. Replace static `cy.wait(5000)` with dynamic polling wait `cy.waitUntil()` checking API status endpoint.", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Add `retries: 5` to test runner configuration.", points: 6, health: "60% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Mark test file as `test.skip()`.", points: 2, health: "15% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 9,
            actTitle: "ACT 3: Security & Assertion Testing",
            prompt: "How do you verify via script that sensitive credit card details are never exposed in server logs during outage retries?",
            options: [
              { text: "A. Automate log stream inspection asserting regex matching card numbers (Luhn algorithm) yields 0 matches.", points: 10, health: "95% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Manually open log files and visually scan 50 lines.", points: 6, health: "70% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Assume HTTPS encryption automatically hides log payloads.", points: 2, health: "30% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 10,
            actTitle: "ACT 3: Automated Regression Sign-Off",
            prompt: "All automated assertions passed on hotfix build. What deliverable do you publish to team?",
            options: [
              { text: "A. Publish HTML test summary report with execution metrics, latency histograms, and zero-failure verification.", points: 10, health: "100% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Send Slack message saying 'tests passed'.", points: 6, health: "80% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Do not send report unless requested by Lead Developer.", points: 2, health: "40% (CRITICAL)", morale: "PANICKED" }
            ]
          }
        ]
      },
      Programmer: {
        roleTitle: "Programmer / Developer",
        focus: "Hotfixes, DB query optimization, lock handling",
        questions: [
          {
            questionId: 1,
            actTitle: "ACT 1: Emergency DB Lock Resolution",
            prompt: "PostgreSQL CPU is at 99% with dozens of queries blocked in `exclusive lock` state on `orders` table. What is your immediate action?",
            options: [
              { text: "A. Query `pg_stat_activity`, identify blocking PID holding long-running transaction, and execute `pg_cancel_backend(PID)`.", points: 10, health: "95% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Restart the main PostgreSQL database instance server.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" },
              { text: "C. Increase PostgreSQL `max_connections` setting from 100 to 1,000.", points: 6, health: "60% (DEGRADED)", morale: "ANXIOUS" }
            ]
          },
          {
            questionId: 2,
            actTitle: "ACT 1: Atomic Inventory Decrements",
            prompt: "Over-selling occurs because code does `stock = find()`, then `save(stock - 1)` without locking. How do you refactor?",
            options: [
              { text: "A. Rewrite update query to atomic SQL: `UPDATE inventory SET quantity = quantity - 1 WHERE id = $1 AND quantity > 0`.", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Wrap operations in standard JavaScript `try/catch` block.", points: 6, health: "70% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Move stock decrement logic to client-side frontend code.", points: 2, health: "25% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 3,
            actTitle: "ACT 1: Redis Distributed Locking",
            prompt: "Multiple app instances process payment webhooks simultaneously. How do you enforce single-instance processing?",
            options: [
              { text: "A. Implement Redlock algorithm with Redis `SET key value NX PX 5000` acquiring lock before processing.", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Use node.js in-memory global variable flag `isProcessing = true`.", points: 6, health: "65% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Restrict app deployment to a single container instance permanently.", points: 2, health: "30% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 4,
            actTitle: "ACT 2: Circuit Breaker Implementation",
            prompt: "External Payment Gateway is timing out, causing backend worker threads to block. How do you prevent cascade failure?",
            options: [
              { text: "A. Wrap HTTP client with Resilience4j/Opossum Circuit Breaker; open circuit after 5 failures and return quick fallback.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Wrap request in infinite `while(true)` retry loop.", points: 2, health: "15% (CRITICAL)", morale: "PANICKED" },
              { text: "C. Increase HTTP timeout to 60 seconds so requests eventually finish.", points: 6, health: "55% (DEGRADED)", morale: "ANXIOUS" }
            ]
          },
          {
            questionId: 5,
            actTitle: "ACT 2: Database Connection Pool Exhaustion",
            prompt: "App logs show `ConnectionPoolTimeoutException`. Database pool size is 20 connections. How to fix connection leaks?",
            options: [
              { text: "A. Ensure DB connections are returned in `finally` blocks and optimize connection pool timeout configs (`idleTimeout: 30000`).", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Increase pool size to 500 connections.", points: 6, health: "60% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Open a new database connection manually for every HTTP request.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 6,
            actTitle: "ACT 2: Asynchronous Payment Queueing",
            prompt: "Synchronous payment processing during high traffic creates HTTP 504 Gateway Timeouts. How do you decouple operations?",
            options: [
              { text: "A. Enqueue checkout payloads to RabbitMQ/Kafka queue; process payments asynchronously and notify client via WebSocket.", points: 10, health: "80% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Spawn `child_process.fork()` inside HTTP express route handler.", points: 6, health: "50% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Tell users to reload page if checkout takes over 10 seconds.", points: 2, health: "10% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 7,
            actTitle: "ACT 3: Zero-Downtime Hotfix Deployment",
            prompt: "Hotfix code is ready. How do you deploy to production without dropping active shopping cart sessions?",
            options: [
              { text: "A. Perform Rolling Canary deployment; route 10% traffic to updated containers, verify error rates, then complete rollout.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Stop all production application containers, update code, and restart server.", points: 2, health: "30% (CRITICAL)", morale: "PANICKED" },
              { text: "C. Push code straight to `main` branch with auto-deploy hook enabled.", points: 6, health: "65% (DEGRADED)", morale: "ANXIOUS" }
            ]
          },
          {
            questionId: 8,
            actTitle: "ACT 3: Idempotency Key Storage",
            prompt: "Where should backend store processed payment idempotency keys for fast lookups under heavy read load?",
            options: [
              { text: "A. Redis Key-Value cache with 24-hour TTL keyed by `idempotency:{key}`.", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Unindexed relational SQL database table.", points: 6, health: "70% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. In-memory JavaScript array inside running node server process.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 9,
            actTitle: "ACT 3: Log Sanitization Hotfix",
            prompt: "Production logs reveal raw CVV security codes were logged during payment failures. What is your immediate code fix?",
            options: [
              { text: "A. Add log masking middleware sanitizing sensitive fields (`cvv`, `cardNumber`) prior to logger transport output.", points: 10, health: "95% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Delete log file entirely and turn off logging server wide.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" },
              { text: "C. Ask dev team to refrain from checking server logs today.", points: 6, health: "50% (DEGRADED)", morale: "ANXIOUS" }
            ]
          },
          {
            questionId: 10,
            actTitle: "ACT 3: Architecture Strengthening",
            prompt: "Incident resolved. What architectural pattern will permanently harden the payment gateway?",
            options: [
              { text: "A. Implement Outbox Pattern for transactional messaging combined with Redis Distributed Locks & Rate-limiting middleware.", points: 10, health: "100% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Double backend instance CPU and RAM specs in AWS/GCP.", points: 6, health: "80% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Require manual approval for purchases over $500.", points: 2, health: "40% (CRITICAL)", morale: "PANICKED" }
            ]
          }
        ]
      }
    }
  },

  // ==========================================
  // SCENARIO 2: SPRINT 12 SCOPE CREEP CRISIS
  // ==========================================
  {
    id: "scen_scope_002",
    title: "Sprint 12 Scope Creep Crisis",
    difficulty: "Beginner",
    timeLimitMinutes: 10,
    description: "Stakeholders push 5 unbudgeted feature changes 2 days before release. Maintain regression safety, test coverage, and code isolation.",
    active: true,
    roles: {
      QA: {
        roleTitle: "QA Engineer",
        focus: "Regression test coverage",
        questions: [
          {
            questionId: 1,
            actTitle: "ACT 1: Scope Evaluation",
            prompt: "Product Manager requests adding 5 unbudgeted UI features 48 hours before code freeze. How do you respond?",
            options: [
              { text: "A. Conduct risk analysis, quantify regression impact on core user journeys, and require formal deferral of low-priority items.", points: 10, health: "95% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Accept all 5 features without updating test plan.", points: 2, health: "40% (CRITICAL)", morale: "PANICKED" },
              { text: "C. Refuse to test any new code introduced past sprint day 8.", points: 6, health: "70% (DEGRADED)", morale: "ANXIOUS" }
            ]
          },
          {
            questionId: 2,
            actTitle: "ACT 1: Test Suite Prioritization",
            prompt: "With reduced testing time, how do you adjust QA execution strategy?",
            options: [
              { text: "A. Prioritize P0 Risk-Based Testing Matrix focusing strictly on revenue-generating flows (Checkout, Sign-up).", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Attempt to execute 100% of test cases by skipping verification steps.", points: 6, health: "65% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Pick test cases at random until sprint timer runs out.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 3,
            actTitle: "ACT 1: Feature Flag Verification",
            prompt: "Developers isolated unverified scope behind Feature Flags. How do you verify isolation?",
            options: [
              { text: "A. Test application state with flag `OFF` (assert baseline unchanged) and flag `ON` (assert new behavior).", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Only test code with flag turned `ON`.", points: 6, health: "75% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Assume feature flags work without testing OFF states.", points: 2, health: "30% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 4,
            actTitle: "ACT 2: Defect Triage Under Pressure",
            prompt: "During testing of new features, you discover 3 non-critical UI bugs and 1 login security flaw. How to triage?",
            options: [
              { text: "A. Mark login security flaw as Block-Release P1; defer 3 UI bugs to backlog for post-release patch.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Block release until all 4 defects are fully resolved.", points: 6, health: "60% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Downgrade login security flaw to P3 to meet release deadline.", points: 2, health: "15% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 5,
            actTitle: "ACT 2: Regression Impact Boundary",
            prompt: "A last-minute CSS update breaks user profile layout on mobile devices. What boundary test was missed?",
            options: [
              { text: "A. Responsive viewport visual regression testing across standard mobile break-points (375px, 768px).", points: 10, health: "80% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Desktop browser testing on Chrome.", points: 6, health: "60% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Manual testing on simulator without layout inspector tools.", points: 2, health: "25% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 6,
            actTitle: "ACT 2: Exploratory Testing",
            prompt: "Time is short for formal test cases. How do you execute exploratory testing effectively?",
            options: [
              { text: "A. Run 45-minute timed charter-based session focusing on edge case data inputs for modified endpoints.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Click randomly around application UI without logging findings.", points: 6, health: "55% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Ask non-technical stakeholders to test features for you.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 7,
            actTitle: "ACT 3: Quality Gate Sign-Off",
            prompt: "Product Manager asks QA to sign off release despite 2 unverified features. What is your stance?",
            options: [
              { text: "A. Issue conditional sign-off: Approve release ONLY with unverified features toggled OFF via feature flags.", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Sign off unconditionally to avoid team conflict.", points: 2, health: "30% (CRITICAL)", morale: "PANICKED" },
              { text: "C. Refuse to sign off and leave release meeting in protest.", points: 6, health: "60% (DEGRADED)", morale: "ANXIOUS" }
            ]
          },
          {
            questionId: 8,
            actTitle: "ACT 3: Staging vs Production Parity",
            prompt: "A feature works in Staging but fails in Pre-Prod staging environment. What QA sanity check do you perform?",
            options: [
              { text: "A. Audit environment configuration variables, API keys, and database migration version parity.", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Re-deploy code build 3 times in a row.", points: 6, health: "65% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Recommend releasing directly to production to test there.", points: 2, health: "15% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 9,
            actTitle: "ACT 3: Release Readiness Metrics",
            prompt: "What metric gives stakeholders highest confidence to proceed with deployment?",
            options: [
              { text: "A. 100% P0 regression suite pass rate, 0 open critical defects, and verified feature flag fallbacks.", points: 10, health: "95% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Total number of test cases written during sprint.", points: 6, health: "70% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Developer assurance that code looks clean.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 10,
            actTitle: "ACT 3: Sprint Retrospective Action",
            prompt: "How do you address late scope creep in Sprint Retrospective to protect future sprint stability?",
            options: [
              { text: "A. Propose strict Scope Freeze policy 4 days prior to release and mandatory QA capacity estimation during grooming.", points: 10, health: "100% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Recommend eliminating sprint release deadlines entirely.", points: 6, health: "75% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Blame product management team publicly in retro.", points: 2, health: "30% (CRITICAL)", morale: "PANICKED" }
            ]
          }
        ]
      },
      Tester: {
        roleTitle: "Software Tester",
        focus: "Smoke test automation",
        questions: [
          {
            questionId: 1,
            actTitle: "ACT 1: Fast Automated Smoke Suites",
            prompt: "Full automated E2E test suite takes 45 minutes to execute. CI build pipeline is congested. How do you optimize?",
            options: [
              { text: "A. Tag critical-path tests `@smoke` and execute parallelized 4-minute smoke suite on commit PRs.", points: 10, health: "95% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Disable automated tests and run manual checks only.", points: 2, health: "30% (CRITICAL)", morale: "PANICKED" },
              { text: "C. Increase CI pipeline timeout limit to 2 hours.", points: 6, health: "65% (DEGRADED)", morale: "ANXIOUS" }
            ]
          },
          {
            questionId: 2,
            actTitle: "ACT 1: Dynamic Data Stubbing",
            prompt: "Unbudgeted UI features depend on unreleased backend APIs. How do you automate frontend testing?",
            options: [
              { text: "A. Use API mocking (Cypress `cy.intercept()` / Playwright `page.route()`) to stub backend JSON responses.", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Block automation until backend team finishes writing APIs.", points: 6, health: "70% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Write automation tests using fake hardcoded UI elements.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 3,
            actTitle: "ACT 1: Visual Regression Assertions",
            prompt: "Unannounced scope updates altered button padding across 12 screens. How do you catch UI drift automatically?",
            options: [
              { text: "A. Run automated visual diff snapshot test (Percy / Playwright `toHaveScreenshot()`) asserting pixel diff < 0.1%.", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Manually inspect all 12 screens on 3 different monitors.", points: 6, health: "60% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Ignore visual differences if buttons remain clickable.", points: 2, health: "25% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 4,
            actTitle: "ACT 2: Cross-Browser Test Automation",
            prompt: "Stakeholders demand verification across Chrome, Safari, and Firefox within 1 hour. How do you execute?",
            options: [
              { text: "A. Trigger automated Playwright suite on Playwright Shard grid in cloud running 3 browser engines concurrently.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Manually open Safari and Firefox and execute smoke test manually.", points: 6, health: "65% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Test only on Chrome and assume other browsers work identically.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 5,
            actTitle: "ACT 2: Flaky CI Selector Triage",
            prompt: "New UI changes broke automated scripts using `xpath: //div[3]/button[2]`. How do you refactor selectors?",
            options: [
              { text: "A. Replace fragile DOM paths with resilient test IDs: `data-testid=\"submit-order-btn\"`.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Update XPath to `//div[4]/button[2]`.", points: 6, health: "55% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Wrap test steps in `try { ... } catch (e) { ignore() }`.", points: 2, health: "15% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 6,
            actTitle: "ACT 2: API Contract Testing Automation",
            prompt: "Backend scope changes added mandatory payload field `user_tier`. How to prevent breaking automated frontend tests?",
            options: [
              { text: "A. Update Pact API contract automated schema and run contract provider verification build in CI.", points: 10, health: "80% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Manually edit local mock files without committing to git.", points: 6, health: "60% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Disable API response body assertions.", points: 2, health: "10% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 7,
            actTitle: "ACT 3: Performance Regression Check",
            prompt: "Added scope increased JS bundle size by 1.2MB. How do you detect frontend performance degradation?",
            options: [
              { text: "A. Automate Lighthouse CI audit asserting Cumulative Layout Shift (CLS) < 0.1 and First Contentful Paint (FCP) < 1.8s.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Open developer tools Network tab and look at download bar.", points: 6, health: "65% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Ignore bundle size if server CPU remains normal.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 8,
            actTitle: "ACT 3: Test Execution Failure Analysis",
            prompt: "CI pipeline reports 2 automated test failures out of 150 scripts. What is your immediate diagnostic step?",
            options: [
              { text: "A. Inspect CI test artifacts: review DOM snapshot, network HAR file logs, and failure video recording.", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Re-run failed CI pipeline 3 times hoping tests turn green.", points: 6, health: "60% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Delete the 2 failing test files from git repo.", points: 2, health: "15% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 9,
            actTitle: "ACT 3: Test Environment Database Seeding",
            prompt: "Automated tests fail because test database contains dirty leftover state from manual testing. How to fix?",
            options: [
              { text: "A. Add pre-test automation hook executing isolated DB container reset and fixture seeding (`knex seed:run`).", points: 10, health: "95% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Manually delete rows from database using SQL CLI.", points: 6, health: "70% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Write tests that don't query the database.", points: 2, health: "25% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 10,
            actTitle: "ACT 3: Test Automation CI Integration",
            prompt: "Sprint code release is complete. How do you guarantee smoke tests run automatically on every post-release deployment?",
            options: [
              { text: "A. Configure GitHub Actions workflow webhook triggering post-deployment synthetic monitoring tests against production URL.", points: 10, health: "100% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Calendar reminder to run tests manually every morning.", points: 6, health: "75% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Assume cloud platform automatic health checks cover software testing.", points: 2, health: "35% (CRITICAL)", morale: "PANICKED" }
            ]
          }
        ]
      },
      Programmer: {
        roleTitle: "Programmer / Developer",
        focus: "Feature flags & debt isolation",
        questions: [
          {
            questionId: 1,
            actTitle: "ACT 1: Feature Flag Code Isolation",
            prompt: "Stakeholder forces late feature integration 28 hours before release. How do you structure the code to prevent regression?",
            options: [
              { text: "A. Wrap new feature module behind LaunchDarkly/Unleash Feature Toggle: `if (flags.isEnabled('new_ui')) { ... }`.", points: 10, health: "95% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Write code directly into existing core component functions.", points: 2, health: "30% (CRITICAL)", morale: "PANICKED" },
              { text: "C. Create a long-lived git feature branch and delay merge until next month.", points: 6, health: "65% (DEGRADED)", morale: "ANXIOUS" }
            ]
          },
          {
            questionId: 2,
            actTitle: "ACT 1: Database Schema Backward Compatibility",
            prompt: "Unbudgeted feature requires adding non-nullable column `membership_tier` to existing SQL table `users`. How to migration safely?",
            options: [
              { text: "A. Two-phase migration: Add column as nullable with default value first; backfill data; apply NOT NULL constraint in next sprint.", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Run `ALTER TABLE users ADD COLUMN membership_tier VARCHAR NOT NULL` directly on live DB.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" },
              { text: "C. Store data in raw text file outside database.", points: 6, health: "50% (DEGRADED)", morale: "ANXIOUS" }
            ]
          },
          {
            questionId: 3,
            actTitle: "ACT 1: Technical Debt Tagging",
            prompt: "You wrote temporary workaround code to satisfy urgent scope. How do you manage this tech debt?",
            options: [
              { text: "A. Annotate code with `@deprecated` / `// TODO: [DEBT-402]`, create ticket in Jira, and set expiration date flag.", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Leave code as is without comments.", points: 6, health: "70% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Tell dev team you will fix it from memory next sprint.", points: 2, health: "25% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 4,
            actTitle: "ACT 2: API Endpoint Versioning",
            prompt: "Scope changes break payload request format of public API `/api/v1/orders`. How do you protect legacy integrations?",
            options: [
              { text: "A. Create non-breaking endpoint `/api/v2/orders` while maintaining `/api/v1/orders` adapter mapping layer.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Modify `/api/v1/orders` payload format directly and update documentation.", points: 2, health: "15% (CRITICAL)", morale: "PANICKED" },
              { text: "C. Return HTTP 400 error for older client request payloads.", points: 6, health: "55% (DEGRADED)", morale: "ANXIOUS" }
            ]
          },
          {
            questionId: 5,
            actTitle: "ACT 2: Component Decoupling",
            prompt: "New scope requires user dashboard to fetch recommendations from heavy external AI service. How to isolate frontend UI performance?",
            options: [
              { text: "A. Wrap component in React Suspense/ErrorBoundary with asynchronous dynamic `import()` and skeleton loader state.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Synchronously await AI response in main thread before rendering dashboard page.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" },
              { text: "C. Hardcode sample recommendation array into frontend component bundle.", points: 6, health: "60% (DEGRADED)", morale: "ANXIOUS" }
            ]
          },
          {
            questionId: 6,
            actTitle: "ACT 2: Memory Leak Isolation",
            prompt: "Quickly written event listener code causes node server memory usage to climb linearly (`EventEmitter` memory leak). How to fix?",
            options: [
              { text: "A. Clean up listener references in component unmount / request lifecycle using `removeListener()` or `AbortController`.", points: 10, health: "80% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Restart Node app process automatically whenever RAM reaches 90%.", points: 6, health: "50% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Increase process max memory limit flag `--max-old-space-size=8192`.", points: 2, health: "25% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 7,
            actTitle: "ACT 3: Merge Conflict Management",
            prompt: "Late scope PR has 14 file merge conflicts against `main` branch 2 hours before release. How to resolve safely?",
            options: [
              { text: "A. Perform `git rebase main` on feature branch, carefully resolve conflicts line-by-line, and re-run local test suite.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Force push `git push --force` feature branch directly onto `main`.", points: 2, health: "10% (CRITICAL)", morale: "PANICKED" },
              { text: "C. Delete conflicting lines from main branch files.", points: 6, health: "45% (DEGRADED)", morale: "ANXIOUS" }
            ]
          },
          {
            questionId: 8,
            actTitle: "ACT 3: Graceful Feature Fallback",
            prompt: "High load causes new scope feature backend API to return HTTP 503 errors. How should application respond?",
            options: [
              { text: "A. Fallback gracefully: Hide new widget UI silently without breaking parent layout and log error to Sentry.", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Render full-screen Red Error Screen crash overlay to user.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" },
              { text: "C. Retry failed API call 50 times in rapid loop.", points: 6, health: "50% (DEGRADED)", morale: "ANXIOUS" }
            ]
          },
          {
            questionId: 9,
            actTitle: "ACT 3: Dead Code Cleanup",
            prompt: "Release succeeded with feature flag enabled. Old code path is now obsolete. What is your cleanup protocol?",
            options: [
              { text: "A. Schedule Tech Debt ticket for next sprint to remove old code path and retire feature flag flag entry.", points: 10, health: "95% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Delete old code immediately directly on production server via SSH.", points: 2, health: "15% (CRITICAL)", morale: "PANICKED" },
              { text: "C. Leave flag code in codebase indefinitely.", points: 6, health: "70% (DEGRADED)", morale: "ANXIOUS" }
            ]
          },
          {
            questionId: 10,
            actTitle: "ACT 3: Code Architecture Hardening",
            prompt: "How do you protect codebase architecture against future uncontrolled scope creep?",
            options: [
              { text: "A. Adopt Modular Monolith / Microservices architecture with strict domain boundaries and automated API contract testing.", points: 10, health: "100% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Disable git pull requests and allow developers to push code directly.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" },
              { text: "C. Freeze codebase updates for 3 months.", points: 6, health: "60% (DEGRADED)", morale: "ANXIOUS" }
            ]
          }
        ]
      }
    }
  },

  // ==========================================
  // SCENARIO 3: DATABASE MIGRATION LOCKOUT
  // ==========================================
  {
    id: "scen_db_003",
    title: "Database Migration Lockout",
    difficulty: "Advanced",
    timeLimitMinutes: 20,
    description: "Unindexed schema migration locks production DB during deployment. Balance zero-downtime hotfixes, query tuning, and stakeholder comms.",
    active: true,
    roles: {
      QA: {
        roleTitle: "QA Engineer",
        focus: "Schema contract verification",
        questions: [
          {
            questionId: 1,
            actTitle: "ACT 1: Migration Incident Detection",
            prompt: "Deployment script hangs on `Applying Migration: 004_add_user_indexes.sql`. App APIs start timing out. What is QA's immediate action?",
            options: [
              { text: "A. Check database active process status, confirm table lock state on `users`, and trigger immediate deployment abort signal.", points: 10, health: "95% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Wait 30 minutes to see if migration finishes automatically.", points: 6, health: "65% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Refresh browser window continuously.", points: 2, health: "30% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 2,
            actTitle: "ACT 1: Schema Contract Verification",
            prompt: "Developer pushed migration altering column type `order_id` from INT to BIGINT. How do you verify API contract compatibility?",
            options: [
              { text: "A. Run API test suite asserting JSON response numbers do not suffer JavaScript integer precision loss (values > 2^53 - 1).", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Check if HTTP status code returns 200.", points: 6, health: "70% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Assume INT and BIGINT behave identically in JSON payloads.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 3,
            actTitle: "ACT 1: Zero-Downtime Migration Audit",
            prompt: "Migration script contains `DROP COLUMN legacy_status`. How do you audit this for zero-downtime safety?",
            options: [
              { text: "A. Reject PR: Flag that dropping column directly breaks running app instances; require 3-step expand/contract migration cycle.", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Approve PR since column is no longer used in new code.", points: 2, health: "25% (CRITICAL)", morale: "PANICKED" },
              { text: "C. Recommend dropping column during off-peak hours.", points: 6, health: "60% (DEGRADED)", morale: "ANXIOUS" }
            ]
          },
          {
            questionId: 4,
            actTitle: "ACT 2: Lock Contention Testing",
            prompt: "How do you test SQL migration script safety in Staging environment prior to production execution?",
            options: [
              { text: "A. Run migration script in Staging while simultaneously executing k6 load suite to detect table locking contention.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Execute migration script on empty Staging database with 0 records.", points: 6, health: "60% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Inspect SQL migration file visually without running execution test.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 5,
            actTitle: "ACT 2: Data Integrity Boundary Test",
            prompt: "During rollback of failed migration, 200 user records lost timestamp data. How do you verify recovery state?",
            options: [
              { text: "A. Execute automated checksum validation script comparing pre-migration backup table hashes against restored production tables.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Manually inspect first 5 records in database UI tool.", points: 6, health: "65% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Ask customer support if users reported broken profile data.", points: 2, health: "15% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 6,
            actTitle: "ACT 2: Replication Lag Verification",
            prompt: "Database migration caused Read-Replica DB synchronization lag to spike to 45 minutes. How does QA test app behavior?",
            options: [
              { text: "A. Test read-after-write operations asserting app correctly routes critical reads to Master DB during replica lag state.", points: 10, health: "80% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Stop writing data until replica catches up.", points: 6, health: "55% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Disconnect Read-Replica database entirely.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 7,
            actTitle: "ACT 3: Rollback Strategy Verification",
            prompt: "Hotfix deployment requires executing down-migration script `down.sql`. How do you verify rollback safety?",
            options: [
              { text: "A. Execute down-migration on staged DB snapshot containing sample production data volume and assert zero data loss.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Trust that ORM migration framework automatically handles rollback correctly.", points: 6, health: "60% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Wipe database and restore backup from yesterday.", points: 2, health: "10% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 8,
            actTitle: "ACT 3: Index Impact Verification",
            prompt: "Developer added composite index `CREATE INDEX idx_user_status`. How do you verify query performance improvement?",
            options: [
              { text: "A. Execute `EXPLAIN ANALYZE` on key queries asserting execution plan switched from `Seq Scan` to `Index Scan`.", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Run query once in pgAdmin and check execution timer.", points: 6, health: "65% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Assume index automatically makes all queries 10x faster.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 9,
            actTitle: "ACT 3: Incident Post-Mortem QA Report",
            prompt: "What QA finding is most essential to include in the Incident Post-Mortem report?",
            options: [
              { text: "A. Root cause analysis detailing absence of staging DB volume parity and missing concurrent migration testing quality gates.", points: 10, health: "95% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Summary of how quickly QA team responded to Slack alerts.", points: 6, health: "70% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. List of developers who authored the migration script.", points: 2, health: "25% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 10,
            actTitle: "ACT 3: Long-term Database Quality Gate",
            prompt: "How to prevent unindexed or blocking migration scripts from reaching production in future pipelines?",
            options: [
              { text: "A. Integrate automated SQL linter (`sqlfluff` / `atlas`) into CI pipeline asserting all DDL migrations use `CONCURRENTLY` keywords.", points: 10, health: "100% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Require DB migrations to be run manually by DBA at midnight.", points: 6, health: "75% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Ban database schema alterations for remaining quarter.", points: 2, health: "30% (CRITICAL)", morale: "PANICKED" }
            ]
          }
        ]
      },
      Tester: {
        roleTitle: "Software Tester",
        focus: "DB integrity testing",
        questions: [
          {
            questionId: 1,
            actTitle: "ACT 1: Automated Integrity Checks",
            prompt: "Database migration failed mid-way through execution. How do you automate validation of foreign key integrity?",
            options: [
              { text: "A. Execute automated test script running SQL integrity assertions: `SELECT count(*) FROM orders WHERE user_id NOT IN (SELECT id FROM users)`.", points: 10, health: "95% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Open database GUI and scan tables manually.", points: 6, health: "65% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Run application UI tests and check if pages crash.", points: 2, health: "25% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 2,
            actTitle: "ACT 1: Automated Migration Performance Testing",
            prompt: "How do you automate testing of a migration script against a 10-million row database fixture?",
            options: [
              { text: "A. Spin up ephemeral Docker DB container populated with 10M obfuscated row fixture and assert migration completes in < 30s.", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Run migration on local dev machine with 100 sample rows.", points: 6, health: "60% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Execute migration directly on production replica database.", points: 2, health: "15% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 3,
            actTitle: "ACT 1: Data Type Truncation Assertions",
            prompt: "Migration script changed column `notes` from `TEXT` to `VARCHAR(255)`. How do you test for data truncation?",
            options: [
              { text: "A. Execute automated script asserting zero records exist where original length > 255 before approving migration run.", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Run migration and check if database returns error.", points: 6, health: "70% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Truncate notes text manually in application UI.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 4,
            actTitle: "ACT 2: Automated Index Validation Script",
            prompt: "How do you automate verification that all foreign key columns across 40 tables possess corresponding indexes?",
            options: [
              { text: "A. Execute SQL schema assertion script querying `pg_constraint` against `pg_indexes` verifying 100% indexing coverage.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Inspect database DDL schema creation files manually.", points: 6, health: "65% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Run load test script and check if server overheats.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 5,
            actTitle: "ACT 2: Concurrent Mutation Assertions",
            prompt: "Migration script runs for 45 seconds. How to verify background user writes during migration are not dropped?",
            options: [
              { text: "A. Run automated background worker inserting 500 records/sec during migration run; assert total inserted count matches post-migration count exactly.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Freeze user writes during migration execution.", points: 6, health: "60% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Check if total row count is greater than zero.", points: 2, health: "15% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 6,
            actTitle: "ACT 2: NULL Constraint Assertions",
            prompt: "Migration added NOT NULL constraint to `email_verified` column. How do you test fallback handling for existing NULL rows?",
            options: [
              { text: "A. Seed test DB with NULL values; assert migration script executes default fallback update (`SET email_verified = false`) without throwing constraint violation.", points: 10, health: "80% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Delete all existing rows containing NULL values.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" },
              { text: "C. Remove NOT NULL constraint from migration file.", points: 6, health: "55% (DEGRADED)", morale: "ANXIOUS" }
            ]
          },
          {
            questionId: 7,
            actTitle: "ACT 3: Connection Timeout Assertions",
            prompt: "Migration lock causes application connection pool pool to throw timeouts. How do you automate verification of recovery state?",
            options: [
              { text: "A. Automate post-migration sanity script asserting backend connection pool recovers and active connections drop to idle baseline.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Manually restart backend web app containers.", points: 6, health: "60% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Check web server uptime metric.", points: 2, health: "25% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 8,
            actTitle: "ACT 3: Transaction Isolation Assertions",
            prompt: "How do you verify automated test suite execution against PostgreSQL `READ COMMITTED` vs `SERIALIZABLE` isolation levels?",
            options: [
              { text: "A. Configure automated test matrix running concurrency suite under both isolation levels and asserting zero serialization failures (`40001`).", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Set database transaction isolation level to default and leave it.", points: 6, health: "70% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Disable transaction locks in test environment.", points: 2, health: "15% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 9,
            actTitle: "ACT 3: Data Migration Encryption Validation",
            prompt: "Migration script encrypts existing user PII data using AES-256. How do you verify encryption integrity in automated tests?",
            options: [
              { text: "A. Assert raw database column contains valid ciphertext bytes AND application decryption layer retrieves matching plaintext value.", points: 10, health: "95% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Assert database column string no longer matches original plaintext string.", points: 6, health: "65% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Print decrypted value to terminal log.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 10,
            actTitle: "ACT 3: Continuous Integrity Monitoring",
            prompt: "Deployment is complete. How do you automate ongoing data integrity monitoring in production?",
            options: [
              { text: "A. Deploy scheduled cron worker running hourly lightweight sanity queries checking data consistency constraints.", points: 10, health: "100% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Review database log files manually once a week.", points: 6, health: "75% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Rely solely on end-user bug reports.", points: 2, health: "30% (CRITICAL)", morale: "PANICKED" }
            ]
          }
        ]
      },
      Programmer: {
        roleTitle: "Programmer / Developer",
        focus: "Index creation & non-blocking migrations",
        questions: [
          {
            questionId: 1,
            actTitle: "ACT 1: Non-Blocking Index Creation",
            prompt: "Production DB table `orders` has 15 million rows. Standard `CREATE INDEX` locks writes. How do you create index safely?",
            options: [
              { text: "A. Execute `CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id);` outside transaction block.", points: 10, health: "95% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Execute standard `CREATE INDEX` during peak traffic hours.", points: 2, health: "15% (CRITICAL)", morale: "PANICKED" },
              { text: "C. Take database offline for 2 hours to create index.", points: 6, health: "60% (DEGRADED)", morale: "ANXIOUS" }
            ]
          },
          {
            questionId: 2,
            actTitle: "ACT 1: Zero-Downtime Column Renaming",
            prompt: "You need to rename database column `phone` to `mobile_number`. How do you execute this without app downtime?",
            options: [
              { text: "A. 3-Step Strategy: 1) Add `mobile_number` column; 2) Write to both columns in code; 3) Backfill data and drop `phone` in next release.", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Execute `ALTER TABLE users RENAME COLUMN phone TO mobile_number` directly.", points: 2, health: "25% (CRITICAL)", morale: "PANICKED" },
              { text: "C. Alias column name inside frontend JavaScript code only.", points: 6, health: "65% (DEGRADED)", morale: "ANXIOUS" }
            ]
          },
          {
            questionId: 3,
            actTitle: "ACT 1: Lock Timeout Safeguards",
            prompt: "A DDL migration statement is waiting for a heavy SELECT query to finish, blocking all subsequent incoming requests. How to prevent this?",
            options: [
              { text: "A. Set statement lock timeout prior to DDL: `SET lock_timeout = '3s'; ALTER TABLE ...` so migration aborts quickly if blocked.", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Kill database server process if migration takes over 5 seconds.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" },
              { text: "C. Increase HTTP server connection timeout to 120 seconds.", points: 6, health: "55% (DEGRADED)", morale: "ANXIOUS" }
            ]
          },
          {
            questionId: 4,
            actTitle: "ACT 2: Batch Data Backfilling",
            prompt: "You need to backfill default values into 5 million existing rows in `users` table. How do you prevent log bloat and locks?",
            options: [
              { text: "A. Execute chunked backfill script processing 5,000 rows per transaction with a 100ms sleep delay between batches.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Execute single SQL statement `UPDATE users SET status = 'active'` across all 5 million rows at once.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" },
              { text: "C. Backfill rows manually using SQL GUI editor page by page.", points: 6, health: "50% (DEGRADED)", morale: "ANXIOUS" }
            ]
          },
          {
            questionId: 5,
            actTitle: "ACT 2: PostgreSQL Lock Level Optimization",
            prompt: "Adding a foreign key constraint performs an expensive validation scan locking the target table. How do you optimize?",
            options: [
              { text: "A. Add constraint with `NOT VALID` clause (fast, no lock); then validate separately: `ALTER TABLE ... VALIDATE CONSTRAINT`.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Drop foreign key relationship entirely from relational schema.", points: 6, health: "60% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Disable PostgreSQL constraint enforcement globally.", points: 2, health: "15% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 6,
            actTitle: "ACT 2: Slow Query Tuning",
            prompt: "API endpoint query `SELECT * FROM transactions WHERE status = 'pending' ORDER BY created_at` takes 12 seconds. How do you tune it?",
            options: [
              { text: "A. Create partial composite index: `CREATE INDEX CONCURRENTLY idx_pending_tx ON transactions(created_at) WHERE status = 'pending'`.", points: 10, health: "80% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Move query sorting logic from SQL database to Node.js application memory.", points: 6, health: "55% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Remove `ORDER BY created_at` clause from SQL query.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 7,
            actTitle: "ACT 3: Database Connection Bouncer Setup",
            prompt: "Database instance is overloaded with 800 direct application connections. How do you stabilize connection management?",
            options: [
              { text: "A. Deploy PgBouncer in transaction pooling mode to pool connection overhead down to 50 active DB connections.", points: 10, health: "85% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Tell application backend containers to restart when connections fail.", points: 6, health: "60% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Terminate sleeping database connections every 60 seconds using cron script.", points: 2, health: "25% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 8,
            actTitle: "ACT 3: Invalid Index Remediation",
            prompt: "A `CREATE INDEX CONCURRENTLY` run failed mid-flight due to deadlock. PostgreSQL marked index `INVALID`. What is the fix?",
            options: [
              { text: "A. Drop invalid index `DROP INDEX CONCURRENTLY idx_name;` and re-execute `CREATE INDEX CONCURRENTLY`.", points: 10, health: "90% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Leave invalid index in database schema.", points: 6, health: "65% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Restart PostgreSQL database instance.", points: 2, health: "20% (CRITICAL)", morale: "PANICKED" }
            ]
          },
          {
            questionId: 9,
            actTitle: "ACT 3: Read-Only DB Fallback Hotfix",
            prompt: "Primary Master DB goes read-only during migration recovery. How does app backend maintain availability for users?",
            options: [
              { text: "A. Catch read-only errors, gracefully serve GET reads from Replica DB, and disable write operations in UI with maintenance notice.", points: 10, health: "95% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Allow app to crash with unhandled exception stack trace.", points: 2, health: "15% (CRITICAL)", morale: "PANICKED" },
              { text: "C. Store incoming writes in browser `localStorage`.", points: 6, health: "50% (DEGRADED)", morale: "ANXIOUS" }
            ]
          },
          {
            questionId: 10,
            actTitle: "ACT 3: Automated Database Migration CI Pipeline",
            prompt: "How do you permanently prevent unverified DB schema migrations from entering production environment?",
            options: [
              { text: "A. Implement automated CI stage executing shadow migrations against isolated production-like database clone with lock detection checks.", points: 10, health: "100% (STABLE)", morale: "CONFIDENT" },
              { text: "B. Email SQL migration scripts to DBA for manual review.", points: 6, health: "75% (DEGRADED)", morale: "ANXIOUS" },
              { text: "C. Rely on developer self-testing on local machine.", points: 2, health: "30% (CRITICAL)", morale: "PANICKED" }
            ]
          }
        ]
      }
    }
  }
];

async function seedDatabase() {
  console.log("🌱 Seeding Firestore with rich narrative role scenarios (with timestamps)...");

  try {
    for (let i = 0; i < scenarios.length; i++) {
      const scenario = scenarios[i];
      const docRef = db.collection('scenarios').doc(scenario.id);
      
      await docRef.set({
        ...scenario,
        createdAt: FieldValue.serverTimestamp()
      }, { merge: true });

      console.log(`✅ Seeded: ${scenario.title} (${scenario.id}) [3 Roles x 10 Questions]`);
    }
    console.log("🚀 Scenario seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();