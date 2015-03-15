$(document).ready(function(){


	$(function () {
		var app = app || {};
		app.models = {};
		app.viewmodels = {};
		var paperItemsSubscribed ='';
		var newspaperLists = "";
		//logger.log("s:::::::"+ko.toJS(paperItemsSubscribed));



		app.models.newspaperModel = function(newspaperItem){
			var self= this;
			//self.newspaperid = ko.observable(newspaperItem.newspaperid ? newspaperItem.newspaperid :"");
			self.newspapertitle = ko.observable(newspaperItem.newspapertitle ? newspaperItem.newspapertitle :"");
			self.newspaperlanguage = ko.observable(newspaperItem.newspaperlanguage ? newspaperItem.newspaperlanguage :"");
			self.monthlyoffer = ko.observable(newspaperItem.monthlyoffer ? newspaperItem.monthlyoffer :"");			
			self.quaterlyoffer = ko.observable(newspaperItem.quaterlyoffer ? newspaperItem.quaterlyoffer :"");
			self.halfyearlyoffer = ko.observable(newspaperItem.halfyearlyoffer ? newspaperItem.halfyearlyoffer :"");
			self.yearlyoffer = ko.observable(newspaperItem.yearlyoffer ? newspaperItem.yearlyoffer :"");
			self.onSubscribeNewsPaper = function(){
				logger.log("subscribe submit");

				var data = JSON.stringify(
		        {
		            newspapertitle : self.newspapertitle(), newspaperlanguage : self.newspaperlanguage(), monthlyoffer:self.monthlyoffer(), 
		            quaterlyoffer: self.quaterlyoffer(), halfyearlyoffer : self.halfyearlyoffer(), yearlyoffer: self.yearlyoffer()

		        });
		        logger.log(data);
		        app.post.postSearchPaperList(data);
		        

			};
		};

		app.models.paperModel = function(paperItem){
			//paperItem = ko.toJS(paperItemsSubscribed) || "";
			var self = this;
			//self.id = ko.observable(paperItem.id ? paperItem.id : "");
			self.papertitle = ko.observable(paperItem.papertitle ? paperItem.papertitle : "");
			self.startdt = ko.observable(paperItem.startdt ? paperItem.startdt : "");
			self.enddt = ko.observable(paperItem.enddt ? paperItem.enddt : "");
			self.plan = ko.observable(paperItem.plan ? paperItem.plan : "");
			self.paymentmode = ko.observable(paperItem.paymentmode ? paperItem.paymentmode : "");
			self.paperstatus = ko.observable(paperItem.paperstatus ? paperItem.paperstatus : "");
			self.paperstatusclass = ko.computed(function(){
										var cssclass="";
										if(self.paperstatus() == "Active"){
											cssclass = "success";
										}
										else if(self.paperstatus() == "Pending"){
											cssclass = "warning";
										}
										else if(self.paperstatus() == "Expired"){
											cssclass = "error";
										}
										else{
											cssclass = "info";
										}
										return cssclass;
									});
		};

		app.viewmodels.newspaperViewModel = function(){
			var self= this;
			self.newspaperList = ko.observableArray(
									ko.utils.arrayMap(newspaperLists,function(newspaperitem){
										//logger.log(newspaperitem);
										return new app.models.newspaperModel(newspaperitem);
									})
								);
		};

		app.viewmodels.paperViewModel = function(){
			var self = this;
			self.paperList = ko.observableArray(
								ko.utils.arrayMap(paperItemsSubscribed, function(paperItem){
									//logger.log(paperItem);
									return new app.models.paperModel(paperItem);
								})
							 );
		};

		app.servicelayer = (function($){

			function _getData(url, callbackFun){

				$.get( url,  function( data ) {
				    
				 		 logger.log( "Load was performed." + data);
				 		
				 		 callbackFun(data);
					}, "json")
					.done(function() {
				    	//logger.log( "second success" );
				 	})
				 	.fail(function() {
				    	logger.log( "error" );
				 	})
				 	.always(function() {
				    	//logger.log( "finished" );
				  });
			};

			function _postData(url, data, callbackFun){
				
				$.post(url, data, function(response)
				{
				    // on success callback
				   logger.log(response);
				    callbackFun(response);
				})
			};

			return{
				getData: _getData,
				postData: _postData
			}
		})($);

		app.utilities = (function($, ko){
			function _applyTemplate(vmInst, ele){
				var jqElement = $(ele)[0];
				if(typeof jqElement !== "undefined"){
					ko.cleanNode(jqElement);
					ko.applyBindings(vmInst, jqElement);
				}
				else{
					ko.applyBindings(vmInst);
				}
			};


			return{
				applyTemplate: _applyTemplate,
			}

		})($, ko);
		app.post = (function($){
			function _postSearchPaperList(data){
				var url="../nwspaper/newspaperSubscribeListed.json"
				app.servicelayer.postData(url, data, app.fetch.postSearchSubscribeList);
					
			};

			return{
				postSearchPaperList: _postSearchPaperList
			}

		})($);

		app.fetch = (function($){
			function _getHomePaperList(data){
				paperItemsSubscribed = data;
				//paperItemsSubscribed = ko.utils.parseJson(paperItemsSubscribed);
		
				var paperInstance = new app.viewmodels.paperViewModel();
				app.utilities.applyTemplate(paperInstance, "#home");

			};
			function _getSearchPaperList(data){
				newspaperLists = data;
				//newspaperLists = ko.utils.parseJson(newspaperLists);
				var newspaperListsInstance = new app.viewmodels.newspaperViewModel();
				app.utilities.applyTemplate(newspaperListsInstance, "#searchcard");

			};
			function _postSearchSubscribeList(returnedData){
				logger.log("posted search paper list"+returnedData);
				
				    // This callback is executed if the post was successful 
				    // self.responseJSON(returnedData);   
				//app.servicelayer.postData("../nwspaper/newspaperItemsSubscribed", app.fetch.postSearchPaperList);
			};

			return{
				getHomePaperList: _getHomePaperList,
				getSearchPaperList: _getSearchPaperList,
				postSearchSubscribeList: _postSearchSubscribeList
			}
		})($);

		app.run = (function($, app){

			function _init(){
					app.servicelayer.getData("../nwspaper/paperItemsSubscribed.json", app.fetch.getHomePaperList);
					app.servicelayer.getData("../nwspaper/newspaperItemsListed.json", app.fetch.getSearchPaperList);
					
			
			};

			return{
				init: _init
			}

		})($, app);

		var logger = (function (_window) {

		    function _log(msg) {

		        _window.console.log(msg);
		    };

		    return {
		        log: _log
		    };

		})(window);

		app.run.init();
		logger.log("end::::::");
	});
});

