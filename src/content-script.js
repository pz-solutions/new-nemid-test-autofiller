import $ from "jquery";
if (window.location.href.startsWith("https://appletk.danid.dk/launcher/lmt")) {
  chrome.storage.local.get(["ntaf"], function(items) {
    const ntaf = items["ntaf"];
    if (ntaf) {
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
      const n = data.search(">" + keyCode + "<");
      const key = data.substring(n + 29, n + 29 + 6);
      callback(key);
    },
    error: function(xhr) {
      console.error("XHR ERROR:", xhr.status);
    },
  });
}

function FillOptCardCodeNew() {
  setTimeout(function() {
    const kcEncoded = $('div:contains("Nøglekort:")>span')
      .text()
      .replace(/-/g, "");
    const codeInput = $('input[aria-label="Indtast nøgle"]');

    if (codeInput && kcEncoded) {
      const keyCode = codeInput
        .parent()
        .parent()
        .text();

      getOptCardCode(kcEncoded, keyCode, function(key) {
        codeInput.each(function() {
          $(this).val(key);
        });
        setTimeout(function() {
          $("button[title^='Log på']").trigger("click");
        }, 500);
      });
    } else {
      FillOptCardCodeNew();
    }
  }, 500);
}

function ResolveNewNemIdLogin(ntaf) {
  setTimeout(function() {
    const button = $("button[title^='Fortsæt']");
    if (button.length) {
      $("input[aria-labeledby='userid-label']").each(function() {
        $(this).val(ntaf.name);
      });

      $("input[name='password'").each(function() {
        $(this).val(ntaf.password);
      });
      setTimeout(function() {
        button.trigger("click");
      }, 500);
      FillOptCardCodeNew();
    } else {
      ResolveNewNemIdLogin(ntaf);
    }
  }, 500);
}
