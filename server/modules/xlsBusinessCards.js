var dataModel=require(appDataModelPath);
//var r_Ours= require(appDataModelPath+"r_Ours");
var systemFuncs= require('../systemFuncs');

module.exports.validateModule = function(errs, nextValidateModuleCallback){ nextValidateModuleCallback(); };

module.exports.modulePageURL= "/xlsBusinessCards";
module.exports.modulePagePath= "xlsBusinessCards.html";
module.exports.init= function(app){
    var tXlsBusinessCardsTableColumns=[
        //ФИО	Имя (нужно для удобства копирования столбцов при эл.рассылке)	E-mail	Телефон	Компания	Должность	Город	Область	Отрасль
        {data:"ChID", name:"Код рег.", width:75, type:"text", align:"center", visible:false},
        {data:"ContactInitials", name:"ФИО", width:200, type:"text", align:"center"},
        {data:"ContactName", name:"Имя", width:100, type:"text", align:"center"},
        {data:"Email", name:"E-mail", width:120, type:"text", align:"center"},
        {data:"Telephone", name:"Телефон", width:120, type:"text", align:"center"},
        {data:"Company", name:"Компания", width:200, type:"text", align:"left"},
        {data:"Post", name:"Должность", width:150, type:"text", align:"center"},
        {data:"City", name:"Город", width:120, type:"text", align:"center"},
        {data:"Region", name:"Область", width:150, type:"text", align:"center"},
        {data:"Industry", name:"Отрасль", width:150, type:"text", align:"center"}
    ];
    var dataStoreXlsBusinessCardsName="storeXlsBusinessCards", tempStoreXlsBusinessCards= [];
    app.get("/xlsBusinessCards/getXlsBusinessCardsDataForTable", function(req, res){
        tempStoreXlsBusinessCards= systemFuncs.loadDataFromFile("dataStore/"+dataStoreXlsBusinessCardsName+".json");
        res.send({columns:dataModel._getTableColumnsDataForHTable(tXlsBusinessCardsTableColumns), identifier:tXlsBusinessCardsTableColumns[0].data, items:tempStoreXlsBusinessCards});
    });
    app.post("/xlsBusinessCards/storeXlsBusinessCardsTableData",function(req,res){                                            console.log("data",req.body);
        var data= req.body;
        if(data){
            var chID= data["ChID"];
            if(chID==null){//append
                chID= tempStoreXlsBusinessCards.length; data["ChID"]= chID;
                tempStoreXlsBusinessCards[chID]= data;
            }else{//replace
                tempStoreXlsBusinessCards[chID]= data;
            }
        }                                                                                               console.log("tempStore",tempStoreXlsBusinessCards);
        systemFuncs.saveDataToFile("/dataStore/"+dataStoreXlsBusinessCardsName+".json",tempStoreXlsBusinessCards);
        res.send({resultItem:data, updateCount:1});
        //res.send({error:"no store function!"});
    });
};