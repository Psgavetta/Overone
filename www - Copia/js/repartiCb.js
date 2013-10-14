function initRepartiCb() {
    if (FlagDebug) {
        DoinitRepartiCb();
       // ReloadPageRepartiCbON();
    }
    else {
        document.addEventListener("deviceready", onDeviceReadyRepartiCb, false);
    }
}

function onDeviceReadyRepartiCb() {
    //alert('Deviceready');
    // HttpRequest();
    if (checkConnection()) {
        DoinitRepartiCb();
        //HttpRequestRepartiCb();
    }
    else {
        alert("Attenzione. Connessione assente.");
    }
}
var NomeIsolaPer = "ISOLA PERSONALIZZATA";
function DoinitRepartiCb() {
        try {
            if (StoreLocally_get('NomeIsolaPer', false) !== null) {
            
                NomeIsolaPer = StoreLocally_get('NomeIsolaPer', false);
            }
        } catch (e) {
       
        };
        $('#NomeIsPer').text(NomeIsolaPer+':');
    
    ShowLoadingOK();
    GetServerDate('reparti_CB');
}

function ReloadPageRepartiCbON() {
    interval = window.setInterval(function () {
        //location.reload(true);
        GetServerDate('reparti_CB');
    }, 30000);
}
function ReloadPageRepartiCbOFF() {
    interval = window.clearInterval(interval);
}
var dataIsole,dataIsole2;


var dataReparti, dataReparti2;
var dataMacchine, dataMacchine2;
var contCB = 0;

function HttpRequestRepartiCb() {
    var itemsMa = [];
    var itemsIs = [];

    $.getJSON("http://oone.switchup.it/api/OverOnePhoneIsle/", function (dataIsole) {

        
        var itemsBackup = [];
        var reposHTML = "", i = 0;
        var buff = "";
        var stat = "";

        console.log("OK");

        $.each(dataIsole, function (i, OverOnePhoneIsle) {
            if (OverOnePhoneIsle != null) {
                try {
                    itemsIs[i] = OverOnePhoneIsle;
                }
                catch (ex) {
                    console.error(ex.message);
                }
            }
        });

        $.getJSON("http://oone.switchup.it/api/OverOnePhoneData/", function (dataMacchine) {

            
            var itemsBackup = [];
            var j = 0;

            $.each(dataMacchine, function (j, OverOnePhoneData) {
                if (OverOnePhoneData != null) {
                    try {
                        itemsMa[j] = OverOnePhoneData;
                    }
                    catch (ex) {
                        console.error(ex.message);
                    }
                }
            });

            }).fail(function () {
                ////alert("Attenzione. Problema con richiesta GET.");
                ShowLoadingOFF();
            }).success(function () {

                /**************  RICHIESTA REPARTI  ******************/

                $.getJSON("http://oone.switchup.it/api/OverOnePhoneDepartment/", function (dataReparti) {

                    var itemsDp = [];
                    var itemsBackup = [];
                    var reposHTML = "", t = 0;
                    var buff = "";
                    var stat = "";
                    


                    if (JSON.stringify(dataReparti2) === JSON.stringify(dataReparti))
                        console.log("equal");
                    else {
                        console.log("Not equal");

                        dataReparti2 = dataReparti;
                        buff += '<div data-role="collapsible-set" data-theme="c" data-content-theme="d">';
                        $.each(dataReparti, function (t, OverOnePhoneDepartment) {
                            if (OverOnePhoneDepartment != null) {
                                try {
                                    itemsDp[t] = OverOnePhoneDepartment;
                                    buff += '<div data-role="collapsible"  data-theme="g" data-content-theme="a">';
                                    buff += '<h4>' + itemsDp[t].Name + '</h4>';
                                    buff += '<div data-role="collapsible-set"  data-content-theme="a">';
                                    if (itemsDp[t].IsleId.length > 0) {
                                        for (var ii = 0; ii < itemsDp[t].IsleId.length; ii++) {
                                            for (var jj = 0; jj < itemsIs.length; jj++) {
                                                if (itemsIs[jj].IsleId == itemsDp[t].IsleId[ii]) {
                                                    buff += '<div data-role="collapsible"   data-content-theme="c">';
                                                    buff += '<h4>'
                                                    buff += itemsIs[jj].IsleName;
                                                    buff += '</h4>';
                                                    buff += '<div data-role="controlgroup">';
                                                    for (var kk = 0; kk < itemsIs[jj].IPsMachine.length; kk++) {
                                                        for (var tt = 0; tt < itemsMa.length; tt++) {
                                                            if (itemsMa[tt].MachineIP == itemsIs[jj].IPsMachine[kk]) {
                                                                buff += '<input name="checkbox-' + contCB + '_'+ IPToUnderscore(itemsMa[tt].MachineIP,'Point->Under') + '" id="checkbox-' + contCB + '" type="checkbox">';
                                                                buff += '<label for="checkbox-' + contCB + '">' + itemsMa[tt].MachineName + ' - ' + itemsMa[tt].MachineIP + '</label>';
                                                            }
                                                        }

                                                        contCB++;
                                                    }
                                                    buff += '</div></div>';
                                                }
                                            }
                                        }
                                    }
                                    if (itemsDp[t].IPsMachine.length > 0) {
                                        buff += '<div data-role="collapsible"   data-content-theme="c">';
                                        buff += '<h4>'
                                        buff += 'MACCHINE';
                                        buff += '</h4>';
                                        buff += '<div data-role="controlgroup">';
                                        for (var kk = 0; kk < itemsDp[t].IPsMachine.length; kk++) {
                                            
                                            for (var tt = 0; tt < itemsMa.length; tt++) {
                                                if (itemsMa[tt].MachineIP == itemsDp[t].IPsMachine[kk]) {
                                                    buff += '<input name="checkbox-' + contCB + '_' + IPToUnderscore(itemsMa[tt].MachineIP,'Point->Under') + '" id="checkbox-' + contCB + '" type="checkbox">';
                                                    buff += '<label for="checkbox-' + contCB + '">' + itemsMa[tt].MachineName + ' - ' + itemsMa[tt].MachineIP + '</label>';
                                                }
                                            }

                                            contCB++;
                                        }
                                        buff += '</div></div>';
                                        
                                    }
                                    buff += '</div></div>';
                                    /*
                                    buff += '</ul></div>';
                                    buff += '</ul>'*/
                                }
                                catch (ex) {
                                    console.error(ex.message);
                                }
                            }
                        });
                        //buff += '</div></div>';
                        buff += '</div>';
                        $('#ListRepIsMac').html(buff);
                        $('#ListRepIsMac').trigger("create");
                        
                        var appStr=""
                        var getMacChecked=StoreArrayLocally_get('IPsIsolaP');
                        if (getMacChecked !== null) {
                            for (var zzz = 0; zzz < contCB; zzz++) {
                                for (var vvv = 0; vvv < getMacChecked.length; vvv++) {
                                    appStr = 'checkbox-' + zzz + '_' + IPToUnderscore(getMacChecked[vvv], 'Point->Under');
                                    if (document.getElementById("checkbox-" + zzz).name == appStr) {
                                        document.getElementById("checkbox-" + zzz).checked = true;
                                    }
                                }
                            }
                        }
                        $('#ListRepIsMac').trigger("create");

                    }
					ShowLoadingOFF();
                }).fail(function () {
                    ////alert("Attenzione. Problema con richiesta GET.");
                    ShowLoadingOFF();
                });

                /*****************************************************/
        });


        }).fail(function () {
            ////alert("Attenzione. Problema con richiesta GET.");
            ShowLoadingOFF();
        });

        

    //});
}

function SaveName() {
    NomeIsolaPer = document.all.FormNomeIsola.value;
}

function SaveIPs() {
    var str = [], strNomi = [], contStr = 0;
    var str2 = [];
    for (var iii = 0; iii < contCB; iii++) {
        if (document.getElementById("checkbox-" + iii).checked == true) {
            str[contStr] = document.getElementById("checkbox-" + iii).name.substring(document.getElementById("checkbox-" + iii).name.indexOf('_') + 1);
            str[contStr] = IPToUnderscore(str[contStr], 'Under->Point');
            contStr++;
        }
    }
    StoreArrayLocally('IPsIsolaP', str);
    StoreLocally('NomeIsolaPer',NomeIsolaPer, false);
}

function IPToUnderscore(IPAddress,Direction) {
    if (Direction == 'Under->Point') {
        for (var kkk = 0; kkk < 3; kkk++) {
            IPAddress = IPAddress.replace("_", ".");
        }
    }
    else if (Direction == 'Point->Under') {
        for (var kkk = 0; kkk < 3; kkk++) {
            IPAddress = IPAddress.replace(".", "_");
        }
    }
    
    return (IPAddress);
}

function CheckAll() {
    for (var iii = 0; iii < contCB; iii++) {
        document.getElementById("checkbox-" + iii).checked = true;
        $("input[id='checkbox-" + iii+"']").checkboxradio("refresh");
    }
    $('.selector').prop('checked', true).checkboxradio('refresh');
}

function UncheckAll() {
    for (var iii = 0; iii < contCB; iii++) {
        document.getElementById("checkbox-" + iii).checked = false;
        $("input[id='checkbox-" + iii + "']").checkboxradio("refresh");
    }
    $('.selector').prop('checked', true).checkboxradio('refresh');
}
