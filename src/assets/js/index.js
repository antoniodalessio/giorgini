$(document).ready(function(){
    
    var sliderImage = $(".slideshow--img .slideshow-content").lightSlider({
        item: 1,
        gallery: true,
        loop:true,
        autoWidth: false,
        slideMove: 1,
        mode: "slide",
        useCSS: true,
        cssEasing: 'ease',
        easing: 'linear', 
        pager: true,
    });

    var $slideshowImage = $('.slideshow.slideshow--img');
    var $ctrlPrevImage = $slideshowImage.find('.ctrl-prev');
    var $ctrlNextImage = $slideshowImage.find('.ctrl-next');

    $ctrlPrevImage.on('click', function() {
        sliderImage.goToPrevSlide();
    });

    $ctrlNextImage.on('click', function() {
        sliderImage.goToNextSlide();
    });

    var sliderText = $(".slideshow--text .slideshow-content").lightSlider({
        item: 1,
        gallery: true,
        loop:true,
        autoWidth: false,
        slideMove: 1,
        mode: "slide",
        useCSS: true,
        cssEasing: 'ease',
        easing: 'linear',
        pager: true,
        adaptiveHeight: true,
    });

    var $slideshowText = $('.slideshow.slideshow--text');
    var $ctrlPrevText = $slideshowText.find('.ctrl-prev');
    var $ctrlNextText = $slideshowText.find('.ctrl-next');

    $ctrlPrevText.on('click', function() {
        sliderText.goToPrevSlide();
    });

    $ctrlNextText.on('click', function() {
        sliderText.goToNextSlide();
    });

})

