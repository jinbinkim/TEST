sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/Fragment",
		"sap/ui/model/json/JSONModel",
		"sap/m/ColumnListItem",
		"sap/m/Text",
		"sap/m/Input"

	],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, Fragment, JSONModel, ColumnListItem, Text, Input) {
		"use strict";

		return Controller.extend("zproject4.controller.View1", {
			onInit: function () {
				let oJson = new JSONModel({
					profile: {
						myname: '박웅기',
						age: 34
					},
					myHobby: [{
							HobbyKey: 'Sleep',
							HobbyDesc: '잠 자는 것을 누구보다 좋아합니다.',
							edit: false
						},
						{
							HobbyKey: 'YouTube',
							HobbyDesc: '유튭 좋아',
							edit: false
						},
						{
							HobbyKey: 'BasketBall',
							HobbyDesc: 'NBA 좋아',
							edit: false
						}
					]
				})
				this.getView().setModel(oJson);


				let oPageState = new JSONModel({
					table1: {
						editmode: false,
						templates: {
							dispTemplate: new Object(),
							editTemplate: new Object()
						}
					},
					fragments: {}
				})
				this.getView().setModel(oPageState, 'PageState');

				//어그리게이션 바인딩
				let oEditTemplate = new ColumnListItem({
					cells: [
						new Input(
							'inputEdit1', {
								value: '{HobbyDesc}'
							}),
						new Input(
							'inputEdit2', {
								value: '{HobbyKey}'
							})
					]
				})

				let oDispTemplate = new ColumnListItem({
					cells: [
						new Text({
							text: '{HobbyDesc}'
						}),
						new Text({
							text: '{HobbyKey}'
						})
					]
				})

				oPageState.setProperty('/table1/templates/editTemplate', oEditTemplate);
				oPageState.setProperty('/table1/templates/dispTemplate', oDispTemplate);

				let oTable3 = this.getView().byId('table3');
				oTable3.bindAggregation(
					'items', {
						path: '/myHobby',
						template: oDispTemplate
					}
				)
			},
			onEditToggle: function (params) {
				let oView = this.getView();
				let oPageModel = oView.getModel('PageState');
				let bEditMode = oPageModel.getProperty('/table1/editmode');
				oPageModel.setProperty('/table1/editmode', !bEditMode);

				let oModel = oView.getModel();
				let oTable = oView.byId('table3');
				let oTemplate;

				if (bEditMode === true) { // from 수정 -> to 조회
					oModel.setDefaultBindingMode('TwoWay');
					oTemplate = oPageModel.getProperty('/table1/templates/dispTemplate');
				} else { //  from 조회 -> to 수정
					oModel.setDefaultBindingMode('OneWay');
					oTemplate = oPageModel.getProperty('/table1/templates/editTemplate');
				}
				oTable.bindAggregation(
					'items', {
						path: '/myHobby',
						template: oTemplate
					}
				);
			},
			onselectionchange: function name(params) {
				
			},
			onDelete: function (params) {
				let oModel = this.getView().getModel();
                let arrHobbys = oModel.getProperty('/myHobby')

                debugger;
                let oTable1 = this.getView().byId('table3');
                let oColumnListItem = oTable3.getSelectedItem();
                let nIndex = oTable1.indexOfItem( oColumnListItem );

                if (nIndex >= 0) {
                   
                    arrHobbys.splice(nIndex, 1);
                }

                oModel.refresh();
			}
		});
	});