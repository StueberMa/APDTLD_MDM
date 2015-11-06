sap.ui.controller("uni.mannheim.mdm.controller.marketing.CampaignOverview", {

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
		var table = this.getView().byId("campaignTable");
		table.setMode(sap.m.ListMode.SingleSelectMaster);
		table.attachEvent("selectionChange", this.onSelectionChange, this);
		
		// router
		var oRouter = this.getOwnerComponent().getRouter();
		oRouter.attachRouteMatched(this.onRequest, this);
	},

	/**
	 * Method onNewCampaign
	 */
	onNewCampaign : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("marketing.CampaignCreate", false);
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
		
		if (oEvent.getParameter("name") === "marketing.CampaignOverview") {
			this.onRefresh();
		}
	},
	
	/**
	 * Method onSearch
	 */
	onSearch : function(oEvent) {
		
		// get values
		var model = this.getView().getModel("filter");
		var name = model.getProperty("/Name");
		var type = model.getProperty("/Type");
		var status = model.getProperty("/Status");

		// init. filter
		var filters = [];
		var listBinding = this.getView().byId("campaignTable").getBinding("items");
		var operator = sap.ui.model.FilterOperator.EQ;
		
		// filter: name
		if(name && name != "") {
			operator = sap.ui.model.FilterOperator.EQ;
			
			if(name.indexOf("*") != -1) {
				operator = sap.ui.model.FilterOperator.Contains;
				name = name.replace("*", "");
			}
		
			filters.push(new sap.ui.model.Filter({path: "Name", operator: operator, value1: name}));
		}
		
		// filter: type
		if(type && type != "") {
			filters.push(new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: type}));
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
		var table = this.getView().byId("campaignTable");
		table.removeSelections(true);
		
		// navigate to details
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("marketing.CampaignDetails", {id: id}, false);
		
	},
	
	/**
	 * Method formatStatus
	 */
	formatStatus : function(status) {	
		
		if(status == "ACTIVE")
			return "Active";
			
		if(status == "FINISH")
			return "Finished";
	},
	
	/**
	 * Method formatType
	 */
	formatType : function(type) {	
		
		if(type == "EMAIL")
			return "E-Mail";
			
		if(type == "PARTNER")
			return "Partner";
		
		if(type == "SOCMEDIA")
			return "Social Media";
	}
	
});