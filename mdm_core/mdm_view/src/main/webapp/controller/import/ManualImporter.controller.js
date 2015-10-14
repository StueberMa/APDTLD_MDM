sap.ui.controller("uni.mannheim.mdm.controller.import.ManualImporter", {

	onStartUpload : function(oEvent) {
		var oUploadCollection = this.getView().byId("UploadCollection");
		var cFiles = oUploadCollection.getItems().length;

		oUploadCollection.getItems().forEach(function(element){
			sap.ui.getCore().byId(element.getFileUploader()).setUseMultipart(true);
		});
		oUploadCollection.upload();

		uploadInfo = cFiles + " file(s)";


		sap.m.MessageBox.information(
			"Uploaded " + uploadInfo
		);

	},
});