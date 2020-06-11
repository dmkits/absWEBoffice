var dataModel=require(appDataModelPath);
var systemFuncs= require('../systemFuncs');

module.exports.validateModule = function(errs, nextValidateModuleCallback){ nextValidateModuleCallback(); };

module.exports.modulePageURL= "/docXlsBusinessCards";
module.exports.modulePagePath= "doc_xlsBusinessCards.html";
module.exports.init= function(app){
    var tXlsBusinessCardsTableColumns=[//ФИО	Имя (нужно для удобства копирования столбцов при эл.рассылке)	E-mail	Телефон	Компания	Должность	Город	Область	Отрасль
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
    app.get("/docXlsBusinessCards/getXlsBusinessCardsDataForTable", function(req, res){
        tempStoreXlsBusinessCards= systemFuncs.loadDataFromFile("dataStore/"+dataStoreXlsBusinessCardsName+".json");
        res.send({columns:dataModel._getTableColumnsDataForHTable(tXlsBusinessCardsTableColumns), identifier:tXlsBusinessCardsTableColumns[0].data, items:tempStoreXlsBusinessCards});
    });
    app.post("/docXlsBusinessCards/storeXlsBusinessCardsTableData",function(req,res){
        var data= req.body;
        if(!data){
            res.send({error:{error:"Failed store docXlsBusinessCards record! Reason: no data for store.",
                message:"Невозможно сохранить запись! Нет данных для сохранения."}});
            return;
        }
        var chID= data["ChID"];
        if(chID==null){//append
            chID= tempStoreXlsBusinessCards.length; data["ChID"]= chID;
            tempStoreXlsBusinessCards[chID]= data;
        }else{//replace
            tempStoreXlsBusinessCards[chID]= data;
        }
        systemFuncs.saveDataToFile("/dataStore/"+dataStoreXlsBusinessCardsName+".json",tempStoreXlsBusinessCards);
        res.send({resultItem:data, updateCount:1});
    });
    app.post("/docXlsBusinessCards/delXlsBusinessCardsTableData",function(req,res){
        var data= req.body;
        var delChID= (data)?data["ChID"]:null;
        if(delChID==null){
            res.send({error:{error:"Failed delete docXlsBusinessCards record! Reason: no ChID.",
                message:"Невозможно удалить запись! Нет кода регистрации."}});
            return;
        }
        var delIndex= tempStoreXlsBusinessCards.findIndex(function(elem,index,arr){ return elem&&elem["ChID"]==delChID; });
        if(delIndex<0){
            res.send({error:{error:"Failed delete docXlsBusinessCards record! Reason: dont find record for delete by ChID.",
                message:"Невозможно удалить запись! Не найдена запись для удаления по коду регистрации."}});
            return;
        }
        tempStoreXlsBusinessCards.splice(delIndex,1);
        systemFuncs.saveDataToFile("/dataStore/"+dataStoreXlsBusinessCardsName+".json",tempStoreXlsBusinessCards);
        res.send({resultItem:{"ChID":delChID}, updateCount:1});
    });
};
