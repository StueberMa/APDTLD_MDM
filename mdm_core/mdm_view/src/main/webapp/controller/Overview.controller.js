sap.ui.controller("uni.mannheim.mdm.controller.Overview", {
	
	onMasterDataOverview:function(){
		
		
		
		// navigate
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("masterdata.Overview", false);
	},
	
	onDataImportOverview:function(){
		
		// navigate
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("import.Overview", false);
	}
});