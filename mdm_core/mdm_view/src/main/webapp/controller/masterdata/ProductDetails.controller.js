sap.ui.controller("uni.mannheim.mdm.controller.masterdata.ProductDetails", {

	/**
	 * Method onInit.
	 */
	onInit : function() {
		
		// model
		this._model = this.getOwnerComponent().getModel();
		
		// router
		var oRouter = this.getOwnerComponent().getRouter();
		oRouter.attachRouteMatched(this.onRequest, this);
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
		this._model.remove("/Products('" + this._id + "')", {success: jQuery.proxy(this.onDeleteSuccess, this), error: jQuery.proxy(this.onDeleteError, this)});
	},
	
	/**
	 * Method onDelete
	 */
	onDelete : function() {
		
		this._dialog = sap.ui.xmlfragment("uni.mannheim.mdm.fragment.ConfirmationDialog", this);
		
		var model = new sap.ui.model.json.JSONModel();
		model.setData( {
			title: "Delete",
			text : "Do you really want to delete the product?",
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
			text : "Product could not be deleted",
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
	 * Method onRequest
	 */
	onRequest : function(oEvent) {
		
		// create
		if (oEvent.getParameter("name") === "masterdata.ProductCreate") {
			this._model.metadataLoaded().then(jQuery.proxy(function() {
				var context = this._model.createEntry("/Products");
				this.getView().unbindElement();
				this.getView().setBindingContext(context);	
			}, this));
			this._mode = "CREATE";
			
			var button = this.getView().byId("deleteButton");
			button.setVisible(false);
			
			var msgArea = this.getView().byId("messageArea");
			msgArea.removeAllContent();
			
			return;
		}
		
		// edit
		if (oEvent.getParameter("name") === "masterdata.ProductDetails") {
			this._id = oEvent.getParameter("arguments").id;
			this.getView().bindElement("/Products('" + this._id + "')");
			
			// nav. create to edit
			if(this._mode != "CREATE") {
				var msgArea = this.getView().byId("messageArea");
				msgArea.removeAllContent();
			}
			
			this._mode = "EDIT";
			
			var button = this.getView().byId("deleteButton");
			button.setVisible(true);
		}
		
		// leave
		if(this._mode == "CREATE") {
			var context = this.getView().getBindingContext();
			this._model.deleteCreatedEntry(context);
			this._mode = undefined;
		}
			
		if(this._mode == "EDIT") {
			this._model.resetChanges();
			this._mode = undefined;
		}
	},
	
	/**
	 * Method onSave.
	 */
	onSave : function() {
		this._model.submitChanges({success : jQuery.proxy(this.onSaveSuccess, this), error: jQuery.proxy(this.onSaveError, this)});
	},

	/**
	 * Method onSaveError.
	 */
	onSaveError : function(oError) {
		
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
	 * Method onSaveSuccess.
	 */
	onSaveSuccess : function(oData) {
		
		var model = new sap.ui.model.json.JSONModel();
		var error = false;
		
		// analyze response for error
		if(typeof oData.__batchResponses[0].__changeResponses == "undefined") {
			error = true;
			model.setData( {
				text : "Product could not be saved",
				type : "Error"
			});
		} else {
			model.setData( {
				text : "Product successfully saved",
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
			router.navTo("masterdata.ProductDetails", {id: oData.__batchResponses[0].__changeResponses[0].data.Id}, true);
		}
	}
	
});