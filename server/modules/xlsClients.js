var dataModel=require(appDataModelPath);
var systemFuncs= require('../systemFuncs');

module.exports.validateModule = function(errs, nextValidateModuleCallback){ nextValidateModuleCallback(); };

module.exports.modulePageURL= "/xlsClients";
module.exports.modulePagePath= "xlsClients.html";
module.exports.init= function(app){
    var tXlsClientsTableColumns=[//№ п/п	Источник данных	Сфера деятельности	Компания	Сайт	Профиль в социальной сети	Ссылка на профиль	Телефон	E-mail	Контактное лицо 	Должность	Профиль в социальной сети	Ссылка на профиль
        {data:"ChID", name:"Код рег.", width:75, type:"text", align:"center", visible:false, dataSource:"t_Sale"},
        {data:"PosNum", name:"№ п/п", width:50, type:"text", align:"right", visible:true},
        {data:"DataSource", name:"Источник данных", width:100, type:"text", align:"center"},
        {data:"Scope", name:"Сфера деятельности", width:250, type:"text", align:"center"},
        {data:"Company", name:"Компания", width:200, type:"text", align:"left"},
        {data:"Site", name:"Сайт", width:150, type:"text", align:"center"},
        {data:"Profile", name:"Профиль в социальной сети", width:100, type:"text", align:"center"},
        {data:"ProfileLink", name:"Ссылка на профиль", width:180, type:"text", align:"center"},
        {data:"Telephone", name:"Телефон", width:120, type:"text", align:"center"},
        {data:"Email", name:"E-mail", width:120, type:"text", align:"center"},
        {data:"Contact", name:"Контактное лицо", width:120, type:"text", align:"center"},
        {data:"Post", name:"Должность", width:100, type:"text", align:"center"},
        {data:"Profile2", name:"Профиль в социальной сети 2", width:150, type:"text", align:"center"},
        {data:"ProfileLink2", name:"Ссылка на профиль 2", width:150, type:"text", align:"center"}
    ];
    var dataStoreXlsClientsName="storeXlsClients", tempStoreXlsClients= [];
    app.get("/xlsClients/getXlsClientsDataForTable", function(req, res){
        tempStoreXlsClients= systemFuncs.loadDataFromFile("dataStore/"+dataStoreXlsClientsName+".json");
        res.send({columns:dataModel._getTableColumnsDataForHTable(tXlsClientsTableColumns), identifier:tXlsClientsTableColumns[0].data, items:tempStoreXlsClients});
    });
    app.post("/xlsClients/storeXlsClientsTableData",function(req,res){
        var data= req.body;
        if(!data){
            res.send({error:{error:"Failed store xlsClients record! Reason: no data for store.",
                message:"Невозможно сохранить запись! Нет данных для сохранения."}});
            return;
        }
        var chID= data["ChID"];
        if(chID==null){//append
            chID= tempStoreXlsClients.length; data["ChID"]= chID;
            tempStoreXlsClients[chID]= data;
        }else{//replace
            tempStoreXlsClients[chID]= data;
        }
        systemFuncs.saveDataToFile("/dataStore/"+dataStoreXlsClientsName+".json",tempStoreXlsClients);
        res.send({resultItem:data, updateCount:1});
    });
    app.post("/xlsClients/delXlsClientsTableData",function(req,res){
        var data= req.body;
        var delChID= (data)?data["ChID"]:null;
        if(delChID==null){
            res.send({error:{error:"Failed delete xlsClients record! Reason: no ChID.",
                message:"Невозможно удалить запись! Нет кода регистрации."}});
            return;
        }
        var delIndex= tempStoreXlsClients.findIndex(function(elem,index,arr){ return elem&&elem["ChID"]==delChID; });
        if(delIndex<0){
            res.send({error:{error:"Failed delete xlsClients record! Reason: dont find record for delete by ChID.",
                message:"Невозможно удалить запись! Не найдена запись для удаления по коду регистрации."}});
            return;
        }
        tempStoreXlsClients.splice(delIndex,1);
        systemFuncs.saveDataToFile("/dataStore/"+dataStoreXlsClientsName+".json",tempStoreXlsClients);
        res.send({resultItem:{"ChID":delChID}, updateCount:1});
    });
};