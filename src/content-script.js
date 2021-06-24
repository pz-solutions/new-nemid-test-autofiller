import $ from "jquery";
if (
  window.location.href.substring(0, 37) ==
    "https://appletk.danid.dk/launcher/std" ||
  window.location.href.substring(0, 37) ==
    "https://appletk.danid.dk/launcher/lmt"
) {
  chrome.storage.local.get(["ntaf"], function(items) {
    var ntaf = items["ntaf"];
    if (!ntaf) {
      return;
    }
    console.log("NemID User:", ntaf.name, ntaf.password);
    if (
      window.location.href.substring(0, 37) ==
      "https://appletk.danid.dk/launcher/std"
    ) {
      ResolveOldNemIdLogin(ntaf);
    }

    if (
      window.location.href.substring(0, 37) ==
      "https://appletk.danid.dk/launcher/lmt"
    ) {
      ResolveNewNemIdLogin(ntaf);
    }
  });
}
function getOptCardCode(cardSerial, keyCode, callback) {
  $.ajax({
    url: "https://appletk.danid.dk/developers/OtpCard",
    type: "get",
    data: { CardSerial: cardSerial },
    success: function(data) {
      var n = data.search(">" + keyCode + "<");
      var key = data.substring(n + 29, n + 29 + 6);
      console.log("NemID Code:", cardSerial, keyCode, key);
      callback(key);
    },
    error: function(xhr, tst, err) {
      console.log("XHR ERROR:", xhr.status);
    },
  });
}
function FillOptCardCodeOld() {
  setTimeout(function() {
    chrome.storage.sync.get;
    var kcEncoded = $(".Keyheader")
      .prev()
      .text()
      .replace(/-/g, "");

    var keyCodeLabel = $(".normal-font-weight").filter(function() {
      return $(this)[0].innerText.match(/\d{4}/);
    });
    var keyCode = keyCodeLabel[0] && keyCodeLabel[0].innerText;
    if (keyCode && kcEncoded) {
      getOptCardCode(kcEncoded, keyCode, function(key) {
        $(".PIN").each(function(index) {
          console.log(this, key);
          $(this).val(key);
        });
        $(".Box-Button-Submit").click();
      });
    } else {
      FillOptCardCodeOld();
    }
  }, 1500);
}
function FillOptCardCodeNew() {
  setTimeout(function() {
    chrome.storage.sync.get;
    var kcEncoded = $(".otp__card-number")
      .text()
      .replace(/-/g, "");

    var keyCode = $(".otp__frame__cell").text();
    if (keyCode && kcEncoded) {
      getOptCardCode(kcEncoded, keyCode, function(key) {
        $(".otp-input").each(function(index) {
          $(this).val(key);
        });
        $(".button--submit").click();
      });
    } else {
      FillOptCardCodeNew();
    }
  }, 1500);
}
function ResolveOldNemIdLogin(ntaf) {
  setTimeout(function() {
    if ($(".Box-Button-Submit").length) {
      $(".input-2.person").each(function() {
        $(this).val(ntaf.name);
      });

      $(".verifier").each(function() {
        $(this).val(ntaf.password);
      });

      $(".Box-Button-Submit").click();
      FillOptCardCodeOld();
    } else {
      ResolveOldNemIdLogin(ntaf);
    }
  }, 1500);
}

function ResolveNewNemIdLogin(ntaf) {
  setTimeout(function() {
    if ($(".button--submit").length) {
      $("input[aria-labeledby*='userid-label']").each(function() {
        $(this).val(ntaf.name);
      });

      $("input[name*='password'").each(function() {
        $(this).val(ntaf.password);
      });

      $(".button--submit").click();
      FillOptCardCodeNew();
    } else {
      ResolveNewNemIdLogin(ntaf);
    }
  }, 1500);
}
