function parseResponse(response) {
  if (response.replaces instanceof Array) {
    for (var i = 0, ilen = response.replaces.length; i < ilen; i++) {
      $(response.replaces[i].what).replaceWith(response.replaces[i].data);
    }
  }
  if (response.append instanceof Array) {
    for (i = 0, ilen = response.append.length; i < ilen; i++) {
      $(response.append[i].what).append(response.append[i].data);
    }
  }
  if (response.content instanceof Array) {
    for (i = 0, ilen = response.content.length; i < ilen; i++) {
      $(response.content[i].what).html(response.content[i].data);
    }
  }
  if (response.js) {
    $("body").append(response.js);
  }
  if (response.refresh) {
    window.location.reload(true);
  }
  if (response.redirect) {
    window.location.href = response.redirect;
  }
  if (response.popup) {
    showPopup(response.popup);
  }
  if (response.initSelector) {
    initMaskInput(response.initSelector);
    initDropDown(response.initSelector);
    initSvgIcons(response.initSelector);
    initAutocompleteFields(response.initSelector);
    initDatepicker(response.initSelector);
    initAjaxSelect(response.initSelector);
    initDeleteBtn(response.initSelector);
  }
  if (response.submitSelector) {
    submitForm(response.submitSelector);
  }
}

$(function() {
  $(document).on("click", "a.ajax-link", function(event) {
    event.preventDefault();
    var that = this;
    if ($(that).data("confirm") && !confirm($(that).data("confirm"))) {
      return false;
    }
    jQuery.ajax({
      cache: false,
      type: "POST",
      dataType: "json",
      data: $(that).data("params"),
      success: function(response) {
        parseResponse(response);
      },
      error: function(response) {
        alert(response.responseText);
      },
      beforeSend: function() {},
      complete: function() {},
      url: that.href
    });
    return false;
  });

  $(document).on(
    "change",
    'form.instant-ajax-form input[type="checkbox"]',
    function() {
      var form = $(this).closest("form");
      sendAjax(form.serialize(), form.attr("action"));
    }
  );

  $(document).on("submit", "form.ajax-form", function(event) {
    event.preventDefault();
    sendAjax($(this).serialize(), $(this).attr("action"));
  });

  $(document).on("focus", "input.nested-input", function() {
    $(this)
      .closest("label")
      .prev('input[type="radio"]')
      .click();
  });

  $(document).on("click", ".def-adr-sets", function(e) {
    var currentEl = $(this);
    var url = currentEl.attr("actionurl");
    var addressId = currentEl.attr("addressid");
    var addressDeliveryType = currentEl.attr("addresstype");
    jQuery.ajax({
      type: "POST",
      url: url,
      dataType: "json",
      data: {
        addressId: addressId,
        addressDeliveryType: addressDeliveryType
      },
      success: function(data) {
        console.log(data);
      }
    });

    $(".def-adr-sets").prop("checked", false);
    currentEl.prop("checked", true);
  });

  $(document).on("change", ".ship_address_pre_delivery", function(event) {
    var target = $(".block-for-pre-delivery-if-address");
    if ($(this).val() < 100) {
      target.hide();
      $(".shipmentform_pre_delivery_pay_type")
        .val("")
        .trigger("change");
      $(".shipmentform_internal_courier_cost_uah").val("");
    } else target.show();
  });
});

$(function() {
  var input = $("#tags1");
  input.on("keyup", function() {
    var url = $(this).data("url");
    jQuery.ajax({
      type: "POST",
      url: url,
      dataType: "json",
      data: {
        search: this.value
      },
      success: function(data) {
        var dataResult = $.each(data, function(index, value) {
          return {
            id: index,
            label: value.label,
            alias: value.alias
          };
        });
        input
          .autocomplete({
            source: dataResult,
            open: function open() {}
          })
          .autocomplete("instance")._renderItem = function(ul, item) {
          console.log(item);
          var re = new RegExp(this.term, "i");
          var t = item.label.replace(
            re,
            '<span style="font-weight:bold; color:#666;">' + "$&" + "</span>"
          );
          // console.log(item.id);
          return $("<li></li>")
            .data("item.autocomplete", item)
            .append("<a href='" + item.alias + "'>" + t + "</a>")
            .appendTo(ul);
        };
      }
    });
  });
});

$(document).ready(function() {
  $("#play-video").on("click", function(event) {
    $("#video-trigger").addClass("removed");
    $("#video").addClass("watch");
    $("#video")[0].src += "?autoplay=1";
    event.preventDefault();
  });
});

//Youtube video button second
$(document).ready(function() {
  $("#play-video-new").on("click", function(event) {
    $("#video-trigger-new").addClass("removed");
    $("#video-new").addClass("watch");
    $("#video-new")[0].src += "?autoplay=1";

    event.preventDefault();
  });
});

$(function() {
  element = $(".about-company-text i");
  element.append(
    ' <svg class="icon__txt-pin" width="11px" height="16px"><use xlink:href="#txt-pin"></use></svg>'
  );
});

$(document).ready(function() {
  $(document).on("click", "a.pc_goto", function(e) {
    e.preventDefault();
    $.fancybox({
      content: $(".pop-up__wrap-pc").html(),
      width: 620,
      height: 550,
      padding: 0,
      scrolling: "no",
      helpers: {
        overlay: {
          showCloseButton: true,
          css: {
            background: "rgba(0, 0, 0, 0.7)"
          }
        }
      }
    });
  });

  $(document).on("click", "a.pc_goto-login", function(e) {
    e.preventDefault();
    $.fancybox({
      content: $(".pop-up__wrap-pc-login").html(),
      width: 620,
      height: 550,
      padding: 0,
      scrolling: "no",
      helpers: {
        overlay: {
          showCloseButton: true,
          css: {
            background: "rgba(0, 0, 0, 0.7)"
          }
        }
      }
    });
  });

  //twitter increment counter
  $("#increase-tweet").on("click", function() {
    var element = $("#increase-tweet");
    // console.log(element.data('url'));
    $.ajax({
      method: "post",
      url: element.data("url"),
      success: function(data) {
        console.log(data);
      }
    });
  });
  // Auto redirect for external links
  $(function() {
    $("a").each(function() {
      var a = new RegExp("/" + window.location.host + "/");
      var e = /([-a-zA-Z0-9@:%_\+.~#?&\/\/=]{2,256}\.[a-z]{2,4}\b(\/?[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?)/gi;
      var b = new RegExp(e);
      var excepts = "http://www.old.easyxpress.com.ua";
      if (
        this.href &&
        b.test(this.href) &&
        !a.test(this.href) &&
        this.href.indexOf(excepts) === -1
      ) {
        var currentHref = $(this).attr("href");
        var url = encodeURIComponent(currentHref);
        var lowerUrl = url.toLowerCase();
        $(this).attr("href", "/go?url=" + lowerUrl);
        $(this).attr("rel", "nofollow");
      }
    });
  });
});

$("form.promocod").on("beforeSubmit", function() {
  var form = $(this);
  $.post(form.attr("action"), form.serialize()).done(function(result) {
    console.log(result);
    if (result.success) {
      $(".promocod")
        .find('button[type="submit"]')
        .addClass("done");
      setTimeout(function() {
        $(".progress-button").addClass("all");
      }, 3000);
    } else {
      console.log(result.success);
    }
  });
  return false;
});

$(document).ready(function() {
  initDropDown("body");
  initDeleteBtn("body");
  initAjaxSelect("body");
  initMaskInput("body");

  $(function() {
    $("input[type='tel']")
      .mask("+38 (999)-999-99-99")
      .mousedown(function() {
        // /* if ($(this).mask() == '') {
        //      $(this).val('+380');
        //  }*/
      });
  });
  initAutocompleteFields();
  $(document).on("click", "a.address-ajax-link", function(event) {
    event.preventDefault();
    sendAjax(null, $(this).attr("href"));
  });

  $(document).on("submit", "form.ajax-address-form", function(event) {
    event.preventDefault();

    sendAjax($(this).serialize(), $(this).attr("action"));
  });

  $(document).on("click", "a.address-submit-link", function(event) {
    event.preventDefault();
    var form = $(this).closest("form");

    form.submit();
  });

  $(document).on("click", ".form-submitter", function(event) {
    event.preventDefault();
    var form = $(this).closest("form");

    form.submit();
  });

  showPopup(".show-on-load");
  showAddressPopup();

  $(document).on("change", ".show-hide-provider", function() {
    var showHideSelector = $(this).data("show-hide-selector"),
      value = $(this).is(":checked") ? 1 : 0,
      hideValue = $(this).data("hide-value");
    $(showHideSelector).removeAttr("disabled");
    $(showHideSelector + "-" + value).attr("disabled", "disabled");
    if (hideValue) {
      $(showHideSelector).val("");
      $(showHideSelector + "-" + value).val(hideValue);
    }
  });

  $(document).on("change", "#switch", function() {
    var value = $(this).is(":checked") ? 1 : 0,
      attribute = $(this).data("attribute"),
      url = $(this).data("url"),
      params = {};
    params[attribute] = value;
    sendAjax(params, url, "POST", "JSON", false, false);
  });

  $(document).on("keyup", ".customs-alert", function() {
    var threshold = parseFloatWithComa($(this).data("threshold-value"));
    var value = parseFloatWithComa($(this).val());
    var coef = 0.32;

    if (value != undefined && threshold != undefined && value >= threshold) {
      $(".customs-block").removeClass("do-not-show");
      var result = roundNumber((value - threshold) * coef, 2);
      $(".customs-price-block").html(result);
    } else {
      $(".customs-block").addClass("do-not-show");
    }
  });

  $(document).on("click", ".custom-ajax-link", function(event) {
    event.preventDefault();
    sendAjax({}, $(this).attr("href"), "POST", "JSON", true, true);
  });

  $(document).on("click", ".address-dont-save-link", function(event) {
    event.preventDefault();
    $(this)
      .closest("form")
      .remove();
  });

  $(document).on("click", ".show_all", function() {
    $(this)
      .parent()
      .siblings(".hided-addresses")
      .removeClass("do-not-show");
  });

  $(document).on("click", ".hide_all", function() {
    $(this)
      .parent()
      .siblings(".hided-addresses")
      .addClass("do-not-show");
  });

  $(document).on("click", ".popup-btn", function(event) {
    var url = $(this).attr("href");
    event.preventDefault();
    $.fancybox({
      type: "ajax",
      href: url,
      width: 620,
      height: 550,
      padding: 0,
      scrolling: "no",
      afterShow: function() {
        initDropDownInPopup();
        initMaskInput("#necessary-form-container");
        initAutocompleteFields("#necessary-form-container");
      },
      helpers: {
        overlay: {
          showCloseButton: true,
          css: {
            background: "rgba(0, 0, 0, 0.7)"
          }
        }
      }
    });
  });

  var shipmentListPjaxContainer = $("#shipment-list-container");
  shipmentListPjaxContainer.on("pjax:start", function() {
    var preloader = $(this).find(".position-cube"),
      preloaderContainer = $(this).find(".cube-container-outer");
    if (preloaderContainer.length && preloader.length) {
      $(this)
        .find(".tp-content-item-start")
        .css("display", "none");
      preloaderContainer.css("display", "block");
      preloader.css("display", "block");
    }
  });
  shipmentListPjaxContainer.on("pjax:complete", function() {
    var preloader = $(this).find(".position-cube"),
      preloaderContainer = $(this).find(".cube-container-outer");
    if (preloaderContainer.length && preloader.length) {
      $(this)
        .find(".tp-content-item-start")
        .css("display", "block");
      preloaderContainer.css("display", "none");
      preloader.css("display", "none");
    }
  });

  $(document).on("pjax:complete", function() {
    $(this)
      .find(".js-fancybox-close")
      .on("click", function(event) {
        event.preventDefault();
        $.fancybox.close();
      });
    initSvgIcons(this);
  });

  $(document).on("click", ".print-btn", function(event) {
    event.preventDefault();
    window.print();
  });

  $(document).on(
    "change",
    "input[type=radio].address-type-provider",
    function() {
      var that = $(this),
        value = $(that).val(),
        form = $(that).closest("form");
      form.find(".address-type-show-hide").each(function() {
        $(this)
          .find("input")
          .val("")
          .attr("disabled", true);
        $(this)
          .find("select")
          .val("")
          .trigger("change")
          .attr("disabled", true);
        $(this).addClass("do-not-show");
      });

      form.find(".address-type-show-" + value).each(function() {
        $(this)
          .find("input")
          .attr("disabled", false);
        $(this)
          .find("select")
          .attr("disabled", false);
        $(this).removeClass("do-not-show");
      });
    }
  );

  $(document).on("change", "select.region-provider", function() {
    var form = $(this).closest("form");
    resetAjaxDropdown(form.find("select.city-provider"));
    resetAjaxDropdown(form.find("select.warehouse-provider"));
    $("input.region-reset-input").val("");
  });

  $(document).on("change", "select.city-provider", function() {
    var form = $(this).closest("form");
    resetAjaxDropdown(form.find("select.warehouse-provider"));
  });

  $(document).on("change", "select.address-provider", function() {
    var typeProvider = $(this)
        .closest("form")
        .find("input.type-provider"),
      url = $(this).data("url"),
      params = {};
    params[$(this).attr("name")] = $(this)
      .find("option:selected")
      .val();
    params[typeProvider.attr("name")] = typeProvider.val();
    sendAjax(params, url, "POST", "JSON", true, true);
  });

  $(document).on("click", "a.custom-popup-fancy", function(event) {
    event.preventDefault();
    showPopup($(this).attr("href"));
  });

  /*Copy to clipboard*/
  $("#address-popup a.orange").each(function(i, lnk) {
    var link = $(lnk),
      name = link.parent().prev("td");
    link.on("click", function(e) {
      var success = false;

      if (window.clipboardData) {
        /*IE*/
        success = window.clipboardData.setData("Text", name.text());
      } else if (document.execCommand) {
        /*Major browsers*/
        var temp = $("<input/>", { type: "text", value: name.text() })
          .css({
            position: "absolute",
            top: -99999,
            left: -99999
          })
          .attr("readOnly", true)
          .appendTo("body")
          .focus()
          .select();

        success = document.execCommand("copy");
        temp.remove();
      }
      name
        .find(".up-text")
        .remove()
        .end()
        .css({ position: "relative" })
        .append(
          $("<span />", {
            class: "up-text",
            text: name.text(),
            css: { color: "#000", position: "absolute", top: 0, left: 0 }
          }).animate({ top: -50, opacity: 0 }, 250, function() {
            $(this).remove();
          })
        );

      e.preventDefault();
    });
  });

  $(window).bind("beforeunload", function(e) {
    var message = $(".message-provider").attr("data-confirm-message"),
      incompleteFormExists = $("form.incomplete-form").length;
    if (message && incompleteFormExists) {
      var e = e || window.event;

      if (e) {
        e.returnValue = message;
      }

      // For Safari
      return message;
    }
  });

  $(document).on("click", ".play-video", function(event) {
    var videoFrame = $("#faq-video-" + $(this).data("video-id"));
    if (videoFrame.length) {
      videoFrame.addClass("watch");
      videoFrame[0].src += "?autoplay=1";
    }
  });

  $(document).on("click", ".liqpay-form-submitter", function(event) {
    event.preventDefault();
    var formWrapperId = $(this).data("form-wrapper-id");
    if (formWrapperId) {
      $("#" + formWrapperId + " form").submit();
    }
  });

  $(document).on("change", ".description-visibility-provider", function() {
    var value = $(".description-visibility-provider option:selected").val();
    // 6 - С‚РёРї С‚РѕРІР°СЂР° РёР· СЃРїРёСЃРєР° "РўРµС…РЅРёРєР° Рё СЌР»РµРєС‚СЂРѕРЅРёРєР°"
    if (value == 6) {
      $(".mark-repack input").removeAttr("checked");
      $(".mark-repack").addClass("do-not-show");
    } else {
      $(".mark-repack").removeClass("do-not-show");
    }
  });

  $(document).on("change", ".is-service-ship-check", function() {
    var checkCommentBlock = $(".service-check-shipment-comment-block");
    var checkComment = $("#shipmentform-service_check_shipment_comment");

    if (this.checked) {
      checkCommentBlock.removeClass("do-not-show");

      setTimeout(function() {
        checkComment.focus();
        checkCommentBlock
          .css({ opacity: 0.5 })
          .animate({ opacity: 1 }, 300, function() {
            checkCommentBlock
              .css({ opacity: 0.5 })
              .animate({ opacity: 1 }, 300);
          });
      });
    } else {
      checkComment.val("");
      checkCommentBlock.addClass("do-not-show");
    }
  });

  $(document).on("change", "#service-checkbox-205", function() {
    var checkRepackBlock = $("#service-checkbox-39");

    if (this.checked) {
      checkRepackBlock.attr("disabled", "disabled");
    } else {
      checkRepackBlock.removeAttr("disabled");
    }
  });

  $(document).on("change", "#service-checkbox-39", function() {
    var checkNotRepackBlock = $("#service-checkbox-205");

    if (this.checked) {
      checkNotRepackBlock.attr("disabled", "disabled");
    } else {
      checkNotRepackBlock.removeAttr("disabled");
    }
  });

  if ($("#service-checkbox-39").attr("checked")) {
    $("#service-checkbox-205").attr("disabled", "disabled");
  }

  if ($("#service-checkbox-205").attr("checked")) {
    $("#service-checkbox-39").attr("disabled", "disabled");
  }

  function showHideErrorForShipmentDescriptionOnNonCyrillic(showError) {
    var descBlock = $("#shipmentform-description-block");
    var errorBlock = $("#shipmentform-description-error");
    if (showError) {
      descBlock.addClass("has-error");
      errorBlock.html(errorBlock.attr("noCyrillicText"));
    } else {
      descBlock.removeClass("has-error");
      errorBlock.html("");
    }
  }

  $(document).on("keydown", "#shipmentform-description", function(event) {
    showHideErrorForShipmentDescriptionOnNonCyrillic(false);
  });

  $(document).on("keypress", "#shipmentform-description", function(event) {
    var reg = /[Р°-СЏРђ-РЇС‘РЃ]/g;
    if (reg.test(String.fromCharCode(event.which))) {
      showHideErrorForShipmentDescriptionOnNonCyrillic(true);
      return false;
    }
  });

  $(document).on("click", ".select-address-link-in-shipment", function(event) {
    event.preventDefault();
    var addressData = $(this);
    $("#address_pre_delivery").val(addressData.attr("addressid"));
    $("#pre_delivery_pay_type").val(addressData.attr("delivery_pay_type_id"));
    $("#pre_delivery_courier_cost_type").val(
      addressData.attr("internal_courier_cost_type_id")
    );

    $("#fioText").html(addressData.attr("fio_text"));
    $("#cityText").html(addressData.attr("city_text"));
    $("#streetPrefix").html(addressData.attr("street_prefix"));
    $("#streetText").html(addressData.attr("street_text"));
    $("#deliveryPayTypeText").html(addressData.attr("delivery_pay_type_text"));
    $("#internalCourierCostTypeText").html(
      addressData.attr("internal_courier_cost_type_text")
    );
    $("#courier").val(0);
    $("#delivery-np").hide();
    $("#delivery-mercury").hide();

    if (
      addressData.attr("city_text") === "РљРёС—РІ" &&
      addressData.attr("street_prefix")
    ) {
      $("#courier").val(0);
      $("#delivery-np").show();
      $("#delivery-mercury").hide();
    }

    if (
      addressData.attr("city_text") === "РљРёС—РІ" &&
      !addressData.attr("street_prefix")
    ) {
      $("#courier").val(0); //Disabled mercury was 1
      $("#delivery-np").hide();
      $("#delivery-mercury").show();
    }

    if (addressData.attr("city_text")) {
      if (
        addressData.attr("city_text") !== "РљРёС—РІ" &&
        addressData.attr("street_prefix")
      ) {
        $("#courier").val(0);
        $("#delivery-np").show();
        $("#delivery-mercury").hide();
      }

      if (
        addressData.attr("city_text") !== "РљРёС—РІ" &&
        !addressData.attr("street_prefix") &&
        addressData.attr("internal_courier_cost_type_text")
      ) {
        $("#courier").val(0);
        $("#delivery-np").show();
        $("#delivery-mercury").hide();
      }
    }
    $("#block-select-address-in-shipment").hide();
    $("#shipment-main-data-container").show();
  });

  $(document).on("click", ".change-address-delivery-in-shipment", function(
    event
  ) {
    $("#shipment-main-data-container").hide();
    $("#block-select-address-in-shipment").show();
  });

  $(document).on("click", "a.social-popup", function(event) {
    event.preventDefault();
    var popupId = $(this).attr("href");
    showPopup(popupId);
  });

  $(document).on("pjax:complete", function() {
    initDropDownInPopup();
    initMaskInput("#necessary-form-container");
    initAutocompleteFields("#necessary-form-container");
  });
});

function resetAjaxDropdown(selector) {
  selector.val("").trigger("change");
}

function initAutocompleteFields(selector) {
  if (typeof selector !== "undefined") {
    $(selector)
      .find(".input-auto")
      .each(function() {
        initAutocompleteField($(this));
      });
  } else {
    var autoInput = $(".input-auto");
    if (autoInput.length) {
      initAutocompleteField(autoInput);
    }
  }
}

function initAutocompleteField(selector) {
  var url = selector.data("autocomplete-url");
  selector
    .autocomplete({
      source: function(request, response) {
        $.ajax({
          url: url,
          dataType: "JSON",
          data: {
            term: request.term,
            region: selector
              .closest("form")
              .find(".region-provider option:selected")
              .val()
          },
          success: function(data) {
            response(
              $.map(data, function(item) {
                return {
                  value: item.label
                };
              })
            );
          }
        });
      },
      minLength: 0,
      open: function open() {
        if ($(selector).hasClass("popup-input")) {
          $(".ui-autocomplete").addClass("auto-popup");
        } else if ($("section.my-data").length) {
          $(".ui-autocomplete").addClass("auto-width-prof");
        } else if ($(selector).hasClass("on-line")) {
          $(".ui-autocomplete").addClass("auto-width__magaz");
        } else {
          $(".ui-autocomplete").addClass("auto-width__all");
        }
      },
      close: function close() {
        $(".ui-autocomplete").removeClass("active");
      }
    })
    .focus(function() {
      $(this).autocomplete("search", $(this).val());
      if ($(selector).hasClass("popup-input")) {
        $(".ui-autocomplete").addClass("popup-auto-width");
      } else if ($("section.my-data").length) {
        $(".ui-autocomplete").addClass("auto-width_left");
      }
    })
    .autocomplete("instance")._renderItem = function(ul, item) {
    var re = new RegExp(this.term, "i");
    var t = item.label.replace(
      re,
      '<span style="font-weight:bold; color:#666;">' + "$&" + "</span>"
    );
    return $("<li></li>")
      .data("item.autocomplete", item)
      .append("<a>" + t + "</a>")
      .appendTo("ul.ui-autocomplete");
  };
  if ($(selector).hasClass("popup-input")) {
    $(".ui-autocomplete").addClass("popup-auto-width");
  } else if (!$("section.my-data").length) {
    $(".ui-autocomplete").addClass("auto-width__all");
  } else if ($(selector).hasClass("on-line")) {
    $(".ui-autocomplete").addClass("auto-width__magaz");
  }
}

function sendAjax(params, url, method, dataType, parseResult, showError) {
  method = typeof method !== "undefined" ? method : "POST";
  dataType = typeof dataType !== "undefined" ? dataType : "JSON";
  parseResult = typeof parseResult !== "undefined" ? parseResult : true;
  showError = typeof showError !== "undefined" ? showError : true;

  $.ajax({
    cache: false,
    dataType: dataType,
    type: method,
    data: params,
    success: function(response) {
      if (parseResult) {
        parseResponse(response);
      }
    },
    error: function(response) {
      if (showError) {
        alert(response.responseText);
      }
    },
    url: url
  });
}

function initSvgIcons(selector) {
  $(selector)
    .find("svg:has(use)")
    .each(function(index, el) {
      var link = $("symbol" + $("use", el).attr("xlink:href")),
        vBox =
          link.get(0) && link.get(0).viewBox.baseVal
            ? $.map(link.get(0).viewBox.baseVal, function(v, i) {
                return v;
              }).join(" ")
            : "";

      $(el)
        .attr({
          id: link.attr("id"),
          height: $(el).height(),
          width: $(el).width(),
          viewBox: vBox
        })
        .empty()
        .append(link.children().clone());
    });
}

function initMaskInput(selector) {
  $(selector)
    .find(".tel-mask")
    .each(function() {
      $(this)
        .mask("+38 (999)-999-99-99")
        .mousedown(function() {});
    });
}

function initDropDown(selector) {
  $(selector)
    .find(".select-field")
    .not(".no-sel")
    .each(function() {
      Element = $(this);
      parentElement = Element.next();
      Element.select2({
        theme: "filter",
        dropdownParent: parentElement,
        showSearchBox: false,
        width: "auto"
      });
    });
  $(selector)
    .find(".select2-selection--single")
    .each(function() {
      $(this).addClass("active");
    });
}

function showPopup(selector) {
  $.fancybox({
    content: $(selector).html(),
    arrows: false,
    width: 620,
    height: 550,
    padding: 0,
    scrolling: "no",
    helpers: {
      overlay: {
        showCloseButton: true,
        css: {
          background: "rgba(0, 0, 0, 0.7)"
        }
      }
    }
  });
  $(".js-fancybox-close").on("click", function(event) {
    event.preventDefault();
    $.fancybox.close();
  });
}

function initDatepicker(selector) {
  $(selector)
    .find(".datepicker")
    .datepicker({
      changeMonth: true,
      changeYear: true,
      showOtherMonths: true,
      selectOtherMonths: true,
      dateFormat: "yy-mm-dd",
      yearRange: "1900:c+nn"
    });
}

function initAjaxSelect(selector) {
  $(selector)
    .find(".ajax-select")
    .each(function() {
      var Element = $(this),
        dataAjaxUrl = Element.data("url"),
        theme = Element.data("theme");
      Element.select2({
        theme: theme,
        dropdownParent: parentElement,
        showSearchBox: false,
        width: "auto",
        quietMillis: 1500,
        ajax: {
          url: dataAjaxUrl,
          dataType: "json",
          delay: 500,
          data: function(params) {
            return {
              term: params.term,
              region: Element.closest("form")
                .find(".region-provider option:selected")
                .val(),
              city: Element.closest("form")
                .find(".city-provider option:selected")
                .val(),
              exclude: Element.closest("form")
                .find(".exclude-warehouse")
                .val()
            };
          }
        }
      });
    });
  $(selector)
    .find(".select2-selection--single")
    .each(function() {
      $(this).addClass("active");
    });
}

function initDeleteBtn(selector) {
  $(selector)
    .find(".del")
    .each(function() {
      $(this).on("click", function(event) {
        event.preventDefault();
        $(this)
          .parent()
          .find(".choose")
          .addClass("toleft");
      });
    });
  $(selector)
    .find(".choose_cancel")
    .each(function() {
      $(this).on("click", function(event) {
        event.preventDefault();
        if (
          $(this)
            .parent()
            .prev()
            .hasClass("table-wrap__delete")
        ) {
          $(this)
            .parent()
            .removeClass("toright");
        } else {
          $(this)
            .closest(".choose")
            .removeClass("toleft");
        }
      });
    });
}

function submitForm(submitSelector) {
  $(submitSelector + " form").submit();
}

function parseFloatWithComa(valueToParse) {
  var valueToReplace = String(valueToParse);
  if (valueToReplace) {
    var value = valueToReplace.replace(",", ".");

    if (/^\d+(\.\d+)?$/.test(value)) {
      return Number(value);
    }
  }
  return undefined;
}

function showAddressPopup() {
  if (
    $("section.page__wrapper").data("show-address-popup") === 1 &&
    $(".show-on-load").length == 0
  ) {
    showPopup("#address-popup");
  }
}

function initDropDownInPopup() {
  $(".select-pop").each(function() {
    Element = $(this);
    parentElement = Element.next();
    Element.select2({
      theme: "filter",
      dropdownParent: parentElement,
      showSearchBox: false,
      width: "auto"
    });
  });
  $(".select2-container--filter").addClass("popup-filter");
}

function roundNumber(number, precision) {
  var factor = Math.pow(10, precision);
  var tempNumber = number * factor;
  var roundedTempNumber = Math.round(tempNumber);
  return roundedTempNumber / factor;
}

$(document).on("click", ".lang-link", function(event) {
  var link = $(this);
  window.location.href = link.data("lang");
});

$(document).on("click", ".parent-item", function(event) {
  $(".menu-item-list").show();
  $(".parent-item").addClass("clicked-parent-item");
});

$(document).on("click", ".clicked-parent-item", function(event) {
  $(".menu-item-list").hide();
  $(".parent-item").removeClass("clicked-parent-item");
});

$(".parent-item, .menu-item-list").hover(
  function() {
    $(".menu-item-list").show();
  },
  function() {
    $(".menu-item-list").hide();
  }
);

$(document).on("click change", "input[type=text]#addressfrom-city", function(
  event
) {
  var element = $(this);
  var val = $.trim(element.val());
  if (val === "РљРёС—РІ") {
    $("#delivery_m").show();
    $("#delivery_np").hide();
  } else {
    $("#delivery_np").show();
    $("#delivery_m").hide();
  }
});

$(document).on("click change", "input[type=text]#addressfrom-city", function(
  event
) {
  var element = $(this);
  var val = $.trim(element.val());
  if (val === "РљРёС—РІ") {
    $("#delivery_m").show();
    $("#delivery_np").hide();
  } else {
    $("#delivery_np").show();
    $("#delivery_m").hide();
  }
});

$(document).on("click change", "select#addressfrom-city", function(event) {
  $("#delivery_np").show();
});

$(document).ready(function() {
  var courier = $("#courier").val();
  var streetPrefix = $("#streetPrefix").val();
  var addressPreDelivery = $("#address_pre_delivery").val();

  if (courier === "0" && streetPrefix) {
    $("#delivery-np").show();
    $("#delivery-mercury").hide();
  }
  if (courier === "0" && streetPrefix === "" && addressPreDelivery !== "1") {
    $("#delivery-np").show();
    $("#delivery-mercury").hide();
  }
  if (courier === "1" && streetPrefix === "") {
    $("#delivery-mercury").show();
    $("#delivery-np").hide();
  }
});

$(document).on(
  "beforeSubmit",
  ".quick-order-form, .quick-order-form-full, .quick-order-form-small",
  function() {
    var _form = $(this);
    $.ajax({
      method: _form.attr("method"),
      url: _form.attr("action"),
      dataType: "json",
      data: _form.serialize()
    }).done(function(response) {
      if (response.success !== false) {
        _form.trigger("reset");
      }
      $.fancybox({
        content: response.popup,
        width: 300,
        height: 200,
        padding: 0,
        scrolling: "no",
        helpers: {
          overlay: {
            showCloseButton: true,
            css: {
              background: "rgba(0, 0, 0, 0.7)"
            }
          }
        }
      });
    });
    return false;
  }
);
$(document).ready(function() {
  //РњР°СЃРєР° РЅР° С‚РµР»РµС„РѕРЅРЅС‹Р№ РЅРѕРјРµСЂ
  $("#quickordermodel-phone, #qo-full-phone, #qo-small-phone").mask(
    "(099)999-99-99",
    { clearIfNotMatch: true }
  );
  $(
    ".vtov .online-tabs .online-tabs__open:nth-child(1)>.online-tabs-item"
  ).click();

  $("#qo-2").click(function(e) {
    e.preventDefault();
    $("body, html").animate(
      {
        scrollTop:
          $(".quick-order-form").offset().top - $("header.header").height()
      },
      1000
    );
  });
  $(".take-url form").on("submit", function(e) {
    var _this = $(this);
    e.preventDefault();
    $('input[name="url"]', _this)
      .closest(".form-group")
      .removeClass("has-error");
    if ($('input[name="url"]', _this).val() != "") {
      var url = $('input[name="url"]', _this).val();
      $("body, html").animate(
        {
          scrollTop:
            $(".quick-order-form").offset().top - $("header.header").height()
        },
        1000,
        function() {
          $('input[name="url"]', _this).val("");
          setTimeout(function() {
            $("#quickordermodel-url").val(url);
            $(".quick-order-form input").each(function() {
              $(this).focus();
            });
            $("#quickordermodel-url").focus();
          }, 500);
        }
      );
    } else {
      $('input[name="url"]', _this)
        .closest(".form-group")
        .addClass("has-error");
    }
  });

  //РћР±РЅРѕРІР»РµРЅРёРµ РІС‹РїР°РґР°СЋС‰РµРіРѕ СЃРїРёСЃРєР° РјРѕРґРµР»РµР№ РјР°С€РёРЅ РІ РІРёРґР¶РµС‚Рµ "Р‘С‹СЃС‚СЂС‹Р№ Р·Р°РєР°Р·"
  $(document).on("change", "#quickordermodel-make, #qo-full-make", function() {
    const make = $(this).val();
    const _form = $(this).closest("form");

    $(
      "#quickordermodel-model .car-model-option, #qo-full-model .car-model-option",
      _form
    ).remove();

    if (make != "") {
      $.ajax({
        url: "/quickorder-models",
        type: "post",
        data: {
          make: make,
          _csrf: $('input[name="_csrf"]', _form).val()
        },
        success: function(data) {
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              $("#quickordermodel-model, #qo-full-model", _form).append(
                `<option class="car-model-option" value="${data[i]}">${
                  data[i]
                }</option>`
              );
            }
          }
        }
      });
    }
  });

  //Р¤СѓРЅРєС†РёРѕРЅР°Р» СЃРµРєС†РёРё РїРѕРїСѓР»СЏСЂРЅС‹С… Р°РІС‚Рѕ РёР· РЎРЁРђ
  $(".car_selection .u-arts-item button").on("click", function() {
    const make = $(this).data("make");
    const model = $(this).data("model");
    //const age = $(this).data('age');
    const price = $(this).data("price");
    if (make) {
      $(
        '.quick-order-form #quickordermodel-make option[value="' + make + '"]'
      ).attr("selected", "selected");
      $(".quick-order-form #quickordermodel-make").change();
    }
    // if (age) {
    //     $('.quick-order-form #qo-full-age option[value="' + age + '"]').attr('selected', 'selected');
    // }
    // if (price) {
    //     $('.quick-order-form #quickordermodel-price').val(price);
    // }

    setTimeout(function() {
      if (model) {
        $(
          '.quick-order-form #quickordermodel-model option[value="' +
            model +
            '"]'
        ).attr("selected", "selected");
      }
      $("body, html").animate(
        {
          scrollTop:
            $(".quick-order-form").offset().top - $("header.header").height()
        },
        500
      );
    }, 500);
  });

  //Р Р°Р±РѕС‚Р° РїРµСЂРµРєР»СЋС‡Р°Р»РѕРє РєР°Р»СЊРєСѓР»СЏС‚РѕСЂР°
  function tabToggle() {
    const active_tab = $(".form-calc.tax .labels input:checked").val();

    $(".form-calc.tax .fc-input-group:not(.fc-all)").hide();
    $(
      ".form-calc.tax .wrapper input,.form-calc.tax .wrapper select,.form-calc.tax .wrapper button"
    ).attr("disabled", "disabled");
    $(".form-calc.tax .fc-input-group.fc-" + active_tab).show();
    $(
      ".form-calc.tax .wrapper input:visible,.form-calc.tax .wrapper select:visible,.form-calc.tax .wrapper button:visible"
    ).removeAttr("disabled");
  }
  $(".vikup-avto-calc .calculator .tab-block .tab").on("click", function() {
    if ($(this).hasClass(".active")) return false;
    $(".vikup-avto-calc .calculator .tab-block .tab.active").removeClass(
      "active"
    );
    $(this).addClass("active");
    $(".vikup-avto-calc .calculator .calc-block .calc.active").removeClass(
      "active"
    );
    $(
      '.vikup-avto-calc .calculator .calc-block .calc[data-tab="' +
        $(this).data("tab") +
        '"]'
    ).addClass("active");
    tabToggle();
  });

  $(".form-calc.tax .labels input").on("change", function() {
    $(".form-calc.tax .labels div.active").removeClass("active");
    $('.form-calc.tax .labels div[data-id="' + $(this).val() + '"').addClass(
      "active"
    );
  });

  $(".form-calc.tax .labels div").on("click", function() {
    const _id = $(this).data("id");
    if (_id) {
      $('.form-calc.tax .labels input[value="' + _id + '"]').click();
    }
  });

  $(".form-calc.tax .labels input").on("change", function() {
    tabToggle();
    $(".form-calc.tax .labels div.active").removeClass("active");
    $('.form-calc.tax .labels div[data-id="' + $(this).val() + '"').addClass(
      "active"
    );
  });

  //РћС‚РїСЂР°РІРєР° С„РѕСЂРјС‹ РєР°Р»СЊРєСѓР»СЏС‚РѕСЂР°
  $(document).on("beforeSubmit", ".form-calc", function() {
    const _form = $(this);
    $.ajax({
      method: _form.attr("method"),
      url: _form.attr("action"),
      dataType: "json",
      data: _form.serialize()
    }).done(function(response) {
      $(".fc-result", _form).html(response);
      tabToggle();
    });
    return false;
  });
  $(document).on(
    "change",
    ".delivery-calc select:not(#deliverycalcmodel-port)",
    function() {
      const _this = $(this);
      switch (_this.attr("id")) {
        case "deliverycalcmodel-auction":
          $("#deliverycalcmodel-city option.new").remove();
          $("#deliverycalcmodel-port option.new").remove();
          break;
        case "deliverycalcmodel-city":
          $("#deliverycalcmodel-port option.new").remove();
          break;
      }
      $.ajax({
        url: "/delivery-calc-update",
        type: "post",
        data: _this.closest("form").serialize(),
        success: function(data) {
          if (
            data.hasOwnProperty("cities") &&
            _this.attr("id") === "deliverycalcmodel-auction"
          ) {
            $("#deliverycalcmodel-city").append(data.cities);
          }
          if (
            data.hasOwnProperty("ports") &&
            _this.attr("id") === "deliverycalcmodel-city"
          ) {
            $("#deliverycalcmodel-port").append(data.ports);
          }
        }
      });
    }
  );
});

$(function() {
  $(".lazy").lazy();
});

$(document).ready(function() {
  $(document).on("click", "#service-checkbox-113", function(e) {
    var InsuranceButton = $(".insurance");
    var noInsuranceButton = $(".no-insurance");

    if (this.checked) {
      InsuranceButton.hide();
      noInsuranceButton.show();
    } else {
      InsuranceButton.show();
      noInsuranceButton.hide();
    }
  });

  $(document).on("click", ".insurance", function(e) {
    var declared_value = $("#shipmentform-declared_value").val();
    var parcent_txt = "2.5% РѕС‚ СЃС‚РѕРёРјРѕСЃС‚Рё С‚РѕРІР°СЂР°";
    if (declared_value <= 100) {
      var ins_val = "$" + (declared_value * 0.025).toFixed(2);
    } else {
      if ($("div.active span.lang-link").html() != "ru") {
        var parcent_txt = "2.5% РІС–Рґ РІР°СЂС‚РѕСЃС‚С– С‚РѕРІР°СЂСѓ";
      }
      var ins_val = parcent_txt;
    }
    $(".ins-amount").html(ins_val);
  });

  $(document).on("keyup", "#shipmentform-tr_code", function(e) {
    var InsuranceButton = $(".insurance");
    var noInsuranceButton = $(".no-insurance");
    if (
      $("#shipmentform-declared_value").val() &&
      $("textarea").val() &&
      $("#select2-shipmentform-type_id-container").text() !=
        "РќРµ РІС‹Р±СЂР°РЅРѕ" &&
      !$("#service-checkbox-113").is(":checked")
    ) {
      InsuranceButton.show();
      noInsuranceButton.hide();
    }
  });

  $(document).on("keyup", "#shipmentform-declared_value", function(e) {
    var InsuranceButton = $(".insurance");
    var noInsuranceButton = $(".no-insurance");
    if (
      $("#shipmentform-tr_code").val() &&
      $("textarea").val() &&
      $("#select2-shipmentform-type_id-container").text() !=
        "РќРµ РІС‹Р±СЂР°РЅРѕ" &&
      !$("#service-checkbox-113").is(":checked")
    ) {
      InsuranceButton.show();
      noInsuranceButton.hide();
    }
  });

  $(document).on("keyup", "textarea#shipmentform-description", function(e) {
    var InsuranceButton = $(".insurance");
    var noInsuranceButton = $(".no-insurance");
    if (
      $("#shipmentform-tr_code").val() &&
      $("#shipmentform-declared_value").val() &&
      $("#select2-shipmentform-type_id-container").text() !=
        "РќРµ РІС‹Р±СЂР°РЅРѕ" &&
      !$("#service-checkbox-113").is(":checked")
    ) {
      InsuranceButton.show();
      noInsuranceButton.hide();
    }
  });

  $(document).on("change", "#shipmentform-type_id", function(e) {
    var InsuranceButton = $(".insurance");
    var noInsuranceButton = $(".no-insurance");
    if (
      $("#shipmentform-tr_code").val() &&
      $("#shipmentform-declared_value").val() &&
      $("#select2-shipmentform-type_id-container").text() !=
        "РќРµ РІС‹Р±СЂР°РЅРѕ" &&
      !$("#service-checkbox-113").is(":checked")
    ) {
      InsuranceButton.show();
      noInsuranceButton.hide();
    }
  });

  $(document).on("click", ".make-insurance", function(event) {
    var InsuranceButton = $(".insurance");
    var noInsuranceButton = $(".no-insurance");
    $("#service-checkbox-113").attr("checked", "checked");
    InsuranceButton.hide();
    noInsuranceButton.show();
    ga("send", "event", "insurance", "confirm", "Insurance Campaign");
    $("#shipment-form").submit();
  });

  $(document).on("click", ".cancel-insurance", function(event) {
    var InsuranceButton = $(".insurance");
    var noInsuranceButton = $(".no-insurance");
    InsuranceButton.hide();
    noInsuranceButton.show();
    ga("send", "event", "insurance", "cancel", "Insurance Campaign");
    $("#shipment-form").submit();
  });
});
