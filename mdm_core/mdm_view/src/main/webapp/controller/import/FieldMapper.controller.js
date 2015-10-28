sap.ui.controller("uni.mannheim.mdm.controller.import.FieldMapper", {

	oPersonalizationDialog: null,
	file:"",
	remainingFiles:[],
	
	onInit : function (evt) {
		// set explored app's demo model on this sample
		
		var oModel = new sap.ui.model.json.JSONModel();
		var parts = window.location.href.split('/');
		var files = parts[parts.length-1].split(';');
		this.file = decodeURIComponent(files[0]);
		files.splice(0,1);
		this.remainingFiles = files;
		oModel.loadData("/mdm_view/fileanalyser?file=" + files[0]);
		this.getView().setModel(oModel);
		
		this.oPersonalizationDialog = sap.ui.xmlfragment("uni.mannheim.mdm.controller.import.FieldMapperAdd", this);
		this.getView().addDependent(this.oPersonalizationDialog);
	},
	
	/*updateSelects: function(evt) {
		var _this = this;
		var oList = this.getView().byId("mappingList");
		var aListItems = oList.getItems();
		var oModel = this.getView().getModel();
		aListItems.forEach(function(oListItem, index){
			var oHbox0 = oListItem.getContent()[0];
			var oHbox0_0 = oHbox0.getItems()[0];
			var oVbox1 = oHbox0_0.getItems()[1];
			var oFTypeSelect = oVbox1.getItems()[0];
			var oHbox0_1 = oHbox0.getItems()[1];
			var oVbox0 = oHbox0_1.getItems()[0];
			var oDBNameSelect = oVbox0.getItems()[0];
			
			var oMappings = oModel.getObject("/mappings");
			oFTypeSelect.setSelectedKey(oMappings[index].fType);
			oDBNameSelect.setSelectedKey(oMappings[index].dbName);
			console.log(oDBNameSelect);
			oDBNameSelect.attachChange(oListItem, $.proxy(_this.onDBNameChange, _this));
		});
	},*/
	
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
	
	/*onAdd: function(evt) {
		// toggle compact style
		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.oPersonalizationDialog);
		this.oPersonalizationDialog.open();
	},*/
	
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
		//this.oPersonalizationDialog.close();
		//this.resetPopover();
	},
	
	resetAddRow: function() {
		this.getView().byId("addrowFileName").setSelectedKey("");
		this.getView().byId("addrowFileType").setSelectedKey("str");
		this.getView().byId("addrowFileSample").setText("-");
		this.getView().byId("addrowDbName").setSelectedKey("");
		this.getView().byId("addrowDbType").setText("-");
		this.getView().byId("addrowDbSample").setText("-");
	},
	
	handleCloseCancel: function() {
		this.oPersonalizationDialog.close();
		this.resetPopover();
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
	
	resetPopover: function() {
		sap.ui.getCore().byId("addrowFileName").setSelectedKey('');
		sap.ui.getCore().byId("addrowFileType").setSelectedKey('Text'),
		sap.ui.getCore().byId("addrowFileSample").setText(''),
		sap.ui.getCore().byId("addrowDbName").setSelectedKey(''),
		sap.ui.getCore().byId("addrowDbType").setText(''),
		sap.ui.getCore().byId("addrowDbSample").setText('')
	},
	
	onAnalyseRows: function() {
		var jsonModel = this.getView().getModel().getJSON();
		$.ajax({
			type: "POST",
			contentType: "application/json",
			url: '/mdm_view/fileanalyser',
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
						this.file = decodeURIComponent(this.remainingFiles[0]);
						this.remainingFiles.splice(0,1);
					} else {
						this.getOwnerComponent().getRouter().navTo("masterdata.Overview");
					}
				}, this), 2000);
			}, this),
			error: function(data, textStatus, jqXHR) {
				alert("no!");
			}
		});
		
	}
	
});