/**
 * Converts a Blob from MediaRecorder into a File suitable for FormData upload.
 * Handles Chrome's `video/webm;codecs=opus` MIME quirk.
 */
export function blobToAudioFile(blob: Blob, filename = 'recording.webm'): File {
  // Chrome outputs video/webm;codecs=opus — normalize to audio/webm for clarity
  const mimeType = blob.type.startsWith('video/webm') ? 'audio/webm' : blob.type;
  return new File([blob], filename, { type: mimeType });
}

/**
 * Returns true if the current browser supports MediaRecorder with audio.
 */
export function isMediaRecorderSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.MediaRecorder !== 'undefined' &&
    MediaRecorder.isTypeSupported('audio/webm')
  );
}
