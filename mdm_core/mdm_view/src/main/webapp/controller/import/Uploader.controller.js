sap.ui.controller("uni.mannheim.mdm.controller.import.Uploader", {

	fileProgesses:{},
	fileCount:0,
	lastProgressUpdateCall:0,
	fileCountFinished:0,
	files:"",
	
	onAfterRendering: function() {
		this.setSelectButton();
	},
	
	onChange: function(oEvent) {
		var oUploadButton = this.getView().byId("UploadButton");
		oUploadButton.setEnabled(true);
		
		setTimeout($.proxy(function() {
			this.setSelectButton();
		}, this), 100);
	},
	
	setSelectButton: function() {
		console.log($('[title="Add"]'));
		$('[title="Add"]').each(function(index, item){
			console.log(item);
			$(item).prev().html("Select CSV File for Upload");
		});
	},

	onFileDeleted: function(oEvent) {
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

		if(this.fileCount>1) {
			sap.m.MessageToast.show("There are " + this.fileCount  + " files uploaded.");
		} else {
			sap.m.MessageToast.show("There is one file uploaded.");
		}
	},
	
	onAbortUpload: function(oEvent) {
		console.log("abort");
	},
	
	onUploadProgress: function(oEvent) {
		var now = Date.now();
        if (this.lastProgressUpdateCall + 100 > now) {
        	return;    
        }
        this.lastProgressUpdateCall = now;
        
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
		this.fileCountFinished++;
		this.files += oEvent.getParameter("files")[0].responseRaw + ";";
		if(this.fileCountFinished!=this.fileCount) {
			return;
		}
		var filesParam = this.files.substring(0,this.files.length-1);
		console.log(oEvent.getParameters());
		oUploadProgressIndicator = this.getView().byId("UploadProgressIndicator");
		oUploadProgressIndicator.setPercentValue(100);
		oUploadProgressIndicator.setDisplayValue("100%");
		
		setTimeout($.proxy(function() {
			if(this.fileCount>1) {
				sap.m.MessageToast.show("All " + this.fileCount + " files were uploaded.");
			} else {
				sap.m.MessageToast.show("The file was uploaded.");
			}
			
			setTimeout($.proxy(function() {
				this.reset();
				this.getOwnerComponent().getRouter().navTo("import.FieldMapper", {files: filesParam});
			}, this), 1000);
		}, this), 1000);
	},
	
	reset: function() {
		this.fileProgesses={};
		this.fileCount=0;
		this.lastProgressUpdateCall=0;
		this.fileCountFinished=0;
		this.files="";
		/*var uploadCollection = this.getView().byId("UploadCollection");
		this.getView().removeContent(uploadCollection);
		uploadCollection.removeAllItems();
		this.getView().addContent(uploadCollection);
		/*uploadCollection.destroy();
		uploadCollection = new sap.m.UploadCollection({
			id: this.getView().createId("UploadCollection"),
			uploadUrl:"upload",
			maximumFilenameLength:55,
			maximumFileSize:10240,
			multiple: true,
			sameFilenameAllowed: true,
			instantUpload: false,
			showSeparators: "All",
			change: [this.onChange, this],
			fileDeleted: [this.onFileDeleted, this],
			filenameLengthExceed: [this.onFilenameLengthExceed, this],
			fileSizeExceed: [this.onFileSizeExceed, this],
			typeMissmatch: [this.onTypeMissmatch, this],
			uploadComplete: [this.onUploadComplete, this],
			beforeUploadStarts: [this.onBeforeUploadStarts, this]
		});
		uploadCollection.addItem(null);
		this.getView().insertContent(uploadCollection);*/
		var oUploadButton = this.getView().byId("UploadButton");
		oUploadButton.setText("Upload now");
		oUploadButton.attachPress(this.onStartUpload, this);
		oUploadButton.detachPress(this.onAbortUpload, this);
		this.getView().byId("UploadProgressIndicator").setVisible(false);
	}
});