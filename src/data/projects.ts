export interface Project {
  slug: string; name: string; category: string; summary: string; intro: string; stack: string[];
  repo: string; demo?: string; visual: string; problem: string; approach: string;
  nodes: string[]; decisions: {title: string; text: string}[]; limitations: string;
  evidence: string[]; request: string; response: string; sampleNote: string;
}
export const projects: Project[] = [
  {
    slug: 'fastpay', name: 'fastPay', category: 'PAYMENT INFRASTRUCTURE',
    summary: 'Route the payment. Handle the uncertainty. Reconcile the outcome.',
    intro: 'A Go payment-routing service exploring the difficult parts of payment infrastructure: safe retries, asynchronous outcomes, and an auditable ledger.',
    stack: ['Go', 'Gin', 'PostgreSQL', 'GORM'], repo: 'https://github.com/insignificantGuy/fastPay', demo: 'https://tezzpay.up.railway.app/v1/healthy', visual: 'payment',
    problem: 'A provider timeout does not tell you whether a payment was captured. Blind retries can repeat a charge; late webhooks can contradict an earlier response. The system needs to preserve intent and account for the final outcome.',
    approach: 'Keep a client-supplied checkout key, persist pending state before the provider call, look up uncertain outcomes before retrying, and converge payment state with asynchronous webhooks. A separate reconciliation job compares the ledger with provider reports.',
    nodes: ['HTTP / Gin', 'Payment service', 'Routing engine', 'Mock providers', 'Ledger / PostgreSQL'],
    decisions: [
      {title: 'Intent before execution', text: 'A checkoutID header identifies the operation. Repeat requests reuse the saved payment; in-flight repeats return pending state.'},
      {title: 'Lookup before retry', text: 'On a retryable timeout, check the provider before another charge attempt. Retry attempts use bounded exponential backoff and jitter; declines are terminal.'},
      {title: 'Reconciliation off the request path', text: 'A bounded batch compares ledger and provider state without making API latency depend on reporting. Webhook processing converges out-of-order status updates.'},
    ],
    limitations: 'Independent demonstration using in-process mock providers, a single currency, and a single service instance. No real card data or live payment gateway integration. This is not an employer system.',
    evidence: ['Source includes routing, webhook-ordering, replay, and reconciliation tests.', 'Separate liveness and database-readiness probes.', 'Provider modes simulate success, decline, timeout, and late webhook delivery.'],
    request: 'POST /v1/payments\nContent-Type: application/json\ncheckoutID: portfolio-checkout-001\n\n{\n  "amount": 1000,\n  "currency": "USD"\n}',
    response: 'HTTP 201 Created\n\n{\n  "id": "84a2e28c-6d9c-4a80-a7df-1079a2103fd4",\n  "amount": 1000,\n  "currency": "USD",\n  "status": "succeeded",\n  "provider_id": "provider-a"\n}',
    sampleNote: 'Representative success exchange based on the local handler schema. Identifiers are illustrative; this is not a captured payment or an interactive payment form.',
  },
  {
    slug: 'flowguard', name: 'Flowguard', category: 'DISTRIBUTED SYSTEMS',
    summary: 'When the dependency fails, the pipeline should know what to do.',
    intro: 'A Go and Kafka event pipeline with observable backpressure, circuit breaking, and explicit failure accounting. Built to make resilience visible and measurable.',
    stack: ['Go', 'Kafka', 'Prometheus', 'Grafana'], repo: 'https://github.com/insignificantGuy/Flowguard', visual: 'pipeline',
    problem: 'Producers can outpace workers, and repeated calls to a failing dependency can make an outage worse. Without clear accounting, a healthy HTTP endpoint can hide a growing processing backlog.',
    approach: 'A bounded worker queue pauses Kafka intake with separate pause/resume thresholds. A circuit breaker gates downstream calls. Failed or open-circuit messages are parked in an in-memory dead-letter queue, with metrics exposing each transition.',
    nodes: ['HTTP producer', 'Kafka', 'Bounded workers', 'Circuit breaker', 'Handler / fallback DLQ'],
    decisions: [
      {title: 'Hysteresis, not oscillation', text: 'Separate pause and resume thresholds reduce repeated toggling. Kafka holds the backlog while local intake is paused; backpressure does not increase processing capacity.'},
      {title: 'Probe before reopening', text: 'Closed, open, and half-open states let the dependency recover before normal traffic resumes. A cooldown intentionally trades some immediate processing for fewer failed calls.'},
      {title: 'Make accounting explicit', text: 'Fresh Kafka topics and consumer groups isolate each experiment. After draining, published and consumed counts equal succeeded plus dead-lettered messages.'},
    ],
    limitations: 'Local controlled experiments with a simulated downstream dependency. The fallback DLQ is in memory and is not durable. HTTP acknowledgment measures enqueue latency, not end-to-end processing time. Results are not production capacity guarantees.',
    evidence: ['24 October 2026: matched 15-second runs at an offered 200 requests/second, four workers, and queue capacity 512.', 'Backpressure: peak outstanding work fell from 517 to 32 (93.8% lower).', 'Circuit breaker: failed downstream calls fell from 1,200 to 6 (99.5% fewer) during a six-second dependency outage.'],
    request: 'POST /v1/send-message\nContent-Type: application/json\n\n{\n  "message": "portfolio-event"\n}',
    response: 'After each isolated run drains:\n\npublished = consumed\nconsumed = succeeded + dead_lettered\n\nBreaker-enabled run:\n3,000 = 1,792 + 1,208',
    sampleNote: 'Request format from the API documentation. The accounting result is from the recorded local breaker-enabled experiment, not the result of this single request.',
  },
  {
    slug: 'slotly', name: 'Slotly', category: 'SAAS BACKEND',
    summary: 'One slot. One booking. Clear boundaries between businesses.',
    intro: 'A Go booking API for service businesses, with organization-scoped permissions, short-lived access tokens, and transaction-protected booking workflows.',
    stack: ['Go', 'Gin', 'MySQL', 'JWT'], repo: 'https://github.com/insignificantGuy/Slotly', visual: 'booking',
    problem: 'A booking platform has to protect two boundaries: who can change a business’s resources, and who wins when two customers try to reserve the same slot.',
    approach: 'Separate global customer identity from company membership. Apply organization-role checks to writes, and lock the slot row inside a transaction before creating a booking. Derive identity from the access token rather than trusting user IDs in request bodies.',
    nodes: ['Authenticated customer', 'Booking API', 'Lock slot row', 'Validate availability', 'Commit booking / MySQL'],
    decisions: [
      {title: 'Membership is contextual', text: 'A customer may also administer one company. Staff membership in another organization does not grant write access to that company’s resources.'},
      {title: 'Concurrency belongs in the transaction', text: 'The booking workflow locks a slot row, checks availability, and updates booking state inside the transaction instead of relying on a separate preflight check.'},
      {title: 'Short-lived access, revocable sessions', text: 'JWT access tokens last 15 minutes. Refresh tokens last seven days and are stored hashed, with logout and logout-all operations.'},
    ],
    limitations: 'Case study describes the local MySQL-based implementation. The public repository documentation currently differs from this version and may not expose the reviewed source. No verified public demo. Platform super-admin handling is not fully wired.',
    evidence: ['Local implementation separates Gin controllers, services, and GORM repositories.', 'Slot creation checks for overlaps; booking creation uses a row lock.', 'Public catalog reads are separate from authenticated booking and staff writes.'],
    request: 'POST /v1/bookings\nAuthorization: Bearer <access_token>\nContent-Type: application/json\n\n{\n  "listing_id": "sample-listing-uuid",\n  "slot_id": 12\n}',
    response: 'Begin transaction\n  → Lock slot 12\n  → Check availability\n  → Create booking\n  → Mark slot booked\nCommit\n\nAlready booked → HTTP 409 Conflict',
    sampleNote: 'Representative request from the local README, followed by a booking flow explanation rather than an invented JSON response. The access token and listing ID are illustrative.',
  },
];
