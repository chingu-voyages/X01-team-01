import { Prompt } from "@/types/history";

export const mockHistoryData: Prompt[] = [
  {
    uid: "hist-001",
    date: "16 May 2026",
    persona: "Senior Data Engineer",
    context:
      "Need a normalized schema to track user clicks, cart additions, and final purchases for a high-traffic retail site.",
    task: "Generate SQL Schema for E-commerce Analytics",
    constraints:
      "Include foreign key relationships, indexing strategies for quick querying, and timestamp tracking.",
    output:
      "An optimized PostgreSQL script with clear indexing strategies and inline comments.",
    prompt:
      "```sql\nCREATE TABLE users (\n  user_id UUID PRIMARY KEY,\n  email VARCHAR(255) UNIQUE NOT NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE events (\n  event_id BIGSERIAL PRIMARY KEY,\n  user_id UUID REFERENCES users(user_id),\n  event_type VARCHAR(50) NOT NULL, -- 'click', 'cart_add', 'purchase'\n  payload JSONB,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE INDEX idx_events_user_type ON events(user_id, event_type);\n```",
    rating: 5,
    words: 112,
    score: {
      clarity: 95,
      guidance: 90,
      specificity: 98,
      overall: 94,
    },
    isFavourite: false,
  },
  {
    uid: "hist-002",
    date: "15 May 2026",
    persona: "Expert Frontend Architect",
    context:
      "Refactoring a massive legacy dashboard application to use React 19 and concurrent features.",
    task: "Explain the architectural migration strategy and breaking changes for state management.",
    constraints:
      "Focus entirely on the transition from traditional hooks to Server Actions and the use() hook.",
    output:
      "A structural 3-stage migration plan formatted in Markdown with bold action items.",
    prompt:
      "### React 19 Migration Roadmap\n\n1. **Audit Global Contexts**: Identify all legacy Context providers that can be optimized using the new `use(Context)` API.\n2. **Isolate Side Effects**: Replace boilerplate `useEffect` data fetching routines with native Server Components.\n3. **Transition to Server Actions**: Migrate form handling logic to form actions to utilize automatic pending states via `useActionState`.",
    rating: 4,
    words: 78,
    score: {
      clarity: 88,
      guidance: 92,
      specificity: 85,
      overall: 88,
    },
    isFavourite: true,
  },
  {
    uid: "hist-003",
    date: "14 May 2026",
    persona: "DevOps Specialist",
    context:
      "Deploying a Next.js application to an AWS ECS cluster using Fargate tasks.",
    task: "Create a highly optimized, multi-stage Dockerfile.",
    constraints:
      "Ensure small image footprint by stripping devDependencies and leveraging standalone output tracing.",
    output:
      "A valid Dockerfile structure using Alpine variants with clear step documentation.",
    prompt:
      'dockerfile\nFROM node:20-alpine AS base\nWORKDIR /app\nRUN apk add --no-cache libc6-compat\n\nFROM base AS builder\nCOPY . .\nRUN npm ci && npm run build\n\nFROM base AS runner\nENV NODE_ENV=production\nCOPY --from=builder /app/.next/standalone ./\nCMD ["node", "server.js"]\n',
    rating: 5,
    words: 64,
    score: {
      clarity: 100,
      guidance: 95,
      specificity: 95,
      overall: 97,
    },
    isFavourite: false,
  },
  {
    uid: "hist-004",
    date: "12 May 2026",
    persona: "Growth Marketing Director",
    context:
      "Launching a privacy-first SaaS platform targeting enterprise cybersecurity leads.",
    task: "Draft 3 distinct variations of cold outbound LinkedIn hook messages.",
    constraints:
      "Do not use generic buzzwords like 'synergy' or 'disruptive'. Keep each variation under 75 words.",
    output:
      "A bulleted list containing 3 variations categorized by psychological angle.",
    prompt:
      '* **The Direct Pain-Point Hook**: "Hey [Name], most CISOs I chat with admit their team wastes 12 hours a week manually auditing access logs. We automated that baseline to 90 seconds. Open to seeing how?"\n* **The Peer Metric Hook**: "Hi [Name]—we recently helped the security infrastructure team at [Competitor] reduce compliance prep overhead by 40% without replacing their stack. Worth a brief look?"\n* **The Question Hook**: "Is your current enterprise data perimeter ready for the Q3 audit guidelines, [Name]? A quick workflow adjustment might save your team a major headache later."',
    rating: 3,
    words: 132,
    score: {
      clarity: 80,
      guidance: 85,
      specificity: 78,
      overall: 81,
    },
    isFavourite: false,
  },
  {
    uid: "hist-005",
    date: "10 May 2026",
    persona: "Senior Technical Writer",
    context:
      "Documenting a new RESTful internal API microservice for junior developers.",
    task: "Write a troubleshooting guide explaining 401 Unauthorized versus 403 Forbidden status errors.",
    constraints:
      "Use everyday, non-technical analogies to explain the fundamental differences.",
    output:
      "A concise 2-part explanation with clear headings and a quick summary box.",
    prompt:
      "### 401 Unauthorized vs. 403 Forbidden\n\n* **401 Unauthorized (No Key)**: Think of this like trying to enter an exclusive concert without showing a ticket at the gate. The security guard doesn't know who you are. You need to log in (authenticate) first.\n* **403 Forbidden (Wrong Key)**: You showed your ticket, and the guard checked your ID—they know exactly who you are. However, your ticket is for General Admission, and you are trying to step into the VIP backstage lounge. You are identified, but you do not have permission (authorization).",
    rating: 5,
    words: 110,
    score: {
      clarity: 98,
      guidance: 96,
      specificity: 92,
      overall: 95,
    },
    isFavourite: true,
  },
  {
    uid: "hist-006",
    date: "08 May 2026",
    persona: "Cybersecurity Analyst",
    context:
      "Securing an open-source Node.js Express server backend handling sensitive financial metadata.",
    task: "Provide essential configurations for Helmet.js middleware.",
    constraints:
      "Must explicitly address Content Security Policy (CSP) headers and clickjacking prevention rules.",
    output:
      "An ES6 JavaScript code block ready to be mounted as global application middleware.",
    prompt:
      '```javascript\nimport helmet from \'helmet\';\n\napp.use(helmet({\n  contentSecurityPolicy: {\n    directives: {\n      defaultSrc: ["\'self\'"],\n      scriptSrc: ["\'self\'", "trusted-cdn.com"],\n      objectSrc: ["\'none\'"],\n    },\n  },\n  xFrameOptions: { action: "deny" },\n}));\n```',
    rating: 4,
    words: 45,
    score: {
      clarity: 90,
      guidance: 88,
      specificity: 90,
      overall: 89,
    },
    isFavourite: false,
  },
  {
    uid: "hist-007",
    date: "05 May 2026",
    persona: "Product Manager",
    context:
      "Aligning cross-functional engineering and design departments on features for the upcoming Q3 product roadmap cycle.",
    task: "Formulate a framework script for handling aggressive feature scope-creep from stakeholders.",
    constraints:
      "Maintain an empathetic tone while referencing strict engineering velocity limits.",
    output:
      "A verbal conversational script layout divided into opening alignment, buffer statement, and strategic pivot.",
    prompt:
      '**Opening Alignment**: "I completely agree that providing a deep-dive analytics panel would be highly valuable for power users long-term."\n\n**Buffer Statement**: "Looking over our current sprint commitments, our core infrastructure migration is absorbing 80% of design and backend resources through June."\n\n**Strategic Pivot**: "To ensure we don\'t delay the main release, let\'s log this granular tracking request as a Priority-1 fast-follow item for our Q4 planning cycle instead."',
    rating: 5,
    words: 95,
    score: {
      clarity: 94,
      guidance: 92,
      specificity: 96,
      overall: 94,
    },
    isFavourite: false,
  },
  {
    uid: "hist-008",
    date: "16 May 2026",
    persona: "Elite Strength & Conditioning Coach",
    context:
      "Client is a 45-year-old intermediate runner transitioning to marathon training who needs to maintain joint longevity.",
    task: "Design a core stabilization and lower-body strength routine for a non-running training day.",
    constraints:
      "Must be a bodyweight-only circuit that can be done at home in under 30 minutes without special equipment.",
    output:
      "A structured, step-by-step workout routine with specific intervals and recovery times.",
    prompt:
      "### Marathoner Stability Circuit (30 Mins)\n\n**Instructions:** Complete 3 total rounds of this circuit. Rest 60 seconds between rounds.\n\n*   **Exercise 1: Single-Leg Glute Bridges** — *45 seconds per side* (Focus on driving through the heel to protect the knee joints).\n*   **Exercise 2: Plank with Alternating Shoulder Taps** — *60 seconds total* (Keep hips perfectly parallel to the floor to lock in core engagement).\n*   **Exercise 3: Lateral Side-Lunges** — *45 seconds per side* (Strengthens hip abductors to prevent common runner IT-band friction issues).\n*   **Exercise 4: Bird-Dog Hold** — *60 seconds alternating* (Hold for 3 seconds at peak extension to stabilize the lower lumbar region).",
    rating: 5,
    words: 115,
    score: {
      clarity: 96,
      guidance: 94,
      specificity: 92,
      overall: 94,
    },
    isFavourite: false,
  },
  {
    uid: "hist-009",
    date: "14 May 2026",
    persona: "Professional Toastmaster & Speechwriter",
    context:
      "Writing a Maid of Honor speech for a childhood best friend's wedding. The tone should be warm, funny, and deeply affectionate.",
    task: "Draft an engaging 30-second opening hook that transitions smoothly from a funny childhood anecdote into welcoming the groom.",
    constraints:
      "Avoid inside jokes that the audience won't understand. Keep the delivery rhythm conversational.",
    output:
      "A spoken-word script with clear stage directions for pauses and emotional delivery cues.",
    prompt:
      "\"Good evening, everyone! *(Smile and pause for applause)* If you don't know me, I'm Sarah, and I've been best friends with Jessica since the 3rd grade—back when our biggest life crisis was deciding who got the pink Power Ranger lunchbox. *(Light chuckle)* Standing here today, seeing how radiant she looks, I realized something important: Jessica has always possessed an amazing ability to choose beautiful things. And *(turn to face the groom)*, Michael, seeing the way she looks at you tonight completely proves that her perfect streak is still unbroken. Welcome to the family, man!\"",
    rating: 5,
    words: 98,
    score: {
      clarity: 92,
      guidance: 95,
      specificity: 88,
      overall: 92,
    },
    isFavourite: true,
  },
  {
    uid: "hist-010",
    date: "11 May 2026",
    persona: "Michelin-Starred Executive Pastry Chef",
    context:
      "Developing a signature summer dessert menu for an upscale, farm-to-table bistro.",
    task: "Create a modern flavor profile matrix and component build for a classic fruit tart variation.",
    constraints:
      "Must incorporate an unexpected savory element or fresh herb, and feature an alternative grain crust option.",
    output:
      "A structured kitchen prep breakdown separating the base, filling, and final garnish concepts.",
    prompt:
      "### Deconstructed Summer Tart Profile\n\n*   **The Base:** A crisp, toasted Almond and Einkorn wheat shortbread crust, lightly salted to balance the upcoming sweetness.\n*   **The Filling:** A rich, velvety Honey-Lavender Pastry Cream. The lavender infusion must be faint—steeped in hot milk for no longer than 4 minutes to prevent a soapy aftertaste.\n*   **The Savior Element:** Fresh, macerated heritage strawberries tossed with micro-basil leaves and a 25-year aged balsamic reduction glaze right before plating.",
    rating: 4,
    words: 85,
    score: {
      clarity: 90,
      guidance: 88,
      specificity: 94,
      overall: 91,
    },
    isFavourite: false,
  },
];
