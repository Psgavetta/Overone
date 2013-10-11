function SendLoginRequest() {
    if (FlagDebug) {
        HttpRequestIsoleLogin()
        //doRedirectLocale('macchine.html');
    }
    else {
        if (checkConnection()) {
            //doRedirectLocale('macchine.html');
             HttpRequestIsoleLogin();
        }
        else {
            alert("Attenzione. Connessione assente.");
            ShowLoadingOFF();
        }
    }
}

function HttpRequestIsoleLogin() {

    StoreLocally('OnlyOne', 'no', false);
	StoreLocally('LoginOK','TRUE',false);
    doRedirectLocale("reparti.html");

}

/*.fail(function (d) {
        alert("Attenzione. Problema con richiesta GET."+d.);
        
    });*/