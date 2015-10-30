sap.ui.controller("uni.mannheim.mdm.controller.import.FieldMapper", {

	file:"",
	remainingFiles:[],
	
	onInit: function (evt) {
		var oRouter = this.getOwnerComponent().getRouter();
		oRouter.getRoute("import.FieldMapper").attachMatched(this.initModel, this);
	/*	var parts = window.location.href.split('/');
		var files = parts[parts.length-1];
		this.initModel(files)*/
	},
	
	initModel: function(event) {
		var files = event.getParameter("arguments").files.split(';')
		var oModel = new sap.ui.model.json.JSONModel();
		console.log(files);
		this.file = decodeURIComponent(files[0]);
		files.splice(0,1);
		this.remainingFiles = files;
		oModel.loadData("/mdm_view/fileanalyser?file=" + this.file);
		this.getView().setModel(oModel);
		
	},
	
	onDBNameChange: function(evt) {
		var oHbox0 = evt.getSource().getParent().getParent().getParent();
		var oHbox0_1 = oHbox0.getItems()[1];
		var oVbox0 = oHbox0_1.getItems()[0];
		var oDBNameSelect = oVbox0.getItems()[0];
		var oVbox1 = oHbox0_1.getItems()[1];
		var oDBTypeLabel = oVbox1.getItems()[0];
		var oModel = this.getView().getModel();
		if(oDBNameSelect.getSelectedItem()==null) {
			oDBTypeLabel.setText("-");
			return;
		}
		var selectedText = oDBNameSelect.getSelectedItem().getText();
		console.log(selectedText);
		oModel.getObject("/attributes_database").forEach(function(attribute) {
			if(attribute.name == selectedText) {
				oDBTypeLabel.setText(attribute.type);
				return;
			}
		});
	},
	
	onDelete: function(evt){
		var index = evt.getSource().getId().split('-');
		index = index[index.length-1];
		var mappingsArray = this.getView().getModel().getObject('/mappings');
		mappingsArray.splice(index,1);
		this.getView().getModel().refresh();
	},
	
	onAdd: function(evt) {
		var _this = this;
		var mappingsArray = this.getView().getModel().getObject('/mappings');
		var newMapping = {
				fName: _this.getView().byId("addrowFileName").getSelectedItem().getText(),
				fType: _this.getView().byId("addrowFileType").getSelectedItem().getText(),
				fSample: _this.getView().byId("addrowFileSample").getText(),
				dbName: _this.getView().byId("addrowDbName").getSelectedItem().getText(),
				dbType: _this.getView().byId("addrowDbType").getText(),
				dbSample: _this.getView().byId("addrowDbSample").getText()
		};
		mappingsArray.push(newMapping);
		this.getView().getModel().refresh();
		this.resetAddRow();
	},
	
	resetAddRow: function() {
		this.getView().byId("addrowFileName").setSelectedKey("");
		this.getView().byId("addrowFileType").setSelectedKey("str");
		this.getView().byId("addrowFileSample").setText("-");
		this.getView().byId("addrowDbName").setSelectedKey("");
		this.getView().byId("addrowDbType").setText("-");
		this.getView().byId("addrowDbSample").setText("-");
	},
		
	onAddrowFileNameChange: function(evt) {
		var _this = this;
		var selectedText = evt.getSource().getSelectedItem().getText();
		var aFileAttributes = this.getView().getModel().getObject('/attributes_file');
		aFileAttributes.forEach(function(attribute) {
			if(attribute.name == selectedText) {
				_this.getView().byId("addrowFileType").setSelectedKey(attribute.type);
				_this.getView().byId("addrowFileSample").setText(attribute.sample);
				return;
			}
		});
	},
	
	onAddrowDBNameChange: function(evt) {
		var _this = this;
		var selectedText = evt.getSource().getSelectedItem().getText();
		var aAttributesDB =  this.getView().getModel().getObject('/attributes_database');
		aAttributesDB.forEach(function(attribute) {
			if(attribute.name == selectedText) {
				_this.getView().byId("addrowDbType").setText(attribute.type);
				_this.getView().byId("addrowDbSample").setText(attribute.sample);
				return;
			}
		});
	},
	
	onAnalyseRows: function() {
		var jsonModel = this.getView().getModel().getJSON();
		$.ajax({
			type: "POST",
			contentType: "application/json",
			url: '/mdm_view/fileanalyser?file=' + this.file,
			dataType: "json",
			async: false,
			data: jsonModel,
			success: $.proxy(function(data, textStatus, jqXHR) {
				sap.m.MessageToast.show("All data for file " + this.file + " was successfully imported.");
				setTimeout($.proxy(function() {
					console.log(this.remainingFiles);
					if(this.remainingFiles.length>0) {
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.loadData("/mdm_view/fileanalyser?file=" + this.remainingFiles[0]);
						this.getView().setModel(oModel);
						this.file = decodeURIComponent(this.remainingFiles[0]);
						this.remainingFiles.splice(0,1);
					} else {
						this.getOwnerComponent().getRouter().navTo("masterdata.Overview");
					}
					this.destroy();
				}, this), 2000);
			}, this),
			error: function(data, textStatus, jqXHR) {
				alert("no!");
			}
		});
		
	}
	
});