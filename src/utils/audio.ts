// Audio notification utilities
// Based on PRD Section 3.1 - Timer should play sound when it ends

/**
 * Play a notification sound when the timer ends
 * Uses Web Audio API to generate a simple beep sound
 */
export function playNotificationSound(): void {
  try {
    // Create an AudioContext
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create oscillator for the beep sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure the sound
    oscillator.frequency.value = 800; // Frequency in Hz (800Hz = pleasant beep)
    oscillator.type = 'sine'; // Wave type
    
    // Set volume
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    
    // Fade out to avoid clicking sound
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5
    );
    
    // Play the sound
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
  } catch (error) {
    console.error('Failed to play notification sound:', error);
  }
}

/**
 * Play a custom audio file (if you want to use an audio file instead)
 * @param audioUrl - URL to the audio file
 */
export function playCustomSound(audioUrl: string): void {
  try {
    const audio = new Audio(audioUrl);
    audio.volume = 0.5;
    audio.play().catch(error => {
      console.error('Failed to play custom sound:', error);
    });
  } catch (error) {
    console.error('Failed to load custom sound:', error);
  }
}

/**
 * Request notification permission (for browser notifications)
 * This allows showing desktop notifications even when tab is not focused
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

/**
 * Show a browser notification when timer ends
 * @param title - Notification title
 * @param body - Notification body text
 */
export function showNotification(title: string, body: string): void {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/vite.svg', // You can replace with your app icon
      badge: '/vite.svg',
    });
  }
}
