# StepOne — Adventure & Business Training for the CEO-Explorer

> **Turning micro-actions into 'delusional confidence' for the @packslight community.**

![StepOne Hero Banner](https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=1200&h=400)

StepOne is a high-energy mobile MVP designed for women who aspire to more. Whether it's solo travel, starting a business, or mastering a new craft, StepOne bridges the gap between dreaming and doing through a gamified, tactile, and deeply focused mobile experience.

---

## 📖 The Story

### The Inspiration
The concept for StepOne was born from a simple observation: **Confidence is a muscle built in the mundane.** 

The inspiration came from the "parking farther away" philosophy. If you want to walk more, you don't start with a marathon; you start by parking at the back of the lot. You build the habit of movement when no one is watching. StepOne takes this micro-habit approach and applies it to the biggest ambitions of the @packslight community.

### The Philosophy
- **Step 1 (Solo Discipline):** Private victories. Drinking the water, checking the gear, drafting the mission statement. These are the "Foundation" tasks that reset daily.
- **Step 2 (Social Missions):** Public evolution. The "Journey Path" takes you through a 30-day curriculum of increasing intensity, designed to prepare you for the real world—be it a Parisian cafe or a boardroom.

---

## 🛠 Technical Architecture

StepOne is built as a robust, scalable mobile MVP using a modern stack focused on performance and aesthetics.

- **Core Stack:** React (Mobile-First Web), TypeScript, Tailwind CSS.
- **Iconography:** Lucide-React SVG system for crisp, scalable visuals.
- **Animation:** Custom CSS keyframes for staggered "Stamp-in" effects and tactile "Open Book" transitions.

### Key Technical Features

#### 1. Dual-Path Task Logic
The application segregates logic between **Daily Micro-actions** (transient state that resets every 24 hours) and **30-day Journey Missions** (persistent, sequential progress). This is managed via a unified `UserState` tree and optimized `StorageService` for local persistence.

#### 2. Stay-on-App Focus Timer
To prevent "distraction jumping," the StepOne Focus Timer utilizes browser `visibilitychange` events (simulating React Native's `AppState`). If a user exits the app to check social media or messages during a deep-work mission, the session automatically resets with a tactile warning haptic, enforcing true presence.

#### 3. Tactile "Passport Book" UI
The UI is inspired by high-end physical journals. The `PassportView` features:
- A textured cream aesthetic (#FCF9F2).
- A staggered animation engine that slides stamps into place.
- A "center spine" layout to give the digital ledger a physical, heavy feel.

---

## 💎 RevenueCat Implementation

StepOne utilizes **RevenueCat** as the backbone of its growth and monetization strategy. The integration ensures that entitlements are synced seamlessly across devices and platforms.

### Entitlement Logic
- **`Purchases.getCustomerInfo()`**: StepOne queries entitlement status to unlock:
    - **Personalized Focus Switcher**: The ability to swap between Travel, Business, Health, and Hobby tracks.
    - **Advanced Journey Missions**: Days 8 through 30 are gated behind the "Pro Explorer" entitlement.
    - **Custom Vision Timers**: Unlimited flexibility in deep-work session lengths.

### Hybrid Monetization Model
StepOne offers a dynamic paywall that scales based on user ambition:
- **Monthly Subscription**: For the active traveler building consistency ($4.99/mo with a 14-day free trial).
- **Lifetime Legend**: A one-time purchase for the committed community member who wants permanent access to all current and future Roadmaps ($29.99).

---

## 🚀 Setup Instructions

Follow these steps to get the StepOne developer environment running locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/stepone.git
   cd stepone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your RevenueCat API keys:
   ```env
   REVENUECAT_API_KEY_IOS=your_ios_key_here
   REVENUECAT_API_KEY_ANDROID=your_android_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## 🤝 Contributors & License

- **Visionary & Lead Engineer:** [Your Name/Handle]
- **Community Inspiration:** [@packslight](https://instagram.com/packslight)

### License
This project is explicitly licensed under the **MIT License**.

---

*StepOne is not just an app; it's the first brick in the road to your evolution. Pack light, act now.*