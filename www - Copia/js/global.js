var FlagDebug = 0;
var FlagConsole = 0;


/****************************************************************/
/*                        GENERIC                               */
/****************************************************************/
function doRedirect() {

    if (document.all.sito.value == "")
        alert('Attenzione!inserire prima un URL!');
    else {
        if (checkConnection())
            Redirect(document.all.sito.value);
        else
            alert('Impossibile!Dispositivo OFFLINE!');
    }
}
function doRedirectLocale(URLPage) {
        RedirectLocale(URLPage);
}

/****************************************************************/
/*                        REDIRECT                              */
/****************************************************************/
function Redirect(URLName) {
    location.href = "http://" + URLName;
}
function RedirectLocale(PageName) {
    //location.href = PageName;
   /* $(document).bind('mobileinit', function () {
        $.mobile.loader.prototype.options.text = "loading";
        $.mobile.loader.prototype.options.textVisible = false;
        $.mobile.loader.prototype.options.theme = "a";
        $.mobile.loader.prototype.options.html = "";
    });
    $.mobile.changePage(PageName, { showLoadMsg: "true" });*/
    window.location = PageName;
}
/****************************************************************/
/*                        CONNECTION                            */
/****************************************************************/

function checkConnection() {
    var networkState = navigator.network.connection.type;

    /*var states = {};
	states[Connection.UNKNOWN]  = 'Unknown connection';
	states[Connection.ETHERNET] = 'Ethernet connection';
	states[Connection.WIFI]     = 'WiFi connection';
	states[Connection.CELL_2G]  = 'Cell 2G connection';
	states[Connection.CELL_3G]  = 'Cell 3G connection';
	states[Connection.CELL_4G]  = 'Cell 4G connection';
	states[Connection.NONE]     = 'No network connection';*/

    switch (networkState) {
        case Connection.UNKNOWN: return (0);
        case Connection.NONE: return (0);
        case Connection.ETHERNET: return (1);//'Ethernet connection';
        case Connection.WIFI: return (2);//     = 'WiFi connection';
        case Connection.CELL_2G: return (3);//  = 'Cell 2G connection';
        case Connection.CELL_3G: return (4);//  = 'Cell 3G connection';
        case Connection.CELL_4G: return (5);//  = 'Cell 4G connection';
    }

    //alert('Connection type: ' + states[networkState]);

}

/****************************************************************/
/*                        LOCAL STORAGE                         */
/****************************************************************/

function StoreLocally(SetKey,SetValue,IsArray) {
    if (!IsArray)
        window.localStorage.setItem(SetKey, SetValue);
}

function StoreLocally_get(SetKey, IsArray) {
    return (window.localStorage.getItem(SetKey));
}

function StoreLocally_clear() {
    window.localStorage.clear();
}

// per salvare un array

function StoreArrayLocally(key, obj) {
    return (window.localStorage.setItem(key, JSON.stringify(obj)));
}

function StoreArrayLocally_get(key) {
    return (JSON.parse(window.localStorage.getItem(key)));
}


/****************************************************************/
/*                        CONFIRM  EXIT                         */
/****************************************************************/


function showConfirm(message, callback, buttonLabels, title) {

    //Set default values if not specified by the user.
    buttonLabels = buttonLabels || 'OK,Cancel';

    title = title || "default title";

    //Use Cordova version of the confirm box if possible.
    if (navigator.notification && navigator.notification.confirm) {

        var _callback = function (index) {
            if (callback) {
                callback(index == 1);
            }
        };

        navigator.notification.confirm(
            message,      // message
            _callback,    // callback
            title,        // title
            buttonLabels  // buttonName
        );

        //Default to the usual JS confirm method.
    } else {
        invoke(callback, confirm(message));
    }
}

function ShowExitConfirm() {
    var message = "Confermare uscita?";
    var title = "Uscita";

    //The first element of this list is the label for positive 
    //confirmation i.e. Yes, OK, Proceed.
    var buttonLabels = "Si,No";

    var callback = function (yes) {
        if (yes) {
            //alert('Proceed');
            navigator.app.exitApp();  // For Exit Application
        }
        /*else {
            alert('Do Not Proceed');
        }*/
    };
    showConfirm(message, callback, buttonLabels, title);
}

function ShowLoadingOK() {
    $.mobile.loading('show', {theme:"a", text:"attendere...", textonly:true, textVisible: true});
}

function ShowLoadingOFF() {
    $.mobile.loading('hide');
}


var dataSDate;
function GetServerDate(afterCheck) {

    if (!((!FlagDebug) && (!checkConnection()))) {
        $("#MexOffline").empty();
        $.getJSON("http://oone.switchup.it/api/OverOnePhoneConnection/", function (dataSDate) {

            var i = 0;

            $.each(dataSDate, function (i, OverOnePhoneConnection) {
                if (OverOnePhoneConnection != null) {
                    try {
                        if (FlagConsole) {
                            console.log('Ricevuto' + OverOnePhoneConnection);
                        }

                        if (TimePassedUntilNow(OverOnePhoneConnection) > '30') {    //30
                            alert("Attenzione. Il server non aggiorna i dati.");
                        }
                        else {
                            if (afterCheck == 'reparti') 
                                    HttpRequestReparti();
                            else if (afterCheck == 'macchine_true')
                                HttpRequestRefresh(true);
                            else if (afterCheck == 'macchine_false')
                                HttpRequestRefresh(false);
                            else if (afterCheck == 'reparti_CB')
                                HttpRequestRepartiCb(false);
                        }
                    }
                    catch (ex) {
                        alert('errore' + ex.message);/////////////////////////////////////
                        console.log('errore' + ex.message);
                    }
                }
            });
        }).fail(function () {
            ////alert("Attenzione. Problema con richiesta GET.");
            ShowLoadingOFF();
        });
    }
    else {
        alert("Attenzione. Connessione assente.");
        $("#MexOffline").text('Connessione: OFFLINE');
    }
}

function TimePassedUntilNow(dataPassed) {

    var dataNow = new Date().getTime();
    var gg = "", mm = "", aaaa = "", hh = "", min = "", sec = "", ii, cont = 0;

    cont = 0;
    for (ii = 0; ii < dataPassed.length; ii++) {
        if (IsNumber(dataPassed.charAt(ii))) {
            switch (cont) {
                case 0: gg += dataPassed.charAt(ii);
                    break;
                case 1: mm += dataPassed.charAt(ii);
                    break;
                case 2: aaaa += dataPassed.charAt(ii);
                    break;
                case 3: hh += dataPassed.charAt(ii);
                    break;
                case 4: min += dataPassed.charAt(ii);
                    break;
                case 5: sec += dataPassed.charAt(ii);
                    break;
            }
        }
        else {
            cont++;
        }

    }

    var data2 = new Date(aaaa, mm - 1, gg, hh, min, sec).getTime();
    var diffDate;

    diffDate = dataNow - data2;
    diffDate /= 1000;
    diffDate = Math.round(diffDate);
    return (diffDate);
}

function IsNumber(carattere) {
    if ((carattere >= '0') && (carattere <= '9'))
        return (true);
    else
        return (false);
}

function DoLogout()
{
ShowLoadingOK();
StoreLocally('LoginOK','FALSE',false);
doRedirectLocale('index.html');
}