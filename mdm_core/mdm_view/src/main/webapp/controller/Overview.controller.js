sap.ui.controller("uni.mannheim.mdm.controller.Overview", {
	
	onMasterDataOverview:function(){
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("masterdata.Overview", false);
	},
	
	onDataImportOverview:function(){
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("import.Overview", false);
	}
});