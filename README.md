# AI Helper
### Chingu Voyage XP Presentation MVP

AI Helper is an interactive prompt-engineering workbench designed to help users bridge the gap between amateur text prompting and professional engineering outputs. By breaking down unstructured requests into a rigorous, segmented building-block structure, the application evaluates user inputs and diagnoses structural flaws to train better prompting habits.

---

## 🚀 The Core Features

### 🛠️ The Form Segmentation Architecture
Rather than relying on a single, overwhelming input box, AI Helper introduces an isolated structural form layout mapping to core prompt engineering disciplines:
*   **Persona:** Assigns expert roles, perspective, and domain specialization.
*   **Context:** Pinpoints the background scenario, target audience, and explicit operational intent.
*   **Task (The Core Objective):** Isolates the exact primary action utilizing strong, imperative action verbs.
*   **Output Format:** Dictates programmatic layout, markup, visual structure, or length caps.
*   **Constraints:** Establishes precise runtime boundaries and negative guardrails.

### 📊 Evaluation & Analysis Engine
*   **Dynamic Gap Detection:** Programmatically analyzes user inputs to flag missing constraints, ambiguous task phrases, or weak context blocks.
*   **Intelligent Follow-Ups:** Generates conversational suggestions, prompting the user on exactly what missing detail to provide next to maximize LLM response efficiency.

### 📈 Session & Telemetry Statistics
Monitors prompting progression with an operational dashboard tracking critical data points:
*   Total prompt combinations engineered and executed.
*   **Gemini API Success Rates:** Real-time logging of network request reliability and API response statuses.
*   Structural complete-rates per parameter segment.

### 🎭 Presentation "Demo Mode"
Built explicitly for evaluation and live showcase constraints, accessing the application via the query parameter `?demo=true` places the workbench into a deterministic, autonomous state. It drops safe, real-world fallback data into the pipeline—bypassing empty-state blockers to guarantee a flawless live presentation even under unstable network conditions.

---

## 🏗️ Technical Architecture & Ecosystem

The application leverages a modern, distributed architecture optimizing state boundaries and real-time responsiveness:

*   **Framework:** Next.js (App Router) utilizing Client-Side Rendering (CSR) optimized for high-frequency interactive state changes.
*   **UI Architecture:** Radix UI primitives via Shadcn, styled via Tailwind CSS utilizing a fluid Glassmorphic design layer (`backdrop-blur-md` and alpha-tinted border gradients) to emphasize visual depth and field focus.
*   **State Management:** Redux Toolkit orchestrating global cross-field analytics, user settings, and session-wide telemetry tracking.
*   **Form Management:** React Hook Form coupled with custom control loops to minimize input re-rendering lag across multi-line textareas.
*   **Backend & Analytics:** Firebase Firestore providing real-time synchronization, session persistence, and aggregate statistics logging.
*   **AI Integration:** Edge-optimized raw API communication routing natively into the **Google Gemini API** endpoints, bypassing external wrapper overhead.

---

## ⚙️ Environment Configuration

To run this project locally, ensure you configure a `.env.local` file in the root directory containing the following runtime variables:

```bash
# Core AI Orchestration
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Persistence & Telemetry Layer
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 👥 Chingu Voyage XP Team

### Product Owner
Chinedu Olekah: [GitHub](https://github.com/kenako1) / [LinkedIn](https://www.linkedin.com/in/chinedu-olekah)

### Scrum Master
Yangchen Dema (Scrum Master): [GitHub](https://github.com/dema66) / [LinkedIn](https://www.linkedin.com/in/yangchendema/)

### Backend Developer
Omar Ramos-Correa: [GitHub](https://github.com/oramos-correa) / [LinkedIn](https://www.linkedin.com/in/omar-ramos-correa-7621253b2)

### Frontend Developer(s)
Lilla Tóth - [GitHub](https://github.com/Lilla-ctrl) / [LinkedIn](https://www.linkedin.com/in/lillatoth216/) 
(Ivan Rebolledo /left the project during sprint 3/ - [GitHub](https://github.com/ivannissimrch) / [LinkedIn](https://www.linkedin.com/in/ivan-rebolledo-012b17244/))
