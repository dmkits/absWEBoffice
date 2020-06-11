var dataModel=require(appDataModelPath);
var systemFuncs= require('../systemFuncs');

module.exports.validateModule = function(errs, nextValidateModuleCallback){ nextValidateModuleCallback(); };

module.exports.modulePageURL= "/dirXlsBusinessCardsIndustries";
module.exports.modulePagePath= "dir_xlsBusinessCardsIndustries.html";
module.exports.init= function(app){
    var tXlsBusinessCardsTableColumns=[//Отрасль
        {data:"ChID", name:"Код рег.", width:75, type:"text", align:"center", visible:false},
        {data:"Industry", name:"Отрасль", width:500, type:"text", align:"center"}
    ];
    var dataStoreXlsBusinessCardsIndustriesName="storeXlsBusinessCardsIndustries", tempStoreXlsBusinessCardsIndustries= [];
    app.get("/dirXlsBusinessCardsIndustries/getXlsBusinessCardsIndustriesDataForTable", function(req, res){
        tempStoreXlsBusinessCardsIndustries= systemFuncs.loadDataFromFile("dataStore/"+dataStoreXlsBusinessCardsIndustriesName+".json");
        res.send({columns:dataModel._getTableColumnsDataForHTable(tXlsBusinessCardsTableColumns), identifier:tXlsBusinessCardsTableColumns[0].data, items:tempStoreXlsBusinessCardsIndustries});
    });
    app.post("/dirXlsBusinessCardsIndustries/storeXlsBusinessCardsIndustriesTableData",function(req,res){
        var data= req.body;
        if(!data){
            res.send({error:{error:"Failed store dirXlsBusinessCardsIndustries record! Reason: no data for store.",
                message:"Невозможно сохранить запись! Нет данных для сохранения."}});
            return;
        }
        var chID= data["ChID"];
        if(chID==null){//append
            chID= tempStoreXlsBusinessCardsIndustries.length; data["ChID"]= chID;
            tempStoreXlsBusinessCardsIndustries[chID]= data;
        }else{//replace
            tempStoreXlsBusinessCardsIndustries[chID]= data;
        }
        systemFuncs.saveDataToFile("/dataStore/"+dataStoreXlsBusinessCardsIndustriesName+".json",tempStoreXlsBusinessCardsIndustries);
        res.send({resultItem:data, updateCount:1});
    });
    app.post("/dirXlsBusinessCardsIndustries/delXlsBusinessCardsIndustriesTableData",function(req,res){
        var data= req.body;
        var delChID= (data)?data["ChID"]:null;
        if(delChID==null){
            res.send({error:{error:"Failed delete dirXlsBusinessCardsIndustries record! Reason: no ChID.",
                message:"Невозможно удалить запись! Нет кода регистрации."}});
            return;
        }
        var delIndex= tempStoreXlsBusinessCardsIndustries.findIndex(function(elem,index,arr){ return elem&&elem["ChID"]==delChID; });
        if(delIndex<0){
            res.send({error:{error:"Failed delete dirXlsBusinessCardsIndustries record! Reason: dont find record for delete by ChID.",
                message:"Невозможно удалить запись! Не найдена запись для удаления по коду регистрации."}});
            return;
        }
        tempStoreXlsBusinessCardsIndustries.splice(delIndex,1);
        systemFuncs.saveDataToFile("/dataStore/"+dataStoreXlsBusinessCardsIndustriesName+".json",tempStoreXlsBusinessCardsIndustries);
        res.send({resultItem:{"ChID":delChID}, updateCount:1});
    });
};
