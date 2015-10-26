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
	 * Method onNewLead
	 */
	onNewLead : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("marketing.LeadCreate", false);
	},
	
	/**
	 * Method onSearch
	 */
	onSearch : function(oEvent) {
		
		// get values
		var model = this.getView().getModel("filter");
		var firstName = model.getProperty("/FirstName");
		var lastName = model.getProperty("/LastName");
		var product = model.getProperty("/Product");
		var status = model.getProperty("/Status");

		// init. filter
		var filters = [];
		var listBinding = this.getView().byId("leadTable").getBinding("items");
		var operator = sap.ui.model.FilterOperator.EQ;
		
		// filter: firstName
		if(firstName && firstName != "") {
			operator = sap.ui.model.FilterOperator.EQ;
			
			if(firstName.indexOf("*") != -1) {
				operator = sap.ui.model.FilterOperator.Contains;
				firstName = firstName.replace("*", "");
			}
		
			filters.push(new sap.ui.model.Filter({path: "/CustomerDetails/FirstName", operator: operator, value1: firstName}));
		}
		
		// filter: lastName
		if(lastName && lastName != "") {
			operator = sap.ui.model.FilterOperator.EQ;
			
			if(lastName.indexOf("*") != -1) {
				operator = sap.ui.model.FilterOperator.Contains;
				lastName = lastName.replace("*", "");
			}
		
			filters.push(new sap.ui.model.Filter({path: "/CustomerDetails/FirstName", operator: operator, value1: lastName}));
		}
		
		// filter: product
		if(product && product != "") {
			operator = sap.ui.model.FilterOperator.EQ;
			
			if(product.indexOf("*") != -1) {
				operator = sap.ui.model.FilterOperator.Contains;
				product = product.replace("*", "");
			}
			
			filters.push(new sap.ui.model.Filter({path: "/ProductDetails/Name", operator: operator, value1: product}));
		}
		
		// filter: status
		if(status && status != "") {
			filters.push(new sap.ui.model.Filter({path: "Status", operator: sap.ui.model.FilterOperator.EQ, value1: status}));
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
	}
});