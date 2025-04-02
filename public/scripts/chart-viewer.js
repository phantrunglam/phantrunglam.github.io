document.addEventListener("DOMContentLoaded", function () {
  fetch("/scripts/chart-list.json")
    .then((response) => response.json())
    .then((data) => {
      const chartList = document.getElementById("chart_list");
      data.forEach((chart) => {
        let listItem = document.createElement("li");
        let link = document.createElement("a");
        link.href = "#";
        link.textContent = chart.image_desc;
        link.onclick = function () {
          showChart(chart.image_path);
        };
        listItem.appendChild(link);
        chartList.appendChild(listItem);
      });
    })
    .catch((error) => console.error("Error loading chart list:", error));
});

function showChart(imagePath) {
  const viewerFrame = document.getElementById("chart_viewer_iframe");
  const viewerSrc = `/scripts/view-webp.html?image=${imagePath}`;
  viewerFrame.src = viewerSrc;
}
