export const profile = {
  name: 'Rahul Negi', initials: 'RN', email: 'manu.rahul28@gmail.com',
  github: 'https://github.com/insignificantGuy', linkedin: 'https://www.linkedin.com/in/rrahul-negi/',
  headline: 'Good systems hold up. Even when things don’t.',
  description: 'Senior software engineer building reliable backend systems, thoughtful web applications, and the infrastructure that keeps them running.',
  introduction: 'My work sits where product meets infrastructure: payment flows, resilient APIs, and systems that stay understandable when the happy path ends.',
};
export const experience = [
  { company: 'Razorpay', role: 'Software Developer', period: 'Joined July 2024', location: 'Bengaluru, India', description: 'Payment routing, tokenisation, and the reliability of critical payment flows.', details: ['Designed direct-to-core payment routing paths and backward-compatible merchant migrations.', 'Built fallback and rollback mechanisms for authentication and payment flows.', 'Worked on tokenisation service boundaries, notification reliability, and engineering mentorship.'] },
  { company: 'Amazon', role: 'Software Developer', period: 'August 2022 — May 2024', location: 'Gurugram, India', description: 'Backend tooling, workflow automation, and production operations.', details: ['Built bulk CSV export functionality and tools to extract information from support requests.', 'Addressed recurring support issues through long-term engineering fixes.', 'Owned incident investigation, root-cause analysis, and safe production fixes.'] },
];
export const expertise = [
  { title: 'Backend & APIs', text: 'Clear contracts. Safe retries. Predictable behavior.', skills: ['Go', 'Node.js', 'Java', 'REST APIs', 'Authentication'] },
  { title: 'Distributed systems', text: 'Built around the failure modes, too.', skills: ['Kafka', 'Idempotency', 'Backpressure', 'MySQL', 'PostgreSQL'] },
  { title: 'Web & delivery', text: 'From the first interaction to a repeatable release.', skills: ['React', 'TypeScript', 'AWS', 'GCP', 'CI/CD'] },
  { title: 'Reliability', text: 'Understand what happened. Know what to do next.', skills: ['Prometheus', 'Grafana', 'Observability', 'Testing', 'Incident response'] },
];
export const services = [
  { number: '01', title: 'Backend & API integrations', text: 'A well-defined service, an external integration, or an existing API that needs a more dependable foundation.' },
  { number: '02', title: 'Reliability assessments', text: 'A focused look at retries, failure handling, bottlenecks, and observability. Clear findings and a practical next step.' },
  { number: '03', title: 'Cloud & delivery', text: 'Repeatable deployments, CI/CD improvements, and cloud infrastructure that is easier to operate.' },
];
