# Product Brainstorming: AI, content & Math

**Date:** 2026-01-30
**Topic:** Next Phase Features (AI, Content, Math)
**Context:** Turning FlashCard Kids into a comprehensive AI-powered learning platform.

## 1. Applying AI Capabilities (How to use AI better?)

### Approaches
*   **Approach A: AI Content Generator (The "Creator")**
    *   **Concept:** AI generates decks, stories, and quizzes on demand.
    *   **Pros:** Infinite content, personalized to child's interests (e.g., "Dinosaurs learning Math").
    *   **Cons:** Quality control needed; potential hallucinations.
*   **Approach B: AI Tutor COMPANION (The "Buddy")**
    *   **Concept:** A voice-enabled character (e.g., "Audrey the Owl") that talks to the child, encourages them, and corrects pronunciation.
    *   **Pros:** High engagement, emotional connection.
    *   **Cons:** Higher latency/cost (Voice AI), requires microphone permissions.
*   **Approach C: Adaptive Learning Engine (The "Brain")**
    *   **Concept:** AI analyzes mistakes and schedules reviews (Spaced Repetition + Weakness targeting).
    *   **Pros:** Efficient learning, invisible to user.
    *   **Cons:** Less "flashy" than a talking avatar.

**Recommendation:** Start with **Approach A (Content)** for immediate value, then add **Approach C (Adaptive)**.

---

## 2. Flashcard Generation & Image Sourcing

### The Challenge
We need high-quality images for thousands of potential words.

### Image Sources
1.  **Unsplash/Pexels API (Current)**:
    *   *Pros:* Free, high quality, fast.
    *   *Cons:* Limited vocabulary (abstract concepts or specific items might be missing).
2.  **AI Generation (DALL-E 3 / Midjourney)**:
    *   *Pros:* Can generate ANYTHING (e.g., "A happy apple eating a banana"). Consistent style.
    *   *Cons:* Cost per image ($0.04 - $0.08), slower generation time (5-10s).
3.  **Search & Screenshot (The "Fallback")**:
    *   *Concept:* Use a headless browser (Puppeteer) to search Google Images/Bing, capture the results grid or a specific image result, and take a screenshot.
    *   *Pros:* visual verification of "what google thinks this is".
    *   *Cons:* Copyright issues, messy UI elements in screenshots, low resolution sometimes.

### Proposed Workflow
1.  **Step 1:** Check **Unsplash** (Fast & Free).
2.  **Step 2:** If no result, call **DALL-E 3** (High Quality Fallback).
3.  **Step 3:** (Optional) **"Screenshot Mode"**: If user provides a specific URL (e.g., YouTube video or specific website), we screenshot that as the card image.

---

## 3. Math Learning Feature

### Approaches
*   **A. Gamified Counting (Pre-K)**
    *   *Mechanic:* "Count the Apples". Drag 5 apples into the basket.
    *   *Visuals:* Heavy use of stickers/emojis.
*   **B. Visual Arithmetic (K-1)**
    *   *Mechanic:* 🍎 + 🍎 = ? Show visual equations.
    *   *AI Integration:* Generate word problems: "If Iron Man has 2 suits and builds 1 more..."
*   **C. Speed Drills (Grades 1-3)**
    *   *Mechanic:* Fast-paced 1+1, 2x2. "Beat the clock".

**Recommendation:** Start with **A & B** mixed. Use AI to generate the "objects" (e.g., user likes Cats -> Count Cats).

---

## Discussion Questions

1.  **AI**: Do you prefer the **"Content Creator"** (infinite decks) or **"Tutor"** (voice companion) direction first?
2.  **Images**: For the "Screenshot" fallback, did you mean **crawling search results** automatically, or allowing users to **paste a URL** to capture?
3.  **Math**: Should we focus on **Counting/Visuals** (younger kids) or **Arithmetic/Drills** (school age)?
