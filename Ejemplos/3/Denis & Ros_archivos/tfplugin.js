setTimeout(CheckJqueryLoaded, 100)


function CheckJqueryLoaded(){
    if (typeof(jQuery) =="undefined"){
        setTimeout(CheckJqueryLoaded, 100);
        return;
    }
    InitializeTf();
}

function InitializeTf(){
    if (jQuery(".select-tipo-documento select").length > 0){
        jQuery(".select-tipo-documento select").select2();
    }
}