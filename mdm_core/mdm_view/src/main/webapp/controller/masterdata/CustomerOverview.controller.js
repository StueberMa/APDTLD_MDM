sap.ui.controller("uni.mannheim.mdm.controller.masterdata.CustomerOverview", {

	/**
	 * Method onInit
	 */
	onInit : function() {
		
		// model
		this._model = this.getOwnerComponent().getModel();
		
		// event for selection
		var table = this.getView().byId("customerTable");
		table.setMode(sap.m.ListMode.SingleSelectMaster);
		table.attachEvent("selectionChange", this.onSelectionChange, this);
		
		// routing
		var oRouter = this.getOwnerComponent().getRouter();
		oRouter.attachRouteMatched(this.onRequest, this);
	},

	/**
	 * Method onNewCustomer
	 */
	onNewCustomer : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("masterdata.CustomerCreate", false);
	},
	
	/**
	 * Method onRefresh
	 */
	onRefresh : function() {
		this._model.refresh(true);
	},
	
	/**
	 * Method onRequest
	 */
	onRequest : function(oEvent) {
		
		// create
		if (oEvent.getParameter("name") === "masterdata.CustomerOverview") {
			this.onRefresh();
		}
	},
	
	/**
	 * Method onSearch
	 */
	onSearch : function(oEvent) {
		
		var filters = [];
		var query = oEvent.getSource().getValue();
		var operator = sap.ui.model.FilterOperator.EQ;
		var listBinding = this.getView().byId("customerTable").getBinding("items");
		
		if(oEvent.getSource().getValue() === "") {
			listBinding.filter(filters, sap.ui.model.FilterType.Application);
			return;
		}
		
		if(query.indexOf("*") != -1) {
			operator = sap.ui.model.FilterOperator.Contains;
			query = query.replace("*", "");
		}
		
		filters.push(new sap.ui.model.Filter({path: "LastName", operator: operator, value1: query}));
		listBinding.filter(filters, sap.ui.model.FilterType.Application);
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
	 * Method formatCountry
	 */
	formatCountry : function(status) {	
		
		if(status == "AT")
			return "Austria";
			
		if(status == "BL")
			return "Belgium";
		
		if(status == "CN")
			return "China";
		
		if(status == "FR")
			return "France";
		
		if(status == "DE")
			return "Germany";
		
		if(status == "GB")
			return "Great Britain";
		
		if(status == "IT")
			return "Italy";
		
		if(status == "NL")
			return "Netherland";
		
		if(status == "US")
			return "United States";
	}
	
});