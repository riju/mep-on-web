navigator.mediaDevices.getUserMedia({ video: true })
.then((stream) => {
  document.querySelector("video").srcObject = stream;

  const [track] = stream.getVideoTracks();
  const capabilities = track.getCapabilities();
  const settings = track.getSettings();

  if (!("eyeGazeCorrection" in settings)) {
    throw Error(`Eye Gaze Correction is not supported by ${track.label}`);
  }

  log(`Eye Gaze Correction is ${settings.eyeGazeCorrection ? "ON" : "OFF"}`);
  
  // Listen to eye gaze correction changes.
  track.addEventListener("configurationchange", configurationChange);
  
  // Check whether the user can toggle eye gaze correction in the web app.
  if (capabilities.eyeGazeCorrection?.length !== 2) {
    throw Error(`Face framing toggle is not supported by ${track.label}`);
  }

  const button = document.querySelector("button");
  button.addEventListener("click", buttonClick);
  button.disabled = false;
})
.catch((error) => log("Argh!", `${error}`));

function buttonClick() {
  const stream = document.querySelector("video").srcObject;
  const [track] = stream.getVideoTracks();
  const settings = track.getSettings();
  const constraints = {
    advanced: [{ eyeGazeCorrection: !settings.eyeGazeCorrection }],
  };
  track.applyConstraints(constraints)
  .then(() => {
    const settings = track.getSettings();
    log(`Eye Gaze Correction is now ${settings.eyeGazeCorrection ? "ON" : "OFF"}`);
  })
  .catch((error) => log("Argh!", `${error}`));
}

function configurationChange(event) {
  const settings = event.target.getSettings();
  if ("eyeGazeCorrection" in settings) {
    log(`Eye Gaze Correction changed to ${settings.eyeGazeCorrection ? "ON" : "OFF"}`);
  }
}
