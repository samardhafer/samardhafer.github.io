(function () {
    if (sessionStorage.getItem("gh_bypassed") === "true") {
        document.documentElement.classList.add("gh-ready");
        return;
    }
    const style = document.createElement("style");
    style.id = "gh-maintenance-style";
    style.textContent = `
    html.gh-locked,
    body.gh-locked {
      overflow: hidden !important;
      height: 100% !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      touch-action: none !important;
      overscroll-behavior: none !important;
    }

    #gh-maintenance-overlay {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      width: 100dvw;
      height: 100dvh;
      background-color: #f2f2f2;
      color: #333333;
      font-family: Helvetica, Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      z-index: 2147483647;
      padding: 24px 20px;
      box-sizing: border-box;
      overflow: hidden;
      touch-action: none;
    }

    .gh-maintenance-content {
      max-width: 600px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .gh-constructocat {
      width: 100%;
      max-width: 340px;
      height: auto;
      mix-blend-mode: multiply;
      margin-bottom: 24px;
      user-select: none;
      pointer-events: none;
    }

    #gh-maintenance-overlay h1 {
      font-size: 24px;
      font-weight: 400;
      color: #222222;
      margin: 0 0 14px 0;
      line-height: 1.3;
      letter-spacing: -0.2px;
    }

    #gh-maintenance-overlay p {
      font-size: 14px;
      font-weight: 400;
      color: #444444;
      margin: 0 0 42px 0;
      line-height: 1.6;
    }

    #gh-maintenance-overlay a {
      color: #4183c4;
      text-decoration: underline;
    }

    #gh-maintenance-overlay a:hover {
      color: #2b5c8f;
    }

    .gh-wordmark {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-end;
      color: #cccccc;
      user-select: none;
      line-height: 1;
    }

    .gh-logo-main {
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 36px;
      font-weight: 700;
      letter-spacing: -1.8px;
    }

    .gh-logo-sub {
      font-size: 8.5px;
      font-weight: 700;
      letter-spacing: 0.4px;
      margin-top: -2px;
    }

    @media (max-width: 480px) {
      .gh-constructocat {
        max-width: 240px;
        margin-bottom: 20px;
      }
      #gh-maintenance-overlay h1 {
        font-size: 20px;
      }
      #gh-maintenance-overlay p {
        font-size: 13px;
        margin-bottom: 32px;
        padding: 0 10px;
      }
      .gh-logo-main {
        font-size: 30px;
      }
      .gh-logo-sub {
        font-size: 7.5px;
      }
    }
  `;
    document.head.appendChild(style);

    function mountOverlay() {
        if (document.getElementById("gh-maintenance-overlay")) return;

        document.documentElement.classList.add("gh-locked");
        document.body.classList.add("gh-locked");

        const overlay = document.createElement("div");
        overlay.id = "gh-maintenance-overlay";
        overlay.innerHTML = `
      <div class="gh-maintenance-content">
        <img
          src="constructocat.jpg"
          alt="Constructocat"
          class="gh-constructocat"
        />
        <h1>Sorry, we're down for maintenance</h1>
        <p>
          We'll be back up shortly. Check 
          <a href="http://status.github.com" target="_blank" rel="noopener">http://status.github.com</a> 
          or follow 
          <a href="https://x.com/github" target="_blank" rel="noopener noreferrer">@github</a> for updates.
        </p>
        <div class="gh-wordmark" aria-label="github social coding">
          <span class="gh-logo-main">github</span>
          <span class="gh-logo-sub">SOCIAL CODING</span>
        </div>
      </div>
    `;

        document.body.appendChild(overlay);
        document.documentElement.classList.add("gh-ready");

        const observer = new MutationObserver(() => {
            if (!document.getElementById("gh-maintenance-overlay")) {
                sessionStorage.setItem("gh_bypassed", "true");
                document.documentElement.classList.remove("gh-locked");
                document.body.classList.remove("gh-locked");
                document.documentElement.classList.add("gh-ready");
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true });
    }

    if (document.body) {
        mountOverlay();
    } else {
        document.addEventListener("DOMContentLoaded", mountOverlay);
    }
})();