function InitFp() {
	if(StoreLocally_get('LoginOK',false)=='TRUE'){
		doRedirectLocale('reparti.html');
	}
	else
		document.addEventListener("deviceready", onDeviceReady, false);
    //document.addEventListener("deviceready", onDeviceReady, true);
	
}

function onDeviceReady() {
	document.addEventListener("backbutton", BackKeyDown, false);
	$.mobile.changePage("#login", { role: "dialog" });   
	//doRedirectLocale('#login');
}

function BackKeyDown() {

    ShowExitConfirm();
    //navigator.app.exitApp();  // For Exit Application
}
