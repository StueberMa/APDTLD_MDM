sap.ui.controller("uni.mannheim.mdm.controller.masterdata.CustomerOverview", {

	/**
	 * Method onInit
	 */
	onInit : function() {
		
		// To-Dd: Use model defined in Component.js
		var model = new sap.ui.model.odata.ODataModel("/mdm_view/services/data.svc");
		this.getView().setModel(model);
		
		// register event for selection
		var table = this.getView().byId("customerTable");
		table.setMode(sap.m.ListMode.SingleSelectMaster);
		table.attachEvent("selectionChange", this.onSelectionChange, this);
	},

	/**
	 * Method onNewCustomer
	 */
	onNewCustomer : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("masterdata.CustomerCreate", false);
	},
	
	/**
	 * Method onSelectionChange
	 */
	onSelectionChange : function(oEvent) {
		
		// get Id
		var id = oEvent.getParameter("listItem").getBindingContext().getProperty("Id");
		
		// deselect all rows
		var table = this.getView().byId("customerTable");
		table.removeSelections(true);
		
		// navigate to details
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("masterdata.CustomerDetails", {id: id}, false);
		
	},
	
	/**
	 * Method onRefresh
	 */
	onRefresh : function() {
		var model = this.getView().getModel();
		model.refresh(true);
	}
});