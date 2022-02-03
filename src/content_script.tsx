import confetti from "canvas-confetti";

let issuesInDone = 0;

const doneCheck =
  (doneColumnId: string): MutationCallback =>
  (mutationRecord) => {
    console.log("change detected", mutationRecord);
    const newIssuesInDone = window.document.evaluate(
      `count(//*[@data-column-id=${doneColumnId}]//*[@data-issue-id])`,
      document
    ).numberValue;
    if (issuesInDone !== newIssuesInDone) {
      issuesInDone = newIssuesInDone;
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

const timeoutFunction = () => {
  const columnLi = window.document
    .evaluate(
      "//*[@data-tooltip='Done']/ancestor::li[@data-id]/@data-id",
      document
    )
    .iterateNext();

  if (columnLi && columnLi.nodeValue) {
    issuesInDone = window.document.evaluate(
      `count(//*[@data-column-id=${columnLi.nodeValue}]//*[@data-issue-id])`,
      document
    ).numberValue;
    const observer = new MutationObserver(doneCheck(columnLi.nodeValue));
    observer.observe(document.body, {
      subtree: true,
      childList: true,
    });

    console.log(`Issues in done: ${issuesInDone}`);
  } else {
    console.log("Page not ready... retrying");
    setTimeout(timeoutFunction, 1000); // Poll until we
  }
};

console.log("Confetti Start");
setTimeout(timeoutFunction, 1000);
