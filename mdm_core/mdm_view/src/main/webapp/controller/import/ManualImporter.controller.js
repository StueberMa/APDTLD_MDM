sap.ui.controller("uni.mannheim.mdm.controller.import.ManualImporter", {

	fileProgesses:{},
	fileCount:0,
	
	onChange: function(oEvent) {
		console.log("change");
		var oUploadButton = this.getView().byId("UploadButton");
		oUploadButton.setEnabled(true);
	},

	onFileDeleted: function(oEvent) {
		console.log("test");
		var oUploadCollection = this.getView().byId("UploadCollection");
		var oUploadButton = this.getView().byId("UploadButton");
		console.log("on change " + oUploadCollection.getItems().length);
		console.log(oEvent);
		if(oUploadCollection.getItems().length==1) {
			oUploadButton.setEnabled(false);
		}
	},
	
	onStartUpload : function(oEvent) {
		var _this = this;
		var oUploadCollection = this.getView().byId("UploadCollection");
		var oUploadButton = this.getView().byId("UploadButton");
		var oUploadProgressIndicator = this.getView().byId("UploadProgressIndicator");
		this.fileCount = oUploadCollection.getItems().length;

		oUploadButton.setText("Abort upload");
		oUploadButton.detachPress(this.onStartUpload, this);
		oUploadButton.attachPress(this.onAbortUpload);
		
		oUploadProgressIndicator.setVisible(true);
		
		oUploadCollection.getItems().forEach(function(oElement){
			var oUploader = sap.ui.getCore().byId(oElement.getFileUploader());
			oUploader.setUseMultipart(true);
			oUploader.attachUploadProgress(_this.onUploadProgress, _this);
		});
		
		oUploadCollection.upload();

		sap.m.MessageToast.show("There are " + this.fileCount  + " files uploaded.");
		
		
	},
	
	onAbortUpload: function(oEvent) {
		console.log("abort");
	},
	
	onUploadProgress: function(oEvent) {
		oUploadProgressIndicator = this.getView().byId("UploadProgressIndicator");
		
		var params = oEvent.getParameters();
		this.fileProgesses[params.id] = params.loaded/params.total;
		
		var totalRelativeLoaded = 0;
		for(var key in this.fileProgesses) {
			totalRelativeLoaded += this.fileProgesses[key];
		}
		
		var progress = 100 * totalRelativeLoaded / this.fileCount;
		oUploadProgressIndicator.setPercentValue(progress);
		oUploadProgressIndicator.setDisplayValue(progress.toFixed(0) + "%");
	},
	
	onUploadComplete: function(oEvent) {
		setTimeout($.proxy(function() {
			sap.m.MessageToast.show("All " + this.fileCount + " files were uploaded.");
		}, this), 1000);
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