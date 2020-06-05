var server= require("../server"), log= server.log, appParams= server.getAppStartupParams(), appConfig= server.getAppConfig(),
    docxTemplates= require("./docxTemplates");

module.exports.validateModule = function(errs, nextValidateModuleCallback){ nextValidateModuleCallback(); };

function setUserMenuFromAppConfig(outData, userLogin, userRole, appConfig){
    var usersConfig= appConfig.users, usersRolesConfig= appConfig.usersRoles, appMenu= appConfig.appMenu,
        userRoleItems= usersRolesConfig[userRole], userConfig= (usersConfig)?usersConfig[userLogin]:null, userMenu=[];
    if(!userRoleItems&&userRole=="sysadmin"){
        outData.menuBar= appMenu;
        if(userConfig&&userConfig.autorun) outData.autorun= userConfig.autorun;
        return;
    }
    if(!userRoleItems) userRoleItems= {menu:["menuBarItemHelpAbout","menuBarItemClose"]};
    var userRoleMenu= userRoleItems.menu;
    for(var i in userRoleMenu){
        var userRoleMenuItemName= userRoleMenu[i];
        for(var j in appMenu){
            var appMenuItem= appMenu[j];
            if(userRoleMenuItemName==appMenuItem.menuItemName){
                var userItem = {};
                for(var item in appMenuItem) userItem[item]= appMenuItem[item];
                if(userItem.popupMenu) userItem.popupMenu=null;
                userMenu.push(userItem);
                break;
            }
            var mainPopupMenu= appMenuItem.popupMenu;
            if(!mainPopupMenu) continue;
            for(var k in mainPopupMenu){
                var popupMenuItem= mainPopupMenu[k];
                if(userRoleMenuItemName==popupMenuItem.menuItemName){
                    for(var l in userMenu){
                        var userMenuItem= userMenu[l];
                        if(userMenuItem.menuItemName==appMenuItem.menuItemName){
                            if(!userMenuItem.popupMenu) userMenuItem.popupMenu=[];
                            userMenuItem.popupMenu.push(popupMenuItem);
                        }
                    }
                }
            }
        }
    }
    outData.menuBar= userMenu;
    outData.autorun= (userConfig&&userConfig.autorun)?userConfig.autorun:userRoleItems.autorun;
}


module.exports.modulePageURL= "/";
module.exports.modulePagePath= "main.html";
module.exports.init= function(app){
    if(!docxTemplates.setUserMenuDocxTemplatesFromAppConfig) throw new Error('NO docxTemplates.setUserMenuDocxTemplatesFromAppConfig!');
    app.get("/main/getMainData",function(req,res){
        var outData= { mode:appParams.mode, modeStr:appParams.mode };
        if(!appConfig||appConfig.error){
            outData.error= "Failed load application configuration!"+(appConfig&&appConfig.error)?" Reason:"+appConfig.error:"";
            res.send(outData);
            return;
        }
        outData.title= appConfig.title;
        outData.icon32x32= appConfig.icon32x32; outData.imageSmall= appConfig.imageSmall; outData.imageMain= appConfig.imageMain;
        outData.appUserName= req.appUserName||"UNKNOWN"; outData.appUserRole= req.appUserRole||"UNKNOWN";

        //outData.menuBar= appConfig.menu;
        setUserMenuFromAppConfig(outData, req.appUserLogin, req.appUserRole, appConfig);
        //outData.menuBar= getMenuForDocx(appConfig.templates);
        docxTemplates.setUserMenuDocxTemplatesFromAppConfig(outData.menuBar,server.getAppConfigDocxTemplates());
        //setUserMenuDocxTemplatesFromAppConfig(outData, server.getAppConfigDocxTemplates());

        res.send(outData);
    });
    app.post("/exit", function(req,res){
        var outData={}, cookiesArr=Object.keys(req.cookies);
        for(var i in cookiesArr) res.clearCookie(cookiesArr[i]);
        outData.actionResult="successful";
        res.send(outData);
    });
 };