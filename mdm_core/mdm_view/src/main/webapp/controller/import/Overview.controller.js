sap.ui.controller("uni.mannheim.mdm.controller.import.Overview", {

	/**
	 * Method onManualImport
	 */
	onManualImport : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("import.Uploader", false);
	},
	
	onExport : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("import.Exporter", false);
	}
});