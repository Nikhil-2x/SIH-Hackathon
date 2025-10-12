export const stopCameraStream = (videoRef, setCameraActive) => {
  if (videoRef.current && videoRef.current.srcObject) {
    videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    setCameraActive(false);
  }
};
