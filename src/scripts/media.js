export function recordAudio() {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          const audioChunks = [];
          
          mediaRecorder.addEventListener('dataavailable', event => {
            audioChunks.push(event.data);
          });
          
          mediaRecorder.addEventListener('stop', () => {
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            resolve(audioUrl);
          });
          
          mediaRecorder.start();
          
          setTimeout(() => {
            mediaRecorder.stop();
            stream.getTracks().forEach(track => track.stop());
          }, 5000);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  
  export function recordVideo() {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          const videoChunks = [];
          
          mediaRecorder.addEventListener('dataavailable', event => {
            videoChunks.push(event.data);
          });
          
          mediaRecorder.addEventListener('stop', () => {
            const videoBlob = new Blob(videoChunks);
            const videoUrl = URL.createObjectURL(videoBlob);
            resolve(videoUrl);
          });
          
          mediaRecorder.start();
          
          setTimeout(() => {
            mediaRecorder.stop();
            stream.getTracks().forEach(track => track.stop());
          }, 5000);
        })
        .catch(error => {
          reject(error);
        });
    });
  }