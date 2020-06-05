var dataModel=require(appDataModelPath);
//var r_Ours= require(appDataModelPath+"r_Ours");
var systemFuncs= require('../systemFuncs');

module.exports.validateModule = function(errs, nextValidateModuleCallback){ nextValidateModuleCallback(); };

module.exports.modulePageURL= "/xlsClients";
module.exports.modulePagePath= "xlsClients.html";
module.exports.init= function(app){
    var tFinTableColumns=[
        //№ п/п	Источник данных	Сфера деятельности	Компания	Сайт	Профиль в социальной сети	Ссылка на профиль	Телефон	E-mail	Контактное лицо 	Должность	Профиль в социальной сети	Ссылка на профиль
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

        //{data:"EmpID", name:"ИД Сотр.", width:0, type:"text", align:"center", visible:false},
        //{data:"Emp", name:"Сотрудник", width:150, type:"text", align:"center"},
        //{data:"Company", name:"Предприятие", width:150, type:"text", align:"center", dataSource:"t_Sale"},
        //{data:"CSum", name:"Сумма", width:75, type:"numeric2",source:"t_SaleD" },
        //{data:"ServerSum", name:"Сервер", width:75, type:"numeric2",source:"t_SaleD" },
        //{data:"TSum", name:"Общая", width:75, type:"numeric2",source:"t_SaleD" },
        //{data:"SumT5p", name:"Единый 5%", width:75, type:"numeric2",source:"t_SaleD" },
        //{data:"SumFZP", name:"ЗП итого", width:75, type:"numeric2",source:"t_SaleD" },
        //{data:"SumTax", name:"Налоги", width:75, type:"numeric2",source:"t_SaleD" },
        //{data:"Sum", name:"Разница", width:75, type:"numeric2",source:"t_SaleD" }

        //{data:"ChID", name:"ChID", width:50, type:"text", visible:false, dataSource:"t_SaleD"},
        //{data:"OurID", name:"OurID", width:50, type:"text", visible:false,
        //    dataSource:"t_Sale", sourceField:"OurID", linkCondition:"t_Sale.ChID=t_SaleD.ChID"},
        //{data:"StockID", name:"StockID", width:50, type:"text", visible:false, dataSource:"t_Sale"},
        //{data:"CRID", name:"CRID", width:50, type:"text", visible:false, dataSource:"t_Sale"},
        //{data:"CRName", name:"Касса", width:250, type:"text", visible:false,
        //    dataSource:"r_CRs", sourceField:"CRName", linkCondition:"r_CRs.CRID=t_Sale.CRID"},
        //{data:"DocID", name:"Номер чека", width:70, type:"text", align:"center", visible:false, dataSource:"t_Sale"},
        //{data:"DocDate", name:"Дата чека", width:55, type:"dateAsText", visible:true, dataSource:"t_Sale"},
        //{data:"DocTime", name:"Дата время чека", width:55, type:"datetimeAsText", visible:true, dataSource:"t_Sale"},
        //{data:"SrcPosID", name:"Позиция", width:50, type:"numeric", align:"right", visible:false, dataSource:"t_SaleD"},
        //{data:"Barcode", name:"Штрихкод", width:75, type:"text", align:"center", visible:false, dataSource:"t_SaleD"},
        //{data:"ProdID", name:"Код товара", width:50, type:"text", align:"center", visible:true, dataSource:"t_SaleD"},
        //// {data:"Article1", name:"Артикул1 товара", width:200, type:"text",
        ////     dataSource:"r_Prods", sourceField:"Article1"},
        //{data:"ProdName", name:"Наименование товара", width:350, type:"text",
        //    dataSource:"r_Prods", sourceField:"ProdName", linkCondition:"r_Prods.ProdID=t_SaleD.ProdID" },
        //{data:"UM", name:"Ед. изм.", width:55, type:"text", align:"center", dataSource:"t_SaleD" },
        //{data:"Qty", name:"Кол-во", width:50, type:"numeric",source:"t_SaleD" },
        //{data:"PurPriceCC_wt", name:"Цена без скидки", width:65, type:"numeric2",source:"t_SaleD" },
        //{data:"DiscountP", name:"Скидка", width:65, type:"numeric",dataFunction:"(1-RealPrice/PurPriceCC_wt)*100" },
        //{data:"RealPrice", name:"Цена", width:65, type:"numeric2",source:"t_SaleD" },
        //{data:"RealSum", name:"Сумма", width:75, type:"numeric2",source:"t_SaleD" },
        //{data:"DiscountSum", name:"Сумма скидки", width:65, type:"numeric2",dataFunction:"(PurPriceCC_wt-RealPrice)*Qty" }
    ];
    var tempStore= [];
    app.get("/xlsClients/getXlsClientsDataForTable", function(req, res){
        var conditions={}, allItems=false;
        //for(var condItem in req.query) {
        //    var val=req.query[condItem];
        //    if(condItem.indexOf("DiscountP")==0) conditions[condItem.replace("DiscountP","(PurPriceCC_wt-RealPrice)")]=val;
        //    else if(condItem.indexOf("CRID")==0&&val=="-1"&&req.dbEmpRole!=="cashier"&&!req.isMobile) {//ALL
        //        conditions["1=1"]=null; allItems=true;
        //    }else{
        //        var newCondItem=condItem;
        //        for(var cInd in tProdsSalesTableColumns){
        //            var colData=tProdsSalesTableColumns[cInd];
        //            if(colData&&colData.data&&condItem.indexOf(colData.data)==0&&colData.dataSource){
        //                newCondItem=colData.dataSource+"."+condItem; break;
        //            }
        //        }
        //        conditions[newCondItem]=val;
        //    }
        //}
        //for(var i=0; i<tProdsSalesTableColumns.length; i++){
        //    var tColData=tProdsSalesTableColumns[i];
        //    if(tColData.data=="CRName"){
        //        tColData.doVisible=allItems; break;
        //    }
        //}
        //t_SaleD.getDataForTable(req.dbUC,{tableColumns:tProdsSalesTableColumns, identifier:tProdsSalesTableColumns[0].data,
        //        conditions:conditions, order:"OurID, StockID, SrcPosID"},
        //    function(result){
        //        res.send(result);
        //    });
        tempStore= systemFuncs.loadDataFromFile("dataStore/storeXlsClients.json");
        res.send({columns:dataModel._getTableColumnsDataForHTable(tFinTableColumns), identifier:tFinTableColumns[0].data, items:tempStore});
    });

    app.post("/xlsClients/storeXlsClientsTableData",function(req,res){                                            console.log("data",req.body);
        var data= req.body;
        if(data){
            var chID= data["ChID"];
            if(chID==null){//append
                chID= tempStore.length; data["ChID"]= chID;
                tempStore[chID]= data;
            }else{//replace
                tempStore[chID]= data;
            }
        }                                                                                               console.log("tempStore",tempStore);
        systemFuncs.saveDataToFile("/dataStore/storeXlsClients.json",tempStore);
        res.send({resultItem:data, updateCount:1});
        //res.send({error:"no store function!"});
    });
};