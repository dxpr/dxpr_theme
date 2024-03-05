/**
 * @file
 * A JavaScript file that styles the page with bootstrap classes.
 *
 * @see sass/styles.scss for more info
 */
(function ($, Drupal, once) {
  let dxpr_themeMenuState = "";

  // Create underscore debounce and throttle functions if they doesn't exist already
  if (typeof _ != "function") {
    window._ = {};
    window._.debounce = function (func, wait, immediate) {
      let timeout;
      let result;

      const later = function (context, args) {
        timeout = null;
        if (args) result = func.apply(context, args);
      };

      const restArgs = function (funct, startIndex) {
        startIndex = startIndex == null ? funct.length - 1 : +startIndex;
        return function (argus) {
          const length = Math.max(argus.length - startIndex, 0);
          const rest = Array(length);
          let index;
          for (index = 0; index < length; index++) {
            rest[index] = argus[index + startIndex];
          }
          switch (startIndex) {
            case 0:
              return funct.call(this, rest);
            case 1:
              return funct.call(this, argus[0], rest);
            case 2:
              return funct.call(this, argus[0], argus[1], rest);
            default:
          }
          const args = Array(startIndex + 1);
          for (index = 0; index < startIndex; index++) {
            args[index] = argus[index];
          }
          args[startIndex] = rest;
          return funct.apply(this, args);
        };
      };
      _.delay = restArgs((func, waitValue, args) =>
        setTimeout(() => func.apply(null, args), waitValue)
      );

      const debounced = restArgs(function (args) {
        const callNow = immediate && !timeout;
        if (timeout) clearTimeout(timeout);
        if (callNow) {
          timeout = setTimeout(later, wait);
          result = func.apply(this, args);
        } else if (!immediate) {
          timeout = _.delay(later, wait, this, args);
        }

        return result;
      });

      debounced.cancel = function () {
        clearTimeout(timeout);
        timeout = null;
      };

      return debounced;
    };

    window._.throttle = function (func, wait, options) {
      let context;
      let args;
      let result;
      let timeout = null;
      let previous = 0;
      if (!options) options = {};
      const later = function () {
        previous = options.leading === false ? 0 : _.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) {
          context = null;
          args = null;
        }
      };
      return function () {
        const now = _.now();
        if (!previous && options.leading === false) previous = now;
        const remaining = wait - (now - previous);
        context = this;
        args = argus;
        if (remaining <= 0 || remaining > wait) {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }
          previous = now;
          result = func.apply(context, args);
          if (!timeout) {
            context = null;
            args = null;
          }
        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
        }
        return result;
      };
    };
  }

  const isPageScrollable = () =>
    document.documentElement.scrollHeight > window.innerHeight;

  const navBreak =
    "dxpr_themeNavBreakpoint" in window ? window.dxpr_themeNavBreakpoint : 1200;
  if (
    $(".dxpr-theme-header--sticky").length > 0 &&
    !$(".dxpr-theme-header--overlay").length &&
    $(window).width() > navBreak
  ) {
    const { headerHeight } = drupalSettings.dxpr_themeSettings;
    const headerScroll = drupalSettings.dxpr_themeSettings.headerOffset;
    let scroll = 0;

    if (headerHeight && headerScroll) {
      _.throttle(
        $(window).scroll(() => {
          scroll = $(window).scrollTop();
          if (scroll >= headerScroll) {
            document
              .querySelector(".dxpr-theme-header--sticky")
              .classList.add("affix");
            document
              .querySelector(".dxpr-theme-header--sticky")
              .classList.remove("affix-top");
          } else {
            document
              .querySelector(".dxpr-theme-header--sticky")
              .classList.add("affix-top");
            document
              .querySelector(".dxpr-theme-header--sticky")
              .classList.remove("affix");
          }
          if (scroll >= headerScroll && scroll <= headerScroll * 2) {
            const scrollMargin = isPageScrollable()
              ? Number(headerHeight) + Number(headerScroll)
              : Number(headerHeight);

            document.getElementsByClassName(
              "wrap-containers"
            )[0].style.cssText = `margin-top:${scrollMargin}px`;
          } else if (scroll < headerScroll) {
            document.getElementsByClassName(
              "wrap-containers"
            )[0].style.cssText = "margin-top:0";
          }
        }),
        100
      );
    }
  }

  // Accepts 2 getBoundingClientReact objects
  function dxpr_themeHit(rect1, rect2) {
    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  }

  function dxpr_themeMenuGovernor(context) {
    // Bootstrap dropdown multi-column smart menu
    let navMenuBreak = 1200;
    if ("dxpr_themeNavBreakpoint" in window) {
      navMenuBreak = window.dxpr_themeNavBreakpoint;
    }
    if (
      $(".body--dxpr-theme-header-side").length === 0 &&
      $(window).width() > navMenuBreak
    ) {
      if (dxpr_themeMenuState === "top") {
        return false;
      }
      document
        .querySelector(".html--dxpr-theme-nav-mobile--open")
        .classList.remove("html--dxpr-theme-nav-mobile--open");
      document
        .querySelector(".dxpr-theme-header--side")
        .classList.add("dxpr-theme-header--top");
      document
        .querySelector(".dxpr-theme-header--side")
        .classList.remove("dxpr-theme-header--side");

      $("#dxpr-theme-main-menu .menu__breadcrumbs").remove();
      document.querySelector(".menu__level").classList.remove("menu__level");
      document.getElementsByClassName("menu__level").style.top = "100%";
      document.getElementsByClassName("menu__level").style.marginTop = 0;
      document.getElementsByClassName("menu__level").style.height = "auto";
      document.querySelector(".menu__item").classList.remove("menu__item");
      $("[data-submenu]").removeAttr("data-submenu");
      $("[data-menu]").removeAttr("data-menu");

      const bodyWidth = $("body").innerWidth();
      const margin = 10;
      let columns;
      $("#dxpr-theme-main-menu .menu .dropdown-menu", context).each(
        function () {
          const width = $(this).width();
          if (
            this.dom_element[0].querySelectorAll(
              ".dxpr-theme-megamenu__heading"
            ).length > 0
          ) {
            columns = this.dom_element[0].querySelectorAll(
              ".dxpr-theme-megamenu__heading"
            ).length;
          } else {
            columns =
              Math.floor(
                this.dom_element[0].querySelectorAll("li").length / 8
              ) + 1;
          }
          if (columns > 2) {
            $(this)
              .css({
                width: "100%", // Full Width Mega Menu
                "left:": "0",
              })
              .parent()
              .css({
                position: "static",
              })
              .find(".dropdown-menu >li")
              .css({
                width: `${100 / columns}%`,
              });
          } else {
            if (columns > 1) {
              // Accounts for 1px border.
              this.css("min-width", width * columns + 2)
                .find(">li")
                .css("width", width);
            }
            // Workaround for drop down overlapping.
            // See https://github.com/twbs/bootstrap/issues/13477.
            const $topLevelItem = this.parent();
            // Set timeout to let the rendering threads catch up.
            setTimeout(() => {
              const delta = Math.round(
                bodyWidth -
                  $topLevelItem.offset().left -
                  this.outerWidth() -
                  margin
              );
              // Only fix items that went out of screen.
              if (delta < 0) {
                this.css("left", `${delta}px`);
              }
            }, 0);
          }
        }
      );
      dxpr_themeMenuState = "top";
      // Hit Detection for Header
      if ($(".tabs--primary").length > 0 && $("#navbar").length > 0) {
        const tabsRect = $(".tabs--primary")[0].getBoundingClientRect();
        if (
          $(".dxpr-theme-header--navbar-pull-down").length > 0 &&
          $("#navbar .container-col").length > 0
        ) {
          const pullDownRect = $(
            "#navbar .container-col"
          )[0].getBoundingClientRect();
          if (dxpr_themeHit(pullDownRect, tabsRect)) {
            $(".tabs--primary").css(
              "margin-top",
              pullDownRect.bottom - tabsRect.top + 6
            );
          }
        } else {
          const navbarRect = $("#navbar")[0].getBoundingClientRect();
          if (dxpr_themeHit(navbarRect, tabsRect)) {
            $(".tabs--primary").css(
              "margin-top",
              navbarRect.bottom - tabsRect.top + 6
            );
          }
        }
      }
      if (
        $("#secondary-header").length > 0 &&
        $("#navbar.dxpr-theme-header--overlay").length > 0
      ) {
        const secHeaderRect = $("#secondary-header")[0].getBoundingClientRect();
        if (
          dxpr_themeHit(
            $("#navbar.dxpr-theme-header--overlay")[0].getBoundingClientRect(),
            secHeaderRect
          )
        ) {
          if (drupalSettings.dxpr_themeSettings.secondHeaderSticky) {
            $("#navbar.dxpr-theme-header--overlay").css(
              "cssText",
              `top:${secHeaderRect.bottom}px !important;`
            );
            document
              .querySelector("#secondary-header")
              .classList.remove("dxpr-theme-secondary-header--sticky");
          } else {
            if ($("#toolbar-bar").length > 0) {
              document.getElementsByClassName(
                "dxpr-theme-header--overlay"
              ).style.top = secHeaderRect.bottom;
            } else {
              document.getElementsByClassName(
                "dxpr-theme-header--overlay"
              ).style.top = "";
            }
            document
              .querySelector("#secondary-header")
              .classList.remove("dxpr-theme-secondary-header--sticky");
          }
        }
      }
    }
    // Mobile Menu with sliding panels and breadcrumb
    // @see dxpr-theme-multilevel-mobile-nav.js
    else {
      if (dxpr_themeMenuState === "side") {
        return false;
      }
      // Temporary hiding while settings up @see #290
      document.getElementById("dxpr-theme-main-menu").style.display = "none";
      // Set up classes
      document
        .querySelector(".dxpr-theme-header--top")
        .classList.add("dxpr-theme-header--side");
      document
        .querySelector(".dxpr-theme-header--top")
        .classList.remove("dxpr-theme-header--top");

      // Remove split-mega menu columns
      $(
        "#dxpr-theme-main-menu .menu .dropdown-menu, #dxpr-theme-main-menu .menu .dropdown-menu li"
      ).removeAttr("style");
      document
        .querySelector("#dxpr-theme-main-menu .menu")
        .classList.add("menu__item");
      document
        .querySelector("#dxpr-theme-main-menu .menu .dropdown-menu")
        .classList.add("menu__item");
      document
        .querySelector("#dxpr-theme-main-menu .menu .dxpr-theme-megamenu")
        .classList.add("menu__item");
      document
        .querySelector("#dxpr-theme-main-menu .menu a")
        .classList.add("menu__item");
      document
        .querySelector("#dxpr-theme-main-menu .menu li")
        .classList.add("menu__item");
      // Set up data attributes
      $("#dxpr-theme-main-menu .menu a.dropdown-toggle").each(function (index) {
        const nextElement = this.nextElementSibling;
        this.setAttribute("data-submenu", this.textContent);
        nextElement.setAttribute("data-menu", this.textContent);
      });
      $("#dxpr-theme-main-menu .menu a.dxpr-theme-megamenu__heading").each(
        function (index) {
          const nextMegaElement = this.nextElementSibling;
          this.setAttribute("data-submenu", this.textContent);
          nextMegaElement.setAttribute("data-menu", this.textContent);
        }
      );

      const menuEl = document.getElementById("dxpr-theme-main-menu");

      // Close/open menu function
      const closeMenu = function () {
        if (drupalSettings.dxpr_themeSettings.hamburgerAnimation === "cross") {
          document
            .querySelector("#dxpr-theme-menu-toggle")
            .classList.toggle("navbar-toggle--active");
        }
        document.querySelector(menuEl).classList.toggle("menu--open");
        document
          .querySelector("html")
          .classList.toggle("html--dxpr-theme-nav-mobile--open");
      };

      // Mobile menu toggle
      $(once("dxpr_themeMenuToggle", "#dxpr-theme-menu-toggle")).click(() => {
        closeMenu();
      });
      document.getElementById("dxpr-theme-main-menu").style.position = "fixed";
      document.getElementById("dxpr-theme-main-menu").style.display = "block";

      // Close menu with click on anchor link
      $(".menu__link").click(function () {
        if (!this.getAttribute("data-submenu")) {
          closeMenu();
        }
      });

      let brandingBottom;
      // See if logo  or block content overlaps menu and apply correction
      if ($(".wrap-branding").length > 0) {
        brandingBottom = $(".wrap-branding")[0].getBoundingClientRect().bottom;
      } else {
        brandingBottom = 0;
      }
      const $lastBlock = $(
        "#dxpr-theme-main-menu .block:not(.block-menu)"
      ).last();

      // Show menu after completing setup
      // See if blocks overlap menu and apply correction
      if (
        $(".body--dxpr-theme-header-side").length > 0 &&
        $(window).width() > navBreak &&
        $lastBlock.length > 0 &&
        brandingBottom > 0
      ) {
        document.getElementById("dxpr-theme-main-menu").style.paddingTop =
          brandingBottom + 40;
      }
      if ($lastBlock.length > 0) {
        const lastBlockBottom = $lastBlock[0].getBoundingClientRect().bottom;
        $(".menu__breadcrumbs").css("top", lastBlockBottom + 20);
        $(".menu__level").css("top", lastBlockBottom + 40);
        const offsetBlockBottom = 40 + lastBlockBottom;
        $(".dxpr-theme-header--side .menu__level").css(
          "height",
          `calc(100vh - ${offsetBlockBottom}px)`
        );
      } else if (
        $(".body--dxpr-theme-header-side").length > 0 &&
        $(".wrap-branding").length > 0 &&
        brandingBottom > 120
      ) {
        $(".menu__breadcrumbs").css("top", brandingBottom + 20);
        $(".menu__level").css("top", brandingBottom + 40);
        const offsetBrandingBottom = 40 + brandingBottom;
        $(".dxpr-theme-header--side .menu__level").css(
          "height",
          `calc(100vh - ${offsetBrandingBottom}px)`
        );
      }
      dxpr_themeMenuState = "side";
    }
  }

  // Fixed header on mobile on tablet
  const { headerMobileHeight } = drupalSettings.dxpr_themeSettings;
  const headerFixed = drupalSettings.dxpr_themeSettings.headerMobileFixed;
  const navThemeBreak =
    "dxpr_themeNavBreakpoint" in window ? window.dxpr_themeNavBreakpoint : 1200;

  if (
    headerFixed &&
    $(".dxpr-theme-header").length > 0 &&
    $(window).width() <= navThemeBreak
  ) {
    const navbarElement = document.querySelector("#navbar");
    if ($("#toolbar-bar").length > 0) {
      navbarElement.classList.add("header-mobile-admin-fixed");
    }
    if ($(window).width() >= 975) {
      navbarElement.classList.add("header-mobile-admin-fixed-active");
    } else {
      navbarElement.classList.remove("header-mobile-admin-fixed-active");
    }
    $(".dxpr-theme-boxed-container").css("overflow", "hidden");
    $("#toolbar-bar").addClass("header-mobile-fixed");
    $("#navbar").addClass("header-mobile-fixed");
    $("#secondary-header").css("margin-top", +headerMobileHeight);
  }

  function dxpr_themeMenuGovernorBodyClass() {
    let navBreakMenu = 1200;
    if ("dxpr_themeNavBreakpoint" in window) {
      navBreakMenu = window.dxpr_themeNavBreakpoint;
    }
    if ($(window).width() > navBreakMenu) {
      // Const element = document.querySelector(".body--dxpr-theme-nav-mobile");
      // element.classList.remove("body--dxpr-theme-nav-mobile");
      // element.classList.add("body--dxpr-theme-nav-desktop");
      $(".body--dxpr-theme-nav-mobile")
        .removeClass("body--dxpr-theme-nav-mobile")
        .addClass("body--dxpr-theme-nav-desktop");
    } else {
      // Const element = document.querySelector(".body--dxpr-theme-nav-desktop");
      // element.classList.remove("body--dxpr-theme-nav-desktop");
      // element.classList.add("body--dxpr-theme-nav-mobile");
      $(".body--dxpr-theme-nav-desktop")
        .removeClass("body--dxpr-theme-nav-desktop")
        .addClass("body--dxpr-theme-nav-mobile");
    }
  }

  function dpxr_themeMenuOnResize() {
    // Mobile menu open direction.
    if (
      drupalSettings.dxpr_themeSettings.headerSideDirection === "right" &&
      $(window).width() <= window.dxpr_themeNavBreakpoint
    ) {
      document
        .querySelector(".dxpr-theme-main-menu")
        .classList.add("dxpr-theme-main-menu--to-left");
    } else {
      document
        .querySelector(".dxpr-theme-main-menu")
        .classList.remove("dxpr-theme-main-menu--to-left");
    }
    // Fix bug with not styled content on page load.
    if (
      $(window).width() > window.dxpr_themeNavBreakpoint &&
      $(".dxpr-theme-header--side").length === 0
    ) {
      document.getElementById("dxpr-theme-main-menu").style.position =
        "relative";
    }
  }

  $(window).resize(
    _.debounce(() => {
      if ($("#dxpr-theme-main-menu .nav").length > 0) {
        dxpr_themeMenuGovernorBodyClass();
        dxpr_themeMenuGovernor(document);
      }
      dpxr_themeMenuOnResize();
    }, 50)
  );

  dpxr_themeMenuOnResize();

  $(document).ready(() => {
    if ($("#dxpr-theme-main-menu .nav").length > 0) {
      dxpr_themeMenuGovernorBodyClass();
      dxpr_themeMenuGovernor(document);
    }
  });
})(jQuery, Drupal, once);
