$(document).ready(function(){
	
	$( window ).scroll(function() {
        console.log()
        if ($(window).scrollTop() > 0) {
            $("header.main").addClass('scrolled')
        }else {
            $("header.main").removeClass('scrolled')
        }
    })
	
	newsletter();
	// $(".contact-email").on("click", function(e) {
	// 	e.preventDefault();
	// 	window.location.href = 'mailto:' + ['info','amaliacardo.it'].join('@');
	// })

	// $(".menu-mobile").on("touchstart", function(e){
	// 	e.stopPropagation();
	// 	if ($(this).hasClass("active")){
	// 		$(this).removeClass("active");
	// 		$("nav ul").slideUp("fast");
	// 	}else{
	// 		$(this).addClass("active");
	// 		$("nav ul").slideDown("fast");
	// 	}
	// });

	// $('.popup').magnificPopup({
	// 	type: 'ajax'
	// })

	// var cookielaw = localStorage.getItem("cookielaw");

	// if (!cookielaw) {

	// 	$(".cookie-law").show();

	// 	$(window).on("scroll", function () {
	// 		localStorage.setItem("cookielaw", "true");
	// 		$(".cookie-law").hide();
	// 	});

	// 	$('.cookie-law .popup').magnificPopup({
	// 		type: 'ajax'
	// 	})

	// 	$(".cookie-law .icon").on('click', function() {
	// 		localStorage.setItem("cookielaw", "true");
	// 		$(".cookie-law").hide();
	// 	})

	// 	$("a").on('click', function() {
	// 		localStorage.setItem("cookielaw", "true");
	// 		$(".cookie-law").hide();
	// 	})

	// }else{
	// 	$(".cookie-law").hide();
	// 	$(window).off("scroll");
	// 	$(".cookie-law .icon").off();
	// }

	

});


function newsletter() {
	var $newsletterForm = $('.newsletter');
	var $submitNewsletter = $newsletterForm.find('.button');

	$submitNewsletter.on('click', function(e) {
		e.preventDefault();
		alert("submit");
	})
}