import { useEffect, useRef, useState } from "react";



const filters = [
  { label: "Original", css: "none" },
  { label: "Warm", css: "sepia(.18) saturate(1.2) contrast(1.04)" },
  { label: "Film", css: "sepia(.28) contrast(1.13) saturate(.8)" },
  { label: "B&W", css: "grayscale(1) contrast(1.18)" },
];

const wallPhotos = [
  `${import.meta.env.BASE_URL}wall/1.jpeg`,
  `${import.meta.env.BASE_URL}wall/2.jpeg`,
  `${import.meta.env.BASE_URL}wall/3.jpeg`,
  `${import.meta.env.BASE_URL}wall/4.jpeg`,
  `${import.meta.env.BASE_URL}wall/5.jpeg`,
  `${import.meta.env.BASE_URL}wall/6.jpeg`,
];

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.5 7 9 4.8h6L16.5 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3.5Z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function Logo() {
  return (
    <span className="logo" aria-label="Photo Frenzy">
      {"PHOTO".split("").map((letter, index) => (
        <i key={`${letter}-${index}`} className={`logo-${index}`}>
          {letter}
        </i>
      ))}
      <b>FRENZY</b>
    </span>
  );
}

function BoothIllustration() {
  return (
    <div className="booth-illustration" aria-label="A vintage Photo Frenzy booth">
      <div className="booth-sign">
        <Logo />
        <span>automatic pictures</span>
      </div>
      <div className="booth-machine">
        <div className="curtain">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="booth-inside">
          <span className="stool-top" />
          <span className="stool-leg" />
        </div>
        <div className="booth-panel">
          <span className="booth-lens" />
          <span className="booth-slot" />
          <div className="mini-strip">
            <i />
            <i />
            <i />
            <b>PF</b>
          </div>
        </div>
      </div>
      <div className="booth-floor" />
    </div>
  );
}

function PhotoWall() {
  return (
    <aside className="photo-wall" id="wall">
      <div className="wall-heading">
        <span>the frenzy wall</span>
        <b>WOW!</b>
      </div>
      <p>
        <CameraIcon /> snaps we love this week
      </p>
      <div className="wall-collage">
        {wallPhotos.map((photo, index) => (
          <figure key={photo} className={`wall-photo wall-photo-${index}`}>
            <img src={photo} alt="" />
          </figure>
        ))}
        <div className="tiny-strip">
          {wallPhotos.slice(0, 3).map((photo) => (
            <img key={photo} src={photo} alt="" />
          ))}
        </div>
      </div>
      <span className="wall-note">fresh from the booth →</span>
    </aside>
  );
}

export default function App() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [view, setView] = useState("home");
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [filter, setFilter] = useState(filters[0]);
  const [frameColor, setFrameColor] = useState("#fff4ee");
  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [shooting, setShooting] = useState(false);

  useEffect(() => {
    return () => streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const wait = (milliseconds) =>
    new Promise((resolve) => window.setTimeout(resolve, milliseconds));

  const startCamera = async () => {
    setCameraError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Live camera is not available here. You can still add photos from your device.",
      );
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraReady(true);
    } catch {
      setCameraError(
        "Camera access was blocked. Allow it in your browser, or add photos from your device.",
      );
    }
  };

  const enterBooth = async () => {
    setView("booth");
    window.setTimeout(startCamera, 250);
  };

  const goHomeSection = (sectionId) => {
    if (view === "booth") {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setCameraReady(false);
      setView("home");
    }
    window.setTimeout(
      () => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  };

  const captureFrame = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return "";
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return "";
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.filter = filter.css;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.94);
  };

  const startPhotos = async () => {
    if (!cameraReady || shooting) return;
    setPhotos([]);
    setShooting(true);
    const captured= [];
    for (let shot = 0; shot < 4; shot += 1) {
      for (let tick = 3; tick > 0; tick -= 1) {
        setCountdown(tick);
        await wait(800);
      }
      setCountdown(0);
      const image = captureFrame();
      if (image) {
        captured.push(image);
        setPhotos([...captured]);
      }
      await wait(500);
    }
    setCountdown(null);
    setShooting(false);
  };

  const addPhotos = (event) => {
    const files = Array.from(event.target.files ?? []).slice(0, 4 - photos.length);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPhotos((current) => [...current, reader.result ].slice(0, 4));
        }
      };
      reader.readAsDataURL(file);
    });
    event.target.value = "";
  };

  const buildStrip = async () => {
    if (!photos.length) return null;
    const loaded = await Promise.all(
      photos.map(
        (source) =>
          new Promise((resolve) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.src = source;
          }),
      ),
    );
    const canvas = document.createElement("canvas");
    canvas.width = 720;
    canvas.height = 220 + loaded.length * 505;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.fillStyle = frameColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    loaded.forEach((image, index) => {
      const width = 624;
      const height = 455;
      const scale = Math.max(width / image.width, height / image.height);
      const cropWidth = width / scale;
      const cropHeight = height / scale;
      context.drawImage(
        image,
        (image.width - cropWidth) / 2,
        (image.height - cropHeight) / 2,
        cropWidth,
        cropHeight,
        48,
        48 + index * 505,
        width,
        height,
      );
    });
    context.fillStyle = frameColor === "#3a1f2b" ? "#fff4ee" : "#3a1f2b";
    context.textAlign = "center";
    context.font = "800 36px Arial";
    context.fillText("PHOTO FRENZY", 360, canvas.height - 92);
    context.font = "18px Arial";
    context.fillText(new Date().toLocaleDateString(), 360, canvas.height - 54);
    return canvas;
  };
  
  const downloadStrip = async () => {
    const canvas = await buildStrip();
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "photo-frenzy-strip.jpg";
    link.href = canvas.toDataURL("image/jpeg", 0.95);
    link.click();
  };
  
  const canShare =
  typeof navigator !== "undefined" &&
  !!navigator.canShare &&
  navigator.canShare({
    files: [new File([""], "test.jpg", { type: "image/jpeg" })],
  });

const shareStrip = async () => {
  const canvas = await buildStrip();
  if (!canvas) return;
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.95));
  const file = new File([blob], "photo-frenzy-strip.jpg", { type: "image/jpeg" });
  try {
    await navigator.share({ files: [file], title: "My Photo Frenzy strip" });
  } catch {
    // person closed the share sheet; nothing to do
  }
};
  
    

  const leaveBooth = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraReady(false);
    setPhotos([]);
    setView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const complete = photos.length === 4 && !shooting;

  return (
    <main className="site-shell">
      <header className="site-header">
        <button className="header-logo" type="button" onClick={leaveBooth}>
          <Logo />
        </button>
        <nav>
          <button type="button" onClick={enterBooth}>
            Filter Cam
          </button>
          <button type="button" onClick={enterBooth}>
            Frames
          </button>
          <button type="button" onClick={() => goHomeSection("how")}>
            How it works
          </button>
          <button type="button" onClick={() => goHomeSection("wall")}>
            The Wall
          </button>
        </nav>
        <button className="header-cta" type="button" onClick={enterBooth}>
          Photostrip <span>✦</span>
        </button>
      </header>

      {view === "home" ? (
        <>
          <section className="landing">
            <span className="corner-sticker camera-sticker">
              <CameraIcon />
            </span>
            <div className="landing-copy">
              <p className="scribble">welcome to the Friendsgiving Frenzy ♡</p>
              <h1>
                Your Online
                <br />
                <em>Photobooth</em>
              </h1>
              <p className="lead">
                Grab a friend and Strike a pose!
              </p>
              <p className="body-copy">
                Photo Frenzy turns your phone or laptop camera into a retro photo-strip booth. Pick
                a filter and frame, then download it instantly.
              </p>
              <button className="primary-button" type="button" onClick={enterBooth}>
                <CameraIcon /> Step into the booth <span>→</span>
              </button>
              <a className="how-link" href="#how">
                Wait, how does it work?
              </a>
            </div>
            <BoothIllustration />
            <PhotoWall />
          </section>

          <section className="how-section" id="how">
            <p className="scribble">four flashes, one forever thing</p>
            <h2>How the frenzy works</h2>
            <div className="how-grid">
              <article>
                <b>01</b>
                <h3>Pick your look</h3>
                <p>Choose a filter and the color of your paper frame.</p>
              </article>
              <article>
                <b>02</b>
                <h3>Pose four times</h3>
                <p>We count you in. Change it up between every flash.</p>
              </article>
              <article>
                <b>03</b>
                <h3>Save the evidence</h3>
                <p>Download your finished strip directly to your device.</p>
              </article>
            </div>
          </section>
        </>
      ) : (
        <section className="studio">
          <div className="studio-heading">
            <button type="button" onClick={leaveBooth}>
              ← lobby
            </button>
            <div>
              <p className="scribble">okay, superstar</p>
              <h1>
                Step into the <em>frenzy.</em>
              </h1>
            </div>
            <span>4 snaps · 3 seconds each</span>
          </div>

          <div className="studio-grid">
            <div className="camera-console">
              <div className="console-top">
                <span>PHOTO FRENZY AUTOMATIC CAMERA</span>
                <i>{cameraReady ? "READY" : "STANDBY"}</i>
              </div>
              <div className="camera-screen">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{ filter: filter.css }}
                  className={cameraReady ? "is-live" : ""}
                />
                {!cameraReady && (
                  <div className="camera-message">
                    <CameraIcon />
                    <b>{cameraError ? "Camera unavailable" : "Opening the curtain…"}</b>
                    <p>{cameraError || "Your browser will ask for camera permission."}</p>
                    {cameraError && (
                      <button type="button" onClick={startCamera}>
                        try camera again
                      </button>
                    )}
                  </div>
                )}
                {countdown !== null && (
                  <div className={`studio-countdown ${countdown === 0 ? "flash" : ""}`}>
                    {countdown || ""}
                  </div>
                )}
                <span className="shot-counter">{photos.length} / 4</span>
              </div>

              <div className="studio-controls">
                <div className="control-group">
                  <label>Filter</label>
                  <div className="filter-options">
                    {filters.map((item) => (
                      <button
                        type="button"
                        key={item.label}
                        className={filter.label === item.label ? "active" : ""}
                        onClick={() => setFilter(item)}
                        disabled={shooting}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  className="shutter-button"
                  type="button"
                  onClick={startPhotos}
                  disabled={!cameraReady || shooting}
                >
                  <span>
                    <CameraIcon />
                  </span>
                  {shooting
                    ? `taking photo ${photos.length + 1}`
                    : complete
                      ? "take them again"
                      : "start 4-photo session"}
                </button>
                <label className="upload-button">
                  or add photos from your device
                  <input type="file" accept="image/*" multiple onChange={addPhotos} />
                </label>
              </div>
            </div>

            <aside className="strip-workbench">
              <div className="workbench-title">
                <p className="scribble">your masterpiece</p>
                <span>choose paper</span>
              </div>
              <div className="frame-swatches">
                {["#fff4ee", "#f9a8c4", "#a8d8ea", "#3a1f2b"].map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Choose ${color} frame`}
                    className={frameColor === color ? "active" : ""}
                    style={{ background: color }}
                    onClick={() => setFrameColor(color)}
                  />
                ))}
              </div>
              <div className="result-strip" style={{ background: frameColor }}>
                {[0, 1, 2, 3].map((index) =>
                  photos[index] ? (
                    <img src={photos[index]} alt={`Photo ${index + 1}`} key={photos[index]} />
                  ) : (
                    <div className="empty-photo" key={index}>
                      <span>{index + 1}</span>
                    </div>
                  ),
                )}
                <Logo />
              </div>
              <button
                className="download-strip"
                type="button"
                onClick={downloadStrip}
                disabled={!photos.length}
              >
                download my strip ↓
              </button>
              {canShare && (
                <button
                  className="share-strip"
                  type="button"
                  onClick={shareStrip}
                  disabled={!photos.length}
                >
                  save or send to my phone ♡
                </button>
              )}
              {photos.length > 0 && (
                <button className="clear-strip" type="button" onClick={() => setPhotos([])}>
                  clear &amp; start over
                </button>
              )}
            </aside>
          </div>
        </section>
      )}

      <footer>
        <Logo />
        <p>Photos stay on your device. Always.</p>
        <span>made for spontaneous people</span>
      </footer>
    </main>
  );
}
