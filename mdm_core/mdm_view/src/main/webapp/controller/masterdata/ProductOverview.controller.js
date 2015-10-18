sap.ui.controller("uni.mannheim.mdm.controller.masterdata.ProductOverview", {

	/**
	 * Method onInit
	 */
	onInit : function() {
		// register event for selection
		var table = this.getView().byId("productTable");
		table.setMode(sap.m.ListMode.SingleSelectMaster);
		table.attachEvent("selectionChange", this.onSelectionChange, this);
	},

	/**
	 * Method onNewProduct
	 */
	onNewProduct : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("masterdata.ProductCreate", false);
	},
	
	/**
	 * Method onSelectionChange
	 */
	onSelectionChange : function(oEvent) {
		
		// get Id
		var id = oEvent.getParameter("listItem").getBindingContext().getProperty("Id");
		
		// deselect all rows
		var table = this.getView().byId("productTable");
		table.removeSelections(true);
		
		// navigate to details
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("masterdata.ProductDetails", {id: id}, false);
		
	},
	
	/**
	 * Method onRefresh
	 */
	onRefresh : function() {
		var model = this.getView().getModel();
		model.refresh(true);
	}
});