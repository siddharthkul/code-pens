var iconWidth;
var numIcons;
var r = 2;
var a;
var k;
var tipOffset;
var arrowOffset;
var lA = new Array();
var sA = new Array();
var inside = 0;
$(function() {
  init();
  $(".icon").bind(
    "webkitTransitionEnd transitionend oTransitionEnd otransitionend MSTransitionEnd",
    function(e) {
      applyCSS($(this), "transition", "");
    }
  );
  $(".dock>.bg").bind(
    "webkitTransitionEnd transitionend oTransitionEnd otransitionend MSTransitionEnd",
    function(e) {
      applyCSS($(this), "transition", "");
    }
  );
  $(".dock>.tip").bind(
    "webkitTransitionEnd transitionend oTransitionEnd otransitionend MSTransitionEnd",
    function(e) {
      applyCSS($(this), "transition", "");
    }
  );
  $(".dock").hover(
    function(e) {
      iconWidth = $(this)
        .find(".icon")
        .width();
      numIcons = $(this).find(".icon").length;
      applyCSS($(this).children(".icon"), "transition", "all 0.2s ease-in-out");
      applyCSS($(this).children(".bg"), "transition", "all 0.2s ease-in-out");
      magnify(e, this);
      setTimeout(function() {
        inside = 1;
      }, 200);
    },
    function(e) {
      oriSize(e, this);
      inside = 0;
    }
  );
  $(".dock").mousemove(function(e) {
    if (inside == 0) return;
    magnify(e, this);
  });
});
function magnify(e, t) {
  a = getA(t, e.pageX);
  k = Math.floor(a);
  if (k >= numIcons) return;
  var o = -(getMax(a, k, k + 1) - 1) * (a - k) * iconWidth;
  var s = getMax(a, k, k + 1);
  lA[k] = o;
  sA[k] = s;
  for (i = k - 1; i >= 0; i--) {
    s = getMax(a, i, i + 1);
    o = o - (getMax(a, i, i + 1) - 1) * iconWidth;
    lA[i] = o;
    sA[i] = s;
  }
  o = (getMax(a, k, k + 1) - 1) * (k + 1 - a) * iconWidth;
  s = getMax(a, k + 1, k + 2);
  lA[k + 1] = o;
  sA[k + 1] = s;
  for (i = k + 2; i < numIcons; i++) {
    s = getMax(a, i, i + 1);
    o = o + (getMax(a, i - 1, i) - 1) * iconWidth;
    lA[i] = o;
    sA[i] = s;
  }
  var c = 0;
  $(t)
    .children(".icon")
    .each(function(a, b) {
    applyCSS(
      $(this),
      "transform",
      "translate(" + lA[a] + "px, 0) scale(" + sA[a] + "," + sA[a] + ")"
    );
    c += sA[a];
  });
  applyCSS(
    $(t).children(".bg"),
    "transform",
    "translate(" + lA[0] + "px, 0) scale(" + c / numIcons + ", 1)"
  );
  var d = $(t)
  .children(".icon:eq(" + k + ")")
  .find("a")
  .attr("title");
  $(t)
    .find(".tipText")
    .text(d);
  tipOffset =
    k * $(t).width() / numIcons +
    lA[k] +
    (sA[k] * iconWidth -
     $(t)
     .children(".tip")
     .outerWidth()) /
    2;
  applyCSS(
    $(t).children(".tip"),
    "transform",
    "translate(" + tipOffset + "px, " + (-50 - (r - 2) * iconWidth) + "px)"
  );
  arrowOffset =
    $(t)
    .children(".tip")
    .outerWidth() / 2;
  applyCSS(
    $(t).find(".tip>.arrow"),
    "transform",
    "translate(" + arrowOffset + "px, 0) rotate(-45deg)"
  );
  $(t)
    .children(".tip")
    .css("opacity", "1");
}
function oriSize(e, t) {
  var a = $(t).offset();
  if (
    e.pageX >= a.left &&
    e.pageX <= a.left + $(t).width() &&
    e.pageY >= a.top &&
    e.pageY <= a.top + $(t).height()
  ) {
    applyCSS($(".icon"), "transition", "");
    applyCSS($(".dock>.bg"), "transition", "");
    return;
  }
  applyCSS($(t).children(".icon"), "transition", "all 0.2s ease-in-out");
  applyCSS($(t).children(".icon"), "transform", "");
  applyCSS($(t).children(".bg"), "transition", "all 0.2s ease-in-out");
  applyCSS($(t).children(".bg"), "transform", "");
  applyCSS($(t).children(".tip"), "transition", "all 0.2s ease-in-out");
  $(t)
    .children(".tip")
    .css("opacity", "0");
  tipOffset =
    k * $(t).width() / numIcons +
    (iconWidth -
     $(t)
     .children(".tip")
     .outerWidth()) /
    2;
  applyCSS(
    $(t).children(".tip"),
    "transform",
    "translate(" + tipOffset + "px, " + 0 + "px)"
  );
}
function getMax(a, m, n) {
  if (m > n || a < 0 || a > numIcons) {
    return -1;
  }
  if (a <= m) {
    if (m > a + r - 1) return 1;
    return a + r - m;
  }
  if (a >= n) {
    if (n < a - r + 1) return 1;
    return n - a + r;
  }
  if (m < a && a < n) {
    return r;
  }
}
function getA(t, c) {
  var a = (c - $(t).offset().left) / iconWidth;
  if (a < 0) a = 0;
  if (a > numIcons) a = numIcons;
  return a;
}
function applyCSS(t, p, v) {
  $(t).css("-webkit-" + p, v);
  $(t).css("-moz-" + p, v);
  $(t).css("-o-" + p, v);
  $(t).css(p, v);
}
function init() {
  $(".dock").each(function(a, b) {
    $(this).css(
      "width",
      $(this)
      .find(".icon")
      .width() * $(this).find(".icon").length
    );
    $(this).css(
      "height",
      $(this)
      .find(".icon")
      .height()
    );
  });
}