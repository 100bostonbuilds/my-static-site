

function http_query_build(data) {
    var ret = [];
    for (var d in data)
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
}


function show_bar(options) {
  var wrapper = typeof(options.wrapper) != 'undefined' ? options.wrapper : $('body');
  if (typeof(wrapper) == 'string') {
    wrapper = $(wrapper);
  }

  var notification = $('<div id="' + options.id + '" class="notification">'
                     + '  <div class="uk-container">'
                     + '    <div class="uk-grid-medium" uk-grid>'
                     + '      <div class="text-column uk-width-expand">' + options.text + '</div>'
                     + '      <div class="close-column uk-width-auto"><div class="close">&times;</div></div>'
                     + '    </div>'
                     + '  </div>'
                     + '</div>');

  if (options.showCloseButton === false) {
    $(".close-column", notification).remove();
  }

  if (options.style) {
    $(".text-column", notification).css(options.style);
  }

  if (options.position) {
    notification.addClass(options.position);
  }

  if (options.color) {
    notification.css({
      backgroundColor: options.color
    });
  }

  var regexp = new RegExp(options.id + '_notification=true');
  if (!document.cookie.match(regexp)) {
    wrapper.prepend(notification);
  }

  $(".close", notification).click(function() {
    var notification_id = $(this).closest('.notification').attr('id');
    $(this).closest('.notification').fadeOut(150, function() {
      var expiration_date = new Date();
      expiration_date.setFullYear(expiration_date.getFullYear() + 1);
      document.cookie = notification_id + "_notification=true; path=/; expires=" + expiration_date.toUTCString();

      if (options.onHide && typeof(options.onHide) == 'function') {
        options.onHide();
      }
    });
  });
}


function number_format(number, decimals, decPoint, thousandsSep) {
   decimals = Math.abs(decimals) || 0;
   number = parseFloat(number);

   if (!decPoint || !thousandsSep) {
       decPoint = '.';
       thousandsSep = ',';
   }

   var roundedNumber = Math.round(Math.abs(number) * ('1e' + decimals)) + '';
   var numbersString = decimals ? (roundedNumber.slice(0, decimals * -1) || 0) : roundedNumber;
   var decimalsString = decimals ? roundedNumber.slice(decimals * -1) : '';
   var formattedNumber = "";

   while (numbersString.length > 3) {
       formattedNumber += thousandsSep + numbersString.slice(-3)
       numbersString = numbersString.slice(0, -3);
   }

   if (decimals && decimalsString.length === 1) {
       while (decimalsString.length < decimals) {
           decimalsString = decimalsString + decimalsString;
       }
   }

   return (number < 0 ? '-' : '') + numbersString + formattedNumber + (decimalsString ? (decPoint + decimalsString) : '');
}

$("#share").jsSocials({
  showCount: false,
  showLabel: false,
  shareIn: "popup",
  shares: [
          {
            share: "linkedin",
            logo: CDN + "/img/symbols/white/linkedin.png",
            shareUrl: "https://www.linkedin.com/shareArticle?mini=true&url={url}&title={text}"
          },
          {
            share: "twitter",
            logo: CDN + "/img/symbols/white/twitter.png"
          },
          {
            share: "facebook",
            logo: CDN + "/img/symbols/white/facebook.png",
            shareUrl: "http://www.facebook.com/sharer.php?u={url}&p={text}"
          },
          {
            share: "whatsapp",
            logo: CDN + "/img/symbols/white/whatsapp.png"
          },
          {
            share: "email",
            shareUrl: "mailto:{to}?subject=" + document.title + "&body={url}",
            logo: CDN + "/img/symbols/white/email.png"
          }
        ]
});


// Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 10;

$(window).scroll(function(event){
    didScroll = true;
    if ($(window).scrollTop() > 50) {
      $("#arrow-scroll-down").hide();
      $("#scroll-icon").hide();
    } else {
      $("#arrow-scroll-down").show();
      $("#scroll-icon").show();
    }
});


setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);


function hasScrolled() {

  //console.log($(window).scrollTop());
  //console.log($('.header .topbar').hasClass("do-not-hide-on-top"));

  if ($(window).scrollTop() < 50 && !$('.header .topbar').hasClass("do-not-hide-on-top")) {

    $('.header .topbar').removeClass('down').addClass('up');

  } else {

    //console.log('hasScrolled');

    var navbarHeight = $('.header .topbar').outerHeight();
    var st = $(window).scrollTop();

    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta) {
      return;
    }

    if (st > lastScrollTop && st > navbarHeight){
        // Scroll Down
        $('.header .topbar').removeClass('down').addClass('up');
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            $('.header .topbar').removeClass('up').addClass('down');
        }
    }

    lastScrollTop = st;
  }

  if ($('#project-first-element').length) {
    // Project Scroll
    var projectFullScreenHeight = $("#project-first-element").offset().top - $(window).scrollTop();
    var projectName = $("#project-name").height();
    var projectNamePosition = (projectFullScreenHeight - projectName) / 2;

    if (projectNamePosition < 200) {
      $("#project-name").css("top", projectNamePosition + "px");
    } else {
      $("#project-name").css("top", "200px");
    }
  }

  if ($('#project_name_container').length) {
    if (($(window).height() - $(window).scrollTop()) >= 0) {
      $('#project_name_container').height($(window).height() - $(window).scrollTop());
    } else {
      $('#project_name_container').height(0);
    }
  }

  if ($('#homepage-video-overlay').length) {
    if (($(window).height() - $(window).scrollTop()) >= 0) {
      $('#homepage-video-overlay').height($(window).height() - $(window).scrollTop());
    } else {
      $('#homepage-video-overlay').height(0);
    }
  }

}


function resizeActions() {

  width = $(".header .topbar .uk-container").width();
  single_column_width = (width - (26*11))/12;

  if (single_column_width > 60) {
    $(".counter").width(single_column_width);
    $(".logo").width(single_column_width);
    $(".profile_label_numbers").width(single_column_width);
  } else {
    $(".counter").width(60);
    $(".logo").width(60);
    $(".profile_label_numbers").width(60);
  }

  footer_height = $("#footer").height()-200;
  $("body").css("margin-bottom", footer_height);

  var introduction_text_height = $("#introduction_text").height();
  if ($("body").width() > 640) {
    $("#shape_video_wrapper").css("margin-top", introduction_text_height);
  } else {
    $("#shape_video_wrapper").css("margin-top", "90px");
  }


  $(".link-under-title").css("margin-left", single_column_width);

  $(".recent-news-item").each(function(){
    if ($(this).find('.subtitle')[0]) {
      if ($(this).find('.subtitle')[0].scrollHeight <= 120) {
        $(this).find('.plus').hide();
        $(this).find('.ellipsis_symbol').hide();
      }
    }

  });

  // Modal width
  body_width = $("body").width();
  $(".modal").width(body_width);
  $(".topbar").width(body_width);
  $("#main-menu").width(body_width);
  $(".menu-shape-top-wrapper").width(body_width);
  $("footer").width(body_width);
  $("footer").show();
  //console.log(body_width);

  $("header .full-screen-menu").height($(window).height());


  // Journal Instagram
  if ($("#instagram-container").length) {
    var instagram_container_width = $(window).width();
    var container_width = $(".js-filter").width();
    $("#instagram-container").width(instagram_container_width);
    $("#instagram-container").css("margin-left", ((instagram_container_width-(container_width-28))/2*-1) + "px");
  }

}

// SEARCH ON KEYRPRESS ////////////////////////////////////////////////////////////////

function searchModal(loader) {

  UIkit.modal('#search').show();

  $("#search_input").focus();

  if (loader == "loader") {
    $("#search_results_loader").show();
  } else {
    $("#search_results_loader").hide();
  }

}

$(document).on('click', '#menu-search-link', function(){
  searchModal();
})

$(document).on('click', '#footer-search-link', function(){
  searchModal();
})

$(document).on('keypress', function(e) {
  var tag = e.target.tagName.toLowerCase();
  if ( tag != 'input' && tag != 'textarea') {
    searchModal("loader");
  } else {
    // do nothiing
  }
});

$(document).on('keyup', '#search_input', function() {
  clearTimeout($(this).data('timer'));
  $("#search_results_loader").show();
  $("#search_results_error").hide();
  var search = this.value;
  if (search.length >= 2) {
      $(this).data('timer', setTimeout(function() {
          //console.log("call ajax to search " + search);
          var request = {
              needle: search,
              key: 'ffef8ec2b8db8abc253af9230979ba50'
          }

          $.post("/search", request, function(response) {
            //console.log(response.status);

            $("#search_results_loader").hide();
            if (response.status == 'success') {

              if (response.data.output.html) {

                if (response.data.output.html.project) {
                  $("#search_results .project-wrapper").show();
                  $("#search_results .project-wrapper .project").html(response.data.output.html.project);
                } else {
                  $("#search_results .project-wrapper").hide();
                }

                if (response.data.output.html.people) {
                  $("#search_results .people-wrapper").show();
                  $("#search_results .people-wrapper .people").html(response.data.output.html.people);
                } else {
                  $("#search_results .people-wrapper").hide();
                }

                if (response.data.output.html.career) {
                  $("#search_results .career-wrapper").show();
                  $("#search_results .career-wrapper .career").html(response.data.output.html.career);
                } else {
                  $("#search_results .career-wrapper").hide();
                }

                if (response.data.output.html.page) {
                  $("#search_results .journal-page-wrapper").show();
                  $("#search_results .journal-page-wrapper .journal-page").html(response.data.output.html.page);
                } else {
                  $("#search_results .journal-page-wrapper").hide();
                }

                if (response.data.output.html.brochures) {
                  $("#search_results .brochures-wrapper").show();
                  $("#search_results .brochures-wrapper .brochures").html(response.data.output.html.brochures);
                } else {
                  $("#search_results .brochures-wrapper").hide();
                }

              } else {

                $("#search_results_error").show();
                $("#search_results_error").html("No results");
                $("#search_results .project-wrapper").hide();
                $("#search_results .people-wrapper").hide();
                $("#search_results .career-wrapper").hide();
                $("#search_results .journal-page-wrapper").hide();
                $("#search_results .brochures-wrapper").hide();

              }

            }

          }, 'json');

      }, 500));
  } else {
    $("#search_results_loader").hide();
  }
});

//////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function(){

  show_bar({
    id: 'cookies',
    wrapper: 'body',
    position: 'fixed bottom',
    color: '#111111',
    text: cookie_notification_bar,
    showCloseButton: true,
    style: {
      fontSize: '1.25rem',
      color: '#FEFEFE'
    }
  });

  if ($(window).scrollTop() > 100) {
    if (!$('.header .topbar').hasClass("do-not-hide-on-top")) {
      $('.header .topbar').removeClass('up').addClass('down');
    }
  }

  if ($('.header .topbar').hasClass("do-not-hide-on-top")) {
    $('.header .topbar').removeClass('up').addClass('down');
  }


  var news_subtitle_height = parseInt($('.ellipsis').css('line-height')) * 4;

  $('.plus').click(function(event){
    event.preventDefault;
    if ($(this).hasClass('close')) {

      real_height = $(this).parent().parent().find('.ellipsis')[0].scrollHeight;
      $(this).parent().parent().find('.ellipsis').animate( { height: real_height + "px" }, { queue:false, duration:500 });
      $(this).parent().parent().find('.ellipsis_symbol').hide('slow');
      $(this).removeClass('close');
      $(this).find('.plus_symbol').hide();
      $(this).find('.minus_symbol').show();

    } else {

      $(this).parent().parent().find('.ellipsis').animate( { height: news_subtitle_height + "px" }, { queue:false, duration:500 });
      $(this).parent().parent().find('.ellipsis_symbol').show('slow');
      $(this).addClass('close');
      $(this).find('.plus_symbol').show();
      $(this).find('.minus_symbol').hide();

    }
  });

  UIkit.util.on('#careers-accordion','beforeshow',function(e){
    e.preventDefault;
    $('#careers-accordion li').each(function(){
      if ($(this).hasClass('uk-open')) {
        $(this).find('.plus_symbol').hide();
        $(this).find('.minus_symbol').show();
      }
    });
  });

  UIkit.util.on('#careers-accordion','beforehide',function(e){
    e.preventDefault;
    $('#careers-accordion li').each(function(){
      if (!$(this).hasClass('uk-open')) {
        $(this).find('.plus_symbol').show();
        $(this).find('.minus_symbol').hide();
      }
    });
  });

  UIkit.util.on('#project-introduction-accordion','beforeshow',function(e){
    e.preventDefault;
    $('#project-introduction-accordion li').each(function(){
      if ($(this).hasClass('uk-open')) {
        $(this).find('.up-arrow').show();
        $(this).find('.right-arrow').hide();
      }
    });
  });

  UIkit.util.on('#project-introduction-accordion','beforehide',function(e){
    e.preventDefault;
    $('#project-introduction-accordion li').each(function(){
      if (!$(this).hasClass('uk-open')) {
        $(this).find('.up-arrow').hide();
        $(this).find('.right-arrow').show();
      }
    });
  });

  //hasScrolled();
  resizeActions();

});


$(window).on('resize', function(){

  hasScrolled();
  resizeActions();

});


// Hide Header on on scroll down

$(window).scroll(function(event){
  hasScrolled();
});


var menu_items_enabled;

$(document).on("click", ".menu-shape-icon", function(event) {
  event.preventDefault();

  var left = $('#main-menu').offset().left;  // Get the calculated left position
  menu_items_enabled = false;

  if ($("#main-menu").hasClass("close")) {
    $("#main-menu").removeClass("close").addClass("open");

    // before animation
    if ($(window).width() > 640) {
      $("#main-menu .logo").hide();
    }

    $("#main-menu .menu-shape-icon").hide();

    $("#main-menu").css({left:left}).animate({"left":"0px"}, {
      duration: 400,
      complete: function() {
        $(".topbar .logo").css("opacity", 0);
        $(".menu-shape-top-wrapper").hide();
        $("#main-menu .logo").show();
        $("#main-menu .menu-shape-icon").show();
        menu_items_enabled = true;
      }
    });

  } else {
    $("#main-menu").removeClass("open").addClass("close");

    // before animation
    menu_items_enabled = false;
    $("#main-menu .menu-shape-icon").hide();
    $(".menu-shape-top-wrapper").show();
    $(".topbar .logo").css("opacity", 1);

    $("#main-menu").css({left:left}).animate({"left":"100%"}, {
      duration: 400,
      complete: function() {

      }
    });

  }
});



  $(".menu-item-hover").hover(function () {
    if ($(window).width() > 640) {
      if (menu_items_enabled) {
        var data = $(this).data();
        $("#hover-shape-image").attr("src", data.shape);
        $("#hover-shape-image").show();
        $("#menu-search-wrapper").hide();
        $("#main-menu").css("background-color", "#" + data.color);
      }
    }
  },
  function () {
    if ($(window).width() > 640) {
      if (menu_items_enabled) {
        $("#hover-shape-image").attr("src", "");
        $("#hover-shape-image").hide();
        $("#menu-search-wrapper").show();
        $("#main-menu").css("background-color", "#1d1d1b");
      }
    }
  });
