import { useState, useRef } from "react";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [currentFacingMode, setCurrentFacingMode] = useState<"user" | "environment">("environment");

  const openCamera = async (facing: "user" | "environment" = "environment") => {
    setShowCamera(true);
    setCurrentFacingMode(facing);

    try {
      // ✅ Use 'ideal' instead of 'exact' for better compatibility
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facing } },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      return { success: true };
    } catch (error) {
      console.error("Error opening camera:", error);
      setShowCamera(false);
      return { success: false, error: "Unable to access camera." };
    }
  };

  // --- Capture a photo from the video stream ---
  const capturePhoto = (): Promise<File | null> => {
    return new Promise((resolve) => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const file = new File([blob], "captured.jpg", { type: "image/jpeg" });

                // Stop camera stream
                if (video.srcObject) {
                  (video.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
                }

                setShowCamera(false);
                resolve(file);
              } else {
                resolve(null);
              }
            },
            "image/jpeg",
            0.9
          );
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  };

  // --- Close camera manually ---
  const closeCamera = () => {
    setShowCamera(false);
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
    }
  };

  // --- Optional: Flip between front/back camera ---
  const flipCamera = async () => {
    const newFacing = currentFacingMode === "user" ? "environment" : "user";
    closeCamera();
    await openCamera(newFacing);
  };

  return {
    videoRef,
    canvasRef,
    showCamera,
    openCamera,
    capturePhoto,
    closeCamera,
    flipCamera, // 👈 toggle between front/back
    currentFacingMode,
  };
}
