class NavHelp {
  
  constructor() {
     
  }

  init(){

    $('#aboutHelp').click((evt)=>{
      if(document.getElementsByName('aboutHelpDialog').length>0)
           $('#aboutHelpDialog').modal('show');
      else
        this.createHelpAndShow('aboutHelp');
     });
  
    $('#configHelp').click((evt)=>{
      if(document.getElementsByName('configHelpDialog').length>0)
           $('#configHelpDialog').modal('show');
      else
        this.createHelpAndShow('configHelp');
     });
   
  } 

  createHelpAndShow(helpName){

    $.ajax({
      url: 'helpDiv/'+helpName+'.html',
      success: function(data) {
          var tempDiv = document.createElement('div'); 
          tempDiv.innerHTML = data;
          document.body.appendChild(tempDiv);
  
          if(helpName == 'configHelp'){
            $.getJSON("/oauth/clientid", function (res) {
              $("#ClientID").val(res.id);
              $('#'+helpName+'Dialog').modal('show');  
            }); 
            $("#provisionAccountSave").click(function () {
              $('#configHelpDialog').modal('toggle');
            });
          }else
            $('#'+helpName+'Dialog').modal('show');
        }  
    } );
  }  
}


