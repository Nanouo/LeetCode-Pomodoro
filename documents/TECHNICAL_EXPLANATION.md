# LeetCode Pomodoro Timer - Technical Explanation

## 🎯 High-Level Overview

I built a full-stack React application that combines the Pomodoro study technique with LeetCode problem tracking. It helps developers prepare for technical interviews by managing focused 25-minute study sessions while documenting their problem-solving process.

---

## 1. Tech Stack & Architecture

### Frontend Framework
- **React 19 + TypeScript** - Type-safe component-based UI
- **Vite 7** - Fast build tool and dev server
- **Tailwind CSS v4** - Utility-first styling with custom LeetCode color scheme

### Routing
- **React Router v6** - Client-side routing with three main pages:
  - `/` - Home/Timer page
  - `/library` - Problem library with search/filter
  - `/stats` - Statistics dashboard

### Data Persistence
- **localStorage** - Browser-based storage (no backend needed)
- Stores problems as JSON with automatic serialization/deserialization
- Data persists across browser sessions
- Scalable to Firebase Firestore in the future

---

## 2. Data Structures & State Management

### Core Data Models (TypeScript Interfaces)

```typescript
// Problem entity - stored in localStorage
interface Problem {
  id: string;                    // Unique identifier
  problemName: string;           // e.g., "Two Sum"
  difficulty: 'Easy' | 'Medium' | 'Hard';
  textNotes: string;             // User's notes
  dateStarted: Date;
  dateSolved?: Date;
  sessionsCount: number;         // Number of 25-min sessions
  totalTimeSpent: number;        // In seconds
  createdAt: Date;
}
```

### Storage Implementation

**Data Structure:** Array of Problem objects stored as JSON string in localStorage

**Location:** `src/utils/problemStorage.ts`

```typescript
const STORAGE_KEY = 'leetcode-pomodoro-problems';

// Get all problems - returns Array<Problem>
function getProblemsLocal(): Problem[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Save problem - O(n) operation
function saveProblemLocal(problem: Problem): void {
  const problems = getProblemsLocal();  // Get existing array
  problems.push(problem);                // Add new problem
  localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
}

// Delete problem - O(n) operation with filter
function deleteProblemLocal(problemId: string): void {
  const problems = getProblemsLocal();
  const filtered = problems.filter(p => p.id !== problemId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

// Update problem - O(n) operation
function updateProblemLocal(problemId: string, updates: Partial<Problem>): void {
  const problems = getProblemsLocal();
  const index = problems.findIndex(p => p.id === problemId);
  
  if (index !== -1) {
    problems[index] = { ...problems[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
  }
}
```

**Why this approach?**
- ✅ Simple and works offline (no API calls)
- ✅ Fast reads for small datasets (<1000 problems)
- ✅ No backend required for MVP
- ✅ Structured for easy migration to Firebase Firestore

---

## 3. Core Features & Implementation

### A. Pomodoro Timer (Custom React Hook)

**File:** `src/hooks/useTimer.ts`

**Pattern:** Custom Hook with useState + useEffect for timer logic

```typescript
function useTimer(onTimerComplete?: () => void) {
  const [timeRemaining, setTimeRemaining] = useState(WORK_TIME); // 1500 seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [sessionCount, setSessionCount] = useState(0);

  // Core timer logic - useEffect with setInterval
  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return;
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          onTimerComplete?.();  // Callback when timer ends
          return 0;
        }
        return prev - 1;
      });
    }, 1000);  // Tick every second

    return () => clearInterval(interval);  // Cleanup to prevent memory leaks
  }, [isRunning, timeRemaining, onTimerComplete]);

  // Return controls and state
  return {
    timeRemaining,
    isRunning,
    mode,
    sessionCount,
    startTimer: () => setIsRunning(true),
    pauseTimer: () => setIsRunning(false),
    resetTimer: () => { setTimeRemaining(WORK_TIME); setIsRunning(false); },
    skipTimer: () => { setTimeRemaining(0); setIsRunning(false); }
  };
}
```

**Key Concepts:**
- **State management** with React hooks (useState)
- **setInterval** for countdown with 1-second precision
- **Callback pattern** for component communication
- **Cleanup function** to prevent memory leaks when component unmounts

---

### B. Problem Lifecycle Flow

**1. Start Session**

```typescript
const handleStartSession = (problemName: string, difficulty: Difficulty) => {
  setCurrentProblem({ name: problemName, difficulty });
  setSessionStartTime(new Date());  // Track when started
  setSessionCount(1);
  setSessionStarted(true);
  
  // Load saved notes from localStorage if they exist
  const savedNotes = localStorage.getItem(`notes-${problemName}`);
  setNotes(savedNotes || '');
};
```

**2. Timer Completes**

```typescript
const handleTimerComplete = () => {
  playNotificationSound();  // Web Audio API beep
  setShowCompletionModal(true);  // Show "Did you solve it?" modal
};
```

**3. Problem Solved - Data Creation**

```typescript
const handleSolved = () => {
  if (!currentProblem || !sessionStartTime) return;
  
  // Create problem object
  const problem: Problem = {
    id: generateProblemId(),  // Unique ID: `problem_${timestamp}_${random}`
    problemName: currentProblem.name,
    difficulty: currentProblem.difficulty,
    textNotes: notes,
    dateStarted: sessionStartTime,
    dateSolved: new Date(),
    sessionsCount: sessionCount,
    totalTimeSpent: sessionCount * 1500,  // 25 min per session in seconds
    createdAt: new Date(),
  };
  
  // Persist to localStorage
  saveProblemLocal(problem);
  
  // Cleanup temporary saved notes
  localStorage.removeItem(`notes-${currentProblem.name}`);
  
  // Reset state
  setSessionStarted(false);
  setCurrentProblem(null);
  setNotes('');
  setSessionStartTime(null);
  setSessionCount(1);
};
```

**4. Keep Working - Continue Session**

```typescript
const handleKeepWorking = () => {
  setShowCompletionModal(false);
  setSessionCount(prev => prev + 1);  // Increment session counter
  // Timer resets automatically
};
```

---

### C. Library Page - Search, Filter, Sort

**File:** `src/pages/LibraryPage.tsx`

**Algorithm:** Client-side filtering with Array methods

```typescript
const filterAndSortProblems = () => {
  let filtered = [...problems];  // Shallow copy to avoid mutation

  // 1. Search filter - O(n × m) where m = average string length
  if (searchQuery) {
    filtered = filtered.filter(p =>
      p.problemName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // 2. Difficulty filter - O(n)
  if (difficultyFilter !== 'All') {
    filtered = filtered.filter(p => p.difficulty === difficultyFilter);
  }

  // 3. Sort - O(n log n) with Array.sort()
  if (sortBy === 'recent') {
    filtered.sort((a, b) => {
      const dateA = a.dateSolved ? new Date(a.dateSolved).getTime() : 0;
      const dateB = b.dateSolved ? new Date(b.dateSolved).getTime() : 0;
      return dateB - dateA;  // Descending (most recent first)
    });
  } else {
    filtered.sort((a, b) => a.problemName.localeCompare(b.problemName));
  }

  setFilteredProblems(filtered);
};
```

**Time Complexity:**
- Search: O(n × m) where m = average string length
- Filter: O(n)
- Sort: O(n log n)
- **Overall: O(n log n)** for combined operations

**UI Pattern:** Accordion/Expandable cards
- Click to expand → show detailed notes, metadata, delete button
- Lazy rendering - only expanded card shows full content
- Smooth animations with Tailwind transitions

---

### D. Statistics Dashboard

**File:** `src/pages/StatsPage.tsx`

**Aggregation Logic:**

```typescript
// Total problems - simple array length - O(1)
const totalProblems = problems.length;

// Total time - reduce operation - O(n)
const totalTimeSeconds = problems.reduce((sum, p) => sum + p.totalTimeSpent, 0);
const totalHours = Math.floor(totalTimeSeconds / 3600);
const totalMinutes = Math.floor((totalTimeSeconds % 3600) / 60);

// Difficulty breakdown - filter O(n) for each difficulty
const easyCount = problems.filter(p => p.difficulty === 'Easy').length;
const mediumCount = problems.filter(p => p.difficulty === 'Medium').length;
const hardCount = problems.filter(p => p.difficulty === 'Hard').length;

// Average sessions - O(n) reduce + division
const totalSessions = problems.reduce((sum, p) => sum + p.sessionsCount, 0);
const avgSessionsPerProblem = totalProblems > 0 
  ? (totalSessions / totalProblems).toFixed(1) 
  : '0';
```

**Streak Calculation Algorithm:**

```typescript
const calculateStreak = (): number => {
  if (problems.length === 0) return 0;

  // 1. Extract and normalize dates to midnight (remove time component)
  const sortedDates = problems
    .map(p => p.dateSolved ? new Date(p.dateSolved) : null)
    .filter((date): date is Date => date !== null)
    .map(date => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);  // Normalize to start of day
      return d.getTime();
    })
    .sort((a, b) => b - a);  // Sort descending (recent first)

  // 2. Remove duplicates - Set data structure O(n)
  const uniqueDates = Array.from(new Set(sortedDates));
  
  if (uniqueDates.length === 0) return 0;

  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;

  // Check if most recent is today or yesterday
  const mostRecent = uniqueDates[0];
  if (mostRecent !== todayTime && mostRecent !== todayTime - oneDayMs) {
    return 0; // Streak broken
  }

  // 3. Count consecutive days - O(n)
  for (let i = 1; i < uniqueDates.length; i++) {
    const diff = uniqueDates[i - 1] - uniqueDates[i];
    if (diff === oneDayMs) {
      streak++;  // Consecutive day found
    } else {
      break;  // Streak broken
    }
  }

  return streak;
};
```

**Data Structure Used:** 
- **Set** for duplicate removal (O(n) average)
- **Array** for sorted date storage
- **Timestamp comparison** for consecutive day detection

**Time Complexity:** O(n log n) due to sorting

---

## 4. Key Design Patterns

### Component Architecture

**Container/Presentational Pattern:**
- **Pages** (HomePage, LibraryPage, StatsPage) = Smart containers with state
- **Components** (Timer, ProblemForm, NotesPanel) = Presentational, receive props

**Example:**
```
HomePage (Container)
├── ProblemForm (Presentational)
├── Timer (Presentational)
└── NotesPanel (Presentational)
```

### State Management

- **Local Component State** (useState) for UI state
- **Custom Hooks** (useTimer) for shared logic
- **localStorage as Single Source of Truth** for persistent data
- **Props drilling** for data flow (can upgrade to Context API if needed)

### Side Effects (useEffect)

```typescript
// Auto-save notes every 30 seconds
useEffect(() => {
  if (currentProblem && notes) {
    const saveTimer = setInterval(() => {
      localStorage.setItem(`notes-${currentProblem.name}`, notes);
      console.log('Notes auto-saved to localStorage');
    }, 30000); // 30 seconds

    return () => clearInterval(saveTimer);  // Cleanup
  }
}, [currentProblem, notes]);

// Load problems on component mount
useEffect(() => {
  const loadedProblems = getProblemsLocal();
  setProblems(loadedProblems);
}, []);  // Empty dependency array = run once on mount
```

---

## 5. Audio Notifications

**File:** `src/utils/audio.ts`

**Web Audio API Implementation:**

```typescript
function playNotificationSound() {
  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;  // 800 Hz beep frequency
  oscillator.type = 'sine';           // Sine wave for smooth tone
  gainNode.gain.value = 0.3;          // Volume (0.0 to 1.0)

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.2);  // 200ms beep duration
}
```

**Why Web Audio API?**
- ✅ No audio files needed
- ✅ Works offline
- ✅ Cross-browser support
- ✅ Lightweight and fast

---

## 6. Performance Optimizations

### Current Optimizations

1. **Lazy Loading:** Only expanded library items render full content
2. **Shallow Copying:** Use spread operator `[...problems]` instead of deep clones
3. **Conditional Rendering:** Components only render when needed
4. **setInterval Cleanup:** Prevent memory leaks with cleanup functions

### Future Optimization Opportunities

```typescript
// Memoization for expensive filtering
const filteredProblems = useMemo(() => {
  return filterAndSortProblems(problems, searchQuery, difficultyFilter, sortBy);
}, [problems, searchQuery, difficultyFilter, sortBy]);

// Debouncing for search input
const debouncedSearch = useDebounce(searchQuery, 300);

// Virtual scrolling for large lists (1000+ problems)
import { FixedSizeList } from 'react-window';
```

### Storage Limits
- **localStorage:** ~5-10MB per domain
- **Supports:** 1000+ problems (avg ~1KB per problem)
- **Fallback:** Can add compression or migrate to IndexedDB

---

## 7. Scalability & Future Enhancements

### Current Architecture (Phase 2)
```
User → React App → localStorage → Browser Storage
```

### Future Architecture (Phase 3+)
```
User → React App → Firebase SDK → Cloud Firestore
                                 → Firebase Storage (videos)
```

### Migration Path to Firebase

**Already Prepared:**
- `src/utils/firebase.ts` - Firebase initialization
- `src/utils/firestore.ts` - Firestore operations (ready to use)
- Data structure designed as documents (matches Firestore model)

**Firestore Implementation:**
```typescript
// Save to Firestore (same interface as localStorage)
async function saveProblemFirestore(problem: Problem): Promise<void> {
  const docRef = await addDoc(collection(db, 'problems'), {
    ...problem,
    userId: auth.currentUser?.uid || 'anonymous',
    dateStarted: Timestamp.fromDate(problem.dateStarted),
    dateSolved: problem.dateSolved ? Timestamp.fromDate(problem.dateSolved) : null,
    createdAt: Timestamp.fromDate(problem.createdAt)
  });
  console.log('Saved to Firestore:', docRef.id);
}

// Real-time listener for library
onSnapshot(collection(db, 'problems'), (snapshot) => {
  const problems = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  setProblems(problems);
});
```

### Phase 3 Features (Per PRD)

1. **Canvas Recording:**
   - Drawing canvas with pen/eraser tools
   - MediaRecorder API to capture canvas stream + audio
   - Export as WebM/MP4 video

2. **Video Storage:**
   - Upload to Firebase Storage
   - Play back in Library page
   - Thumbnail generation

3. **Enhanced Statistics:**
   - GitHub-style activity heatmap
   - Time-series charts (problems per week)
   - Difficulty progression tracking

---

## 8. Project Structure

```
LeetCode-Pomodoro/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Timer/           # Timer display + controls
│   │   ├── ProblemForm/     # Problem entry form
│   │   ├── Notes/           # Notes panel
│   │   ├── CompletionModal/ # "Did you solve it?" modal
│   │   └── Header/          # Navigation header
│   ├── pages/               # Route pages
│   │   ├── HomePage.tsx     # Timer + problem entry
│   │   ├── LibraryPage.tsx  # Problem library
│   │   └── StatsPage.tsx    # Statistics dashboard
│   ├── hooks/               # Custom React hooks
│   │   └── useTimer.ts      # Timer logic
│   ├── utils/               # Utility functions
│   │   ├── problemStorage.ts # localStorage CRUD
│   │   ├── audio.ts          # Web Audio API
│   │   ├── constants.ts      # App constants
│   │   ├── firebase.ts       # Firebase config (future)
│   │   └── firestore.ts      # Firestore operations (future)
│   ├── types/               # TypeScript interfaces
│   │   └── index.ts         # Problem, Session, TimerState
│   ├── App.tsx              # Router setup
│   ├── main.tsx             # React entry point
│   └── style.css            # Global styles
├── documents/               # Documentation
│   ├── PRD.md               # Product requirements
│   ├── README.md            # Setup instructions
│   └── TECHNICAL_EXPLANATION.md # This file
└── package.json             # Dependencies
```

---

## 9. How to Explain in an Interview

### Elevator Pitch (30 seconds)

*"I built a React TypeScript app that helps developers prepare for coding interviews using the Pomodoro technique. It tracks 25-minute focused study sessions on LeetCode problems, captures notes, and provides analytics on progress. The app uses localStorage for data persistence, custom React hooks for the timer logic, and React Router for multi-page navigation."*

### Technical Deep Dive (2-3 minutes)

**"Let me walk you through the architecture:**

1. **Data Management:** I designed a `Problem` entity with TypeScript interfaces and implemented CRUD operations using localStorage, structured as a JSON array. The storage layer is abstracted so it can easily migrate to Firestore later.

2. **Core Timer:** I built a custom React hook called `useTimer` that uses `useState` and `useEffect` to manage the countdown. It leverages `setInterval` for 1-second precision and implements a callback pattern to communicate with parent components when the timer completes.

3. **User Flow:** When a user solves a problem, the app creates a `Problem` object with metadata like difficulty, session count, and time spent, then persists it to localStorage. The Library page implements client-side search and filtering with O(n log n) complexity using JavaScript's native array methods like `filter` and `sort`.

4. **Statistics:** I aggregate data using `reduce` operations to calculate total time and problem counts by difficulty. I also implemented a streak algorithm that normalizes dates to midnight, uses a `Set` data structure to deduplicate, and then counts consecutive days.

5. **Routing:** The app uses React Router v6 for a multi-page experience with three routes: Home (timer), Library (search/filter), and Stats (analytics dashboard).

The app is fully functional without a backend, but the architecture supports scaling to Firebase for cloud sync and video recording features in Phase 3."**

### Key Technical Highlights

- ✅ **TypeScript** for type safety
- ✅ **Custom Hooks** for reusable logic
- ✅ **localStorage** for offline-first data persistence
- ✅ **Client-side routing** with React Router
- ✅ **Web Audio API** for notifications
- ✅ **Functional programming** with array methods (map, filter, reduce)
- ✅ **Component composition** with props drilling
- ✅ **Side effect management** with useEffect cleanup
- ✅ **Responsive design** with Tailwind CSS

---

## 10. Key Learnings & Challenges

### Challenges Solved

1. **Tailwind CSS v4 Migration:**
   - Custom color classes weren't loading
   - Solution: Used direct hex values with `bg-[#hex]` syntax

2. **Timer Accuracy:**
   - `setInterval` can drift over time
   - Current: Acceptable for 25-minute sessions
   - Future: Implement drift correction with `Date.now()`

3. **State Synchronization:**
   - Session count tracking across timer resets
   - Solution: Lift state up to parent component

4. **Date Handling:**
   - localStorage stores dates as strings
   - Solution: Convert to Date objects with `new Date(storedDate)`

### Performance Considerations

- **localStorage is synchronous** - can block main thread with large data
- **Array operations scale linearly** - fine for <1000 problems
- **Re-renders on filter changes** - can optimize with `useMemo`

---

## Conclusion

This project demonstrates proficiency in:
- Modern React patterns (hooks, functional components)
- TypeScript for type-safe development
- Client-side state management
- Data structure design and algorithms
- Browser APIs (localStorage, Web Audio)
- Responsive UI design with Tailwind CSS
- Scalable architecture for future enhancements

The application is production-ready for personal use and provides a solid foundation for adding cloud features like Firebase sync and video recording in future phases.
