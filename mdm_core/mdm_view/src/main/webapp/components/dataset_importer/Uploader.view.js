sap.ui.jsview("components.dataset_importer.Uploader", {

	/**
	 * Method getControllerName.
	 * 
	 * @returns {String}
	 */
	getControllerName : function() {
		return "components.dataset_importer.Uploader";
	},

	/**
	 * Method createContent
	 */
	createContent : function(oController) {

		var layout = new sap.ui.commons.layout.MatrixLayout();
		layout.setLayoutFixed(false);

		// create the uploader and disable the automatic upload
		var oFileUploader = new sap.ui.commons.FileUploader({
			name: "uploader",
			multiple: true,
			maximumFileSize: 100,
			mimeType: "text",
			fileType: "xslx,txt",
			uploadOnChange: false,
			uploadUrl: "upload",
			sendXHR: true,
			additionalData: "",
			headerParameters: [
			],
			parameters: [
			],
			fileSizeExceed: function (oEvent) {
				var sName = oEvent.getParameter("fileName");
				var fSize = oEvent.getParameter("fileSize");
				var fLimit = oFileUploader.getMaximumFileSize();
				sap.ui.commons.MessageBox.show("File: " + sName + " is of size " + fSize + " MB which exceeds the file size limit of " + fLimit + " MB.", "ERROR", "File size exceeded");
			},
			typeMissmatch: function (oEvent) {
				var sName = oEvent.getParameter("fileName");
				var sType = oEvent.getParameter("fileType");
				var sMimeType = oFileUploader.getMimeType();
				if (!sMimeType) {
					sMimeType = oFileUploader.getFileType();
				}
				sap.ui.commons.MessageBox.show("File: " + sName + " is of type " + sType + " .Allowed types are: "  + sMimeType + ".", "ERROR", "Wrong File type");
			},
			uploadComplete: function (oEvent) {
				var sResponse = oEvent.getParameter("response");
				if (sResponse) {
					var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);
					if (m[1] == "200") {
						sap.ui.commons.MessageBox.show("Return Code: " + m[1] + "\n" + m[2], "SUCCESS", "Upload Success");
					} else {
						sap.ui.commons.MessageBox.show("Return Code: " + m[1] + "\n" + m[2], "ERROR", "Upload Error");
					}
				}
			}
		});
		layout.createRow(oFileUploader);

		// create a second button to trigger the upload
		var oTriggerButton = new sap.ui.commons.Button({
			text:'Trigger Upload',
			press:function() {
				// call the upload method
				oFileUploader.upload();
			}
		});
		layout.createRow(oTriggerButton);

		// bind table rows to /Persons based on the model defined in the init
		// method of the controller
		//oTable.bindRows("/Customers"); 
		
		return layout;
	}
});
