sap.ui.controller("uni.mannheim.mdm.controller.marketing.LeadOverview", {
	
	/**
	 * Method onInit
	 */
	onInit : function() {
		
		// model
		this._model = this.getOwnerComponent().getModel();
		
		// filter model
		var filterModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(filterModel, "filter");
		
		// event for selection
		var table = this.getView().byId("leadTable");
		table.setMode(sap.m.ListMode.SingleSelectMaster);
		table.attachEvent("selectionChange", this.onSelectionChange, this);
		
		// router
		var oRouter = this.getOwnerComponent().getRouter();
		oRouter.attachRouteMatched(this.onRequest, this);
	},
	
	/**
	 * Method onCustomerValidation
	 */
	onCustomerValidation : function(oEvent) {
		
		var item = oEvent.mParameters.selectedItem;
		
		if(item)
			var key = item.getKey();
		
		this.getView().getModel("filter").setProperty("/CustomerId", key);
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
		
		var item = oEvent.mParameters.selectedItem;
		
		if(item)
			var key = item.getKey();
		
		this.getView().getModel("filter").setProperty("/ProductId", key);
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
		
		if (oEvent.getParameter("name") === "marketing.LeadOverview") {
			this.onRefresh()
		}
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
	 * Method formatStatus
	 */
	formatStatus : function(status) {	
		
		if(status == "OPEN")
			return "Open";
			
		if(status == "CLOSED")
			return "Closed";
	}
	
});