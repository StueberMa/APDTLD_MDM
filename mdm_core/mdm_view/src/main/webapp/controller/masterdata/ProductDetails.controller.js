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
			
			var button = this.getView().byId("deleteButton");
			button.setVisible(false);
			
		// edit
		} else if (oEvent.getParameter("name") === "masterdata.ProductDetails") {
			this._id = oEvent.getParameter("arguments").id;
			this.getView().bindElement("/Products(" + this._id + ")");
			this._mode = "EDIT";
			
			var button = this.getView().byId("deleteButton");
			button.setVisible(true);
			
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
	 * Method onDelete
	 */
	onDelete : function() {
		
		this._dialog = sap.ui.xmlfragment("uni.mannheim.mdm.fragment.ConfirmationDialog", this);
		
		var model = new sap.ui.model.json.JSONModel();
		model.setData( {
			title: 'Delete',
			text : "Do you really want to delete the customer?",
			type: 'Message',
			state : "Warning"
		});
		this._dialog.setModel(model, "dialog");
		
		this._dialog.open();
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
		model.submitChanges({success : jQuery.proxy(this.onCreateSuccess, this), error: jQuery.proxy(this.onCreateError, this)});
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
	 * Method onDialogConfirmed
	 */
	onDialogConfirmed : function(oEvent) {
		this._dialog.destroy();
		
		var model = this.getView().getModel();
		model.remove("/Products(" + this._id + ")", {success: jQuery.proxy(this.onDeleteSuccess, this), error: jQuery.proxy(this.onDeleteError, this)});
	},
	
	/**
	 * Method onDialogCanceled
	 */
	onDialogCanceled : function(oEvent) {
		this._dialog.destroy();
	},

	/**
	 * Method onCreateSuccess.
	 */
	onCreateSuccess : function(oData) {
		
		// set data model
		var model = new sap.ui.model.json.JSONModel();
		model.setData( {
			text : "Product successfully saved",
			type : "Success"
		});
		this.getView().setModel(model, "msg");
		
		var msgArea = this.getView().byId("messageArea");
		msgArea.removeAllContent();
		msgArea.addContent(sap.ui.xmlfragment("uni.mannheim.mdm.fragment.Message"));
		
		// nav. to edit for create
		if(this._mode === "CREATE") {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("masterdata.ProductDetails", {id: oData.__batchResponses[0].__changeResponses[0].data.Id}, false);
		}
	},

	/**
	 * Method onCreateError.
	 */
	onCreateError : function(oError) {
		
		// set data model
		var model = new sap.ui.model.json.JSONModel();
		model.setData( {
			text : "Product could not be saved",
			type : "Error"
		});
		this.getView().setModel(model, "msg");
		
		var msgArea = this.getView().byId("messageArea");
		msgArea.removeAllContent();
		msgArea.addContent(sap.ui.xmlfragment("uni.mannheim.mdm.fragment.Message"));
	},
	
	/**
	 * Method onDeleteSuccess
	 */
	onDeleteSuccess : function(oData) {
		
		// set data model
		var model = new sap.ui.model.json.JSONModel();
		model.setData( {
			text : "Product successfully deleted",
			type : "Success"
		});
		this.getView().setModel(model, "msg");
		
		var msgArea = this.getView().byId("messageArea");
		msgArea.removeAllContent();
		msgArea.addContent(sap.ui.xmlfragment("uni.mannheim.mdm.fragment.Message"));
		
		// nav. to edit for create
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("masterdata.ProductOverview", false);
	},

	/**
	 * Method onDeleteError
	 */
	onDeleteError : function(oError) {
		
		// set data model
		var model = new sap.ui.model.json.JSONModel();
		model.setData( {
			text : "Product could not be deleted",
			type : "Error"
		});
		this.getView().setModel(model, "msg");
		
		var msgArea = this.getView().byId("messageArea");
		msgArea.removeAllContent();
		msgArea.addContent(sap.ui.xmlfragment("uni.mannheim.mdm.fragment.Message"));
	}
});