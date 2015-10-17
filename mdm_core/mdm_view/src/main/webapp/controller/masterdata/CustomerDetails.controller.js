sap.ui.controller("uni.mannheim.mdm.controller.masterdata.CustomerDetails", {

	/**
	 * Method controllMode
	 */
	controllMode : function(oEvent) {
		if (oEvent.getParameter("name") === "masterdata.CustomerCreate") {
			var context = this.getView().getModel().createEntry("/Customers", {});
			this.getView().unbindElement();
			this.getView().setBindingContext(context);
		} else if (oEvent.getParameter("name") === "masterdata.CustomerDetails") {
			var id = oEvent.getParameter("arguments").id;
			this.getView().bindElement("/Customers(" + id + ")");
		} else {
			var context = this.getView().getBindingContext();

			if (context !== "undefined") {
				this.getView().getModel().deleteCreatedEntry(context);
			}
		}
	},

	/**
	 * Method onExit
	 */
	onExit : function() {
		var oRouter = this.getOwnerComponent().getRouter();
		oRouter.detachRouteMatched(this.controllMode, this);
	},

	/**
	 * Method onInit.
	 */
	onInit : function() {

		// To-Do: Use model defined in Component.js
		var model = new sap.ui.model.odata.ODataModel("/mdm_view/services/data.svc");
		model.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
		this.getView().setModel(model);
		
		// init: create || edit || leave
		var oRouter = this.getOwnerComponent().getRouter();
		oRouter.attachRouteMatched(this.controllMode, this);
	},

	/**
	 * Method addNewCustomer.
	 */
	onSave : function() {
		var model = this.getView().getModel();
		model.submitChanges(this.successMsg, this.errorMsg);
	},

	/**
	 * Method onCancel
	 */
	onCancel : function() {
		var oHistory = sap.ui.core.routing.History.getInstance();
		var sPreviousHash = oHistory.getPreviousHash();

		// history: go to prev. page
		if (sPreviousHash !== undefined) {
			window.history.go(-1);
		} else {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("masterdata.CustomerOverview", false);
		}
	},

	/**
	 * Method successMsg.
	 */
	successMsg : function() {
		sap.ui.commons.MessageBox.alert("Customer entity has been successfully created");
	},

	/**
	 * Method errorMsg.
	 */
	errorMsg : function() {
		sap.ui.commons.MessageBox.alert("Error occured when creating customer entity");
	}
});