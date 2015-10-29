sap.ui.controller("uni.mannheim.mdm.controller.masterdata.CustomerDetails", {

	
	/**
	 * Method onInit
	 */
	onInit : function() {
		
		// model
		this._model = this.getOwnerComponent().getModel();
		
		// routing
		var oRouter = this.getOwnerComponent().getRouter();
		oRouter.attachRouteMatched(this.onRequest, this);
	},

	/**
	 * Method onExit
	 */
	onExit : function() {
		var oRouter = this.getOwnerComponent().getRouter();
		oRouter.detachRouteMatched(this.onRequest, this);
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
	 * Method onDialogCanceled
	 */
	onDialogCanceled : function(oEvent) {
		this._dialog.destroy();
	},
	
	/**
	 * Method onDialogConfirmed
	 */
	onDialogConfirmed : function(oEvent) {
		this._dialog.destroy();
		this._model.remove("/Customers(" + this._id + ")", {success: jQuery.proxy(this.onDeleteSuccess, this), error: jQuery.proxy(this.onDeleteError, this)});
	},
	
	/**
	 * Method onDelete
	 */
	onDelete : function() {
		
		this._dialog = sap.ui.xmlfragment("uni.mannheim.mdm.fragment.ConfirmationDialog", this);
		
		var model = new sap.ui.model.json.JSONModel();
		model.setData( {
			title: "Delete",
			text : "Do you really want to delete the customer?",
			type: "Message",
			state : "Warning"
		});
		this._dialog.setModel(model, "dialog");
		
		this._dialog.open();
	},
	
	/**
	 * Method onDeleteError
	 */
	onDeleteError : function(oError) {
		
		// set data model
		var model = new sap.ui.model.json.JSONModel();
		model.setData( {
			text : "Customer could not be deleted",
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
			text : "Customer successfully deleted",
			type : "Success"
		});
		this.getView().setModel(model, "msg");
		
		var msgArea = this.getView().byId("messageArea");
		msgArea.removeAllContent();
		msgArea.addContent(sap.ui.xmlfragment("uni.mannheim.mdm.fragment.Message"));
		
		// nav. to edit for create
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("masterdata.CustomerOverview", false);
	},
	
	/**
	 * Method onRequest
	 */
	onRequest : function(oEvent) {
		
		// create
		if (oEvent.getParameter("name") === "masterdata.CustomerCreate") {
			var context = this._model.createEntry("/Customers", {});
			this.getView().unbindElement();
			this.getView().setBindingContext(context);
			this._mode = "CREATE";
			
			var button = this.getView().byId("deleteButton");
			button.setVisible(false);
			
			var msgArea = this.getView().byId("messageArea");
			msgArea.removeAllContent();
			
		// edit
		} else if (oEvent.getParameter("name") === "masterdata.CustomerDetails") {
			this._id = oEvent.getParameter("arguments").id;
			this.getView().bindElement("/Customers(" + this._id + ")");

			if(this._mode != "CREATE") {
				var msgArea = this.getView().byId("messageArea");
				msgArea.removeAllContent();
			}
			
			this._mode = "EDIT";
			
			var button = this.getView().byId("deleteButton");
			button.setVisible(true);
			
		// leave
		} else {
			
			// skip if edit
			if ( this._mode !== "CREATE")
				return;
			
			var context = this.getView().getBindingContext();
			this._model.deleteCreatedEntry(context);
			this._mode = undefined;
		}
	},

	/**
	 * Method onSave
	 */
	onSave : function() {
		this._model.submitChanges({success : jQuery.proxy(this.onSaveSuccess, this), error: jQuery.proxy(this.onSaveError, this)});
	},
	
	/**
	 * Method onSaveError
	 */
	onSaveError : function(oError) {
		
		// set data model
		var model = new sap.ui.model.json.JSONModel();
		model.setData( {
			text : "Customer could not be saved",
			type : "Error"
		});
		this.getView().setModel(model, "msg");
		
		var msgArea = this.getView().byId("messageArea");
		msgArea.removeAllContent();
		msgArea.addContent(sap.ui.xmlfragment("uni.mannheim.mdm.fragment.Message"));
	},
	
	/**
	 * Method onSaveSuccess
	 */
	onSaveSuccess : function(oData) {
		
		var model = new sap.ui.model.json.JSONModel();
		var error = false;
		
		// analyze response for error
		if(typeof oData.__batchResponses[0].__changeResponses == "undefined") {
			error = true;
			model.setData( {
				text : "Customer could not be saved",
				type : "Error"
			});
		} else {
			model.setData( {
				text : "Customer successfully saved",
				type : "Success"
			});
		}
		this.getView().setModel(model, "msg");
		
		var msgArea = this.getView().byId("messageArea");
		msgArea.removeAllContent();
		msgArea.addContent(sap.ui.xmlfragment("uni.mannheim.mdm.fragment.Message"));
		
		// nav. to edit for create
		if(this._mode === "CREATE" && !error) {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("masterdata.CustomerDetails", {id: oData.__batchResponses[0].__changeResponses[0].data.Id}, true);
		}
	}
	
});