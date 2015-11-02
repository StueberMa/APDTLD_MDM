sap.ui.controller("uni.mannheim.mdm.controller.marketing.LeadDetails", {

	/**
	 * Method onInit
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
			router.navTo("marketing.LeadOverview", false);
		}
	},
	
	/**
	 * Method onCampaignValidation
	 */
	onCampaignValidation : function(oEvent) {
		
		var item = oEvent.mParameters.selectedItem;
		
		if(item)
			var key = item.getKey();
		
		this._model.setProperty("CampaignId", key), this.getView().getBindingContext();
	},
	
	/**
	 * Method onCustomerValidation
	 */
	onCustomerValidation : function(oEvent) {
		
		var item = oEvent.mParameters.selectedItem;
		
		if(item)
			var key = item.getKey();
		
		this._model.setProperty("CustomerId", key, this.getView().getBindingContext());	
	},
	
	/**
	 * Method onDataLoaded
	 */
	onDataLoaded : function(oEvent) {
		
		// set value helper
		var campaignHelper = this.getView().byId("CampaignIdHelper");
		campaignHelper.setSelectedKey(this._model.getProperty("/Leads('" + this._id + "')/CampaignId"));
		
		var customerHelper = this.getView().byId("CustomerIdHelper");
		customerHelper.setSelectedKey(this._model.getProperty("/Leads('" + this._id + "')/CustomerId"));
		
		var productHelper = this.getView().byId("ProductIdHelper");
		productHelper.setSelectedKey(this._model.getProperty("/Leads('" + this._id + "')/ProductId")); 
		
		// unbind listener
		this._model.detachBatchRequestCompleted(this.onDataLoaded, this)
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
		this._model.remove("/Leads('" + this._id + "')", {success: jQuery.proxy(this.onDeleteSuccess, this), error: jQuery.proxy(this.onDeleteError, this)});
	},
	
	/**
	 * Method onDelete
	 */
	onDelete : function() {
		
		this._dialog = sap.ui.xmlfragment("uni.mannheim.mdm.fragment.ConfirmationDialog", this);
		
		var model = new sap.ui.model.json.JSONModel();
		model.setData( {
			title: "Delete",
			text : "Do you really want to delete the lead?",
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
			text : "Lead could not be deleted",
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
			text : "Lead successfully deleted",
			type : "Success"
		});
		this.getView().setModel(model, "msg");
		
		var msgArea = this.getView().byId("messageArea");
		msgArea.removeAllContent();
		msgArea.addContent(sap.ui.xmlfragment("uni.mannheim.mdm.fragment.Message"));
		
		// nav. to edit for create
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("marketing.LeadOverview", false);
	},
	
	/**
	 * Method onProductValidation
	 */
	onProductValidation : function(oEvent) {
		
		var item = oEvent.mParameters.selectedItem;
		
		if(item)
			var key = item.getKey();
		
		this._model.setProperty("ProductId", key, this.getView().getBindingContext());
	},
	
	/**
	 * Method onRequest
	 */
	onRequest : function(oEvent) {
		
		// create
		if (oEvent.getParameter("name") === "marketing.LeadCreate") {
			
			this._model.metadataLoaded().then(jQuery.proxy(function() {
				var context = this._model.createEntry("/Leads", "expand:CampaignDetails,CustomerDetails,ProductDetails");
				this.getView().unbindElement();
				this.getView().setBindingContext(context);	
			}, this));
			this._mode = "CREATE";
			
			var button = this.getView().byId("deleteButtonTop");
			button.setVisible(false);
			
			var button = this.getView().byId("deleteButtonBottom");
			button.setVisible(false);
			
			var msgArea = this.getView().byId("messageArea");
			msgArea.removeAllContent();
			
			this.getView().byId("CampaignIdHelper").setSelectedKey(undefined);
			this.getView().byId("CustomerIdHelper").setSelectedKey(undefined);
			this.getView().byId("ProductIdHelper").setSelectedKey(undefined);
			
			return;
		}
			
		// edit
		if (oEvent.getParameter("name") === "marketing.LeadDetails") {
			this._id = oEvent.getParameter("arguments").id;
			this.getView().bindElement("/Leads('" + this._id + "')");
			
			
			if(this._mode != "CREATE") {
				var msgArea = this.getView().byId("messageArea");
				msgArea.removeAllContent();
				
				// wait until data loaded
				this._model.attachRequestCompleted(this.onDataLoaded, this);
			}
			
			this._mode = "EDIT";
			
			var button = this.getView().byId("deleteButtonTop");
			button.setVisible(true);
			
			var button = this.getView().byId("deleteButtonBottom");
			button.setVisible(true);
			
			return;
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
			text : "Lead could not be saved",
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
				text : "Lead could not be saved",
				type : "Error"
			});
		} else {
			model.setData( {
				text : "Lead successfully saved",
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
			router.navTo("marketing.LeadDetails", {id: oData.__batchResponses[0].__changeResponses[0].data.Id}, true);
		}
	}
	
});