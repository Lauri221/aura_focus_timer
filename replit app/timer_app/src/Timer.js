import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

/**
 * Timer Component
 * A flexible Pomodoro timer component that supports:
 * - Work/break cycles with automatic transitions
 * - Custom time input for both work and break periods
 * - Preset durations with default break times
 * - Visual and audio notifications
 * - Screen shake effect on completion
 */
function Timer() {
    // State management for timer functionality
    const [seconds, setSeconds] = useState(1500); // Default: 25 minutes
    const [isActive, setIsActive] = useState(false);
    const [inputMinutes, setInputMinutes] = useState('');
    const [breakMinutes, setBreakMinutes] = useState('5');
    const [cycles, setCycles] = useState(3);
    const [currentCycle, setCurrentCycle] = useState(1);
    const [isBreak, setIsBreak] = useState(false);
    const [totalCycles, setTotalCycles] = useState(3);

    /**
     * Timer countdown effect
     * Handles the countdown logic and cycle transitions
     */
    useEffect(() => {
        let interval = null;

        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds - 1);
            }, 1000);
        } else if (seconds === 0 && isActive) {
            setIsActive(false);

            // Play notification sound
            const notification = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
            notification.play().catch(console.error);

            // Add shake effect
            document.querySelector('.timer-container').classList.add('shake');
            setTimeout(() => {
                document.querySelector('.timer-container').classList.remove('shake');
            }, 500);

            if (isBreak) {
                // Break period completed
                if (currentCycle < totalCycles) {
                    setCurrentCycle(prev => prev + 1);
                    setIsBreak(false);
                    setSeconds(inputMinutes ? parseInt(inputMinutes) * 60 : 1500);
                    setIsActive(true); // Automatically start next work period
                } else {
                    // All cycles completed
                    resetTimer();
                }
            } else {
                // Work period completed
                setIsBreak(true);
                setSeconds(parseInt(breakMinutes) * 60);
                setIsActive(true); // Automatically start break timer
            }
        }

        return () => clearInterval(interval);
    }, [isActive, seconds, currentCycle, totalCycles, isBreak, inputMinutes, breakMinutes]);

    const formatTime = () => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const startTimer = () => {
        if (seconds > 0) setIsActive(true);
    };

    const pauseTimer = () => {
        setIsActive(false);
    };

    const resetTimer = () => {
        setIsActive(false);
        setSeconds(inputMinutes ? parseInt(inputMinutes) * 60 : 1500);
        setIsBreak(false);
        setCurrentCycle(1);
    };

    const setPresetTime = (minutes) => {
        setInputMinutes(minutes.toString());
        setSeconds(minutes * 60);
        setIsActive(false);
        setIsBreak(false);
        setCurrentCycle(1);
    };

    const handleTimeInput = () => {
        const minutes = parseInt(inputMinutes);
        if (!isNaN(minutes) && minutes > 0) {
            setSeconds(minutes * 60);
            setIsActive(false);
        } else {
            // Use a non-blocking notification instead of alert
            console.warn('Please enter a valid number of minutes (greater than 0)');
            // You could implement a toast notification here instead
        }
    };

    return (
        <div className="space-y-6 timer-container">
            <h1 className="text-2xl font-bold text-center mb-6">Aura Focus Timer</h1>

            {/* Timer Status */}
            <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                    {isBreak ? 'Break Time' : 'Work Time'} - Cycle {currentCycle} of {totalCycles}
                </p>
                <div className="text-6xl font-mono text-center">
                    {formatTime()}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col items-center gap-4">
                    {/* Custom Time Input */}
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="1"
                            placeholder="Work minutes"
                            className="border rounded p-2 w-32 text-center bg-background text-foreground"
                            value={inputMinutes}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || parseInt(value) > 0) {
                                    setInputMinutes(value);
                                }
                            }}
                        />
                        <input
                            type="number"
                            min="1"
                            placeholder="Break minutes"
                            className="border rounded p-2 w-32 text-center bg-background text-foreground"
                            value={breakMinutes}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || parseInt(value) > 0) {
                                    setBreakMinutes(value);
                                }
                            }}
                        />
                        <Button onClick={handleTimeInput}>
                            Set Timer
                        </Button>
                    </div>

                    {/* Preset Duration Buttons */}
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => setPresetTime(10)}>
                            10 min
                        </Button>
                        <Button variant="secondary" onClick={() => setPresetTime(15)}>
                            15 min
                        </Button>
                        <Button variant="secondary" onClick={() => setPresetTime(20)}>
                            20 min
                        </Button>
                    </div>

                    {/* Cycle Selector */}
                    <div className="flex items-center gap-2">
                        <span>Cycles:</span>
                        <select
                            className="border rounded p-2 bg-background text-foreground"
                            value={cycles}
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                setCycles(value);
                                setTotalCycles(value);
                            }}
                        >
                            {[2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Timer Controls */}
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={isActive ? pauseTimer : startTimer}
                        disabled={seconds === 0}
                    >
                        {isActive ? (
                            <>
                                <Pause className="h-4 w-4 mr-2" />
                                Pause
                            </>
                        ) : (
                            <>
                                <Play className="h-4 w-4 mr-2" />
                                Start
                            </>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={resetTimer}
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Timer;