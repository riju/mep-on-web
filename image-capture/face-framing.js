navigator.mediaDevices.getUserMedia({ video: true })
.then((stream) => {
  document.querySelector("video").srcObject = stream;

  const [track] = stream.getVideoTracks();
  const capabilities = track.getCapabilities();
  const settings = track.getSettings();

  if (!("faceFraming" in settings)) {
    throw Error(`Face Framing is not supported by ${track.label}`);
  }

  log(`Face Framing is ${settings.faceFraming ? "ON" : "OFF"}`);
  
  // Listen to face framing changes.
  track.addEventListener("configurationchange", configurationChange);
  
  // Check whether the user can toggle face framing in the web app.
  if (capabilities.faceFraming?.length !== 2) {
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
    advanced: [{ faceFraming: !settings.faceFraming }],
  };
  track.applyConstraints(constraints)
  .then(() => {
    const settings = track.getSettings();
    log(`Face Framing is now ${settings.faceFraming ? "ON" : "OFF"}`);
  })
  .catch((error) => log("Argh!", `${error}`));
}

function configurationChange(event) {
  const settings = event.target.getSettings();
  if ("faceFraming" in settings) {
    log(`Face Framing changed to ${settings.faceFraming ? "ON" : "OFF"}`);
  }
}
