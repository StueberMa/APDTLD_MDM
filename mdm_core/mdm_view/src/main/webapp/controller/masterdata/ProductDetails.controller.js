sap.ui.controller("uni.mannheim.mdm.controller.masterdata.ProductDetails", {

	/**
	 * Method controlMode
	 */
	controlMode : function(oEvent) {
		
		// create
		if (oEvent.getParameter("name") === "masterdata.ProductCreate") {
			var context = this.getView().getModel().createEntry("/Products", {});
			this.getView().unbindElement();
			this.getView().setBindingContext(context);
			this._mode = "CREATE";
			
		// edit
		} else if (oEvent.getParameter("name") === "masterdata.ProductDetails") {
			var id = oEvent.getParameter("arguments").id;
			this.getView().bindElement("/Products(" + id + ")");
			this._mode = "EDIT";
			
		// leave
		} else {
			
			// skip if edit
			if ( this._mode !== "CREATE")
				return;
			
			var context = this.getView().getBindingContext();
			this.getView().getModel().deleteCreatedEntry(context);
			this._mode = undefined;
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
		var oRouter = this.getOwnerComponent().getRouter();
		oRouter.attachRouteMatched(this.controlMode, this);
	},

	/**
	 * Method addNewProduct.
	 */
	onSave : function() {
		var model = this.getView().getModel();
		model.submitChanges({success : jQuery.proxy(this.onSuccess, this), error: jQuery.proxy(this.onError, this)});
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
			router.navTo("masterdata.ProductOverview", false);
		}
	},

	/**
	 * Method successMsg.
	 */
	onSuccess : function(oData) {
		
		// set data model
		var model = new sap.ui.model.json.JSONModel();
		model.setData( {
			text : "Product successfully saved",
			type : "Success"
		});
		this.getView().setModel(model, "msg");
		
		var msgArea = this.getView().byId("messageArea");
		msgArea.addContent(sap.ui.xmlfragment("uni.mannheim.mdm.fragment.Message"));
		
		// nav. to edit for create
		if(this._mode === "CREATE") {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("masterdata.ProductDetails", {id: oData.__batchResponses[0].__changeResponses[0].data.Id}, false);
		}
	},

	/**
	 * Method errorMsg.
	 */
	onError : function() {
		
		// set data model
		var model = new sap.ui.model.json.JSONModel();
		model.setData( {
			text : "Product could not be saved",
			type : "Error"
		});
		this.getView().setModel(model, "msg");
		
		var msgArea = this.getView().byId("messageArea");
		msgArea.addContent(sap.ui.xmlfragment("uni.mannheim.mdm.fragment.Message"));
	}
});