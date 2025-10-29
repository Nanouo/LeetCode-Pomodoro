// Firebase Storage operations for video uploads
// Based on PRD Section 4.3 Firebase Storage Structure

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload a video file to Firebase Storage
 * Storage structure: videos/{userId}/{problemId}/explanation.webm
 * 
 * @param userId - The user's ID
 * @param problemId - The problem's ID
 * @param videoBlob - The video file as a Blob
 * @returns Promise with the download URL
 */
export async function uploadVideoExplanation(
  userId: string,
  problemId: string,
  videoBlob: Blob
): Promise<string> {
  // Create storage reference following PRD structure
  const videoPath = `videos/${userId}/${problemId}/explanation.webm`;
  const storageRef = ref(storage, videoPath);
  
  // Upload the video
  await uploadBytes(storageRef, videoBlob, {
    contentType: 'video/webm',
  });
  
  // Get and return the download URL
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

/**
 * Delete a video from Firebase Storage
 * 
 * @param userId - The user's ID
 * @param problemId - The problem's ID
 */
export async function deleteVideoExplanation(
  userId: string,
  problemId: string
): Promise<void> {
  const videoPath = `videos/${userId}/${problemId}/explanation.webm`;
  const storageRef = ref(storage, videoPath);
  
  try {
    await deleteObject(storageRef);
  } catch (error: any) {
    // Ignore error if file doesn't exist
    if (error.code !== 'storage/object-not-found') {
      throw error;
    }
  }
}

/**
 * Get the download URL for a video (if it exists)
 * 
 * @param userId - The user's ID
 * @param problemId - The problem's ID
 * @returns Promise with the download URL or null if doesn't exist
 */
export async function getVideoURL(
  userId: string,
  problemId: string
): Promise<string | null> {
  const videoPath = `videos/${userId}/${problemId}/explanation.webm`;
  const storageRef = ref(storage, videoPath);
  
  try {
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error: any) {
    if (error.code === 'storage/object-not-found') {
      return null;
    }
    throw error;
  }
}
