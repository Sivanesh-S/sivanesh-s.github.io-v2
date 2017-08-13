$(document).ready(function() {

  function waypointAnime(element, animeShow, animeHide, offsetValue) {
    $(element).waypoint(function(direction) {
      $(element).addClass(' animated');
      if(direction == 'down') {
        $(element).addClass(animeShow);
        $(element).removeClass(animeHide);
      } else {
        $(element).removeClass(animeShow);
        $(element).addClass(animeHide);
      }

    }, {offset: offsetValue});
  }

  waypointAnime('.amateur', ' fadeInUp', ' fadeOutDown', '65%');
  waypointAnime('.kits', ' fadeInUp', ' fadeOutDown', '65%');
  waypointAnime('.mine', ' fadeInUp', ' fadeOutDown', '65%');
  waypointAnime('.mongoDB', ' fadeInUp', ' fadeOutDown', '65%');
  waypointAnime('.favourites', ' fadeInUp', ' fadeOutDown', '65%');
  waypointAnime('.photoshop', ' fadeInLeft', ' fadeOutLeft', '65%');
  waypointAnime('.favs', ' bounceIn', ' bounceOut', ' 65%');
  waypointAnime('.lap', ' zoomInLeft', ' zoomOutRight', '65%');
  waypointAnime('.lap2', ' zoomInRight', ' zoomOutLeft', '65%');
  waypointAnime('.mobile', ' zoomIn', ' zoomOut', '65%');
  waypointAnime('.window1', ' fadeInUp', ' fadeOutDown', '65%');
  waypointAnime('.window2', ' fadeInUp', ' fadeOutDown', '65%');
  waypointAnime('.linux', ' fadeInLeft', ' fadeOutLeft', '65%');
  waypointAnime('.android', ' fadeInRight', ' fadeOutRight', '65%');
  waypointAnime('.linux-mint', ' fadeInUp', ' fadeOutDown', '65%');
  waypointAnime('.ubuntu', ' fadeInUp', ' fadeOutDown', '65%');

});
