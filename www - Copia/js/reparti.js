function initReparti() {
    if (FlagDebug) {
		ShowLoadingOK();
        GetServerDate('reparti');
        ReloadPageRepartiON();
    }
    else {
        document.addEventListener("deviceready", onDeviceReadyReparti, false);
        
    }
}

function onDeviceReadyReparti() {
    //alert('Deviceready');
    // HttpRequest();
    if (checkConnection()) {
		ShowLoadingOK();
        GetServerDate('reparti');
        ReloadPageRepartiON();
    }
    else {
        alert("Attenzione. Connessione assente.");
    }
}

function ReloadPageRepartiON() {
    interval = window.setInterval(function () {
        //location.reload(true);
        GetServerDate('reparti');
    }, 30000);
}
function ReloadPageRepartiOFF() {
    interval = window.clearInterval(interval);
}

var dataIsole,dataIsole2;

var dataReparti, dataReparti2;

function HttpRequestReparti() {

    $.getJSON("http://oone.switchup.it/api/OverOnePhoneIsle/", function (dataIsole) {

        var itemsIs = [];
        var itemsBackup = [];
        var reposHTML = "", i = 0;
        var buff = "";
        var stat = "";

        if (JSON.stringify(dataIsole2) === JSON.stringify(dataIsole))
            console.log("equal");
        else {
            console.log("Not equal");
            dataIsole2 = dataIsole;

            //$("#IsleList").listview();
            if (FlagConsole)
                console.log("OK");

            $.each(dataIsole, function (i, OverOnePhoneIsle) {
                if (OverOnePhoneIsle != null) {
                    try {
                        itemsIs[i] = OverOnePhoneIsle;
                    }
                    catch (ex) {
                        alert("Errore" + ex.message);
                    }
                }
            });
        }
            /**************  RICHIESTA REPARTI  ******************/

        $.getJSON("http://oone.switchup.it/api/OverOnePhoneDepartment/", function (dataReparti) {

            var itemsDp = [];
            var itemsBackup = [];
            var reposHTML = "", i = 0;
            var buffRepart = "";
            var stat = "";

            if (JSON.stringify(dataReparti2) === JSON.stringify(dataReparti))
                console.log("equal");
            else {
                console.log("Not equal");
                dataReparti2 = dataReparti;
                buffRepart += '<div data-role="collapsible-set" data-theme="c" data-content-theme="d">';
                $.each(dataReparti, function (i, OverOnePhoneDepartment) {
                    if (OverOnePhoneDepartment != null) {
                        try {
                            itemsDp[i] = OverOnePhoneDepartment;
                            buffRepart += '<div data-role="collapsible"  data-theme="g" data-content-theme="a">';
                            buffRepart += '<h4>' + itemsDp[i].Name + '</h4>';
                            buffRepart += '<ul data-role="listview">';
                            if (itemsDp[i].IsleId.length>0) {
                                for (var ii = 0; ii < itemsDp[i].IsleId.length; ii++) {
                                    for (var jj = 0; jj < itemsIs.length; jj++) {
                                        if (itemsIs[jj].IsleId == itemsDp[i].IsleId[ii])
                                            buffRepart += '<li><img src="img/macchina_icona.png" class="iconeTasti"><a onclick="ShowLoadingOK();StoreLocally(\'MachineToView\',\'' + itemsIs[jj].IsleId + '\',false);StoreLocally(\'DepartmentToView\',\'' + OverOnePhoneDepartment.DepartmentId + '\',false);doRedirectLocale(\'macchine.html\');">' + itemsIs[jj].IsleName + '</a></li>';
                                    }
                                }
                            }
                            if (itemsDp[i].IPsMachine.length>0)
                                buffRepart += '<li><img src="img/macchina_icona.png" class="iconeTasti"><a onclick="ShowLoadingOK();StoreLocally(\'MachineToView\',\'NULL\',false);StoreLocally(\'DepartmentToView\',\'' + OverOnePhoneDepartment.DepartmentId + '\',false);doRedirectLocale(\'macchine.html\');">MACCHINE</a></li>';
                            buffRepart += '</ul></div>';

                        }
                        catch (ex) {
                            alert("Errore" + ex.message);
                        }
                    }
                });
                /********** ISOLA PERSONALIZZATA *********/
                try{
                    var appStr2=[];
                    appStr2 = StoreArrayLocally_get('IPsIsolaP');
                    console.log(appStr2);
                    if (appStr2 !== null) {
                        if (appStr2) {
                            if (appStr2.length > 0) {
                                buffRepart += '<div data-role="collapsible"  data-theme="g" data-content-theme="a">';
                                buffRepart += '<h4>';
                                var appS = "";
                                try {
                                    if (StoreLocally_get('NomeIsolaPer', false).length > 0 ) {
                                        appS =  StoreLocally_get('NomeIsolaPer', false);
                                    }
                                    else {
                                        appS = 'ISOLA PERSONALIZZATA';
                                    }
                                } catch (e) {
                                    appS  = 'ISOLA PERSONALIZZATA';
                                };
                                buffRepart += appS;
                                buffRepart += '</h4>';
                                buffRepart += '<ul data-role="listview">';
                                buffRepart += '<li><img src="img/macchina_icona.png" class="iconeTasti"><a onclick="ShowLoadingOK();StoreLocally(\'MachineToView\',\'NULL\',false);StoreLocally(\'DepartmentToView\',\'NULL\',false);doRedirectLocale(\'macchine.html\');">' + appS + '</a></li>';
                                buffRepart += '</ul></div>';
                            }
                        }
                    }
                } catch (erro) {
                    alert(erro);
                }
                    /*****************************************/
                    buffRepart += '</div>';
                    $('#ListRepIsMacRep').html(buffRepart);
                    $('#ListRepIsMacRep').trigger("create");
                    
                }
				ShowLoadingOFF();
            }).fail(function () {
                ////alert("Attenzione. Problema con richiesta GET.");
                ShowLoadingOFF();
            });

            /*****************************************************/

          
        
    }).fail(function () {
       //// alert("Attenzione. Problema con richiesta GET.");
        ShowLoadingOFF();
    });


    
}


