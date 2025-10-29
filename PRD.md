# Product Requirements Document (PRD)
## LeetCode Pomodoro Learning Companion

---

## 1. Product Overview

### 1.1 Product Name
LeetCode Pomodoro Learning Companion

### 1.2 Purpose
A Pomodoro timer designed specifically for LeetCode grinders that helps users:
- Stay focused during coding sessions
- Document their learning process with notes
- Record visual explanations of solutions
- Build a personal library of solved problems

### 1.3 Target Users
- College students preparing for technical interviews
- Self-taught developers learning data structures & algorithms
- Anyone grinding LeetCode who wants to retain what they learn

### 1.4 Core Value Proposition
Unlike basic Pomodoro timers, this tool captures your learning journey by combining time management with note-taking and visual explanations, creating a searchable knowledge base of your problem-solving process.

---

## 2. User Stories

**As a LeetCode user, I want to:**
1. Start a focused 25-minute work session on a specific problem
2. Take notes while working to capture my thought process
3. Mark when I've successfully solved a problem
4. Record myself explaining the solution with drawings
5. Review all my solved problems and their explanations later
6. See my productivity stats (problems solved, time spent)

---

## 3. Features & Requirements

### 3.1 Pomodoro Timer (Core)

**Functional Requirements:**
- 25-minute work sessions
- 5-minute short breaks
- 15-minute long break after 4 work sessions
- Start/Pause/Reset controls
- Visual countdown display
- Audio notification when timer ends
- Session counter (1/4, 2/4, etc.)

**User Flow:**
```
Timer at 25:00 → User clicks Start → Countdown begins
→ Reaches 0:00 → Notification sound → Prompt appears
```

---

### 3.2 Problem Entry

**Functional Requirements:**
- Text input for problem name/title
- Dropdown for difficulty (Easy/Medium/Hard)
- "Start Session" button to begin timer
- Problem name displayed during session

**User Flow:**
```
Click "New Session" → Enter "Two Sum" 
→ Select "Easy" → Click Start → Timer begins
```

**UI Mockup:**
```
┌─────────────────────────────────┐
│  Start New Session              │
├─────────────────────────────────┤
│  Problem Name:                  │
│  [Two Sum____________]          │
│                                 │
│  Difficulty:                    │
│  [Easy ▼] Medium  Hard          │
│                                 │
│  [Start Session]                │
└─────────────────────────────────┘
```

---

### 3.3 Text Notes (Side Panel)

**Functional Requirements:**
- Side panel visible during timer
- Text area for taking notes
- Auto-save notes every 30 seconds
- Notes persist if timer is paused/reset
- Notes visible when problem is "not solved" and timer restarts

**User Flow:**
```
Timer running → User types in notes panel
→ Notes auto-save → Timer ends → Notes preserved
```

**UI Layout:**
```
┌───────────┬────────────────────────┐
│  Timer    │   Notes                │
│  24:32    │   ┌──────────────────┐ │
│           │   │ - Tried brute    │ │
│  Two Sum  │   │   force O(n²)    │ │
│  (Easy)   │   │ - Hash map idea  │ │
│           │   │   O(n) time      │ │
│  [Pause]  │   └──────────────────┘ │
│  [Reset]  │                        │
└───────────┴────────────────────────┘
```

---

### 3.4 Problem Completion Flow

**Functional Requirements:**
- When timer ends, prompt: "Did you solve it?"
- Two options: "Yes" or "No, keep working"
- If "No" → 5-min break → timer restarts on same problem
- If "Yes" → Navigate to explanation recording screen

**User Flow:**
```
Timer ends at 0:00 → Notification
→ Modal appears: "Did you solve Two Sum?"
   ├─ [No, keep working] → 5-min break → Restart 25-min timer
   └─ [Yes, I solved it!] → Recording screen
```

**UI Mockup:**
```
┌─────────────────────────────────┐
│  ⏰ Time's Up!                  │
├─────────────────────────────────┤
│  Did you solve Two Sum?         │
│                                 │
│  [No, keep working]             │
│  [Yes, I solved it! 🎉]        │
└─────────────────────────────────┘
```

---

### 3.5 Video Explanation (Drawing + Audio)

**Functional Requirements:**
- Simple drawing canvas (mouse/touchpad only)
- Tools: Pen (multiple colors), Eraser
- Pen size adjustment (small/medium/large)
- Record audio from microphone simultaneously
- Real-time canvas + audio capture using MediaRecorder API
- Record/Stop/Replay controls
- Export as WebM/MP4 video
- Option to skip recording

**Technical Implementation:**
- `canvas.captureStream()` - Capture canvas drawing
- `MediaRecorder API` - Record canvas stream + audio
- Combine into single video file
- Upload to Firebase Storage

**User Flow:**
```
User clicks "Yes, I solved it!"
→ Prompt: "Record explanation?"
   ├─ [Skip] → Save text notes only
   └─ [Record] → Drawing canvas appears
                 → User draws & talks
                 → Click "Stop Recording"
                 → Preview video
                 → [Save] or [Re-record]
                 → Upload to Firebase
```

**UI Mockup:**
```
┌─────────────────────────────────────┐
│  Explain Your Solution              │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │     Drawing Canvas            │  │
│  │     (User draws here)         │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│  Tools: [Pen] [Eraser]              │
│  Colors: ⚫ 🔴 🔵 🟢                │
│  Size: ○ ◉ ●                        │
│                                     │
│  🎤 Recording... 0:45                │
│  [Stop Recording]                   │
│                                     │
│  Or [Skip Recording]                │
└─────────────────────────────────────┘
```

---

### 3.6 Problem Library

**Functional Requirements:**
- List all solved problems
- Display: Problem name, difficulty, date solved
- Click problem → expand to show details:
  - Text notes
  - Video explanation (if exists)
  - Date solved
- Search/filter by:
  - Problem name
  - Difficulty
  - Date range
- Sort by: Recent, Difficulty, Name

**User Flow:**
```
Navigate to "My Problems" page
→ See list of problems
→ Click "Two Sum" → Expands/navigates
→ Shows notes + video player
```

**UI Mockup:**
```
┌────────────────────────────────────┐
│  My Solved Problems (24)           │
│  [Search...] [Filter ▼] [Sort ▼]  │
├────────────────────────────────────┤
│  🟢 Two Sum (Easy)                 │
│     Oct 28, 2025 • 2 sessions      │
│     [View Details] ▼               │
│     ┌──────────────────────────┐   │
│     │ Notes:                   │   │
│     │ Used hash map for O(n)   │   │
│     │                          │   │
│     │ 📹 Video Explanation:    │   │
│     │ [▶ Play Video]           │   │
│     └──────────────────────────┘   │
├────────────────────────────────────┤
│  🟡 3Sum (Medium)                  │
│     Oct 27, 2025 • 5 sessions      │
│     [View Details] ►               │
├────────────────────────────────────┤
│  🔴 LRU Cache (Hard)               │
│     Oct 25, 2025 • 8 sessions      │
│     [View Details] ►               │
└────────────────────────────────────┘
```

---

### 3.7 Statistics Dashboard

**Functional Requirements:**
- Total problems solved (count)
- Total study time (hours)
- Current streak (consecutive days)
- Breakdown by difficulty (Easy/Medium/Hard)
- Average sessions per problem
- Calendar heatmap (GitHub-style)

**UI Mockup:**
```
┌────────────────────────────────────┐
│  Your Stats                        │
├────────────────────────────────────┤
│  📊 Total Problems: 24             │
│  ⏱️  Total Time: 32h 15m           │
│  🔥 Current Streak: 7 days         │
│                                    │
│  By Difficulty:                    │
│  🟢 Easy: 12  🟡 Medium: 10        │
│  🔴 Hard: 2                        │
│                                    │
│  📅 Activity:                      │
│  [GitHub-style calendar heatmap]   │
└────────────────────────────────────┘
```

---

## 4. Technical Architecture

### 4.1 Tech Stack

**Frontend:**
- React 18+
- Vite (build tool)
- Tailwind CSS (styling)
- `react-canvas-draw` or `react-sketch-canvas` (drawing)
- `MediaRecorder API` (recording)
- React Router (navigation)

**Backend/Storage:**
- Firebase
  - Firestore (problem data, notes, metadata)
  - Firebase Storage (video files)
  - Anonymous Authentication (no login required for MVP)

**Libraries:**
- `date-fns` (date formatting)
- `recharts` or `react-chartjs-2` (statistics charts)
- `react-calendar-heatmap` (activity calendar)

---

### 4.2 Data Models

**Firestore Collections:**

**`problems` collection:**
```javascript
{
  id: "auto-generated-id",
  userId: "anonymous-user-id",
  problemName: "Two Sum",
  difficulty: "Easy",
  textNotes: "Used hash map for O(n) solution...",
  videoUrl: "https://firebasestorage.../video.webm",
  dateStarted: Timestamp,
  dateSolved: Timestamp,
  sessionsCount: 2,
  totalTimeSpent: 3000, // seconds
  createdAt: Timestamp
}
```

**`sessions` collection (for stats):**
```javascript
{
  id: "auto-generated-id",
  userId: "anonymous-user-id",
  problemId: "ref-to-problem",
  date: Timestamp,
  duration: 1500, // 25 min in seconds
  completed: false
}
```

---

### 4.3 Firebase Storage Structure

```
videos/
└── {userId}/
    └── {problemId}/
        └── explanation.webm
```

---

## 5. User Flows

### 5.1 Complete Session Flow

```
START
  ↓
[Home Page]
  ↓
Click "Start New Session"
  ↓
[Enter Problem Name + Difficulty]
  ↓
Click "Start"
  ↓
[Timer Screen - 25:00]
  ├─ Side panel: Text notes
  ├─ User can pause/resume
  ↓
Timer reaches 0:00
  ↓
[Prompt: "Did you solve it?"]
  ├─ NO → [5-min break] → Restart timer (same problem)
  └─ YES ↓
         [Prompt: "Record explanation?"]
           ├─ SKIP → Save notes → Library
           └─ RECORD ↓
                     [Drawing Canvas + Audio]
                       ↓
                     Draw & explain
                       ↓
                     Click "Stop"
                       ↓
                     [Preview Video]
                       ↓
                     Click "Save"
                       ↓
                     Upload to Firebase
                       ↓
                     [Success! Added to library]
                       ↓
                     [Library Page]
END
```

---

## 6. Success Metrics

**Primary Metrics:**
- Daily active usage (do YOU use it every day?)
- Problems solved per week
- Average session completion rate

**Secondary Metrics:**
- Video recording usage rate (% of problems with videos)
- Average notes length (engagement with note-taking)
- Return usage (do you come back to review old problems?)

**Portfolio Metrics:**
- GitHub stars
- Positive feedback from peers
- Recruiter interest

---

## 7. Timeline & Milestones

### Phase 1: Core Timer + Notes (Week 1)
- ✅ Basic Pomodoro timer (25/5/15 min)
- ✅ Problem entry form
- ✅ Text notes side panel
- ✅ Firebase setup (Firestore)
- ✅ Save problems + notes to Firebase
- **Deliverable:** Working timer with note-taking

### Phase 2: Problem Library (Week 2)
- ✅ Library page UI
- ✅ Display all solved problems
- ✅ Click to view details
- ✅ Search/filter functionality
- ✅ Statistics dashboard (basic)
- **Deliverable:** Full CRUD for problems

### Phase 3: Video Recording (Week 3)
- ✅ Drawing canvas implementation
- ✅ Audio recording (MediaRecorder)
- ✅ Combine canvas + audio
- ✅ Upload to Firebase Storage
- ✅ Video player in library
- **Deliverable:** Full MVP with video explanations

### Phase 4: Polish (Week 4 - Optional)
- ✅ Animations & transitions
- ✅ Responsive design (mobile)
- ✅ Dark mode
- ✅ Keyboard shortcuts
- ✅ Export/share features
- **Deliverable:** Production-ready app

---

## 8. Out of Scope (Future Features)

**Not in MVP, but possible later:**
- ❌ User accounts (email/password login)
- ❌ LeetCode API integration (auto-fetch problems)
- ❌ Collaboration features (share explanations)
- ❌ AI feedback on explanations
- ❌ Mobile app (iOS/Android)
- ❌ Browser extension
- ❌ Spotify integration (study music)
- ❌ Leaderboards

---

## 9. Technical Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Canvas + audio sync | Use `canvas.captureStream()` + `MediaRecorder` with same timestamp |
| Large video file sizes | Compress videos, use WebM format, set quality limits |
| Firebase storage costs | Free tier = 5GB, should be enough for MVP. Monitor usage |
| Drawing UX on laptop | Provide smooth pen tool, test on different devices |
| Timer accuracy | Use `setInterval` with drift correction |

---

## 10. Design Principles

### 1. Simplicity First
- Clean, minimal UI
- No feature bloat
- Easy to understand in 30 seconds

### 2. LeetCode Aesthetic
- Green/orange color scheme
- Monospace fonts for code feel
- Dark mode friendly

### 3. No Friction
- No login required (MVP)
- Auto-save everything
- Fast load times

### 4. Learning-Focused
- Encourage reflection (notes + video)
- Make reviewing easy (good search/filter)
- Track progress visually

---

## 11. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Too complex for 3 weeks | Cut video feature if needed, keep text notes |
| Video recording doesn't work on all browsers | Test early, provide fallback (just notes) |
| Firebase costs exceed free tier | Monitor usage, add limits |
| Drawing canvas too hard to implement | Use existing library, keep it simple |
| Lose motivation mid-project | Build in phases, each phase is usable |

---

## 12. PRD Sign-off

**Product Owner:** You  
**Developer:** You  
**Timeline:** 3-4 weeks  
**Start Date:** TBD  

---

**Version:** 1.0  
**Last Updated:** October 29, 2025
