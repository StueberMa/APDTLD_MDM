sap.ui.controller("uni.mannheim.mdm.controller.marketing.LeadOverview", {

	/**
	 * Method onInit
	 */
	onInit : function() {
		
		// filter model
		var filterModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(filterModel, "filter");
		
		// register event for selection
		var table = this.getView().byId("leadTable");
		table.setMode(sap.m.ListMode.SingleSelectMaster);
		table.attachEvent("selectionChange", this.onSelectionChange, this);
	},
	
	/**
	 * Method onCustomerValidation
	 */
	onCustomerValidation : function(oEvent) {
		
		if(oEvent.mParameters.type == "removed")
			this.removeToken(oEvent, "/CustomerId");
		
		if(oEvent.mParameters.type == "added")
			this.validateToken(oEvent, "CustomerIdInput", "/CustomerId");
	},

	/**
	 * Method onNewLead
	 */
	onNewLead : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("marketing.LeadCreate", false);
	},
	
	/**
	 * Method onProductValidation
	 */
	onProductValidation : function(oEvent) {
		
		if(oEvent.mParameters.type == "removed")
			this.removeToken(oEvent, "/ProductId");
		
		if(oEvent.mParameters.type == "added")
			this.validateToken(oEvent, "ProductIdInput", "/ProductId");
	},
	
	/**
	 * Method onSearch
	 */
	onSearch : function(oEvent) {
		
		// get values
		var model = this.getView().getModel("filter");
		var customerId = model.getProperty("/CustomerId");
		var productId = model.getProperty("/ProductId");
		var status = model.getProperty("/Status");

		// init. filter
		var filters = [];
		var listBinding = this.getView().byId("leadTable").getBinding("items");
		var operator = sap.ui.model.FilterOperator.EQ;
		
		// filter: customerId
		if(customerId && customerId != "") {
			filters.push(new sap.ui.model.Filter({path: "CustomerId", operator: operator, value1: customerId}));
		}
		
		// filter: productId
		if(productId && productId != "") {
			filters.push(new sap.ui.model.Filter({path: "ProductId", operator: operator, value1: productId}));
		}
		
		// filter: status
		if(status && status != "") {
			filters.push(new sap.ui.model.Filter({path: "Status", operator: operator, value1: status}));
		}
		
		listBinding.filter(filters, sap.ui.model.FilterType.Application);
	},
	
	/**
	 * Method onSelectionChange
	 */
	onSelectionChange : function(oEvent) {
		
		// get Id
		var id = oEvent.getParameter("listItem").getBindingContext().getProperty("Id");
		
		// deselect all rows
		var table = this.getView().byId("leadTable");
		table.removeSelections(true);
		
		// navigate to details
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("marketing.LeadDetails", {id: id}, false);
		
	},
	
	/**
	 * Method onRefresh
	 */
	onRefresh : function() {
		var model = this.getView().getModel();
		model.refresh(true);
	},
	
	/**
	 * Method removeToken
	 */
	removeToken : function (oEvent, attribute) {
		this.getView().getModel("filter").setProperty(attribute, undefined);
	},
	
	/**
	 * Method validateToken
	 */
	validateToken : function(oEvent, fieldId, attribute) {
		
		// ensure 1:1 relationship
		var field = this.getView().byId(fieldId);
		if(field.getTokens().length > 1) {
			field.removeToken(field.getTokens()[0]);
		}
		
		// set id
		var id = parseInt(oEvent.mParameters.token.mProperties.key);
		this.getView().getModel("filter").setProperty(attribute, id);
	}
});