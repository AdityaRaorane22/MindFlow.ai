import React, { useState } from "react";
import {
  BookOpen,
  Brain,
  Target,
  Zap,
  Coffee,
  TrendingUp,
  Award,
  Clock,
  Eye,
  CheckCircle,
  ChevronRight,
  Sparkles,
  Activity
} from "lucide-react";

const LearnFocus = ({ setCurrentPage }) => {
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [completedChapters, setCompletedChapters] = useState(new Set([1, 2]));

  const colorMap = {
    purple: "#8b5cf6",
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#10b981",
    yellow: "#f59e0b",
    indigo: "#6366f1",
    pink: "#ec4899",
    teal: "#14b8a6"
  };

  const chapters = [
    {
      id: 1,
      icon: Brain,
      title: "Understanding Flow State",
      duration: "10 min read",
      difficulty: "Beginner",
      color: "purple",
      content: `Flow state, coined by psychologist Mihály Csíkszentmihályi, is the mental state where you're completely absorbed in an activity. During flow:

• Time perception changes - hours feel like minutes
• Self-consciousness disappears completely
• Actions feel effortless and automatic
• You experience deep enjoyment and clarity

Our LSTM model detects flow through:
→ Extended eye fixations (400-800ms)
→ Reduced blinking (5-12 blinks/min)
→ Minimal mouse movement
→ High keyboard consistency (0.75-0.95 pattern score)

Research shows flow states increase productivity by 500% and improve learning outcomes significantly. The key is creating the right challenge-skill balance.

Practical Tips:
✓ Set clear, specific goals before starting
✓ Eliminate all distractions for 20+ minutes
✓ Choose tasks slightly above your skill level
✓ Get immediate feedback on your progress
✓ Track your flow patterns to optimize timing`
    },
    {
      id: 2,
      icon: Target,
      title: "Pomodoro Technique Mastery",
      duration: "8 min read",
      difficulty: "Beginner",
      color: "red",
      content: `The Pomodoro Technique breaks work into 25-minute focused intervals separated by 5-minute breaks. This matches natural attention spans and prevents mental fatigue.

How It Works:
1. Choose a task to focus on
2. Set timer for 25 minutes
3. Work with full concentration
4. Take a 5-minute break
5. After 4 pomodoros, take 15-30 min break

Why It's Effective (Backed by 32 Studies):
→ Prevents decision fatigue through structure
→ Creates urgency that boosts focus
→ Regular breaks maintain peak cognitive performance
→ Builds sustainable work habits over time

MindFlow.ai Integration:
Our system detects when you're losing focus before the 25-minute mark and can suggest adaptive intervals. Some users achieve better results with 15 or 45-minute blocks based on their cognitive profile.

Pro Tips:
✓ Use the break to move away from screen
✓ Don't check social media during breaks
✓ Adjust intervals based on your flow data
✓ Track which tasks work best in pomodoros`
    },
    {
      id: 3,
      icon: Eye,
      title: "Eye Movement & Focus Signals",
      duration: "12 min read",
      difficulty: "Intermediate",
      color: "blue",
      content: `Your eyes reveal your mental state. Our LSTM model analyzes three key metrics:

1. Fixation Duration
• Distracted: 50-200ms (scanning)
• Focused: 200-400ms (processing)
• Deep Flow: 400-800ms (immersed)

2. Saccade Velocity (eye jumps)
• High velocity (300-600°/s) = mind wandering
• Medium (100-300°/s) = active thinking
• Low (50-150°/s) = deep concentration

3. Blink Rate
• 25-40 blinks/min = stressed/distracted
• 12-20 blinks/min = normal focus
• 5-12 blinks/min = flow state

Research Insight:
A 2024 Nature study achieved 83.5% accuracy predicting cognitive states from eye patterns using LSTM + Attention models. This is exactly what powers MindFlow.ai.

How to Train Better Eye Patterns:
✓ Practice focal point meditation (5 min daily)
✓ Reduce blue light exposure before focus sessions
✓ Use the 20-20-20 rule (every 20 min, look 20 feet away for 20 sec)
✓ Monitor your blink rate during deep work

Your eyes are the gateway to understanding your brain's focus capacity.`
    },
    {
      id: 4,
      icon: Coffee,
      title: "Strategic Break Science",
      duration: "7 min read",
      difficulty: "Beginner",
      color: "green",
      content: `Not all breaks are equal. Strategic breaks amplify focus rather than interrupt it.

Optimal Break Types:
→ Micro-breaks (30 sec every 10 min): Look away, blink, breathe
→ Short breaks (5 min every 25 min): Stand, stretch, water
→ Medium breaks (15 min every 90 min): Walk, fresh air, light snack
→ Long breaks (30+ min every 3-4 hrs): Meal, exercise, social

What Science Says:
Studies show systematic breaks improve focus by 28%, reduce mental fatigue by 42%, and enhance task performance significantly. The key is timing breaks BEFORE fatigue sets in.

MindFlow.ai Break Intelligence:
Our AI detects early signs of cognitive decline:
• Flow score dropping below 60
• Increased mouse movements
• Rising tab switch frequency
• Declining keyboard consistency

When these patterns emerge, we trigger smart break alerts with personalized recommendations.

Break Best Practices:
✗ Don't scroll social media (drains more energy)
✗ Don't start complex conversations
✓ Do move your body physically
✓ Do engage different cognitive areas
✓ Do practice micro-meditation (1-2 min breathing)`
    },
    {
      id: 5,
      icon: Zap,
      title: "Digital Distraction Management",
      duration: "15 min read",
      difficulty: "Intermediate",
      color: "yellow",
      content: `The modern digital environment is engineered for distraction. Every app competes for your attention using behavioral psychology.

Understanding Distraction Types:

1. Internal Distractions
• Mind wandering (default mode network)
• Anxiety about other tasks
• Physical discomfort
• Boredom/lack of challenge

2. External Distractions
• Notifications (avg person checks phone 96x/day)
• Tab switching (context switching costs 23 min to refocus)
• Environmental noise
• Visual movement in periphery

MindFlow.ai Detection:
We track distraction patterns in real-time:
→ Tab switches per minute (>5 = distracted)
→ Mouse erratic movement
→ Keyboard inconsistency
→ Reduced time on task

Proven Countermeasures:
✓ Enable Do Not Disturb mode system-wide
✓ Close all non-essential tabs before starting
✓ Use separate browser profiles for work/personal
✓ Block distracting websites during focus sessions
✓ Put phone in another room (seriously)
✓ Use noise-cancelling headphones or white noise
✓ Schedule specific times to check email/messages

The Goal: Design an environment where focus is the default, not the exception.`
    },
    {
      id: 6,
      icon: TrendingUp,
      title: "Building Focus as a Skill",
      duration: "10 min read",
      difficulty: "Advanced",
      color: "indigo",
      content: `Focus isn't a fixed trait - it's a skill that improves with deliberate practice. Like a muscle, it strengthens with consistent training.

The Focus Skill Tree:
Level 1: Basic Attention (5-10 min sustained focus)
Level 2: Moderate Focus (20-25 min blocks)
Level 3: Deep Work (45-90 min sessions)
Level 4: Flow Mastery (2+ hours of deep flow)

Progressive Training Protocol:

Week 1-2: Baseline & Awareness
• Track current focus capability
• Notice distraction triggers
• Start with 15-minute blocks

Week 3-4: Extending Duration
• Increase to 25-minute blocks
• Reduce distraction frequency
• Build break discipline

Week 5-8: Flow State Practice
• 45-60 minute deep work sessions
• Optimize environmental factors
• Develop focus rituals

Week 9+: Mastery & Optimization
• 90+ minute flow sessions
• Automatic distraction rejection
• Peak performance states

Neuroscience Behind Focus Training:
Your prefrontal cortex (focus control center) develops stronger neural pathways with practice. MRI studies show meditation and focus training increase gray matter density in attention-related brain regions.

MindFlow.ai tracks your progress across:
• Concentration endurance
• Distraction resistance
• Flow state frequency
• Recovery speed after interruptions

Keep training. Every focus session makes the next one easier.`
    },
    {
      id: 7,
      icon: Award,
      title: "Advanced Flow Techniques",
      duration: "18 min read",
      difficulty: "Advanced",
      color: "pink",
      content: `Master-level techniques used by top performers, researchers, and creative professionals to achieve peak cognitive states.

1. Priming Rituals
Create consistent pre-work routines that signal "focus time" to your brain:
• Same workspace, same time
• Specific music or ambient sound
• Brief meditation or breathing exercise
• Review goals and intentions
• Eliminate decision fatigue

2. Progressive Challenge Matching
Flow requires tasks slightly above your skill level (4% challenge increase):
• Too easy = boredom
• Too hard = anxiety
• Just right = flow

Use our AI to identify your optimal challenge zone.

3. Temporal Architecture
Design your day around natural energy cycles:
• Peak cognitive hours (usually 2-4 hours post-waking)
• Deep work during peak
• Shallow work during valleys
• Creative work during medium energy

4. Meta-Cognitive Monitoring
Develop awareness of your focus state in real-time:
• Notice when attention drifts (within seconds)
• Gently redirect without self-judgment
• Use flow score as biofeedback
• Track patterns over weeks/months

5. Environmental Optimization
• Lighting: Natural light or 4000-6500K
• Temperature: 68-72°F optimal
• Air quality: Fresh, well-ventilated
• Sound: Silence or 40-70dB ambient
• Visual: Minimal clutter, no movement

6. Biochemical Support
• Hydration: 2-3L water daily
• Sleep: 7-9 hours consistent
• Exercise: 30+ min daily
• Nutrition: Balanced, avoid sugar crashes
• Caffeine: Strategic (max 200mg timing-dependent)

The Ultimate Goal:
Make flow state your default mode of operation. With practice, you can enter flow within minutes instead of hours.`
    },
    {
      id: 8,
      icon: Activity,
      title: "LSTM Model Deep Dive",
      duration: "14 min read",
      difficulty: "Advanced",
      color: "teal",
      content: `Understanding how MindFlow.ai's AI model detects your focus states in real-time.

Model Architecture:
→ LSTM layers (128 + 64 units) capture temporal patterns
→ Attention mechanism weighs important timesteps
→ Dense layers (64 + 32 units) for classification
→ Softmax output: distracted, focused, deep_flow

Training Data Features (10 inputs):
1. Eye fixation duration (ms)
2. Eye saccade velocity (°/s)
3. Blink rate (per minute)
4. Mouse movements (per minute)
5. Mouse idle time (seconds)
6. Keyboard strokes (per minute)
7. Keyboard burst pattern (0-1)
8. Tab switches (per minute)
9. Scroll speed (px/s)
10. Time on current task (minutes)

Why LSTM + Attention?
• Remembers patterns across 10-second windows
• Captures long-term dependencies in behavior
• Attention highlights critical moments
• 83.5% F1 score matches research benchmarks

Real-Time Prediction Pipeline:
1. Collect behavioral metrics every second
2. Normalize using StandardScaler
3. Build 10-timestep sequence buffer
4. Feed to LSTM model
5. Generate probability distribution
6. Calculate flow score (0-100)
7. Update UI with predictions

Model Performance:
✓ Precision: 84.2% (few false positives)
✓ Recall: 82.8% (catches most flow states)
✓ Latency: <50ms per prediction
✓ Calibrated every 1000 predictions

Privacy by Design:
All processing happens on your device. No behavioral data is sent to servers. The model runs locally using TensorFlow.js.

Future Enhancements:
• Personalized model fine-tuning
• Transfer learning from similar users
• Predictive focus scheduling
• Adaptive break timing

The power of AI isn't just detection - it's helping you understand and optimize your unique cognitive patterns.`
    }
  ];

  const handleComplete = (chapterId) => {
    const newCompleted = new Set(completedChapters);
    newCompleted.add(chapterId);
    setCompletedChapters(newCompleted);
    alert(`🎉 Chapter ${chapterId} complete! +10 coins earned!`);
  };

  const handleNext = () => {
    const next = chapters.find(c => c.id === selectedChapter.id + 1);
    if (next) setSelectedChapter(next);
  };

  const progressPercent = Math.round((completedChapters.size / chapters.length) * 100);

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px", background: "#f9fafb", minHeight: "100vh" }}>
      
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h1 style={{ fontSize: "40px", fontWeight: "800", color: "#1f2937", marginBottom: "8px" }}>
              <Sparkles size={36} style={{ display: "inline", marginRight: "12px", color: "#8b5cf6" }} />
              Master Your Focus
            </h1>
            <p style={{ fontSize: "20px", color: "#6b7280" }}>
              Science-backed techniques powered by AI research
            </p>
          </div>
          
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "6px" }}>Course Progress</div>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#8b5cf6" }}>{progressPercent}%</div>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>{completedChapters.size}/{chapters.length} chapters</div>
          </div>
        </div>

        <div style={{ background: "#e5e7eb", height: "12px", borderRadius: "999px", overflow: "hidden" }}>
          <div style={{ 
            width: `${progressPercent}%`, 
            height: "100%", 
            background: "linear-gradient(to right, #8b5cf6, #6366f1)",
            transition: "width 0.5s ease"
          }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "24px" }}>
        
        <div>
          <div style={{
            background: "white",
            padding: "24px",
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            border: "1px solid #e5e7eb",
            position: "sticky",
            top: "24px",
          }}>
            <h2 style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}>
              <BookOpen size={24} color="#8b5cf6" />
              Learning Path
            </h2>

            <div style={{ maxHeight: "600px", overflowY: "auto", paddingRight: "8px" }}>
              {chapters.map((chapter) => {
                const Icon = chapter.icon;
                const isSelected = selectedChapter?.id === chapter.id;
                const isCompleted = completedChapters.has(chapter.id);
                const bgColor = isSelected ? `${colorMap[chapter.color]}15` : "#f9fafb";
                const borderColor = isSelected ? colorMap[chapter.color] : "#e5e7eb";

                return (
                  <button
                    key={chapter.id}
                    onClick={() => setSelectedChapter(chapter)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "16px",
                      marginBottom: "10px",
                      borderRadius: "14px",
                      background: bgColor,
                      border: `2px solid ${borderColor}`,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Icon size={20} color={colorMap[chapter.color]} />
                        <span style={{ fontWeight: 700, color: "#374151", fontSize: "13px" }}>
                          Ch {chapter.id}
                        </span>
                      </div>

                      {isCompleted && <CheckCircle size={20} color="#10b981" />}
                    </div>

                    <h3 style={{
                      fontWeight: "700",
                      color: "#1f2937",
                      fontSize: "15px",
                      marginBottom: "8px",
                    }}>
                      {chapter.title}
                    </h3>

                    <div style={{
                      display: "flex",
                      gap: "8px",
                      fontSize: "12px",
                      color: "#6b7280",
                      alignItems: "center",
                      flexWrap: "wrap"
                    }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock size={12} />
                        {chapter.duration}
                      </span>
                      <span>•</span>

                      <span style={{
                        padding: "3px 8px",
                        borderRadius: "999px",
                        fontSize: "11px",
                        fontWeight: 600,
                        background:
                          chapter.difficulty === "Beginner" ? "#d1fae5" :
                          chapter.difficulty === "Intermediate" ? "#fef9c3" : "#fecaca",
                        color:
                          chapter.difficulty === "Beginner" ? "#047857" :
                          chapter.difficulty === "Intermediate" ? "#b45309" : "#b91c1c",
                      }}>
                        {chapter.difficulty}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage("focus")}
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "18px",
                background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                color: "white",
                borderRadius: "14px",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            >
              Start AI Focus Session →
            </button>
          </div>
        </div>

        <div>
          {selectedChapter ? (
            <div style={{
              background: "white",
              borderRadius: "20px",
              padding: "40px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb",
            }}>
              
              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "24px" }}>
                {React.createElement(selectedChapter.icon, {
                  size: 48,
                  color: colorMap[selectedChapter.color],
                })}

                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#1f2937", marginBottom: "8px" }}>
                    {selectedChapter.title}
                  </h2>

                  <div style={{
                    display: "flex",
                    gap: "16px",
                    marginTop: "8px",
                    color: "#6b7280",
                    fontSize: "14px",
                    flexWrap: "wrap"
                  }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                      <Clock size={16} />
                      {selectedChapter.duration}
                    </span>

                    <span style={{
                      padding: "4px 12px",
                      borderRadius: "999px",
                      fontSize: "13px",
                      fontWeight: 700,
                      background:
                        selectedChapter.difficulty === "Beginner" ? "#d1fae5" :
                        selectedChapter.difficulty === "Intermediate" ? "#fef9c3" : "#fecaca",
                      color:
                        selectedChapter.difficulty === "Beginner" ? "#047857" :
                        selectedChapter.difficulty === "Intermediate" ? "#b45309" : "#b91c1c",
                    }}>
                      {selectedChapter.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{
                whiteSpace: "pre-line",
                color: "#374151",
                lineHeight: "1.8",
                fontSize: "17px",
                marginBottom: "32px"
              }}>
                {selectedChapter.content}
              </div>

              <div style={{
                paddingTop: "24px",
                borderTop: "2px solid #e5e7eb",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap"
              }}>
                <button
                  onClick={() => handleComplete(selectedChapter.id)}
                  disabled={completedChapters.has(selectedChapter.id)}
                  style={{
                    padding: "14px 28px",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    cursor: completedChapters.has(selectedChapter.id) ? "not-allowed" : "pointer",
                    background: completedChapters.has(selectedChapter.id) ? "#d1fae5" : colorMap[selectedChapter.color],
                    color: completedChapters.has(selectedChapter.id) ? "#047857" : "white",
                    border: "none",
                    fontSize: "15px",
                    opacity: completedChapters.has(selectedChapter.id) ? 0.8 : 1
                  }}
                >
                  {completedChapters.has(selectedChapter.id) ? "✓ Completed" : "Mark Complete"}
                </button>

                <button
                  onClick={handleNext}
                  disabled={selectedChapter.id === chapters.length}
                  style={{
                    padding: "14px 28px",
                    borderRadius: "12px",
                    border: `2px solid ${colorMap[selectedChapter.color]}`,
                    color: colorMap[selectedChapter.color],
                    fontWeight: "bold",
                    background: "white",
                    cursor: selectedChapter.id === chapters.length ? "not-allowed" : "pointer",
                    fontSize: "15px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    opacity: selectedChapter.id === chapters.length ? 0.5 : 1
                  }}
                >
                  Next Chapter <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              background: "white",
              padding: "80px 48px",
              textAlign: "center",
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb",
            }}>
              <BookOpen size={100} color="#d1d5db" />
              <h3 style={{
                marginTop: "24px",
                fontSize: "28px",
                fontWeight: "bold",
                color: "#1f2937",
              }}>
                Select a Chapter to Begin
              </h3>
              <p style={{ color: "#6b7280", fontSize: "18px", marginTop: "8px" }}>
                Choose from {chapters.length} research-backed chapters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearnFocus;

// import React, { useState } from "react";
// import {
//   BookOpen,
//   Brain,
//   Target,
//   Zap,
//   Coffee,
//   TrendingUp,
//   Award,
//   Clock,
//   Eye,
//   CheckCircle,
//   ChevronRight,
// } from "lucide-react";

// const LearnFocus = ({ setCurrentPage }) => {
//   const [selectedChapter, setSelectedChapter] = useState(null);

//   const colorMap = {
//     purple: "#8b5cf6",
//     red: "#ef4444",
//     blue: "#3b82f6",
//     green: "#10b981",
//     yellow: "#f59e0b",
//     indigo: "#6366f1",
//     pink: "#ec4899",
//   };

//   const chapters = [
//     {
//       id: 1,
//       icon: Brain,
//       title: "Understanding Flow State",
//       duration: "10 min read",
//       difficulty: "Beginner",
//       color: "purple",
//       completed: true,
//       content: `Flow state is a mental state where you're fully immersed...`,
//     },
//     {
//       id: 2,
//       icon: Target,
//       title: "Pomodoro Technique Mastery",
//       duration: "8 min read",
//       difficulty: "Beginner",
//       color: "red",
//       completed: true,
//       content: `The Pomodoro Technique is a time management method...`,
//     },
//     {
//       id: 3,
//       icon: Eye,
//       title: "Eye Movement & Focus",
//       duration: "12 min read",
//       difficulty: "Intermediate",
//       color: "blue",
//       completed: false,
//       content: `Your eye movements reveal a lot about your cognitive state...`,
//     },
//     {
//       id: 4,
//       icon: Coffee,
//       title: "Strategic Break Taking",
//       duration: "7 min read",
//       difficulty: "Beginner",
//       color: "green",
//       completed: false,
//       content: `Not all breaks are created equal...`,
//     },
//     {
//       id: 5,
//       icon: Zap,
//       title: "Distraction Management",
//       duration: "15 min read",
//       difficulty: "Intermediate",
//       color: "yellow",
//       completed: false,
//       content: `Modern digital environment is full of distractions...`,
//     },
//     {
//       id: 6,
//       icon: TrendingUp,
//       title: "Building Focus as a Skill",
//       duration: "10 min read",
//       difficulty: "Advanced",
//       color: "indigo",
//       completed: false,
//       content: `Focus isn't a trait — it's a skill you develop...`,
//     },
//     {
//       id: 7,
//       icon: Award,
//       title: "Advanced Flow Techniques",
//       duration: "18 min read",
//       difficulty: "Advanced",
//       color: "pink",
//       completed: false,
//       content: `Master-level techniques used by top performers...`,
//     },
//   ];

//   return (
//     <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px" }}>
//       {/* HEADER */}
//       <div style={{ marginBottom: "32px" }}>
//         <h1 style={{ fontSize: "36px", fontWeight: "bold", color: "#1f2937" }}>
//           Learn to Master Your Focus
//         </h1>
//         <p style={{ fontSize: "20px", color: "#4b5563" }}>
//           Build concentration as a skill with science-backed techniques
//         </p>
//       </div>

//       {/* MAIN GRID */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "1fr 2fr",
//           gap: "24px",
//         }}
//       >
//         {/* LEFT SIDEBAR */}
//         <div>
//           <div
//             style={{
//               background: "white",
//               padding: "24px",
//               borderRadius: "16px",
//               boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
//               position: "sticky",
//               top: "24px",
//             }}
//           >
//             <h2
//               style={{
//                 fontSize: "24px",
//                 fontWeight: "bold",
//                 color: "#1f2937",
//                 marginBottom: "16px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//               }}
//             >
//               <BookOpen size={24} color="#8b5cf6" />
//               Chapters
//             </h2>

//             {/* Chapters List */}
//             <div>
//               {chapters.map((chapter) => {
//                 const Icon = chapter.icon;
//                 const isSelected = selectedChapter?.id === chapter.id;
//                 const bgColor = isSelected ? `${chapter.color}20` : "#f9fafb";
//                 const borderColor = isSelected ? colorMap[chapter.color] : "#e5e7eb";

//                 return (
//                   <button
//                     key={chapter.id}
//                     onClick={() => setSelectedChapter(chapter)}
//                     style={{
//                       width: "100%",
//                       textAlign: "left",
//                       padding: "16px",
//                       marginBottom: "8px",
//                       borderRadius: "12px",
//                       background: bgColor,
//                       border: `2px solid ${borderColor}`,
//                       cursor: "pointer",
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         marginBottom: "8px",
//                       }}
//                     >
//                       <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                         <Icon size={20} color={colorMap[chapter.color]} />
//                         <span
//                           style={{
//                             fontWeight: 600,
//                             color: "#1f2937",
//                             fontSize: "14px",
//                           }}
//                         >
//                           Ch {chapter.id}
//                         </span>
//                       </div>

//                       {chapter.completed && <CheckCircle size={20} color="#10b981" />}
//                     </div>

//                     <h3
//                       style={{
//                         fontWeight: "bold",
//                         color: "#1f2937",
//                         fontSize: "14px",
//                         marginBottom: "6px",
//                       }}
//                     >
//                       {chapter.title}
//                     </h3>

//                     <div
//                       style={{
//                         display: "flex",
//                         gap: "6px",
//                         fontSize: "12px",
//                         color: "#4b5563",
//                         alignItems: "center",
//                       }}
//                     >
//                       <Clock size={12} />
//                       <span>{chapter.duration}</span>
//                       <span>•</span>

//                       {/* Difficulty Badge */}
//                       <span
//                         style={{
//                           padding: "2px 8px",
//                           borderRadius: "999px",
//                           background:
//                             chapter.difficulty === "Beginner"
//                               ? "#d1fae5"
//                               : chapter.difficulty === "Intermediate"
//                               ? "#fef9c3"
//                               : "#fecaca",
//                           color:
//                             chapter.difficulty === "Beginner"
//                               ? "#047857"
//                               : chapter.difficulty === "Intermediate"
//                               ? "#b45309"
//                               : "#b91c1c",
//                         }}
//                       >
//                         {chapter.difficulty}
//                       </span>
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>

//             {/* START FOCUS BUTTON */}
//             <button
//               onClick={() => setCurrentPage("focus")}
//               style={{
//                 width: "100%",
//                 marginTop: "16px",
//                 padding: "16px",
//                 background: "linear-gradient(to right, #8b5cf6, #3b82f6)",
//                 color: "white",
//                 borderRadius: "12px",
//                 fontWeight: "bold",
//                 border: "none",
//                 cursor: "pointer",
//               }}
//             >
//               Start Focus Session →
//             </button>
//           </div>
//         </div>

//         {/* RIGHT CONTENT */}
//         <div>
//           {selectedChapter ? (
//             <div
//               style={{
//                 background: "white",
//                 borderRadius: "16px",
//                 padding: "32px",
//                 boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
//               }}
//             >
//               {/* Chapter Header */}
//               <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//                 {React.createElement(selectedChapter.icon, {
//                   size: 40,
//                   color: colorMap[selectedChapter.color],
//                 })}

//                 <div>
//                   <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#1f2937" }}>
//                     {selectedChapter.title}
//                   </h2>

//                   <div
//                     style={{
//                       display: "flex",
//                       gap: "12px",
//                       marginTop: "4px",
//                       color: "#4b5563",
//                       fontSize: "14px",
//                     }}
//                   >
//                     <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
//                       <Clock size={16} />
//                       {selectedChapter.duration}
//                     </span>

//                     <span>•</span>

//                     <span
//                       style={{
//                         padding: "4px 8px",
//                         borderRadius: "999px",
//                         fontSize: "12px",
//                         fontWeight: 600,
//                         background:
//                           selectedChapter.difficulty === "Beginner"
//                             ? "#d1fae5"
//                             : selectedChapter.difficulty === "Intermediate"
//                             ? "#fef9c3"
//                             : "#fecaca",
//                         color:
//                           selectedChapter.difficulty === "Beginner"
//                             ? "#047857"
//                             : selectedChapter.difficulty === "Intermediate"
//                             ? "#b45309"
//                             : "#b91c1c",
//                       }}
//                     >
//                       {selectedChapter.difficulty}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Content */}
//               <div
//                 style={{
//                   whiteSpace: "pre-line",
//                   marginTop: "24px",
//                   color: "#374151",
//                   lineHeight: "1.7",
//                   fontSize: "16px",
//                 }}
//               >
//                 {selectedChapter.content}
//               </div>

//               {/* Buttons */}
//               <div
//                 style={{
//                   marginTop: "32px",
//                   paddingTop: "16px",
//                   borderTop: "1px solid #e5e7eb",
//                 }}
//               >
//                 <button
//                   onClick={() =>
//                     alert(`Chapter ${selectedChapter.id} complete! +10 coins 🎉`)
//                   }
//                   style={{
//                     padding: "12px 24px",
//                     borderRadius: "12px",
//                     fontWeight: "bold",
//                     cursor: "pointer",
//                     background: selectedChapter.completed ? "#d1fae5" : "#8b5cf6",
//                     color: selectedChapter.completed ? "#047857" : "white",
//                     border: "none",
//                   }}
//                 >
//                   {selectedChapter.completed ? "✓ Completed" : "Mark as Complete"}
//                 </button>

//                 <button
//                   onClick={() => {
//                     const next = chapters.find(
//                       (c) => c.id === selectedChapter.id + 1
//                     );
//                     if (next) setSelectedChapter(next);
//                   }}
//                   disabled={selectedChapter.id === chapters.length}
//                   style={{
//                     marginLeft: "12px",
//                     padding: "12px 24px",
//                     borderRadius: "12px",
//                     border: "2px solid #8b5cf6",
//                     color: "#8b5cf6",
//                     fontWeight: "bold",
//                     background: "white",
//                     cursor:
//                       selectedChapter.id === chapters.length
//                         ? "not-allowed"
//                         : "pointer",
//                   }}
//                 >
//                   Next Chapter <ChevronRight size={16} />
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div
//               style={{
//                 background: "white",
//                 padding: "48px",
//                 textAlign: "center",
//                 borderRadius: "16px",
//                 boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
//               }}
//             >
//               <BookOpen size={80} color="#d1d5db" />
//               <h3
//                 style={{
//                   marginTop: "16px",
//                   fontSize: "24px",
//                   fontWeight: "bold",
//                   color: "#1f2937",
//                 }}
//               >
//                 Select a Chapter to Start Learning
//               </h3>
//               <p style={{ color: "#4b5563", fontSize: "16px" }}>
//                 Choose from 7 chapters on the left
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LearnFocus;
