import confetti from "canvas-confetti";

let issuesInDone = 0;
let searchParameters = "";

const getSearchParameters = () => {
  const searchParameters = new URLSearchParams(location.search);
  return JSON.stringify([
    ...searchParameters.getAll("quickFilter"),
    ...searchParameters.getAll("search"),
  ]);
};

const getIssuesInDone = (id: string) =>
  window.document.evaluate(
    `count(//*[@data-column-id=${id}]//*[@data-issue-id])`,
    document
  ).numberValue;

const fireRandomConfetti = () => {
  const duration = 2 * 1000;
  const end = Date.now() + duration;
  const zIndex = 9999;
  const a = () => {
    (function frame() {
      confetti({
        particleCount: 10,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        zIndex,
      });
      confetti({
        particleCount: 10,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        zIndex,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };
  const b = () => {
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex,
    };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: NodeJS.Timeout = setInterval(() => {
      var timeLeft = end - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 150);
  };
  const options = [a, b];
  const firingOption = options[Math.floor(Math.random() * options.length)];

  firingOption && firingOption();
};

const doneCheck =
  (doneColumnId: string): MutationCallback =>
  () => {
    const newIssuesInDone = getIssuesInDone(doneColumnId);
    if (searchParameters !== getSearchParameters()) {
      console.log("Search parameters change");
      searchParameters = getSearchParameters();
    } else if (issuesInDone < newIssuesInDone) {
      console.log("Item added to done!", issuesInDone, newIssuesInDone);
      fireRandomConfetti();
    }
    issuesInDone = newIssuesInDone;
  };

const loadConfetti = () => {
  const columnLi = window.document
    .evaluate(
      "//*[@data-tooltip='Done']/ancestor::li[@data-id]/@data-id",
      document
    )
    .iterateNext();

  if (columnLi && columnLi.nodeValue) {
    issuesInDone = getIssuesInDone(columnLi.nodeValue);
    searchParameters = getSearchParameters();
    const observer = new MutationObserver(doneCheck(columnLi.nodeValue));
    observer.observe(document.body, {
      subtree: true,
      childList: true,
    });

    console.log(`Issues in done: ${issuesInDone}`);
  } else {
    console.log("Page not ready... retrying");
    setTimeout(loadConfetti, 1000); // Poll until can load. Or not. See if i care :D
  }
};

console.log("Confetti Start");
setTimeout(loadConfetti, 1000);
