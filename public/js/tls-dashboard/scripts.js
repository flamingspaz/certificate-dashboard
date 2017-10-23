$(function () {
  var $container = $('#container');
  var certificatesInfo = $container.data('certinfo');
  var runDate = $container.data('rundate');
  var headerBackground = $container.data('headerBackground');

  $('#created_date').html(runDate);


  var sorted_certificates = Object.keys(certificatesInfo)
  .sort(function (a, b) {
    return certificatesInfo[a].info.sort_order - certificatesInfo[b].info.sort_order;
  }).map(function (sortedKey) {
    return certificatesInfo[sortedKey];
  });

  var card_html = String()
    +'<div class="col-xs-12 col-md-6 col-xl-3">'
    +'  <div class="card text-xs-center" style="border-color:#333;">'
    +'    <div class="card-header" style="overflow:hidden;">'
    +'      <h4 class="text-muted" style="margin-bottom:0;">{{server}}</h4>'
    +'    </div>'
    +'    <div class="card-block card-inverse card-{{background}}">'
    +'      <h1 class="card-text display-4" style="margin-top:0;margin-bottom:-1rem;">{{days_left}}</h1>'
    +'      <p class="card-text" style="margin-bottom:.75rem;"><small>days left</small></p>'
    +'    </div>'
    +'    <div class="card-footer">'
    +'      <h6 class="text-muted" style="margin-bottom:.5rem;">Issued by: {{issuer}}</h6>'
    +'      <h6 class="text-muted" style=""><small>{{issuer_cn}}</small></h6>'
    +'      <h6 class="text-muted" style="margin-bottom:0;"><small>{{common_name}}</small></h6>'
    +'    </div>'
    +'  </div>'
    +'</div>';

  function insert_card(json) {
    var card_template = Handlebars.compile(card_html),
      html = card_template(json);
    $('#panel').append(html);
  };

  sorted_certificates.forEach(function(element, index, array){
    var json = {
      'server': element.server,
      'days_left': element.info.days_left,
      'issuer': element.issuer.org,
      'common_name': element.subject.common_name,
      'issuer_cn': element.issuer.common_name,
      'background': element.info.background_class
    }
    insert_card(json);

  });
});
