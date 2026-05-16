import { Prompt } from "@/types/history";

export const mockHistoryData: Prompt[] = [
  {
    uid: "prompt-1",
    date: "2026-05-15",
    task: "Draft a Product Launch Email Sequence",
    persona: "Expert SaaS Copywriter",
    context:
      "Launching a new AI-powered calendar app called 'Chronos' that automates scheduling based on energy levels.",
    constraints:
      "Keep under 200 words, use a casual yet authoritative tone, include 1 clear call to action.",
    prompt:
      "Act as an Expert SaaS Copywriter. Your task is to draft a product launch email sequence for a new AI-powered calendar app called 'Chronos' that automates scheduling based on energy levels. Constraints: Keep under 200 words, use a casual yet authoritative tone, include 1 clear call to action.",
    output:
      "Subject: Stop fighting your calendar.\n\nHey [Name],\n\nEver look at your calendar at 4 PM and want to cry? We get it. Standard calendars treat all hours the same. But your brain doesn't.\n\nMeet Chronos. It's the first AI calendar that learns your peak focus hours and automatically stacks your deep work when you have the energy for it, leaving the administrative fluff for your afternoon slump.\n\nReady to work with your biology instead of against it?\n\n[Claim your early access here]",
    rating: 5,
    words: 98,
    score: {
      clarity: 5,
      guidance: 4,
      specificity: 5,
      overall: 5,
    },
    isFavourite: true,
  },
  {
    uid: "prompt-2",
    date: "2026-05-12",
    task: "Generate SQL Schema for E-commerce Analytics",
    persona: "Senior Data Engineer",
    context:
      "Need a normalized schema to track user clicks, cart additions, and final purchases for a high-traffic retail site.",
    constraints:
      "Include foreign key relationships, indexing strategies for quick querying, and timestamp tracking.",
    prompt:
      "Act as a Senior Data Engineer. Your task is to generate an SQL schema for e-commerce analytics. Context: Need a normalized schema to track user clicks, cart additions, and final purchases. Constraints: Include foreign key relationships, indexing strategies, and timestamp tracking.",
    output:
      "CREATE TABLE users (\n  user_id UUID PRIMARY KEY,\n  email VARCHAR(255) UNIQUE NOT NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE events (\n  event_id BIGSERIAL PRIMARY KEY,\n  user_id UUID REFERENCES users(user_id),\n  event_type VARCHAR(50) NOT NULL, -- 'click', 'cart_add', 'purchase'\n  payload JSONB,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE INDEX idx_events_user_type ON events(user_id, event_type);",
    rating: 4,
    words: 64,
    score: {
      clarity: 4,
      guidance: 4,
      specificity: 4,
      overall: 4,
    },
    isFavourite: false,
  },
  {
    uid: "prompt-3",
    date: "2026-05-10",
    task: "Create a 15-Minute Home HIIT Workout",
    persona: "Certified Personal Trainer",
    context:
      "For a busy professional with no equipment who wants a high-intensity cardio burst in their living room.",
    constraints:
      "Bodyweight only, include modifications for low-impact, 45 seconds work, 15 seconds rest.",
    prompt:
      "Act as a Certified Personal Trainer. Your task is to create a 15-minute home HIIT workout. Context: For a busy professional with no equipment. Constraints: Bodyweight only, include low-impact modifications, 45s work, 15s rest.",
    output:
      "Circuit (Repeat 3 times):\n1. Jumping Jacks (Modification: Step jacks) - 45s work, 15s rest\n2. Bodyweight Squats (Modification: Shallow squats) - 45s work, 15s rest\n3. Mountain Climbers (Modification: Incline on a chair) - 45s work, 15s rest\n4. Push-ups (Modification: Knee push-ups) - 45s work, 15s rest\n5. Plank Hold (Modification: Forearm plank on knees) - 45s work, 15s rest",
    rating: 5,
    words: 112,
    score: {
      clarity: 5,
      guidance: 5,
      specificity: 4,
      overall: 5,
    },
    isFavourite: true,
  },
  {
    uid: "prompt-4",
    date: "2026-05-05",
    task: "Explain Quantum Computing to a 10-Year-Old",
    persona: "Patient Science Communicator",
    context:
      "Explaining how qubits differ from normal bits without using complex mathematical notation.",
    constraints: "Use a coin or spinning analogy, no jargon, max 3 paragraphs.",
    prompt:
      "Act as a Patient Science Communicator. Your task is to explain quantum computing to a 10-year-old. Context: Explaining qubits vs bits without math. Constraints: Use a coin analogy, no jargon, max 3 paragraphs.",
    output:
      "Imagine a regular computer uses light switches that can only be turned ON (1) or OFF (0). Everything your computer does is just flipping millions of those switches.\n\nA quantum computer uses things called 'qubits' which act like spinning coins. While a coin is spinning on a table, is it heads or tails? It's actually a secret blur of both at the exact same time! \n\nBecause these qubits can be both 0 and 1 at once, quantum computers can look at thousands of answers all at the same time to solve super complex puzzles that would take a normal computer years to figure out.",
    rating: 3,
    words: 134,
    score: {
      clarity: 3,
      guidance: 4,
      specificity: 3,
      overall: 3,
    },
    isFavourite: false,
  },
  {
    uid: "prompt-5",
    date: "2026-04-28",
    task: "Optimize Landing Page Hero Text",
    persona: "Conversion Rate Optimization Expert",
    context:
      "A B2B platform that provides automated expense auditing for small accounting firms.",
    constraints:
      "Focus on pain points, write 3 distinct variations (emotional, direct, creative).",
    prompt:
      "Act as a Conversion Rate Optimization Expert. Your task is to optimize landing page hero text. Context: B2B platform providing automated expense auditing for small accounting firms. Constraints: Focus on pain points, write 3 variations.",
    output:
      "Variation 1 (Direct):\nStop auditing client receipts by hand. Automate your B2B expense workflows in 60 seconds.\n\nVariation 2 (Emotional):\nGet your weekends back. Let AI handle the tedious expense auditing your team hates.\n\nVariation 3 (Creative):\nThe accounting assistant that never sleeps, never misses a duplicate receipt, and costs less than coffee.",
    rating: 4,
    words: 78,
    score: {
      clarity: 4,
      guidance: 3,
      specificity: 5,
      overall: 4,
    },
    isFavourite: false,
  },
];
