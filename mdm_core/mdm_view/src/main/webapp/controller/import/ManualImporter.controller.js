sap.ui.controller("uni.mannheim.mdm.controller.import.ManualImporter", {

	onChange: function(oEvent) {
		
		var oUploadCollection = this.getView().byId("UploadCollection");
		var oUploadButton = this.getView().byId("UploadButton");
		console.log("on change " + oUploadCollection.getItems().length);
		console.log(oEvent);
		if(oUploadCollection.getItems().length>0) {
			oUploadButton.setEnabled(true);
		} else {
			oUploadButton.setEnabled(false);
		}
	},
	
	onStartUpload : function(oEvent) {
		var _this = this;
		var oUploadCollection = this.getView().byId("UploadCollection");
		var oUploadButton = this.getView().byId("UploadButton");
		var oUploadProgressIndicator = this.getView().byId("UploadProgressIndicator");
		var cUploadCount = oUploadCollection.getItems().length;

		oUploadButton.setText("Abort upload");
		oUploadButton.setPress("onAbortUpload");
		
		oUploadProgressIndicator.setVisible(true);
		
		oUploadCollection.getItems().forEach(function(oElement){
			var oUploader = sap.ui.getCore().byId(oElement.getFileUploader());
			oUploader.setUseMultipart(true);
			oUploader.uploadProgress(_this.onUploadProgress);
		});
		
		oUploadCollection.upload();

		sap.m.MessageToast.show("There are " + cUploadCount + " files uploaded.");
		
		
	},
	
	onUploadProgress: function(oEvent) {
		
	},
	
	onUploadComplete: function(oEvent) {
		var oUploadCollection = this.getView().byId("UploadCollection");
		var cUploadCount = oUploadCollection.getItems().length;
		setTimeout(function() {
			sap.m.MessageToast.show("All " + cUploadCount + " files were uploaded.");
		}, 1000);
		oUploadCollection.removeAllItems();
	},

	onBack : function () {
		var sPreviousHash = sap.ui.core.routing.History.getInstance().getPreviousHash();
		if (sPreviousHash !== undefined) {
			window.history.go(-1);
		} else {
			this.getOwnerComponent().getRouter().navTo("import.Overview", null, true);
		}
	},
});