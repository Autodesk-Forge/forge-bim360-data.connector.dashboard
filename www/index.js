const global_oAuth = new oAuth()
const global_DataManagement = new DataManagement()

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
    }
  })()
});

