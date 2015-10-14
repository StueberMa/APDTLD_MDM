sap.ui.controller("uni.mannheim.mdm.controller.import.Overview", {
	
	onManualImport:function(){
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		console.log("go to manual importer");
		router.navTo("import.ManualImporter", false);
	},

	onBack : function () {
		var sPreviousHash = sap.ui.core.routing.History.getInstance().getPreviousHash();
		if (sPreviousHash !== undefined) {
			window.history.go(-1);
		} else {
			this.getOwnerComponent().getRouter().navTo("Overview", null, true);
		}
	}
});