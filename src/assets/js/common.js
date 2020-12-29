$(document).ready(function(){
	
	$(document).scroll(function() {
        if ($(window).scrollTop() > 0) {
            $("header.main, header.mobile").addClass('scrolled')
        }else {
            $("header.main, header.mobile").removeClass('scrolled')
        }
    })
	
	newsletter('footer.main');
	newsletter('footer.mobile');
	mobileMenu();
	$(".contact-email").on("click", function(e) {
		e.preventDefault();
		window.location.href = 'mailto:' + ['info','studiodentisticogiorgini.it'].join('@');
	})

	hideContactUsAfterFooter()

	// $('.popup').magnificPopup({
	// 	type: 'ajax'
	// })

	cookieLaw();

	

});

function hideContactUsAfterFooter() {
	$(document).scroll(function() {
		var element = 'footer.mobile .newsletter' 
		var top_of_element = $(element).offset().top;
		var bottom_of_element = $(element).offset().top + $(element).outerHeight();
		var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight();
		var top_of_screen = $(window).scrollTop();
	
		if ((bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element)){
			$('.contact-us').addClass('hide')
		} else {
			$('.contact-us').removeClass('hide')
		}
	});
}

function cookieLaw() {
	var cookielaw = localStorage.getItem("cookielaw");

	if (!cookielaw) {

		$(".cookie-law").show();

		$(window).on("scroll", function () {
			localStorage.setItem("cookielaw", "true");
			$(".cookie-law").hide();
		});

		$('.cookie-law .popup').magnificPopup({
			type: 'ajax'
		})

		$(".cookie-law .icon").on('click', function() {
			localStorage.setItem("cookielaw", "true");
			$(".cookie-law").hide();
		})

		$("a").on('click', function() {
			localStorage.setItem("cookielaw", "true");
			$(".cookie-law").hide();
		})

	}else{
		$(".cookie-law").hide();
		$(window).off("scroll");
		$(".cookie-law .icon").off();
	}
}


function newsletter(type) {
	var $newsletterForm = $(type + ' .newsletter');
	var $submitNewsletter = $newsletterForm.find('.button');
	var $emailNewsletter = $newsletterForm.find('input[name="email"]');
	var $privacyNewsletter = $newsletterForm.find('input[name="privacy"]');

	$submitNewsletter.on('click', function(e) {
		e.preventDefault();
		alert($emailNewsletter.val() + "  " + $privacyNewsletter.val());
	})
}

function mobileMenu() {
	var $iconHamburger = $('header.mobile .icon-hamburger');
	var $iconClose = $('header.mobile .icon-close');
	var $menu = $('header.mobile .menu-mobile');
	$iconHamburger.on('click', function() {
		$iconHamburger.hide();
		$iconClose.show();
		$menu.addClass('open');
	})

	$iconClose.on('click', function() {
		$iconHamburger.show();
		$iconClose.hide();
		$menu.removeClass('open');
	})
}