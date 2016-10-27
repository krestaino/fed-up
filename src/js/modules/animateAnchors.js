$(function() {
  var stickyNavHeight = $('.motiv-nav').height();

  if ($(window).width() < 768) {
    stickyNavHeight = 0;
  }

  $('a[href*="#"]:not([href="#"])').click(function(event) {
    event.preventDefault();
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top - stickyNavHeight
        }, 333);
        return false;
      }
    }
  });
});