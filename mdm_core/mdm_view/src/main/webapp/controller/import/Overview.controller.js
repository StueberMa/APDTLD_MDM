sap.ui.controller("uni.mannheim.mdm.controller.import.Overview", {
	
	onManualImport:function(){
		
	},

	onBack : function () {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("Overview", false);
	}
});