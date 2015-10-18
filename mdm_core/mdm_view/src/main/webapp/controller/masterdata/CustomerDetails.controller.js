sap.ui.controller("uni.mannheim.mdm.controller.masterdata.CustomerDetails", {

	/**
	 * Method controlMode
	 */
	controlMode : function(oEvent) {
		
		// create
		if (oEvent.getParameter("name") === "masterdata.CustomerCreate") {
			var context = this.getView().getModel().createEntry("/Customers", {});
			this.getView().unbindElement();
			this.getView().setBindingContext(context);
			this._mode = "CREATE";
			
		// edit
		} else if (oEvent.getParameter("name") === "masterdata.CustomerDetails") {
			var id = oEvent.getParameter("arguments").id;
			this.getView().bindElement("/Customers(" + id + ")");
			this._mode = "EDIT";
			
		// leave
		} else {
			// skip if edit
			if ( this._mode !== "CREATE")
				return;
			
			var context = this.getView().getBindingContext();
			this.getView().getModel().deleteCreatedEntry(context);
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
	 * Method onInit
	 */
	onInit : function() {
		
		// create || edit || leave
		var oRouter = this.getOwnerComponent().getRouter();
		oRouter.attachRouteMatched(this.controlMode, this);
	},

	/**
	 * Method onSave
	 */
	onSave : function() {
		var model = this.getView().getModel();
		
		var parameters = {};
		parameters.success = jQuery.proxy(this.onSuccess, this);
		parameters.error = jQuery.proxy(this.onError, this);
		
		model.submitChanges(parameters);
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
	 * Method onSuccess
	 */
	onSuccess : function(oData) {
		
		// set data model
		var model = new sap.ui.model.json.JSONModel();
		model.setData( {
			text : "Customer successfully saved",
			type : "Success"
		});
		this.getView().setModel(model, "msg");
		
		var msgArea = this.getView().byId("messageArea");
		msgArea.addContent(sap.ui.xmlfragment("uni.mannheim.mdm.fragment.Message"));
		
		// nav. to edit for create
		if(this._mode === "CREATE") {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("masterdata.CustomerDetails", {id: oData.Id}, false);
		}
	},

	/**
	 * Method onError
	 */
	onError : function(oError) {
		
		// set data model
		var model = new sap.ui.model.json.JSONModel();
		model.setData( {
			text : "Customer could not be saved",
			type : "Error"
		});
		this.getView().setModel(model, "msg");
		
		var msgArea = this.getView().byId("messageArea");
		msgArea.addContent(sap.ui.xmlfragment("uni.mannheim.mdm.fragment.Message"));
	}
});