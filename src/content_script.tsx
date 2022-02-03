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

const doneCheck =
  (doneColumnId: string): MutationCallback =>
  () => {
    const newIssuesInDone = getIssuesInDone(doneColumnId);
    if (searchParameters !== getSearchParameters()) {
      console.log("Search parameters change");
      searchParameters = getSearchParameters();
    } else if (issuesInDone < newIssuesInDone) {
      console.log("Done column changed", issuesInDone, newIssuesInDone);
      confetti({
        particleCount: 1000,
        spread: 360,
        origin: { y: 0.6 },
        zIndex: 9999,
      });
    }
    issuesInDone = newIssuesInDone;
  };

const timeoutFunction = () => {
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
    setTimeout(timeoutFunction, 1000); // Poll until we
  }
};

console.log("Confetti Start");
setTimeout(timeoutFunction, 1000);
