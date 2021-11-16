var LOSTILE_WC = LOSTILE_WC || {};

(function($){

	// USE STRICT
	"use strict";

LOSTILE_WC.loopproduct = {

	init: function(){

       LOSTILE_WC.quickview.init(); 
       LOSTILE_WC.loopproduct.loadLazyImage();
       LOSTILE_WC.loopproduct.loadAjaxNav();
    
  },

  loadLazyImage: function () {
    var $images = $products.find('.product:not(.image-loaded) .product-image .item-img .unveil-image');
    if ($images.length) {
      var threshold = 1;
      $images.unveil(threshold, function() {
        $(this).parents('.product').addClass('image-loaded').find('.unveil-image').velocity({
          opacity: '1',
          }, {
            duration: 500,
            easing: "ease-in-out"
        });
      });
    }
  },

  loadAjaxNav: function(){
    $('.woocommerce.shop-navigation-infinite').on( 'click', '.woocommerce-pagination .next', function (event) {
      event.preventDefault();
      var $button = $( this ),
        $nav = $button.closest( '.woocommerce-pagination' ),
        $products = $nav.prev( '.products' ).find('.row'),
        url = $button.attr( 'href' );

      if ( $button.hasClass( 'loading' ) ) {
        return;
      }

      $button.addClass( 'loading' );

      $.get( url, function ( response ) {
          var $primary = $( response ).find( '#shop' ),
            $_products = $primary.find( '.products .row' ).children(),
            $pagination = $primary.find( '.woocommerce-pagination' );

          $_products.imagesLoaded( function () {
            $products.isotope( 'insert', $_products );
            $nav.html( $pagination.html() );
            LOSTILE_WC.loopproduct.loadLazyImage();
            LOSTILE.module.loadFlexSlider();
          } );

          window.history.pushState( null, '', url );
        }
      );
    } );

  }
};

LOSTILE_WC.singleproduct = {

  init: function(){
    LOSTILE_WC.ajaxAddToCart.init();
    LOSTILE_WC.singleproduct.imageLightbox();
    LOSTILE_WC.singleproduct.imageZoom();
    LOSTILE_WC.singleproduct.imageSlider();
    LOSTILE_WC.singleproduct.summarySticky();
  },

  imageLightbox: function(){

        var $images = $('div.product-image div.images'),
            $productGallery = $images.find('.easyzoom');

        if (!$images.length) {
            return;
        }

      $productGallery.bind('click', function(event) {
            event.preventDefault();

            var items = [];
            $productGallery.each(function() {
                var $element = $(this),
                    $gallery = $element.children('a.photoswipe').find('img');

                items.push({
                    src: $gallery.attr('data-large_image'),
                    w: $gallery.attr('data-large_image_width'),
                    h: $gallery.attr('data-large_image_height')
                });
            });

            var index = $(this).index(),
                options = {
                    index: index,
                    bgOpacity: 0.85,
                    showHideOpacity: true,
                    loop: false,
                    closeOnVerticalDrag: false,
                    mainClass: 'pswp--minimal-dark',
                    barsSize: {
                        top: 0,
                        bottom: 0
                    },
                    captionEl: false,
                    fullscreenEl: false,
                    shareEl: false,
                    tapToClose: true,
                    tapToToggleControls: false
                };

            var lightBox = new PhotoSwipe( $( '.pswp' )[0], window.PhotoSwipeUI_Default, items, options);
            lightBox.init();

          // Event: Opening zoom animation
          lightBox.listen('initialZoomIn', function() {
            $('#product-thumbnails-slider').slick('slickSetOption', 'speed', 0);
          });
          // Event: Before slides change
          var slide = index;
          lightBox.listen('beforeChange', function(dirVal) {
            slide = slide + dirVal;
            $('#product-images-slider').slick('slickGoTo', slide, true); 
          });
          // Event: lightBox starts closing
          lightBox.listen('close', function() {
            $('#product-thumbnails-slider').slick('slickSetOption', 'speed', 300);
          });
      });

  },

  imageZoom: function(){
        if ( $body.hasClass('device-md') || $body.hasClass('device-lg') ) {
          if ($(".easyzoom").length ) {
                  var $easyzoom = $(".easyzoom").easyZoom({
                              loadingNotice: '',
                              errorNotice: '',
                              preventClicks: false,
                          });
                          
                  var easyzoom_trigger = $easyzoom.data('easyZoom');


               $(".variations_form").on('woocommerce_variation_select_change', function() {
                  easyzoom_trigger.teardown();
                  easyzoom_trigger._init();
                  $productImageSlider.slick('slickGoTo', 0, false); 
               });
          } 
        }
  },

  imageSlider: function(){

      if( !$().slick ) {
        console.log('slider: Slick carousel not Defined.');
        return true;
      }

      $productImageSlider.each( function(){
        var element = $(this),
            elementSlides = element.attr('data-items'),
            elementSlidesScroll = element.attr('data-items-scroll'),
            elementNavFor = element.attr('data-nav-for'), 
            elementNav = element.attr('data-nav'),
            elementVertical = element.attr('data-items-vertical'),
            elementDrag = element.attr('data-drag'),
            elementFocus = element.attr('data-onfocus'),
            elementFade = element.attr('data-fade');

            if( !elementNavFor ) { elementNavFor = null; }
            if( elementNav == 'false' ){ elementNav = false; } else { elementNav = true; }
            if( elementVertical == 'true' ){ elementVertical = true; } else { elementVertical = false; }
            if( elementDrag == 'false' ){ elementDrag = false; } else { elementDrag = true; }
            if( elementFocus == 'true' ){ elementFocus = true; } else { elementFocus = false; }
            if( elementFade == 'true' ){ elementFade = true; } else { elementFade = false; }

            element.slick({
              slidesToShow: Number(elementSlides),
              slidesToScroll: Number(elementSlidesScroll),
              arrows: elementNav, // true or false
              prevArrow: '<a class="slick-prev"><i class="fa fa-angle-left"></i></a>',
              nextArrow: '<a class="slick-next"><i class="fa fa-angle-right"></i></a>',
              asNavFor: elementNavFor,
              adaptiveHeight: false,
              fade: elementFade,
              infinite: false,
              focusOnSelect: elementFocus, // true or false
              vertical: elementVertical, // true or false
              draggable: elementDrag, // true or false
            });
      });

  },

  summarySticky: function(){
    if( $body.hasClass( 'device-lg' ) ){
      $('.single-product-style-2 .product-image-col, .single-product-style-2 .product-summary-col').theiaStickySidebar();
    }
  }


};

LOSTILE_WC.ajaxAddToCart = {
  init: function(){
    LOSTILE_WC.ajaxAddToCart.onSubmit();
  },

  onSubmit: function(){
    $body.on('submit', 'form.cart', function() {
        var $form = $(this),
            $button = $form.find('.single_add_to_cart_button'),
            url = $form.attr('action') ? $form.attr('action') : window.location.href;
          
          // Submit product form via Ajax
          LOSTILE_WC.ajaxAddToCart.submitForm( $form, $button, url );
          return false;
    });
  },

  submitForm: function( $form, $button, url ){
    $button.removeClass('added').addClass('loading').prepend('<span class="atc-loading"><i class="fa fa fa-spinner fa-spin"></i></span>');
     $.ajax({
        url: url,
        data: $form.serialize(),
        success: function(response) {
            $button.removeClass('loading').addClass('added');
            $('.atc-loading').remove();
            $body.trigger('added_to_cart');
            $body.trigger('wc_fragment_refresh');
            if (typeof wc_add_to_cart_params !== 'undefined') {
                if (wc_add_to_cart_params.cart_redirect_after_add == 'yes' && wc_add_to_cart_params.cart_url) {
                    window.location.href = wc_add_to_cart_params.cart_url;
                }
            }
        }
    });
  }
};

LOSTILE_WC.quickview = {
  init: function(){

    //open the quick view panel
    $body.on('click', '.item-quickview', function(event){
      var selectedImage = $(this).parents('.product-image').find('.item-img .has-quickview'),
        slectedImageUrl = selectedImage.attr('src'),
        url =  $(this).attr('href');

      $(this).parent('.product-overlay').after('<div class="loading-popup"><i></i><i></i><i></i><i></i></div>');
      $.post( url, function(response) {
        $quick_view.html(response);
        $('.loading-popup').remove();
        $body.addClass('overlay-layer');
        LOSTILE_WC.quickview.animate(selectedImage, sliderFinalWidth, maxQuickWidth, 'open');
      });

      event.preventDefault();
    });

    //close the quick view panel
    $body.on('click', function(event){
      if( $(event.target).is('.cd-close') || $(event.target).is('body.overlay-layer')) {
        LOSTILE_WC.quickview.close( sliderFinalWidth, maxQuickWidth);
        event.preventDefault();
      }
    });
    $(document).keyup(function(event){
      //check if user has pressed 'Esc'
        if(event.which=='27'){
        LOSTILE_WC.quickview.close( sliderFinalWidth, maxQuickWidth);
      }
    });

    //center quick-view on window resize
    $window.on('resize', function(){
      if($quick_view.hasClass('is-visible')){
        window.requestAnimationFrame(LOSTILE_WC.quickview.resize);
      }
    });
  },

  resize: function() {
    var quickViewLeft = ($window.width() - $quick_view.width())/2,
      quickViewTop = ($window.height() - $quick_view.height())/2;
    $quick_view.css({
        "top": quickViewTop,
        "left": quickViewLeft,
    });
  }, 

  close: function(finalWidth, maxQuickWidth) {
    var close = $('.cd-close'),
      activeSliderUrl = close.siblings('.cd-slider-wrapper').find('.selected-image img').attr('src'),
      selectedImage = $('.empty-box').find('img');
    //update the image in the gallery
    if( !$quick_view.hasClass('velocity-animating') && $quick_view.hasClass('add-content')) {
      selectedImage.attr('src', activeSliderUrl);
      LOSTILE_WC.quickview.animate(selectedImage, finalWidth, maxQuickWidth, 'close');
    } else {
      LOSTILE_WC.quickview.closeNoAnimation(selectedImage, finalWidth, maxQuickWidth);
    }
  },

  animate: function(image, finalWidth, maxQuickWidth, animationType) {
    //store some image data (width, top position, ...)
    //store window data to calculate quick view panel position
    var parentListItem = image.parent('.item-img'),
      topSelected = image.offset().top - $window.scrollTop(),
      leftSelected = image.offset().left,
      widthSelected = image.width(),
      heightSelected = image.height(),
      windowWidth = $window.width(),
      windowHeight = $window.height(),
      finalLeft = (windowWidth - finalWidth)/2,
      finalHeight = finalWidth * heightSelected/widthSelected,
      finalTop = (windowHeight - finalHeight)/2,
      quickViewWidth = ( windowWidth * .8 < maxQuickWidth ) ? windowWidth * .8 : maxQuickWidth ,
      quickViewLeft = (windowWidth - quickViewWidth)/2;

    if( animationType == 'open') {
      //hide the image in the gallery
      parentListItem.addClass('empty-box');
      //place the quick view over the image gallery and give it the dimension of the gallery image
      $quick_view.css({
          "top": topSelected,
          "left": leftSelected,
          "width": widthSelected,
      }).velocity({
        //animate the quick view: animate its width and center it in the viewport
        //during this animation, only the slider image is visible
          'top': finalTop+ 'px',
          'left': finalLeft+'px',
          'width': finalWidth+'px',
      }, 1000, [ 400, 20 ], function(){
        //animate the quick view: animate its width to the final value
        $quick_view.addClass('animate-width').velocity({
          'left': quickViewLeft+'px',
            'width': quickViewWidth+'px',
        }, 300, 'ease' ,function(){
          //show quick view content
          $quick_view.addClass('add-content');
        });
      }).addClass('is-visible');
    } else {
      //close the quick view reverting the animation
      $quick_view.removeClass('add-content').velocity({
          'top': finalTop+ 'px',
          'left': finalLeft+'px',
          'width': finalWidth+'px',
      }, 300, 'ease', function(){
        $body.removeClass('overlay-layer');
        $quick_view.removeClass('animate-width').velocity({
          "top": topSelected,
            "left": leftSelected,
            "width": widthSelected,
        }, 500, 'ease', function(){
          $quick_view.removeClass('is-visible');
          parentListItem.removeClass('empty-box');
        });
      });
    }
  },

  closeNoAnimation: function(image, finalWidth, maxQuickWidth) {
    var parentListItem = image.parent('.item-image'),
      topSelected = image.offset().top - $(window).scrollTop(),
      leftSelected = image.offset().left,
      widthSelected = image.width();

    //close the quick view reverting the animation
    $body.removeClass('overlay-layer');
    parentListItem.removeClass('empty-box');
    $quick_view.velocity("stop").removeClass('add-content animate-width is-visible').css({
      "top": topSelected,
        "left": leftSelected,
        "width": widthSelected,
    });
  }
};

var $body = $('body'),
    $window = $(window),
    $shop = $('#shop'),
    $products = $('.products'),
    $quick_view = $('.cd-quick-view'),
    $productImageSlider = $('.slick-carousel'),
    sliderFinalWidth = 480,  //final width --> this is the quick view image slider width
    maxQuickWidth = 960;  //maxQuickWidth --> this is the max-width of the quick-view panel

$(document).ready( function(){

  LOSTILE_WC.singleproduct.init();
  LOSTILE_WC.loopproduct.init();
});

$window.load( function(){
  $shop.find('.products .row').isotope({ layoutMode: 'fitRows' });
});

})(jQuery);