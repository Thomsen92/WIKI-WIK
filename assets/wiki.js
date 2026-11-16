(function () {
  var input = document.getElementById("q");
  var list = document.getElementById("results");
  if (!input || !list) return;
  var base = input.getAttribute("data-base") || "";
  var pages = null;

  function load() {
    if (pages) return Promise.resolve(pages);
    return fetch(base + "assets/pages.json")
      .then(function (r) { return r.json(); })
      .then(function (j) { pages = j; return j; })
      .catch(function () { pages = []; return pages; });
  }

  function render(items) {
    list.innerHTML = "";
    if (!items.length) { list.hidden = true; return; }
    items.slice(0, 8).forEach(function (p) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = base + p.u;
      a.textContent = p.t;
      var s = document.createElement("small");
      s.textContent = p.s;
      a.appendChild(s);
      li.appendChild(a);
      list.appendChild(li);
    });
    list.hidden = false;
  }

  input.addEventListener("input", function () {
    var q = input.value.trim().toLowerCase();
    if (!q) { list.hidden = true; return; }
    load().then(function (all) {
      render(all.filter(function (p) {
        return (p.t + " " + p.k + " " + p.s).toLowerCase().indexOf(q) !== -1;
      }));
    });
  });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { list.hidden = true; }
    if (e.key === "Enter") {
      var first = list.querySelector("a");
      if (first) { window.location.href = first.href; }
    }
  });
  document.addEventListener("click", function (e) {
    if (!list.contains(e.target) && e.target !== input) { list.hidden = true; }
  });
})();
