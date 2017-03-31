//Dark toggle by twitter.com/xDimGG
//Set functions before page loads for fast inject
function dark(){
    localStorage.setItem('mode','dark');                                    //Save dark mode to localstorage.
    $('body').append('<link id="dark" rel="stylesheet" href="css/dark.css">');  //Inject CSS
    $('.switch').addClass('active');                                        //Toggle switch
}
function light(){
    localStorage.setItem('mode','light');  //Save light mode to localstorage.
    $('#dark').remove();                   //Remove CSS
    $('.switch').removeClass('active');    //Toggle switch
}

//Attempt to inject css as fast as possiple by not waiting for page load
if(localStorage.getItem('mode') == 'dark'){
    dark();
} else if(localStorage.getItem('mode') == 'light'){
    light();
}

//Wait for page load
$(function(){
    $('.switch').click(function(){         //When the switch is clicked
        if ($(this).hasClass('active')) {  //Check if dark mode is already on
            light();                       //Turn on light mode
        } else{                            //If dark mode is off
            dark();                        //Turn on dark mode
        }
    });
});