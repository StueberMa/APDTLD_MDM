sap.ui.controller("uni.mannheim.mdm.controller.import.Overview", {
	
	onManualImport:function(){
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		console.log("go to manual importer");
		router.navTo("import.ManualImporter", false);
	},

	onBack : function () {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("Overview", false);
	}
});