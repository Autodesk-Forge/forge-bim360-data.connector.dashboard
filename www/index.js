const global_oAuth = new oAuth()
const global_DataManagement = new DataManagement()
const global_DataConnector = new DataConnector()

$(document).ready(function () {

  $('#signInButton').click(global_oAuth.forgeSignIn);
  (async () => {
    const currentToken = await global_oAuth.getForgeToken();
    if (currentToken != '') {

      let profile = await global_oAuth.getForgeUserProfile()

      $('#signInProfileImage').removeClass();
      $('#signInProfileImage').html('<img src="' + profile.picture + '" height="30"/>')
      $('#signInButtonText').text(profile.name);
      $('#signInButtonText').attr('title', 'Click to Sign Out');
      $('#signInButton').click(global_oAuth.forgeLogoff);

      global_DataManagement.refreshHubs()

       //delegate the event when one hub is selected
       delegateHubSelection()
       global_DataConnector.initTable('requestsTable',false)

    }
  })()
});

function delegateHubSelection(){ 
  $(document).on('click', '#hubs_list a', function(e) {
    $('#hub_dropdown_title').html($(this).html());
    const hub_id_without_b = $(this).attr('id')
    const hub_id_with_b = 'b.' + hub_id_without_b
    global_DataConnector.refreshRequestsTable(hub_id_without_b,'requestsTable',false)
  });
}

