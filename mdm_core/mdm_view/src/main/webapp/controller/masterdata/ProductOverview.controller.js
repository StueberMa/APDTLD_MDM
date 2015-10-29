sap.ui.controller("uni.mannheim.mdm.controller.masterdata.ProductOverview", {

	/**
	 * Method onInit
	 */
	onInit : function() {
		
		// model
		this._model = this.getOwnerComponent().getModel();
		
		// event for selection
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
	 * Method onSearch
	 */
	onSearch : function(oEvent) {
		
		var filters = [];
		var query = oEvent.getSource().getValue();
		var operator = sap.ui.model.FilterOperator.EQ;
		var listBinding = this.getView().byId("productTable").getBinding("items");
		
		if(oEvent.getSource().getValue() === "") {
			listBinding.filter(filters, sap.ui.model.FilterType.Application);
			return;
		}
		
		if(query.indexOf("*") != -1) {
			operator = sap.ui.model.FilterOperator.Contains;
			query = query.replace("*", "");
		}
		
		filters.push(new sap.ui.model.Filter({path: "Name", operator: operator, value1: query}));
		listBinding.filter(filters, sap.ui.model.FilterType.Application);
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
		this._model.refresh(true);
	}
});