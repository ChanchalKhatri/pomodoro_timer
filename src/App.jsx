import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Coffee, Timer } from "lucide-react";

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

function App() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(
    Number(localStorage.getItem("sessions")) || 0,
  );

  useEffect(() => {
    localStorage.setItem("sessions", sessions);
  }, [sessions]);

  useEffect(() => {
    let interval;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      if (!isBreak) {
        setSessions((prev) => prev + 1);
        setIsBreak(true);
        setTimeLeft(BREAK_TIME);
      } else {
        setIsBreak(false);
        setTimeLeft(FOCUS_TIME);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");

  const seconds = String(timeLeft % 60).padStart(2, "0");

  const total = isBreak ? BREAK_TIME : FOCUS_TIME;

  const progress = ((total - timeLeft) / total) * 100;

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(FOCUS_TIME);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl text-center">
        <motion.div
          animate={{
            rotate: isRunning ? 360 : 0,
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex justify-center mb-3"
        >
          {isBreak ? <Coffee size={50} /> : <Timer size={50} />}
        </motion.div>

        <h1 className="text-3xl font-bold mb-2">Pomodoro Timer</h1>

        <p className="text-slate-400 mb-8">
          {isBreak ? "Break Time" : "Focus Time"}
        </p>

        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="w-64 h-64 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#1e293b"
              strokeWidth="8"
              fill="none"
            />

            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#6366f1"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-5xl font-bold">
              {minutes}:{seconds}
            </h2>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center hover:scale-110 transition"
          >
            {isRunning ? <Pause /> : <Play />}
          </button>

          <button
            onClick={resetTimer}
            className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center hover:rotate-180 transition duration-500"
          >
            <RotateCcw />
          </button>
        </div>

        <div className="mt-8 p-4 rounded-xl bg-slate-900/50 border border-slate-700">
          <p className="text-slate-400">Completed Sessions</p>

          <h3 className="text-3xl font-bold mt-2">{sessions}</h3>
        </div>
      </div>
    </div>
  );
}

export default App;
