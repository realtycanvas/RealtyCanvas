// footer copyright year
(function () {
    var yearEl = document.getElementById("footer-year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
})();

// banner video — Cloudinary MP4 autoplay (mobile + desktop)
(function () {
    var mobileMq = window.matchMedia("(max-width: 767px)");

    function isActiveBannerVideo(video) {
        return !!video.closest(mobileMq.matches ? ".mobBanner" : ".banner_section .carousel-inner");
    }

    function playBannerVideo(video) {
        video.muted = true;
        video.defaultMuted = true;
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");
        var p = video.play();
        if (p && typeof p.catch === "function") {
            p.catch(function () {});
        }
    }

    function initBannerVideo(video) {
        if (!isActiveBannerVideo(video)) {
            video.preload = "none";
            video.pause();
            return;
        }
        video.preload = "auto";
        playBannerVideo(video);
        video.addEventListener("canplay", function () {
            playBannerVideo(video);
        });
    }

    function initAll() {
        document.querySelectorAll("video.banner-video").forEach(initBannerVideo);
    }

    initAll();
    if (mobileMq.addEventListener) {
        mobileMq.addEventListener("change", initAll);
    } else if (mobileMq.addListener) {
        mobileMq.addListener(initAll);
    }
})();

// body toggle class
$(".mobile-trigger").click(function () {
    $("body").toggleClass("mobile-open");
});

$(".has-submenu").click(function () {
    $(this).toggleClass("child-open");
    $(this).children(".submenu").slideToggle();
});

// header fixed — transparent at top, solid background on scroll
function updateSiteHeaderScroll() {
    var $siteHeader = $("header.site-header");
    $(window).scrollTop() >= 50 ? $siteHeader.addClass("fixed-header") : $siteHeader.removeClass("fixed-header");
}

$(window).on("scroll", updateSiteHeaderScroll);
$(function () {
    updateSiteHeaderScroll();
});

// footer read more / less
$(".site-footer .moreless-button").on("click", function () {
    var $btn = $(this);
    var $more = $btn.closest(".site-footer-disclaimer").find(".moretext");
    $more.slideToggle(200);
    var expanded = $btn.attr("aria-expanded") === "true";
    $btn.attr("aria-expanded", expanded ? "false" : "true");
    $btn.text(expanded ? "Read more" : "Read less");
});

// popup js — run after DOM is ready
$(function () {

    $('.without-caption').magnificPopup({
        type: 'image',
        closeOnContentClick: true,
        closeBtnInside: false,
        mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
        image: {
            verticalFit: true
        },
        zoom: {
            enabled: true,
            duration: 300 // don't foget to change the duration also in CSS
        }
    });

    // Single image lightbox (not location map)
    $('.with-caption').not('.location-map-link').magnificPopup({
        type: 'image',
        closeOnContentClick: true,
        closeBtnInside: false,
        mainClass: 'mfp-with-zoom mfp-img-mobile',
        image: {
            verticalFit: true,
            titleSrc: function (item) {
                return item.el.attr('title') || '';
            }
        },
        zoom: {
            enabled: true
        }
    });

    // Location map lightbox (no zoom — prevents image stuck position:fixed on resize)
    $('.location-map-link').magnificPopup({
        type: 'image',
        closeOnContentClick: true,
        closeBtnInside: false,
        mainClass: 'mfp-img-mobile',
        image: {
            verticalFit: true,
            titleSrc: function (item) {
                return item.el.attr('title') || 'Location Map';
            }
        },
        zoom: {
            enabled: false
        },
        callbacks: {
            afterClose: function () {
                $('.location-map-link img').removeAttr('style');
            }
        }
    });

    // Open gallery slideshow from button
    $('.gallery-open-btn').on('click', function () {
        var $first = $('.gallery-grid .gallery-popup').first();
        if ($first.length) {
            $first.trigger('click');
        }
    });

    // Gallery slider — prev/next through all gallery images
    $('.gallery-grid').magnificPopup({
        delegate: 'a.gallery-popup',
        type: 'image',
        closeOnContentClick: false,
        closeOnBgClick: true,
        closeBtnInside: false,
        mainClass: 'mfp-gallery-slider mfp-img-mobile',
        gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0, 1],
            arrows: true,
            tPrev: 'Previous',
            tNext: 'Next',
            tCounter: '%curr% / %total%'
        },
        image: {
            verticalFit: true,
            titleSrc: function (item) {
                return item.el.attr('title') || 'Gallery';
            }
        }
    });

}); // end popup init

// Modals — keep page scroll position on close (no jump to top)
$(function () {
    var savedScrollY = 0;
    var openModalCount = 0;

    function getScrollY() {
        return window.pageYOffset || document.documentElement.scrollTop || 0;
    }

    function cleanupModalBody() {
        var body = document.body;
        body.classList.remove("modal-open");
        body.style.overflow = "";
        body.style.paddingRight = "";
        body.style.position = "";
        body.style.top = "";
        body.style.left = "";
        body.style.right = "";
        body.style.width = "";
        document.documentElement.style.overflow = "";
        document.querySelectorAll(".modal-backdrop").forEach(function (el) {
            el.remove();
        });
    }

    $(document).on("show.bs.modal", ".modal", function () {
        if (openModalCount === 0) {
            savedScrollY = getScrollY();
        }
        openModalCount += 1;
    });

    $(document).on("hide.bs.modal", ".modal", function () {
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }
    });

    $(document).on("hidden.bs.modal", ".modal", function () {
        openModalCount = Math.max(0, openModalCount - 1);
        if (openModalCount > 0) {
            return;
        }
        cleanupModalBody();
        window.scrollTo(0, savedScrollY);
    });
});

// Enquiry modal — dynamic label from trigger (Register Now, Download Brochure, etc.)
function resetEnquiryModalForm() {
    var $form = $("#form3");
    if (!$form.length) return;

    var formEl = $form[0];
    var timerId = formEl && formEl.dataset.submitResetTimer;
    if (timerId) {
        clearTimeout(Number(timerId));
        delete formEl.dataset.submitResetTimer;
    }

    var referralVal = $form.find('input[name="referral_code"]').val() || "3003";

    $form.find('input[type="hidden"]').not('[name="referral_code"]').remove();
    $form[0].reset();
    $form.find('input[name="referral_code"]').val(referralVal);

    $form.find(".error-msg").empty();
    $form.find(".enquiry-modal-submit").prop("disabled", false).text("Submit");
    $("#enquiryModalConsent").prop("checked", true);
}

window.resetEnquiryModalForm = resetEnquiryModalForm;

$(function () {
    var $modal = $("#exampleModal1");
    if (!$modal.length) return;

    var $label = $("#enquiryModalLabel");
    var defaultLabel = $label.data("default-label") || "Enquire Now";

    function labelFromTrigger($trigger) {
        if (!$trigger || !$trigger.length) return defaultLabel;
        var custom = $trigger.attr("data-enquiry-label");
        if (custom) return custom;
        var title = $trigger.attr("title");
        if (title) return title;
        return $trigger.clone().children("i").remove().end().text().replace(/\s+/g, " ").trim() || defaultLabel;
    }

    $modal.on("show.bs.modal", function (e) {
        resetEnquiryModalForm();

        var $trigger = $(e.relatedTarget);
        var label = labelFromTrigger($trigger);
        $label.text(label);
        var viewImage = $trigger.attr("data-view-image");
        var modalEl = $modal[0];
        if (viewImage) {
            modalEl.dataset.viewImage = viewImage;
        } else {
            delete modalEl.dataset.viewImage;
        }
    });

    $modal.on("hidden.bs.modal", function () {
        $label.text(defaultLabel);
        delete $modal[0].dataset.viewImage;
        resetEnquiryModalForm();
    });
});

// Amenities slider — desktop: center large + side peeks; mobile: large + one small peek
$(function () {
    $("[data-amenities-slider]").each(function () {
        var $slider = $(this);
        var $viewport = $slider.find(".amenities-slider__viewport");
        var $track = $slider.find(".amenities-slider__track");
        var $slides = $track.find(".amenities-slide");
        var index = 0;
        var total = $slides.length;

        if (!total) {
            return;
        }

        function isMobileLayout() {
            return window.innerWidth <= 767;
        }

        function maxIndex() {
            return total - 1;
        }

        function trackGap() {
            return parseFloat($track.css("gap")) || 0;
        }

        function mobileSlideStep() {
            return $slides.first().outerWidth() + trackGap();
        }

        function slideOffsetAt(i) {
            return $slides.eq(i).position().left;
        }

        function desktopScrollOffset(i) {
            var $slide = $slides.eq(i);
            var viewportW = $viewport.innerWidth();
            var slideW = $slide.outerWidth();
            var slideLeft = slideOffsetAt(i);
            return slideLeft - (viewportW - slideW) / 2;
        }

        function scrollOffsetFor(i) {
            if (isMobileLayout()) {
                return i * mobileSlideStep();
            }
            return desktopScrollOffset(i);
        }

        function maxScroll() {
            return Math.max(0, $track[0].scrollWidth - $viewport.innerWidth());
        }

        function goTo(newIndex) {
            index = Math.max(0, Math.min(newIndex, maxIndex()));

            $slides.removeClass("is-active");
            $slides.eq(index).addClass("is-active");

            if (!isMobileLayout()) {
                $track[0].offsetHeight;
            }

            var offset = scrollOffsetFor(index);
            offset = Math.max(0, Math.min(offset, maxScroll()));

            $track.css("transform", "translateX(-" + offset + "px)");
            $slider.find(".amenities-slider__current").text(index + 1);
            $slider.find(".amenities-slider__total").text(total);
            $slider.find(".amenities-slider__arrow--prev").prop("disabled", index <= 0);
            $slider.find(".amenities-slider__arrow--next").prop("disabled", index >= maxIndex());
        }

        var autoplayTimer = null;
        var autoplayDelay = 4000;

        function stopAutoplay() {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayTimer = setInterval(function () {
                goTo(index >= maxIndex() ? 0 : index + 1);
            }, autoplayDelay);
        }

        function resetAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        $slider.find(".amenities-slider__arrow--prev").on("click", function () {
            goTo(index - 1);
            resetAutoplay();
        });

        $slider.find(".amenities-slider__arrow--next").on("click", function () {
            goTo(index + 1);
            resetAutoplay();
        });

        $slider.on("mouseenter", stopAutoplay);
        $slider.on("mouseleave", startAutoplay);

        var resizeTimer;
        $(window).on("resize", function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                goTo(index);
            }, 150);
        });

        goTo(0);
        startAutoplay();
    });
});

// Gallery bottom row — 3 cards visible, scroll one at a time
$(function () {
    $("[data-gallery-bottom-carousel]").each(function () {
        var $carousel = $(this);
        var $viewport = $carousel.find(".gallery-bottom-carousel__viewport");
        var $track = $carousel.find(".gallery-bottom-carousel__track");
        var $slides = $track.find(".gallery-bottom-carousel__slide");
        var index = 0;
        var total = $slides.length;
        var autoplayDelay = 4000;
        var autoplayTimer = null;

        if (!total) {
            return;
        }

        function visibleCount() {
            if (window.innerWidth <= 767) {
                return 1;
            }
            if (window.innerWidth <= 991) {
                return 2;
            }
            return 3;
        }

        function maxIndex() {
            return Math.max(0, total - visibleCount());
        }

        function slideOffsetAt(i) {
            return $slides.eq(i).position().left;
        }

        function goTo(newIndex) {
            var max = maxIndex();
            index = Math.max(0, Math.min(newIndex, max));

            $slides.removeClass("is-active");
            $slides.eq(index).addClass("is-active");

            var offset = slideOffsetAt(index);
            $track.css("transform", "translateX(-" + offset + "px)");

            $carousel.find(".gallery-bottom-carousel__current").text(index + 1);
            $carousel.find(".gallery-bottom-carousel__total").text(max + 1);
            $carousel.find(".gallery-bottom-carousel__arrow--prev").prop("disabled", index <= 0);
            $carousel.find(".gallery-bottom-carousel__arrow--next").prop("disabled", index >= max);
        }

        function stopAutoplay() {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayTimer = setInterval(function () {
                goTo(index >= maxIndex() ? 0 : index + 1);
            }, autoplayDelay);
        }

        function resetAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        $carousel.find(".gallery-bottom-carousel__arrow--prev").on("click", function () {
            goTo(index - 1);
            resetAutoplay();
        });

        $carousel.find(".gallery-bottom-carousel__arrow--next").on("click", function () {
            goTo(index + 1);
            resetAutoplay();
        });

        $carousel.on("mouseenter", stopAutoplay);
        $carousel.on("mouseleave", startAutoplay);

        var resizeTimer;
        $(window).on("resize", function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                if (index > maxIndex()) {
                    goTo(maxIndex());
                } else {
                    goTo(index);
                }
            }, 150);
        });

        goTo(0);
        startAutoplay();
    });
});

// floor plan tab js
if ($(".tabs-box").length) {
    $(".tabs-box .tab-buttons .tab-btn").on("click", function (e) {
        e.preventDefault();
        var target = $($(this).attr("data-tab"));
        var $tabsBox = $(this).parents(".tabs-box");

        if ($(target).is(":visible")) {
            return false;
        }

        $tabsBox.find(".tab-buttons .tab-btn").removeClass("active-btn").attr("aria-selected", "false");
        $(this).addClass("active-btn").attr("aria-selected", "true");

        $tabsBox.find(".tabs-content .tab").fadeOut(0).removeClass("active-tab");
        $(target).fadeIn(300).addClass("active-tab");
    });
}


$(document).ready(function () {
    if (window.matchMedia("(min-width: 769px)").matches) {
        $('.banner-form .close_outer').on('click', function () {
            $(this).closest('.banner-form').addClass('bottom');
            $(".lower-form-part").slideUp(500);
        })

        setTimeout(function () {
            $('.banner-form').addClass('active');
        }, 3000)
    }

})


// FORM SLIDE UP & DOWN

$(document).ready(function () {
    $(window).scroll(function () {

        if (window.matchMedia("(min-width: 769px)").matches) {
            if ($(window).width() > 768 && $(this).scrollTop() > 200) {
                $(".lower-form-part").slideUp(500);
                $('.banner-form').addClass('bottom');
            } else {
                $(".lower-form-part").slideDown(500);
                $('.banner-form').removeClass('bottom');
            }
        }

    });

    $(".form-top").click(function () {
        if (window.matchMedia("(min-width: 769px)").matches) {
            $(".lower-form-part").slideToggle();
        }
    });
});