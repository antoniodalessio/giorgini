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
})