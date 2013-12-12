function ForSwipe() {

    $(document).on('swiperight', '[id="one"]', function (event) {
        if (event.handled !== true) // This will prevent event triggering more then once
        {
            /*var nextpage = $(this).next('[data-role="page"]');
            // swipe using id of next page if exists
            if (nextpage.length > 0) {
                $.mobile.changePage(nextpage, { transition: "slide", reverse: false }, true, true);
            }
            event.handled = true;*/
            //alert("OK");
            $("#nav-panel").panel("open");
        }
        return false;
    });
}

function ForSwipePopup() {

    $(document).on('swipeleft', '[id="Cruscotto"]', function (event) {
        if (event.handled !== true) // This will prevent event triggering more then once
        {
            /*var nextpage = $(this).next('[data-role="page"]');
            // swipe using id of next page if exists
            if (nextpage.length > 0) {
                $.mobile.changePage(nextpage, { transition: "slide", reverse: false }, true, true);
            }
            event.handled = true;*/
            try{

                //$('#popup2').popup('close');
                //doRedirectLocale("macchine.html#Dettaglio");
                EffectSwipePopup();
            } catch (e)
            {
                alert('Errore: ' + e);
            }
            //console.log("OK");

        }
        return false;
    });
}
function EffectSwipePopup() {
    ShowLoadingOK();
    changeInfo(StoreLocally_get('PopupView', false));
    $.mobile.changePage("#Dettaglio");
}
function ForSwipeDettaglio() {

    $(document).on('swiperight', '[id="Dettaglio"]', function (event) {
        if (event.handled !== true) // This will prevent event triggering more then once
        {
            /*var nextpage = $(this).next('[data-role="page"]');
            // swipe using id of next page if exists
            if (nextpage.length > 0) {
                $.mobile.changePage(nextpage, { transition: "slide", reverse: false }, true, true);
            }
            event.handled = true;*/
            ShowLoadingOK();
            doRedirectLocale("macchine.html");
            
        }
        return false;
    });
}

function initMacchine() {
    
    StoreLocally('PopupView','NULL',false);
    if (FlagDebug) {
        DoInitMacchine();
    }
    else
        document.addEventListener("deviceready", onDeviceReadyMacc, false);

    
}

function onDeviceReadyMacc() {
    DoInitMacchine();
}

function doOnOrientationChange() {
    /*switch (window.orientation) {
        case -90:
        case 90:
            alert('landscape');
            break;
        default:
            alert('portrait');
            break;
    }*/
    if ($.mobile.activePage.attr('id') == "Cruscotto") {
        // Do something here if the popup is open
        // alert("ok");
		
		
        //OpenPopup(StoreLocally_get('PopupView', false), true);
		GetServerDate('macchine_false');
    }

}


function DoInitMacchine(){
    /*if (StoreLocally_get('OnlyOne', false) == 'yes') {
        element = document.getElementById('TastoIndietro');
        element.style.display = "none";
        element = document.getElementById('TastoMenu');
        element.style.display = "none";
    }*/
	ShowLoadingOK();
    ForSwipe();
    ForSwipePopup();
    ForSwipeDettaglio();
    $.event.special.swipe.horizontalDistanceThreshold = 20;
    //console.log($.event.special.swipe.horizontalDistanceThreshold);
    window.addEventListener('orientationchange', doOnOrientationChange);
    
    StoreLocally('changeInfoMac', 'no', false);
    //alert('Deviceready');
    // HttpRequest();
    if (FlagDebug) {
        GetServerDate('macchine_true');
        ReloadPageON();
    }
    else {
        if (checkConnection()) {
            GetServerDate('macchine_true');
            ReloadPageON();
        }
        else {
            alert("Attenzione. Connessione assente.");
        }
    }


    $(document).on('pageshow', '[id="Cruscotto"]', function (event) {
        if (event.handled !== true) // This will prevent event triggering more then once
        {
            $('#CruscottoContent').html(markup);
            DoGraph(StoreLocally_get('PopupView', false),true);
            $('#CruscottoContent').closest(":jqmData(role='page')").trigger('create');
            
            
            //alert("OK");
        }
        return false;
    });


}

var interval;

function ReloadPageON() {
    interval = window.setInterval(function () {
        //location.reload(true);
        GetServerDate('macchine_false');
    }, 30000);
}
function ReloadPageOFF() {
    interval = window.clearInterval(interval);
}

/****************************************************************/
/*                        		GET REQUEST                     */
/****************************************************************/


// alert dialog dismissed
function alertDismissed() {
    RedirectLocale('isole.html');
}

var items = [],markup="";
var dataData, dataData2;
var dataIsle, dataIsle2, itemsIsole=[],itemsIsolePag;
var dataDepartment, dataDepartment2, itemsDepartment;
function HttpRequestRefresh(FisrtTime) {
    var IsleToCheck = "";
    var DepToCheck = "";

    IsleToCheck = StoreLocally_get("MachineToView", false);
    DepToCheck = StoreLocally_get("DepartmentToView", false);
    $.getJSON("http://oone.switchup.it/api/OverOnePhoneIsle/", function (dataIsle) {

        var buffIsle=""; //= '<li data-icon="delete"><a href="#" data-rel="close">Close menu</a></li>';
        var reposHTML = "", j = 0;

        if (FisrtTime == true) {
            $('#MenuPanel').empty();
            $('#MenuPanel').append('<li><a href="#nav-panel" data-rel="close">Chiudi</a></li>');
            
        }

        if (JSON.stringify(dataIsle2) === JSON.stringify(dataIsle))
            console.log("equal");
        else {
            console.log("Not equal");
            dataIsle2 = dataIsle;

            if (FlagConsole) {
                console.log("OK");
                console.log(IsleToCheck);
                
            }
            $.each(dataIsle, function (j, OverOnePhoneIsle) {
                if (OverOnePhoneIsle != null) {
                    try {
                        itemsIsole[j] = OverOnePhoneIsle;
                        if (OverOnePhoneIsle.IsleId == IsleToCheck) {
                            itemsIsolePag = OverOnePhoneIsle;
                            if (FisrtTime == true) {
                                if (itemsIsole[j].IsleName == "OVERONE_PROTOCOL_EMPTY_ISLE")
                                    $("#NomeIsola").text("---");
                                else
                                    $("#NomeIsola").text(itemsIsole[j].IsleName);
                            }
                            if (FlagConsole) {
                                console.log(itemsIsole[j].IsleName);
                                for (ii = 0; ii < itemsIsole[j].IPsMachine.length; ii++)
                                    console.log(itemsIsole[j].IPsMachine[ii]);
                            }
                        }
                        if (FisrtTime == true) {

                            if (OverOnePhoneIsle.IsleName != "OVERONE_PROTOCOL_EMPTY_ISLE") {
                                buffIsle += '<li><a onclick="StoreLocally(\'MachineToView\',\'' + OverOnePhoneIsle.IsleId + '\',false);ShowLoadingOK();doRedirectLocale(\'macchine.html\')"</a>' + OverOnePhoneIsle.IsleName + '</li>';
                                //$("#NomeIsola").text(OverOnePhoneIsle.IsleName);
                            }
                            else {
                                if (OverOnePhoneIsle.IPsMachine.length) {
                                    buffIsle += '<li><a onclick="StoreLocally(\'MachineToView\',\'' + OverOnePhoneIsle.IsleId + '\',false);ShowLoadingOK();doRedirectLocale(\'macchine.html\')"</a>Altre</li>';
                                    //$("#NomeIsola").text('Macchine');
                                }
                            }
                        }
                        else {
                            AlertAndRedirect('reparti.html');
                        }
                    }catch (ex) {
                        console.error(ex.message);
                    }
                }
           
            });

            $('#MenuPanel').append(buffIsle).listview('refresh');
            $("#nav-panel").trigger("updatelayout");
        }
    }).fail(function () {
        ////alert("Attenzione. Problema con richiesta GET.");
        ShowLoadingOFF();
    });
 
       
    $.getJSON("http://oone.switchup.it/api/OverOnePhoneDepartment/", function (dataDepartment) {

        var buffDepartment = ""; //= '<li data-icon="delete"><a href="#" data-rel="close">Close menu</a></li>';
        var reposHTML = "", j = 0;
        var DepartmentToView;

        DepartmentToView = StoreLocally_get('DepartmentToView', false);

        if (FisrtTime == true) {
            $('#MenuPanel').empty();
            

        }

        if (JSON.stringify(dataDepartment2) === JSON.stringify(dataDepartment))
            console.log("equal");
        else {
            console.log("Not equal");
            dataDepartment2 = dataDepartment;
        
            $.each(dataDepartment, function (j, OverOnePhoneDepartment) {
                if (OverOnePhoneDepartment != null) {
                    try {

                        /*if (OverOnePhoneDepartment.IsleId == IsleToCheck) {
                            itemsIsole = OverOnePhoneIsle;
                            console.log("OK!!!!!!!" + itemsIsole.IsleName);
                            if (FisrtTime == true) {
                                if (itemsIsole.IsleName == "OVERONE_PROTOCOL_EMPTY_ISLE")
                                    $("#NomeIsola").text("---");
                                else
                                    $("#NomeIsola").text(itemsIsole.IsleName);
                            }
                            if (FlagConsole) {
                                console.log(itemsIsole.IsleName);
                                for (ii = 0; ii < itemsIsole.IPsMachine.length; ii++)
                                    console.log(itemsIsole.IPsMachine[ii]);
                            }
                        }*/
                        if (FisrtTime == true) {
                            if (OverOnePhoneDepartment.DepartmentId == DepartmentToView)
                                $("#NomeReparto").text(OverOnePhoneDepartment.Name);
                            buffDepartment += '<li>' + OverOnePhoneDepartment.Name + '</li>';
                            for (var ii = 0; ii < OverOnePhoneDepartment.IsleId.length; ii++) {
                                for (var jj = 0; jj < itemsIsole.length; jj++) {
                                    if (itemsIsole[jj].IsleId == OverOnePhoneDepartment.IsleId[ii]) {
                                        buffDepartment += '<li><a onclick="StoreLocally(\'MachineToView\',\'' + itemsIsole[jj].IsleId + '\',false);StoreLocally(\'DepartmentToView\',\'' + OverOnePhoneDepartment.DepartmentId + '\',false);ShowLoadingOK();doRedirectLocale(\'macchine.html\')">' + itemsIsole[jj].IsleName + '</a></li>';
                                    }
                                }
                            }
                            if (OverOnePhoneDepartment.IPsMachine.length > 0)
                                buffDepartment += '<li><a onclick="ShowLoadingOK();StoreLocally(\'MachineToView\',\'NULL\',false);StoreLocally(\'DepartmentToView\',\'' + OverOnePhoneDepartment.DepartmentId + '\',false);doRedirectLocale(\'macchine.html\');">MACCHINE</a></li>';
                            if ((IsleToCheck == 'NULL') && (DepToCheck != 'NULL')) {
                                if (OverOnePhoneDepartment.DepartmentId == DepToCheck) {

                                    $("#NomeIsola").text("---");
                                    itemsIsolePag = OverOnePhoneDepartment;
                                }
                            }
                        }else {
                            AlertAndRedirect('reparti.html');
                        }

                        /*
                        else {
                            navigator.notification.alert(
                            'Avvenuto cambio nelle isole.',  // message
                            alertDismissed,         // callback
                            'Cambio isole',            // title
                            'OK'                  // buttonName
                            );
                        }*/
                    } catch (ex) {
                        console.error(ex.message);
                    }
                }
            });
            if (FisrtTime == true) {
                try{
                    var appStr2=[];
                    appStr2 = StoreArrayLocally_get('IPsIsolaP');
                    if (appStr2!==null){
                        if (appStr2.length > 0) {
                            buffDepartment += '<li>ISOLA PERSONALIZZATA</li>';
                            buffDepartment += '<li><a onclick="ShowLoadingOK();StoreLocally(\'MachineToView\',\'NULL\',false);StoreLocally(\'DepartmentToView\',\'NULL\',false);doRedirectLocale(\'macchine.html\');">ISOLA PERSONALIZZATA</a></li>';
                        }
                    }
                } catch (e) {

                }
            }
            $('#MenuPanel').append(buffDepartment).listview('refresh');
            $("#nav-panel").trigger("updatelayout");
        }
    }).success(function () {

         $.getJSON("http://oone.switchup.it/api/OverOnePhoneData/", function (dataData) {

            var reposHTML = "", i = 0;
            var buff = "";
            var stat = "", FlagCheck;

            if (JSON.stringify(dataData2) === JSON.stringify(dataData))
                console.log("equal");
            else {
                console.log("Not equal");
                dataData2 = dataData;

                $('#machineListul').empty();
                $("#machineListul").attr("data-theme", "f");
                $.each(dataData2, function (i, OverOnePhoneData) {
                    if (OverOnePhoneData != null) {
                        try {
                            items[i] = OverOnePhoneData;
                            FlagCheck = 0;
                            if ((IsleToCheck == "NULL") && (DepToCheck == "NULL")) {
                                var appStr3;
                                appStr3 = StoreArrayLocally_get('IPsIsolaP');
                                for (var cc = 0; cc < appStr3.length; cc++) {
                                    if (items[i].MachineIP == appStr3[cc]) {
                                        FlagCheck = 1;
                                        break;
                                    }
                                }
                                var appS = "";
                                try {
                                    if (StoreLocally_get('NomeIsolaPer', false).length > 0) {
                                        appS = StoreLocally_get('NomeIsolaPer', false);
                                    }
                                    else {
                                        appS = 'ISOLA PERSONALIZZATA';
                                    }
                                } catch (e) {
                                    appS = 'ISOLA PERSONALIZZATA';
                                }

                                $("#NomeIsola").text(appS);
                                $("#NomeReparto").text(appS);
                            }
                            else {
                                for (var cc = 0; cc < itemsIsolePag.IPsMachine.length; cc++) {
                                    if (items[i].MachineIP == itemsIsolePag.IPsMachine[cc]) {
                                        FlagCheck = 1;
                                        break;
                                    }
                                }
                            }
                            if (FlagCheck) {

                                /*switch (items[i].Status) {

                                    case '1':
                                        stat = "RedIcon.png";
                                        break;

                                    case '2':
                                        stat = "GreenIcon.png";
                                        break;

                                    case '3':
                                        stat = "OrangeIcon.png";
                                        break;

                                    case '4':
                                        stat = "BlueIcon.png";
                                        break;

                                    default:
                                        stat = "BlackIcon.png";
                                        break;

                                }//fine switch*/
                                switch (items[i].Status) {
                                    case '1':
                                        stat = "#4c4b4b";  //Black
                                        break;
                                    case '2':
                                        stat = "#48CC35";  //Green
                                        break;
                                    case '3':
                                        stat = "#E36360";  //Red
                                        break;
                                    case '4':
                                        stat = "#0080FF";  //Blue
                                        break;
                                    default:
                                        stat = "#ADADAD";  //Grey
                                        break;

                                    
                                }//fine switch

                                if (StoreLocally_get('changeInfoMac', false) != 'no') {
                                    changeInfo(StoreLocally_get('changeInfoMac', false));
                                }
                                //Con immagine buff += '<li ><a href="#InfoMacchina" onclick="ShowLoadingOK();StoreLocally(\'changeInfoMac\',\'' + i + '\',false);changeInfo(' + i + ');" data-rel="dialog" > <table><tr><td rowspan="2"><img src="img/' + stat + '"></td><td>' + OverOnePhoneData.MachineName + '</td></tr> <tr> <td> IP:' + OverOnePhoneData.MachineIP + '</td></tr></table></a></li>'
                                //buff += '<li ><a href="#" onclick="StoreLocally(\'PopupView\',\'' + i + '\',false);OpenPopup(' + i + ',false);"  > <table><tr><td rowspan="2"><div class="rounded" style="background: ' + stat + '";"></div></td><td>' + OverOnePhoneData.MachineName + '</td></tr> <tr> <td> IP:' + OverOnePhoneData.MachineIP + '</td></tr></table></a></li>'
                                
                                buff += '<li ><a href="#" onclick="ShowLoadingOK();StoreLocally(\'PopupView\',\'' + i + '\',false);OpenPopup(' + i + ',false);">';
                                buff += '<div class="rounded" style="float:left;margin-right:10px;background: ' + stat + '";"></div>';
                                buff += '<div class="ui-grid-solo"';
                                buff += '<div class="ui-block-a" style="overflow:hidden;">';
                                buff += OverOnePhoneData.MachineName;
                                buff += '</div>';
                                buff += '</div>';
                                buff += '<div class="ui-grid-a">';
                                buff += '<div class="ui-block-a"style="overflow:hidden;">';
                                buff += OverOnePhoneData.MachineIP;
                                buff += '</div>';
                                buff += '<div class="ui-block-b" style="text-align: right;color:#6B6B6B;overflow:hidden;">';
                                buff += 'PZ '+OverOnePhoneData.PezziFatti + '/' + OverOnePhoneData.PezziPrevisti;
                                buff += '</div>';
                                buff += '</div>';
                                buff += '</a></li>';




                                if ($.mobile.activePage.attr('id') == "Cruscotto") {
                                    // Do something here if the popup is open
                                   // alert("ok");
                                    OpenPopup( StoreLocally_get('PopupView',false) , true);
                                }
                                else if ($.mobile.activePage.attr('id') == "Dettaglio") {
                                    changeInfo(StoreLocally_get('PopupView', false));
                                }


                            }
                        }
                        catch (ex) {
                            console.log("error: " + ex.message);
                        }
                    }
                });
                $('#machineListul').append(buff).listview('refresh');

            }
			ShowLoadingOFF();
        }).fail(function () {
            ////alert("Attenzione. Problema con richiesta GET.");
            ShowLoadingOFF();
        });


    });
    
}
var ShowAlert=0;
function AlertAndRedirect(pageName) {
	if(!ShowAlert){
		ShowAlert=1;
		ReloadPageOFF();
		alert("Avvenuta modifica in un'isola/reparto.");
		//$.mobile.pageLoading(true);
		RedirectLocale(pageName);
	}
}

function OpenPopup(content,OnlyRefresh) {
    
    switch (items[content].Status) {

        case '1':
            imageToInsert = 'img/BlackIcon.png';
            break;

        case '2':
            imageToInsert = 'img/GreenIcon.png';
            break;

        case '3':
            imageToInsert = 'img/RedIcon.png';
            break;

        case '4':
            imageToInsert = 'img/BlueIcon.png';
            break;

        default:
            imageToInsert = 'img/GrayIcon.png';
            break;

    }//fine switch

   // markup = "<h2>" + items[content].MachineName + "</h2>";
    //markup += "<h3>" + items[content].MachineIP + "</h3>";
    markup = "<p><div class=\"ui-grid-a\" style=\"text-align: center;\" ><div class=\"ui-block-a\"><h3><b>" + items[content].MachineName + "</b></h3></div>";
    markup += "<div class=\"ui-block-b\"><h3><b>" + items[content].MachineIP + "</b></h3></div></div>";
    markup += "<div id=\"plotContainer\"><div id=\"chart4\" class=\"Grafico jqPlot\" ></div></div></p>";
    markup += "<p><b>" + items[content].MachineName + " - " + items[content].MachineIP + "</b></p>";
    markup += "<p>ARTICOLO: <b>" + items[content].Item + "</b></p>";
    markup += "<p>ORDINE: <b>" + items[content].Order + "</b></p>";
    markup += "<p>PEZZI: <b>" + items[content].PezziFatti + "/" + items[content].PezziPrevisti + "</b></p>";
    markup += "<p>OPERATORE: <b>" + items[content].Operator + "</b></p>";

   /* markup += "<p><img src=\"" + imageToInsert + "\"></p>";
    markup += "<p>Item: " + items[content].Item + "</p>";
    markup += "<p>Order: " + items[content].Order + "</p>";
    markup += "<p>Pieces Counter: " + items[content].PiecesCounter + "</p>";
    markup += "<p>Status: " + items[content].Status + "</p>";*/
    //markup += '<p><a href="#one"  data-rel="back" data-role="button" data-inline="true" data-icon="back">OK</a></p>';
    if ($(window).width() >= 550)
        markup += '<div data-role="controlgroup" data-type="horizontal" >';

   
    markup += '<a onclick="RedirectLocale(\'#one\');"  data-role="button"';
    if ($(window).width() >= 550)
        markup += 'data-inline="true"';
    markup += 'data-icon="back">OK</a>';
   /* markup += '<a onclick="ShowLoadingOK();location.reload(true);" data-role="button"';
    if ($(window).width() >= 550)
        markup += 'data-inline="true"';
    markup += 'data-icon="refresh">Aggiorna</a>';*/
    markup += '<a onclick="EffectSwipePopup();"   data-role="button"';
	if ($(window).width() >= 550)
	    markup += 'data-inline="true"';
	markup += 'data-icon="info">Dettagli</a>';

    if ($(window).width() >= 550)
        markup += '</div>';

   
    if (OnlyRefresh==true)
        RefreshPopup(content);
    else
        SetPopup(content);
}



function SetPopup(content) {
    try {
        //$('#CruscottoContent').html(markup).trigger("create");
        
        RedirectLocale('#Cruscotto');
        
        
        //$('#Cruscotto').trigger("pagecreate");
        //ForSwipePopup();
       
        
        
    } catch (e) {
        alert("Errore: " + e);
    }
    ShowLoadingOFF();
}



function RefreshPopup(content) {
    try {
        $('#CruscottoContent').html(markup);
        DoGraph(StoreLocally_get('PopupView', false),false);
        $('#CruscottoContent').closest(":jqmData(role='page')").trigger('create');
        RedirectLocale('#Cruscotto');

    } catch (e) {
        alert("Errore: " + e);
    }
}
var plot4;
function DoGraph(content,first) {
    try {

        

        var s1 = [0,1];
        var res;
		var AppRes;
        try{
			AppRes=Number(items[content].TempoLavorazione) + Number(items[content].TempoFermo)
            res = (Number(items[content].TempoLavorazione) / AppRes)*100;
            //res *= 100;
            if (isNaN(res))
                s1[0] = -1;
            else
                s1[0] = Math.round(res);

        }
        catch(err){
            s1[0] = -1;
            alert("Errore calcolo Graph: " + err);
        }

        var Backg = "";
        switch (items[content].Status) {
            case '1':
                Backg = "#4c4b4b";  //Black
                break;
            case '2':
                Backg = "#48CC35";  //Green
                break;
            case '3':
                Backg = "#E36360";  //Red
                break;
            case '4':
                Backg = "#0080FF";  //Blue
                break;
            default:
                Backg = "#ADADAD";  //Grey
                break;
        }//fine switch
        var innerVal=140, OuterVal=150;
        if ($(window).width() < 550) {
            innerVal = 87;
            OuterVal = 97;
        }
        else if ($(window).width() < 900) {
            innerVal = 175;
            OuterVal = 185;
        }
        else if ($(window).width() < 1100) {
            innerVal = 280;
            OuterVal = 290;
        }
        else {
            innerVal = 350;
            OuterVal = 360;
        }
		if(plot4)
		{
			plot4.destroy();
		}
		$('.jqPlot').remove();
		$('#plotContainer').append('<div id=\"chart4\" class=\"Grafico jqPlot\" ></div>');
		   plot4 = $.jqplot('chart4', [s1], {
				seriesDefaults: {
					renderer: $.jqplot.MeterGaugeRenderer,
					rendererOptions: {
						background: Backg,
						tickColor: '#000000',
						ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
						intervalOuterRadius: OuterVal,
						intervalInnerRadius: innerVal,
						min: 0,
						max: 100,
						intervals: [20, 50, 100],
						intervalColors: ['#cc6666', '#E7E658', '#66cc66']
					}
				}
			});

    } catch (e) {
        alert("ErroreGraph: " + e);
    }
}

function changeInfo(indice) {
    //interval=window.clearInterval(interval);
    //$("#titoloInfo").text(items[indice].MachineName);
    $("#nomeMaccInfo").text(items[indice].MachineName);
    $("#nomeIPInfo").text(items[indice].MachineIP);
    switch (items[indice].Status) {

        case '1':
            $("#ImageStatus").attr('src', 'img/BlackIcon.png');
            break;

        case '2':
            $("#ImageStatus").attr('src', 'img/GreenIcon.png');
            break;

        case '3':
            $("#ImageStatus").attr('src', 'img/RedIcon.png');
            break;

        case '4':
            $("#ImageStatus").attr('src', 'img/BlueIcon.png');
            break;

        default:
            $("#ImageStatus").attr('src', 'img/GrayIcon.png');
            break;

    }//fine switch
    $("#nomeItem").html('ARTICOLO: <b>' + items[indice].Item + '</b>');
    $("#nomeOperatore").html('OPERATORE: <b>' + items[indice].Operator + '</b>');
    $("#nomeOrder").html('ORDINE: <b>' + items[indice].Order + '</b>');
    $("#nomePiecesCounter").html('PEZZI: <b>' + items[indice].PezziFatti + '</b>');
    $("#nomeScarti").html('SCARTI: <b>' + items[indice].PezziScarto + '</b>');

    var Apphours = parseInt(items[indice].TempoLavorazione / 3600) % 24;
    var Appminutes = parseInt(items[indice].TempoLavorazione / 60) % 60;
    var Appseconds = items[indice].TempoLavorazione % 60;
    var result = (Apphours < 10 ? "0" + Apphours : Apphours) + ":" + (Appminutes < 10 ? "0" + Appminutes : Appminutes) + ":" + (Appseconds < 10 ? "0" + Appseconds : Appseconds);

    $("#nomeLavMac").html('LAVORAZIONE MACCHINA: <b>' + result + '</b>');

    var Apphours = parseInt(items[indice].TempoPiazzamento / 3600) % 24;
    var Appminutes = parseInt(items[indice].TempoPiazzamento / 60) % 60;
    var Appseconds = items[indice].TempoPiazzamento % 60;
    var result = (Apphours < 10 ? "0" + Apphours : Apphours) + ":" + (Appminutes < 10 ? "0" + Appminutes : Appminutes) + ":" + (Appseconds < 10 ? "0" + Appseconds : Appseconds);

    $("#nomePiazz").html('PIAZZAMENTO: <b>' + result + '</b>');

    var Apphours = parseInt(items[indice].TempoFermo / 3600) % 24;
    var Appminutes = parseInt(items[indice].TempoFermo / 60) % 60;
    var Appseconds = items[indice].TempoFermo % 60;
    var result = (Apphours < 10 ? "0" + Apphours : Apphours) + ":" + (Appminutes < 10 ? "0" + Appminutes : Appminutes) + ":" + (Appseconds < 10 ? "0" + Appseconds : Appseconds);

    $("#nomeFermo").html('FERMO: <b>' + result + '</b>');
    $("#nomeCPrev").html('CONSEGNA PREVISTA: <b>' + items[indice].ConsegnaPrevista + '</b>');
    $("#nomeStatus").html('FASE: <b>' + items[indice].Fase + '</b>');

}